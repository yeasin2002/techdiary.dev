import React from "react";
import * as reactionActions from "@/backend/services/reaction.actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  REACTION_TYPE,
  ReactionStatus as ReactionStatusModel,
} from "@/backend/models/domain-models";

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
    onMutate: async (reaction_type: REACTION_TYPE) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["reaction", resource_id, resource_type],
      });

      // Snapshot the previous value
      const previousReactions = queryClient.getQueryData<ReactionStatusModel[]>(
        ["reaction", resource_id, resource_type]
      );

      // Optimistically update to the new value
      queryClient.setQueryData<ReactionStatusModel[]>(
        ["reaction", resource_id, resource_type],
        (old = []) => {
          const existingReaction = old.find(
            (r) => r.reaction_type === reaction_type
          );

          if (existingReaction) {
            // If reaction exists, toggle it (remove if active, or toggle status)
            if (existingReaction.is_reacted) {
              // Remove the reaction
              return old.filter((r) => r.reaction_type !== reaction_type);
            } else {
              // Activate the reaction
              return old.map((r) =>
                r.reaction_type === reaction_type
                  ? { ...r, is_active: true, count: r.count + 1 }
                  : r
              );
            }
          } else {
            // Add new reaction
            return [
              ...old,
              {
                reaction_type,
                is_reacted: true,
                count: 1,
                resource_id,
                resource_type,
              } as ReactionStatusModel,
            ];
          }
        }
      );

      // Return a context object with the snapshotted value
      return { previousReactions };
    },
    onError: (err, reaction_type, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(
        ["reaction", resource_id, resource_type],
        context?.previousReactions
      );
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
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
