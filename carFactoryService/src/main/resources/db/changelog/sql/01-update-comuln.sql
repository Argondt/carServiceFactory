-- liquibase formatted sql

-- changeset update_table:1

ALTER TABLE employee ADD COLUMN user_id varchar(255) null;