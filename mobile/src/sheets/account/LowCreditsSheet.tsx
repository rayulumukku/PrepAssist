// Source: PrepAssist.html L7581-L7584 (SHEETS.lowCredits)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: account. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function LowCreditsSheet(): React.JSX.Element {
  return <SheetFrame title="Not enough credits" testID="sheet.lowCredits" />;
}

export default LowCreditsSheet;
