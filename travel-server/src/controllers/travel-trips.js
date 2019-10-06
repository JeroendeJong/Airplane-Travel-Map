const { Client } = require('pg');

const sql = `
  select
    trips.id,
    trips.name,
    trips.description,
    trips.country_codes,
    trips.header_image_url,
    trips.active,
    ST_asgeojson(ST_extent(segment.geom)) as extent
  from trips
  left join trip_segment as segment on (
    trips.id = segment.trip_id
  ) group by trips.id;
`;

const client = new Client();
const get = async () => {

  client.connect();
  const data = await client
    .query(sql)
    .catch(e => console.error(e.stack))

  const rowData = data.rows.map(row => {
    return {...row, extent: JSON.parse(row.extent)}
  })

  return rowData;
}

module.exports = get;