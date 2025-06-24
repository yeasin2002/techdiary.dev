"use client";

import React, { PropsWithChildren } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  language: string;
  children: string;
}

// export function CodeTag(props: Props) {
//   return <div>{props.children}</div>;
// }

export const CodeTag: React.FC<Props> = (props) => {
  return (
    <>
      <div className="my-4">
        <SyntaxHighlighter
          language={props.language ?? "js"}
          style={vscDarkPlus}
          customStyle={{
            borderRadius: "8px",
            fontSize: "14px",
            padding: "16px",
          }}
          showLineNumbers={true}
          wrapLines={true}
        >
          {props.children}
        </SyntaxHighlighter>
      </div>
    </>
  );
};

export const CodeTagConfig = {
  render: "Fence",
  attributes: {
    language: {
      type: String,
      default: "javascript",
    },
  },
};
