"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STORIES = [
    { id: 1, username: "user1", avatar: "https://i.pravatar.cc/150?u=1" },
    { id: 2, username: "adventure_time", avatar: "https://i.pravatar.cc/150?u=2" },
    { id: 3, username: "travel_diaries", avatar: "https://i.pravatar.cc/150?u=3" },
    { id: 4, username: "foodie_life", avatar: "https://i.pravatar.cc/150?u=4" },
    { id: 5, username: "tech_guru", avatar: "https://i.pravatar.cc/150?u=5" },
    { id: 6, username: "art_daily", avatar: "https://i.pravatar.cc/150?u=6" },
    { id: 7, username: "music_vibes", avatar: "https://i.pravatar.cc/150?u=7" },
    { id: 8, username: "fitness_pro", avatar: "https://i.pravatar.cc/150?u=8" },
    { id: 9, username: "nature_lover", avatar: "https://i.pravatar.cc/150?u=9" },
    { id: 10, username: "urban_style", avatar: "https://i.pravatar.cc/150?u=10" },
];

const Stories = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === "left") {
                current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            }
        }
    };

    return (
        <div className="stories-container group">
            <div
                ref={scrollRef}
                className="stories-scroll"
            >
                {STORIES.map((story) => (
                    <div key={story.id} className="story-item">
                        <div className="story-ring">
                            <div className="story-ring-inner">
                                <img
                                    src={story.avatar}
                                    alt={story.username}
                                    className="story-avatar"
                                />
                            </div>
                        </div>
                        <span className="story-username">
                            {story.username}
                        </span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => scroll("left")}
                className="scroll-btn left hidden md:flex"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button
                onClick={() => scroll("right")}
                className="scroll-btn right hidden md:flex"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Stories;
