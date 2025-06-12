"use client";

import ReactionStatus from "@/components/render-props/ReactionStatus";
import clsx from "clsx";
import React from "react";

interface Props {
  article_id: string;
}

const ArticleReaction: React.FC<Props> = ({ article_id }) => {
  return (
    <ReactionStatus
      resource_type="ARTICLE"
      resource_id={article_id}
      render={({ reactions, toggle }) => {
        return (
          <div className="flex gap-1">
            {reactions.map((r) => (
              <button
                key={r.reaction_type}
                className={clsx(
                  "px-2 py-1 flex gap-1 cursor-pointer rounded-sm hover:bg-primary/20",
                  { "bg-primary/20": r.is_reacted }
                )}
                onClick={() => toggle(r.reaction_type!)}
              >
                <img
                  src={`/reactions/${r.reaction_type}.svg`}
                  alt={`reaction-${article_id}-${r.reaction_type}`}
                  className="size-5 flex-none"
                />
                <span>{r.count}</span>
              </button>
            ))}
          </div>
        );
      }}
    />
  );
};

export default ArticleReaction;
