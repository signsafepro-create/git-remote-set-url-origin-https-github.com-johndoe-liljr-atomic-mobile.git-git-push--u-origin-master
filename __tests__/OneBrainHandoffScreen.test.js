import React from 'react';
import { render } from '@testing-library/react-native';
import OneBrainHandoffScreen from '../src/screens/OneBrainHandoffScreen';

describe('OneBrainHandoffScreen', () => {
  it('renders the full handoff content', () => {
    const navigation = { goBack: jest.fn() };
    const { getByText } = render(<OneBrainHandoffScreen navigation={navigation} />);

    expect(getByText('ONE BRAIN')).toBeTruthy();
    expect(getByText('LIL JR COLLECTIVE - ONE BRAIN HANDOFF')).toBeTruthy();
    expect(getByText('UNIFIED SYSTEM ARCHITECTURE')).toBeTruthy();
    expect(getByText('NON-NEGOTIABLE SUCCESS STATEMENT')).toBeTruthy();
  });
});