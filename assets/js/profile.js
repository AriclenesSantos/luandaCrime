class ProfileManager {
  constructor() {
    this.initializeEventListeners();
    this.loadUserReports();
  }

  initializeEventListeners() {
    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    // Avatar upload
    const avatarUpload = document.getElementById('avatar-upload');
    avatarUpload.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          document.getElementById('profile-image').src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Search and filter
    document.getElementById('search-reports').addEventListener('input', (e) => {
      this.filterReports(e.target.value, document.getElementById('filter-type').value);
    });

    document.getElementById('filter-type').addEventListener('change', (e) => {
      this.filterReports(document.getElementById('search-reports').value, e.target.value);
    });
  }

    loadUserReports() {
      console.log('Loading user reports from Local Storage...');
      const reports = JSON.parse(localStorage.getItem('crimeReports')) || [];
      console.log(`Reports loaded: ${reports.length} report(s)`);
      this.renderReports(reports);

  }

  renderReports(reports) {
    const reportsList = document.getElementById('reports-list');
    reportsList.innerHTML = reports.map(report => this.createReportCard(report)).join('');
  }

  createReportCard(report) {
    return `
      <div class="report-card">
        <div class="report-header">
          <span class="report-type">${report.crimeType}</span>
          <span class="report-date">${this.formatDate(report.created_at)}</span>
        </div>
        <div class="report-details">
          <div class="report-detail-item">
            <span class="report-detail-label">Região</span>
            <span class="report-detail-value">${report.region}</span>
          </div>
          <div class="report-detail-item">
            <span class="report-detail-label">Local</span>
            <span class="report-detail-value">${report.location}</span>
          </div>
          ${report.weapons ? `
            <div class="report-detail-item">
              <span class="report-detail-label">Armas</span>
              <span class="report-detail-value">
                ${report.weapons.firearms} arma(s) de fogo
                ${report.weapons.meleeWeapons} arma(s) branca(s)
              </span>
            </div>
          ` : ''}
          <div class="report-detail-item">
            <span class="report-detail-label">Vítimas</span>
            <span class="report-detail-value">
              ${report.casualties.deaths} morte(s), ${report.casualties.injured
              } ferido(s)
            </span>
          </div>
        </div>
        ${report.additionalArgs ? `
          <div class="report-arguments">
            <span class="report-detail-label">Argumentos Adicionais</span>
            <p>${report.additionalArgs}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error(`Invalid date value: ${dateString}`);
      return 'Data inválida';
    }
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  filterReports(searchTerm, filterType) {
    const reports = JSON.parse(localStorage.getItem('crimeReports')) || [];
    const filteredReports = reports.filter(report => {
      const matchesSearchTerm = report.crime_type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilterType = filterType === 'all' || report.crime_type.toLowerCase() === filterType;
      return matchesSearchTerm && matchesFilterType;
    });
    this.renderReports(filteredReports);
  }
}

// Initialize profile manager when document is ready
document.addEventListener('DOMContentLoaded', () => {
  new ProfileManager();
});
