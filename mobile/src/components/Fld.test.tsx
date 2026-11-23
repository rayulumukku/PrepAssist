import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Txt } from '../theme/Txt';
import { Fld } from './Fld';
import { Icon } from './Icon';

function mount(el: React.ReactElement): ReactTestRenderer.ReactTestRenderer {
  let r!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    r = ReactTestRenderer.create(el);
  });
  return r;
}

/** The `<testID>.eye` button (the element that carries onPress). */
const eyes = (r: ReactTestRenderer.ReactTestRenderer): ReactTestRenderer.ReactTestInstance[] =>
  r.root.findAll(n => n.props.testID === 'f.eye' && typeof n.props.onPress === 'function');

const texts = (r: ReactTestRenderer.ReactTestRenderer): unknown[] => r.root.findAllByType(Txt).map(t => t.props.children);
const padLeft = (r: ReactTestRenderer.ReactTestRenderer): unknown =>
  (StyleSheet.flatten(r.root.findByType(TextInput).props.style) as { paddingLeft?: unknown }).paddingLeft;

test('label above the input, no eye button, no prefix', () => {
  const r = mount(<Fld label="Email" value="divya.sharma@gmail.com" onChangeText={() => {}} testID="f" />);
  expect(texts(r)).toEqual(['Email']);
  expect(eyes(r)).toHaveLength(0);
  expect(padLeft(r)).toBe(14);
  expect(r.root.findByType(TextInput).props.allowFontScaling).toBe(false);
});

// .inp .pre + input{padding-left:50px} (L2207)
test('the prefix moves the text right', () => {
  const r = mount(<Fld label="Phone" prefix="+91" value="" onChangeText={() => {}} />);
  expect(texts(r)).toEqual(['Phone', '+91']);
  expect(padLeft(r)).toBe(50);
});

// A.eye (L6986)
test('the eye button unmasks the password and swaps its icon', () => {
  const r = mount(<Fld label="Password" value="x" onChangeText={() => {}} secureTextEntry testID="f" />);
  const eye = eyes(r)[0];
  expect(r.root.findByType(TextInput).props.secureTextEntry).toBe(true);
  expect(r.root.findByType(Icon).props.name).toBe('eye');
  act(() => eye.props.onPress());
  expect(r.root.findByType(TextInput).props.secureTextEntry).toBe(false);
  expect(r.root.findByType(Icon).props.name).toBe('eyeoff');
  act(() => eye.props.onPress());
  expect(r.root.findByType(TextInput).props.secureTextEntry).toBe(true);
  expect(r.root.findByType(Icon).props.name).toBe('eye');
});
