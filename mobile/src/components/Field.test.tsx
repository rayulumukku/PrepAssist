import React from 'react';
import { TextInput } from 'react-native';
import ReactTestRenderer, { act } from 'react-test-renderer';
import { Txt } from '../theme/Txt';
import { Field } from './Field';
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

const icons = (r: ReactTestRenderer.ReactTestRenderer): string[] => r.root.findAllByType(Icon).map(i => i.props.name);
const texts = (r: ReactTestRenderer.ReactTestRenderer): unknown[] => r.root.findAllByType(Txt).map(t => t.props.children);

// A.eye (L6986) writes the icon into the label <span>; the button keeps `eye`
// (reference: stage-auth-signin-password-shown, stage-auth-signin-empty-error).
test('the eye button unmasks the password and replaces the label with the icon', () => {
  const r = mount(<Field label="Password" value="prelims2027" onChangeText={() => {}} secureTextEntry testID="f" />);
  const input = (): ReactTestRenderer.ReactTestInstance => r.root.findByType(TextInput);
  const eye = eyes(r)[0];

  expect(input().props.secureTextEntry).toBe(true);
  expect(texts(r)).toEqual(['Password']);
  expect(icons(r)).toEqual(['eye']);

  act(() => eye.props.onPress());
  expect(input().props.secureTextEntry).toBe(false);
  expect(texts(r)).toEqual([]);
  expect(icons(r)).toEqual(['eyeoff', 'eyeoff', 'eye']); // label icon (two colour layers), then the button

  act(() => eye.props.onPress());
  expect(input().props.secureTextEntry).toBe(true);
  expect(icons(r)).toEqual(['eye', 'eye', 'eye']);
});

test('a plain field has no eye button and passes focus, blur and text through', () => {
  const onFocus = jest.fn();
  const onBlur = jest.fn();
  const onChangeText = jest.fn();
  const r = mount(
    <Field label="Email" value="" onChangeText={onChangeText} onFocus={onFocus} onBlur={onBlur} testID="f" />,
  );
  expect(eyes(r)).toHaveLength(0);
  const input = r.root.findByType(TextInput);
  expect(input.props.allowFontScaling).toBe(false);
  act(() => input.props.onFocus({}));
  act(() => input.props.onChangeText('a'));
  act(() => input.props.onBlur({}));
  expect(onFocus).toHaveBeenCalledTimes(1);
  expect(onBlur).toHaveBeenCalledTimes(1);
  expect(onChangeText).toHaveBeenCalledWith('a');
});

// #s-auth .letter .fl.fl-ph: <b>+91</b>, the <span> is display:none, the placeholder shows.
test('the prefix variant draws the prefix instead of the floating label', () => {
  const r = mount(
    <Field label="Phone number" prefix="+91" placeholder="Phone number" value="" onChangeText={() => {}} />,
  );
  expect(texts(r)).toEqual(['+91']);
  const input = r.root.findByType(TextInput);
  expect(input.props.placeholder).toBe('Phone number');
  expect(input.props.placeholderTextColor).toBe('#B8BEC8');
  expect(input.props.accessibilityLabel).toBe('Phone number');
});
