import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema";
import { useState } from "react";

type Species = Omit<Database["public"]["Tables"]["species"]["Row"], "author"> & {
  author: {
    id: string;
    display_name: string | null;
  };
};

export default function SpeciesDetailPopup({ species }: { species: Species }) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn More</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-3xl">{species.scientific_name}</DialogTitle>
        <h4 className="text-2xl font-light italic">{species.common_name ?? "No common name provided"}</h4>
        <p>Total population: {species.total_population ?? "No information"}</p>
        <p>Kingdom: {species.kingdom ?? "No information."}</p>
        <p>{species.description ?? "No description available."}</p>
        <p className="font-light italic">Entry submitted by {species.author.display_name}</p>
      </DialogContent>
    </Dialog>
  );
}
