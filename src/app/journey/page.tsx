import { redirect } from "next/navigation";

// /journey without train number redirects to Home
export default function JourneyIndexPage() {
  redirect("/");
}
