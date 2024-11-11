import {db, QueryResult} from '@vercel/postgres';
import type { Invoice, Customer} from "@/app/lib/definitions";
import {Fragment} from 'react';

export default async function InvoicesPage(){

  const client = await db.connect();
  const invoices = await client.sql<Invoice & Customer>`SELECT * FROM invoices LEFT JOIN customers ON invoices.customer_id = customers.id`;

  return (
    <div>
      <h1>Invoices Page</h1>
      <table>
        <thead>
        <tr>
          <td>ID</td>
          <td>Customer</td>
          <td>Amount</td>
          <td>Date</td>
          <td>Status</td>
        </tr>
        </thead>
        <tbody>
          {invoices.rows.map(invoice => (
            <tr key={invoice.id}>
              <td>{invoice.id}</td>
              <td>{invoice.name}</td>
              <td>{invoice.amount}</td>
              <td>{typeof invoice.date}</td>
              <td>{invoice.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}