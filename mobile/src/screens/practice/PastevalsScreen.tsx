// Source: PrepAssist.html L6626-L6630 (VIEWS.pastevals)
// Source: PrepAssist.html L2615-L2620 (.pe), L2986 (.pe .sc weight)
// Computed (reference/android view-pastevals):
//   h1 span   EB Garamond 500 18px --muted (inline in the 28px heading)
//   .pe       row, centred, gap 14, padding 12 0, border-bottom --rule (inline border-color)
//   .sc       52 round, 1px --rule-2 (inline), #fff, centred; Inter Tight 700 16.5px --muted… the number
//             text; small Inter Tight 700 10.5px, letter-spacing -0.495px, --muted
//   b         Inter 500 14.5px / 21.025px, block; span inline (line box 22.475) 11.5px --muted
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import { PASTEVALS } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { font, palettes, Txt } from '../../theme';
import { PgHero, Sec } from './parts/PgHero';

const C = palettes.free;
const s = StyleSheet.create({
  pe: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.rule },
  sc: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: C.rule2, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  scT: { ...font('serif', 700), fontSize: 16.5, lineHeight: 23.925, letterSpacing: -0.495, color: C.muted },
  scS: { fontSize: 10.5 },
  mid: { flex: 1 },
  b: { ...font('sans', 500), fontSize: 14.5, lineHeight: 21.025 },
  sp: { fontSize: 11.5, lineHeight: 22.475, color: C.muted },
  h1S: { fontSize: 18, color: C.muted },
});

function PastevalsScreen(): React.JSX.Element {
  return (
    <>
      <PgHero
        title={
          <>
            8.1 <Txt style={s.h1S}>/ 15 average</Txt>
          </>
        }
        sub="12 answers evaluated. Structure has improved; content depth is the next lever."
      />
      <Sec>
        {PASTEVALS.map((e, i) => (
          <Pressable key={e.t} style={s.pe} onPress={() => act(i === 0 ? 'push:mainsResult' : 'toast:Evaluation report would open here')}>
            <View style={s.sc}>
              <Txt style={s.scT}>
                {e.s}
                <Txt style={s.scS}>/{e.of}</Txt>
              </Txt>
            </View>
            <View style={s.mid}>
              <Txt style={s.b}>{e.t}</Txt>
              <Txt style={s.sp}>
                {e.p} · {e.d}
              </Txt>
            </View>
            <Icon name="chev" color={C.ink} />
          </Pressable>
        ))}
      </Sec>
    </>
  );
}

const view: ViewDef = {
  useTitle: () => 'Past evaluations',
  Screen: PastevalsScreen,
};

export default view;
