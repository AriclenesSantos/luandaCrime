const REGIONS = ['Cazenga', 'Viana', 'Rangel', 'Talatona', 'Zango 1', 'Zango 2', 'Zango 3'];

const CRIME_TYPES = [
  'Homicídio', 'Latrocínio', 'Sequestro', 'Lesão corporal grave', 'Tentativa de homicídio',
  'Violência doméstica', 'Tráfico de pessoas', 'Ameaça de morte', 'Crimes de gangues',
  'Assassinato por encomenda', 'Explosões', 'Incêndios criminosos', 'Tráfico de drogas',
  'Assaltos armados', 'Crimes de ódio', 'Roubos em residências', 'Violação',
  'Desaparecimento forçado', 'Crimes relacionados a armas', 'Tráfico de órgãos'
];

class RegistrationFlow {
  constructor() {
    this.currentStep = 'initial-step';
    this.registrationData = {
      region: '',
      location: '',
      crimeType: '',
      weapons: {
        present: false,
        firearms: 0,
        meleeWeapons: 0
      },
      casualties: {
        present: false,
        deaths: 0,
        injured: 0
      },
      additionalArgs: ''
    };
    
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // Start registration button
    document.getElementById('start-registration').addEventListener('click', () => {
      this.showStep('region-step');
    });

    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', () => {
      document.body.dataset.theme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
    });

    // Navigation buttons
    document.querySelectorAll('[data-action]').forEach(button => {
      button.addEventListener('click', (e) => {
        const action = e.target.dataset.action;
        if (action === 'back') this.previousStep();
        if (action === 'next') this.nextStep();
        if (action === 'finish') this.finishRegistration();
      });
    });

    // Search inputs
    this.initializeSearch('region-search', 'region-results', REGIONS);
    this.initializeSearch('crime-search', 'crime-results', CRIME_TYPES);

    // Location input char counter
    const locationInput = document.getElementById('location-input');
    locationInput.addEventListener('input', () => {
      document.getElementById('location-char-count').textContent = locationInput.value.length;
      this.registrationData.location = locationInput.value;
      this.enableNextButton();
    });

    // Weapons form
    document.querySelectorAll('input[name="weapons-present"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const weaponsDetails = document.querySelector('.weapons-details');
        weaponsDetails.classList.toggle('hidden', e.target.value === 'no');
        this.registrationData.weapons.present = e.target.value === 'yes';
      });
    });

    // Casualties form
    document.querySelectorAll('input[name="casualties-present"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const casualtiesDetails = document.querySelector('.casualties-details');
        casualtiesDetails.classList.toggle('hidden', e.target.value === 'no');
        this.registrationData.casualties.present = e.target.value === 'yes';
      });
    });

    // Character counter for additional arguments
    const textarea = document.getElementById('additional-args');
    textarea.addEventListener('input', () => {
      document.getElementById('char-count').textContent = textarea.value.length;
    });

    // Modal OK button
    document.getElementById('modal-ok').addEventListener('click', () => {
      this.resetForm();
    });
  }

  initializeSearch(inputId, resultsId, items) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);
    
    input.addEventListener('input', () => {
      const searchTerm = input.value.toLowerCase();
      const filtered = items.filter(item => 
        item.toLowerCase().includes(searchTerm)
      );
      
      this.updateSearchResults(results, filtered, inputId === 'region-search');
    });
  }

  updateSearchResults(container, items, isRegion) {
    container.innerHTML = '';
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.textContent = item;
      div.addEventListener('click', () => {
        if (isRegion) {
          this.registrationData.region = item;
          document.getElementById('region-search').value = item;
        } else {
          this.registrationData.crimeType = item;
          document.getElementById('crime-search').value = item;
        }
        container.innerHTML = '';
        this.enableNextButton();
      });
      container.appendChild(div);
    });
  }

  showStep(stepId) {
    document.querySelectorAll('.registration-step').forEach(step => {
      step.classList.add('hidden');
    });
    document.getElementById(stepId).classList.remove('hidden');
    this.currentStep = stepId;
  }

  previousStep() {
    const steps = ['initial-step', 'region-step', 'crime-type-step', 'weapons-step', 'casualties-step', 'arguments-step'];
    const currentIndex = steps.indexOf(this.currentStep);
    if (currentIndex > 0) {
      this.showStep(steps[currentIndex - 1]);
    }
  }

  nextStep() {
    const steps = ['initial-step', 'region-step', 'crime-type-step', 'weapons-step', 'casualties-step', 'arguments-step'];
    const currentIndex = steps.indexOf(this.currentStep);
    if (currentIndex < steps.length - 1) {
      this.showStep(steps[currentIndex + 1]);
    }
  }

  enableNextButton() {
    const currentStepElement = document.getElementById(this.currentStep);
    const nextButton = currentStepElement.querySelector('[data-action="next"]');
    if (nextButton) {
      if (this.currentStep === 'region-step') {
        nextButton.disabled = !(this.registrationData.region && this.registrationData.location);
      } else {
        nextButton.disabled = false;
      }
    }
  }

  async finishRegistration() {
    // Collect final data
    if (this.registrationData.weapons.present) {
      this.registrationData.weapons.firearms = parseInt(document.getElementById('firearms-quantity').value) || 0;
      this.registrationData.weapons.meleeWeapons = parseInt(document.getElementById('melee-weapons-quantity').value) || 0;
    }
    
    if (this.registrationData.casualties.present) {
      this.registrationData.casualties.deaths = parseInt(document.getElementById('deaths-quantity').value) || 0;
      this.registrationData.casualties.injured = parseInt(document.getElementById('injured-quantity').value) || 0;
    }
    this.registrationData.additionalArgs = document.getElementById('additional-args').value;
    
    try {
      // Add user_id to the registration data (you should get this from your authentication system)
      this.registrationData.user_id = 1; // Example user ID

      const response = await fetch('register_crime.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.registrationData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Show success modal
        document.getElementById('success-modal').classList.remove('hidden');
      } else {
        alert('Error registering crime: ' + result.message);
      }
    } catch (error) {
      alert('Error registering crime: ' + error.message);
    }
  }

  resetForm() {
    // Reset all form data
    this.registrationData = {
      region: '',
      location: '',
      crimeType: '',
      weapons: {
        present: false,
        firearms: 0,
        meleeWeapons: 0
      },
      casualties: {
        present: false,
        deaths: 0,
        injured: 0
      },
      additionalArgs: ''
    };
    
    // Reset all inputs
    document.querySelectorAll('input').forEach(input => {
      if (input.type === 'text' || input.type === 'number') input.value = '';
      if (input.type === 'radio' || input.type === 'checkbox') input.checked = false;
    });
    
    document.getElementById('additional-args').value = '';
    document.getElementById('char-count').textContent = '0';
    document.getElementById('location-input').value = '';
    document.getElementById('location-char-count').textContent = '0';
    
    // Hide modal and return to initial step
    document.getElementById('success-modal').classList.add('hidden');
    this.showStep('initial-step');
  }
}

// Initialize the registration flow when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  new RegistrationFlow();
});