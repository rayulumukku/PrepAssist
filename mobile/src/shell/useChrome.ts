// syncChrome (PrepAssist.html L6501-L6506) as derived state:
//   #app.paged   = a page is on top of the tabs
//   #ask.hide    = S.stage !== 'app' || the top page is a focus / noAsk view
import { useStore } from '../store';

export interface Chrome {
  paged: boolean;
  askHide: boolean;
  askMini: boolean;
}

export function useChrome(): Chrome {
  const paged = useStore(s => s.stack.length > 0);
  const askHide = useStore(s => {
    const top = s.stack[s.stack.length - 1];
    return s.stage !== 'app' || !!(top && top.focus);
  });
  const askMini = useStore(s => s.askMini);
  return { paged, askHide, askMini };
}
