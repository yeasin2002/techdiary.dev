"use client";

import { useTranslation } from "@/i18n/use-translation";
import { meilisearchClient } from "@/lib/meilisearch.client";
// import { meilisearchClient } from "@/lib/meilisearch.client";
import "instantsearch.css/themes/satellite.css";
import { instantMeiliSearch } from "@meilisearch/instant-meilisearch";
import { InfiniteHits, InstantSearch, SearchBox } from "react-instantsearch";

import { env } from "@/env";
import React from "react";

const SearchInput = () => {
  const { _t } = useTranslation();
  const index = meilisearchClient.index("articles");

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { searchClient } = instantMeiliSearch(
    env.NEXT_PUBLIC_MEILISEARCH_API_HOST,
    env.NEXT_PUBLIC_MEILISEARCH_SEARCH_API_KEY
  );

  // useEffect(() => {
  //   index
  //     .search("", {
  //       limit: 100,
  //       attributesToRetrieve: ["id", "title", "user", "cover_image"],
  //     })
  //     .then((res) => {
  //       console.log("Search index initialized:", res);
  //     })
  //     .catch((error) => {
  //       console.error("Error initializing search index:", error);
  //     });
  // }, []);
  {
    /* <div className="relative hidden w-full max-w-xl lg:block">
        <div className="search">
          <input
            type="text"
            placeholder={_t("Type to search")}
            className="w-full rounded border border-border bg-muted p-2 focus:outline-none focus:ring-2 focus:ring-primary dark:border-slate-600 dark:bg-slate-800"
            v-model="query"
          />
        </div>
      </div> */
  }
  return (
    <InstantSearch indexName="articles" searchClient={searchClient as any}>
      <SearchBox />
      <InfiniteHits hitComponent={Hit} />
    </InstantSearch>
  );
};

export default SearchInput;

const Hit = ({ hit }: any) => (
  <article key={hit.id}>
    <h1>{hit.title}</h1>
  </article>
);
