import { useEffect, useState } from "react";

export function useQuery(query: string) {
  const [searchEmails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchEmails() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(`/api/searchQuery?search=${query}`, {
            signal: controller.signal,
          });
          const data = await res.json();

          //   if (data.Response === "False") throw new Error("Emails NOT FOUND");

          setEmails(data.res);
          setError("");
        } catch (err: any) {
          if (err.name !== "AbortError") {
            setError(err.message);
          } else setIsLoading(true);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 1) {
        setEmails([]);
        setError("");
        return;
      }
      // handleCloseMovie();
      fetchEmails();

      return function () {
        controller.abort();
      };
    },
    [query],
  );
  return { searchEmails, isLoading, error };
}
