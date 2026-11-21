// Source: PrepAssist.html L6932-L6932 (SHEETS.privacy)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: account. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function PrivacySheet(): React.JSX.Element {
  return <SheetFrame title="Privacy" testID="sheet.privacy" />;
}

export default PrivacySheet;
