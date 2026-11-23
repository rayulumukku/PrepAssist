// Source: PrepAssist.html L6631-L6636 (VIEWS.qbank)
// @placeholder  Renders nothing. Owner: practice. Replace this file with the port of VIEWS.qbank.
// The title below is the view's own (v.title); add `Action` if the view has v.action.
import { SUBJ } from '../../data/subjects';
import type { ViewDef } from '../../navigation/routes';

function QbankScreen(): null {
  return null;
}

const view: ViewDef = {
  useTitle: arg => ((arg !== undefined && (SUBJ as Readonly<Record<string, { n: string }>>)[arg]) || SUBJ.polity).n + ' · Question bank',
  Screen: QbankScreen,
};

export default view;
