"use client";

import { useLoginPopup } from "@/components/app-login-popup";
import React from "react";

const Page = () => {
  const pp = useLoginPopup();
  return (
    <div>
      <button onClick={() => pp.show()}>open</button>
    </div>
  );
};

export default Page;
