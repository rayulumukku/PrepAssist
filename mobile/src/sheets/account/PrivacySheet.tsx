// Source: PrepAssist.html L6932-L6932 (SHEETS.privacy)
// Computed from reference/android/sheet-privacy. Rows are the private .set copy (SetRow.tsx).
import React from 'react';
import { act } from '../../actions';
import { SheetFrame } from '../../components';
import { SetBtn, SetTog } from './SetRow';

const ROWS: [string, boolean][] = [
  ['Use my answers to improve evaluations', true],
  ['Show me on the weekly leaderboard', false],
  ['Personalised recommendations', true],
];

function PrivacySheet(): React.JSX.Element {
  return (
    <SheetFrame title="Privacy" testID="sheet.privacy">
      {ROWS.map(([l, on], i) => (
        <SetTog
          key={l}
          label={l}
          initial={on}
          testID={`sheet.privacy.tog.${i}`}
        />
      ))}
      <SetBtn
        icon="share"
        label="Download my data"
        onPress={() =>
          act('toast:We’ll email your data export within 24 hours')
        }
        testID="sheet.privacy.export"
      />
      <SetBtn
        icon="x"
        label="Delete account"
        red
        onPress={() => act('toast:Account deletion would require confirmation')}
        testID="sheet.privacy.delete"
      />
    </SheetFrame>
  );
}

export default PrivacySheet;
