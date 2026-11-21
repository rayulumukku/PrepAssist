// Source: PrepAssist.html L6933-L6933 (SHEETS.coverage)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: tabs. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function CoverageSheet(): React.JSX.Element {
  return <SheetFrame title="Syllabus progress" testID="sheet.coverage" />;
}

export default CoverageSheet;
