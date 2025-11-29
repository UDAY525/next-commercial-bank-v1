import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "./connectDB";
import User from "./models/User";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture, // <-- FIX
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        await connectDB();
        const email = profile?.email || user?.email;
        if (!email) {
          console.error("No email available on profile/user during signIn");
          return false;
        }

        let isUserExist = await User.findOne({ email: email }).lean();

        if (!isUserExist) {
          isUserExist = await User.create({
            email,
            name: profile?.name || user?.name,
            profileImage: profile?.picture || user?.image,
            // add other defaults as needed
          });
        }

        user.id = isUserExist._id.toString();

        return true;
      } catch (error) {
        console.error("Error in NextAuth signIn callback:", error);
        return false;
      }
    },

    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
