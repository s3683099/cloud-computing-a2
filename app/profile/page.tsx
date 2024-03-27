"use client";

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Spinner,
  TextField,
} from "@radix-ui/themes";
import React, { useState } from "react";

const ProfilePage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onPasswordSubmit = () => {};

  return (
    <Container>
      <Flex direction={"column"} gap="3">
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
        <Box>
          <Button disabled={isSubmitting} onClick={onPasswordSubmit}>
            {"Change"}
            {isSubmitting && <Spinner />}
          </Button>
        </Box>
        <Box>
          
        </Box>
      </Flex>
    </Container>
  );
};

export default ProfilePage;
