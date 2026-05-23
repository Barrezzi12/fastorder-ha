SELECT 'CREATE DATABASE orders_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'orders_db')\gexec
SELECT 'CREATE DATABASE inventory_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'inventory_db')\gexec
SELECT 'CREATE DATABASE menu_db' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'menu_db')\gexec
