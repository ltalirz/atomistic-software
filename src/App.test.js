import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: (props) => {
    return <div data-testid="react-markdown-mock">{props.children}</div>;
  }
}));

test("renders application title", () => {
  render(<Dashboard />);
  const title = screen.getByText(/Trends in atomistic simulation engines/i);
  expect(title).toBeInTheDocument();
});
