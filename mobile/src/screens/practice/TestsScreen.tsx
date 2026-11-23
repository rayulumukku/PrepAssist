// Source: PrepAssist.html L6601-L6606 (VIEWS.tests)
// @placeholder  Renders nothing. Owner: practice. Replace this file with the port of VIEWS.tests.
// The title below is the view's own (v.title); add `Action` if the view has v.action.
import type { ViewDef } from '../../navigation/routes';

function TestsScreen(): null {
  return null;
}

const view: ViewDef = {
  useTitle: () => 'Test Series',
  Screen: TestsScreen,
};

export default view;
