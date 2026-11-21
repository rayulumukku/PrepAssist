// Source: PrepAssist.html L6927-L6927 (SHEETS.language), L7038 (A.setLang)
// Computed from reference/android/sheet-language and sheet-language-hi. The intro paragraph's inline
// style (color --muted, 13.5px, margin-bottom 8px) is applied here; the rows are the shared .sh-list.
// `.hi` (Noto Sans Devanagari 600, 14.5px / 23.2px) for the Hindi title.
import React from 'react';
import { StyleSheet } from 'react-native';
import { act } from '../../actions';
import { SheetFrame, SheetList, SheetListItem } from '../../components';
import { useStore } from '../../store';
import { font, palettes, Txt } from '../../theme';

const LANGS: [string, string, string][] = [
  ['en', 'English', 'English'],
  ['hi', 'हिन्दी', 'Hindi'],
];

function LanguageSheet(): React.JSX.Element {
  const lang = useStore(st => st.lang);
  return (
    <SheetFrame title="Language" testID="sheet.language">
      <Txt style={s.p}>Changes the app’s labels and greetings. Study content is available in both languages.</Txt>
      <SheetList>
        {LANGS.map(([k, t, sub]) => (
          <SheetListItem
            key={k}
            title={t}
            subtitle={sub}
            icon={lang === k ? 'check' : null}
            titleStyle={k === 'hi' ? s.hi : undefined}
            onPress={() => act('setLang:' + k)}
            testID={`sheet.language.${k}`}
          />
        ))}
      </SheetList>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  p: { fontSize: 13.5, lineHeight: 19.575, color: palettes.free.muted, marginBottom: 8 },
  hi: { ...font('deva', 600), lineHeight: 23.2 },
});

export default LanguageSheet;
