'use server';

import {parseFormData} from "@k1eu/typed-formdata";
import type {tInvoiceFormDataRaw, tInvoiceFormDataValidated, tInvoiceFormState} from "@/app/lib/definitions";
import {z} from 'zod';
import {sql} from '@vercel/postgres'
import {revalidatePath} from "next/cache";
import {redirect} from "next/navigation";
import {signIn} from "@/auth";
import {AuthError} from "next-auth";


const invoiceFormSchema = z.object({
  id: z.string(),
  customerId: z.string({invalid_type_error: "Please select a customer",}),
  amount: z.coerce.number({invalid_type_error: "Please enter an amount",}).gt(0,{message: 'Please enter an amount grater than 0'}),
  status: z.enum(['pending', 'paid'], {invalid_type_error: "Please select a status",}),
  date: z.string()
})

function validateInvoiceFormData(formData: FormData, errorMsg = ''):tInvoiceFormDataValidated|tInvoiceFormState{

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
      message: `Missing fields: ${errorMsg}`,
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
  console.log('formData values', Object.fromEntries(formData.entries()));

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

export async function updateInvoice(invoiceId: string, prevState:tInvoiceFormState, formData: FormData): Promise<tInvoiceFormState>{

  const validatedFields = validateInvoiceFormData(formData,'invoice not updated');
  if(typeof (validatedFields as tInvoiceFormState).message !== 'undefined'){
    return (validatedFields as tInvoiceFormState)
  }

  const {customerId, amountInCents, status, currentDate} = (validatedFields as tInvoiceFormDataValidated);

  try {
    const queryResults = await sql`UPDATE invoices SET customer_id = ${customerId}, amount=${amountInCents}, status=${status}, date=${currentDate} WHERE id=${invoiceId}`;
    console.log('queryResults',queryResults);

  } catch (error){
    console.error(error);
    // throw new Error("Database Error: Failed to Update Invoice");
    return  {
      message: 'Database Error: Failed to Update Invoice'
    }

  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/invoices');
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

export async function authenticate(prevState: string| undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type){
        case "CredentialsSignin":
          return "Invalid credentials";
        default:
          return "Something went wrong";
      }
    }
    console.error(error);
    throw error;
  }
}