// Source: PrepAssist.html L10567-L10570 (optSheet)
// Source: PrepAssist.html L10217-L10220 + L10323-L10325 (.n2-opts, .n2-cust), L10195-L10196 (.n2-lab), L10202 (.n2-in)
// Computed (reference/android/sheet-tracker-optional):
//   p.n2-shp   13 / 19.5 #6B7380, margin 0 0 12
//   .n2-opts   gap 8; buttons 50 high padding 0 16 radius 14 white inset ring #E1E5EC, 15px 500, space-between;
//              .on inset 1.5px #14304F on #EEF3F9, 700, check 17 #14304F
//   .n2-lab    margin-top 18 (inline style), "Custom subject"
//   .n2-cust   row gap 8: input .n2-in; button 48 box radius 14 #14161C, plus 18 white
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, SheetFrame } from '../../components';
import type { SheetProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { N2In, N2Lab } from './trackerParts';

function TrackerOptionalSheet(_: SheetProps): React.JSX.Element {
  const OPTIONALS = useStore(s => s.OPTIONALS);
  const optional = useStore(s => s.optional);
  const [v, setV] = useState('');
  return (
    <SheetFrame title="Optional Subject" testID="trackerOptional" scrollProps={{ keyboardShouldPersistTaps: 'handled' }}>
      <Txt style={s.shp}>One optional subject can be tracked at a time.</Txt>
      <View style={s.opts}>
        {OPTIONALS.map(o => {
          const on = optional === o;
          return (
            <Pressable key={o} style={[s.o, on && s.oOn]} onPress={() => act('ntOptSet', o)} testID={`trackerOptional.${o}`}>
              <Txt style={[s.oTx, on && s.oTxOn]}>{o}</Txt>
              {on ? <Icon name="check" size={17} color="#14304F" /> : null}
            </Pressable>
          );
        })}
      </View>
      <N2Lab label="Custom subject" style={s.lab} />
      <View style={s.cust}>
        <N2In
          style={s.in}
          placeholder="e.g. Medical Science"
          value={v}
          onChangeText={setV}
          onSubmitEditing={() => act('ntOptCus', undefined, { value: v })}
          testID="trackerOptional.custom"
        />
        <Pressable style={s.add} onPress={() => act('ntOptCus', undefined, { value: v })} accessibilityLabel="Add" testID="trackerOptional.add">
          <Icon name="plus" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  shp: { fontSize: 13, lineHeight: 19.5, color: '#6B7380', marginBottom: 12 },
  opts: { gap: 8 },
  o: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 50, paddingHorizontal: 16, borderRadius: 14, backgroundColor: '#FFFFFF', boxShadow: 'inset 0px 0px 0px 1px #E1E5EC' },
  oOn: { backgroundColor: '#EEF3F9', boxShadow: 'inset 0px 0px 0px 1.5px #14304F' },
  oTx: { ...font('sans', 500), fontSize: 15, lineHeight: 21.75 },
  oTxOn: font('sans', 700),
  lab: { marginTop: 18 },
  cust: { flexDirection: 'row', gap: 8 },
  in: { flex: 1 },
  add: { width: 48, height: 48, borderRadius: 14, flexShrink: 0, backgroundColor: '#14161C', alignItems: 'center', justifyContent: 'center' },
});

export default TrackerOptionalSheet;
