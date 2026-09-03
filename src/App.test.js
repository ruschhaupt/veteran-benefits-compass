import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { AccessibilityProvider } from './context/AccessibilityContext';

describe('Veteran Benefits Compass Navigation & Play-Test', () => {
  beforeEach(() => {
    // Reset window hash
    window.location.hash = '';
  });

  test('renders header and main brand', () => {
    render(
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    );
    const elements = screen.getAllByText(/Veteran Benefits Compass/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  test('opens Claims & Ratings dropdown when clicked and navigates to VA Math', () => {
    render(
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    );

    // Find and click the Claims & Ratings category button
    const claimsBtn = screen.getByRole('button', { name: /claims & ratings/i });
    expect(claimsBtn).toBeInTheDocument();
    fireEvent.click(claimsBtn);

    // Verify the dropdown header and items are visible
    expect(screen.getByText(/Claims & Ratings — 5 Command Modules/i)).toBeInTheDocument();
    expect(screen.getByText(/38 CFR § 4.25 Combinator/i)).toBeInTheDocument();
    expect(screen.getByText(/Caluza Rubric & DBQ Prep Sheet/i)).toBeInTheDocument();
    expect(screen.getByText(/Toxic Exposure Presumptives/i)).toBeInTheDocument();

    // Click VA Math & Secondaries inside the dropdown
    const vaMathItem = screen.getByText(/38 CFR § 4.25 Combinator/i).closest('button');
    fireEvent.click(vaMathItem);

    // Verify VA Math page loads
    expect(screen.getAllByText(/VA Math/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/38 CFR § 4.25 Non-Additive Disability Math/i)).toBeInTheDocument();
    expect(window.location.hash).toBe('#vamath');
  });

  test('opens Transition & Career dropdown and navigates to Guard & Reserve', () => {
    render(
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    );

    const transitionBtn = screen.getByRole('button', { name: /transition & career/i });
    fireEvent.click(transitionBtn);

    expect(screen.getByText(/Transition & Career — 5 Command Modules/i)).toBeInTheDocument();
    expect(screen.getByText(/Drill Pay vs VA Comp Offset/i)).toBeInTheDocument();

    const guardItem = screen.getByText(/Drill Pay vs VA Comp Offset/i).closest('button');
    fireEvent.click(guardItem);

    expect(window.location.hash).toBe('#guardreserve');
  });

  test('opens Money & Housing dropdown and navigates to 20-Year Retiree CRDP/CRSC', () => {
    render(
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    );

    const moneyBtn = screen.getByRole('button', { name: /money & housing/i });
    fireEvent.click(moneyBtn);

    expect(screen.getByText(/Money & Housing — 6 Command Modules/i)).toBeInTheDocument();
    expect(screen.getByText(/20-Year Pension \+ 100% VA Pay/i)).toBeInTheDocument();

    const retireeItem = screen.getByText(/20-Year Pension \+ 100% VA Pay/i).closest('button');
    fireEvent.click(retireeItem);

    expect(window.location.hash).toBe('#retireecrdp');
  });

  test('opens Command Palette Search Modal and filters benefits', () => {
    render(
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    );

    // Click search trigger in header
    const searchBtns = screen.getAllByTitle(/Search all benefits, conditions, and statutes/i);
    fireEvent.click(searchBtns[0]);

    // Command palette modal opens with input
    const searchInput = screen.getByPlaceholderText(/Search any benefit, statute, condition/i);
    expect(searchInput).toBeInTheDocument();

    // Type sleep apnea
    fireEvent.change(searchInput, { target: { value: 'sleep apnea' } });

    // Result should appear
    expect(screen.getByText(/VA Math & Secondary Combinator/i)).toBeInTheDocument();
  });

  test('opens Help & Resources dropdown and navigates to VSO Locator', () => {
    render(
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    );

    const helpBtn = screen.getByRole('button', { name: /help & resources/i });
    fireEvent.click(helpBtn);

    expect(screen.getByText(/Help & Resources — 2 Command Modules/i)).toBeInTheDocument();
    expect(screen.getByText(/Accredited VSOs & Emergency/i)).toBeInTheDocument();

    const vsoItem = screen.getByText(/Accredited VSOs & Emergency/i).closest('button');
    fireEvent.click(vsoItem);

    expect(window.location.hash).toBe('#directory');
  });

  test('opens All 19 Command Modules grid drawer when clicked', () => {
    render(
      <AccessibilityProvider>
        <App />
      </AccessibilityProvider>
    );

    const allBtn = screen.getByTitle(/View all 19 modules grid/i);
    fireEvent.click(allBtn);

    expect(screen.getByText(/All 19 Command Modules/i)).toBeInTheDocument();
  });
});
