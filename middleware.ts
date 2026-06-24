import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
    "/api/orders/:path*",
    "/api/profile/:path*",
    "/api/admin/:path*",
  ],
};
