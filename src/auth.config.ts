import type { NextAuthConfig } from "next-auth"

export const authConfig = {
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard =
                nextUrl.pathname.startsWith('/projects') ||
                nextUrl.pathname.startsWith('/convert') ||
                nextUrl.pathname.startsWith('/settings') ||
                nextUrl.pathname.startsWith('/api/projects') ||
                nextUrl.pathname.startsWith('/api/upload');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            } else if (isLoggedIn && (nextUrl.pathname === '/login' || nextUrl.pathname === '/signup')) {
                return Response.redirect(new URL('/projects', nextUrl));
            }
            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token }) {
            return token;
        }
    },
    providers: [], // Configured in auth.ts
    session: { strategy: "jwt" },
} satisfies NextAuthConfig
