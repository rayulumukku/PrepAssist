// Source: PrepAssist.html L7538-L7546 (VIEWS.settings), L7620-L7625 (A.meTog)
// Source: PrepAssist.html L3326-L3336 (.me-grp, .me-card, .me-ri, .st-row), L3340 (.me-val), L3589-L3592 (.st-*), L9330-L9332 (ds-handoff .me-ri)
// Computed from reference/android/view-settings. Private copies of .me-grp/.me-card/.me-ri/.st-row.
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import type { ViewDef } from '../../navigation/routes';
import { useStore } from '../../store';
import type { Me } from '../../store/slices/account';
import { font, Txt } from '../../theme';
import { ME, mixWhite } from './mePage';
import { Tog } from './Tog';

type K = 'haptics' | 'sound' | 'push' | 'plan7' | 'nudges' | 'dataSaver' | 'wifi' | 'bigText' | 'motion';
type Row = [IconName, string, string, string, K];

const GROUPS: [string, Row[]][] = [
  [
    'Feel',
    [
      ['phone', '#6C5DD3', 'Haptic feedback', 'A gentle tap when you answer or swipe', 'haptics'],
      ['volume', '#1B8AD3', 'Sound effects', 'Page turns and completion chimes', 'sound'],
    ],
  ],
  [
    'Notifications',
    [
      ['bell', '#E8890C', 'Push notifications', 'Announcements, live classes and results', 'push'],
      ['clock', '#E8890C', 'Morning plan · 7:00', 'Your day’s plan when you wake up', 'plan7'],
      ['layers', '#E8890C', 'Revision nudges', 'Reminders before you forget a topic', 'nudges'],
    ],
  ],
  [
    'Data & storage',
    [
      ['wifi', '#0E9A8A', 'Data saver', 'Limit background sync on mobile data', 'dataSaver'],
      ['download', '#0E9A8A', 'Download on Wi-Fi only', 'Lectures and PDFs for offline use', 'wifi'],
    ],
  ],
  [
    'Display',
    [
      ['type', '#3B5BCC', 'Larger reading text', 'Bigger type in articles and notes', 'bigText'],
      ['motion', '#3B5BCC', 'Reduce motion', 'Fewer animations across the app', 'motion'],
    ],
  ],
];

export function MeRi({ icon, c }: { icon: IconName; c: string }): React.JSX.Element {
  return (
    <View style={[s.ri, { backgroundColor: mixWhite(c, 0.11) }]}>
      <Icon name={icon} size={18} color={c} />
    </View>
  );
}

function StRow({ r, first, me }: { r: Row; first: boolean; me: Me }): React.JSX.Element {
  const [i, c, t, sub, k] = r;
  return (
    <View style={[s.row, !first && s.next]}>
      <MeRi icon={i} c={c} />
      <View style={s.body}>
        <Txt style={s.b}>{t}</Txt>
        <Txt style={s.small}>{sub}</Txt>
      </View>
      <Tog on={!!me[k]} onPress={() => act('meTog:' + k)} label={t} testID={`settings.${k}`} />
    </View>
  );
}

function SettingsScreen(): React.JSX.Element {
  const me = useStore(st => st.me);
  return (
    <View style={ME.page}>
      {GROUPS.map(([h, rows]) => (
        <View key={h} style={s.grp}>
          <Txt style={s.h4}>{h}</Txt>
          <View style={s.card}>
            {rows.map((r, n) => (
              <StRow key={r[4]} r={r} first={n === 0} me={me} />
            ))}
            {h === 'Data & storage' ? (
              <Pressable style={[s.row, s.next]} onPress={() => act('toast:Cleared · 312 MB freed')} testID="settings.clear">
                <MeRi icon="trash" c="#0E9A8A" />
                <View style={s.body}>
                  <Txt style={s.b}>Clear downloads</Txt>
                  <Txt style={s.small}>Offline lectures and cached PDFs</Txt>
                </View>
                <Txt style={s.val}>312 MB</Txt>
              </Pressable>
            ) : null}
          </View>
        </View>
      ))}
      <Txt style={s.foot}>Settings sync to your account on every device.</Txt>
    </View>
  );
}

const s = StyleSheet.create({
  grp: { marginTop: 24 },
  h4: {
    ...font('sans', 800),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 1.68,
    textTransform: 'uppercase',
    color: '#8A93A0',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  card: { backgroundColor: '#fff', borderRadius: 18, boxShadow: '0px 0px 0px 1px #E6EBF1', overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 14 },
  next: { borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  ri: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1, minWidth: 0 },
  b: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: '#14161C' },
  small: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 2 },
  val: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#7A8494' },
  foot: { fontSize: 12.5, lineHeight: 18.125, color: '#9AA3AF', textAlign: 'center', marginTop: 22 },
});

const view: ViewDef = {
  useTitle: () => 'App settings',
  Screen: SettingsScreen,
};

export default view;
