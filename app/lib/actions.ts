'use server';

import {parseFormData} from "@k1eu/typed-formdata";
import type {tInvoiceFormDataRaw, tInvoiceFormDataValidated, tInvoiceFormState} from "@/app/lib/definitions";
import {z} from 'zod';
import {sql} from '@vercel/postgres'
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";


const invoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string({invalid_type_error: "Please select a customer",}),
  amount: z.coerce.number({invalid_type_error: "Please enter an amount",}).gt(0,{message: 'Please enter an amount grater than 0'}),
  status: z.enum(['pending', 'paid'], {invalid_type_error: "Please select a status",}),
  date: z.string()
})

function validateInvoiceFormData(formData: FormData):tInvoiceFormDataValidated|tInvoiceFormState{

  const formDataParsed = parseFormData<tInvoiceFormDataRaw>(formData);

  // let {customerId, amount, status } = (Object.fromEntries(formData.entries()) as unknown as tInvoiceFormData)
  const invoiceFormValidator = invoiceFormSchema.omit({id: true, date: true});

  // const {customerId, amount, status} = invoiceFormValidator.parse({
  const validatedFields = invoiceFormValidator.safeParse({
    customerId: formDataParsed.get('customerId'),
    amount: formDataParsed.get('amount'),
    status: formDataParsed.get('status')
  });

  if(!validatedFields.success){

    console.log('validatedFields.data',validatedFields.data);

    return {
      message: 'Missing fields',
      error: validatedFields.error.flatten().fieldErrors,
      prevFormState: {
        customerId: formDataParsed.get('customerId'),
        amount: formDataParsed.get('amount'),
        status: formDataParsed.get('status')
      }
    };
  }

  const {customerId, amount, status} = validatedFields.data

  const amountInCents = amount * 100;
  const currentDate = new Date().toISOString().split('T')[0]

  return {
    customerId,
    amountInCents,
    status,
    currentDate
  }

}

export async function createInvoice(prevState:tInvoiceFormState, formData: FormData): Promise<tInvoiceFormState> {
  console.log('createInvoice formData',Array.from(formData.entries()));
  console.log('formData values', Object.fromEntries(formData.entries()));

  // const {customerId, amountInCents, status, currentDate} = validateInvoiceFormData(formData);
  const validatedFields = validateInvoiceFormData(formData);
  if(typeof (validatedFields as tInvoiceFormState).message !== 'undefined'){
    return (validatedFields as tInvoiceFormState)
  }

  const {customerId, amountInCents, status, currentDate} = (validatedFields as tInvoiceFormDataValidated);

  try {
    await sql`INSERT INTO invoices (customer_id, amount, status, date) VALUES (${customerId}, ${amountInCents}, ${status}, ${currentDate})`;

  } catch (error){
    console.error(error)
    // throw new Error('Database Error: Failed to Create Invoice');
    return {
      message: 'Database Error: Failed to Create Invoice'
    }
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/invoices');
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