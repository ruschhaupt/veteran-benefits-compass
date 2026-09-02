import { render, screen } from '@testing-library/react';
import App from './App';
import { AccessibilityProvider } from './context/AccessibilityContext';

test('renders Veteran Benefits Compass header', () => {
  render(
    <AccessibilityProvider>
      <App />
    </AccessibilityProvider>
  );
  const elements = screen.getAllByText(/Veteran Benefits Compass/i);
  expect(elements.length).toBeGreaterThan(0);
});
