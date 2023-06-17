-- Your SQL goes here-- Your SQL goes here
CREATE TABLE draws (
    id VARCHAR NOT NULL PRIMARY KEY,
    name VARCHAR NOT NULL,
    raw_elements TEXT,
    description TEXT,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL
);