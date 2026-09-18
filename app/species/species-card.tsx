import type { Database } from "@/lib/schema";

import { PenSquareIcon } from "lucide-react";
import Image from "next/image";
import AddEditSpeciesDialog from "./add-edit-species-dialog";
import DeleteSpeciesPopup from "./delete-species-popup";
import SpeciesDetailPopup from "./species-detail-popup";

type Species = Omit<Database["public"]["Tables"]["species"]["Row"], "author"> & {
  author: {
    id: string;
    display_name: string | null;
  };
};

export default function SpeciesCard({ species, userId }: { species: Species; userId: string }) {
  return (
    <div className="relative m-4 w-72 min-w-72 flex-none rounded border-2 p-3 shadow">
      <div className="flex w-full items-start gap-2">
        {species.image && (
          <div className="relative h-40 flex-1">
            <Image src={species.image} alt={species.scientific_name} fill className="object-cover" />
          </div>
        )}

        {/* Only the user that created the entry can delete/edit it */}
        {species.author.id === userId && (
          <div className="flex flex-col gap-2">
            <AddEditSpeciesDialog
              userId={userId}
              species={species}
              mode="edit"
              trigger={<PenSquareIcon className="size-5 cursor-pointer" />}
            />
            <DeleteSpeciesPopup id={species.id}></DeleteSpeciesPopup>
          </div>
        )}
      </div>

      <h3 className="mt-3 text-2xl font-semibold">{species.scientific_name}</h3>
      <h4 className="text-lg font-light italic">{species.common_name}</h4>
      <p>{species.description ? species.description.slice(0, 150).trim() + "..." : ""}</p>
      {/* Replace the button with the detailed view dialog. */}
      <SpeciesDetailPopup species={species}></SpeciesDetailPopup>
      {/* <Button className="mt-3 w-full">Learn More</Button> */}
    </div>
  );
}
