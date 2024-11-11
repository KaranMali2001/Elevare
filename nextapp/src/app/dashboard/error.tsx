"use client"; // Error boundaries must be Client Components

import ErrorPage from "@/components/ui/ErrorPage";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPage message={error.message} />;
}
