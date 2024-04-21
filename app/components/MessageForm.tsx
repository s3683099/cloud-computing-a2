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
import React, { useEffect, useRef, useState } from "react";

const MessageForm = ({ params }: { params?: { id: string } }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState<File>();
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      if (params) {
        // getMessage();
      } else {
        setIsLoading(false);
      }
    }
  });

  const getMessage = async () => {
    const res = await axios.get(`/api/message/${params?.id}/edit`);

    console.log("res", res.data);

    setSubject(res.data.subject);
    setMessage(res.data.message);
    setImageUrl(res.data.image);

    setIsLoading(false);
  };

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

      if (params) {
        await axios.patch(`/api/message/${params?.id}/edit`, {
          subject: subject,
          message: message,
          image: res! != null && res.ok ? imageUrlLocal : imageUrl,
          created: Date.now(),
        });
      } else {
        await axios.post("/api/message", {
          subject: subject,
          message: message,
          image: res! != null && res.ok ? imageUrlLocal : "",
          created: Date.now(),
        });
      }
      router.push("/forum");
      router.refresh();
    } catch (err) {
      setIsSubmitting(false);
      setError("Failed to create message");
    }
    // //refresh
    // setIsSubmitting(false);
  };

  return (
    <Container>
      {isLoading ? (
        <Spinner />
      ) : (
        <Box>
          <Heading className="mb-5">
            {params ? "Edit Message" : "Create Message"}
          </Heading>
          {error && (
            <Callout.Root color="red" className="mb-5">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}
          <Flex direction="column" gap="3" maxWidth="250px">
            <Flex direction="column" gap="1">
              <Heading size="3">Subject</Heading>
              <TextField.Root
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Flex>
            <Flex direction="column" gap="1">
              <Heading size="3">Message</Heading>
              <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Flex>
            <Heading size="3">Upload Image</Heading>
            {params && imageUrl != "" && (
              <Image src={imageUrl} width="100" height="100" alt="Image" />
            )}
            <input
              type="file"
              id="img"
              name="img"
              accept="image/*"
              onChange={(e) => setImage(e.target.files![0])}
            ></input>
            <Button disabled={isSubmitting} onClick={onSubmit}>
              {params ? "Update" : "Submit"}
              {isSubmitting && <Spinner />}
            </Button>
          </Flex>
        </Box>
      )}
    </Container>
  );
};

export default MessageForm;
