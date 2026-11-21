// Source: PrepAssist.html L7577-L7580 (SHEETS.ledger)
// Source: PrepAssist.html L3563-L3572 (.lg-bal, .ld-r, .ld-i), L3546 (.by-pay), L9337 (ds-handoff .by-pay)
// Computed from reference/android/sheet-ledger and sheet-ledger-after-purchase. `b.up` carries a
// computed padding of 0 20px (a stray `.up` rule elsewhere in the CSS); kept as rendered.
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon, SheetFrame } from '../../components';
import { useStore } from '../../store';
import { font, palettes, Txt } from '../../theme';

function LedgerSheet(): React.JSX.Element {
  const L = useStore(st => st.me.ledger);
  const credits = useStore(st => st.me.credits);
  const inn = L.filter(x => x.v > 0).reduce((a, b) => a + b.v, 0);
  const out = -L.filter(x => x.v < 0).reduce((a, b) => a + b.v, 0);
  return (
    <SheetFrame title="Credit ledger" testID="sheet.ledger">
      <View style={s.bal}>
        <View style={s.cell}>
          <Txt style={s.k}>Balance</Txt>
          <Txt style={s.v}>{String(credits)}</Txt>
        </View>
        <View style={[s.cell, s.next]}>
          <Txt style={s.k}>Added</Txt>
          <Txt style={[s.v, s.up]}>{'+' + inn}</Txt>
        </View>
        <View style={[s.cell, s.next]}>
          <Txt style={s.k}>Used</Txt>
          <Txt style={[s.v, s.dn]}>{'−' + out}</Txt>
        </View>
      </View>
      <View>
        {L.map((x, i) => (
          <View key={i} style={s.r}>
            <View style={[s.i, x.v > 0 && s.iP]}>
              <Icon
                name={x.v > 0 ? 'plus' : 'spark'}
                size={16}
                color={x.v > 0 ? '#2F8A4A' : '#6C5DD3'}
              />
            </View>
            <View style={s.body}>
              <Txt style={s.b}>{x.t}</Txt>
              <Txt style={s.small}>{x.d}</Txt>
            </View>
            <Txt style={[s.em, x.v > 0 && s.emP]}>
              {(x.v > 0 ? '+' : '−') + Math.abs(x.v)}
            </Txt>
          </View>
        ))}
      </View>
      <Pressable
        style={s.pay}
        onPress={() => act('topup')}
        testID="sheet.ledger.topup"
      >
        <Icon name="plus" size={16} color="#fff" />
        <Txt style={s.payT}>Top up credits</Txt>
      </Pressable>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  bal: {
    flexDirection: 'row',
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#F5F7FA',
    marginBottom: 6,
  },
  cell: { flex: 1 },
  next: { borderLeftWidth: 1, borderLeftColor: '#E1E8F0', paddingLeft: 12 },
  k: {
    ...font('sans', 700),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 1.05,
    textTransform: 'uppercase',
    color: '#9AA3AF',
  },
  v: {
    ...font('serif', 800),
    fontSize: 22,
    lineHeight: 31.9,
    marginTop: 3,
    color: palettes.free.ink,
  },
  up: { color: '#2F8A4A', paddingHorizontal: 20 },
  dn: { color: '#C0392B' },
  r: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F4F8',
  },
  i: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#EEEBFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iP: { backgroundColor: '#E6F4EA' },
  body: { flex: 1, minWidth: 0 },
  b: {
    ...font('sans', 600),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14161C',
  },
  small: { fontSize: 11.5, lineHeight: 22.475, color: '#9AA3AF' },
  em: {
    ...font('serif', 800),
    fontSize: 16.5,
    lineHeight: 23.925,
    color: '#C0392B',
  },
  emP: { color: '#2F8A4A' },
  pay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    marginTop: 16,
    borderRadius: 16,
    backgroundImage: 'linear-gradient(90deg, #1B8AD3, #3B5BCC)',
    boxShadow: '0px 14px 24px -14px rgba(27, 138, 211, 0.9)',
  },
  payT: {
    ...font('sans', 700),
    fontSize: 15.5,
    lineHeight: 22.475,
    color: '#fff',
  },
});

export default LedgerSheet;
