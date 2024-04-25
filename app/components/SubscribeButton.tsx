"use client";

import { Button, Spinner } from "@radix-ui/themes";
import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const SubscribeButton = ({ songTitle }: { songTitle: string }) => {
  const [loading, setLoading] = useState(false);

  const onSubscribe = async () => {
    console.log(songTitle);
    setLoading(true);

    try {
      await axios.post("/api/subscription", { title: songTitle });
      toast.success("Subscribed to " + songTitle);
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data);
    }
    setLoading(false);
  };

  return (
    <Button onClick={onSubscribe}>Subscribe {loading && <Spinner />}</Button>
  );
};

export default SubscribeButton;
