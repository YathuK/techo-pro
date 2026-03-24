import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    // Protect all routes except auth, api, static files
    "/((?!auth|api|_next/static|_next/image|favicon.ico).*)",
  ],
};
