import {ReactNode} from "react";
import {clsx} from "clsx";

export const FormErrorField = ({children, id}:{children:ReactNode, id: string}) => {

  return (
    <div id={id} aria-live='polite' aria-atomic={true} className={clsx({
      'mt-1': children
    })}>
      <p className={
        clsx(`text-white font-bold bg-red-600`,{
          'p-1': children
        })
      }>
        {children}
      </p>
    </div>
  )
}
