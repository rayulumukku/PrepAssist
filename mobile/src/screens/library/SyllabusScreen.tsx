// Source: PrepAssist.html L7890-L7917 (VIEWS.syllabus)
// Source: PrepAssist.html L4075-L4240 (.sy-hero, .sy-kpi, .cx-fbar, .cx-active, .sy-grp, .sy-gh, .sy-ts, .sy-t)
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { act } from '../../actions';
import { Icon } from '../../components';
import { SUBJ } from '../../data';
import type { ViewDef } from '../../navigation/routes';
import { useStore, setS } from '../../store';
import { font, Txt } from '../../theme';
import { SySearch, TlHero } from './parts';
import { sylAll, sylGroups, sylStatus } from './syllabus/syl';

const GSC: Record<string, string> = { gs1: '#E8890C', gs2: '#1B8AD3', gs3: '#2F8A4A', gs4: '#6C5DD3' };

function SyllabusScreen(): React.JSX.Element {
  const syl = useStore(s => s.syl);
  const sylDone = useStore(s => s.sylDone);
  const all = sylAll(sylDone);
  const groups = sylGroups({ syl, sylDone });

  const cnt = {
    cov: all.filter(x => sylStatus(x) === 'cov').length,
    pen: all.filter(x => sylStatus(x) === 'pen').length,
    na: all.filter(x => sylStatus(x) === 'na').length,
  };
  const qa = all.reduce((s, x) => s + x.a, 0);
  const qt = Math.max(1, all.reduce((s, x) => s + x.c, 0));
  const frac = qa / qt;
  const pctStr = (frac * 100).toFixed(1);

  const R = 40;
  const circ = 2 * Math.PI * R;
  const dashOffset = circ * (1 - Math.max(0.02, Math.min(1, frac)));

  return (
    <View style={s.page} testID="view.syllabus">
      <TlHero
        tc="#3B5BCC"
        icon="hash"
        eb="Syllabus Matrix"
        title="The whole syllabus, "
        em="mapped"
        sub="Every concept, with how much of its question bank you’ve attempted."
      >
        <View style={s.ringWrap}>
          <View style={s.ringBox}>
            <Svg width={96} height={96} viewBox="0 0 96 96" style={s.svgRotate}>
              <Circle cx={48} cy={48} r={R} stroke="rgba(255,255,255,0.18)" strokeWidth={8} fill="none" />
              <Circle
                cx={48}
                cy={48}
                r={R}
                stroke="#FFD27A"
                strokeWidth={8}
                strokeDasharray={`${circ} ${circ}`}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
            <View style={s.ringCenter}>
              <Txt style={s.ringPct}>{`${pctStr}%`}</Txt>
              <Txt style={s.ringSub}>{`${qa.toLocaleString('en-IN')} / ${qt.toLocaleString('en-IN')}`}</Txt>
            </View>
          </View>
        </View>
      </TlHero>

      <View style={s.kpiRow}>
        {[
          ['All', all.length, 'All topics', '#14161C'],
          ['cov', cnt.cov, 'Covered', '#2F8A4A'],
          ['pen', cnt.pen, 'In progress', '#E8890C'],
          ['na', cnt.na, 'Not started', '#7A8494'],
        ].map(([k, v, l, c]) => {
          const isOn = syl.st === k;
          return (
            <Pressable
              key={k}
              style={[s.kpiCard, isOn && s.kpiOn]}
              onPress={() => act('sySt', k as string)}
              testID={`syllabus.kpi.${k}`}
            >
              <Txt style={[s.kpiVal, { color: c as string }]}>{String(v)}</Txt>
              <Txt style={s.kpiLbl}>{l as string}</Txt>
            </Pressable>
          );
        })}
      </View>

      <View style={s.fbar}>
        <SySearch
          placeholder="Search topics — basic structure, inflation…"
          value={syl.q}
          onChangeText={v => setS(st => ({ syl: { ...st.syl, q: v } }))}
          style={s.searchFlex}
          testID="syllabus.search"
        />
        <Pressable
          style={[s.fbtn, syl.p !== 'All' && s.fbtnOn]}
          onPress={() => act('syFilter')}
          testID="syllabus.filter"
        >
          <Icon name="filter" size={18} color={syl.p !== 'All' ? '#1B8AD3' : '#6A7280'} />
          {syl.p !== 'All' ? <View style={s.fbtnDot} /> : null}
        </Pressable>
      </View>

      {syl.p !== 'All' ? (
        <View style={s.activeBar}>
          <Txt style={s.activeTxt}>Showing</Txt>
          <Pressable style={s.activePill} onPress={() => act('syP', 'All')} testID="syllabus.activePaper">
            <Txt style={[s.activePillTx, { color: GSC[syl.p] || '#14161C' }]}>
              {syl.p.toUpperCase().replace('GS', 'GS ')}
            </Txt>
            <Icon name="close" size={14} color="#7A8494" />
          </Pressable>
        </View>
      ) : null}

      <View style={s.listWrap}>
        {groups.length ? (
          groups.map(({ g, gi, t }) => {
            const ga = g.t.reduce((sum, [n]) => sum + (sylDone[n] || 0), 0);
            const gt = g.t.reduce((sum, x) => sum + x[1], 0);
            const isOpen = syl.open[gi] || !!syl.q;
            const subjObj = SUBJ[g.s as keyof typeof SUBJ];
            const subjColor = subjObj ? subjObj.c : '#C8622B';

            return (
              <View key={gi} style={s.grp}>
                <Pressable
                  style={s.gh}
                  onPress={() => act('syOpen', String(gi))}
                  testID={`syllabus.group.${gi}`}
                >
                  <View style={s.chevWrap}>
                    <Icon name={isOpen ? 'chevd' : 'chev'} size={16} color="#8A93A0" />
                  </View>
                  <View style={s.ghMid}>
                    <Txt style={s.ghSub}>
                      {`${g.p.toUpperCase().replace('GS', 'GS ')} · ${subjObj ? subjObj.n : 'Ethics'}`}
                    </Txt>
                    <Txt style={s.ghTitle}>{`#${g.g}`}</Txt>
                    <View style={s.barTrack}>
                      <View
                        style={[
                          s.barFill,
                          {
                            width: `${Math.max(2, (ga / Math.max(1, gt)) * 100)}%`,
                            backgroundColor: subjColor,
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <Txt style={s.ghRatio}>{`${ga}/${gt.toLocaleString('en-IN')}`}</Txt>
                </Pressable>

                {isOpen ? (
                  <View style={s.topicsList}>
                    {t.map(x => {
                      const st = sylStatus(x);
                      return (
                        <Pressable
                          key={x.n}
                          style={s.topicRow}
                          onPress={() => act('syTopic', x.n)}
                          testID={`syllabus.topic.${x.n}`}
                        >
                          <View
                            style={[
                              s.topicDot,
                              st === 'cov' && s.dotCov,
                              st === 'pen' && s.dotPen,
                            ]}
                          />
                          <Txt style={s.topicTitle}>{x.n}</Txt>
                          <View style={[s.topicPill, st === 'cov' && s.pillCov, st === 'pen' && s.pillPen]}>
                            <Txt style={[s.topicPillTx, st === 'cov' && s.pillTxCov, st === 'pen' && s.pillTxPen]}>
                              {`${x.a}/${x.c}`}
                            </Txt>
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>
            );
          })
        ) : (
          <View style={s.empty}>
            <Txt style={s.emptyB}>No topics match</Txt>
            <Txt style={s.emptyP}>Try a different word or clear your filters.</Txt>
            <Pressable style={s.clearBtn} onPress={() => act('syReset')} testID="syllabus.reset">
              <Txt style={s.clearTx}>Clear filters</Txt>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  page: { paddingHorizontal: 16, paddingBottom: 36 },
  ringWrap: { alignItems: 'center', marginTop: 14 },
  ringBox: { position: 'relative', width: 96, height: 96 },
  svgRotate: { transform: [{ rotate: '-90deg' }] },
  ringCenter: { position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' },
  ringPct: { ...font('serif', 800), fontSize: 18, color: '#FFFFFF' },
  ringSub: { fontSize: 10, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  kpiRow: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  kpiCard: { flex: 1, paddingVertical: 10, paddingHorizontal: 6, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF2', alignItems: 'center' },
  kpiOn: { borderColor: '#1B8AD3', backgroundColor: '#F0F7FD' },
  kpiVal: { ...font('serif', 800), fontSize: 16, lineHeight: 18 },
  kpiLbl: { fontSize: 10.5, color: '#7A8494', marginTop: 3 },
  fbar: { flexDirection: 'row', gap: 8, alignItems: 'center', marginBottom: 10 },
  searchFlex: { flex: 1 },
  fbtn: { width: 46, height: 46, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E8F0', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  fbtnOn: { borderColor: '#1B8AD3' },
  fbtnDot: { position: 'absolute', top: 10, right: 10, width: 6, height: 6, borderRadius: 3, backgroundColor: '#1B8AD3' },
  activeBar: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  activeTxt: { fontSize: 12.5, color: '#7A8494' },
  activePill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 4, paddingHorizontal: 10, borderRadius: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1E8F0' },
  activePillTx: { ...font('sans', 700), fontSize: 12 },
  listWrap: { gap: 10 },
  grp: { borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E6EBF1', overflow: 'hidden' },
  gh: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 10 },
  chevWrap: { width: 20, alignItems: 'center' },
  ghMid: { flex: 1 },
  ghSub: { fontSize: 11, color: '#7A8494' },
  ghTitle: { ...font('sans', 700), fontSize: 14, color: '#14161C', marginTop: 2 },
  barTrack: { height: 4, borderRadius: 2, backgroundColor: '#EEF2F7', marginTop: 6, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 2 },
  ghRatio: { ...font('sans', 600), fontSize: 12, color: '#7A8494' },
  topicsList: { borderTopWidth: 1, borderTopColor: '#F1F4F8', paddingHorizontal: 12, paddingVertical: 6 },
  topicRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8F9FA' },
  topicDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#C9D2DD', marginRight: 10 },
  dotCov: { backgroundColor: '#2F8A4A' },
  dotPen: { backgroundColor: '#E8890C' },
  topicTitle: { flex: 1, fontSize: 13.5, lineHeight: 18, color: '#25272D' },
  topicPill: { paddingVertical: 2, paddingHorizontal: 6, borderRadius: 6, backgroundColor: '#F3F5F8' },
  pillCov: { backgroundColor: '#E8F5EC' },
  pillPen: { backgroundColor: '#FFF3DF' },
  topicPillTx: { ...font('sans', 700), fontSize: 11, color: '#7A8494' },
  pillTxCov: { color: '#2F8A4A' },
  pillTxPen: { color: '#B86E00' },
  empty: { padding: 32, alignItems: 'center', borderRadius: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E8ECF2' },
  emptyB: { ...font('sans', 700), fontSize: 16, color: '#14161C' },
  emptyP: { fontSize: 13, color: '#7A8494', marginTop: 4, textAlign: 'center' },
  clearBtn: { marginTop: 14, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10, backgroundColor: '#F0F6FD' },
  clearTx: { ...font('sans', 700), fontSize: 13, color: '#1B8AD3' },
});

const view: ViewDef = {
  useTitle: () => 'Syllabus Matrix',
  Screen: SyllabusScreen,
};

export default view;
