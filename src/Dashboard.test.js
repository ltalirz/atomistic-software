import { render, screen } from "@testing-library/react";
import Dashboard from "./Dashboard";
jest.mock("react-markdown", () => ({
  __esModule: true,
  default: (props) => {
    return <div data-testid="react-markdown-mock">{props.children}</div>;
  },
}));

test("renders menu button", () => {
  render(<Dashboard />);
  const btn = screen.getByLabelText(/open drawer/i);
  expect(btn).toBeInTheDocument();
});
