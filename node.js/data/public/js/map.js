// Initialize map
const map = L.map('map').setView([30.2671, -97.7433], 10); // Default: Austin

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a marker
const marker = L.marker([30.2671, -97.7433]).addTo(map);

// Popup with info
marker.bindPopup("<b>Hello!</b><br>Welcome to Austin!").openPopup();
