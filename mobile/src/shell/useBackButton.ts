// The Android system back button does what the prototype's Escape key does (PrepAssist.html L7071):
// close the sheet if one is open, else pop the top page, else leave it to the system. iOS has no
// system back and the swipe-back gesture does not exist here (pages are plain views).
// The '/' shortcut of the same listener (L7072, opens search) has no touch equivalent and is not ported.
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { act } from '../actions';
import { getS } from '../store';

export function useBackButton(): void {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const s = getS();
      if (s.sheet.on) {
        act('closeSheet');
        return true;
      }
      if (s.stack.length) {
        act('back');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);
}
