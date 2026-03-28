/**
 * @format
 */

import 'react-native';
import App from '../App';

// Note: import explicitly to use the types shipped with jest.
import {expect, it} from '@jest/globals';

it('renders correctly', () => {
  expect(App).toBeDefined();
});
