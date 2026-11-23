// Source: PrepAssist.html L6924-L6924 (SHEETS.account)
// Computed from reference/android/sheet-account: five .fld fields (the shared Fld), then .btn.btn-ink.btn-wide.
import React, { useState } from 'react';
import { act } from '../../actions';
import { Btn, Fld, SheetFrame } from '../../components';
import { useStore } from '../../store';

function Field({
  label,
  initial,
}: {
  label: string;
  initial: string;
}): React.JSX.Element {
  const [v, setV] = useState(initial);
  return <Fld label={label} value={v} onChangeText={setV} />;
}

function AccountSheet(): React.JSX.Element {
  const user = useStore(st => st.user);
  const rows: [string, string][] = [
    ['Full name', user.name],
    ['Phone', '+91 98765 43210'],
    ['Email', user.email],
    ['Target exam', 'UPSC CSE 2027'],
    ['Optional subject', 'Sociology'],
  ];
  return (
    <SheetFrame
      title="Account"
      testID="sheet.account"
      scrollProps={{ keyboardShouldPersistTaps: 'handled' }}
    >
      {rows.map(([l, v]) => (
        <Field key={l} label={l} initial={v} />
      ))}
      <Btn
        variant="ink"
        wide
        label="Save changes"
        onPress={() => act('saved')}
        testID="sheet.account.save"
      />
    </SheetFrame>
  );
}

export default AccountSheet;
