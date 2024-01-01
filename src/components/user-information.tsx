"use client";

import useSession from "@/lib/supabase/use-session";
import { useRouter } from "next/navigation";

export default function UserInformation() {
  const user = useSession()?.user;

  const router = useRouter();

  return (
    <>
      {user ? (
        <>
          <p>{`username: ${user?.user_metadata?.full_name}`}</p>
          <p>{`email: ${user?.email}`}</p>
        </>
      ) : (
        <p>Loading ...</p>
      )}

      <br />

      <button onClick={() => router.back()}>Go Back</button>
    </>
  );
}
