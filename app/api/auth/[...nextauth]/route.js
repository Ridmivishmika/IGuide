import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { connect } from "@/lib/db";
import { signJwtToken } from "@/lib/jwt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials) {
        await connect();

        const { email, password } = credentials;

        try {
          const user = await User.findOne({ email });

          if (!user) {
            throw new Error("Invalid input");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            throw new Error("Passwords do not match");
          } else {
            const { password: hashedPassword, ...currentUser } = user._doc;
            const accessToken = signJwtToken(currentUser, { expiresIn: "7d" });

            return {
              ...currentUser,
              accessToken,
            };
          }
        } catch (error) {
          console.log("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt", // Only use JWT, no sessions
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token._id = user._id;
      }
      return token;
    },
    // No need for session callback if you don’t use useSession()
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
