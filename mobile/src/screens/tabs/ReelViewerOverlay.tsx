// Source: PrepAssist.html L6366-L6396 (reelOpen, reelPaint, reelStep, reelClose)
// Source: PrepAssist.html L1428-L1453 (#reelV, .rv-bars, .rv-top, .rv-sub, .rv-x, .rv-k, .rv-body, .rv-tap, .rv-act, .rv-next)
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import { REELS, SUBJ } from '../../data';
import { useStore } from '../../store';
import { font, Txt } from '../../theme';

function ReelViewerOverlay(): React.JSX.Element | null {
  const reel = useStore(s => s.reel);
  if (!reel.on) return null;

  const r = REELS[reel.i] || REELS[0];
  const sl = r.slides[reel.j] || r.slides[0];
  const subjObj = SUBJ[r.s as keyof typeof SUBJ];
  const subjColor = subjObj ? subjObj.hex : '#3B5BCC';
  const subjName = subjObj ? subjObj.n : r.s;
  const isLast = reel.i >= REELS.length - 1;
  const nextReel = !isLast ? REELS[reel.i + 1] : null;

  return (
    <View style={[s.overlay, { backgroundColor: subjColor }]} testID="overlay.reel">
      <View style={s.barsRow}>
        {r.slides.map((_, k) => {
          const isDone = k < reel.j;
          const isRun = k === reel.j;
          return (
            <View key={k} style={s.barTrack}>
              <View style={[s.barFill, (isDone || isRun) && s.barFillActive]} />
            </View>
          );
        })}
      </View>

      <View style={s.topBar}>
        <Txt style={s.subTx}>{`${subjName} · ${reel.i + 1}/${REELS.length}`}</Txt>
        <Pressable style={s.closeBtn} onPress={() => act('reelClose')} testID="reel.close">
          <Icon name="x" size={16} color="#FFFFFF" />
        </Pressable>
      </View>

      <Txt style={s.watermark}>{r.k}</Txt>

      <View style={s.body}>
        <Txt style={s.title}>{sl[0]}</Txt>
        <Txt style={s.desc}>{sl[1]}</Txt>
      </View>

      <Pressable style={s.tapL} onPress={() => act('reelStep', '-1')} testID="reel.tapL" />
      <Pressable style={s.tapR} onPress={() => act('reelStep', '1')} testID="reel.tapR" />

      <View style={s.actRow}>
        <Pressable style={s.actBtn} onPress={() => act('reelSave')} testID="reel.save">
          <Icon name="layers" size={16} color="#FFFFFF" />
          <Txt style={s.actTx}>Save as flashcard</Txt>
        </Pressable>
        <Pressable style={s.actBtn} onPress={() => act('reelAsk')} testID="reel.ask">
          <Icon name="spark" size={16} color="#FFFFFF" />
          <Txt style={s.actTx}>Ask PrepAssist</Txt>
        </Pressable>
      </View>

      <View style={s.nextBox}>
        {nextReel ? (
          <Pressable style={s.nextBtn} onPress={() => act('reelJump')} testID="reel.next">
            <Txt style={s.nextTx} numberOfLines={1}>{`Next · ${nextReel.t}`}</Txt>
            <Icon name="arrow" size={15} color="#14304F" />
          </Pressable>
        ) : (
          <Pressable style={s.nextBtn} onPress={() => act('reelClose')} testID="reel.done">
            <Txt style={s.nextTx}>You’re done for today</Txt>
            <Icon name="check" size={15} color="#14304F" />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 90,
    paddingTop: 48,
    paddingHorizontal: 22,
    paddingBottom: 28,
    justifyContent: 'space-between',
  },
  barsRow: { flexDirection: 'row', gap: 5, marginBottom: 14 },
  barTrack: { flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' },
  barFill: { height: '100%', width: 0, backgroundColor: '#FFFFFF' },
  barFillActive: { width: '100%' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 },
  subTx: { ...font('sans', 700), fontSize: 11.5, letterSpacing: 1.4, textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  watermark: { ...font('book', 400, true), fontSize: 76, lineHeight: 76, letterSpacing: -1.5, color: 'rgba(255,255,255,0.2)', marginTop: 'auto' },
  body: { marginVertical: 14, zIndex: 1 },
  title: { ...font('serif', 800), fontSize: 28, lineHeight: 32.2, color: '#FFFFFF' },
  desc: { ...font('book', 400), fontSize: 20, lineHeight: 29, color: 'rgba(255,255,255,0.95)', marginTop: 14 },
  tapL: { position: 'absolute', top: 110, bottom: 180, left: 0, width: '50%', zIndex: 2 },
  tapR: { position: 'absolute', top: 110, bottom: 180, right: 0, width: '50%', zIndex: 2 },
  actRow: { flexDirection: 'row', gap: 10, marginTop: 'auto', zIndex: 3 },
  actBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, height: 46, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.12)' },
  actTx: { ...font('sans', 600), fontSize: 13.5, color: '#FFFFFF' },
  nextBox: { marginTop: 12, zIndex: 3 },
  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: 14, backgroundColor: '#FFFFFF', paddingHorizontal: 14 },
  nextTx: { ...font('sans', 700), fontSize: 13.5, color: '#14304F' },
});

export default ReelViewerOverlay;
