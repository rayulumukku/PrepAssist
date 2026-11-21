// Source: PrepAssist.html L6533-L6541 (VIEWS.note)
// @placeholder  Renders nothing. Owner: study. Replace this file with the port of VIEWS.note.
// The title below is the view's own (v.title); add `Action` if the view has v.action.
import type { ViewDef } from '../../navigation/routes';

function NoteScreen(): null {
  return null;
}

const view: ViewDef = {
  useTitle: arg => (arg === 'new' ? 'New note' : 'Note'),
  Screen: NoteScreen,
};

export default view;
