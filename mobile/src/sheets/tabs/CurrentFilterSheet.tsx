// Source: PrepAssist.html L7595-L7596 (A.caFilter)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: tabs. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function CurrentFilterSheet(): React.JSX.Element {
  return <SheetFrame title="Filter by paper" testID="sheet.currentFilter" />;
}

export default CurrentFilterSheet;
