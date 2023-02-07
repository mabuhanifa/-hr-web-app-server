CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    img VARCHAR(200),
    department VARCHAR(50),
    leavestatus VARCHAR(100),
    isadmin BOOLEAN NOT NULL DEFAULT FALSE,
    passreset BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE DATABASE employee;