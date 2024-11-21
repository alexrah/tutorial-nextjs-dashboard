import {useEffect, useState} from "react";

type tUseToolTipProps = {
  rowCount: number|null,
  isPending: boolean
}

export function useShowToolTip({rowCount, isPending}:tUseToolTipProps){

  const [showToolTip, setShowToolTip] = useState(false);

  useEffect(() => {

    if(typeof rowCount === 'number' && rowCount === 0){
      setShowToolTip(true);
      setTimeout(()=>{
        setShowToolTip(false);
      },2000)
    }

  }, [isPending, rowCount]);

  return showToolTip;

}