// Source: PrepAssist.html L6619-L6625 (VIEWS.answer)
// @placeholder  Renders nothing. Owner: practice. Replace this file with the port of VIEWS.answer.
// The title below is the view's own (v.title); add `Action` if the view has v.action.
import { ANSWERBANK } from '../../data/practice';
import type { ViewDef } from '../../navigation/routes';

function AnswerScreen(): null {
  return null;
}

const view: ViewDef = {
  useTitle: arg => {
    const q = ANSWERBANK.find(x => x.id === arg);
    return q ? q.p + ' · ' + q.m + ' marks' : '';
  },
  Screen: AnswerScreen,
};

export default view;
