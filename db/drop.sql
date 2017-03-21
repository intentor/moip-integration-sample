/* Drop database objects for the Moip Integration Sample app (PostgreSQL). */

DROP TABLE IF EXISTS order_product;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS client;
DROP TABLE IF EXISTS "order";

DROP SEQUENCE IF EXISTS product_id_seq;
DROP SEQUENCE IF EXISTS client_id_seq;
DROP SEQUENCE IF EXISTS order_id_seq;