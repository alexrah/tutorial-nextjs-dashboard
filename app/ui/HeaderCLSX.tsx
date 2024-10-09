"use client";
import {useState} from "react";
import headerStyles from "@/app/ui/header.module.css";
import clsx from 'clsx';


type tHeaderType = 'wide' | 'narrow';
export function HeaderCLSX(){

  const [headerType, setHeaderType] = useState<tHeaderType>('narrow');

  return (
    <>
      <h1 className={clsx(
        {
          [headerStyles.wide]: headerType === 'wide',
          [headerStyles.narrow]: headerType === 'narrow',
        }
      )}>This is where my header will go <span className={headerStyles.span}>XXX</span> </h1>
      <div className="flex items-center gap-2">
        <span>Header type:</span>
        <label>
          <input type="radio" name="headerType" value="wide" checked={headerType === 'wide'} onChange={() => setHeaderType('wide')} />
          Wide
        </label>
        <label>
          <input type="radio" name="headerType" value="narrow" checked={headerType === 'narrow'} onChange={() => setHeaderType('narrow')} />
          Narrow
        </label>
      </div>
    </>
  )

}