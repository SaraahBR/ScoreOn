export const dynamic = "force-dynamic";

import VerifyClient from "./verify-client";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = (await searchParams) ?? {};
  const token = typeof params.token === "string" ? params.token : "";

  return <VerifyClient token={token} />;
}
