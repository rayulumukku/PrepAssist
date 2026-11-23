// Source: PrepAssist.html L8248-L8249 (lxHead), L8277-L8321 (renderLearn: the numbered .lx-sec sections, shelf, toolkit), L10064-L10071 (the X-Ray card shows XSC[0])
// Source: PrepAssist.html L4499-L4505 (.lx-sec, .lx-sh, .lx-n), L4513-L4532 (.lx-xr … .lx-more), L4570-L4593 (.lx-feat, .lx-doc, .lx-nlist), L1897-L1909 + L1976-L1986 (.l-h, .l-shelf, .l-files)
// Values: reference/android/tab-learn/dom.json (computed; later rules override the CSS listed here):
//   .lx-sec     margin-top 28; .lx-sh row centred gap 12, margin-bottom 12; .lx-n 38 radius 12 var(--a), shadow 0 8 16 -8 var(--a),
//               Inter Tight 800 13.5 #fff; small Inter 800 10.5/15.225 ls 1.47 uppercase var(--a); h2 Inter 700 18/21.6 ls -.18 margin-top 2;
//               button Inter 600 13.5/19.575 var(--a) + arrow 13, gap 4
//   .lx-feat    row centred gap 16, padding 16 16 16 18, radius 24, radial(90% 90% at 0% 100%, color-mix(--nc 16%, transparent), transparent 60%)
//               + linear(135deg, color-mix(--nc 7%, #fff), #fff), ring 1 color-mix(--nc 20%, #E6EBF1), 0 16 26 -22 --nc
//   .lx-docs    86 x 112; .lx-doc.b rotate(-8deg) translate(-8,4) color-mix(--nc 14%, #fff) ring 1 color-mix(--nc 25%, #fff);
//               .lx-doc rotate(3deg) #fff, shadow 0 10 18 -10 rgba(20,30,50,.45) + ring #E6EBF1, padding 30 9 8, radius 6;
//               .lx-db 22 high linear(90deg, #14304F, --nc); em 7/10.15 800 ls .7 --nc margin-bottom 5; i 3.5 high #E3E8EE margin-top 5, .s 62 %, .m 80 % color-mix(--nc 35%, #fff)
//   .lx-fi      small 10.5 800 ls 1.26 --nc; b EB Garamond 500 20/23.6 margin-top 5; span 12.5 #7A8494 margin-top 5;
//               .lx-fp 5 high color-mix(--nc 12%, #fff) margin-top 12; em Inter 700 11.5 #3A404B margin-top 5
//   .lx-nlist   margin-top 10, #fff radius 18 ring #E6EBF1; rows padding 13 16 gap 12, + border-top 1 #EEF2F6; .lx-ni 38 radius 12 color-mix(--nc 11%, #fff);
//               b Inter 600 14.5/21.025 nowrap; small 12.5/18.125 #7A8494; em 11.5 800 --nc on color-mix(--nc 10%, #fff) padding 3 7 radius 7; else chev 16 #AEB7C3
//   .lx-xr      row gap 14, padding 14, radius 24, radial(80% 80% at 100% 0%, rgba(43,163,234,.45), transparent 60%) + linear(150deg, #0B2747, #123B66 60%, #1660A0),
//               shadow 0 20 30 -22 rgba(11,39,71,.9); .lx-page 118 wide, padding 22 10 10, radius 10, #fff, shadow 0 10 20 -10 rgba(0,0,0,.5);
//               .lx-beam 26 high linear(180deg, transparent, rgba(27,138,211,.28) 80%, #1B8AD3), lxBeam 3.2s ease-in-out infinite
//   .lx-two     2 columns gap 8, margin-top 10; buttons 46 high radius 14 #fff ring #E1E8F0, Inter 600 14.5 #14161C, icon 16 #1B8AD3
//   .lx-drop    padding 12 radius 18 #fff ring 1.5 #F5D59A + 135deg stripes rgba(245,160,31,.05) every 20 px, margin-bottom 14
//   .l-files    margin 0 -16, padding 0 16 2, gap 10; button 104 wide; .l-doc 118 high radius 8 border 1 #E1E8F0 padding 14 10
//   .l-h        h2 Inter 700 18/21.6; button Inter 600 13.5 #1B8AD3 (3 below the h2 top: baseline)
//   .l-cv       150 high radius 4 10 10 4, padding 12 10 10 14, linear(165deg, color-mix(--c 72%, #fff), --c 55%, color-mix(--c 70%, #0B1530)), shadow 0 12 20 -14 --c
//   .lx-more    3 columns gap 8; buttons padding 14 6 12 radius 18 #fff ring #E6EBF1, gap 8; span 38 radius 12 color-mix(--tc 12%, #fff); b Inter 700 11.5/14.375 #25272D; .all #14161C
import React, { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import Svg, { Defs, Pattern, Rect } from 'react-native-svg';
import { act } from '../../../actions';
import { Icon, Logo } from '../../../components';
import type { IconName } from '../../../icons/iconPaths.generated';
import { COURSES, MT, NOTESYS, SUBJ } from '../../../data';
import { useStore } from '../../../store';
import { cssColor, font, Txt, useTheme } from '../../../theme';
import { mAct, mix, seenN, subN, vaultMB } from './learnLogic';
import { TrackerPeek } from './TrackerPeek';

const INK = '#14161C';

/** lxHead(i, eb, title, act, btn) L8249 */
function LxHead({ i, eb, title, a, onPress, btn }: { i: number; eb: string; title: string; a: string; onPress: () => void; btn: string }): React.JSX.Element {
  return (
    <View style={styles.sh}>
      <View style={[styles.n, { backgroundColor: a, boxShadow: `0px 8px 16px -8px ${a}` }]}>
        <Txt style={styles.nT}>0{i}</Txt>
      </View>
      <View style={styles.flex1}>
        <Txt style={[styles.shSmall, { color: a }]}>{eb}</Txt>
        <Txt style={styles.shH2}>{title}</Txt>
      </View>
      <Pressable style={styles.shBtn} onPress={onPress} testID={`learn.sec${i}.open`}>
        <Txt style={[styles.shBtnT, { color: a }]}>{btn}</Txt>
        <Icon name="arrow" size={13} color={a} />
      </Pressable>
    </View>
  );
}

// ---------------------------------------------------------------- 01 Notes

export function NotesSection(): React.JSX.Element {
  const nsRead = useStore(s => s.nsRead) as unknown as Readonly<Record<string, number>>;
  const f = NOTESYS.find(n => nsRead[n.id] && nsRead[n.id] < 100) || NOTESYS[0];
  const pc = nsRead[f.id] || 0;
  const nc = f.c;
  return (
    <View style={styles.sec}>
      <LxHead i={1} eb="Notes" title="Faculty compendiums" a="#6C5DD3" btn="All" onPress={() => act('push:notesys')} />
      <Pressable
        style={[
          styles.feat,
          {
            backgroundImage: `radial-gradient(90% 90% at 0% 100%, ${mix(nc, 0.16, 'transparent')}, transparent 60%), linear-gradient(135deg, ${mix(nc, 0.07, '#FFFFFF')}, #FFFFFF)`,
            boxShadow: `0px 0px 0px 1px ${mix(nc, 0.2, '#E6EBF1')}, 0px 16px 26px -22px ${nc}`,
          },
        ]}
        onPress={() => act('push:note2:' + f.id)}
        testID="learn.notes.feature"
      >
        <View style={styles.docs}>
          <View style={[styles.doc, styles.docB, { backgroundColor: mix(nc, 0.14, '#FFFFFF'), boxShadow: `0px 0px 0px 1px ${mix(nc, 0.25, '#FFFFFF')}` }]} />
          <View style={[styles.doc, styles.docF]}>
            <View style={[styles.db, { backgroundImage: `linear-gradient(90deg, #14304F, ${nc})` }]}>
              <View style={styles.dbLogo}>
                <Logo size={9} />
              </View>
            </View>
            <Txt style={[styles.docEm, { color: nc }]}>{f.subj.split(' ')[0]}</Txt>
            <View style={styles.docI} />
            <View style={[styles.docI, styles.docS]} />
            <View style={styles.docI} />
            <View style={[styles.docI, styles.docM, { backgroundColor: mix(nc, 0.35, '#FFFFFF') }]} />
            <View style={styles.docI} />
            <View style={[styles.docI, styles.docS]} />
          </View>
        </View>
        <View style={styles.fi}>
          <Txt style={[styles.fiSmall, { color: nc }]}>{pc ? 'Continue reading' : 'Start reading'}</Txt>
          <Txt style={styles.fiB}>{f.t}</Txt>
          <Txt style={styles.fiSpan}>
            {f.subj} · {f.min} min
          </Txt>
          <View style={[styles.fp, { backgroundColor: mix(nc, 0.12, '#FFFFFF') }]}>
            <View style={[styles.fpI, { width: `${pc}%`, backgroundColor: nc }]} />
          </View>
          <Txt style={styles.fiEm}>{pc}% read</Txt>
        </View>
      </Pressable>
      <View style={styles.nlist}>
        {NOTESYS.filter(n => n !== f)
          .slice(0, 3)
          .map((n, i) => (
            <Pressable key={n.id} style={[styles.nrow, i > 0 && styles.nrowLine]} onPress={() => act('push:note2:' + n.id)} testID={`learn.notes.${n.id}`}>
              <View style={[styles.ni, { backgroundColor: mix(n.c, 0.11, '#FFFFFF') }]}>
                <Icon name={n.ic as IconName} size={18} color={n.c} />
              </View>
              <View style={styles.flex1}>
                <Txt style={styles.nB} numberOfLines={1}>
                  {n.t}
                </Txt>
                <Txt style={styles.nS}>
                  {n.subj} · {n.min} min{n.pyq ? ` · ${n.pyq} PYQs` : ''}
                </Txt>
              </View>
              {nsRead[n.id] ? (
                <View style={[styles.nEm, { backgroundColor: mix(n.c, 0.1, '#FFFFFF') }]}>
                  <Txt style={[styles.nEmT, { color: n.c }]}>{nsRead[n.id]}%</Txt>
                </View>
              ) : (
                <Icon name="chev" size={16} color="#AEB7C3" />
              )}
            </Pressable>
          ))}
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- 02 X-Ray

const XR_LINES: readonly [string, number][] = (['', 'p', '', 'k', 'p', '', 'h', '', 'k', 'p', ''] as const).map((t, i) => [
  t,
  [92, 86, 74, 90, 80, 68, 88, 76, 84, 90, 54][i],
]);

function Mark({ k }: { k: string }): React.JSX.Element {
  return <View style={[styles.mark, k === 'p' ? styles.markP : k === 'k' ? styles.markK : styles.markH]} />;
}

const easeIO = Easing.bezier(0.42, 0, 0.58, 1);

/** .lx-beam: @keyframes lxBeam{0%{translateY(-30px)}60%{translateY(130px)}100%{translateY(130px);opacity:0}}, 3.2s ease-in-out infinite */
function Beam(): React.JSX.Element {
  const p = useSharedValue(0);
  useEffect(() => {
    p.value = withRepeat(withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 1920, easing: easeIO }), withTiming(2, { duration: 1280, easing: easeIO })), -1);
  }, [p]);
  const anim = useAnimatedStyle(() => ({
    opacity: p.value <= 1 ? 1 : 2 - p.value,
    transform: [{ translateY: p.value <= 1 ? -30 + 160 * p.value : 130 }],
  }));
  return <Animated.View style={[styles.beam, anim]} pointerEvents="none" />;
}

