// Source: PrepAssist.html L7565-L7572 (VIEWS.legal), L7627-L7628 (A.lgGo, A.legalSwap)
// Source: PrepAssist.html L3633-L3668 (.lg-*)
// Computed from reference/android/view-legal-terms, view-legal-privacy, view-legal-terms-from-auth.
// Vertical margins collapse the CSS way: p/ul/ol end with 12, h2 with 10, h4 has 4 above and below,
// so the gap between two blocks is the larger of the two (h4's 4 above is always absorbed).
// Not ported (blocked, see actions/account.ts): A.lgGo's smooth scroll to a section and A.legalSwap's
// scrollTop = 0 need the page scroller, which belongs to the shell and is not exposed.
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import { LEGAL } from '../../data/legal';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { font, Txt } from '../../theme';
import { parseLegal } from './legalParse';
import type { Block, Run } from './legalParse';
import { ME } from './mePage';

const pad2 = (i: number): string => String(i + 1).padStart(2, '0');

function Runs({
  runs,
  bold,
}: {
  runs: Run[];
  bold: object;
}): React.JSX.Element {
  return (
    <>
      {runs.map((r, i) =>
        r.b ? (
          <Txt key={i} style={bold}>
            {r.text}
          </Txt>
        ) : (
          r.text
        ),
      )}
    </>
  );
}

function BlockView({ b }: { b: Block }): React.JSX.Element {
  if (b.t === 'p') {
    return (
      <Txt style={s.p}>
        <Runs runs={b.runs} bold={s.pb} />
      </Txt>
    );
  }
  if (b.t === 'h4') return <Txt style={s.h4}>{b.text}</Txt>;
  if (b.t === 'lg-dl') {
    return (
      <View style={s.list}>
        {b.items.map((it, i) => (
          <View key={i} style={[s.dl, i > 0 && s.dlNext]}>
            {it[0]?.b ? <Txt style={s.dlB}>{it[0].text}</Txt> : null}
            <Txt style={s.dlT}>
              <Runs
                runs={
                  it[0]?.b
                    ? it
                        .slice(1)
                        .map((r, k) =>
                          k === 0
                            ? { ...r, text: r.text.replace(/^ /, '') }
                            : r,
                        )
                    : it
                }
                bold={s.pb}
              />
            </Txt>
          </View>
        ))}
      </View>
    );
  }
  const ol = b.t === 'lg-ol';
  return (
    <View style={s.list}>
      {b.items.map((it, i) => (
        <View key={i} style={[s.li, ol && s.liOl]}>
          {ol ? (
            <View style={s.olN}>
              <Txt style={s.olNT}>{String(i + 1)}</Txt>
            </View>
          ) : (
            <View style={s.ulDot} />
          )}
          <Txt style={s.liT}>
            <Runs runs={it} bold={s.pb} />
          </Txt>
        </View>
      ))}
    </View>
  );
}

function LegalScreen({ arg }: ViewProps): React.JSX.Element | null {
  const k = arg === 'privacy' || arg === 'terms' ? arg : null;
  if (!k) return null;
  const D = LEGAL[k];
  return (
    <View style={ME.page}>
      <View style={s.hero}>
        <View style={s.ic}>
          <Icon
            name={k === 'privacy' ? 'shield' : 'doc'}
            size={22}
            color="#fff"
          />
        </View>
        <Txt style={s.eb}>Legal · PrepAssist Technologies</Txt>
        <Txt style={s.h1}>{D.title}</Txt>
        <Txt
          style={s.heroP}
        >{`Effective ${D.eff} · ${D.secs.length} sections · about ${D.min} min`}</Txt>
      </View>
      <View style={s.tldr}>
        <View style={s.tldrH}>
          <Icon name="spark" size={14} color="#C47406" />
          <Txt style={[ME.h6, s.tldrHT]}>In plain words</Txt>
        </View>
        <View style={s.tldrUl}>
          {D.tldr.map(x => (
            <View key={x} style={s.tldrLi}>
              <View style={s.tldrDot} />
              <Txt style={s.tldrT}>{x}</Txt>
            </View>
          ))}
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.toc}
        contentContainerStyle={s.tocIn}
      >
        {D.secs.map((sec, i) => (
          <Pressable
            key={i}
            style={s.tocB}
            onPress={() => act('lgGo:' + i)}
            testID={`legal.toc.${i}`}
          >
            <View style={s.tocEm}>
              <Txt style={s.tocEmT}>{pad2(i)}</Txt>
            </View>
            <Txt style={s.tocT}>{sec[0]}</Txt>
          </Pressable>
        ))}
      </ScrollView>
      {D.secs.map((sec, i) => (
        <View key={i} style={s.sec}>
          <Txt style={s.n}>{pad2(i)}</Txt>
          <Txt style={s.h2}>{sec[0]}</Txt>
          {parseLegal(sec[1]).map((b, j) => (
            <BlockView key={j} b={b} />
          ))}
        </View>
      ))}
      <View style={s.help}>
        <View style={s.helpIc}>
          <Icon name="help" color="#FFD27A" />
        </View>
        <View style={s.helpBody}>
          <Txt style={s.helpB}>Still have questions?</Txt>
          <Txt style={s.helpS}>Our team replies within a day.</Txt>
        </View>
        <Pressable
          style={s.helpBtn}
          onPress={() => act('toast:Support chat would open here')}
          testID="legal.contact"
        >
          <Txt style={s.helpBtnT}>Contact</Txt>
        </Pressable>
      </View>
      <Txt style={s.other}>
        {'Also read: '}
        <Txt
          style={s.otherA}
          onPress={() =>
            act('legalSwap:' + (k === 'privacy' ? 'terms' : 'privacy'))
          }
        >
          {k === 'privacy' ? 'Terms & Conditions' : 'Privacy Policy'}
        </Txt>
      </Txt>
    </View>
  );
}

