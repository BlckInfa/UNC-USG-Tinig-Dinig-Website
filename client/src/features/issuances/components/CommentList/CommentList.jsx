import { useState } from "react";
import { formatDate } from "../../../../utils/dateFormatter";
import "./CommentList.css";

/**
 * Comment Item Component
 * Displays a single comment
 */
const CommentItem = ({ comment }) => {
    const { author, content, createdAt, isEdited, editedAt } = comment;
    const authorName = author?.name || "Anonymous";
    const initials = authorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="comment-item">
            <div className="comment-item__avatar">{initials}</div>
            <div className="comment-item__content">
                <div className="comment-item__header">
                    <span className="comment-item__author">{authorName}</span>
                    <span className="comment-item__timestamp">
                        {formatDate(createdAt)}
                    </span>
                    {isEdited && (
                        <span className="comment-item__edited">
                            (edited {formatDate(editedAt)})
                        </span>
                    )}
                </div>
                <p className="comment-item__text">{content}</p>
            </div>
        </div>
    );
};

/**
 * Comment List Component
 * Displays a list of comments with an optional add comment form
 */
const CommentList = ({
    comments = [],
    onAddComment,
    showAddForm = true,
    loading = false,
}) => {
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !onAddComment) return;

        setSubmitting(true);
        try {
            await onAddComment(newComment.trim());
            setNewComment("");
        } catch (error) {
            console.error("Failed to add comment:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="comment-list">
            <div className="comment-list__header">
                <h3 className="comment-list__title">Comments</h3>
                <span className="comment-list__count">
                    {comments.length} comment{comments.length !== 1 ? "s" : ""}
                </span>
            </div>

            {comments.length === 0 ?
                <p className="comment-list__empty">
                    No comments yet. Be the first to comment!
                </p>
            :   comments.map((comment) => (
                    <CommentItem key={comment._id} comment={comment} />
                ))
            }

            {showAddForm && onAddComment && (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <textarea
                        className="comment-form__input"
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        disabled={submitting}
                    />
                    <button
                        type="submit"
                        className="comment-form__submit"
                        disabled={!newComment.trim() || submitting}>
                        {submitting ? "Posting..." : "Post Comment"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default CommentList;
