// Source: PrepAssist.html L7581-L7584 (SHEETS.lowCredits), L7322 (ring)
// Source: PrepAssist.html L3573-L3576 (.lc-*), L3546 and L9337 (.by-pay), L3382-L3384 (.ac-wide), L3549 (.by-lnk)
// Computed from reference/android/sheet-lowCredits. mForce is the practice area's verb.
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg from 'react-native-svg';
import { act } from '../../actions';
import { Icon, SheetFrame } from '../../components';
import { RingArcs } from '../../screens/account/Ring';
import { useStore } from '../../store';
import { font, palettes, Txt } from '../../theme';

function LowCreditsSheet(): React.JSX.Element {
  const c = useStore(st => st.me.credits);
  return (
    <SheetFrame title="Not enough credits" testID="sheet.lowCredits">
      <View style={s.top}>
        <View style={s.g}>
          <Svg width={64} height={64} viewBox="0 0 76 76">
            <RingArcs
              r={32}
              frac={c / 20}
              stroke={6}
              color="#F5A01F"
              track="#FFF1DC"
            />
          </Svg>
          <View style={s.gb}>
            <Txt style={s.gbT}>{String(c)}</Txt>
          </View>
        </View>
        <Txt style={s.p}>
          {'A Mains evaluation uses '}
          <Txt style={s.b}>20 credits</Txt>
          {'. You have '}
          <Txt style={s.b}>{String(c)}</Txt>
          {'. Top up once, or get 100 credits every month with UPSC Pro.'}
        </Txt>
      </View>
      <Pressable
        style={s.pay}
        onPress={() => act('push:upgrade')}
        testID="sheet.lowCredits.plans"
      >
        <Icon name="spark" size={16} color="#fff" />
        <Txt style={s.payT}>See plans · from ₹399/month</Txt>
      </Pressable>
      <Pressable
        style={s.wide}
        onPress={() => act('topup')}
        testID="sheet.lowCredits.topup"
      >
        <Icon name="plus" size={16} color="#14161C" />
        <Txt style={s.wideT}>Buy a credit pack · from ₹99</Txt>
      </Pressable>
      <Pressable
        style={s.lnk}
        onPress={() => act('mForce')}
        testID="sheet.lowCredits.force"
      >
        <Txt style={s.lnkT}>Run a demo evaluation anyway</Txt>
      </Pressable>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 16,
    backgroundColor: '#FFF8EC',
  },
  g: { width: 64, height: 64 },
  gb: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gbT: {
    ...font('serif', 800),
    fontSize: 18,
    lineHeight: 26.1,
    color: palettes.free.ink,
  },
  p: { flex: 1, fontSize: 13.5, lineHeight: 20.25, color: '#4A505B' },
  b: { ...font('sans', 700) },
  pay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    marginTop: 14,
    borderRadius: 16,
    backgroundImage: 'linear-gradient(90deg, #1B8AD3, #3B5BCC)',
    boxShadow: '0px 14px 24px -14px rgba(27, 138, 211, 0.9)',
  },
  payT: {
    ...font('sans', 700),
    fontSize: 15.5,
    lineHeight: 22.475,
    color: '#fff',
  },
  wide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 44,
    marginTop: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5FA',
  },
  wideT: {
    ...font('sans', 700),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14161C',
  },
  lnk: { marginTop: 10, padding: 8 },
  lnkT: {
    ...font('sans', 600),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#7A8494',
    textAlign: 'center',
  },
});

export default LowCreditsSheet;
