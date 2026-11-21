// Source: PrepAssist.html L7565-L7572 (VIEWS.legal)
// @placeholder  Renders nothing. Owner: account. Replace this file with the port of VIEWS.legal.
// The title below is the view's own (v.title); add `Action` if the view has v.action.
import { LEGAL } from '../../data/legal';
import type { ViewDef } from '../../navigation/routes';

function LegalScreen(): null {
  return null;
}

const view: ViewDef = {
  useTitle: arg =>
    arg === 'privacy' || arg === 'terms' ? LEGAL[arg].title : '',
  Screen: LegalScreen,
};

export default view;
