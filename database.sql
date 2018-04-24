-- default value for role is 2, it is the user role.  ADMIN role is 1
CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first_name character varying,
    last_name character varying,
    img_url character varying,
    fb_id character varying,
    role integer default 2,
    name character varying,
    email character varying,
    created Date,
    customer_id character varying
);


CREATE TABLE nonprofit
(
    id SERIAL PRIMARY KEY,
    name character varying,
    city character varying,
    picture_url character varying,
    logo_url character varying,
    goal_value integer,
    goal_description character varying,
    state character varying,
    description character varying,
    product_id character varying,
    plan_id_five character varying,
    plan_id_ten character varying,
    plan_id_twenty character varying,
    created Date default now()
);


CREATE TABLE onetime_donations
(
    id SERIAL PRIMARY KEY,
    amount_charged integer,
    product_id character varying,
    charge_id character varying,
    transaction_id character varying,
    captured BOOLEAN default false,
    date timestamp,
    user_id integer REFERENCES users ON DELETE CASCADE,
    nonprofit_id integer REFERENCES nonprofit ON DELETE CASCADE
);


CREATE TABLE invoices
(
    id SERIAL PRIMARY KEY,
    amount_paid integer,
    invoice_id character varying,
    product_id character varying,
    charge_id character varying,
    subscription_id character varying,
    subscription_status character varying,
    plan_id character varying,
    period_start date,
    period_end date,
    date date,
    last_updated timestamp,
    user_id integer REFERENCES users ON DELETE CASCADE,
    nonprofit_id integer REFERENCES nonprofit ON DELETE CASCADE
);



CREATE TABLE feed
(
    id SERIAL PRIMARY KEY,
    nonprofit_id integer REFERENCES nonprofit(id) ON DELETE CASCADE,
    title character varying,
    feed_text character varying,
    feed_img_url character varying,
    feed_video_url character varying,
    feed_date_posted timestamptz default now()
);

INSERT into nonprofit (name, picture_url, logo_url, description)
VALUES ('cogiv', '../styles/assets/logo.png', '../styles/assets/logo_for_db_160.png', 'Site-wide information comes from here');
