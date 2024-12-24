import type {NextAuthConfig} from 'next-auth';


export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({auth, request: {nextUrl}}){
      const isLoggedIn = !!auth?.user;

      console.log('isLoggedIn',isLoggedIn);

      const isOnLogin = nextUrl.pathname.startsWith('/login');
      if(isOnLogin && isLoggedIn){
        return Response.redirect(new URL('/dashboard', nextUrl));
      }

      return isLoggedIn;

    },
    jwt: async ({token, user}) => {
      if (user) {
        token.id = user.id;
        token.capabilities = user.capabilities;
        // Add any other fields you need
      }
      return token;
    },
    session: async ({session, user, token}) => {

      // console.log('session user',user);
      // console.log('session token',token);

      if(session?.user){
        if(token.sub != null){
          session.user.id = token.sub;
        }

        session.user.capabilities = token.capabilities as string[];
      }
      return session;
    }
  },
  providers: [

  ]
} satisfies NextAuthConfig