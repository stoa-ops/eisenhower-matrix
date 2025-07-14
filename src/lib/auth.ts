import { NextAuthOptions, Profile } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { Account } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'todoist',
      name: 'Todoist',
      type: 'oauth',
      authorization: {
        url: 'https://todoist.com/oauth/authorize',
        params: {
          scope: 'data:read_write',
        },
      },
      token: 'https://todoist.com/oauth/access_token',
      userinfo: {
        url: 'https://api.todoist.com/sync/v9/sync',
        async request(context: { tokens: { access_token: string } }) {
          const response = await fetch('https://api.todoist.com/sync/v9/sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${context.tokens.access_token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'sync_token=*&resource_types=["user"]',
          });

          const data = await response.json();
          return data.user;
        },
      },
      clientId: process.env.TODOIST_CLIENT_ID,
      clientSecret: process.env.TODOIST_CLIENT_SECRET,
      profile(profile: Profile & { id: string; full_name: string; email: string; avatar_medium: string }) {
        return {
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          image: profile.avatar_medium,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};