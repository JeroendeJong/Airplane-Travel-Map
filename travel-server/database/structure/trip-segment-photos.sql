-- DDL generated by Postico 1.5.10
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE trip_segment_photos (
    id integer DEFAULT nextval('photos_id_seq'::regclass) PRIMARY KEY,
    link_id text,
    description text,
    trip_segment_id integer REFERENCES trip_segment(id),
    geom geometry
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX photos_pkey ON trip_segment_photos(id int4_ops);
