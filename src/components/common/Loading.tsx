import { PropsWithChildren } from "react";

export const LoadingScreen = ({
  message,
  height = "h-screen",
}: PropsWithChildren<{ message: string; height?: string }>) => {
  return (
    <div className={`${height} flex w-screen flex-col items-center justify-center bg-[#1e1e1e] text-[#D9D9D9]`}>
      <div className="lds-ring mb-5">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <p>{message}</p>
    </div>
  );
};
