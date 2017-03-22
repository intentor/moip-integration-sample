/* Create database objects for the Moip Integration Sample app (PostgreSQL). */

/* product table */

CREATE SEQUENCE product_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;

CREATE TABLE product (
	id integer NOT NULL DEFAULT NEXTVAL('product_id_seq'::regclass) PRIMARY KEY, 
	name varchar(255) NOT NULL,
	description text NOT NULL,
	price float4 NOT NULL
);
COMMENT ON TABLE product IS 'Store products.';
COMMENT ON COLUMN product.id IS 'Product ID.';
COMMENT ON COLUMN product.name IS 'Product name.';
COMMENT ON COLUMN product.description IS 'Product description.';
COMMENT ON COLUMN product.price IS 'Product price.';

INSERT INTO product (name, description, price) VALUES ('Daily Love', 'An entire year of daily messages about love. You will love it!', 69.99);
INSERT INTO product (name, description, price) VALUES ('Everyday Comic', 'The best jokes from the best comedians delivered everyday in your inbox. Infinite laughter guaranteed!', 23.23);
INSERT INTO product (name, description, price) VALUES ('Mail Madness', 'One year of daily crazy e-mails with the most unbelievable histories about everything. You won''t imagine what you''re gonna read!', 24.11);
INSERT INTO product (name, description, price) VALUES ('Suck it Up', 'One year of random daily e-mails from the people you love (or not). It may look like your boss sending you a tough assignment... and maybe it''s!', 66.60);
INSERT INTO product (name, description, price) VALUES ('Summing Up', 'A year of daily headlines from the greatest newspapers of the world. The catch? The contents are always on their original language!', 72.90);
INSERT INTO product (name, description, price) VALUES ('Beyond', 'Daily messages to fulfill a year of something so unique that we won''t tell you what it is (until you read it).', 99.99);

/* client table */

CREATE SEQUENCE client_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;

CREATE TABLE client (
	id integer NOT NULL DEFAULT NEXTVAL('client_id_seq'::regclass) PRIMARY KEY, 
	fullname varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
    document varchar(11) NOT NULL,
    birth_date date NOT NULL,
    phone varchar(20) NOT NULL,
	dat_creation timestamp NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE client IS 'Store clients.';
COMMENT ON COLUMN client.id IS 'Client ID.';
COMMENT ON COLUMN client.fullname IS 'Client full name.';
COMMENT ON COLUMN client.email IS 'Client e-mail.';
COMMENT ON COLUMN client.document IS 'Client document';
COMMENT ON COLUMN client.birth_date IS 'Client birth date';
COMMENT ON COLUMN client.phone IS 'Client phone, on format CC AA NNNNNNNNN, where C is country code; A is area code and N is phone number.';
COMMENT ON COLUMN client.dat_creation IS 'Client signup date.';

/* order table */

CREATE SEQUENCE order_id_seq
    INCREMENT 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    START 1
    CACHE 1;

CREATE TABLE "order" (
	id integer NOT NULL DEFAULT NEXTVAL('order_id_seq'::regclass) PRIMARY KEY,
	code varchar(10) NOT NULL UNIQUE,
	client_id integer NOT NULL,
    amount real NOT NULL,
    installments smallint NOT NULL,
    extras real NOT NULL,
    total real NOT NULL,
    discount_code varchar(10) NULL,
	dat_creation timestamp NOT NULL DEFAULT NOW(),
	dat_update timestamp NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE "order" IS 'Store orders.';
COMMENT ON COLUMN "order".id IS 'Order ID.';
COMMENT ON COLUMN "order".code IS 'Order public code.';
COMMENT ON COLUMN "order".client_id IS 'Client ID related to this order.';
COMMENT ON COLUMN "order".amount IS 'Order total amount value.';
COMMENT ON COLUMN "order".installments IS 'Number of installments to pay the total amount.';
COMMENT ON COLUMN "order".extras IS 'Extra values applied to the order (discounts, freight, etc.).';
COMMENT ON COLUMN "order".total IS 'Order total value, including extra values.';
COMMENT ON COLUMN "order".discount_code IS 'Order discount code used.';
COMMENT ON COLUMN "order".dat_creation IS 'Order creation date.';
COMMENT ON COLUMN "order".dat_creation IS 'Order last update date.';

/* order_product table */

CREATE TABLE order_product (
	order_id integer NOT NULL REFERENCES "order",
	product_id integer NOT NULL REFERENCES product,
    quantity smallint NOT NULL,
    price real NOT NULL,
	CONSTRAINT client_pk PRIMARY KEY (order_id, product_id)
);
COMMENT ON TABLE order_product IS 'Products that make an order.';
COMMENT ON COLUMN order_product.order_id IS 'Product ID.';
COMMENT ON COLUMN order_product.product_id IS 'Order ID.';
COMMENT ON COLUMN order_product.quantity IS 'Product quantity.';
COMMENT ON COLUMN order_product.price IS 'Price paid for a unit of the product on the given order.';