export function XraySection(): React.JSX.Element {
  const xsc = useStore(s => s.XSC);
  const seen = useStore(s => s.x4.seen);
  const sc = xsc[0];
  const n = sc.ins.length;
  return (
    <View style={styles.sec}>
      <LxHead i={2} eb="X-Ray Reading" title="See what the examiner sees" a="#1B8AD3" btn="Library" onPress={() => act('push:xrayhome')} />
      <Pressable style={styles.xr} onPress={() => act('push:xray:' + sc.id)} testID="learn.xray.card">
        <View style={styles.page}>
          <Txt style={styles.pt}>p. 7.14</Txt>
          {XR_LINES.map(([t, w], i) => (
            <View key={i} style={[styles.line, t === 'p' ? styles.markP : t === 'k' ? styles.markK : t === 'h' ? styles.markH : null, t ? styles.lineTall : null, { width: `${w}%` }]} />
          ))}
          <Beam />
        </View>
        <View style={styles.xs}>
          <Txt style={styles.xsSmall}>Last X-Ray · {subN(sc.s)}</Txt>
          <Txt style={styles.xsB}>{sc.t}</Txt>
          <Txt style={styles.xsSpan}>
            {sc.src.split(' · ')[0]} · {sc.d}
          </Txt>
          <View style={styles.leg}>
            <View style={styles.legRow}>
              <Mark k="h" />
              <Txt style={styles.legT}>{n} key insights</Txt>
            </View>
            <View style={styles.legRow}>
              <Mark k="k" />
              <Txt style={styles.legT}>{Object.keys(sc.terms).length} statutory terms</Txt>
            </View>
            <View style={styles.legRow}>
              <Mark k="p" />
              <Txt style={styles.legT}>
                {seenN(sc, seen)} of {n} explored
              </Txt>
            </View>
          </View>
          <View style={styles.xsEm}>
            <Txt style={styles.xsEmT}>Continue reading</Txt>
            <Icon name="arrow" size={14} color="#FFD27A" />
          </View>
        </View>
      </Pressable>
      <View style={styles.two}>
        <Pressable style={styles.twoBtn} onPress={() => act('push:xrayhome')} testID="learn.xray.new">
          <Icon name="xray" size={16} color="#1B8AD3" />
          <Txt style={styles.twoT}>X-Ray a new PDF</Txt>
        </Pressable>
        <Pressable style={styles.twoBtn} onPress={() => act('lxPyq')} testID="learn.xray.pyq">
          <Icon name="test" size={16} color="#1B8AD3" />
          <Txt style={styles.twoT}>Practise 5 PYQs</Txt>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------- 03 Notes Tracker

export function TrackerSection(): React.JSX.Element {
  return (
    <View style={styles.sec}>
      <LxHead i={3} eb="Notes Tracker" title="Your notes, kept up to date" a="#2F8A4A" btn="Tracker" onPress={() => act('push:tracker')} />
      <TrackerPeek />
    </View>
  );
}

// ---------------------------------------------------------------- 04 Cloud Upload

/** .lx-drop background-image: repeating-linear-gradient(135deg, transparent 0 10px, rgba(245,160,31,.05) 10px 20px) */
function DropStripes(): React.JSX.Element {
  const s = 10 * Math.SQRT2;
  return (
    <Svg style={StyleSheet.absoluteFill}>
      <Defs>
        <Pattern id="lxDrop" patternUnits="userSpaceOnUse" width={2 * s} height={2 * s} patternTransform="rotate(45)">
          <Rect x={s} y={0} width={s} height={2 * s} fill="rgba(245,160,31,0.05)" />
        </Pattern>
      </Defs>
      <Rect x={0} y={0} width="100%" height="100%" fill="url(#lxDrop)" />
    </Svg>
  );
}

export function CloudSection(): React.JSX.Element {
  const t = useTheme();
  const docs = useStore(s => s.DOCS);
  const mb = vaultMB(docs);
  return (
    <View style={styles.sec}>
      <LxHead i={4} eb="Cloud Upload" title="Your library, everywhere" a="#E8890C" btn="Upload" onPress={() => act('push:upload')} />
      <View style={styles.drop}>
        <DropStripes />
        <Pressable style={styles.dz} onPress={() => act('push:upload')} testID="learn.cloud.drop">
          <View style={styles.dzI}>
            <Icon name="upload" size={20} color="#fff" />
          </View>
          <View style={styles.flex1}>
            <Txt style={styles.dzB}>Drop a PDF, scan or note</Txt>
            <Txt style={styles.dzS}>Indexed for X-Ray, Query and Mains — up to 100 MB</Txt>
          </View>
        </Pressable>
        <View style={styles.qk}>
          {(
            [
              ['lxUp:pdf', 'file', 'PDF'],
              ['lxUp:img', 'camera', 'Scan'],
              ['push:note:new', 'pen', 'Text'],
            ] as const
          ).map(([a, ic, l]) => (
            <Pressable key={l} style={styles.qkBtn} onPress={() => act(a)} testID={`learn.cloud.${l.toLowerCase()}`}>
              <Icon name={ic} size={15} color="#E8890C" />
              <Txt style={styles.qkT}>{l}</Txt>
            </Pressable>
          ))}
        </View>
        <View style={styles.store}>
          <View style={styles.storeTrack}>
            <View style={[styles.storeFill, { width: `${Math.min(100, (mb / 512) * 100)}%` }]} />
          </View>
          <Txt style={styles.storeT}>
            <Txt style={styles.storeB}>{mb.toFixed(1)} MB</Txt> of 512 MB · synced to web & app
          </Txt>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filesScroll} contentContainerStyle={styles.files}>
        {docs.slice(0, 4).map((f, i) => {
          const c = cssColor(f.c, t);
          return (
            <Pressable key={i} style={styles.file} onPress={() => act('push:xray')} testID={`learn.file.${i}`}>
              <View style={styles.ldoc}>
                <View style={styles.ldocEar} />
                <View style={[styles.ldocI, { backgroundColor: c, width: '60%', opacity: 0.7 }]} />
                <View style={styles.ldocI} />
                <View style={[styles.ldocI, { width: '80%' }]} />
                <View style={styles.ldocI} />
                <View style={[styles.ldocEm, { backgroundColor: c }]}>
                  <Txt style={styles.ldocEmT}>{f.k}</Txt>
                </View>
              </View>
              <Txt style={styles.fileB} numberOfLines={2}>
                {f.t.replace(/\.(pdf|jpg)$/i, '')}
              </Txt>
              <Txt style={styles.fileS}>{f.m.split(' · ').slice(-1)[0]}</Txt>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------- On your shelf

function LH({ title, btn, onPress, testID }: { title: string; btn: string; onPress: () => void; testID: string }): React.JSX.Element {
  // .l-h button: var(--brand) (computed rgb(27,138,211) / (106,69,232) / (184,134,27) in the three plan themes)
  const t = useTheme();
  return (
    <View style={styles.lh}>
      <Txt style={styles.lhT}>{title}</Txt>
      <Pressable style={styles.lhBtn} onPress={onPress} testID={testID}>
        <Txt style={[styles.lhBtnT, { color: t.brand }]}>{btn}</Txt>
      </Pressable>
    </View>
  );
}

export function ShelfSection(): React.JSX.Element {
  return (
    <View style={styles.sec}>
      <LH title="On your shelf" btn="All courses" onPress={() => act('push:courses')} testID="learn.shelf.all" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.shelfScroll} contentContainerStyle={styles.shelf}>
        {COURSES.slice(1).map(c => {
          const hex = SUBJ[c.s].hex;
          return (
            <Pressable key={c.id} style={styles.bk2} onPress={() => act('push:course:' + c.id)} testID={`learn.shelf.${c.id}`}>
              <View
                style={[
                  styles.cv,
                  {
                    backgroundImage: `linear-gradient(165deg, ${mix(hex, 0.72, '#FFFFFF')}, ${hex} 55%, ${mix(hex, 0.7, '#0B1530')})`,
                    boxShadow: `0px 12px 20px -14px ${hex}`,
                  },
                ]}
              >
                <View style={styles.cvSpine} />
                <Txt style={styles.cvSmall}>{SUBJ[c.s].n}</Txt>
                <Txt style={styles.cvB}>{c.t}</Txt>
                <View style={[styles.cvI, { width: `${c.p}%` }]} />
              </View>
              <Txt style={styles.bk2Em}>
                {c.p}% · {c.last.split(' · ')[0]}
              </Txt>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------- More in your toolkit

const MORE = ['pqb', 'testquiz', 'answerbank', 'mains', 'current', 'syllabus', 'saved', 'cloud', 'querydb', 'mindmaps', 'notesys'];

export function MoreSection(): React.JSX.Element {
  const cells: React.JSX.Element[] = MORE.map(id => {
    const m = MT[id];
    return (
      <Pressable key={id} style={styles.more} onPress={() => act(mAct(id))} testID={`learn.more.${id}`}>
        <View style={[styles.moreI, { backgroundColor: mix(m.c, 0.12, '#FFFFFF') }]}>
          <Icon name={m.ic as IconName} size={18} color={m.c} />
        </View>
        <Txt style={styles.moreB}>{m.n}</Txt>
      </Pressable>
    );
  });
  cells.push(
    <Pressable key="all" style={[styles.more, styles.moreAll]} onPress={() => act('tab:menu')} testID="learn.more.all">
      <View style={[styles.moreI, styles.moreAllI]}>
        <Icon name="grid" size={18} color="#fff" />
      </View>
      <Txt style={[styles.moreB, styles.moreAllB]}>All tools</Txt>
    </Pressable>,
  );
  const rows: React.JSX.Element[][] = [];
  for (let i = 0; i < cells.length; i += 3) rows.push(cells.slice(i, i + 3));
  return (
    <View style={styles.sec}>
      <LH title="More in your toolkit" btn="Full menu" onPress={() => act('tab:menu')} testID="learn.more.menu" />
      <View style={styles.moreGrid}>
        {rows.map((r, i) => (
          <View key={i} style={styles.moreRow}>
            {r}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1, minWidth: 0 },
  sec: { marginTop: 28 },
  sh: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  n: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nT: { ...font('serif', 800), fontSize: 13.5, lineHeight: 19.575, color: '#fff' },
  shSmall: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.47, textTransform: 'uppercase' },
  shH2: { ...font('sans', 700), fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18, color: INK, marginTop: 2 },
  shBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 10 },
  shBtnT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575 },
  // 01
  feat: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, paddingRight: 16, paddingLeft: 18, borderRadius: 24, overflow: 'hidden' },
  docs: { width: 86, height: 112 },
  doc: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 6, paddingTop: 30, paddingHorizontal: 9, paddingBottom: 8, overflow: 'hidden' },
  docB: { transform: [{ rotate: '-8deg' }, { translateX: -8 }, { translateY: 4 }] },
  docF: { backgroundColor: '#fff', transform: [{ rotate: '3deg' }], boxShadow: '0px 10px 18px -10px rgba(20, 30, 50, 0.45), 0px 0px 0px 1px #E6EBF1' },
  db: { position: 'absolute', left: 0, right: 0, top: 0, height: 22, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 7 },
  dbLogo: { width: 12, height: 12, padding: 1.5, borderRadius: 3, backgroundColor: '#fff' },
  docEm: { ...font('sans', 800), fontSize: 7, lineHeight: 10.15, letterSpacing: 0.7, textTransform: 'uppercase', marginBottom: 5 },
  docI: { height: 3.5, borderRadius: 2, backgroundColor: '#E3E8EE', marginTop: 5 },
  docS: { width: '62%' },
  docM: { width: '80%' },
  fi: { flex: 1, minWidth: 0 },
  fiSmall: { ...font('sans', 800), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase' },
  fiB: { ...font('book', 500), fontSize: 20, lineHeight: 23.6, color: INK, marginTop: 5 },
  fiSpan: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 5 },
  fp: { height: 5, borderRadius: 5, overflow: 'hidden', marginTop: 12 },
  fpI: { height: 5, borderRadius: 5 },
  fiEm: { ...font('sans', 700), fontSize: 11.5, lineHeight: 16.675, color: '#3A404B', marginTop: 5 },
  nlist: { marginTop: 10, backgroundColor: '#fff', borderRadius: 18, boxShadow: '0px 0px 0px 1px #E6EBF1', overflow: 'hidden' },
  nrow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 16 },
  nrowLine: { borderTopWidth: 1, borderTopColor: '#EEF2F6' },
  ni: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  nB: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: INK },
  nS: { fontSize: 12.5, lineHeight: 18.125, color: '#7A8494', marginTop: 2 },
  nEm: { paddingVertical: 3, paddingHorizontal: 7, borderRadius: 7 },
  nEmT: { ...font('sans', 800), fontSize: 11.5, lineHeight: 16.675 },
  // 02
  xr: {
    flexDirection: 'row',
    gap: 14,
    padding: 14,
    borderRadius: 24,
    backgroundImage: 'radial-gradient(80% 80% at 100% 0%, rgba(43,163,234,0.45), transparent 60%), linear-gradient(150deg, #0B2747, #123B66 60%, #1660A0)',
    boxShadow: '0px 20px 30px -22px rgba(11, 39, 71, 0.9)',
  },
  page: {
    width: 118,
    paddingTop: 22,
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    boxShadow: '0px 10px 20px -10px rgba(0, 0, 0, 0.5)',
  },
  pt: { position: 'absolute', left: 10, top: 7, ...font('sans', 700), fontSize: 8.5, lineHeight: 12.325, letterSpacing: 0.34, color: '#9AA3AF' },
  line: { height: 5, marginTop: 6, borderRadius: 3, backgroundColor: '#E3E8EE' },
  lineTall: { height: 9 },
  mark: { width: 14, height: 8, borderRadius: 2 },
  markP: { backgroundColor: '#D3E8F8', boxShadow: 'inset 0px -1.5px 0px 0px #1B8AD3' },
  markK: { backgroundColor: '#E4ECF6', boxShadow: 'inset 0px -1.5px 0px 0px #1667B0' },
  markH: { backgroundColor: '#FFD9A0' },
  beam: { position: 'absolute', left: 0, right: 0, top: 0, height: 26, backgroundImage: 'linear-gradient(180deg, transparent, rgba(27,138,211,0.28) 80%, #1B8AD3 100%)' },
  xs: { flex: 1, minWidth: 0 },
  xsSmall: { ...font('sans', 700), fontSize: 10.5, lineHeight: 15.225, letterSpacing: 1.26, textTransform: 'uppercase', color: '#9FD0F2' },
  xsB: { ...font('book', 500), fontSize: 20, lineHeight: 23, color: '#fff', marginTop: 4 },
  xsSpan: { fontSize: 12.5, lineHeight: 18.125, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  leg: { gap: 5, marginTop: 10 },
  legRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  legT: { ...font('sans', 600), fontSize: 12.5, lineHeight: 18.125, color: '#fff' },
  xsEm: { marginTop: 'auto', paddingTop: 10, flexDirection: 'row', alignItems: 'center', gap: 5 },
  xsEmT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#FFD27A' },
  two: { flexDirection: 'row', gap: 8, marginTop: 10 },
  twoBtn: {
    flex: 1,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E1E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  twoT: { ...font('sans', 600), fontSize: 14.5, lineHeight: 21.025, color: INK },
  // 04
  drop: { padding: 12, marginBottom: 14, borderRadius: 18, backgroundColor: '#fff', boxShadow: '0px 0px 0px 1.5px #F5D59A', overflow: 'hidden' },
  dz: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, backgroundColor: '#FFFBF3', borderWidth: 1, borderStyle: 'dashed', borderColor: '#F0C77A' },
  dzI: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: 'linear-gradient(140deg, #F5A01F, #E8890C)',
    boxShadow: '0px 10px 18px -10px rgba(232, 137, 12, 0.9)',
  },
  dzB: { ...font('sans', 700), fontSize: 14.5, lineHeight: 21.025, color: INK },
  dzS: { fontSize: 11.5, lineHeight: 15.525, color: '#7A8494', marginTop: 2 },
  qk: { flexDirection: 'row', gap: 8, marginTop: 10 },
  qkBtn: {
    flex: 1,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #F1E2C4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  qkT: { ...font('sans', 700), fontSize: 12.5, lineHeight: 18.125, color: '#8A5200' },
  store: { marginTop: 12, paddingHorizontal: 2 },
  storeTrack: { height: 5, borderRadius: 5, backgroundColor: '#F4EBDC', overflow: 'hidden' },
  storeFill: { height: 5, backgroundImage: 'linear-gradient(90deg, #F5A01F, #E8890C)' },
  storeT: { fontSize: 11.5, lineHeight: 16.675, color: '#7A8494', marginTop: 6 },
  storeB: { ...font('sans', 700), color: INK },
  filesScroll: { marginHorizontal: -16 },
  files: { paddingHorizontal: 16, paddingBottom: 2, gap: 10 },
  file: { width: 104 },
  ldoc: {
    height: 118,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E1E8F0',
    paddingVertical: 14,
    paddingHorizontal: 10,
    overflow: 'hidden',
    boxShadow: '0px 8px 14px -12px rgba(20, 50, 90, 0.4)',
  },
  ldocEar: { position: 'absolute', right: 0, top: 0, width: 18, height: 18, backgroundImage: 'linear-gradient(225deg, #F5F7FA 50%, #E1E8F0 50%)' },
  ldocI: { height: 4, borderRadius: 2, backgroundColor: '#EEF2F6', marginBottom: 7 },
  ldocEm: { position: 'absolute', left: 8, bottom: 8, paddingVertical: 2, paddingHorizontal: 6, borderRadius: 4 },
  ldocEmT: { ...font('sans', 800), fontSize: 9, lineHeight: 13.05, color: '#fff' },
  fileB: { ...font('sans', 600), fontSize: 12.5, lineHeight: 16.25, color: INK, marginTop: 8 },
  fileS: { fontSize: 11.5, lineHeight: 16.675, color: '#9AA3AF', marginTop: 2 },
  // shelf
  lh: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  lhT: { ...font('sans', 700), fontSize: 18, lineHeight: 21.6, letterSpacing: -0.18, color: INK },
  lhBtn: { marginTop: 3 },
  lhBtnT: { ...font('sans', 600), fontSize: 13.5, lineHeight: 19.575, textAlign: 'center' },
  shelfScroll: { marginHorizontal: -20 },
  shelf: { paddingHorizontal: 20, paddingBottom: 6, gap: 12 },
  bk2: { width: 112 },
  cv: {
    height: 150,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingTop: 12,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    overflow: 'hidden',
  },
  cvSpine: { position: 'absolute', left: 4, top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(255,255,255,0.3)' },
  cvSmall: { ...font('sans', 800), fontSize: 8.5, lineHeight: 12.325, letterSpacing: 1.02, textTransform: 'uppercase', color: '#fff', opacity: 0.85 },
  cvB: { ...font('book', 500), fontSize: 15.5, lineHeight: 17.825, color: '#fff', marginTop: 6 },
  cvI: { position: 'absolute', left: 0, bottom: 0, height: 4, backgroundColor: '#FFD27A' },
  bk2Em: { ...font('sans', 600), fontSize: 11.5, lineHeight: 16.675, color: '#5B6472', marginTop: 8 },
  // more
  moreGrid: { gap: 8 },
  moreRow: { flexDirection: 'row', gap: 8 },
  more: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingTop: 14,
    paddingHorizontal: 6,
    paddingBottom: 12,
    borderRadius: 18,
    backgroundColor: '#fff',
    boxShadow: '0px 0px 0px 1px #E6EBF1',
  },
  moreI: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  moreB: { ...font('sans', 700), fontSize: 11.5, lineHeight: 14.375, color: '#25272D', textAlign: 'center' },
  moreAll: { backgroundColor: INK, boxShadow: 'none' },
  moreAllI: { backgroundColor: 'rgba(255,255,255,0.12)' },
  moreAllB: { color: '#fff' },
});
