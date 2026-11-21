// Source: PrepAssist.html L7472-L7487 (VIEWS.account), L7390-L7401 (acPersonal, barcode), L6143 (initials)
// Source: PrepAssist.html L3356-L3400 (.ac-*), L9340 (ds-handoff .ac-out/.ac-del), L3380-L3381 (.ac-sec .fl)
// Computed from reference/android/view-account and view-account-edit (values in the styles below).
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { act } from '../../actions';
import { Field, Icon, Logo } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import type { ViewDef } from '../../navigation/routes';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';
import { AcHolo } from './AcHolo';
import { ME } from './mePage';

const BAR = Array.from({ length: 34 }, (_, i) => [1, 2, 1, 3, 1, 1, 2][i % 7]);
const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });

/** .ac-guil: two repeating-radial-gradients of 1 px white rings, opacity .14 (box 372 x 212.33). */
function Guilloche({ w, h }: { w: number; h: number }): React.JSX.Element {
  const rings = (
    cx: number,
    cy: number,
    gap: number,
    period: number,
  ): React.ReactNode[] => {
    const far = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(w - cx, cy),
      Math.hypot(cx, h - cy),
      Math.hypot(w - cx, h - cy),
    );
    const out: React.ReactNode[] = [];
    for (let r = gap + 0.5; r < far + period; r += period) {
      out.push(
        <Circle
          key={`${cx}.${r}`}
          cx={cx}
          cy={cy}
          r={r}
          stroke="#fff"
          strokeWidth={1}
          fill="none"
        />,
      );
    }
    return out;
  };
  return (
    <Svg width={w} height={h} style={s.guil} pointerEvents="none">
      {rings(w * 1.1, h * 1.2, 9, 10)}
      {rings(-w * 0.1, -h * 0.2, 13, 14)}
    </Svg>
  );
}

function Personal(): React.JSX.Element {
  const edit = useStore(st => st.me.edit);
  const name = useStore(st => st.user.name);
  const phone = useStore(st => st.me.phone);
  const [n, setN] = useState(name);
  const [ph, setPh] = useState(phone);
  if (edit) {
    return (
      <View style={s.sec}>
        <View style={s.sh}>
          <Txt style={ME.h6}>Personal details</Txt>
          <Pressable
            style={s.lnk}
            onPress={() => act('acCancel')}
            testID="account.cancel"
          >
            <Txt style={s.lnkT}>Cancel</Txt>
          </Pressable>
        </View>
        <Field
          label="Full name"
          value={n}
          onChangeText={setN}
          radius={12}
          style={s.fl}
          autoFocus
          testID="account.name"
        />
        <Field
          label="Phone (+91)"
          value={ph}
          onChangeText={setPh}
          radius={12}
          style={s.fl}
          inputMode="tel"
          testID="account.phone"
        />
        <Pressable
          style={[s.wide, s.save]}
          onPress={() => act('acSave', undefined, { name: n, phone: ph })}
          testID="account.save"
        >
          <Icon name="check" size={16} color="#fff" />
          <Txt style={[s.wideT, { color: '#fff' }]}>Save changes</Txt>
        </Pressable>
      </View>
    );
  }
  const kv: [string, string][] = [
    ['Full name', name],
    ['Phone', '+91 ' + phone],
    ['Target', 'UPSC CSE 2027 · IAS'],
    ['Optional', 'Sociology'],
  ];
  return (
    <View style={s.sec}>
      <View style={s.sh}>
        <Txt style={ME.h6}>Personal details</Txt>
        <Pressable
          style={s.lnk}
          onPress={() => {
            setN(name);
            setPh(phone);
            act('acEdit');
          }}
          testID="account.edit"
        >
          <Icon name="pen" size={13} color="#1B8AD3" />
          <Txt style={s.lnkT}>Edit</Txt>
        </Pressable>
      </View>
      {kv.map(([k, v]) => (
        <View key={k} style={[s.kv, s.kvTop]}>
          <Txt style={s.kvK}>{k}</Txt>
          <Txt style={s.kvV}>{v}</Txt>
        </View>
      ))}
    </View>
  );
}

function Row({
  ri,
  icon,
  logo,
  title,
  sub,
  after,
  first,
}: {
  ri: 'g' | 'b' | 'o' | 'v';
  icon?: IconName;
  logo?: boolean;
  title: string;
  sub: string;
  after: React.ReactNode;
  first: boolean;
}): React.JSX.Element {
  const c = RI[ri];
  return (
    <View style={[s.row, !first && s.rowNext]}>
      <View style={[s.ri, { backgroundColor: c.bg }]}>
        {logo ? (
          <Logo size={18} />
        ) : icon ? (
          <Icon name={icon} size={18} color={c.fg} />
        ) : null}
      </View>
      <View style={s.rowBody}>
        <Txt style={s.rowB} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Txt>
        <Txt style={s.rowS}>{sub}</Txt>
      </View>
      {after}
    </View>
  );
}

