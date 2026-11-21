// Source: PrepAssist.html L6930-L6930 (SHEETS.payments)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: account. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function PaymentsSheet(): React.JSX.Element {
  return <SheetFrame title="Payments" testID="sheet.payments" />;
}

export default PaymentsSheet;
