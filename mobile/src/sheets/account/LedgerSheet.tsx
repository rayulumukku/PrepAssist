// Source: PrepAssist.html L7577-L7580 (SHEETS.ledger)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: account. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function LedgerSheet(): React.JSX.Element {
  return <SheetFrame title="Credit ledger" testID="sheet.ledger" />;
}

export default LedgerSheet;
