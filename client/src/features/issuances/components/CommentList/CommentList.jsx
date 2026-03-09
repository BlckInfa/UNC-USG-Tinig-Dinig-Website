import { useState } from "react";
import {
    LuPencil,
    LuTrash2,
    LuCheck,
    LuX,
    LuMoreVertical,
} from "react-icons/lu";
import { formatDate } from "../../../../utils/dateFormatter";
import "./CommentList.css";

/**
 * Comment Item Component
 * Displays a single comment with edit/delete capabilities
 */
const CommentItem = ({
    comment,
    currentUser,
    onEditComment,
    onDeleteComment,
}) => {
    const { _id, author, content, createdAt, isEdited, editedAt, visibility } =
        comment;
    const authorName = author?.name || "Anonymous";
    const authorRole = author?.role || "";
    const initials = authorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const [menuOpen, setMenuOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(content);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Check if user can modify this comment
    const isAuthor = currentUser?.id === author?._id;
    const isAdmin =
        currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
    const canModify =
        (isAuthor || isAdmin) && (onEditComment || onDeleteComment);

    const handleEdit = () => {
        setEditing(true);
        setEditContent(content);
        setMenuOpen(false);
    };

    const handleCancelEdit = () => {
        setEditing(false);
        setEditContent(content);
    };

    const handleSaveEdit = async () => {
        if (!editContent.trim() || editContent.trim() === content) {
            handleCancelEdit();
            return;
        }
        setSaving(true);
        try {
            await onEditComment(_id, editContent.trim());
            setEditing(false);
        } catch (error) {
            console.error("Failed to update comment:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        setConfirmDelete(true);
        setMenuOpen(false);
    };

    const handleConfirmDelete = async () => {
        setDeleting(true);
        try {
            await onDeleteComment(_id);
        } catch (error) {
            console.error("Failed to delete comment:", error);
            setDeleting(false);
            setConfirmDelete(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            handleSaveEdit();
        }
        if (e.key === "Escape") {
            handleCancelEdit();
        }
    };

    return (
        <div
            className={`comment-item ${visibility === "INTERNAL" ? "comment-item--internal" : ""}`}>
            <div className="comment-item__avatar">{initials}</div>
            <div className="comment-item__content">
                <div className="comment-item__header">
                    <div className="comment-item__meta">
                        <span className="comment-item__author">
                            {authorName}
                        </span>
                        {authorRole && (
                            <span className="comment-item__role">
                                {authorRole}
                            </span>
                        )}
                        <span className="comment-item__timestamp">
                            {formatDate(createdAt)}
                        </span>
                        {isEdited && (
                            <span className="comment-item__edited">
                                (edited {editedAt ? formatDate(editedAt) : ""})
                            </span>
                        )}
                        {visibility === "INTERNAL" && (
                            <span className="comment-item__internal-badge">
                                Internal
                            </span>
                        )}
                    </div>

                    {canModify && !editing && !confirmDelete && (
                        <div className="comment-item__actions">
                            <button
                                type="button"
                                className="comment-item__menu-btn"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Comment actions">
                                <LuMoreVertical size={16} />
                            </button>
                            {menuOpen && (
                                <>
                                    <div
                                        className="comment-item__menu-backdrop"
                                        onClick={() => setMenuOpen(false)}
                                    />
                                    <div className="comment-item__menu">
                                        {onEditComment &&
                                            (isAuthor || isAdmin) && (
                                                <button
                                                    type="button"
                                                    className="comment-item__menu-item"
                                                    onClick={handleEdit}>
                                                    <LuPencil size={14} />
                                                    Edit
                                                </button>
                                            )}
                                        {onDeleteComment &&
                                            (isAuthor || isAdmin) && (
                                                <button
                                                    type="button"
                                                    className="comment-item__menu-item comment-item__menu-item--danger"
                                                    onClick={handleDelete}>
                                                    <LuTrash2 size={14} />
                                                    Delete
                                                </button>
                                            )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {editing ?
                    <div className="comment-item__edit">
                        <textarea
                            className="comment-item__edit-input"
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={saving}
                            autoFocus
                        />
                        <div className="comment-item__edit-actions">
                            <span className="comment-item__edit-hint">
                                Ctrl+Enter to save, Esc to cancel
                            </span>
                            <button
                                type="button"
                                className="comment-item__edit-btn comment-item__edit-btn--cancel"
                                onClick={handleCancelEdit}
                                disabled={saving}>
                                <LuX size={14} />
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="comment-item__edit-btn comment-item__edit-btn--save"
                                onClick={handleSaveEdit}
                                disabled={saving || !editContent.trim()}>
                                <LuCheck size={14} />
                                {saving ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </div>
                : confirmDelete ?
                    <div className="comment-item__delete-confirm">
                        <p className="comment-item__delete-msg">
                            Are you sure you want to delete this comment?
                        </p>
                        <div className="comment-item__delete-actions">
                            <button
                                type="button"
                                className="comment-item__edit-btn comment-item__edit-btn--cancel"
                                onClick={() => setConfirmDelete(false)}
                                disabled={deleting}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="comment-item__edit-btn comment-item__edit-btn--delete"
                                onClick={handleConfirmDelete}
                                disabled={deleting}>
                                <LuTrash2 size={14} />
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                :   <p className="comment-item__text">{content}</p>}
            </div>
        </div>
    );
};

/**
 * Comment List Component
 * Displays a list of comments with add, edit, and delete support
 */
const CommentList = ({
    comments = [],
    loading = false,
    onAddComment,
    onEditComment,
    onDeleteComment,
    currentUser,
    isAuthenticated = false,
}) => {
    const [newComment, setNewComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !onAddComment) return;

        setSubmitting(true);
        setError(null);
        try {
            await onAddComment(newComment.trim());
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment:", err);
            if (err.response?.status === 401) {
                setError("Please sign in to post a comment.");
            } else {
                setError("Failed to post comment. Please try again.");
            }
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

            {loading ?
                <div className="comment-list__loading">
                    <div className="comment-list__spinner" />
                    <span>Loading comments...</span>
                </div>
            : comments.length === 0 ?
                <p className="comment-list__empty">
                    No comments yet. Be the first to comment!
                </p>
            :   comments.map((comment) => (
                    <CommentItem
                        key={comment._id}
                        comment={comment}
                        currentUser={currentUser}
                        onEditComment={isAuthenticated ? onEditComment : null}
                        onDeleteComment={
                            isAuthenticated ? onDeleteComment : null
                        }
                    />
                ))
            }

            {error && <div className="comment-form__error">{error}</div>}

            {onAddComment &&
                (isAuthenticated ?
                    <form className="comment-form" onSubmit={handleSubmit}>
                        <textarea
                            className="comment-form__input"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={submitting}
                            maxLength={2000}
                        />
                        <div className="comment-form__footer">
                            <span className="comment-form__char-count">
                                {newComment.length}/2000
                            </span>
                            <button
                                type="submit"
                                className="comment-form__submit"
                                disabled={!newComment.trim() || submitting}>
                                {submitting ? "Posting..." : "Post Comment"}
                            </button>
                        </div>
                    </form>
                :   <div className="comment-form__login-prompt">
                        <p>Sign in to leave a comment.</p>
                    </div>)}
        </div>
    );
};

export default CommentList;
