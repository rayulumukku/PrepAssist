// Source: PrepAssist.html L31-L31 (*{margin:0;padding:0}), L9893-L9896 (x4Para), L9926-L9926 (<p>${x4Para(p, sc)}</p>)
// Renders the limited HTML inside the DATA strings, and the X-Ray markup, as native text.
// The grammar, the "unknown markup stays literal text" rule and the tree are in richTextCore.ts.
//
// It carries NO look of its own. The same <p>/<ul>/<b> is styled differently by every screen's CSS
// (.lg-sec L3651-L3659, .n2-ub L10135-L10141, .msg-a L2855-L2857, .nr-tx L4631-L4635, .fc-a b L2411),
// so every size, colour and margin comes from the `styles` map of the caller. What it does own is
// what the browser does for any of them:
//   - a block (p, h4, h5, li, ul, ol) is a View, blocks stack vertically; the inline content of a
//     block is ONE <Txt> with nested <Txt> for b / i / spans, so it wraps like inline HTML;
//   - text styles inherit downwards (base -> li -> p), view styles do not. lineHeight is in px here,
//     so an element with its own fontSize restates it (CSS `line-height:1.55` follows the font size);
//   - vertical margins collapse the CSS way (collapseMargins in richTextCore.ts). The root keeps the
//     margins of its first and last block inside, like a container with padding;
//   - b and i switch the FONT FACE: `styles.b` / `styles.i` (e.g. font('read', 700)); without them
//     font('sans', 700) (the browser's b = bolder) and font('sans', 400, true). The inner one wins
//     when they nest: no data string nests them;
//   - <br> is a line break inside the running text;
//   - a list item draws its marker. Default: the browser's `outside` marker, hanging left of the
//     item's box (so with the reset's padding 0 it is outside the list, as in the HTML; give the ul
//     a paddingLeft to make room). `styles.marker` is split: box properties go to a View, text
//     properties to the marker text. A marker style with left / right / position replaces the
//     default placement, and `bullet=""` draws the box alone: that is how a `li::before` dot is ported.
//
// Example 1, LEGAL.terms.secs[i][1] (data/legal.ts) inside `.lg-sec`, L3651-L3659:
//   <RichText
//     html={LEGAL.terms.secs[3][1]}       // '<p>You agree not to use the Service:</p><ol class="lg-ol"><li>…'
//     bullet={(k, ordered) => (ordered ? String(k + 1) : '')}
//     styles={{
//       base: { fontSize: 14.5, lineHeight: 23.925, color: '#3A404B' },
//       b: { ...font('sans', 700), color: '#14161C' },
//       p: { marginBottom: 12 },
//       ul: { marginBottom: 12 }, ol: { marginBottom: 12 },
//       li: { paddingVertical: 7, paddingLeft: 24, lineHeight: 22.475 },
//       marker: { left: 6, top: 15, width: 6, height: 6, borderRadius: 3, backgroundColor: '#1B8AD3' },
//       olLi: { paddingLeft: 32 },
//       olMarker: { left: 0, top: 7, width: 22, height: 22, borderRadius: 7, backgroundColor: '#EAF4FC',
//                   alignItems: 'center', justifyContent: 'center', ...font('sans', 800), fontSize: 11.5, lineHeight: 17.825, color: '#1B6FB3' },
//     }}
//   />
// Example 2, XSC[0].paras[0] (data/xray.ts), the reader paragraph of L9926:
//   <RichText
//     xray={XSC[0].paras[0]}              // '[[0|India’s long-standing negotiations … ({{BITs}}) …]] …'
//     styles={{ base: readerText, p: { marginBottom: 14 }, insight: mark, term: termLink }}
//     activeInsight={cur} insightActiveStyle={markCur}
//     insightStyle={n => (seen[n] ? markSeen : undefined)}
//     renderPin={(n, active) => <Pin n={n + 1} active={active} seen={seen[n]} />}
//     onInsight={n => act('x4Ins', n)} onTerm={term => act('x4Term', term)}
//   />
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import { font } from '../theme/fonts';
import { metrics } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { collapseMargins, isTextBlock, parseRichText, parseXray } from './richTextCore';
import type { BlockNode, FlowBox, InlineNode } from './richTextCore';

type BlockStyle = ViewStyle & TextStyle;

/** Per-use style map: the same markup is styled differently by each screen's CSS. */
export interface RichTextStyles {
  /** The container's text style (font, size, lineHeight, colour). */
  base?: TextStyle;
  b?: TextStyle;
  i?: TextStyle;
  /** Paragraph block: margins + text overrides. In X-Ray mode the paragraph itself. */
  p?: BlockStyle;
  h4?: BlockStyle;
  h5?: BlockStyle;
  ul?: ViewStyle;
  ol?: ViewStyle;
  li?: BlockStyle;
  /** The bullet / number of an li: box properties place and shape it, text properties style its text. */
  marker?: TextStyle;
  /** Merged over `li` / `marker` for the items of an ol (`.lg-ol li` L3658-L3659 next to `.lg-ul li` L3655-L3656). */
  olLi?: BlockStyle;
  olMarker?: TextStyle;
  /** X-Ray `[[n|text]]`. */
  insight?: TextStyle;
  /** X-Ray `{{term}}`. */
  term?: TextStyle;
  /**
   * `:first-child` rules, merged over the element's style when it is the first element of its parent
   * (`.n2-ub h5:first-child{margin-top:0}` L10140, `.lg-dl li:first-child{border-top:0}` L3661).
   */
  first?: { p?: BlockStyle; h4?: BlockStyle; h5?: BlockStyle; ul?: ViewStyle; ol?: ViewStyle; li?: BlockStyle };
}

