import { cookies } from "next/headers";
import React from "react";

import { Avatar, Box, Container, Flex, Text } from "@radix-ui/themes";
import NavbarLink from "./components/NavbarLink";
import Image from "next/image";

const NavBar = () => {
  const links = [
    { label: "Songs", href: "/songs" },
    { label: "Subscriptions", href: "/subscriptions" },
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
                  <NavbarLink path={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </Flex>
          <Box>
            {!cookies().has("session") ? (
              <NavbarLink path={"/login"} label="Login" />
            ) : (
              <Flex align={"center"} gap="5">
                <Flex align={"center"} gap="2">
                  <Text>{cookies().get("session")?.value ?? ""}</Text>
                </Flex>
                <NavbarLink path="/auth" label="Logout" />
              </Flex>
            )}
          </Box>
        </Flex>
      </Container>
    </nav>
  );
};

export const dynamic = "force-dynamic";
export default NavBar;
