import { Repository } from "sqlkit";
import {
  Article,
  ArticleTag,
  Series,
  SeriesItem,
  Tag,
  User,
  UserSession,
  UserSocial,
} from "../models/domain-models";
import { pgClient } from "./clients";
import { DatabaseTableName } from "./persistence-contracts";

const repositoryConfig = {
  logging: true,
};

export const userRepository = new Repository<User>(
  DatabaseTableName.users,
  pgClient,
  repositoryConfig,
);
export const articleRepository = new Repository<Article>(
  DatabaseTableName.articles,
  pgClient,
  repositoryConfig,
);
export const tagRepository = new Repository<Tag>(
  DatabaseTableName.tags,
  pgClient,
  repositoryConfig,
);
export const articleTagRepository = new Repository<ArticleTag>(
  DatabaseTableName.article_tag,
  pgClient,
  repositoryConfig,
);
export const userSocialRepository = new Repository<UserSocial>(
  DatabaseTableName.user_socials,
  pgClient,
  repositoryConfig,
);
export const userSessionRepository = new Repository<UserSession>(
  DatabaseTableName.user_sessions,
  pgClient,
  repositoryConfig,
);

const seriesRepository = new Repository<Series>(
  DatabaseTableName.series,
  pgClient,
  repositoryConfig,
);

const seriesItemsRepository = new Repository<SeriesItem>(
  DatabaseTableName.series_items,
  pgClient,
  repositoryConfig,
);

export const persistenceRepository = {
  user: userRepository,
  userSocial: userSocialRepository,
  userSession: userSessionRepository,
  article: articleRepository,
  articleTagPivot: articleTagRepository,
  tags: tagRepository,
  series: seriesRepository,
  seriesItems: seriesItemsRepository,
};
