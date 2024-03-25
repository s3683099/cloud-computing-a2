"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const LogoutPage = () => {
  const initialized = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      router.replace("/login");
      router.refresh();
    }
  });

  return <div>LogoutPage</div>;
};

export default LogoutPage;
