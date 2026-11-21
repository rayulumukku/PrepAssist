// Source: PrepAssist.html L6928-L6929 (SHEETS.subscription)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: account. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function SubscriptionSheet(): React.JSX.Element {
  return <SheetFrame title="Subscription" testID="sheet.subscription" />;
}

export default SubscriptionSheet;
