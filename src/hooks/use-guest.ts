"use client";

import { useEffect, useState } from "react";
import { getGuestId } from "@/lib/storage";

export function useGuestId() {
  const [guestId, setGuestId] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setGuestId(getGuestId());
    setHydrated(true);
  }, []);

  return { guestId, hydrated };
}
