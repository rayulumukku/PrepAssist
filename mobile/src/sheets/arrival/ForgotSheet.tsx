// Source: PrepAssist.html L6922-L6922 (SHEETS.forgot)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: arrival. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function ForgotSheet(): React.JSX.Element {
  return <SheetFrame title="Reset your password" testID="sheet.forgot" />;
}

export default ForgotSheet;
