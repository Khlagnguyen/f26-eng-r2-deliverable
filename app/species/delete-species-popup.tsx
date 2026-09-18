import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { DialogClose } from "@radix-ui/react-dialog";
import { TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteSpeciesPopup({ id }: { id: number }) {
  const router = useRouter();
  const deleteEntry = async (id: number) => {
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("species").delete().eq("id", id);
    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }
    setOpen(false);
    router.refresh();
    return toast({
      title: "Species deleted!",
    });
  };
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TrashIcon className="size-5 cursor-pointer text-red-500" />
      </DialogTrigger>
      <DialogContent>
        <h1 className="pt-4 text-center text-2xl font-semibold">Are you sure you want to delete this entry?</h1>
        <div className="flex">
          <Button onClick={() => void deleteEntry(id)} className="ml-1 mr-1 flex-auto">
            Yes
          </Button>
          <DialogClose asChild>
            <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
              Cancel
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
