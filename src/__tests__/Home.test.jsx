import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import routes from "../routes";

// Mock data for consistent testing
const mockMovies = [
  { id: 1, title: "Doctor Strange" },
  { id: 2, title: "Trolls" },
  { id: 3, title: "Jack Reacher: Never Go Back" },
];

// Mock API fetch
beforeAll(() => {
  vi.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockMovies),
    })
  );
});

afterAll(() => {
  vi.restoreAllMocks();
});

const router = createMemoryRouter(routes, {
  initialEntries: ["/"],
});

describe("Home Page", () => {
  test("renders 'Home Page' inside of an <h1 />", () => {
    render(<RouterProvider router={router} />);
    const h1 = screen.getByRole('heading', { level: 1, name: /Home Page/ });
    expect(h1).toBeInTheDocument();
  });

  test("displays a list of movie titles", async () => {
    render(<RouterProvider router={router} />);
    
    // Wait for movie titles to appear
    const movieTitles = await screen.findAllByRole('heading', { level: 2 });
    
    // Verify we have the expected number of movies
    expect(movieTitles).toHaveLength(mockMovies.length);
    
    // Verify each movie title exists and is in an H2
    mockMovies.forEach((movie, index) => {
      expect(movieTitles[index]).toHaveTextContent(movie.title);
    });
  });

  test("displays links for each associated movie", async () => {
    render(<RouterProvider router={router} />);
    const linkList = await screen.findAllByRole('link', { name: /View Info/ });
    
    expect(linkList).toHaveLength(mockMovies.length);
    mockMovies.forEach((movie, index) => {
      expect(linkList[index]).toHaveAttribute('href', `/movies/${movie.id}`);
    });
  });

  test("renders the <NavBar /> component", async () => {
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole('navigation')).toBeInTheDocument();
  });
});