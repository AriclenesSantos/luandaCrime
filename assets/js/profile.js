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

  async loadUserReports() {
    try {
      // You should get the user_id from your authentication system
      const userId = 1; // Example user ID
      
      const response = await fetch(`get_user_reports.php?user_id=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        this.renderReports(data.reports);
      } else {
        console.error('Error loading reports:', data.message);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  }

  renderReports(reports) {
    const reportsList = document.getElementById('reports-list');
    reportsList.innerHTML = reports.map(report => this.createReportCard(report)).join('');
  }

  createReportCard(report) {
    return `
      <div class="report-card">
        <div class="report-header">
          <span class="report-type">${report.crime_type}</span>
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
          ${report.weapons_present ? `
            <div class="report-detail-item">
              <span class="report-detail-label">Armas</span>
              <span class="report-detail-value">
                ${report.firearms_count} arma(s) de fogo
                ${report.melee_weapons_count} arma(s) branca(s)
              </span>
            </div>
          ` : ''}
          <div class="report-detail-item">
            <span class="report-detail-label">Vítimas</span>
            <span class="report-detail-value">
              ${report.deaths_count} morte(s), ${report.injured_count} ferido(s)
            </span>
          </div>
        </div>
        ${report.additional_args ? `
          <div class="report-arguments">
            <span class="report-detail-label">Argumentos Adicionais</span>
            <p>${report.additional_args}</p>
          </div>
        ` : ''}
      </div>
    `;
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  filterReports(searchTerm, filterType) {
    // Implementation for filtering reports
    // This would filter the actual reports based on search term and type
    console.log(`Filtering reports: ${searchTerm}, ${filterType}`);
  }
}

// Initialize profile manager when document is ready
document.addEventListener('DOMContentLoaded', () => {
  new ProfileManager();
});