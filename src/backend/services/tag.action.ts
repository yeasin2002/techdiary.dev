"use server";

import {and, eq, inArray, like} from "sqlkit";
import {z} from "zod";
import {persistenceRepository} from "../persistence/persistence-repositories";
import {TagRepositoryInput} from "./inputs/tag.input";
import {handleRepositoryException} from "./RepositoryException";

export const getTags = async (
  _input: z.infer<typeof TagRepositoryInput.findAllInput>
) => {
  try {
    const input = await TagRepositoryInput.findAllInput.parseAsync(_input);
    return await persistenceRepository.tags.find({
      where: input.search ? like("name", `%${input.search}%`) : undefined,
    });
  } catch (error) {
    handleRepositoryException(error);
  }
};

export const syncTagsWithArticles = async (
  _input: z.infer<typeof TagRepositoryInput.syncTagsWithArticlesInput>
) => {
  try {
    const input =
      await TagRepositoryInput.syncTagsWithArticlesInput.parseAsync(_input);

    // Find all tags
    const attached = await persistenceRepository.articleTagPivot.find({
      where: eq("article_id", input.article_id),
    });
    const attachedTagIds = attached.map((tag) => tag.tag_id) ?? [];

    // article -> [1,2,3,4,5]
    // input_tags -> [1,2,6]

    // find all tags attached to article
    const tagsToRemove = attachedTagIds.filter(
      (tag) => !input.tag_ids.includes(tag)
    );
    const tagsToAdd = input.tag_ids.filter(
      (tag) => !attachedTagIds.includes(tag)
    );

    if (tagsToAdd.length) {
      await persistenceRepository.articleTagPivot.insert(
        tagsToAdd.map((tag) => ({
          article_id: input.article_id,
          tag_id: tag,
        }))
      );
    }

    await persistenceRepository.articleTagPivot.delete({
      where: and(
        eq("article_id", input.article_id),
        inArray("tag_id", tagsToRemove)
      ),
    });
    console.log({
      tagsToRemove,
      tagsToAdd,
      attachedTagIds,
      inputTagIds: input.tag_ids,
    });
  } catch (error) {
    handleRepositoryException(error);
  }
};
