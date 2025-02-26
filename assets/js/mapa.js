let map;
let userMarker;
let userCircle;
const dangerZones = [];

// Inicialização do mapa
function initMap() {
    // Coordenadas de Luanda, Angola
    const luandaCoords = [-8.8389, 13.2894];
    map = L.map('map').setView(luandaCoords, 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 30
    }).addTo(map);

    // Solicitar localização do usuário
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;
                updateUserLocation(latitude, longitude);
                checkDangerZones(latitude, longitude);
            },
            error => {
                console.error('Erro ao obter localização:', error);
                // Se não conseguir obter a localização, mantém o centro em Luanda
                updateUserLocation(luandaCoords[0], luandaCoords[1]);
            },
            { enableHighAccuracy: true }
        );
    }

    // Adicionar algumas zonas de perigo de exemplo em Luanda
    addDangerZone(-8.8389, 13.2894, 'high', {
        assaults: 12,
        weapons: true,
        injuries: 6
    });

    // Bairro Operário
    addDangerZone(-8.8469, 13.2794, 'medium', {
        assaults: 7,
        weapons: false,
        injuries: 3
    });
    // Maianga
    addDangerZone(-8.8289, 13.2694, 'high', {
        assaults: 15,
        weapons: true,
        injuries: 8
    })
    // Viana
addDangerZone(-8.897136999999999, 13.34962, 'medium', {
    assaults: 5,
    weapons: false,
    injuries: 2
});

// Rangel
addDangerZone(-8.8500, 13.2500, 'high', {
    assaults: 10,
    weapons: true,
    injuries: 5
});

// Talatona
addDangerZone(-8.8550, 13.5000, 'medium', {
    assaults: 2,
    weapons: false,
    injuries: 1
});

// Zango 1
addDangerZone(-9.014007699999999, 13.3991666, 'medium', {
    assaults: 6,
    weapons: false,
    injuries: 3
});

// Zango 2
addDangerZone(-8.8400, 13.4200, 'high', {
    assaults: 9,
    weapons: true,
    injuries: 4
});

// Zango 3
addDangerZone(-8.8300, 13.4400, 'medium', {
    assaults: 4,
    weapons: false,
    injuries: 2
});
}

function updateUserLocation(lat, lng) {
    if (!userMarker) {
        userMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'data:image/svg+xml;base64,' + btoa(`
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#00b894" viewBox="0 0 16 16">
                    <path d="M8 0a8 8 0 1 0 8 8A8.009 8.009 0 0 0 8 0zm0 15A7 7 0 1 1 15 8a7.008 7.008 0 0 1-7 7z"/>
                    <path d="M8 4a3 3 0 1 1-3 3A3 3 0 0 1 8 4z"/>
                </svg>
                `),
                iconSize: [30, 30],
                iconAnchor: [15, 30],
                popupAnchor: [0, -30]
            })
        }).addTo(map);
        userCircle = L.circle([lat, lng], {
            color: '#00b894',
            fillColor: '#00b894',
            fillOpacity: 0.2,
            radius: 100
        }).addTo(map);
        map.setView([lat, lng]);
    } else {
        userMarker.setLatLng([lat, lng]);
        userCircle.setLatLng([lat, lng]);
    }
}

function addDangerZone(lat, lng, risk, stats) {
    const radius = 300;
    const color = risk === 'high' ? '#d63031' : '#fbc531';
    
    const circle = L.circle([lat, lng], {
        color: color,
        fillColor: color,
        fillOpacity: 0.3,
        radius: radius
    }).addTo(map);

    circle.bindPopup(`
        <h3>Estatísticas da Área</h3>
        <p>Assaltos: ${stats.assaults}</p>
        <p>Presença de armas: ${stats.weapons ? 'Sim' : 'Não'}</p>
        <p>Feridos: ${stats.injuries}</p>
    `);

    dangerZones.push({
        lat,
        lng,
        radius,
        risk
    });
}

function checkDangerZones(userLat, userLng) {
    for (const zone of dangerZones) {
        const distance = calculateDistance(userLat, userLng, zone.lat, zone.lng);
        if (distance <= zone.radius + 100) { // 100m buffer
            showNotification();
            break;
        }
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
}

function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 5000);
}



// Inicializar o mapa quando a página carregar
window.addEventListener('load', initMap);