export interface RichTextProps {
  /** A data string with the HTML subset. */
  html?: string;
  /**
   * OR one paragraph in the X-Ray grammar (XSC[*].paras[*]); wins over `html` when both are given.
   * Plain text plus `[[n|text]]` and `{{term}}` only: it does not contain the HTML subset.
   */
  xray?: string;
  styles?: RichTextStyles;
  /** Press on `[[n|text]]`; n is the zero-based index into the scan's `ins`. */
  onInsight?: (n: number) => void;
  /** Press on `{{term}}`. */
  onTerm?: (term: string) => void;
  activeInsight?: number;
  insightActiveStyle?: TextStyle;
  /** Extra style of one insight span by its state (`.x4-i.seen` L9504), applied before the active style. */
  insightStyle?: (n: number) => TextStyle | undefined;
  /** Inline element in front of an insight's text: the `<b class="x4-pin">{n+1}</b>` of x4Para (L9894). */
  renderPin?: (n: number, active: boolean) => React.ReactNode;
  /** Draws an svg node; `index` counts the svg nodes of the string. Without it an svg node draws nothing. */
  renderSvg?: (markup: string, index: number) => React.ReactNode;
  /**
   * Takes over one block element (never a `run` or an svg node). Return undefined for the default.
   * For markup whose CSS no style map can express, e.g. `ul.lg-dl` whose <b> is display:block (L3662).
   * The returned element carries its own margins; they do not take part in margin collapsing.
   */
  renderBlock?: (node: BlockNode) => React.ReactNode | undefined;
  /**
   * List marker text. A string is the marker of ul items (default the disc U+2022; ol items keep
   * "1."). A function gives the marker of every item from its zero-based position.
   */
  bullet?: string | ((index: number, ordered: boolean) => string);
  testID?: string;
}

const DEFAULT_B = font('sans', 700);
const DEFAULT_I = font('sans', 400, true);
const DISC = '•';

const TEXT_KEYS: ReadonlySet<string> = new Set([
  'color',
  'fontFamily',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'fontVariant',
  'letterSpacing',
  'lineHeight',
  'textAlign',
  'textAlignVertical',
  'textDecorationLine',
  'textDecorationStyle',
  'textDecorationColor',
  'textShadowColor',
  'textShadowOffset',
  'textShadowRadius',
  'textTransform',
  'includeFontPadding',
  'writingDirection',
]);

interface Split {
  view: ViewStyle;
  text: TextStyle;
}

/** Splits a block style into what the View takes (box) and what its text takes. */
function split(...parts: (BlockStyle | undefined)[]): Split {
  const view: Record<string, unknown> = {};
  const text: Record<string, unknown> = {};
  for (const part of parts) {
    if (!part) continue;
    for (const [k, v] of Object.entries(part)) (TEXT_KEYS.has(k) ? text : view)[k] = v;
  }
  return { view: view as ViewStyle, text: text as TextStyle };
}

const px = (v: unknown): number | undefined => (typeof v === 'number' ? v : undefined);
const present = (v: unknown): boolean => (typeof v === 'number' ? v > 0 : v != null);

function boxOf(v: ViewStyle, children: FlowBox[]): FlowBox {
  return {
    marginTop: px(v.marginTop) ?? px(v.marginVertical) ?? px(v.margin) ?? 0,
    marginBottom: px(v.marginBottom) ?? px(v.marginVertical) ?? px(v.margin) ?? 0,
    sealedTop: present(v.paddingTop ?? v.paddingVertical ?? v.padding) || present(v.borderTopWidth ?? v.borderWidth),
    sealedBottom: present(v.paddingBottom ?? v.paddingVertical ?? v.padding) || present(v.borderBottomWidth ?? v.borderWidth),
    children,
  };
}

const opaqueBox = (): FlowBox => ({ marginTop: 0, marginBottom: 0, sealedTop: true, sealedBottom: true, children: [] });

/** A block with its resolved style, before drawing: the margins are collapsed over this tree. */
interface Planned {
  node: BlockNode;
  box: FlowBox;
  view: ViewStyle;
  text: TextStyle;
  children: Planned[];
  /** Position among the li of its list, zero-based. */
  item: number;
  ordered: boolean;
  /** Set when renderBlock or renderSvg drew it. */
  custom?: React.ReactNode;
}

const local = StyleSheet.create({
  // list-style-position: outside. The marker box ends at the left edge of the item.
  hang: { position: 'absolute', right: '100%', top: 0 },
  placed: { position: 'absolute' },
});

