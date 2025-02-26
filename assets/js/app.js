// Theme toggle functionality
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', () => {
  document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
});

// Period selector with data updates
const periodButtons = document.querySelectorAll('.period-selector button');
const periodData = {
  '7 Dias': {
    total: 2847,
    violent: 976,
    critical: 142,
    zoneDistribution: [320, 250, 180, 290, 220, 190, 170],
    timeEvolution: {
      violent: [150, 180, 160, 190, 170, 200, 210],
      other: [280, 250, 270, 240, 260, 230, 220]
    },
    crimeTypes: [15, 12, 8, 25, 30, 10]
  },
  '30 Dias': {
    total: 3562,
    violent: 1234,
    critical: 198,
    zoneDistribution: [420, 380, 290, 350, 310, 270, 240],
    timeEvolution: {
      violent: [180, 200, 190, 210, 195, 215, 205],
      other: [310, 290, 300, 280, 295, 285, 305]
    },
    crimeTypes: [18, 15, 10, 28, 35, 12]
  },
  '6 Meses': {
    total: 15780,
    violent: 5430,
    critical: 876,
    zoneDistribution: [2100, 1800, 1500, 1900, 1700, 1600, 1400],
    timeEvolution: {
      violent: [800, 850, 900, 870, 920, 890],
      other: [1500, 1450, 1550, 1480, 1520, 1490]
    },
    crimeTypes: [20, 18, 12, 30, 38, 15]
  }
};

periodButtons.forEach(button => {
  button.addEventListener('click', () => {
    periodButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');
    updateDashboard(button.textContent);
  });
});

// Chart configurations
const chartConfigs = {
  zoneDistribution: {
    type: 'bar',
    data: {
      labels: ['Cazenga', 'Viana', 'Rangel', 'Talatona', 'Zango 1', 'Zango 2', 'Zango 3'],
      datasets: [{
        label: 'Ocorrências',
        data: [320, 250, 180, 290, 220, 190, 170],
        backgroundColor: '#0052cc',
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            maxTicksLimit: 8
          }
        }
      }
    }
  },
  
  timeEvolution: {
    type: 'line',
    data: {
      labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
      datasets: [{
        label: 'Crimes Violentos',
        data: [150, 180, 160, 190, 170, 200],
        borderColor: '#ff4444',
        tension: 0.4
      }, {
        label: 'Outros Crimes',
        data: [280, 250, 270, 240, 260, 230],
        borderColor: '#ffd700',
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            maxTicksLimit: 8
          }
        }
      }
    }
  },
  
  crimeTypes: {
    type: 'doughnut',
    data: {
      labels: ['Homicídio', 'Latrocínio', 'Sequestro', 'Lesão Corporal', 'Violência Doméstica', 'Outros'],
      datasets: [{
        data: [15, 12, 8, 25, 30, 10],
        backgroundColor: [
          '#ff4444',
          '#ffd700',
          '#0052cc',
          '#32cd32',
          '#9370db',
          '#20b2aa'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right'
        }
      }
    }
  }
};

// Initialize charts
const charts = {};
Object.entries(chartConfigs).forEach(([id, config]) => {
  const ctx = document.getElementById(id)?.getContext('2d');
  if (ctx) {
    charts[id] = new Chart(ctx, config);
  }
});

function updateDashboard(period) {
  const data = periodData[period];
  
  // Update metric cards
  document.querySelector('.total .number').textContent = data.total.toLocaleString();
  document.querySelector('.violent .number').textContent = data.violent.toLocaleString();
  document.querySelector('.critical .number').textContent = data.critical.toLocaleString();
  
  // Update charts
  charts.zoneDistribution.data.datasets[0].data = data.zoneDistribution;
  charts.zoneDistribution.update();
  
  charts.timeEvolution.data.datasets[0].data = data.timeEvolution.violent;
  charts.timeEvolution.data.datasets[1].data = data.timeEvolution.other;
  charts.timeEvolution.update();
  
  charts.crimeTypes.data.datasets[0].data = data.crimeTypes;
  charts.crimeTypes.update();
}

// Initialize with 7 days data
updateDashboard('7 Dias');

// Simple zone map visualization
const zoneMap = document.getElementById('zoneMap');
const zones = ['Cazenga', 'Viana', 'Rangel', 'Talatona', 'Zango 1', 'Zango 2', 'Zango 3'];

function createZoneMap() {
  const mapSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  mapSvg.setAttribute("viewBox", "0 0 800 600");
  mapSvg.style.width = "100%";
  mapSvg.style.height = "100%";

  zones.forEach((zone, index) => {
    const x = (index % 3) * 250 + 50;
    const y = Math.floor(index / 3) * 200 + 50;
    
    const zoneGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const zoneShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const pathData = `M ${x},${y} l 200,0 l -20,150 l -160,0 z`;
    zoneShape.setAttribute("d", pathData);
    zoneShape.setAttribute("fill", "#0052cc");
    zoneShape.setAttribute("fill-opacity", "0.2");
    zoneShape.setAttribute("stroke", "#0052cc");
    zoneShape.setAttribute("stroke-width", "2");
    
    const zoneText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    zoneText.textContent = zone;
    zoneText.setAttribute("x", x + 100);
    zoneText.setAttribute("y", y + 75);
    zoneText.setAttribute("text-anchor", "middle");
    zoneText.setAttribute("fill", "#333");
    
    zoneGroup.appendChild(zoneShape);
    zoneGroup.appendChild(zoneText);
    
    zoneGroup.addEventListener('click', () => showZoneDetails(zone));
    zoneGroup.style.cursor = 'pointer';
    
    mapSvg.appendChild(zoneGroup);
  });
  
  zoneMap.appendChild(mapSvg);
}

function showZoneDetails(zone) {
  const zoneDetails = document.getElementById('zoneDetails');
  zoneDetails.innerHTML = `
    <h3>${zone}</h3>
    <div class="zone-stats">
      <p>Total de ocorrências: ${Math.floor(Math.random() * 100 + 50)}</p>
      <p>Crimes violentos: ${Math.floor(Math.random() * 30 + 10)}</p>
      <p>Índice de risco: ${Math.floor(Math.random() * 100)}%</p>
    </div>
  `;
}

createZoneMap();