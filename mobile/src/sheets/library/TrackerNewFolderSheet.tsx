// Source: PrepAssist.html L8194-L8194 (A.ntAdd)
// Source: PrepAssist.html L10632-L10632 (A.ntAddGo)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: library. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function TrackerNewFolderSheet(): React.JSX.Element {
  return <SheetFrame title="New folder" testID="sheet.trackerNewFolder" />;
}

export default TrackerNewFolderSheet;
