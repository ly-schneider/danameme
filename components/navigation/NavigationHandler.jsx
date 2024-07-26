import { getSession } from "@/lib/Session";
import NavigationLoggedIn from "./NavigationLoggedIn";
import NavigationLoggedOut from "./NavigationLoggedOut";

export default async function NavigationHandler() {
  const session = await getSession();

  return session ? (
    <NavigationLoggedIn session={session} />
  ) : (
    <NavigationLoggedOut />
  );
}