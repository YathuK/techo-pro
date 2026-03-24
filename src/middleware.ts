import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/customers/:path*",
    "/quotes/:path*",
    "/messages/:path*",
    "/employees/:path*",
    "/jobs/:path*",
    "/inventory/:path*",
    "/invoices/:path*",
  ],
};
