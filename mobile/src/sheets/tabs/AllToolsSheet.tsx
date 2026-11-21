// Source: PrepAssist.html L6934-L6934 (SHEETS.allTools)
// "All study tools": a .cmd-grp label and a .sh-list per group (learn, practice, organise), one row per TOOLS
// entry (icon tile, name, description, chev). Opened tall (A.allTools passes true).
// Computed: reference/android/sheet-allTools (.cmd-grp margin-top 16, 10.5/15.225 700 ls 1.68 uppercase --muted).
import React from 'react';
import { act } from '../../actions';
import { CmdGrp, Icon, SheetFrame, SheetList, SheetListItem } from '../../components';
import type { IconName } from '../../icons/iconPaths.generated';
import { TOOLS } from '../../data';

function AllToolsSheet(): React.JSX.Element {
  return (
    <SheetFrame title="All study tools" testID="sheet.allTools">
      {['learn', 'practice', 'organise'].map(g => (
        <React.Fragment key={g}>
          <CmdGrp>{g}</CmdGrp>
          <SheetList>
            {TOOLS.filter(x => x.g === g).map(x => (
              <SheetListItem
                key={x.id}
                title={x.n}
                subtitle={x.d}
                icon={x.ic as IconName}
                after={<Icon name="chev" />}
                onPress={() => act('tool', x.id)}
                testID={`sheet.allTools.${x.id}`}
              />
            ))}
          </SheetList>
        </React.Fragment>
      ))}
    </SheetFrame>
  );
}

export default AllToolsSheet;
