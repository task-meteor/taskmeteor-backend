===
Table for users

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name TEXT NOT NULL,
email VARCHAR(255) NOT NULL UNIQUE,
password TEXT NOT NULL
);

===

ALTER TABLE public.users
    ADD COLUMN g_auth character varying(256),
    ADD COLUMN fb_auth character varying(256);
