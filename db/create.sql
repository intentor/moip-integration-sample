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

INSERT INTO product (name, description, price) VALUES ('Product 1', 'Product description', 666.00);
INSERT INTO product (name, description, price) VALUES ('Product 2', 'Product description', 24.11);
INSERT INTO product (name, description, price) VALUES ('Product 3', 'Product description', 69.00);

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
    document varchar(8) NOT NULL,
    birth_date date NOT NULL,
    phone varchar(20) NOT NULL,
	dat_creation timestamp NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE client IS 'Store clients.';
COMMENT ON COLUMN client.id IS 'Client ID.';
COMMENT ON COLUMN client.fullnameid IS 'Client full name.';
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
    price real NOT NULL,
	CONSTRAINT client_pk PRIMARY KEY (order_id, product_id)
);
COMMENT ON TABLE order_product IS 'Products that make an order.';
COMMENT ON COLUMN order_product.order_id IS 'Product ID.';
COMMENT ON COLUMN order_product.product_id IS 'Order ID.';
COMMENT ON COLUMN order_product.price IS 'Price paid for the product on the given order.';