// Source: PrepAssist.html L6931-L6931 (SHEETS.settings)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: account. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function SettingsSheet(): React.JSX.Element {
  return <SheetFrame title="Settings" testID="sheet.settings" />;
}

export default SettingsSheet;
