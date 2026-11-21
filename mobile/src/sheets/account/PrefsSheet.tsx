// Source: PrepAssist.html L6925-L6926 (SHEETS.prefs)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: account. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function PrefsSheet(): React.JSX.Element {
  return <SheetFrame title="Study preferences" testID="sheet.prefs" />;
}

export default PrefsSheet;
