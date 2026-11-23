// Source: PrepAssist.html L10567-L10570 (optSheet)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: library. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function TrackerOptionalSheet(): React.JSX.Element {
  return <SheetFrame title="Optional Subject" testID="sheet.trackerOptional" />;
}

export default TrackerOptionalSheet;
