"use client";

import {
  Box,
  Button,
  Callout,
  Card,
  Container,
  Flex,
  Heading,
  Inset,
  ScrollArea,
  Separator,
  Spinner,
  TextField,
  Text,
} from "@radix-ui/themes";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cookies } from "next/headers";
import RemoveButton from "../components/RemoveButton";

interface Song {
  Title: string;
  Artist: string;
  Year: string;
  WebUrl: string;
  ImgUrl: string;
}

const SubscriptionPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const initialized = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [year, setYear] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getSongs();
    }
  });

  const getSongs = async () => {
    // setIsLoading(true);

    const res = await axios.get("/api/songs/my");
    setSongs((_) => []);

    if (res.data.songs.length > 0) {
      res.data.songs.forEach((song: Song) => {
        console.log(song);
        setSongs((prevState) => [...prevState, Object.assign({}, song)]);
      });
    } else {
      // setError("No result is retrieved. Please query again");
    }

    setIsLoading(false);
  };

  return (
    <Container>
      {isLoading ? (
        <Spinner />
      ) : (
        <Box>
          {error && (
            <Callout.Root color="red" className="mb-5">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}
          <Heading className="mb-3">Subscriptions: {songs.length}</Heading>
          <Flex gap="3" direction={"column"} className="max-w-xl">
            {songs.map((song, index) => (
              <Box key={index}>
                <Card size="2">
                  <Flex>
                    <Inset clip="padding-box" side="left" pr="current">
                      {song.ImgUrl != "" ? (
                        <Image
                          src={song.ImgUrl}
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
                        <Heading size="2">Title</Heading>
                        <Text as="p" size="2">
                          {song.Title}
                        </Text>
                        <Heading size="2" className="mt-2">
                          Artist
                        </Heading>
                        <Text as="p" size="2">
                          {song.Artist}
                        </Text>
                        <Heading size="2" className="mt-2">
                          Yar
                        </Heading>
                        <Text as="p" size="2">
                          {song.Year}
                        </Text>
                      </Flex>

                      <Flex align={"center"} gap="4">
                        <Box>
                          <RemoveButton
                            songTitle={song.Title}
                            onRefresh={async () => await getSongs()}
                          />
                        </Box>
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

export default SubscriptionPage;
