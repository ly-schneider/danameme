"use client";

import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup, InputOTPSlot
} from "./ui/input-otp";
import Spinner from "./utils/Spinner";
import BackendUrl from "./utils/BackendUrl";
import { saveSession } from "@/lib/Session";
import { useRouter } from "next/navigation";

export default function EmailVerification({ session }) {
  const router = useRouter();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [errors, setErrors] = useState({
    submit: "",
  });
  const [successResend, setSuccessResend] = useState(false);

  useEffect(() => {
    if (successResend) {
      setTimeout(() => {
        setSuccessResend(false);
      }, 3000);
    }
  }, [successResend]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (otp.length !== 6) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BackendUrl()}/accounts/email-verification`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          otp
        }),
      });

      if (res.status === 400) {
        setErrors({ submit: "Ungültiger Bestätigungscode" });
        setLoading(false);
        return
      }

      if (!res.ok) {
        throw new Error();
      }

      const token = res.headers.get("accesstoken").split(" ")[1];

      await saveSession(token);

      router.push("/");
    } catch (e) {
      setLoading(false);
      setErrors({ submit: "Es gab einen Fehler beim verifizieren!" });
    }
  }

  async function resendVerification() {
    setLoadingResend(true);

    try {
      const res = await fetch(`${BackendUrl()}/accounts/email-verification`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
        },
      });

      if (!res.ok || res.status !== 200) {
        throw new Error();
      }

      setSuccessResend(true);
      setLoadingResend(false);
    } catch (e) {
      setLoadingResend(false);
      setErrors({ submit: "Es gab einen Fehler beim erneut senden!" });
    }
  }

  function hideEmail() {
    const email = session.user.email;
    const atIndex = email.indexOf("@");
    const hiddenEmail = email.substring(0, 2) + "*****" + email.substring(atIndex);
    return hiddenEmail;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5">
      <p className="text">Wir haben dir einen Bestätigungscode per E-Mail an {hideEmail()} gesendet!</p>
      {errors.submit && (
        <div className="rounded-[10px] bg-error px-4 py-2 text text-sm text-center mb-4 mt-4">
          {errors.submit}
        </div>
      )}
      <div className="flex flex-col mt-4">
        <InputOTP
          maxLength={6}
          containerClassName="mx-auto"
          value={otp}
          onChange={(otp) => setOtp(otp)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="w-full mt-5">
        <button className="btn btn-primary w-full" type="submit">
          <Spinner className={"fill-text " + (loading ? "mr-3" : "hidden")} />
          Verifizieren
        </button>
        <div className="mt-2">
          {successResend ? (
            <p className="text text-success">Bestätigungscode wurde erneut gesendet!</p>
          ) : (
            <button type="button" onClick={resendVerification} className="text text-secondary hover:underline flex flex-row items-center">
              <Spinner className={"fill-secondary " + (loadingResend ? "mr-2" : "hidden")} />Erneut senden
            </button>
          )}
        </div>
      </div>
    </form>
  );
}