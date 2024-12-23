import {auth} from "@/auth";


export default async function AdminPage(){

  const session = await auth();
  if(session){
    console.log(session);
  }

  return (
    <main>
      <title>This is a hoisted title</title>
      <h1>Admin Page</h1>
    </main>
  )
}