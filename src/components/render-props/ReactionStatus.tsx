import React from "react";
import * as reactionActions from "@/backend/services/reaction.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  REACTION_TYPE,
  ReactionStatus as ReactionStatusModel,
} from "@/backend/models/domain-models";
import { useImmer } from "use-immer";

interface Props {
  resource_type: "ARTICLE" | "COMMENT";
  resource_id: string;
  render: ({
    toggle,
    reactions,
    getReaction,
  }: {
    toggle: (reaction_type: REACTION_TYPE) => void;
    getReaction: (reaction_type: REACTION_TYPE) => void;
    reactions: ReactionStatusModel[];
  }) => React.ReactNode;
}

const ReactionStatus: React.FC<Props> = ({
  resource_id,
  resource_type,
  render,
}) => {
  const queryClient = useQueryClient();
  const [reactions, setReactions] = useImmer<ReactionStatusModel[]>([
    {
      count: 0,
      is_reacted: false,
      reaction_type: "CRY",
    },
    {
      count: 0,
      is_reacted: false,
      reaction_type: "FIRE",
    },
    {
      count: 0,
      is_reacted: false,
      reaction_type: "HAHA",
    },
    {
      count: 0,
      is_reacted: false,
      reaction_type: "LOVE",
    },
    {
      count: 0,
      is_reacted: false,
      reaction_type: "UNICORN",
    },
    {
      count: 0,
      is_reacted: false,
      reaction_type: "WOW",
    },
  ]);

  const query = useQuery({
    queryKey: ["reaction", resource_id, resource_type],
    queryFn: () =>
      reactionActions.getResourceReactions({ resource_id, resource_type }),
  });

  const mutation = useMutation({
    mutationFn: (reaction_type: REACTION_TYPE) =>
      reactionActions.toogleReaction({
        resource_id,
        resource_type,
        reaction_type,
      }),
    async onMutate(reaction_type) {
      // cancel
      await queryClient.cancelQueries({
        queryKey: ["reaction", resource_id, resource_type],
      });

      const oldReactions = queryClient.getQueryData([
        "reaction",
        resource_id,
        resource_type,
      ]);

      queryClient.setQueryData(
        ["reaction", resource_id, resource_type],
        (old: ReactionStatusModel[]) => {
          const index = old.findIndex((r) => r.reaction_type == reaction_type);
          if (old[index].is_reacted) {
            old[index].is_reacted = false;
            --old[index].count;
          } else {
            old[index].is_reacted = true;
            ++old[index].count;
          }
          return old;
        }
      );

      return { oldReactions };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["reaction", resource_id, resource_type],
        context?.oldReactions
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["reaction", resource_id, resource_type],
      });
    },
  });

  const toggle = (reaction_type: REACTION_TYPE) => {
    mutation.mutate(reaction_type);
  };

  const getReaction = (reaction_type: REACTION_TYPE) => {
    return query?.data?.find((r) => r.reaction_type === reaction_type);
  };

  return render({
    reactions: query?.data
      ? query.data.map((r) => ({
          ...r,
          reaction_type: r.reaction_type as REACTION_TYPE,
        }))
      : [],
    getReaction,
    toggle,
  });
};

export default ReactionStatus;
