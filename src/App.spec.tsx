import React from "react";
import { screen } from "@testing-library/react";
import { render } from "./test-utils";
import { App } from "./App";

/** @jest-environment jsdom */

test("renders Hello world!", () => {
  render(<App />);
  const linkElement = screen.getByText(/Hello World/i);
  expect(linkElement).toBeInTheDocument();
});
