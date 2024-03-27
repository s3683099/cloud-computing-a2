import { cookies } from "next/headers";
import React from "react";

import { Avatar, Box, Container, Flex } from "@radix-ui/themes";
import NavbarLink from "./components/NavbarLink";
import Image from "next/image";

const NavBar = () => {
  const links = [
    { label: "Forum", href: "/forum" },
    { label: "Admin", href: "/profile" },
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
                  <Avatar
                    src={cookies().get("image")?.value}
                    fallback="?"
                    size="3"
                    radius="full"
                    className="cursor-pointer"
                  />
                  <NavbarLink
                    path={"/profile"}
                    label={cookies().get("session")?.value ?? ""}
                  />
                </Flex>
                <NavbarLink path="/logout" label="Logout" />
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
