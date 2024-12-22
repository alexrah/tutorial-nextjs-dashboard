import {auth} from "@/auth";


export default async function AdminPage(){

  const session = await auth();
  if(session){
    console.log(session);
  }

  return (
    <h1>Admin Page</h1>
  )
}