export function RichText({
  html,
  xray,
  styles,
  onInsight,
  onTerm,
  activeInsight,
  insightActiveStyle,
  insightStyle,
  renderPin,
  renderSvg,
  renderBlock,
  bullet,
  testID,
}: RichTextProps): React.JSX.Element {
  const doc = useMemo(() => (xray !== undefined ? parseXray(xray) : parseRichText(html ?? '')), [html, xray]);
  const s = styles ?? {};
  let svgCount = 0;

  const plan = (nodes: readonly BlockNode[], ordered: boolean): Planned[] => {
    let element = 0;
    let item = 0;
    return nodes.map((node): Planned => {
      const leaf = { node, view: {}, text: {}, children: [], item: 0, ordered };
      if (node.type === 'run') return { ...leaf, box: boxOf({}, []) };
      const first = element++ === 0;
      if (node.type === 'svg') return { ...leaf, box: opaqueBox(), custom: renderSvg?.(node.markup, svgCount++) ?? null };
      const custom = renderBlock?.(node);
      if (custom !== undefined) return { ...leaf, box: opaqueBox(), custom };
      const { view, text } = split(s[node.type], node.type === 'li' && ordered ? s.olLi : undefined, first ? s.first?.[node.type] : undefined);
      const isList = node.type === 'ul' || node.type === 'ol';
      const children = isList || node.type === 'li' ? plan(node.children, node.type === 'ol') : [];
      return { node, view, text, children, item: node.type === 'li' ? item++ : 0, ordered, box: boxOf(view, children.map(c => c.box)) };
    });
  };

  const inline = (nodes: readonly InlineNode[], path: string): React.ReactNode[] =>
    nodes.map((n, k) => {
      const key = `${path}.${k}`;
      switch (n.type) {
        case 'text':
          return n.text;
        case 'br':
          return '\n';
        case 'b':
          return (
            <Txt key={key} style={s.b ?? DEFAULT_B}>
              {inline(n.children, key)}
            </Txt>
          );
        case 'i':
          return (
            <Txt key={key} style={s.i ?? DEFAULT_I}>
              {inline(n.children, key)}
            </Txt>
          );
        case 'insight': {
          const active = n.n === activeInsight;
          return (
            <Txt
              key={key}
              style={[s.insight, insightStyle?.(n.n), active ? insightActiveStyle : undefined]}
              onPress={onInsight ? () => onInsight(n.n) : undefined}
              testID={testID ? `${testID}.insight.${n.n}` : undefined}>
              {renderPin ? <React.Fragment key="pin">{renderPin(n.n, active)}</React.Fragment> : null}
              {inline(n.children, key)}
            </Txt>
          );
        }
        case 'term':
          return (
            <Txt
              key={key}
              style={s.term}
              onPress={onTerm ? () => onTerm(n.term) : undefined}
              accessibilityRole={onTerm ? 'button' : undefined}
              testID={testID ? `${testID}.term.${n.term}` : undefined}>
              {n.term}
            </Txt>
          );
      }
    });

  const marker = (p: Planned, inherited: TextStyle[]): React.ReactNode => {
    const label = typeof bullet === 'function' ? bullet(p.item, p.ordered) : p.ordered ? `${p.item + 1}.` : bullet ?? DISC;
    const m = split(s.marker, p.ordered ? s.olMarker : undefined);
    const textStyle = [...inherited, m.text];
    let place: ViewStyle[] = [local.placed, m.view];
    if (m.view.left === undefined && m.view.right === undefined && m.view.position === undefined) {
      // The browser's outside marker: "1. " ends at the item's edge, a disc sits further out.
      const size = (StyleSheet.flatten(textStyle) as TextStyle | undefined)?.fontSize ?? metrics.bodySize;
      place = [local.hang, { marginRight: size * (p.ordered ? 0.28 : 0.7) }, m.view];
    }
    return (
      <View style={place}>
        {label === '' ? null : <Txt style={textStyle}>{label}</Txt>}
      </View>
    );
  };

  const draw = (planned: Planned[], inherited: TextStyle[], path: string): React.ReactNode[] =>
    planned.map((p, k) => {
      const key = `${path}.${k}`;
      const { node } = p;
      if (p.custom !== undefined) return <React.Fragment key={key}>{p.custom}</React.Fragment>;
      if (node.type === 'svg') return null;
      if (node.type === 'run') {
        return (
          <Txt key={key} style={inherited}>
            {inline(node.children, key)}
          </Txt>
        );
      }
      const box = [p.view, { marginTop: p.box.marginTop, marginBottom: p.box.marginBottom }];
      const text = [...inherited, p.text];
      if (isTextBlock(node)) {
        return (
          <View key={key} style={box}>
            <Txt style={text}>{inline(node.children, key)}</Txt>
          </View>
        );
      }
      return (
        <View key={key} style={box}>
          {node.type === 'li' ? marker(p, text) : null}
          {draw(p.children, node.type === 'li' ? text : inherited, key)}
        </View>
      );
    });

  const planned = plan(doc, false);
  collapseMargins(planned.map(p => p.box));
  return <View testID={testID}>{draw(planned, s.base ? [s.base] : [], 'r')}</View>;
}
