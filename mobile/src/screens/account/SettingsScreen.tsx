// Source: PrepAssist.html L7538-L7546 (VIEWS.settings)
// @placeholder  Renders nothing. Owner: account. Replace this file with the port of VIEWS.settings.
// The title below is the view's own (v.title); add `Action` if the view has v.action.
import type { ViewDef } from '../../navigation/routes';

function SettingsScreen(): null {
  return null;
}

const view: ViewDef = {
  useTitle: () => 'App settings',
  Screen: SettingsScreen,
};

export default view;
