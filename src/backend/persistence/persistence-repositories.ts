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
import { pgClient } from "./database-drivers/pg.client";
import { DatabaseTableName } from "./persistence-contracts";

export const userRepository = new Repository<User>(
  DatabaseTableName.users,
  pgClient
);
export const articleRepository = new Repository<Article>(
  DatabaseTableName.articles,
  pgClient
);
export const tagRepository = new Repository<Tag>(
  DatabaseTableName.tags,
  pgClient
);
export const articleTagRepository = new Repository<ArticleTag>(
  DatabaseTableName.article_tag,
  pgClient
);
export const userSocialRepository = new Repository<UserSocial>(
  DatabaseTableName.user_socials,
  pgClient
);
export const userSessionRepository = new Repository<UserSession>(
  DatabaseTableName.user_sessions,
  pgClient
);

const seriesRepository = new Repository<Series>(
  DatabaseTableName.series,
  pgClient
);

const seriesItemsRepository = new Repository<SeriesItem>(
  DatabaseTableName.series_items,
  pgClient
);

export const persistenceRepository = {
  user: userRepository,
  userSocial: userSocialRepository,
  userSession: userSessionRepository,
  article: articleRepository,
  articleTag: articleTagRepository,
  tags: tagRepository,
  series: seriesRepository,
  seriesItems: seriesItemsRepository,
};
