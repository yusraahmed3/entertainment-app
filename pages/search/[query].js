
import { useRouter } from "next/router";
import SearchResults from "../../components/SearchResults";

export default function SearchResultPage() {
  const router = useRouter();

  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-[#F7F7FA] p-8 text-gray-500 dark:bg-[#101116]">
        Loading search...
      </div>
    );
  }

  const query =
    typeof router.query.query === "string"
      ? router.query.query
      : "";

  return <SearchResults initialQuery={query} />;
}
