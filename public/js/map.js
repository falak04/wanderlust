mapboxgl.accessToken = mapToken;

// Create a new map
const map = new mapboxgl.Map({
  container: 'map', // The container ID from the HTML
  center: listing.geometry.coordinates, // Set initial position (can be updated dynamically)
  zoom: 9, // Initial zoom level
});
console.log(listing.geometry.coordinates);
// Add a marker to the map (use dynamic values if needed)
const marker1 = new mapboxgl.Marker({ color: 'red' })
  .setLngLat(listing.geometry.coordinates) // Replace with dynamic data if needed
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h4>${listing.title}</h4><p>Exact Location will be provided later</p>`
    )
  )
  .addTo(map);
