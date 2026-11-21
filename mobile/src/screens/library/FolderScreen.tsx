// Source: PrepAssist.html L10495-L10502 (VIEWS.folder)
// Source: PrepAssist.html L10493-L10494 (folderList)
// Source: PrepAssist.html L10480-L10487 (nCard)
// @placeholder  Renders nothing. Owner: library. Replace this file with the port of VIEWS.folder.
// The title below is the view's own (v.title); add `Action` if the view has v.action.
import type { ViewDef } from '../../navigation/routes';

function FolderScreen(): null {
  return null;
}

const view: ViewDef = {
  useTitle: arg => arg ?? '',
  Screen: FolderScreen,
};

export default view;
