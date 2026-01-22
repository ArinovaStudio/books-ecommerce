"use client";
import React from "react";
import { useRouter } from "next/navigation";
function useGoBack() {
  const router = useRouter();
  const goBack = () => {
    if (window.history.length > 0) {
      router.back();
    } else {
      router.push("/");
    }
  };
  return goBack;
}

export default useGoBack;
