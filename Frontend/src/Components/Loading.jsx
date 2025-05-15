import React, { useEffect, useState } from "react";
import { GridLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

export default function Loading({ auth = false, loader = {} }) {
  const [showTimer, setShowTimer] = useState(false);
  const [timer, setTimer] = useState(60);
  const { setLoading } = loader;

  // After 3 seconds, show the additional message and countdown
  useEffect(() => {
    if (!auth) {
      const delay = setTimeout(() => setShowTimer(true), 3000);
      return () => clearTimeout(delay);
    }
  }, [auth]);

  // Start the countdown from 60 seconds once timer is visible
  useEffect(() => {
    let countdown;
    if (showTimer && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    // If timer runs out and there's a way to turn off the loader, do it
    if (showTimer && timer === 0 && setLoading) {
      setLoading(false);
    }

    return () => clearInterval(countdown);
  }, [showTimer, timer, setLoading]);

  // Show during authentication (like login/signup)
  if (auth) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-center">
        <GridLoader color="#36d7b7" cssOverride={{ ...override }} size={25} />
        <p className="text-lg font-semibold">Authenticating credentials</p>
        <p className="text-gray-500">Please wait a moment...</p>
        <p className="text-sm text-gray-400">Time remaining: {timer}s</p>
      </div>
    );
  }

  // Default loading view for pages
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] space-y-4 text-center">
      <GridLoader color="#36d7b7" cssOverride={override} size={30} />
      <p className="text-xl font-semibold">Loading data...</p>

      {showTimer && (
        <>
          <p className="text-sm text-gray-500">
            This might take up to a minute to wake the server.
          </p>
          <p className="text-sm text-gray-500">
            If it takes longer, something's probably off.
          </p>
          <p className="text-sm text-gray-400 italic">
            Free hosting things, you know...
          </p>
          <p className="text-sm text-gray-400">Time left: {timer}s</p>
        </>
      )}
    </div>
  );
}
