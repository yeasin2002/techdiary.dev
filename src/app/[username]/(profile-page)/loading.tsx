import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="grid place-content-center h-full">
      <Loader className=" animate-spin size-10" />
    </div>
  );
};

export default Loading;
