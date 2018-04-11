

CREATE TABLE users(
id serial primary key,
name varchar,
img_url varchar,
fb_id varchar,
stripe_id varchar,
role int default 2
);

-- default value for role is 2, it is the user role.  ADMIN role is 1



CREATE TABLE nonprofit(
id serial primary key,
name varchar,
picture_url varchar,
logo_url varchar,
description varchar,
goal_value int,
goal_description varchar,
product_id varchar,
five_plan_id varchar,
ten_plan_id varchar,
twenty_plan_id varchar
);

CREATE TABLE feed(
id serial primary key,
nonprofit_id int REFERENCES nonprofit(id),
title varchar,
feed_text varchar,
feed_img_url varchar,
feed_video_url varchar,
feed_date_posted date
);
