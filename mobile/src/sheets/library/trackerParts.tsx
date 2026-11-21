// Source: PrepAssist.html L4133 (.mv-lab), L3584 + L4232 (.dl-in.sv-in), L3546-L3547 + L9337 (.by-pay), L4083 + L4293 (.tq-pdf), L10195-L10196 (.n2-lab), L10202 (.n2-in)
// Private copies of the small form pieces the tracker / upload / cloud sheets share in the HTML
// (`.mv-*`, `.dl-in`, `.sv-in`, `.by-pay` are listed as not ported by the foundation, CONTRACT.md section 4).
// Computed (reference/android/sheet-tracker-new-folder, sheet-tracker-split-pdf, sheet-tracker-optional):
//   .mv-lab        row space-between, margin 18 0 8, 12.5px 700 #3A404B
//   .dl-in.sv-in   50 high, margin-top 8, radius 14, 1px #E3E7ED, padding 0 14, 15.5px 500 (focus border #C0392B + 3px #FDECEC ring)
//   .by-pay        52 high, margin-top 14, radius 16, linear(90deg, #1B8AD3, #3B5BCC), shadow 0 14 24 -14 rgba(27,138,211,.9), 15.5px 700 white, icon 16
//   .n2-lab span   11px 800 ls 1.32 uppercase #8A93A0; row baseline space-between, margin 20 0 8
//   .n2-in         48 high, padding 0 14, radius 14, white, inset ring #E1E5EC, 15px #14161C (focus inset 1.5px #3E9A55)
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { Icon } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import { font, fontPx, Txt } from '../../theme';

export function MvLab({ children, style }: { children: string; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return (
    <View style={[p.mvLab, style]}>
      <Txt style={p.mvLabTx}>{children}</Txt>
    </View>
  );
}

export function DlIn(props: TextInputProps): React.JSX.Element {
  const [focus, setFocus] = useState(false);
  return (
    <TextInput
      allowFontScaling={false}
      placeholderTextColor="#757575"
      {...props}
      onFocus={e => {
        setFocus(true);
        props.onFocus?.(e);
      }}
      onBlur={e => {
        setFocus(false);
        props.onBlur?.(e);
      }}
      style={[p.dlIn, focus && p.dlInFocus, props.style]}
    />
  );
}

export function ByPay({ label, icon, onPress, testID }: { label: string; icon: IconName; onPress: () => void; testID?: string }): React.JSX.Element {
  return (
    <Pressable style={p.byPay} onPress={onPress} testID={testID}>
      <Icon name={icon} size={16} color="#FFFFFF" />
      <Txt style={p.byPayTx}>{label}</Txt>
    </Pressable>
  );
}

export function N2Lab({ label, em, style }: { label: string; em?: React.ReactNode; style?: StyleProp<ViewStyle> }): React.JSX.Element {
  return (
    <View style={[p.n2Lab, style]}>
      <Txt style={p.n2LabTx}>{label}</Txt>
      {em ?? null}
    </View>
  );
}

export function N2In(props: TextInputProps & { multiline?: boolean }): React.JSX.Element {
  const [focus, setFocus] = useState(false);
  return (
    <TextInput
      allowFontScaling={false}
      placeholderTextColor="#757575"
      {...props}
      onFocus={e => {
        setFocus(true);
        props.onFocus?.(e);
      }}
      onBlur={e => {
        setFocus(false);
        props.onBlur?.(e);
      }}
      style={[p.n2In, props.multiline && p.n2Ta, focus && p.n2InFocus, props.style]}
    />
  );
}

export const p = StyleSheet.create({
  mvLab: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18, marginBottom: 8 },
  mvLabTx: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#3A404B' },
  dlIn: {
    height: 50,
    marginTop: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E3E7ED',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 0,
    ...font('sans', 500),
    fontSize: fontPx(15.5),
    color: '#25272D',
  },
  dlInFocus: { borderColor: '#C0392B', boxShadow: '0px 0px 0px 3px #FDECEC' },
  byPay: {
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
  byPayTx: { ...font('sans', 700), fontSize: 15.5, lineHeight: 22.475, color: '#FFFFFF', textAlign: 'center' },
  n2Lab: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 20, marginBottom: 8 },
  n2LabTx: { ...font('sans', 800), fontSize: 11, lineHeight: 15.95, letterSpacing: 1.32, textTransform: 'uppercase', color: '#8A93A0' },
  n2In: {
    height: 48,
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    boxShadow: 'inset 0px 0px 0px 1px #E1E5EC',
    ...font('sans', 400),
    fontSize: fontPx(15),
    color: '#14161C',
  },
  n2Ta: { height: 150, paddingTop: 12, paddingBottom: 12, lineHeight: 23.25, textAlignVertical: 'top' },
  n2InFocus: { boxShadow: 'inset 0px 0px 0px 1.5px #3E9A55' },
});
