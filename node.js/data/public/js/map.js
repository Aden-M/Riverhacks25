// Initialize the map centered on a default location
const map = L.map('map').setView([39.8283, -98.5795], 4); // Center of USA

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Initialize marker groups
const eventMarkers = L.layerGroup().addTo(map);
const resourceMarkers = L.layerGroup().addTo(map);

// Custom icons
const eventIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

const resourceIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

// Function to fetch and display markers
async function fetchMarkers() {
    try {
        const response = await fetch('/api/map/markers');
        const data = await response.json();

        // Clear existing markers
        eventMarkers.clearLayers();
        resourceMarkers.clearLayers();

        // Add event markers
        data.events.forEach(event => {
            const marker = L.marker([event.lat, event.lng], { icon: eventIcon })
                .bindPopup(`
                    <h3>${event.name}</h3>
                    <p>${event.description}</p>
                    <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> ${new Date(event.date).toLocaleTimeString()}</p>
                `);
            eventMarkers.addLayer(marker);
        });

        // Add resource markers
        data.resources.forEach(resource => {
            const marker = L.marker([resource.lat, resource.lng], { icon: resourceIcon })
                .bindPopup(`
                    <h3>${resource.name}</h3>
                    <p>${resource.description}</p>
                    <p><strong>Type:</strong> ${resource.type}</p>
                    <p><strong>Status:</strong> ${resource.status}</p>
                `);
            resourceMarkers.addLayer(marker);
        });
    } catch (error) {
        console.error('Error fetching markers:', error);
    }
}

// Filter functions
function filterResources(type) {
    map.removeLayer(eventMarkers);
    map.removeLayer(resourceMarkers);
    
    if (type === 'events') {
        map.addLayer(eventMarkers);
    } else if (type === 'resources') {
        map.addLayer(resourceMarkers);
    }
}

function showAll() {
    map.addLayer(eventMarkers);
    map.addLayer(resourceMarkers);
}

// Initialize markers
fetchMarkers();

// Refresh markers every 5 minutes
setInterval(fetchMarkers, 300000);

// Add geolocation
map.locate({setView: true, maxZoom: 16});

map.on('locationfound', (e) => {
    L.marker(e.latlng)
        .bindPopup('You are here')
        .addTo(map);
});

map.on('locationerror', (e) => {
    console.error('Error getting location:', e.message);
});
