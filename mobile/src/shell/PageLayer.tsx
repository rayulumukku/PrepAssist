// Source: PrepAssist.html L2469-L2473 (#layer, .page, .page.in, .page.under, .page > .scroll), L6470-L6506 (pageShell, push, back, closeAllPages, syncChrome), L5093-L5093 (#layer)
// The pushed pages. Each `.page` is `position:absolute; inset:0` over everything below z-index 50
// (it covers the tab bar), with `box-shadow: -20px 0 40px -20px rgba(0,0,0,.25)`.
//   enters   translateX(100%) -> none, .42s var(--ease)
//   .under   translateX(-18%) and filter:brightness(.96); the filter transitions over .42s with `ease`
//   leaves   `.in` removed -> back to translateX(100%), element removed after 420 ms
// brightness(.96) multiplies every channel by .96, which is exactly a black layer at 4 % opacity over
// the page, so that is how it is drawn (no dependence on platform filter support).
//
// Why this is not @react-navigation/stack: see CONTRACT.md "Page stack". In short the stack navigator
// animates only the focused card, and the HTML moves several pages at once (closeAllPages, and
// back()+push() in the same tick), keeps an `under` page shifted while it is being closed, and removes
// pages instantly on stage changes.
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { act } from '../actions';
import { PageHeader, pageHeaderHeight } from '../components/PageHeader';
import { VIEWS } from '../navigation/registry';
import { VIEW_META } from '../navigation/routes';
import type { ViewDef, ViewProps } from '../navigation/routes';
import { useStore } from '../store';
import type { LayerPage } from '../store/slices/base';
import { durations } from '../theme/tokens';
import { useInsets } from '../theme/useTheme';
import { easeCss, easeVar, useTransition } from './anim';
import { useAppSize } from './AppSize';

const styles = StyleSheet.create({
  layer: { ...StyleSheet.absoluteFill, zIndex: 50 },
  page: {
    ...StyleSheet.absoluteFill,
    boxShadow: '-20px 0px 40px -20px rgba(0, 0, 0, 0.25)',
  },
  dim: { ...StyleSheet.absoluteFill, backgroundColor: '#000' },
  // .page > .scroll{position:absolute;inset:0;padding-bottom:100px}
  scroll: { ...StyleSheet.absoluteFill },
  scrollContent: { paddingBottom: 100 },
});

const noTitle = (): string => '';

/** pageShell(v) for a non-focus view: `.scroll > .ph + v.html`. */
function StandardPage({ def, props, phBg }: { def: ViewDef; props: ViewProps; phBg: string }): React.JSX.Element {
  const { sat } = useInsets();
  const useTitle = def.useTitle ?? noTitle;
  const title = useTitle(props.arg);
  const { Screen, Action } = def;
  return (
    <>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingTop: pageHeaderHeight(sat) }]}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled">
        <Screen {...props} />
      </ScrollView>
      <PageHeader
        title={title}
        onBack={() => act('back')}
        action={Action ? <Action {...props} /> : undefined}
        bg={phBg}
        sat={sat}
        testID={`page.${props.entryKey}`}
      />
    </>
  );
}

function PageView({ page }: { page: LayerPage }): React.JSX.Element {
  const { w } = useAppSize();
  const meta = VIEW_META[page.id];
  const def = VIEWS[page.id];
  // `.in` is added two animation frames after the element is created (L6483)
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    let b = 0;
    const a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => setEntered(true));
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, []);
  // .page.under beats .page.in and the base rule (same specificity, later in the sheet)
  const x = page.under ? -0.18 : page.live && entered ? 0 : 1;
  const tx = useTransition(x, durations.page, easeVar);
  const dim = useTransition(page.under ? 1 : 0, durations.page, easeCss);
  const move = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value * w }] }));
  const dimStyle = useAnimatedStyle(() => ({ opacity: 0.04 * dim.value }));
  const props: ViewProps = { arg: page.arg, entryKey: page.key };
  return (
    <Animated.View style={[styles.page, { backgroundColor: meta.bg }, move]} testID={`page.${page.id}`}>
      {meta.focus || meta.phBg === null ? (
        <def.Screen {...props} />
      ) : (
        <StandardPage def={def} props={props} phBg={meta.phBg} />
      )}
      <Animated.View style={[styles.dim, dimStyle]} pointerEvents="none" />
    </Animated.View>
  );
}

export function PageLayer(): React.JSX.Element {
  const layer = useStore(s => s.layer);
  return (
    <View style={styles.layer} pointerEvents="box-none">
      {layer.map(p => (
        <PageView key={p.key} page={p} />
      ))}
    </View>
  );
}
