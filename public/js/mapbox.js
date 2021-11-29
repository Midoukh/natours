/* eslint-disable */
console.log('Hello from client side');

export const displayMap = (locations) => {
  const accessToken =
    'pk.eyJ1IjoibWlkb3VoazQzIiwiYSI6ImNrdmd0bTNpcTFmbDgyd28wOGxvNW9vbjEifQ.syjvZRge7CTUmAhmVGUQCg';
  mapboxgl.accessToken = accessToken;
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/midouhk43/ckvgvuyj1hpc014p8hdrsyusi',
    scrollZoom: false,
    //center: [6.2584, 36.4519],
    //zoom: 4,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    //create market
    const el = document.createElement('div');
    el.className = 'marker';

    //add marker to map
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    //add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    //extends map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
