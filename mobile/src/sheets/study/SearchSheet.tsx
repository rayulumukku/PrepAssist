// Source: PrepAssist.html L6937-L6951 (cmdk), L2831-L2833 (.cmd-in, .cmd-in input, .cmd-grp), L3013 (.cmd-in border --brand), L2724 (.empty)
// The Search sheet. Computed (reference/android/sheet-search-empty-query, -results, -no-result):
//   .cmd-in   row, centred, gap 10; height 48; padding 0 14; radius 12; 1px --brand on --sheet; margin-bottom 8;
//             search icon 20 --ink; input flex 1, Inter 15.5/22.475, placeholder rgb(117,117,117)
//   .cmd-grp  (shared CmdGrp) margin 16 0 0
//   rows      shared SheetListItem (.sh-list .it): no chevron in this sheet
//   p.empty   padding 40 20, centred, Inter Tight 400 (Medium face) 15.5/22.475, --muted, upright (computed)
// The input is focused 350 ms after opening, like the HTML (setTimeout(() => inp.focus(), 350)).
// The sheet's `arg`, when given, is the input's starting value: only the test deep link
// prepassist://sheet/search/<text> passes one (the HTML's cmdk() always opens empty).
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import type { TextInputInstance } from 'react-native';
import { act } from '../../actions';
import { CmdGrp, Icon, SheetFrame, SheetList, SheetListItem } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import type { SheetProps } from '../../navigation/routes';
import { font, fontPx, palettes, Txt, useTheme } from '../../theme';
import { isEmpty, search } from './search/searchLogic';

const C = palettes.free;

const s = StyleSheet.create({
  cmdIn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: C.sheet,
    marginBottom: 8,
  },
  input: { flex: 1, ...font('sans', 400), fontSize: fontPx(15.5), lineHeight: 22.475, color: C.ink, padding: 0, height: 22.475 },
  empty: { paddingVertical: 40, paddingHorizontal: 20, textAlign: 'center', ...font('serif', 400), fontSize: 15.5, lineHeight: 22.475, color: C.muted },
});

function SearchSheet({ arg }: SheetProps): React.JSX.Element {
  const t = useTheme();
  const [q, setQ] = useState(arg ?? '');
  const ref = useRef<TextInputInstance>(null);
  useEffect(() => {
    const id = setTimeout(() => ref.current?.focus(), 350);
    return () => clearTimeout(id);
  }, []);
  const r = search(q);
  return (
    <SheetFrame title="Search" testID="sheet.search">
      <View style={[s.cmdIn, { borderColor: t.brand }]}>
        <Icon name="search" />
        <TextInput
          ref={ref}
          style={s.input}
          allowFontScaling={false}
          value={q}
          onChangeText={setQ}
          placeholder="Tools, topics, notes, articles…"
          placeholderTextColor="#757575"
          autoComplete="off"
          autoCorrect={false}
          testID="sheet.search.input"
        />
      </View>
      <View>
        {r.tools.length ? (
          <>
            <CmdGrp>Tools</CmdGrp>
            <SheetList>
              {r.tools.map(x => (
                <SheetListItem key={x.id} icon={x.ic as IconName} title={x.n} subtitle={x.d} onPress={() => act(`tool:${x.id}`)} />
              ))}
            </SheetList>
          </>
        ) : null}
        {r.topics.length ? (
          <>
            <CmdGrp>{'Topics & notes'}</CmdGrp>
            <SheetList>
              {r.topics.map(x => (
                <SheetListItem key={x[0]} icon="learn" title={x[0]} subtitle={x[1]} onPress={() => act(x[2])} />
              ))}
            </SheetList>
          </>
        ) : null}
        {r.arts.length ? (
          <>
            <CmdGrp>Current affairs</CmdGrp>
            <SheetList>
              {r.arts.map(a => (
                <SheetListItem key={a.id} icon="current" title={a.t} subtitle={`${a.src} · ${a.gs}`} onPress={() => act(`article:${a.id}`)} />
              ))}
            </SheetList>
          </>
        ) : null}
        {isEmpty(r) ? <Txt style={s.empty}>{`Nothing found. Try “AI Mentor ${r.v}”.`}</Txt> : null}
      </View>
    </SheetFrame>
  );
}

export default SearchSheet;
