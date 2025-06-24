import Markdoc from "@markdoc/markdoc";
import React from "react";
import { YoutubeTag, YoutubeTagConfig } from "./markdown-tags/youtube";

export const markdocParser = (markdown: string) => {
  const ast = Markdoc.parse(markdown);
  const content = Markdoc.transform(ast, {
    tags: { youtube: YoutubeTagConfig },
  });

  return Markdoc.renderers.react(content, React, {
    components: {
      Youtube: YoutubeTag,
    },
  });
};
