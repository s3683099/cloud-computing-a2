"use client";

import {
  Callout,
  Flex,
  Heading,
  TextField,
  Button,
  Spinner,
  Container,
  TextArea,
  Box,
} from "@radix-ui/themes";
import Image from "next/image";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const RegistrationPage = () => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      await axios.post("/api/register", { email, userName, password });

      router.push("/login");
      router.refresh();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.response.data);
    }
  };

  return (
    <Container maxWidth="250px">
      <Box>
        <Heading className="mb-5">Register</Heading>
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <Flex direction="column" gap="3" maxWidth="250px">
          <Flex direction="column" gap="1">
            <Heading size="3">Username</Heading>
            <TextField.Root
              onChange={(e) => setUserName(e.target.value)}
              type="text"
            />
          </Flex>
          <Flex direction="column" gap="1">
            <Heading size="3">Email</Heading>
            <TextField.Root
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </Flex>

          <Flex direction="column" gap="1">
            <Heading size="3">Password</Heading>
            <TextField.Root
              onChange={(e) => setPassword(e.target.value)}
              type="password"
            />
          </Flex>
          <Button disabled={isSubmitting} onClick={onSubmit}>
            {"Register"}
            {isSubmitting && <Spinner />}
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default RegistrationPage;
