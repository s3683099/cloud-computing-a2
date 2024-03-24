"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavbarLink = (props: { path: string; label: string }) => {
  const currentPath = usePathname();

  return (
    <Link
      className={`${
        props.path === currentPath && "text-zinc-900"
      } text-zinc-500 hover:text-zinc-800 transition-colors`}
      href={props.path}
    >
      {props.label}
    </Link>
  );
};

export default NavbarLink;
