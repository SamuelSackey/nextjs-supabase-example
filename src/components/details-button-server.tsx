import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import DetailsButtonClient from "./details-button-client";

export default async function DetailsButtonServer() {
  const {
    data: { session },
    error,
  } = await createSupabaseServerComponentClient().auth.getSession();

  return <DetailsButtonClient session={session} />;
}
