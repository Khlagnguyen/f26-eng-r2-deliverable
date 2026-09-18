"use client";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { type Database } from "@/lib/schema";
import { useState } from "react";
import AddEditSpeciesDialog from "./add-edit-species-dialog";
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
  const filteredSpecies = species.filter((species) =>
    species.scientific_name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        {/* Changed query within search gets reflected back up here, causes this page to re-render, updating the filtered list of species */}
        <Search query={query} setQuery={setQuery} />
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
