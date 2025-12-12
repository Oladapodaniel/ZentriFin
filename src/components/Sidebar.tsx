"use client";

import Link from "next/link";
import { Home, Search, Compass, Clapperboard, MessageCircle, Heart, PlusSquare, User, Menu, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

const Sidebar = () => {
    const pathname = usePathname();

    const navItems = [
        { icon: Home, label: "Home", href: "/" },
        { icon: Search, label: "Search", href: "/search" },
        { icon: Compass, label: "Explore", href: "/explore" },
        { icon: Clapperboard, label: "Reels", href: "/reels" },
        { icon: MessageCircle, label: "Messages", href: "/messages" },
        { icon: Heart, label: "Notifications", href: "/notifications" },
        { icon: PlusSquare, label: "Create", href: "/create" },
        { icon: User, label: "Profile", href: "/profile" },
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Link href="/" className="block">
                    {/* Desktop Logo */}
                    <h1 className="logo-text">Instagram</h1>
                    {/* Mobile/Tablet Logo */}
                    <Instagram className="logo-icon" />
                </Link>
            </div>

            <nav className="nav-menu">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <item.icon className="nav-icon" strokeWidth={isActive ? 3 : 2} />
                            <span className="nav-label">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button className="nav-item w-full text-left">
                    <Menu className="nav-icon" />
                    <span className="nav-label">More</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
