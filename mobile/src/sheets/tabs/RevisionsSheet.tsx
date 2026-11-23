// Source: PrepAssist.html L6921-L6921 (SHEETS.revisions)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: tabs. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function RevisionsSheet(): React.JSX.Element {
  return <SheetFrame title="Due for revision" testID="sheet.revisions" />;
}

export default RevisionsSheet;
