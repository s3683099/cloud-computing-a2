"use client";

import {
  Box,
  Button,
  Callout,
  Container,
  Flex,
  Heading,
  Separator,
  Spinner,
  TextField,
} from "@radix-ui/themes";
import React, { useState } from "react";
import Messages from "../components/Messages";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const onPasswordSubmit = async () => {
    setIsSubmitting(true);

    try {
      const res = await axios.post("/api/password", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      if (res.status == 200) {
        router.push("/auth");
      } else {
        setError("The old password is incorrect");
      }
    } catch (e) {
      setError("The old password is incorrect");
    }

    setIsSubmitting(false);
  };

  return (
    <Container>
      <Flex direction={"column"} gap="3">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}
        <Flex gap="3">
          <Flex direction="column" gap="1">
            <Heading size="3">Old Password</Heading>
            <TextField.Root onChange={(e) => setOldPassword(e.target.value)} />
          </Flex>
          <Flex direction="column" gap="1">
            <Heading size="3">New Password</Heading>
            <TextField.Root onChange={(e) => setNewPassword(e.target.value)} />
          </Flex>
        </Flex>
        <Box className="mb-5">
          <Button disabled={isSubmitting} onClick={onPasswordSubmit}>
            {"Change"}
            {isSubmitting && <Spinner />}
          </Button>
        </Box>
        {/* <Box style={{ width: "350px" }}>
          <Separator my="3" size="4" />
        </Box> */}
        <Messages isProfile={true} />
      </Flex>
    </Container>
  );
};

export default ProfilePage;
