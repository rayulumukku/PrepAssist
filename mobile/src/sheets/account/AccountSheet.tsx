// Source: PrepAssist.html L6924-L6924 (SHEETS.account)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: account. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function AccountSheet(): React.JSX.Element {
  return <SheetFrame title="Account" testID="sheet.account" />;
}

export default AccountSheet;
