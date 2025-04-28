import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const routeError = useRouteError(); // Renamed to avoid conflict
  const [isLoading, setIsLoading] = useState(false); // Not needed for error page
  const [movies, setMovies] = useState([]); // Added missing state
  return (
    <>
      <header>
        <NavBar />
      </header>
      <main>
        <h1>Oops! Looks like something went wrong.</h1>
        <p>{routeError.statusText || routeError.message}</p>
        {routeError.status && (
          <p>Status code: {routeError.status}</p>
        )}
      </main>
    </>
  );
}

export default ErrorPage;