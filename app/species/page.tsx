import { createServerSupabaseClient } from "@/lib/server-utils";

import { redirect } from "next/navigation";
import Content from "./content";

export default async function SpeciesList() {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Obtain the ID of the currently signed-in user
  const sessionId = session.user.id;

  //Also fetch display name of author associated with each species so that we can display during detailed view
  const { data: species } = await supabase
    .from("species")
    .select(
      `
    *,
    author:profiles (
    id,
      display_name
    )
  `,
    )
    .order("scientific_name", { ascending: true });

  //Packaged all content into a client wrapper to allow useStates
  return <Content species={species ?? []} userId={sessionId}></Content>;
}
