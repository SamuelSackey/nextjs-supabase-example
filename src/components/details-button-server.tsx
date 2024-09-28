import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import DetailsButtonClient from "./details-button-client";

export default async function DetailsButtonServer() {
  const {
    data: { user },
    error,
  } = await createSupabaseServerComponentClient().auth.getUser();

  return <DetailsButtonClient user={user} />;
}
