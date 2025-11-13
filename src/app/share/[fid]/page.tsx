import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { APP_URL, APP_NAME, APP_DESCRIPTION } from "~/lib/constants";
import { getMiniAppEmbedMetadata } from "~/lib/utils";
export const revalidate = 300;

// Share page for users who have signed the manifesto
// Uses the share OG image that shows "I signed the" + manifesto title
export async function generateMetadata(): Promise<Metadata> {
  const imageUrl = `${APP_URL}/api/share-opengraph-image`;

  return {
    title: `${APP_NAME} - Share`,
    openGraph: {
      title: APP_NAME,
      description: APP_DESCRIPTION,
      images: [imageUrl],
    },
    other: {
      "fc:frame": JSON.stringify(getMiniAppEmbedMetadata(imageUrl)),
    },
  };
}

export default function SharePage() {
  // redirect to home page
  redirect("/");
}
