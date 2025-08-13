export const dynamic = "force-dynamic"; 

import ResetForm from "./reset-form";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const token = (searchParams?.token as string) || "";
  return <ResetForm token={token} />;
}
