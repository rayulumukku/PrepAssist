import React from 'react';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Txt } from '../../theme/Txt';
import wallet from './WalletScreen';
import account from './AccountScreen';
import upgrade from './UpgradeScreen';
import { resetStore } from '../../store';

function texts(el: React.ReactElement): string {
  let r!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    r = ReactTestRenderer.create(el);
  });
  return r.root
    .findAllByType(Txt)
    .map(t => (typeof t.props.children === 'string' ? t.props.children : ''))
    .join('|');
}

describe('account screens render their copy', () => {
  beforeEach(() => resetStore());
  it('wallet', () => {
    const W = wallet.Screen;
    expect(texts(<W arg={undefined} entryKey={1} />)).toContain(
      'credits available',
    );
  });
  it('account', () => {
    const W = account.Screen;
    expect(texts(<W arg={undefined} entryKey={1} />)).toContain(
      'Aspirant identity card',
    );
  });
  it('upgrade', () => {
    const W = upgrade.Screen;
    expect(texts(<W arg={undefined} entryKey={1} />)).toContain(
      'Instant credit top-ups',
    );
  });
});
