"use client";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button className="btn btn-primary px-6 py-2" onClick={() => router.back()}>
      <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
      Zurück
    </button>
  );
}