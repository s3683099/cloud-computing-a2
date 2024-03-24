"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { Box, Container, Flex } from "@radix-ui/themes";

const NavBar = () => {
  const currentPath = usePathname();

  const links = [
    { label: "Forum", href: "/forum" },
    { label: "Admin", href: "/admin" },
  ];

  return (
    <nav className="border-b mb-5 px-5 h-14 flex items-center">
      <Container>
        <Flex justify={"between"}>
          <Flex align={"center"} gap={"3"}>
            <ul className="flex space-x-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    className={`${
                      link.href === currentPath && "text-zinc-900"
                    } text-zinc-500 hover:text-zinc-800 transition-colors`}
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Flex>
          <Box>
            <Link
              className={`${
                "/login" === currentPath && "text-zinc-900"
              } text-zinc-500 hover:text-zinc-800 transition-colors`}
              href="/login"
            >
              Login
            </Link>
          </Box>
        </Flex>
      </Container>
    </nav>
  );
};

export default NavBar;
