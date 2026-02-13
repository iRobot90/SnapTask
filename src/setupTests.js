// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Global mock for react-router-dom to prevent module resolution errors in tests
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(() => ({ pathname: '/' })),
  useParams: jest.fn(() => ({})),
  useSearchParams: jest.fn(() => [new URLSearchParams()]),
  Link: ({ children, to, ...rest }) => <a href={to} {...rest}>{children}</a>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ children }) => <div>{children}</div>,
  Navigate: ({ to }) => <div data-testid={`navigate-to-${to}`}>{`Navigating to ${to}`}</div>,
  HashRouter: ({ children }) => <div>{children}</div>, // Mock HashRouter as well
}));
