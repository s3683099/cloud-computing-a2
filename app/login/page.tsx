"use client";

import {
  TextField,
  Flex,
  Box,
  Heading,
  Button,
  Spinner,
  Link,
  Container,
  Callout,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEamil] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      await axios.post("/api/login", {
        id: email,
        password: password,
      });
      router.push("/forum");
      router.refresh();
    } catch (err) {
      setIsSubmitting(false);
      setError("ID or password is invalid");
    }
  };

  return (
    <Container maxWidth="250px">
      <Heading className="mb-5">Login</Heading>
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <Flex direction="column" gap="3">
        <Flex direction="column" gap="1">
          <Heading size="4">ID</Heading>
          <TextField.Root onChange={(e) => setEamil(e.target.value)} />
        </Flex>{" "}
        <Flex direction="column" gap="1">
          <Heading size="4">Password</Heading>
          <TextField.Root onChange={(e) => setPassword(e.target.value)} />
        </Flex>
        <Button disabled={isSubmitting} onClick={onSubmit}>
          {"Login"}
          {isSubmitting && <Spinner />}
        </Button>
        <Link href="/registration">Regiser</Link>
      </Flex>
    </Container>
  );
};

export default LoginPage;
