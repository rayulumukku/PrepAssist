// Source: PrepAssist.html L2257-L2257 (.nav backdrop-filter:blur(12px)), L2474-L2474 (.ph backdrop-filter:blur(10px))
// CSS `backdrop-filter: blur(Npx)` under a translucent background colour: a native blur of whatever is
// behind the element, with the element's own rgba background (`tint`) drawn on top of the blur.
//
// Platform mapping (see CONTRACT.md "Blur"):
//   iOS      UIVisualEffectView through @react-native-community/blur; blurAmount = the CSS radius.
//            The system effect also tints (light or dark material); under the 92-96 % opaque
//            backgrounds the HTML uses on these bars that tint is not visible.
//   Android  the library blurs a 6x downsampled copy of the window content; blurRadius is derived from
//            the CSS radius (12 px CSS = sigma 31.5 device px on the Pixel 7). The tint MUST be the
//            library's overlayColor: the library also captures views drawn in FRONT of the BlurView
//            (the bar's own icons and labels), and the tint above the blur reduces that ghost to
//            6-8 % of a blurred thin stroke, at most 1/255 in measurements. A tint drawn as a separate
//            view in front would itself be captured and applied twice.
import React from 'react';
import { PixelRatio, Platform, StyleSheet, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';

export interface BackdropProps {
  /** The CSS blur radius in px. */
  px: number;
  /** The element's own translucent background colour (rgba), drawn over the blur. */
  tint: string;
  /** Which system material iOS uses under the tint: 'light' for light bars, 'dark' for the Midnight Gold tab bar. */
  tone?: 'light' | 'dark';
}

const styles = StyleSheet.create({
  clip: { ...StyleSheet.absoluteFill, overflow: 'hidden' },
});

export function Backdrop({ px, tint, tone = 'light' }: BackdropProps): React.JSX.Element {
  if (Platform.OS === 'android') {
    // The Android implementation (Dimezis BlurView 2.0.4) renders the whole window content into a
    // bitmap downscaled 6x and blurs that; sigma = 0.57735 * radius + 0.5 on the small bitmap.
    const sigmaSmall = (px * PixelRatio.get()) / 6;
    const radius = Math.max(1, Math.min(25, Math.round((sigmaSmall - 0.5) / 0.57735)));
    // The clip is required: the library paints overlayColor with Canvas.drawColor, which fills the whole
    // clip, and React Native does not clip a view's drawing to its own bounds. Without this wrapper the
    // tint floods the entire screen.
    return (
      <View style={styles.clip} pointerEvents="none">
        <BlurView style={StyleSheet.absoluteFill} blurRadius={radius} overlayColor={tint} />
      </View>
    );
  }
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <BlurView style={StyleSheet.absoluteFill} blurType={tone} blurAmount={px} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: tint }]} />
    </View>
  );
}
