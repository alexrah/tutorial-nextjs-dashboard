'use server';

import {parseFormData} from "@k1eu/typed-formdata";
import type {tInvoiceFormData} from "@/app/lib/definitions";
import {z} from 'zod';
import {sql} from '@vercel/postgres'
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";

const invoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string()
})

function validateInvoiceFormData(formData: FormData){

  const formDataParsed = parseFormData<tInvoiceFormData>(formData);
  // let {customerId, amount, status } = (Object.fromEntries(formData.entries()) as unknown as tInvoiceFormData)
  const invoiceFormValidator = invoiceFormSchema.omit({id: true, date: true});

  const {customerId, amount, status} = invoiceFormValidator.parse({
    customerId: formDataParsed.get('customerId'),
    amount: formDataParsed.get('amount'),
    status: formDataParsed.get('status')
  });
  const amountInCents = amount * 100;
  const currentDate = new Date().toISOString().split('T')[0]

  return {
    customerId,
    amountInCents,
    status,
    currentDate
  }

}

export async function createInvoice(formData: FormData) {
  console.log('createInvoice formData',Array.from(formData.entries()));
  console.log('formData values', Object.fromEntries(formData.entries()));

  const {customerId, amountInCents, status, currentDate} = validateInvoiceFormData(formData);
  try {
    await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${currentDate})`;
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');

  } catch (error){
    console.error(error)
    throw new Error('Database Error: Failed to Create Invoice');
  }

  redirect('/dashboard/invoices');

}

export async function updateInvoice(invoiceId: string, formData: FormData){

  const {customerId, amountInCents, status, currentDate} = validateInvoiceFormData(formData);
  try {
    const queryResults = await sql`UPDATE invoices SET customer_id = ${customerId}, amount=${amountInCents}, status=${status}, date=${currentDate} WHERE id=${invoiceId}`;
    console.log('queryResults',queryResults);

    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');

  } catch (error){
    console.error(error);
    throw new Error("Database Error: Failed to Update Invoice");
  }

  redirect('/dashboard/invoices');

}

export async function deleteInvoice(invoiceId: string){

  try{
    const queryResults = await sql`DELETE FROM invoices WHERE id = ${invoiceId}`;
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/invoices');
    return queryResults.rowCount

  } catch (error){
    console.log('Database Error', error);
    throw new Error('Database Error: Failed to Delete Invoice');
  }


}