function Badge({
  ok,
  icon,
  label,
}: {
  ok?: boolean;
  icon?: IconName;
  label: string;
}): React.JSX.Element {
  const fg = ok ? '#2F8A4A' : '#5B6472';
  return (
    <View style={[s.badge, { backgroundColor: ok ? '#E6F4EA' : '#F1F5FA' }]}>
      {icon ? <Icon name={icon} size={12} color={fg} /> : null}
      <Txt style={[s.badgeT, { color: fg }]}>{label}</Txt>
    </View>
  );
}

function AccountScreen(): React.JSX.Element {
  const name = useStore(st => st.user.name);
  const email = useStore(st => st.user.email);
  const [card, setCard] = useState({ w: 372, h: 212.33 });
  const initials = name
    .split(' ')
    .map(x => x[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View style={ME.page}>
      <View
        style={s.card}
        onLayout={e =>
          setCard({
            w: e.nativeEvent.layout.width,
            h: e.nativeEvent.layout.height,
          })
        }
      >
        <Guilloche w={card.w} h={card.h} />
        <View style={s.ch}>
          <View style={s.lg}>
            <Logo size={21} />
          </View>
          <View style={s.chBody}>
            <Txt style={s.chB}>PrepAssist</Txt>
            <Txt style={s.chS}>Aspirant identity card</Txt>
          </View>
          <Txt style={s.yr}>{'CSE\n2027'}</Txt>
        </View>
        <View style={s.cb}>
          <View style={s.ph}>
            <Txt style={s.phT}>{initials}</Txt>
          </View>
          <View style={s.fd}>
            <Txt style={s.fdS}>Name</Txt>
            <Txt style={s.fdB} numberOfLines={1} ellipsizeMode="tail">
              {name}
            </Txt>
            <Txt style={s.fdS}>Aspirant no.</Txt>
            <Txt style={[s.fdB, s.mono]} numberOfLines={1} ellipsizeMode="tail">
              PA-27-04182
            </Txt>
          </View>
          <AcHolo style={s.holo} />
        </View>
        <View style={s.cf}>
          <View style={s.bar}>
            {BAR.map((w, i) => (
              <View key={i} style={{ width: w, backgroundColor: '#fff' }} />
            ))}
          </View>
          <View style={s.seal}>
            <Icon name="check" size={12} strokeWidth={2.4} color="#B6F2D2" />
            <Txt style={s.sealT}>Verified</Txt>
          </View>
        </View>
      </View>
      <Personal />
      <View style={s.sec}>
        <Txt style={[ME.h6, s.h6]}>Email</Txt>
        <Row
          ri="g"
          icon="mail"
          title={email}
          sub="Used for sign-in and receipts"
          first
          after={<Badge ok icon="check" label="Verified" />}
        />
      </View>
      <View style={s.sec}>
        <Txt style={[ME.h6, s.h6]}>Security</Txt>
        <Row
          ri="b"
          icon="lock"
          title="Password"
          sub="Encrypted with Firebase Auth · changed 18 Oct"
          first
          after={<Badge icon="lock" label="Locked" />}
        />
        <Row
          ri="o"
          icon="device"
          title="This device"
          sub="iPhone · active now"
          first={false}
          after={<View style={s.dot} />}
        />
        <Pressable
          style={[s.wide, s.wideGrey]}
          onPress={() => act('forgot')}
          testID="account.reset"
        >
          <Icon name="refresh" size={16} color="#14161C" />
          <Txt style={s.wideT}>Send password reset link</Txt>
        </Pressable>
      </View>
      <View style={s.sec}>
        <Txt style={[ME.h6, s.h6]}>About</Txt>
        <Row
          ri="v"
          logo
          title="PrepAssist v1.0.9"
          sub="Release build · iOS"
          first
          after={<Badge ok label="Up to date" />}
        />
      </View>
      <View style={s.danger}>
        <Pressable
          style={[s.dBtn, s.out]}
          onPress={() => act('logout')}
          testID="account.logout"
        >
          <Icon name="logout" size={17} color="#C0392B" />
          <Txt style={[s.dT, { color: '#C0392B' }]}>Log out</Txt>
        </Pressable>
        <Pressable
          style={[s.dBtn, s.del]}
          onPress={() => act('delAsk')}
          testID="account.delete"
        >
          <Icon name="trash" size={17} color="#fff" />
          <Txt style={[s.dT, { color: '#fff' }]}>Delete account</Txt>
        </Pressable>
      </View>
    </View>
  );
}

const RI = {
  g: { bg: '#E6F4EA', fg: '#2F8A4A' },
  b: { bg: '#EAF4FC', fg: '#1B8AD3' },
  o: { bg: '#FFF1DC', fg: '#D97F06' },
  v: { bg: '#F1F5FA', fg: '#25272D' },
} as const;

const s = StyleSheet.create({
  card: {
    overflow: 'hidden',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderRadius: 20,
    backgroundImage:
      'radial-gradient(70% 90% at 100% 0%, rgba(245, 160, 31, 0.35), transparent 60%), linear-gradient(140deg, #14304F, #1B5A93 55%, #1B8AD3)',
    boxShadow: '0px 22px 36px -22px rgba(20, 48, 79, 0.9)',
  },
  guil: { position: 'absolute', left: 0, top: 0, opacity: 0.14 },
  ch: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  lg: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chBody: { flex: 1 },
  chB: {
    ...font('sans', 700),
    fontSize: 14.5,
    lineHeight: 21.025,
    color: '#fff',
  },
  chS: {
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 1.47,
    textTransform: 'uppercase',
    color: '#fff',
    opacity: 0.75,
  },
  yr: {
    ...font('serif', 800),
    fontSize: 12.5,
    lineHeight: 13.125,
    textAlign: 'right',
    color: '#FFD27A',
  },
  cb: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 16 },
  ph: {
    width: 64,
    height: 76,
    borderRadius: 12,
    backgroundImage: 'linear-gradient(160deg, #FFFFFF, #DCEBF8)',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 0px 0px 3px rgba(255, 255, 255, 0.25)',
  },
  phT: {
    ...font('serif', 800),
    fontSize: 22,
    lineHeight: 31.9,
    color: '#1B6FB3',
  },
  fd: { flex: 1, minWidth: 0 },
  fdS: {
    ...font('sans', 700),
    fontSize: 9.5,
    lineHeight: 13.775,
    letterSpacing: 1.52,
    textTransform: 'uppercase',
    color: '#fff',
    opacity: 0.7,
  },
  fdB: {
    ...font('serif', 800),
    fontSize: 20,
    lineHeight: 29,
    letterSpacing: -0.4,
    color: '#fff',
    marginTop: 1,
    marginBottom: 7,
  },
  mono: {
    fontFamily: MONO,
    fontWeight: '600',
    fontSize: 13.5,
    lineHeight: 19.575,
    letterSpacing: 0.81,
  },
  holo: { position: 'absolute', right: 0, top: 4 },
  cf: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 14,
  },
  bar: { flexDirection: 'row', gap: 2, height: 22, opacity: 0.85 },
  seal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 24,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(63, 208, 138, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(63, 208, 138, 0.5)',
  },
  sealT: {
    ...font('sans', 800),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 0.63,
    textTransform: 'uppercase',
    color: '#B6F2D2',
  },
  sec: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 18,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  h6: { marginBottom: 6 },
  sh: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  lnk: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lnkT: {
    ...font('sans', 700),
    fontSize: 12.5,
    lineHeight: 18.125,
    color: '#1B8AD3',
  },
  kv: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
  },
  kvTop: { borderTopWidth: 1, borderTopColor: '#F1F4F8' },
  kvK: { fontSize: 13.5, lineHeight: 19.575, color: '#7A8494' },
  kvV: {
    ...font('sans', 600),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14161C',
    textAlign: 'right',
  },
  fl: { marginTop: 10 },
  wide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 44,
    marginTop: 12,
    borderRadius: 12,
  },
  save: { backgroundColor: '#1B8AD3' },
  wideGrey: { backgroundColor: '#F1F5FA' },
  wideT: {
    ...font('sans', 700),
    fontSize: 13.5,
    lineHeight: 19.575,
    color: '#14161C',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  rowNext: { borderTopWidth: 1, borderTopColor: '#F1F4F8', paddingTop: 12 },
  ri: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1, minWidth: 0 },
  rowB: {
    ...font('sans', 600),
    fontSize: 14.5,
    lineHeight: 21.025,
    color: '#14161C',
  },
  rowS: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginTop: 2 },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 24,
    paddingHorizontal: 9,
    borderRadius: 12,
  },
  badgeT: {
    ...font('sans', 800),
    fontSize: 10.5,
    lineHeight: 15.225,
    letterSpacing: 0.42,
    textTransform: 'uppercase',
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#2F9E62',
    boxShadow: '0px 0px 0px 4px #E6F4EA',
  },
  danger: { flexDirection: 'row', gap: 10, marginTop: 20 },
  // .ac-out/.ac-del with ds-handoff L9340: height var(--ds-btn) 46, radius var(--ds-r-tile) 14, 14.5px 600
  dBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 46,
    borderRadius: 14,
  },
  out: { backgroundColor: '#fff', boxShadow: '0px 0px 0px 1px #F3D1CE' },
  del: { backgroundColor: '#7F1D1D' },
  dT: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025 },
});

const view: ViewDef = {
  useTitle: () => 'Account details',
  Screen: AccountScreen,
};

export default view;
