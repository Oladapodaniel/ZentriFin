"use client";

const SUGGESTIONS = [
    { id: 1, username: "design_master", subtitle: "New to Instagram", avatar: "https://i.pravatar.cc/150?u=20" },
    { id: 2, username: "creative_studio", subtitle: "Followed by user1 + 2 more", avatar: "https://i.pravatar.cc/150?u=21" },
    { id: 3, username: "photo_daily", subtitle: "Suggested for you", avatar: "https://i.pravatar.cc/150?u=22" },
    { id: 4, username: "web_trends", subtitle: "Followed by tech_guru", avatar: "https://i.pravatar.cc/150?u=23" },
    { id: 5, username: "art_gallery", subtitle: "Suggested for you", avatar: "https://i.pravatar.cc/150?u=24" },
];

const Suggestions = () => {
    return (
        <div className="suggestions-sidebar">
            {/* Current User */}
            <div className="user-profile-row">
                <div className="user-info">
                    <img
                        src="https://i.pravatar.cc/150?u=0"
                        alt="current_user"
                        className="user-avatar-medium"
                    />
                    <div className="user-text">
                        <span className="username-bold">my_profile</span>
                        <span className="user-subtitle">My Name</span>
                    </div>
                </div>
                <button className="action-link">Switch</button>
            </div>

            {/* Header */}
            <div className="suggestions-header">
                <span className="suggestions-title">Suggested for you</span>
                <button className="see-all-btn">See All</button>
            </div>

            {/* List */}
            <div className="suggestions-list">
                {SUGGESTIONS.map((user) => (
                    <div key={user.id} className="suggestion-item">
                        <div className="user-info">
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="suggestion-avatar"
                            />
                            <div className="suggestion-text">
                                <span className="username-bold">{user.username}</span>
                                <span className="suggestion-subtitle">{user.subtitle}</span>
                            </div>
                        </div>
                        <button className="action-link">Follow</button>
                    </div>
                ))}
            </div>

            {/* Footer */}
            <div className="suggestions-footer">
                <div className="footer-links">
                    <a href="#" className="footer-link">About</a> •
                    <a href="#" className="footer-link">Help</a> •
                    <a href="#" className="footer-link">Press</a> •
                    <a href="#" className="footer-link">API</a> •
                    <a href="#" className="footer-link">Jobs</a> •
                    <a href="#" className="footer-link">Privacy</a> •
                    <a href="#" className="footer-link">Terms</a> •
                    <a href="#" className="footer-link">Locations</a> •
                    <a href="#" className="footer-link">Language</a>
                </div>
                <span className="copyright">© 2025 INSTAGRAM FROM META</span>
            </div>
        </div>
    );
};

export default Suggestions;
