import type {tErrorRouteProps} from "@/app/lib/definitions";


export function InvoicesErrorRoute({error, reset}:tErrorRouteProps) {

  // console.error(error.message);
  console.error(error.stack?.split('\n')[1]);

  return (
    <div className='flex h-screen items-center justify-center flex-col'>
      <h1 className='text-center'>Something went wrong: [{error.message}]</h1>
      <h4>{error.digest}</h4>
      <button
        className='mt-4 rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-400 active:bg-blue-600'
        onClick={()=> {reset()}}
      >
        Try again
      </button>
    </div>
  )
}