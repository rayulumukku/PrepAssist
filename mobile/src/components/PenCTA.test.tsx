import React from 'react';
import { StyleSheet } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Stop } from 'react-native-svg';
import { useStore } from '../store';
import type { Plan } from '../theme/tokens';
import { Txt } from '../theme/Txt';
import { PenCTA } from './PenCTA';
import type { PenCTATone } from './PenCTA';

function look(plan: Plan, tone?: PenCTATone): { barrel: unknown; label: unknown } {
  act(() => useStore.setState({ planTheme: plan }));
  let r!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    r = ReactTestRenderer.create(<PenCTA label="Start practice" tone={tone} />);
  });
  const barrel = r.root.findAllByType(Stop)[0].props.stopColor;
  const label = (StyleSheet.flatten(r.root.findByType(Txt).props.style) as { color?: unknown }).color;
  act(() => r.unmount());
  return { barrel, label };
}

afterAll(() => act(() => useStore.setState({ planTheme: 'free' })));

// planthemes, L10654-L10666 and L10682-L10687
test('the barrel and the label follow the plan theme', () => {
  expect(look('free')).toEqual({ barrel: '#0B4F82', label: '#fff' });
  expect(look('pro')).toEqual({ barrel: '#2A1478', label: '#fff' });
  expect(look('ultimate')).toEqual({ barrel: '#000', label: '#F7DE8E' });
});

test('.ug-card > .pcta is never recoloured and .ug-card.u-pro > .pcta is always purple', () => {
  expect(look('ultimate', 'free')).toEqual({ barrel: '#0B4F82', label: '#fff' });
  expect(look('pro', 'free')).toEqual({ barrel: '#0B4F82', label: '#fff' });
  expect(look('free', 'pro')).toEqual({ barrel: '#2A1478', label: '#fff' });
  expect(look('ultimate', 'pro')).toEqual({ barrel: '#2A1478', label: '#fff' });
});
