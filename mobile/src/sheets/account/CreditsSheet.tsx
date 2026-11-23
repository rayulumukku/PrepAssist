// Source: PrepAssist.html L6918-L6920 (SHEETS.credits)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: account. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function CreditsSheet(): React.JSX.Element {
  return <SheetFrame title="AI credits" testID="sheet.credits" />;
}

export default CreditsSheet;
