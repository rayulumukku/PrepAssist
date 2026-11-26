// Source: PrepAssist.html L6935-L6935 (SHEETS.upload)
import React from 'react';
import { act } from '../../actions';
import { Icon, SheetFrame, SheetList, SheetListItem } from '../../components';

function UploadSheet(): React.JSX.Element {
  const items = [
    { ic: 'camera' as const, t: 'Scan pages', d: 'Use your camera' },
    { ic: 'file' as const, t: 'Upload a PDF', d: 'Books, notes, reports' },
    { ic: 'cloud' as const, t: 'Import from Google Drive', d: 'Pick files' },
  ];
  return (
    <SheetFrame title="Add to your vault" testID="sheet.upload">
      <SheetList>
        {items.map(it => (
          <SheetListItem
            key={it.t}
            title={it.t}
            subtitle={it.d}
            icon={it.ic}
            after={<Icon name="chev" />}
            onPress={() => act('uploaded')}
            testID={`sheet.upload.${it.ic}`}
          />
        ))}
      </SheetList>
    </SheetFrame>
  );
}

export default UploadSheet;
