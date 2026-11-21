// The size of #app (PrepAssist.html L42: width 100%, height 100dvh). Percentages in the HTML
// (.sheet max-height:88%, .page.under translateX(-18%), .toast left:50%) resolve against it.
import { createContext, useContext } from 'react';

export interface AppSize {
  w: number;
  h: number;
}

export const AppSizeContext = createContext<AppSize>({ w: 0, h: 0 });

export function useAppSize(): AppSize {
  return useContext(AppSizeContext);
}
