import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FunnelIcon } from "lucide-react";

export default function Filter({ filter, setFilter }: { filter: string; setFilter: (filter: string) => void }) {
  const filters = ["A-Z", "Z-A", "↑ Population", "↓ Population"];
  return (
    <div className="flex items-center gap-2">
      <FunnelIcon />
      <Select value={filter} onValueChange={setFilter}>
        <SelectTrigger className="w-auto min-w-[150px]">
          <SelectValue placeholder="A-Z" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {filters.map((filter, index) => (
              <SelectItem key={index} value={filter}>
                {filter}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
