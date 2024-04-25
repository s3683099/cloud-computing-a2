"use client";

import { Button, Spinner } from "@radix-ui/themes";
import axios from "axios";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const RemoveButton = ({
  songTitle,
  onRefresh,
}: {
  songTitle: string;
  onRefresh: Function;
}) => {
  const [loading, setLoading] = useState(false);

  const onRemove = async () => {
    console.log(songTitle);
    setLoading(true);

    try {
      await axios.put("/api/songs/my", { title: songTitle });
      await onRefresh();
      toast.success("Unsubscribed to " + songTitle);
    } catch (err: any) {
      console.log(err);
      toast.error(err.response.data);
    }
    setLoading(false);
  };

  return (
    <Button onClick={onRemove} color="red">
      Remove {loading && <Spinner />}
    </Button>
  );
};

export default RemoveButton;
