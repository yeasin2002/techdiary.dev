"use client";

import { myBookmarks } from "@/backend/services/bookmark.action";
import { toast } from "@/components/toast";
import { actionPromisify, sleep } from "@/lib/utils";

const Page = () => {
  return (
    <div>
      <button
        onClick={async () => {
          const res = await toast.promise(
            myBookmarks({ limit: 1, page: 1, offset: 0 })
          );
          toast.success(res!);
        }}
      >
        open
      </button>
    </div>
  );
};

export default Page;
