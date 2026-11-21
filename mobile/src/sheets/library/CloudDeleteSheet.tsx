// Source: PrepAssist.html L8189-L8189 (A.vlDel)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: library. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function CloudDeleteSheet(): React.JSX.Element {
  return <SheetFrame title="Delete this file?" testID="sheet.cloudDelete" />;
}

export default CloudDeleteSheet;
