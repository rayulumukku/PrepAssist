// Source: PrepAssist.html L6928-L6929 (SHEETS.subscription)
// Source: PrepAssist.html L2903-L2907 and L3034-L3035 (.pf-sub), L2732-L2738 (.ptr)
// Computed from reference/android/sheet-subscription. .pf-sub's gradient starts at var(--brand).
// Private copies of .pf-sub and .ptr (profile classes not ported by the foundation).
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Btn, SheetFrame } from '../../components';
import { font, palettes, Txt, useTheme } from '../../theme';

const C = palettes.free;
const INCL = [
  'All courses, lectures and notes',
  'Unlimited Question Bank & Test Series',
  '500 AI credits every month',
  'Cloud Data Vault · 5 GB',
];

function SubscriptionSheet(): React.JSX.Element {
  const t = useTheme();
  return (
    <SheetFrame title="Subscription" testID="sheet.subscription">
      <View
        style={[
          s.sub,
          {
            backgroundImage: `linear-gradient(120deg, ${t.brand} 0%, #1679BA 100%)`,
          },
        ]}
      >
        <View>
          <Txt style={s.small}>Current plan</Txt>
          <Txt style={s.b}>PrepAssist Pro · Annual</Txt>
          <Txt style={s.small}>₹8,999 / year · Renews 12 Mar 2027</Txt>
        </View>
      </View>
      <View style={s.ptr}>
        <Txt style={s.h6}>Included</Txt>
        <View>
          {INCL.map(x => (
            <View key={x} style={s.li}>
              <View style={s.dot} />
              <Txt style={s.liT}>{x}</Txt>
            </View>
          ))}
        </View>
      </View>
      <Btn
        variant="line"
        wide
        label="Change plan"
        onPress={() => act('toast:Plan options would open here')}
        testID="sheet.subscription.change"
      />
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  sub: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 14,
  },
  small: { fontSize: 12.5, lineHeight: 22.475, color: '#fff', opacity: 0.8 },
  b: { ...font('serif', 500), fontSize: 18, lineHeight: 26.1, color: '#fff' },
  ptr: { marginVertical: 20 },
  h6: {
    ...font('sans', 700),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 1.68,
    textTransform: 'uppercase',
    color: C.muted,
    marginBottom: 8,
  },
  li: {
    paddingVertical: 8,
    paddingLeft: 18,
    borderBottomWidth: 1,
    borderBottomColor: C.rule,
  },
  dot: {
    position: 'absolute',
    left: 2,
    top: 16,
    width: 6,
    height: 6,
    borderRadius: 1,
    backgroundColor: C.hl,
    transform: [{ rotate: '45deg' }],
  },
  liT: { fontSize: 14.5, lineHeight: 21.75, color: C.ink },
});

export default SubscriptionSheet;
