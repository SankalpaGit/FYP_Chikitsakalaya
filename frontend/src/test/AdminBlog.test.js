import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AdminBlog from "../pages/admin/AdminBlog";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";
import userEvent from "@testing-library/user-event";

const mockNavigate = jest.fn();

jest.mock("axios");

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const mockBlogs = [
  {
    id: 1,
    title: "Test Blog",
    content:
      "<p>This is a test blog content with more than 300 characters Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit rerum voluptate alias molestiae dolorum! ".repeat(
        5
      ) + "</p>",
    publishedAt: "2024-04-10T00:00:00Z",
    isPublished: false,
  },
];

// Helper to render with router context
const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe("AdminBlog Component", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockBlogs });
  });

  it("renders blog list from API", async () => {
    renderWithRouter(<AdminBlog />);
    expect(await screen.findByText("Test Blog")).toBeInTheDocument();
  });

  it('navigates to create page on "Add Blog" button click', async () => {
    renderWithRouter(<AdminBlog />);
    const addBtn = await screen.findByText(/Add Blog/i);
    await userEvent.click(addBtn);
    expect(mockNavigate).toHaveBeenCalledWith("/admin/blog/create");
  });

  it("toggles publish status", async () => {
    axios.put.mockResolvedValue({});
    renderWithRouter(<AdminBlog />);
    const toggleBtn = await screen.findByLabelText("toggle-publish-1");
    userEvent.click(toggleBtn);
    await waitFor(() => expect(axios.put).toHaveBeenCalled());
  });

  it("deletes blog on confirm", async () => {
    window.confirm = jest.fn(() => true);
    axios.delete.mockResolvedValue({});
    renderWithRouter(<AdminBlog />);
    const deleteBtn = await screen.findByLabelText("delete-1");
    userEvent.click(deleteBtn);
    await waitFor(() => expect(axios.delete).toHaveBeenCalled());
  });

  it("shows and toggles View More / View Less", async () => {
    renderWithRouter(<AdminBlog />);
    const viewMoreBtn = await screen.findByText(/View More/i);
    userEvent.click(viewMoreBtn);
    expect(await screen.findByText(/View Less/i)).toBeInTheDocument();
  });
});
