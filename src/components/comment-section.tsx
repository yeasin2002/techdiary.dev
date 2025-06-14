"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as commentActions from "@/backend/services/comment.action";
import { Button } from "./ui/button";
import { CommentPresentation } from "@/backend/models/domain-models";
import { useSession } from "@/store/session.atom";
import { useLoginPopup } from "./app-login-popup";
import { Textarea } from "./ui/textarea";
import _t from "@/i18n/_t";
import { useTranslation } from "@/i18n/use-translation";
import { Loader } from "lucide-react";
import React from "react";
import _ from "lodash";

export const CommentSection = (props: {
  resource_id: string;
  resource_type: "ARTICLE" | "COMMENT";
}) => {
  const { _t } = useTranslation();
  const queryClient = useQueryClient();
  const appLoginPopup = useLoginPopup();
  const session = useSession();
  const mutation = useMutation({
    mutationFn: (newComment: { body: string }) =>
      commentActions.createMyComment({
        resource_id: props.resource_id,
        resource_type: props.resource_type,
        body: newComment.body,
      }),
    onMutate: async (newComment) => {
      if (!session?.user) {
        appLoginPopup.show();
        return;
      }

      // Optimistically update the UI by adding the new comment to the list
      await queryClient.cancelQueries({
        queryKey: ["comments", props.resource_id, props.resource_type],
      });

      const oldComments = queryClient.getQueryData([
        "comments",
        props.resource_id,
        props.resource_type,
      ]);

      queryClient.setQueryData(
        ["comments", props.resource_id, props.resource_type],
        (old: any) => {
          return [
            {
              id: crypto.randomUUID(), // Generate a temporary ID for optimistic update
              body: newComment.body,
              level: 0,
              author: {
                id: session?.user?.id || "temp-user-id",
                name: session?.user?.name || "Temp User",
                username: session?.user?.username || "tempuser",
                email: session?.user?.email || "tempuser@example.com",
              },
              replies: [],
              created_at: new Date(),
            } satisfies CommentPresentation,
            ...old,
          ];
        }
      );
      return { oldComments };
    },
  });

  const query = useQuery({
    queryKey: ["comments", props.resource_id, props.resource_type],
    queryFn: () =>
      commentActions.getComments({
        resource_id: props.resource_id,
        resource_type: props.resource_type,
      }),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>

        {/* New Comment Box */}
        <CommentEditor
          onSubmit={(body) => {
            mutation.mutate({ body });
          }}
          isLoading={mutation.isPending}
          placeholder={_t("What are your thoughts?")}
        />
      </div>

      {/* <pre>{JSON.stringify(query.data, null, 2)}</pre> */}

      {/* Comments List */}
      <div className="space-y-4">
        {query?.data?.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

const CommentEditor = (props: {
  onSubmit: (body: string) => void;
  isLoading: boolean;
  placeholder: string;
}) => {
  const { _t } = useTranslation();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputRef.current && inputRef.current.value.trim()) {
        props.onSubmit(inputRef.current.value.trim());
        inputRef.current.value = "";
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef.current && inputRef.current.value.trim()) {
      props.onSubmit(inputRef.current.value.trim());
      inputRef.current.value = "";
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="relative">
        <Textarea
          placeholder={props.placeholder}
          ref={inputRef}
          className="w-full min-h-10"
          required
          rows={1}
          disabled={props.isLoading}
          onKeyDown={handleKeyDown}
        />
        <button className=" absolute bottom-[6px] right-1 text-sm bg-primary/20 hover:bg-primary/30 cursor-pointer px-2 py-1 rounded-md text-muted-foreground">
          {_t("Save")}
        </button>
      </div>
      <div className="flex items-center mt-2 gap-2">
        <ul className="**:text-xs **:text-muted-foreground **:my-1 **:list-disc **:list-inside">
          <li>{_t("Type and hit enter to post comment")}</li>
          <li>{_t("For multiline comments, use Shift + Enter")}</li>
          <li>{_t("You can use markdown syntax for formatting")}</li>
        </ul>
      </div>
    </form>
  );
};

const CommentItem = (props: { comment: CommentPresentation }) => {
  return (
    <div>
      <pre className="font-normal">{props.comment.body}</pre>

      {props.comment.replies?.map((c) => <CommentItem comment={c} />)}
    </div>
  );
};
