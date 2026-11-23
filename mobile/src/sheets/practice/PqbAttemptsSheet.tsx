// Source: PrepAssist.html L8140-L8140 (A.pqHist)
// @placeholder  Draws only the shared sheet frame with an empty body. Owner: practice. Replace this file
// with the port of the sheet's content (the title below is the one the HTML passes to sheetFrame()).
import React from 'react';
import { SheetFrame } from '../../components/SheetFrame';

function PqbAttemptsSheet(): React.JSX.Element {
  return <SheetFrame title="Your attempts" testID="sheet.pqbAttempts" />;
}

export default PqbAttemptsSheet;
