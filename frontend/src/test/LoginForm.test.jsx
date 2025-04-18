// src/test/LoginForm.test.jsx

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../pages/patients/LoginForm";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
jest.useFakeTimers();
jest.mock("axios");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("🔗 INTEGRATION TESTS", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers(); // Restore real timers after each test
  });

  it("logs in successfully and navigates", async () => {
    axios.post.mockResolvedValue({
      data: { token: "mock-token" },
    });
    renderWithRouter(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /^Login$/i }));
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith("http://localhost:5000/api/login", {
        email: "user@example.com",
        password: "password123",
      });
      expect(localStorage.getItem("token")).toBe("mock-token");
      console.log("Token stored in localStorage:", localStorage.getItem("token"));
    });
    jest.advanceTimersByTime(2000);
  
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
    expect(await screen.findByText(/Login successful/i)).toBeInTheDocument();
    console.log("Login successful and redirected to / page.");
    
  });


  it("redirects to Google login URL on click", () => {
    delete window.location;
    window.location = { href: "" };

    renderWithRouter(<LoginForm />);
    fireEvent.click(screen.getByText(/Sign in with Google/i));

    expect(window.location.href).toBe("http://localhost:5000/api/auth/google");
    console.log("Redirected to Google login URL.");
  });
});
