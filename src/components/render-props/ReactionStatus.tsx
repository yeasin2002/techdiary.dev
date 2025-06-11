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

// All possible reactions

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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reaction", resource_id, resource_type],
      });
    },
  });

  const toggle = (reaction_type: REACTION_TYPE) => {
    mutation.mutate(reaction_type);
  };

  const getReaction = (reaction_type: REACTION_TYPE) => {
    return query?.data?.find((r) => r.reaction_type == reaction_type);
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
