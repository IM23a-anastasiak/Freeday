'use client';

import type { ComponentProps } from "react";
import { UserButton } from "@clerk/nextjs";

const hasPublishableKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function AuthUserButton(props: ComponentProps<typeof UserButton>) {
  if (!hasPublishableKey) {
    return (
      <span
        className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-slate-500 shadow-inner"
        title="Authentication disabled – set Clerk keys"
      >
        Auth disabled
      </span>
    );
  }

  return <UserButton {...props} />;
}
