// Test script to debug YouTube tag rendering
const { markdocParser } = require("./src/utils/markdoc-parser.tsx");

const testMarkdown = `
# Test YouTube Tag

Here's a YouTube video:

{% youtube youtubeID="dQw4w9WgXcQ" /%}

End of test.
`;

console.log("Testing YouTube tag...");
try {
  const result = markdocParser(testMarkdown);
  console.log("Result:", result);
} catch (error) {
  console.error("Error:", error);
}
