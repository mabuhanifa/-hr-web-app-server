CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    img TEXT,
    department TEXT,
    leaveStatus TEXT,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    passReset BOOLEAN NOT NULL DEFAULT FALSE
);