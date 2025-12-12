"use client";

import Stories from "./Stories";
import Post from "./Post";

const POSTS = [
    {
        id: 1,
        username: "nature_lover",
        avatar: "https://i.pravatar.cc/150?u=9",
        image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 1245,
        caption: "Morning views 🌄 #nature #peace",
        timeAgo: "2h",
        location: "Yosemite National Park"
    },
    {
        id: 2,
        username: "tech_guru",
        avatar: "https://i.pravatar.cc/150?u=5",
        image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 856,
        caption: "Coding setup for the weekend 💻 #developer #setup",
        timeAgo: "5h",
    },
    {
        id: 3,
        username: "travel_diaries",
        avatar: "https://i.pravatar.cc/150?u=3",
        image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 2301,
        caption: "Exploring the streets of Paris 🇫🇷 #travel #paris",
        timeAgo: "8h",
        location: "Paris, France"
    },
    {
        id: 4,
        username: "foodie_life",
        avatar: "https://i.pravatar.cc/150?u=4",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        likes: 543,
        caption: "Best brunch ever! 🥑🍳 #foodie #brunch",
        timeAgo: "12h",
    }
];

const Feed = () => {
    return (
        <div className="feed-wrapper">
            <Stories />
            <div className="w-full flex flex-col items-center gap-4">
                {POSTS.map((post) => (
                    <Post key={post.id} {...post} />
                ))}
            </div>
        </div>
    );
};

export default Feed;
