

CREATE TABLE users(
id serial primary key,
name varchar,
img_url varchar,
fb_id varchar,
role int default 2
);

-- default value for role is 2, it is the user role.  ADMIN role is 1
