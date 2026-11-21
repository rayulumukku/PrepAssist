// Source: PrepAssist.html L6521-L6526 (VIEWS.course)
// @placeholder  Renders nothing. Owner: study. Replace this file with the port of VIEWS.course.
// The title below is the view's own (v.title); add `Action` if the view has v.action.
import { COURSES } from '../../data/learn';
import type { ViewDef } from '../../navigation/routes';

function CourseScreen(): null {
  return null;
}

const view: ViewDef = {
  useTitle: arg => COURSES.find(x => x.id === arg)?.t ?? '',
  Screen: CourseScreen,
};

export default view;
