'use client';

import type { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export function clientClerkDebugWarning() {
  if (!publishableKey && process.env.NODE_ENV !== "production") {
    console.warn(
      "Clerk publishable key is not configured. Authentication UI will be disabled until NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set.",
    );
  }
}

export default function ClientClerkProvider({
  children,
}: {
  children: ReactNode;
}) {
  if (!publishableKey) {
    clientClerkDebugWarning();
    return <>{children}</>;
  }

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
