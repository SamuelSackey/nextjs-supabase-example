# Supabase Example

## Configure Providers

In the Supabase dashboard , go to `Authorization > Providers`, and configure the provider you want with the necessary credentials

- [Google OAuth Credentials Setup](https://youtu.be/_XM9ziOzWk4?si=00qdQYmhBqbY1Qcn)
- [GitHub OAuth Credentials Setup](https://egghead.io/lessons/supabase-create-an-oauth-app-with-github)

## Project Setup

In the nextjs project, create `env.local` in the root of the project and add:

```.env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can get these values from your Supabase dashboard `Settings > API`

## Configure Supabase Clients

In `src/lib` directory, create a `supabase` directory and add:

### Browser Client

- [`src/lib/supabase/browser-client.ts`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/lib/supabase/browser-client.ts)

This file contains the function used to call the supabase client in a nextjs client component

### Server Client

- [`src/lib/supabase/server-client.ts`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/lib/supabase/server-client.ts)

This file contains 3 functions used to call the supabase client on the server

- `createSupabaseServerClient()`: used in server actions and route handlers
- `createSupabaseServerComponentClient()`: used in server components
- `createSupabaseReqResClient()`: used in middleware

For more information check out this [video](https://youtu.be/XIj7nmIYtbo?si=KI9yhdYI8Ddcpq5s)

## Configure Middleware

Create the `middleware.ts` in your `src` directory. This intercepts any route specified in the `matcher` and is used to refresh the supabase session cookies and also redirect users based on whether they're authenticated or not.

**This can be used used for creating [protected routes](https://github.com/SamuelSackey/nextjs-supabase-example/blob/ba0d4d1b7f52a2f0435933892ea5d2b5cb7c1c0f/src/middleware.ts#L20).**

An alternative method of creating protected routes is highlighted [here](#page-based-protected-routes).

To run the middleware on every route, simply remove the [`matcher`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/ba0d4d1b7f52a2f0435933892ea5d2b5cb7c1c0f/src/middleware.ts#L28) object from the config.

- [`src/middleware.ts`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/middleware.ts)

## Configure Callback Endpoint

### Callback

In the `app` directory, create the callback endpoint `auth/callback/route.ts`.

This API endpoint uses the code returned from the OAuth provider to sign in the user. The authenticated user is then redirected to the specified URL.

If authentication fails, the user is redirected to an another page specified in the callback.

- [`src/app/auth/callback/route.ts`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/app/auth/callback/route.ts)

### Authentication Error Page

The user is redirected to this page when the authentication fails.

- [`src/app/auth/auth-error/page.tsx`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/app/auth/auth-error/page.tsx)

## Authentication Buttons

Create button components to handle login and logout. We need to interact with the button to call the authentication functions, hence we make them client components and use the supabase browser client.

### Login

You can specify the OAuth provider you're using in the `provider` property in the login function.

The login button also accepts an optional `nextUrl` prop which can be used to redirect the user to the specified URL after they have sign in.

Example:

```tsx
<LoginButton nextUrl="/account" />
```

- [`src/components/login-button.tsx`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/components/login-button.tsx)

### Logout

- [`src/components/logout-button.tsx`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/components/logout-button.tsx)

## Fetching Session and User Data in Server Components

### Fetch session in server components

```tsx
const {
  data: { session },
  error,
} = await createSupabaseServerComponentClient().auth.getSession();

// get user data from session object
const user = session?.user;
```

Example in [`src/components/nav-bar.tsx`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/components/nav-bar.tsx)

### Fetch user data directly in server components

```tsx
const {
  data: { user },
  error,
} = await createSupabaseServerComponentClient().auth.getUser();
```

Example in [`src/components/avatar.tsx`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/components/avatar.tsx)

## Fetching User Data in Client Components

To prevent repeating code when fetching the session in client components, create a custom hook `useSession()` which returns the user session object.

The custom hook: [`src/lib/supabase/use-session.ts`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/lib/supabase/use-session.ts)

Example of usage in [`src/components/user-information.tsx`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/components/user-information.tsx)

## Dynamically Rendering Client Components with User Data

When dealing with a client component that dynamically renders elements based on user data, a common issue arises during the initial load or refresh. In such scenarios, where the session data may not be immediately available in the browser, the component tends to display a false value before rendering the true value, leading to an undesirable flickering effect and poor user experience.

To address this issue, we can implement the following solution:

- Displaying a loading state until the user data is fetched. Example in [`src/components/user-information.tsx`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/components/user-information.tsx)

- If the client component has a server component as its parent, the session can be fetched at the parent level and passed down to the client component.

- Creating a server component wrapper specifically for the client component. The server wrapper is responsible for fetching the session data and passing it down to the client. This setup allows reusability of the component. Example of this method;
  - Server Wrapper: [`src/components/details-button-server.tsx`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/components/details-button-server.tsx)
  - Client Component: [`src/components/details-button-client.tsx`](https://github.com/SamuelSackey/nextjs-supabase-example/blob/main/src/components/details-button-client.tsx)

For more information, check out this [video](https://egghead.io/lessons/supabase-dynamically-render-ui-based-on-user-session-with-ssr-in-next-js-client-components)

### Page-based Protected Routes

Routes can be protected by checking whether there is a supabase session. If there is no session, the user is redirected to the specified page.

```tsx
// other imports...
import { redirect } from "next/navigation";

export default async function Page() {
  const {
    data: { session },
    error,
  } = await createSupabaseServerComponentClient().auth.getSession();

  if (!session) {
    redirect("/");
  }

  // ...
}
```

## Generating Typescript Definitions (Additional)

Login to the supabase CLI with your supabase access token

```sh
pnpm dlx supabasee login
```

Generate the types using your supabase project id:

```sh
pnpm dlx supabase gen types typescript --project-id your_supabase_project_id > src/lib/supabase/database.types.ts
```

If you're developing locally or on a self-hosted supabase instance, you can use the database URL instead of the project id:

```sh
pnpm dlx supabase gen types typescript --db-url your_supabase_database_url > src/lib/supabase/database.types.ts
```

You can then add the types to you project by including them in the `browser-client.ts` and `server-client.ts` files.

### Example

```ts
import { Database } from "@/lib/supabase/database.types";
// ...

export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>();
  // ...
}
```

## Where to go from here

The project is primarily based on this [course](https://egghead.io/courses/build-a-twitter-clone-with-the-next-js-app-router-and-supabase-19bebadb), which includes topics such as querying the database, setting up row-level security, optimistic updates, and many more. Although it utilizes the auth-helpers package, it can be easily modified using the contents of this project.

I would also like to give credit to the providers of the resources used in this project.
