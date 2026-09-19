"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { type Database } from "@/lib/schema";
import { useState } from "react";
import AddEditSpeciesDialog from "./add-edit-species-dialog";
import Filter from "./filter";
import Search from "./search";
import SpeciesCard from "./species-card";

//Replace author field in normal species type with modified structure to allow display_name
type Species = Omit<Database["public"]["Tables"]["species"]["Row"], "author"> & {
  author: {
    id: string;
    display_name: string | null;
  };
};

export default function Content({ species, userId }: { species: Species[]; userId: string }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("A-Z");
  const filteredSpecies = species.filter(
    (species) =>
      species.scientific_name.toLowerCase().includes(query.toLowerCase()) ??
      species.common_name?.toLowerCase().includes(query.toLowerCase()) ??
      species.kingdom.toLowerCase().includes(query.toLowerCase()) ??
      species.description?.toLowerCase().includes(query.toLowerCase()) ??
      species.author.display_name?.toLowerCase().includes(query.toLowerCase()),
  );
  if (filter === "A-Z") {
    filteredSpecies.sort((a, b) => a.scientific_name.localeCompare(b.scientific_name));
  } else if (filter === "Z-A") {
    filteredSpecies.sort((a, b) => b.scientific_name.localeCompare(a.scientific_name));
  } else if (filter === "↑ Population") {
    filteredSpecies.sort((a, b) => {
      if (a.total_population === null) return 1;
      if (b.total_population === null) return -1;
      return a.total_population - b.total_population;
    });
  } else {
    filteredSpecies.sort((a, b) => {
      if (a.total_population === null) return 1;
      if (b.total_population === null) return -1;
      return b.total_population - a.total_population;
    });
  }
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between">
        <TypographyH2>Species List</TypographyH2>
        {/* Changed query within search gets reflected back up here, causes this page to re-render, updating the filtered list of species */}
        <div className="relative flex w-[500px] items-center">
          <Search query={query} setQuery={setQuery} />

          <div className="absolute left-full ">
            <Filter filter={filter} setFilter={setFilter} />
          </div>
        </div>

        <AddEditSpeciesDialog
          userId={userId}
          mode="add"
          trigger={
            <Button variant="secondary">
              <Icons.add className="mr-3 h-5 w-5" />
              Add Species
            </Button>
          }
        />
      </div>

      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {filteredSpecies?.map((species) => <SpeciesCard key={species.id} species={species} userId={userId} />)}
      </div>
    </>
  );
}
