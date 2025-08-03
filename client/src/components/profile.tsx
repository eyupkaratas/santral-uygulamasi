"use client";

import { DecodedToken } from "@/types/decoded-token";
import { useEffect } from "react";
import { toast } from "sonner";
import ProfileCard from "./profile-card";

type ProfileProps = {
  decodedToken: DecodedToken;
};

export default function Profile({ decodedToken }: ProfileProps) {
  const { personalAdSoyad, dahiliNo, birim, unvan, eposta, rol } = decodedToken;

  useEffect(() => {
    toast.success(
      <>
        <p className="text-center">
          Hoş geldin <strong>{personalAdSoyad}</strong>.
        </p>
        <p className="text-center">
          Rolün: <strong>{rol}</strong>
        </p>
      </>,
      {
        closeButton: true,
        position: "top-center",
        classNames: {
          content: "w-full",
        },
      }
    );
  }, [personalAdSoyad, rol]);

  return <ProfileCard adSoyad={personalAdSoyad} birim={birim} unvan={unvan} dahiliNo={dahiliNo} eposta={eposta} />;
}
