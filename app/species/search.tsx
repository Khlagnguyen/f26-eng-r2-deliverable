import { SearchIcon } from "lucide-react";

//UI from https://prebuiltui.com/components/search-bar
export default function Search({ query, setQuery }: { query: string; setQuery: (query: string) => void }) {
  return (
    <div className="flex h-[46px] w-[400px] items-center gap-2 overflow-hidden rounded-full border  pl-4">
      <SearchIcon className="size-5"></SearchIcon>
      <input
        type="text"
        placeholder="Search"
        value={query}
        className="h-full w-full bg-transparent text-sm text-white placeholder-white outline-none"
        onChange={(e) => setQuery(e.target.value)}
      ></input>
    </div>
  );
}
