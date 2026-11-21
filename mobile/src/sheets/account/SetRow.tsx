// Source: PrepAssist.html L2910-L2915 (.set, .set svg.ic, .set span, .set small, .set.red), L7037 (A.tog)
// Private copy of `.set` (the settings row of the profile sheets; not ported by the foundation).
//   padding 14px 0, border-bottom 1px --rule, gap 14, 15.5px / 22.475 --ink; icon --ink-2; small 13.5px --muted
// A row with a `.tog` keeps the switch's on-state locally, like the element class the HTML toggles.
import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { act } from '../../actions';
import { Icon } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import { Tog } from '../../screens/account/Tog';
import { palettes, Txt } from '../../theme';

const C = palettes.free;

export function SetTog({
  label,
  initial,
  testID,
}: {
  label: string;
  initial: boolean;
  testID?: string;
}): React.JSX.Element {
  const [on, setOn] = useState(initial);
  return (
    <View style={s.set}>
      <Txt style={s.span}>{label}</Txt>
      <Tog
        on={on}
        label="Toggle"
        onPress={() => act('tog', undefined, { toggle: () => setOn(x => !x) })}
        testID={testID}
      />
    </View>
  );
}

export function SetBtn({
  icon,
  label,
  small,
  red,
  onPress,
  testID,
}: {
  icon: IconName;
  label: string;
  small?: string;
  red?: boolean;
  onPress: () => void;
  testID?: string;
}): React.JSX.Element {
  return (
    <Pressable style={s.set} onPress={onPress} testID={testID}>
      <Icon name={icon} color={red ? C.bad : C.ink2} />
      <Txt style={[s.span, red && s.red]}>{label}</Txt>
      {small ? <Txt style={s.small}>{small}</Txt> : null}
    </Pressable>
  );
}

const s = StyleSheet.create({
  set: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.rule,
  },
  span: { flex: 1, fontSize: 15.5, lineHeight: 22.475, color: C.ink },
  red: { color: C.bad },
  small: { fontSize: 13.5, lineHeight: 19.575, color: C.muted },
});
