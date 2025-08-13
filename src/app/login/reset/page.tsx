export const dynamic = "force-dynamic";

import ResetForm from "./reset-form";

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = (await searchParams) ?? {};
  const token = typeof params.token === "string" ? params.token : "";

  return <ResetForm token={token} />;
}
