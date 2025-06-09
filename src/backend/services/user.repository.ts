"use server";

import { z } from "zod";
import { persistenceRepository } from "../persistence/persistence-repositories";
import { UserRepositoryInput } from "./inputs/user.input";
import { handleRepositoryException } from "./RepositoryException";
import { and, desc, eq } from "sqlkit";

/**
 * Creates or syncs a user account from a social login provider.
 * If the user exists, links their social account. If not, creates a new user and social link.
 *
 * @param _input - The social user data containing service, uid and profile info, validated against UserRepositoryInput.syncSocialUserInput schema
 * @returns Promise<{user: User, userSocial: UserSocial}> - The user and their social account link
 * @throws {RepositoryException} If user creation/sync fails or validation fails
 */
export async function bootSocialUser(
  _input: z.infer<typeof UserRepositoryInput.syncSocialUserInput>
) {
  try {
    const input =
      await UserRepositoryInput.syncSocialUserInput.parseAsync(_input);
    let [user] = await persistenceRepository.user.find({
      where: eq("email", input.email),
      columns: ["id", "name", "username", "email"],
      orderBy: [desc("created_at")],
      limit: 1,
    });

    if (!user) {
      user = (
        await persistenceRepository.user.insert([
          {
            name: input.name,
            username: input.username,
            email: input.email,
            profile_photo: input.profile_photo,
            bio: input.bio ?? "",
          },
        ])
      )?.rows?.[0];
    }

    // check user has social account
    const [userSocial] = await persistenceRepository.userSocial.find({
      where: and(
        eq("service", input.service),
        eq("service_uid", input.service_uid)
      ),
      columns: ["id", "service", "service_uid", "user_id"],
      limit: 1,
    });

    if (!userSocial) {
      await persistenceRepository.userSocial.insert([
        {
          service: input.service,
          service_uid: input.service_uid,
          user_id: user.id,
        },
      ]);
    }

    return {
      user,
      userSocial,
    };
  } catch (error) {
    handleRepositoryException(error);
  }
}
