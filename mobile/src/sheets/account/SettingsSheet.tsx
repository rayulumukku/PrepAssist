// Source: PrepAssist.html L6931-L6931 (SHEETS.settings)
// Computed from reference/android/sheet-settings. Rows are the private .set copy (SetRow.tsx).
import React from 'react';
import { act } from '../../actions';
import { SheetFrame } from '../../components';
import { SetBtn, SetTog } from './SetRow';

const ROWS: [string, boolean][] = [
  ['Notifications', true],
  ['Download lectures on Wi-Fi only', true],
  ['Larger reading text', false],
  ['Reduce motion', false],
  ['Dark reading mode at night', false],
];

function SettingsSheet(): React.JSX.Element {
  return (
    <SheetFrame title="Settings" testID="sheet.settings">
      {ROWS.map(([l, on], i) => (
        <SetTog
          key={l}
          label={l}
          initial={on}
          testID={`sheet.settings.tog.${i}`}
        />
      ))}
      <SetBtn
        icon="refresh"
        label="Clear downloaded content"
        small="312 MB"
        onPress={() => act('toast:Cache cleared · 312 MB freed')}
        testID="sheet.settings.clear"
      />
    </SheetFrame>
  );
}

export default SettingsSheet;
