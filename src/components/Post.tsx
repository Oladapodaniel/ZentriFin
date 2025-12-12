"use client";

import { useState } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile } from "lucide-react";

interface PostProps {
    username: string;
    avatar: string;
    image: string;
    likes: number;
    caption: string;
    timeAgo: string;
    location?: string;
}

const Post = ({ username, avatar, image, likes: initialLikes, caption, timeAgo, location }: PostProps) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [likes, setLikes] = useState(initialLikes);

    const handleLike = () => {
        if (liked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setLiked(!liked);
    };

    return (
        <article className="post-card">
            {/* Header */}
            <div className="post-header">
                <div className="post-user-wrapper">
                    <div className="story-ring post-avatar-ring">
                        <div className="story-ring-inner w-full h-full">
                            <img src={avatar} alt={username} className="post-avatar-small" />
                        </div>
                    </div>
                    <div className="post-meta">
                        <div className="post-username-row">
                            <span className="post-username">{username}</span>
                            <span className="post-time">• {timeAgo}</span>
                        </div>
                        {location && <span className="post-location">{location}</span>}
                    </div>
                </div>
                <button className="btn-icon">
                    <MoreHorizontal className="action-icon" />
                </button>
            </div>

            {/* Image */}
            <div className="post-image-container">
                <img src={image} alt="Post content" className="post-image" />
            </div>

            {/* Actions */}
            <div className="post-actions">
                <div className="actions-group">
                    <button onClick={handleLike} className="btn-icon">
                        <Heart className={`action-icon ${liked ? 'fill-[var(--danger)] stroke-[var(--danger)]' : 'stroke-[var(--foreground)]'}`} />
                    </button>
                    <button className="btn-icon">
                        <MessageCircle className="action-icon stroke-[var(--foreground)] -rotate-90" />
                    </button>
                    <button className="btn-icon">
                        <Send className="action-icon stroke-[var(--foreground)]" />
                    </button>
                </div>
                <button onClick={() => setSaved(!saved)} className="btn-icon">
                    <Bookmark className={`action-icon ${saved ? 'fill-[var(--foreground)]' : 'stroke-[var(--foreground)]'}`} />
                </button>
            </div>

            {/* Likes */}
            <div className="mb-2">
                <span className="post-likes">{likes.toLocaleString()} likes</span>
            </div>

            {/* Caption */}
            <div className="post-caption-area">
                <span className="caption-username">{username}</span>
                <span>{caption}</span>
            </div>

            {/* Comments Link */}
            <div className="mb-2">
                <button className="view-comments">View all comments</button>
            </div>

            {/* Add Comment */}
            <div className="add-comment-area">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className="comment-input"
                />
                <button className="post-btn">Post</button>
                <Smile className="w-4 h-4 text-[var(--secondary-text)] cursor-pointer" />
            </div>
        </article>
    );
};

export default Post;
