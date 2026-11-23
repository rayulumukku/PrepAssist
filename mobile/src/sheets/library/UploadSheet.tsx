// Source: PrepAssist.html L6935-L6935 (SHEETS.upload)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: library. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function UploadSheet(): React.JSX.Element {
  return <SheetFrame title="Add to your vault" testID="sheet.upload" />;
}

export default UploadSheet;
