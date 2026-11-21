// Source: PrepAssist.html L10611-L10612 (A.ntInbox)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: library. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function TrackerInboxSheet(): React.JSX.Element {
  return <SheetFrame title="Updates waiting" testID="sheet.trackerInbox" />;
}

export default TrackerInboxSheet;
