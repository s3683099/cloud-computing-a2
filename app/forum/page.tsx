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
} from "@radix-ui/themes";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";

const ForumPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    // setIsSubmitting(true);

    // console.log(image);

    // URL.createObjectURL(image!);

    // const formData = new FormData();
    // formData.append("fileupload", image!);
    const file = image;

    try {
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
      console.log(upload);
    } catch (err) {
      setIsSubmitting(false);
      setError("Failed to create message");
    }
  };

  return (
    <Container>
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <Flex direction="column" gap="3" maxWidth="250px">
        <Flex direction="column" gap="1">
          <Heading size="3">Subject</Heading>
          <TextField.Root onChange={(e) => setSubject(e.target.value)} />
        </Flex>
        <Flex direction="column" gap="1">
          <Heading size="3">Message</Heading>
          <TextArea onChange={(e) => setMessage(e.target.value)} />
        </Flex>
        <Heading size="3">Upload Image</Heading>
        <input
          type="file"
          id="img"
          name="img"
          accept="image/*"
          onChange={(e) => setImage(e.target.files![0])}
        ></input>
        <Button disabled={isSubmitting} onClick={onSubmit}>
          {"Submit"}
          {isSubmitting && <Spinner />}
        </Button>
      </Flex>
    </Container>
  );
};

export default ForumPage;
