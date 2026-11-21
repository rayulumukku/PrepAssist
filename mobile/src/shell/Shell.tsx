// Source: PrepAssist.html L42-L42 (#app), L5076-L5102 (app shell markup: #s-app, #layer, #ask, #scrim, #sheet, #toast), L10679-L10679 (ultimate #app background)
// #app: the one full-screen surface. Layers bottom to top, with the z-index of the HTML:
//   stages (auto) · #layer 50 · #ask 70 · #scrim 90 · #reelV 90 (later in the DOM, so above the
//   scrim) · #sheet 91 · #toast 200 · .pm-ov 200 (appended after the toast, so above it)
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { OVERLAYS } from '../navigation/registry';
import { useTheme } from '../theme/useTheme';
import { AppSizeContext } from './AppSize';
import type { AppSize } from './AppSize';
import { AskButton } from './AskButton';
import { startDeepLinks } from './deeplinks';
import { PageLayer } from './PageLayer';
import { Scrim, SheetHost } from './SheetHost';
import { StageHost } from './StageHost';
import { Toast } from './Toast';
import { useBackButton } from './useBackButton';

const styles = StyleSheet.create({
  app: { flex: 1, overflow: 'hidden' },
  overlay: { ...StyleSheet.absoluteFill },
  reel: { zIndex: 90 },
  magic: { zIndex: 200 },
});

export function Shell(): React.JSX.Element {
  const theme = useTheme();
  const [size, setSize] = useState<AppSize>({ w: 0, h: 0 });
  useBackButton();
  // init (L8682-L8683): a start link runs A.jump and friends, otherwise go('book')
  useEffect(() => startDeepLinks(), []);
  const onLayout = (e: LayoutChangeEvent): void => {
    const { width, height } = e.nativeEvent.layout;
    setSize(prev => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
  };
  const Reel = OVERLAYS.reel;
  const Magic = OVERLAYS.planMagic;
  return (
    <AppSizeContext.Provider value={size}>
      <View style={[styles.app, { backgroundColor: theme.appBg }]} onLayout={onLayout} testID="app">
        {size.w > 0 ? (
          <>
            <StageHost />
            <PageLayer />
            <AskButton />
            <Scrim />
            <View style={[styles.overlay, styles.reel]} pointerEvents="box-none">
              <Reel />
            </View>
            <SheetHost />
            <Toast />
            <View style={[styles.overlay, styles.magic]} pointerEvents="box-none">
              <Magic />
            </View>
          </>
        ) : null}
      </View>
    </AppSizeContext.Provider>
  );
}
