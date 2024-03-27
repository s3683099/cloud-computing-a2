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
  const [id, setId] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const uploadImage = async () => {
    const file = image;

    const result = await axios.get(`/api/upload/${image?.name}`);
    const { url, fields } = await result.data;
    const formData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
    });
    const upload = await fetch(url, {
      method: "POST",
      body: formData,
    });

    return upload;
  };

  const onSubmit = async () => {
    setIsSubmitting(true);

    try {
      let res: Response;
      if (image) {
        res = await uploadImage();
      }

      //post new message with image url
      let imageUrlLocal =
        "https://storage.googleapis.com/cloud-computing-a1-s3683099.appspot.com/" +
        image?.name;

      await axios.post("/api/register", {
        id: id,
        userName: userName,
        password: password,
        image: res! != null && res.ok ? imageUrlLocal : "",
      });

      router.push("/login");
      router.refresh();
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.response.data);
    }
    // //refresh
    // setIsSubmitting(false);
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
            <Heading size="3">ID</Heading>
            <TextField.Root onChange={(e) => setId(e.target.value)} />
          </Flex>
          <Flex direction="column" gap="1">
            <Heading size="3">Username</Heading>
            <TextField.Root onChange={(e) => setUserName(e.target.value)} />
          </Flex>
          <Flex direction="column" gap="1">
            <Heading size="3">Password</Heading>
            <TextField.Root onChange={(e) => setPassword(e.target.value)} />
          </Flex>
          <Heading size="3">User Image</Heading>
          <input
            type="file"
            id="img"
            name="img"
            accept="image/*"
            onChange={(e) => setImage(e.target.files![0])}
          ></input>
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
