"use client";

export interface Attachment {
  id: string;
  type: "image" | "file" | "link";
  url: string;
  name: string;
  size?: number;
  thumbnail?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  score: number;
  replies: Comment[];
  depth: number;
  attachments?: Attachment[];
}

const sampleComments: Comment[] = [
  {
    id: "1",
    author: "techuser123",
    content:
      "This is a really interesting discussion. I've been thinking about this topic for a while and I think there are several important points to consider. Here's a diagram that might help explain my point:",
    timestamp: "2 hours ago",
    score: 42,
    depth: 0,
    attachments: [
      {
        id: "att1",
        type: "image",
        url: "/placeholder.svg?height=300&width=500",
        name: "architecture-diagram.png",
      },
      {
        id: "att2",
        type: "file",
        url: "#",
        name: "technical-specs.pdf",
        size: 245760,
      },
    ],
    replies: [
      {
        id: "2",
        author: "developer_jane",
        content:
          "I completely agree! The implementation details are crucial here. Check out this related article:",
        timestamp: "1 hour ago",
        score: 15,
        depth: 1,
        attachments: [
          {
            id: "att3",
            type: "link",
            url: "https://example.com/best-practices",
            name: "Best Practices for Modern Development",
          },
        ],
        replies: [
          {
            id: "3",
            author: "codemaster",
            content:
              "Yes, and we should also consider the performance implications.",
            timestamp: "45 minutes ago",
            score: 8,
            depth: 2,
            replies: [],
          },
        ],
      },
      {
        id: "4",
        author: "webdev_pro",
        content:
          "Has anyone tried implementing this in production? I'm curious about real-world results.",
        timestamp: "30 minutes ago",
        score: 23,
        depth: 1,
        replies: [
          {
            id: "5",
            author: "startup_founder",
            content:
              "We implemented something similar last month. Happy to share our experience! Here are some screenshots from our implementation:",
            timestamp: "20 minutes ago",
            score: 12,
            depth: 2,
            attachments: [
              {
                id: "att4",
                type: "image",
                url: "/placeholder.svg?height=400&width=600",
                name: "implementation-screenshot.png",
              },
              {
                id: "att5",
                type: "image",
                url: "/placeholder.svg?height=300&width=500",
                name: "performance-metrics.png",
              },
            ],
            replies: [
              {
                id: "6",
                author: "curious_dev",
                content:
                  "That would be amazing! Could you share some details about the challenges you faced?",
                timestamp: "15 minutes ago",
                score: 5,
                depth: 3,
                replies: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "7",
    author: "design_guru",
    content:
      "From a UX perspective, this approach makes a lot of sense. The user flow is intuitive and the interface is clean.",
    timestamp: "3 hours ago",
    score: 28,
    depth: 0,
    replies: [
      {
        id: "8",
        author: "ux_researcher",
        content:
          "Agreed! We ran some user tests and the feedback was overwhelmingly positive. Here's our research report:",
        timestamp: "2 hours ago",
        score: 11,
        depth: 1,
        attachments: [
          {
            id: "att6",
            type: "file",
            url: "#",
            name: "user-research-report.docx",
            size: 1048576,
          },
        ],
        replies: [],
      },
    ],
  },
  {
    id: "9",
    author: "skeptical_user",
    content:
      "I'm not entirely convinced this is the best approach. There might be some edge cases we haven't considered.",
    timestamp: "4 hours ago",
    score: -2,
    depth: 0,
    replies: [],
  },
];

import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  MoreHorizontal,
} from "lucide-react";

export const CommentSection = () => {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Comments</h2>

        {/* New Comment Box */}
        <div className="mb-4">
          <textarea
            placeholder="What are your thoughts?"
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
          {/* <AttachmentUpload
            attachments={newCommentAttachments}
            onAttachmentsChange={setNewCommentAttachments}
          /> */}
          <div className="flex justify-end mt-2">
            <Button>Comment</Button>
          </div>
        </div>
      </div>

      {/* Comments List */}
      {/* <div className="space-y-4">
        {sampleComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} onReply={addReply} />
        ))}
      </div> */}

      {sampleComments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  onReply: (
    parentId: string,
    content: string,
    attachments?: Attachment[]
  ) => void;
}

export function CommentItem({ comment, onReply }: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [score, setScore] = useState(comment.score);
  const [userVote, setUserVote] = useState<"up" | "down" | null>(null);
  const [replyAttachments, setReplyAttachments] = useState<Attachment[]>([]);

  const handleVote = (type: "up" | "down") => {
    if (userVote === type) {
      setUserVote(null);
      setScore(comment.score);
    } else {
      const prevVote = userVote;
      setUserVote(type);
      let newScore = comment.score;

      if (prevVote === "up") newScore -= 1;
      if (prevVote === "down") newScore += 1;

      if (type === "up") newScore += 1;
      if (type === "down") newScore -= 1;

      setScore(newScore);
    }
  };

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent, replyAttachments);
      setReplyContent("");
      setReplyAttachments([]);
      setShowReplyBox(false);
    }
  };

  const indentLevel = Math.min(comment.depth, 8) * 12;

  return (
    <div className="group" style={{ marginLeft: `${indentLevel}px` }}>
      {/* Comment Header */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1 hover:text-foreground"
        >
          {isCollapsed ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
          <span className="font-medium">{comment.author}</span>
        </button>
        <span>•</span>
        <span>{comment.timestamp}</span>
      </div>

      {!isCollapsed && (
        <>
          {/* Comment Content */}
          <div className="mb-2">
            <p className="text-sm leading-relaxed">{comment.content}</p>
          </div>

          {/* Comment Attachments */}
          {/* {comment.attachments && comment.attachments.length > 0 && (
            <AttachmentDisplay attachments={comment.attachments} />
          )} */}

          {/* Comment Actions */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 px-1 ${userVote === "up" ? "text-orange-500" : "text-muted-foreground"}`}
                onClick={() => handleVote("up")}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <span className="text-xs font-medium min-w-[20px] text-center">
                {score}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className={`h-6 px-1 ${userVote === "down" ? "text-blue-500" : "text-muted-foreground"}`}
                onClick={() => handleVote("down")}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => setShowReplyBox(!showReplyBox)}
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Reply
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </div>

          {/* Reply Box */}
          {/* {showReplyBox && (
            <div className="mb-4 ml-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="What are your thoughts?"
                className="w-full p-2 text-sm border rounded resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                rows={3}
              />
              <AttachmentUpload
                attachments={replyAttachments}
                onAttachmentsChange={setReplyAttachments}
              />
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                >
                  Comment
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowReplyBox(false);
                    setReplyContent("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )} */}

          {/* Nested Replies */}
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} onReply={onReply} />
          ))}
        </>
      )}

      {isCollapsed && comment.replies.length > 0 && (
        <div className="text-xs text-muted-foreground mb-2">
          [{comment.replies.length}{" "}
          {comment.replies.length === 1 ? "reply" : "replies"} hidden]
        </div>
      )}
    </div>
  );
}
