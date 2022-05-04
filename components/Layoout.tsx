import React from "react";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Link href={"/"}>
        <a>home</a>
      </Link>
      <hr />
      <div>{children}</div>
    </div>
  );
}
