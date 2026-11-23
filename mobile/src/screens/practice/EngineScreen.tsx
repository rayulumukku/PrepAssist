// Source: PrepAssist.html L6591-L6600 (VIEWS.engine)
// Source: PrepAssist.html L7030-L7030 (A.engineGo), L7035-L7036 (chipToggle, chipOne)
// Computed (reference/android view-engine, view-engine-building): .pg-hero / .sec (parts/PgHero), .fldlab,
// .opt-row of .chip (shared), .why margin-top 4 (parts/Why), #engGo .btn-brand.btn-wide; while building, the
// button holds `.spin` and " Building your test…".
import React from 'react';
import { act } from '../../actions';
import { Btn, ChipGroup, FldLab, OptRow } from '../../components';
import { SUBJ } from '../../data';
import type { ViewDef, ViewProps } from '../../navigation/routes';
import { useStore } from '../../store';
import { PgHero, Sec } from './parts/PgHero';
import { Spin } from './parts/Spin';
import { Why } from './parts/Why';
import { font, Txt } from '../../theme';

/** the .btn label (Btn draws `label` before its children; here the spinner comes first) */
const busyT = { ...font('sans', 600), fontSize: 15.5, lineHeight: 22.475, color: '#FFFFFF', textAlign: 'center' as const };

function EngineScreen({ entryKey }: ViewProps): React.JSX.Element {
  const busy = useStore(s => s.engBusy === entryKey);
  return (
    <>
      <PgHero title="Build a test around your gaps" sub="Questions are weighted toward topics where your accuracy is lowest." />
      <Sec>
        <FldLab>Subjects</FldLab>
        <OptRow>
          <ChipGroup mode="toggle" items={Object.values(SUBJ).slice(0, 7).map(x => x.n)} initial={[0, 1]} testID="engine.subj" />
        </OptRow>
        <FldLab>Difficulty</FldLab>
        <OptRow>
          <ChipGroup mode="one" items={['Foundation', 'UPSC level', 'Tougher than UPSC']} initial={[1]} />
        </OptRow>
        <FldLab>Number of questions</FldLab>
        <OptRow>
          <ChipGroup mode="one" items={['10', '25', '50', '100']} initial={[0]} />
        </OptRow>
        <FldLab>Source</FldLab>
        <OptRow>
          <ChipGroup mode="one" items={['PYQs 2013–2025', 'AI-generated', 'Mixed']} initial={[2]} />
        </OptRow>
        <Why title="The engine noticed" style={{ marginTop: 4 }}>
          Writs (48%), Emergency provisions (52%) and Monetary policy (55%) are your weakest areas this month. They’ll make up 60% of this test.
        </Why>
        {busy ? (
          <Btn variant="brand" wide onPress={() => act('engineGo')} testID="engine.go">
            <Spin />
            <Txt style={busyT}>Building your test…</Txt>
          </Btn>
        ) : (
          <Btn variant="brand" wide icon="bolt" label="Generate test" onPress={() => act('engineGo')} testID="engine.go" />
        )}
      </Sec>
    </>
  );
}

const view: ViewDef = {
  useTitle: () => 'AI Prelims Engine',
  Screen: EngineScreen,
};

export default view;
