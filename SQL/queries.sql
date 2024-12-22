-- Invoices
SELECT * FROM invoices WHERE status ILIKE '%pend%';

-- Invoice filtered by date
SELECT * FROM invoices LEFT JOIN customers ON invoices.customer_id = customers.id WHERE date = '2024-11-13';

UPDATE users SET capabilities = ARRAY['edit_assets'] WHERE id = '410544b2-4001-4271-9855-fec4b6a6442a';

UPDATE users SET capabilities = array_append(capabilities, 'edit_posts') WHERE id = '410544b2-4001-4271-9855-fec4b6a6442a';