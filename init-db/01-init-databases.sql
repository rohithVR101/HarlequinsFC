-- Create databases if they do not exist
SELECT 'CREATE DATABASE quinsfc_tickets'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'quinsfc_tickets')\gexec

SELECT 'CREATE DATABASE quinsfc_payments'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'quinsfc_payments')\gexec

SELECT 'CREATE DATABASE quinsfc_parking'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'quinsfc_parking')\gexec

