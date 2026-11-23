// Source: PrepAssist.html L6925-L6926 (SHEETS.prefs)
// Computed from reference/android/sheet-prefs: .fldlab, .opt-row of .chip (chipOne), .set rows with .tog.
import React from 'react';
import { ChipGroup, FldLab, OptRow, SheetFrame } from '../../components';
import { SetTog } from './SetRow';

const TOGS: [string, boolean][] = [
  ['Morning plan reminder · 7:00', true],
  ['Revision nudges', true],
  ['Weekly progress summary', true],
  ['Quiet hours 23:00–6:00', false],
];

function PrefsSheet(): React.JSX.Element {
  return (
    <SheetFrame title="Study preferences" testID="sheet.prefs">
      <FldLab>Daily study goal</FldLab>
      <OptRow>
        <ChipGroup
          items={['4 h', '6 h', '8 h', '10 h']}
          mode="one"
          initial={[1]}
          testID="sheet.prefs.goal"
        />
      </OptRow>
      <FldLab>Newspaper source</FldLab>
      <OptRow>
        <ChipGroup
          items={['The Hindu', 'Indian Express', 'Times of India']}
          mode="one"
          initial={[0]}
          testID="sheet.prefs.paper"
        />
      </OptRow>
      {TOGS.map(([l, on], i) => (
        <SetTog
          key={l}
          label={l}
          initial={on}
          testID={`sheet.prefs.tog.${i}`}
        />
      ))}
    </SheetFrame>
  );
}

export default PrefsSheet;
