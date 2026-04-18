import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import HomeScreen from '../src/screens/HomeScreen';

describe('HomeScreen', () => {
  it('renders the main actions', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<HomeScreen navigation={navigation} />);

    expect(getByText('LIL JR 2.0')).toBeTruthy();
    expect(getByText('START TALKING')).toBeTruthy();
    expect(getByText('UPGRADE POWER')).toBeTruthy();
    expect(getByText('ONE BRAIN HANDOFF')).toBeTruthy();
  });

  it('navigates to the handoff screen', () => {
    const navigation = { navigate: jest.fn() };
    const { getByText } = render(<HomeScreen navigation={navigation} />);

    fireEvent.press(getByText('ONE BRAIN HANDOFF'));

    expect(navigation.navigate).toHaveBeenCalledWith('OneBrainHandoff');
  });
});
