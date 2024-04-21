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
import React, { useEffect, useRef, useState } from "react";
import Messages from "../components/Messages";
import axios from "axios";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const initialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getSongs();
    }
  });

  const getSongs = async () => {
    const res = await axios.post("/api/songs", {
      title: "",
      artist: "",
      year: "",
    });

    res.data.forEach((item) => {
      console.log(item);
      // setMessages((prevState) => [...prevState, Object.assign({}, message)]);
    });
    console.log(res.data);

    setIsLoading(false);
  };

  return (
    <Container>
      <Flex direction={"column"} gap="3">
        {error && (
          <Callout.Root color="red" className="mb-5">
            <Callout.Text>{error}</Callout.Text>
          </Callout.Root>
        )}

        {/* <Container>
          {isLoading ? (
            <Spinner />
          ) : (
            <Box>
              <Button
                onClick={() => {
                  router.push("/forum/new");
                }}
                className="!mb-5"
              >
                Create Message
              </Button>

              <Heading className="mb-3">Messages</Heading>
              <Flex gap="3" direction={"column"} width={"fit-content"}>
                {messages.map((message, index) => (
                  <Box key={index}>
                    <Card size="2">
                      <Flex>
                        <Inset clip="padding-box" side="left" pr="current">
                          {message.image != "" ? (
                            <Image
                              src={message.image}
                              width="200"
                              height="200"
                              alt="Bold typography"
                              style={{
                                display: "block",
                                objectFit: "cover",
                                height: "100%",
                                backgroundColor: "var(--gray-5)",
                              }}
                            />
                          ) : null}
                        </Inset>

                        <Flex
                          justify={"between"}
                          align={"center"}
                          className="!w-full"
                        >
                          <Flex direction={"column"} maxWidth="400px">
                            <Heading size="2">Subject</Heading>
                            <Text as="p" size="2">
                              {message.subject}
                            </Text>
                            <Heading size="2" className="mt-2">
                              Message
                            </Heading>
                            <ScrollArea
                              // type="always"
                              scrollbars="vertical"
                              style={{ height: 50 }}
                            >
                              <Text as="p" size="2">
                                {message.message}
                              </Text>
                            </ScrollArea>
                          </Flex>

                          <Flex align={"center"} gap="4">
                            <Flex direction={"column"} gap="3">
                              <Box>
                                <Heading size="2">Created Date</Heading>
                                <Text as="p" size="2">
                                  {message.time}
                                </Text>
                              </Box>

                              <Flex align={"center"} gap="1">
                                <Avatar
                                  src={message.profileImage}
                                  fallback="?"
                                  size="3"
                                  radius="full"
                                  className="cursor-pointer"
                                />
                                <Text as="p" size="2">
                                  {message.userName}
                                </Text>
                              </Flex>
                            </Flex>
                            {isProfile && (
                              <Box>
                                <Button onClick={() => onEdit(message.id)}>
                                  Edit
                                </Button>
                              </Box>
                            )}
                          </Flex>
                        </Flex>
                      </Flex>
                    </Card>
                  </Box>
                ))}
              </Flex>
            </Box>
          )}
        </Container> */}
      </Flex>
    </Container>
  );
};

export default ProfilePage;