const s = StyleSheet.create({
  hero: { paddingTop: 6, paddingBottom: 4 },
  ic: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(145deg, #3B5BCC, #1B8AD3)',
    boxShadow: '0px 12px 22px -12px rgba(59, 91, 204, 0.9)',
  },
  eb: {
    ...font('sans', 800),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 1.47,
    textTransform: 'uppercase',
    color: '#3B5BCC',
    marginTop: 16,
  },
  h1: {
    ...font('book', 500),
    fontSize: 34,
    lineHeight: 35.7,
    letterSpacing: -0.34,
    color: '#14161C',
    marginTop: 6,
  },
  heroP: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 8 },
  tldr: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    backgroundImage: 'linear-gradient(135deg, #FFF8EC, #FFF2DA)',
    boxShadow: 'inset 0px 0px 0px 1px #F6E2C2',
  },
  tldrH: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tldrHT: { color: '#C47406' },
  tldrUl: { marginTop: 8 },
  tldrLi: { paddingVertical: 5, paddingLeft: 20 },
  tldrDot: {
    position: 'absolute',
    left: 4,
    top: 12,
    width: 7,
    height: 7,
    borderRadius: 2,
    backgroundColor: '#F5A01F',
    transform: [{ rotate: '45deg' }],
  },
  tldrT: { fontSize: 13.5, lineHeight: 19.575, color: '#4A3B20' },
  toc: { marginTop: 16, marginHorizontal: -20, marginBottom: 4 },
  tocIn: { gap: 6, paddingTop: 2, paddingHorizontal: 20, paddingBottom: 6 },
  tocB: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 32,
    paddingLeft: 6,
    paddingRight: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E1E8F0',
  },
  tocEm: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#EEF2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tocEmT: {
    ...font('sans', 800),
    fontSize: 9.5,
    lineHeight: 13.775,
    color: '#3B5BCC',
  },
  tocT: {
    ...font('sans', 600),
    fontSize: 12.5,
    lineHeight: 18.125,
    color: '#3A404B',
  },
  sec: {
    marginTop: 14,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 8,
    borderRadius: 18,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  n: {
    position: 'absolute',
    right: 16,
    top: 12,
    ...font('book', 600),
    fontSize: 40,
    lineHeight: 40,
    color: '#EEF2F7',
  },
  h2: {
    ...font('book', 500),
    fontSize: 22,
    lineHeight: 25.3,
    color: '#14161C',
    marginBottom: 10,
    paddingRight: 44,
  },
  p: { fontSize: 14.5, lineHeight: 23.925, color: '#3A404B', marginBottom: 12 },
  pb: { ...font('sans', 700), color: '#14161C' },
  h4: {
    ...font('sans', 800),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14161C',
    marginBottom: 4,
  },
  list: { marginBottom: 12 },
  li: { paddingVertical: 7, paddingLeft: 24 },
  liOl: { paddingLeft: 32 },
  liT: { fontSize: 14.5, lineHeight: 22.475, color: '#3A404B' },
  ulDot: {
    position: 'absolute',
    left: 6,
    top: 15,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1B8AD3',
  },
  olN: {
    position: 'absolute',
    left: 0,
    top: 7,
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: '#EAF4FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  olNT: {
    ...font('sans', 800),
    fontSize: 11.5,
    lineHeight: 17.825,
    color: '#1B6FB3',
  },
  dl: { paddingVertical: 10 },
  dlNext: { borderTopWidth: 1, borderTopColor: '#F1F4F8' },
  dlB: {
    ...font('sans', 800),
    fontSize: 12.5,
    lineHeight: 18.75,
    color: '#14161C',
    marginBottom: 2,
  },
  dlT: { fontSize: 13.5, lineHeight: 20.25, color: '#4A505B' },
  help: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#14304F',
  },
  helpIc: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpBody: { flex: 1 },
  helpB: {
    ...font('sans', 700),
    fontSize: 14.5,
    lineHeight: 21.025,
    color: '#fff',
  },
  helpS: { fontSize: 12.5, lineHeight: 22.475, color: '#fff', opacity: 0.75 },
  helpBtn: {
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 11,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  helpBtnT: {
    ...font('sans', 700),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14304F',
  },
  other: {
    fontSize: 12.5,
    lineHeight: 18.125,
    color: '#7A8494',
    textAlign: 'center',
    marginTop: 18,
  },
  otherA: {
    ...font('sans', 600),
    color: '#1B8AD3',
    textDecorationLine: 'underline',
  },
});

const view: ViewDef = {
  useTitle: arg =>
    arg === 'privacy' || arg === 'terms' ? LEGAL[arg].title : '',
  Screen: LegalScreen,
};

export default view;
