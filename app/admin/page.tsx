import NextAuth, {Session} from "next-auth";
import {authConfig} from "@/auth.config";
import {auth} from "@/auth";

export default async function AdminPage(){

  const session = await auth();
  if(session){
    console.log(session);
  }

  // const session = await getServerSession(authConfig);
  // if (session) {
  //   console.log('User is logged in:', session);
  // } else {
  //   console.log('User is not logged in');
  // }

  return (
    <h1>Admin Page</h1>
  )
}