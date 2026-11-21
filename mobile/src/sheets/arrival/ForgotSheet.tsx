// Source: PrepAssist.html L6922-L6922 (SHEETS.forgot)
// sheetFrame('Reset your password', p + .fld (value of #inEmail) + .btn.btn-brand.btn-wide). Values from
// reference/android/sheet-forgot: p Inter 400 14.5px / 21.025px --ink-2, margin-bottom 14.
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { act } from '../../actions';
import { Btn, Fld, SheetFrame } from '../../components';
import { getS } from '../../store';
import { palettes } from '../../theme';
import { Txt } from '../../theme/Txt';

function ForgotSheet(): React.JSX.Element {
  // value="${$('#inEmail').value}", read once when the sheet is built
  const [email, setEmail] = useState(() => getS().authF.inEmail);
  return (
    <SheetFrame title="Reset your password" testID="sheet.forgot">
      <Txt style={styles.p}>We’ll email you a link to set a new password.</Txt>
      <Fld
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        testID="sheet.forgot.email"
      />
      <Btn variant="brand" wide label="Send reset link" onPress={() => act('forgotSend')} testID="sheet.forgot.send" />
    </SheetFrame>
  );
}

const styles = StyleSheet.create({
  p: { fontSize: 14.5, lineHeight: 21.025, color: palettes.free.ink2, marginBottom: 14 },
});

export default ForgotSheet;
