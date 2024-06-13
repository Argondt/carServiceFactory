-- liquibase formatted sql

-- changeset update_table:1

ALTER TABLE customer ADD COLUMN email varchar(255) null;