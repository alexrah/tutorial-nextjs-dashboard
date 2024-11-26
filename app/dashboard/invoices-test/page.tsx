import {db} from '@vercel/postgres';
import type { Invoice, Customer} from "@/app/lib/definitions";

export default async function InvoicesTestPage(){

  const client = await db.connect();
  const invoices = await client.sql<Omit<Invoice, 'customer_id'> & Pick<Customer, 'name'>>`SELECT i.id, i.amount, i.date, i.status, c.name FROM invoices AS i LEFT JOIN customers AS c ON i.customer_id = c.id`;

  return (
    <div>
      <h1>Invoices Page</h1>
      <table>
        <thead>
        <tr>
          <td>Invoice ID</td>
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