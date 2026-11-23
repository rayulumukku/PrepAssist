// Source: PrepAssist.html L8194-L8196 (A.ntAdd, A.ntCol, A.ntAddGo)
// Source: PrepAssist.html L4289 (.nt-cols), L4133 (.mv-lab), L3584 + L4232 (.dl-in.sv-in), L3546 (.by-pay)
// Computed (reference/android/sheet-tracker-new-folder):
//   .nt-cols   row gap 10; 34 circles in the colour; ring 0 0 0 3px #fff, 0 0 0 4px transparent; .on 0 0 0 5px #14161C (transition .2s)
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { SheetFrame } from '../../components';
import type { SheetProps } from '../../navigation/routes';
import { ByPay, DlIn, MvLab } from './trackerParts';

const COLS = ['#6C5DD3', '#0A97B8', '#E8890C', '#D6408B', '#3E9A55', '#14304F'];

function TrackerNewFolderSheet(_: SheetProps): React.JSX.Element {
  const [name, setName] = useState('');
  // the `.on` class is element state in the HTML (first button on at open, then the one tapped)
  const [on, setOn] = useState(0);
  return (
    <SheetFrame title="New folder" testID="trackerNewFolder">
      <MvLab>Folder name</MvLab>
      <DlIn placeholder="e.g. Internal Security" value={name} onChangeText={setName} testID="trackerNewFolder.name" />
      <MvLab>Colour</MvLab>
      <View style={s.cols}>
        {COLS.map((c, i) => (
          <Pressable
            key={c}
            style={[s.col, { backgroundColor: c }, i === on ? s.colOn : null]}
            onPress={() => {
              setOn(i);
              act('ntCol', c);
            }}
            accessibilityLabel="Colour"
            testID={`trackerNewFolder.col.${i}`}
          />
        ))}
      </View>
      <ByPay label="Create folder" icon="folder" onPress={() => act('ntAddGo', undefined, { value: name })} testID="trackerNewFolder.go" />
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  cols: { flexDirection: 'row', gap: 10 },
  col: { width: 34, height: 34, borderRadius: 17, boxShadow: '0px 0px 0px 3px #FFFFFF, 0px 0px 0px 4px transparent' },
  colOn: { boxShadow: '0px 0px 0px 3px #FFFFFF, 0px 0px 0px 5px #14161C' },
});

export default TrackerNewFolderSheet;
