// Source: PrepAssist.html L6923-L6923 (SHEETS.changeEmail)
// sheetFrame('Change email', .fld #newEmail (value S.user.email) + .btn.btn-brand.btn-wide). A.emailSave
// (L6992) reads #newEmail, so the value is kept in the store (S.newEmail).
import React, { useEffect } from 'react';
import { act } from '../../actions';
import { Btn, Fld, SheetFrame } from '../../components';
import { getS, setS, useStore } from '../../store';

function ChangeEmailSheet(): React.JSX.Element {
  const value = useStore(s => s.newEmail);
  // the sheet is built with value="${S.user.email}"
  useEffect(() => {
    setS({ newEmail: getS().user.email });
  }, []);
  return (
    <SheetFrame title="Change email" testID="sheet.changeEmail">
      <Fld
        label="New email address"
        value={value}
        onChangeText={v => setS({ newEmail: v })}
        keyboardType="email-address"
        autoCapitalize="none"
        testID="sheet.changeEmail.email"
      />
      <Btn variant="brand" wide label="Update & resend link" onPress={() => act('emailSave')} testID="sheet.changeEmail.save" />
    </SheetFrame>
  );
}

export default ChangeEmailSheet;
