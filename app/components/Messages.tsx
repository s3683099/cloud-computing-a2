"use client";

import {
  Heading,
  Button,
  Spinner,
  Container,
  Box,
  Card,
  Inset,
  Text,
  Avatar,
  ScrollArea,
  Flex,
} from "@radix-ui/themes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface Message {
  subject: string;
  message: string;
  image: string;
  created: Date;
  time: string;
  userName: string;
  profileImage: string;
  id: string;
}

const Messages = ({ isProfile }: { isProfile: boolean }) => {
  const initialized = useRef(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getMesssages();
    }
  });

  const getMesssages = async () => {
    const res = await axios.get(
      isProfile ? "/api/message/something" : "/api/message"
    );
    res.data.forEach((message: Message) => {
      let date = new Date(message.created);
      message.time = date.toLocaleDateString("en-au", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      });
      setMessages((prevState) => [...prevState, Object.assign({}, message)]);
    });
    console.log(res.data);

    setIsLoading(false);
  };

  const onEdit = (id: string) => {
    router.push(`/forum/${id}/edit`);
  };

  return (
    <Container>
      {isLoading ? (
        <Spinner />
      ) : (
        <Box>
          {!isProfile && (
            <Button
              onClick={() => {
                router.push("/forum/new");
              }}
              className="!mb-5"
            >
              Create Message
            </Button>
          )}

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
    </Container>
  );
};

export default Messages;
