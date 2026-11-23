// Source: PrepAssist.html L7323-L7323 (meRow), L3326-L3344 (.me-grp, .me-card, .me-row, .me-ri, .me-chev, .me-pill, .me-val, .me-ok, .me-row.hl)
// PRIVATE COPY of the shared-in-HTML `.me-*` row classes (CONTRACT.md section 4: not ported by the
// foundation). Used by the Profile tab and the Menu search results; merge candidates for src/components.
// Computed (reference/android/tab-profile, tab-menu-search):
//   .me-grp    margin-top 24; h4 Inter 800 10.5/15.225 ls 1.68 uppercase #8A93A0, margin 0 4 8
//   .me-card   #fff, radius 18, shadow 0 0 0 1px #E6EBF1, overflow hidden
//   .me-row    flex, centred, gap 12, padding 13 16; + .me-row border-top 1 #EEF2F6; .hl gradient 90deg #FFF6E8 → #fff 70 %, b #B86E00
//   .me-ri     38 x 38 radius 12, colour var(--c), background color-mix(var(--c) 11 %, #fff); icon 18
//   b          Inter 600 14.5/21.025 #14161C; small 12.5/18.125 #7A8494 margin-top 2
//   .me-chev   16, #AEB7C3
//   .me-pill   min-width 26, 22 high, padding 0 7, radius 11, #EEEBFC / #6C5DD3 (.g #E2F5F1 / #0E9A8A), Inter 800 11.5
//   .me-val    Inter 600 12.5/18.125 #7A8494
//   .me-ok     gap 6, Inter 700 11.5/16.675 #2F8A4A; i 7 x 7 #2F9E62 (its `dpu` pulse starts from no box-shadow
//              and ends transparent: nothing visible, not drawn)
// .me-row:hover is not ported.
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon } from '../../../components';
import type { IconName } from '../../../icons/iconPaths.generated';
import { font, Txt } from '../../../theme';
import { mix } from '../homeLogic';

export function MeGrp({ title, children }: { title: string; children: React.ReactNode }): React.JSX.Element {
  return (
    <View style={styles.grp}>
      <Txt style={styles.h4}>{title}</Txt>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

export function MeRow({
  icon,
  c,
  title,
  sub,
  onPress,
  right,
  hl,
  first,
  testID,
}: {
  icon: IconName;
  c: string;
  title: string;
  sub: string;
  onPress: () => void;
  right?: React.ReactNode;
  hl?: boolean;
  first?: boolean;
  testID?: string;
}): React.JSX.Element {
  return (
    <Pressable style={[styles.row, !first && styles.rowLine, hl && styles.hl]} onPress={onPress} testID={testID}>
      <View style={[styles.ri, { backgroundColor: mix(c, 0.11, '#FFFFFF') }]}>
        <Icon name={icon} size={18} color={c} />
      </View>
      <View style={styles.body}>
        <Txt style={[styles.b, hl && styles.hlB]}>{title}</Txt>
        <Txt style={styles.small}>{sub}</Txt>
      </View>
      {right}
      <Icon name="chev" size={16} color="#AEB7C3" />
    </Pressable>
  );
}

export function MePill({ children, g }: { children: React.ReactNode; g?: boolean }): React.JSX.Element {
  return (
    <View style={[styles.pill, g && styles.pillG]}>
      <Txt style={[styles.pillT, g && styles.pillGT]}>{children}</Txt>
    </View>
  );
}

export function MeVal({ children }: { children: React.ReactNode }): React.JSX.Element {
  return <Txt style={styles.val}>{children}</Txt>;
}

export function MeOk(): React.JSX.Element {
  return (
    <View style={styles.ok}>
      <View style={styles.okI} />
      <Txt style={styles.okT}>All good</Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  grp: { marginTop: 24 },
  h4: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.68, textTransform: 'uppercase', color: '#8A93A0', marginHorizontal: 4, marginBottom: 8 },
  card: { backgroundColor: '#fff', borderRadius: 18, boxShadow: '0px 0px 0px 1px #E6EBF1', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 16 },
  rowLine: { borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  hl: { backgroundImage: 'linear-gradient(90deg, #FFF6E8, #FFFFFF 70%)' },
  ri: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, minWidth: 0 },
  b: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: '#14161C' },
  hlB: { color: '#B86E00' },
  small: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 2 },
  pill: { minWidth: 26, height: 22, paddingHorizontal: 7, borderRadius: 11, backgroundColor: '#EEEBFC', alignItems: 'center', justifyContent: 'center' },
  pillG: { backgroundColor: '#E2F5F1' },
  pillT: { ...font('sans', 800), fontSize: 11.5, lineHeight: 16.675, color: '#6C5DD3' },
  pillGT: { color: '#0E9A8A' },
  val: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#7A8494' },
  ok: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  okI: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#2F9E62' },
  okT: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#2F8A4A' },
});
