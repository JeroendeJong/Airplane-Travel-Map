-- DDL generated by Postico 1.5.10
-- Not all database features are supported. Do not use for backup.

-- Table Definition ----------------------------------------------

CREATE TABLE trip_segment_geometry (
    id SERIAL PRIMARY KEY,
    geom geometry,
    type text,
    trip_segment_id integer REFERENCES trip_segment(id)
);

-- Indices -------------------------------------------------------

CREATE UNIQUE INDEX trip_segment_geometry_pkey ON trip_segment_geometry(id int4_ops);
