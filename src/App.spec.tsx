import React from "react";
import { screen } from "@testing-library/react";
import { render } from "./test-utils";
import { App } from "./App";

/** @jest-environment jsdom */

test("renders Chess", () => {
  render(<App />);
  const textElement = screen.getByText(/Chess/i);
  expect(textElement).toBeInTheDocument();
});
