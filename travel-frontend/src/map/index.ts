import mapboxgl from 'mapbox-gl';
import interactionsSetup from './interactions';
import { FLIGHTS_DATA_SOURCE_ID, AIRPORTS_DATA_SOURCE_ID, FLIGHTS_DATA_ID, AIRPORTS_DATA_ID } from './data';
import Airport from '../models/airport';
import Flight from '../models/flight';

mapboxgl.accessToken = 'pk.eyJ1IjoieTBneiIsImEiOiJjaW9scWxsNzIwMDMxdzVtNm56MHhweGdjIn0.XrmaYtqwrszezXe9y-gBuw';

class Map {
  public map: mapboxgl.Map | null = null;
  private selected: { type: string; id: any; } | null = null;

  public create() {
    const map = new mapboxgl.Map({
      container: 'map', // container id
      style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
      center: [-74.50, 40], // starting position [lng, lat]
      zoom: 9, // starting zoom
      hash: true
    });

    this.map = map;
    (window as any).map = map;

    interactionsSetup(map);
  }

  public setGeometryExclusivityFilter(flightOrAirport: Flight | Airport | null): void {
    if (flightOrAirport === null && this.selected !== null) {
      const {id, type} = this.selected;
      const source = type === 'flight' ? FLIGHTS_DATA_SOURCE_ID : AIRPORTS_DATA_SOURCE_ID;
      this.map!.setFeatureState({id, source}, {selected: false});

      this.map!.setFilter(FLIGHTS_DATA_ID, undefined);
      this.map!.setFilter(AIRPORTS_DATA_ID, undefined);

      this.selected = null;
      return;
    }

    if (flightOrAirport === null) return;

    const baseFlightObject = flightOrAirport.data;
    if (Airport.isAirport(baseFlightObject)) {
      this.handleAirportExclusivity(flightOrAirport);
    }
    else if (Flight.isFlight(baseFlightObject)) {
      this.handleFlightExclusivity(flightOrAirport);
    }
  }

  private handleAirportExclusivity(airport: Airport) {
    const id = airport!.data.id;
    // this.map!.setFeatureState({id, source: AIRPORTS_DATA_SOURCE_ID}, {selected: true});
    console.log(id);
    this.map!.setFilter(AIRPORTS_DATA_ID, ['==', ['get', 'id'], id]);
    this.map!.setFilter(AIRPORTS_DATA_ID + '2', ['==', ['get', 'id'], id]);
    
    this.map!.setFilter(FLIGHTS_DATA_ID, [
      'any',
      ['==', ['get', 'arrival_id'], id],
      ['==', ['get', 'departure_id'], id]
    ]);

    this.selected = { type: 'flight', id };
  }

  private handleFlightExclusivity(flight: Flight) {
    const id = flight!.data.id;
    this.map!.setFeatureState({id, source: FLIGHTS_DATA_SOURCE_ID}, {selected: true});
    this.map!.setFilter(FLIGHTS_DATA_ID, ['==', ['get', 'id'], id])

    const {arrival_id, departure_id} = flight.data;
    const filter = [
      'any',
      ['==', ['get', 'id'], arrival_id],
      ['==', ['get', 'id'], departure_id]
    ];

    this.map!.setFilter(AIRPORTS_DATA_ID, filter)
    this.map!.setFilter(AIRPORTS_DATA_ID + '2', filter);

    this.selected = { type: 'airport', id };
  }

  public setFlightLayer(data: any) {
    this.map!.addSource(FLIGHTS_DATA_SOURCE_ID, {
      type: 'geojson',
      data: data as any
    });

    this.map!.addLayer({
      id: FLIGHTS_DATA_ID,
      type: "line",
      source: FLIGHTS_DATA_SOURCE_ID,
      layout: {
        "line-join": "round",
        "line-cap": "round"
      },
      paint: {
        "line-color": 'green',
        "line-opacity": 0.3,
        "line-width": 1
      }
    });
  }

  public setAirportLayer(data: any) {
    this.map!.addSource(AIRPORTS_DATA_SOURCE_ID, {
      type: 'geojson',
      data: data as any
    });

    this.map!.addLayer({
      id: AIRPORTS_DATA_ID,
      type: "circle",
      source: AIRPORTS_DATA_SOURCE_ID,
      paint: {
        'circle-radius': {
          'base': 2,
          'stops': [[12, 3], [22, 180]]
        },
        'circle-color': '#e55e5e',
        'circle-opacity': 1,
      }
    });

    this.map!.addLayer({
      id: AIRPORTS_DATA_ID + '2',
      type: "symbol",
      source: AIRPORTS_DATA_SOURCE_ID,
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 10,
      }
    });
  }
}

export default new Map();