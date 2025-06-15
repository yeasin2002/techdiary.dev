# Git Commit Helper

You are tasked with analyzing all unstaged git files and creating an appropriate commit message, then executing the commit.

Follow these steps:

1. **Check git status** to see all unstaged files
2. **Show git diff** to understand the changes being made
3. **Review recent commits** (last 5) to understand the project's commit message style
4. **Analyze the changes** and determine:

   - Type of changes (feat, fix, refactor, docs, etc.)
   - Main purpose and impact
   - Any breaking changes or important notes

5. **Draft a commit message** that:

   - Follows the project's existing style
   - Uses conventional commit format if the project uses it
   - Summarizes the "why" rather than just the "what"
   - Is concise but descriptive

6. **Execute the commit**:
   - Add all unstaged files to staging
   - Create the commit with the drafted message
   - Verify the commit succeeded

**Important guidelines:**

- Never commit if there are no changes
- Check for sensitive information before committing
- Follow the project's existing commit message patterns
- Be concise and focus on the main changes
- Do not make claude as a co-author unless explicitly requested

$ARGUMENTS can be used to provide additional context or specific instructions for the commit message.
