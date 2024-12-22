import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {authConfig} from "@/auth.config";
import {z} from 'zod';
import {sql} from "@vercel/postgres";
import type {User} from "@/app/lib/definitions";
import bcrypt from "bcrypt";


async function getUserByEmail(email: string) {
  try {
    const result = await sql<User>`
      SELECT *
      FROM users
      WHERE email = ${email}
    `;
    return result.rows[0];

  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const {signIn, signOut, auth} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const credentialsSchema = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        });
        const parsedCredentials = credentialsSchema.safeParse(credentials);

        if(parsedCredentials.success){
          const {email, password} = parsedCredentials.data;
          const userData = await getUserByEmail(email);
          if(!userData) return null;
          const passwordsMatch = await bcrypt.compare(password, userData.password);
          if (passwordsMatch) return userData;
        }
        console.log('Invalid credentials');
        return null
      }
    }),
    ],
})