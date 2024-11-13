'use client';

import { PencilIcon, PlusIcon, TrashIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {deleteInvoice} from "@/app/lib/actions";
import {useActionState} from 'react';
import {useShowToolTip} from "@/app/lib/hooks";
import {clsx} from "clsx";

export function CreateInvoice() {
  return (
    <Link
      href="/dashboard/invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {

  const deleteInvoiceWithId = deleteInvoice.bind(null,id);

  const [rowCount, submitAction, isPending] = useActionState<number|null>(deleteInvoiceWithId, null);

  const showToolTip = useShowToolTip({rowCount, isPending});

  console.log('rowCount',rowCount);

  return (
    <form action={submitAction} className='relative'>
      <button className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
      {showToolTip &&
        <ToolTip msg='Not Found' severity='error'/>
      }
    </form>
  );
}

function ToolTip({msg,severity = 'error'}:{msg:string, severity?: 'error'|'info'|'warning'}){

  return (
    <div className={
      clsx(`absolute flex flex-col h-full items-center p-1 rounded-md right-0 top-0 w-[70px] fade-out`,
        {
          'bg-red-500' : severity === 'error',
          'bg-blue-500' : severity === 'info',
          'bg-yellow-500' : severity === 'warning',
        }
      )
    }>
      <ExclamationCircleIcon className='w-5 text-white'/>
      <span className='text-center text-xs text-white break-words'>
        {msg}
      </span>
    </div>
  )
}
