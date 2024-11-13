-- Invoices
SELECT * FROM invoices WHERE status ILIKE '%pend%';

-- Invoice filtered by date
SELECT * FROM invoices LEFT JOIN customers ON invoices.customer_id = customers.id WHERE date = '2024-11-13';