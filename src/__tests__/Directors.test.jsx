import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../routes";

// Mock data with unique IDs (if your component uses them)
const mockDirectors = [
  {
    id: 1,
    name: "Scott Derrickson",
    movies: ["Doctor Strange", "Sinister", "The Exorcism of Emily Rose"],
  },
  {
    id: 2,
    name: "Mike Mitchell",
    movies: ["Trolls", "Alvin and the Chipmunks: Chipwrecked", "Sky High"],
  },
  {
    id: 3,
    name: "Edward Zwick",
    movies: ["Jack Reacher: Never Go Back", "Blood Diamond", "The Siege"],
  },
];

// Mock API fetch
beforeAll(() => {
  vi.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockDirectors),
    })
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});

const renderDirectorsPage = () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/directors"],
  });
  return render(<RouterProvider router={router} />);
};

describe("Directors Page", () => {
  test("renders without console errors", () => {
    const errorSpy = vi.spyOn(console, "error");
    renderDirectorsPage();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test("renders 'Directors Page' heading", async () => {
    renderDirectorsPage();
    const heading = await screen.findByRole("heading", { 
      name: /Directors Page/i, 
      level: 1 
    });
    expect(heading).toBeInTheDocument();
  });

  test("renders each director's name", async () => {
    renderDirectorsPage();
    for (const director of mockDirectors) {
      expect(await screen.findByText(director.name)).toBeInTheDocument();
    }
  });

  test("renders a <li> for each movie", async () => {
    renderDirectorsPage();
    for (const director of mockDirectors) {
      for (const movie of director.movies) {
        const movieItem = await screen.findByText(movie);
        expect(movieItem).toBeInTheDocument();
        expect(movieItem.tagName).toBe("LI");
      }
    }
  });

  test("renders the NavBar", async () => {
    renderDirectorsPage();
    expect(await screen.findByRole("navigation")).toBeInTheDocument();
  });
});