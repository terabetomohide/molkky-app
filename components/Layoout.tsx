import React from "react";
import Link from "next/link";
import { t } from "utils/text";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Link href={"/"}>
        <a> {t("home")}</a>
      </Link>
      <hr />
      <div>{children}</div>
    </div>
  );
}
