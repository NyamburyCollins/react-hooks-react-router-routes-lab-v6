import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../routes";

const mockActors = [
  {
    id: 1,
    name: "Benedict Cumberbatch",
    movies: ["Doctor Strange", "The Imitation Game", "Black Mass"],
  },
  // ... other actors
];

// Mock the API response
beforeAll(() => {
  vi.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockActors),
    })
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});

const renderActorsPage = () => {
  const router = createMemoryRouter(routes, {
    initialEntries: ["/actors"],
  });
  return render(<RouterProvider router={router} />);
};

describe("Actors Page", () => {
  test("renders without errors", () => {
    const errorSpy = vi.spyOn(console, "error");
    renderActorsPage();
    expect(errorSpy).not.toHaveBeenCalled();
    errorSpy.mockRestore();
  });

  test("renders 'Actors Page' heading", async () => {
    renderActorsPage();
    const heading = await screen.findByRole("heading", { name: /Actors Page/i });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
  });

  test("renders each actor's name", async () => {
    renderActorsPage();
    for (const actor of mockActors) {
      expect(await screen.findByText(actor.name)).toBeInTheDocument();
    }
  });

  test("renders a <li> for each movie", async () => {
    renderActorsPage();
    for (const actor of mockActors) {
      for (const movie of actor.movies) {
        const movieItem = await screen.findByText(movie);
        expect(movieItem).toBeInTheDocument();
        expect(movieItem.tagName).toBe("LI");
      }
    }
  });

  test("renders the NavBar component", async () => {
    renderActorsPage();
    expect(await screen.findByRole("navigation")).toBeInTheDocument();
  });
});