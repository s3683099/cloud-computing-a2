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
  Text,
} from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const LoginPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onLoadData = async () => {
    setIsSubmitting(true);

    try {
      await axios.get("/api/loadData");
      setError("");
      setSuccess("Data successfully loaded");
    } catch (err: any) {
      console.log(err);
      setSuccess("");
      setError("Could not load data, " + err.response.data);
    }
    setIsSubmitting(false);
  };

  const onDeleteData = async () => {
    setIsDeleting(true);

    try {
      await axios.delete("/api/loadData");
      setError("");
      setSuccess("Data successfully removed");
    } catch (err: any) {
      console.log(err);
      setSuccess("");
      setError("Could not delete data, " + err.response.data);
    }
    setIsDeleting(false);
  };

  return (
    <Container>
      <Flex direction="column">
        <Heading className="mb-5">Cloud Computing - Assignment 2</Heading>
        <Text>
          <Text weight="bold">Name:</Text> Omar Yasir Mian
        </Text>
        <Text className="mb-5">
          <Text weight="bold">Student Id:</Text> s3683099
        </Text>
      </Flex>

      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      {success && (
        <Callout.Root color="green" className="mb-5">
          <Callout.Text>{success}</Callout.Text>
        </Callout.Root>
      )}
      <Flex gap="3">
        <Button
          disabled={isSubmitting}
          onClick={onLoadData}
          color="green"
          style={{ width: "120px" }}
        >
          {"Load Data"}
          {isSubmitting && <Spinner />}
        </Button>
        <Button
          disabled={isDeleting}
          onClick={onDeleteData}
          color="red"
          style={{ width: "140px" }}
        >
          {"Remove Data"}
          {isDeleting && <Spinner />}
        </Button>
      </Flex>
    </Container>
  );
};

export default LoginPage;
