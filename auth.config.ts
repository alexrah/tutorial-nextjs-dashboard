import type {NextAuthConfig} from 'next-auth';


export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({auth, request: {nextUrl}}){
      const isLoggedIn = !!auth?.user;
      // const isOnDashBoard = nextUrl.pathname.startsWith('/dashboard');
      // if(isOnDashBoard){
        return isLoggedIn;
      // } else if (isLoggedIn){
      //   return Response.redirect(new URL('/dashboard', nextUrl));
      // }
      // return false
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

      console.log('session user',user);
      console.log('session token',token);

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