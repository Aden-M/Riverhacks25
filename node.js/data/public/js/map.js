// Initialize map
const map = L.map('map').setView([37.7749, -122.4194], 13); // Example: San Francisco

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a marker
const marker = L.marker([30.2671, -97.7433]).addTo(map);

// Popup with info
marker.bindPopup("<b>Hello!</b><br>This is Austin.").openPopup();
