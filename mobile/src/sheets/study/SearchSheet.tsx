// Source: PrepAssist.html L6937-L6951 (cmdk)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: study. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function SearchSheet(): React.JSX.Element {
  return <SheetFrame title="Search" testID="sheet.search" />;
}

export default SearchSheet;
