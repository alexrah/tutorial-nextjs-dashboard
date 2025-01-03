import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers, fetchInvoiceById } from '@/app/lib/data';
import type {tPageRouteProps} from "@/app/lib/definitions";
import {notFound} from "next/navigation";
import type {Metadata} from "next";

type tParams = {id:string};
interface tInvoicesEditPage extends tPageRouteProps<tParams, null> {
  params: Promise<tParams>
}

export async function generateMetadata({params}:tInvoicesEditPage): Promise<Metadata> {
  const paramsData = await params;
  const invoiceId = paramsData.id;
  const invoiceData = await fetchInvoiceById(invoiceId);
  return {
    title: `Edit Invoice #${invoiceData.id}`,
  }
}


export async function InvoicesEditPageRoute({params}:tInvoicesEditPage) {

  const paramsData = await params;
  const invoiceId = paramsData.id;

  const invoiceData = await fetchInvoiceById(invoiceId);

  if(!invoiceData){
    notFound();
  }

  const customers = await fetchCustomers();

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${paramsData.id}/edit`,
            active: true,
          },
        ]}
      />
      <Form invoice={invoiceData} customers={customers} />
    </main>
  );
}