import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../routes";

// Mock data matching your movie's expected structure
const mockMovie = {
  id: 1,
  title: "Doctor Strange",
  runtime: 115,
  genres: ["Action", "Adventure", "Fantasy"],
};

// Mock API response
beforeAll(() => {
  vi.spyOn(global, "fetch").mockImplementation((url) => {
    if (url.includes(`/movies/${mockMovie.id}`)) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockMovie),
      });
    }
    return Promise.reject(new Error("Invalid URL"));
  });
});

afterAll(() => {
  vi.restoreAllMocks();
});

const renderMoviePage = (movieId = mockMovie.id) => {
  const router = createMemoryRouter(routes, {
    initialEntries: [`/movie/${movieId}`],
  });
  return render(<RouterProvider router={router} />);
};

describe("Movie Page", () => {
  test("renders without console errors", () => {
    const errorSpy = vi.spyOn(console, "error");
    renderMoviePage();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test("renders movie title in h1", async () => {
    renderMoviePage();
    const title = await screen.findByRole("heading", {
      name: mockMovie.title,
      level: 1,
    });
    expect(title).toBeInTheDocument();
  });

  test("renders movie runtime in p tag", async () => {
    renderMoviePage();
    const runtime = await screen.findByText(mockMovie.runtime.toString());
    expect(runtime).toBeInTheDocument();
    expect(runtime.tagName).toBe("P");
  });

  test("renders each genre in span tags", async () => {
    renderMoviePage();
    for (const genre of mockMovie.genres) {
      const genreElement = await screen.findByText(genre);
      expect(genreElement).toBeInTheDocument();
      expect(genreElement.tagName).toBe("SPAN");
    }
  });

  test("renders NavBar component", async () => {
    renderMoviePage();
    expect(await screen.findByRole("navigation")).toBeInTheDocument();
  });
});