// Source: PrepAssist.html L6930-L6930 (SHEETS.payments)
// Computed from reference/android/sheet-payments: .sh-list rows with a receipt tile and an amount
// (<b style="flex:none;font-size:14.5px">).
import React from 'react';
import { StyleSheet } from 'react-native';
import { act } from '../../actions';
import { SheetFrame, SheetList, SheetListItem } from '../../components';
import { font, palettes, Txt } from '../../theme';

const ROWS: [string, string, string][] = [
  ['12 Mar 2026', 'PrepAssist Pro · Annual', '₹8,999'],
  ['2 Feb 2026', 'AI credits · 300', '₹499'],
  ['14 Nov 2025', 'Test Series 2026', '₹1,499'],
];

function PaymentsSheet(): React.JSX.Element {
  return (
    <SheetFrame title="Payments" testID="sheet.payments">
      <SheetList>
        {ROWS.map(([d, t, amt], i) => (
          <SheetListItem
            key={t}
            icon="receipt"
            title={t}
            subtitle={`${d} · UPI`}
            after={<Txt style={s.amt}>{amt}</Txt>}
            onPress={() => act('toast:Invoice downloaded')}
            testID={`sheet.payments.${i}`}
          />
        ))}
      </SheetList>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  amt: {
    ...font('sans', 600),
    fontSize: 14.5,
    lineHeight: 21.025,
    color: palettes.free.ink,
  },
});

export default PaymentsSheet;
