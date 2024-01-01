import { createSupabaseServerComponentClient } from "@/lib/supabase/server-client";
import Image from "next/image";

export default async function Avatar() {
  const {
    data: { user },
    error,
  } = await createSupabaseServerComponentClient().auth.getUser();

  return (
    <Image
      src={user?.user_metadata.avatar_url}
      alt="profile image"
      width={96}
      height={96}
    />
  );
}
