// Source: PrepAssist.html L8175-L8175 (A.svAdd)
// Source: PrepAssist.html L8176-L8176 (A.svSave)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: study. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function SavedAddLinkSheet(): React.JSX.Element {
  return <SheetFrame title="Save a link" testID="sheet.savedAddLink" />;
}

export default SavedAddLinkSheet;
