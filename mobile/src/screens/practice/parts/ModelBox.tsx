// Source: PrepAssist.html L2806-L2811 (.model, .model .body, ::after, .model.open), L3070 (border colour), L92-L93 (.link), L7026 (A.modelOpen)
// PRIVATE COPY of the `.model` model-answer box used by VIEWS.answer (#abModel) and mainsResultHTML (#evModel).
// Computed (reference/android view-mainsResult .model, view-answer-model-open):
//   .model        margin-top 12 (inline per use), border-top 1px --brand, padding-top 14
//   .eyebrow      inline (line box 22.475)
//   .body         margin-top 8; Inter (--read) 400 15.5px / 25.575px #25272D; max-height 150, overflow hidden,
//                 `transition: max-height .6s var(--ease)`; .open: max-height 1400
//   .body::after  bottom 70px, linear-gradient(transparent, --paper); hidden when open
//   p             margin-bottom 12; b Inter 700; i Inter 400 italic
//   .link         inline-flex, gap 6, margin-top 10 (inline); Inter 600 14.5px / 21.025px --brand; chevd 16
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { act } from '../../../actions';
import { Eyebrow, Icon, RichText } from '../../../components';
import { MODEL } from '../../../data';
import { useTransition } from '../../../shell/anim';
import { font, palettes, Txt, useTheme } from '../../../theme';

const s = StyleSheet.create({
  model: { borderTopWidth: 1, paddingTop: 14 },
  eb: { lineHeight: 22.475 },
  body: { marginTop: 8, overflow: 'hidden' },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 70 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, alignSelf: 'flex-start' },
  linkT: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025 },
});

const rich = {
  base: { ...font('read', 400), fontSize: 15.5, lineHeight: 25.575, color: '#25272D' },
  p: { marginBottom: 12 },
  b: { ...font('read', 700) },
  i: { ...font('read', 400, true) },
};

export function ModelBox({ id, title, open, style }: { id: 'abModel' | 'evModel'; title: string; open: boolean; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  const t = useTheme();
  const [h, setH] = useState(0);
  const mh = useTransition(open ? 1400 : 150, 600);
  const a = useAnimatedStyle(() => ({ height: h ? Math.min(mh.value, h) : mh.value }));
  return (
    <View style={[s.model, { borderTopColor: t.brand }, style]}>
      <Eyebrow style={s.eb}>{title}</Eyebrow>
      <Animated.View style={[s.body, a]}>
        <View onLayout={e => setH(e.nativeEvent.layout.height)}>
          <RichText html={MODEL} styles={rich} />
        </View>
        {open ? null : <View style={[s.fade, { backgroundImage: `linear-gradient(rgba(255, 255, 255, 0), ${palettes.free.paper})` }]} pointerEvents="none" />}
      </Animated.View>
      <Pressable style={s.link} onPress={() => act('modelOpen', id)} testID={`model.${id}`}>
        <Txt style={[s.linkT, { color: t.brand }]}>{open ? 'Show less' : 'Read full model answer'}</Txt>
        <Icon name="chevd" size={16} color={t.brand} />
      </Pressable>
    </View>
  );
}
