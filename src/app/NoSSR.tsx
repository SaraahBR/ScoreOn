"use client";

import dynamic from "next/dynamic";
import React from "react";

function NoSSRInner({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default dynamic(async () => NoSSRInner, { ssr: false });
