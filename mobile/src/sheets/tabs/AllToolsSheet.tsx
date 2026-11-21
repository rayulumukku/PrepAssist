// Source: PrepAssist.html L6934-L6934 (SHEETS.allTools)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: tabs. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function AllToolsSheet(): React.JSX.Element {
  return <SheetFrame title="All study tools" testID="sheet.allTools" />;
}

export default AllToolsSheet;
