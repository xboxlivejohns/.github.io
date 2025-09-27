(function(){
  const form = document.querySelector('form[action^="https://formsubmit.co/"]');
  if (!form || typeof vehicleDatabase !== 'object') return;

  const datesInput = form.querySelector('#dates');
  const datesLabel = form.querySelector('label[for="dates"]');
  if (!datesInput || !datesLabel) return;

  const submitButton = form.querySelector('button[type="submit"]');
  if (!submitButton) return;

  const hiddenSizeInput = document.createElement('input');
  hiddenSizeInput.type = 'hidden';
  hiddenSizeInput.name = 'vehicle_size_category';
  form.appendChild(hiddenSizeInput);

  datesLabel.classList.add('sr-only');
  datesInput.type = 'hidden';
  datesInput.setAttribute('aria-hidden', 'true');
  datesInput.setAttribute('tabindex', '-1');
  datesInput.style.display = 'none';

  const bookingFlow = document.createElement('div');
  bookingFlow.className = 'booking-flow card';

  const stepOne = document.createElement('section');
  stepOne.className = 'booking-step is-active';
  stepOne.innerHTML = `
    <h3>Step 1: Confirm vehicle size</h3>
    <p class="muted">Choose your vehicle so we can match it to the correct preparation window.</p>
    <div class="booking-grid">
      <div class="booking-field">
        <label for="bookingMake">Make</label>
        <select id="bookingMake" aria-describedby="bookingMakeHelp">
          <option value="">Select make</option>
        </select>
        <small id="bookingMakeHelp" class="muted">Start typing to jump to your manufacturer.</small>
      </div>
      <div class="booking-field">
        <label for="bookingModel">Model</label>
        <select id="bookingModel" disabled>
          <option value="">Select model</option>
        </select>
      </div>
      <div class="booking-field">
        <label for="bookingYear">Model year</label>
        <select id="bookingYear" disabled>
          <option value="">Select year / generation</option>
        </select>
      </div>
    </div>
    <div class="booking-size-summary" aria-live="polite"></div>
    <div class="booking-actions">
      <button type="button" class="btn btn-primary" id="bookingNext" disabled>Confirm size &amp; continue</button>
    </div>
  `;

  const stepTwo = document.createElement('section');
  stepTwo.className = 'booking-step';
  stepTwo.innerHTML = `
    <h3>Step 2: Packages &amp; schedule</h3>
    <div class="booking-size-recap"></div>
    <div class="booking-packages"></div>
    <div class="booking-grid">
      <div class="booking-field">
        <label for="bookingDate">Preferred date</label>
        <input type="date" id="bookingDate" name="bookingDate">
      </div>
      <div class="booking-field">
        <label for="bookingTime">Preferred start time</label>
        <input type="time" id="bookingTime" name="bookingTime">
      </div>
      <div class="booking-field">
        <label for="bookingAltDate">Alternate date <span class="muted">(optional)</span></label>
        <input type="date" id="bookingAltDate" name="bookingAltDate">
      </div>
      <div class="booking-field">
        <label for="bookingAltTime">Alternate start time <span class="muted">(optional)</span></label>
        <input type="time" id="bookingAltTime" name="bookingAltTime">
      </div>
    </div>
    <div class="booking-status" role="status" aria-live="polite"></div>
    <div class="booking-actions">
      <button type="button" class="btn btn-outline" id="bookingBack">Back</button>
      <button type="button" class="btn btn-primary" id="bookingSchedule" disabled>Save schedule</button>
    </div>
  `;

  bookingFlow.append(stepOne, stepTwo);
  datesInput.insertAdjacentElement('beforebegin', bookingFlow);

  const makeSelect = stepOne.querySelector('#bookingMake');
  const modelSelect = stepOne.querySelector('#bookingModel');
  const yearSelect = stepOne.querySelector('#bookingYear');
  const sizeSummary = stepOne.querySelector('.booking-size-summary');
  const nextButton = stepOne.querySelector('#bookingNext');

  const sizeRecap = stepTwo.querySelector('.booking-size-recap');
  const packagesContainer = stepTwo.querySelector('.booking-packages');
  const bookingStatus = stepTwo.querySelector('.booking-status');
  const backButton = stepTwo.querySelector('#bookingBack');
  const scheduleButton = stepTwo.querySelector('#bookingSchedule');
  const dateField = stepTwo.querySelector('#bookingDate');
  const timeField = stepTwo.querySelector('#bookingTime');
  const altDateField = stepTwo.querySelector('#bookingAltDate');
  const altTimeField = stepTwo.querySelector('#bookingAltTime');

  const state = {
    make: '',
    model: '',
    year: '',
    category: '',
    sizeConfirmed: false,
    date: '',
    time: '',
    altDate: '',
    altTime: '',
    scheduleConfirmed: false
  };

  submitButton.disabled = true;

  const packageDetails = {
    'Small Car': {
      title: 'Small car — city hatchbacks',
      bullets: [
        'Typical prep + ceramic: 1 full day turnaround',
        'Correction detail from £450 depending on paintwork',
        'Maintenance valeting slots approx. 2.5 hours'
      ]
    },
    'Medium Car': {
      title: 'Medium car — family hatchbacks & saloons',
      bullets: [
        'Allow 1-1.5 days for full correction & coating',
        'Enhancement detail from £495',
        'Interior deep clean typically half-day'
      ]
    },
    'Large Car': {
      title: 'Large car — tourers & executive saloons',
      bullets: [
        'Two-day booking recommended for multi-stage correction',
        'Ceramic protection from £595',
        'Interior refresh ~4 hours'
      ]
    },
    'Small SUV': {
      title: 'Small SUV / crossover',
      bullets: [
        'Plan for 1.5 days for coating packages',
        'Paint enhancement from £525',
        'Interior + exterior valeting about 3 hours'
      ]
    },
    'SUV': {
      title: 'SUV — mid-size',
      bullets: [
        'Two-day slot ideal for full correction & coating',
        'Enhancement detail from £550',
        'Maintenance wash packages from £90'
      ]
    },
    'Large SUV': {
      title: 'Large SUV / 7-seater',
      bullets: [
        'Book 2-3 days for full correction and ceramic',
        'Signature coating from £695',
        'Deep interior detail approx. 5 hours'
      ]
    },
    'Pickup': {
      title: 'Pickup trucks',
      bullets: [
        'Two-day slot recommended for full exterior + bed',
        'Protective coatings from £650',
        'Interior detail approx. 4 hours'
      ]
    },
    'Small Van': {
      title: 'Small van',
      bullets: [
        'Day-and-a-half typically required for coatings',
        'Enhancement detail from £575',
        'Fleet maintenance wash plans available'
      ]
    },
    'Medium Van': {
      title: 'Medium van',
      bullets: [
        'Two-day slot for correction + ceramic',
        'Protective packages from £625',
        'Interior sanitation approx. 5 hours'
      ]
    },
    'Large Van': {
      title: 'Large van / LWB',
      bullets: [
        'Multi-day slot recommended for full correction',
        'Coating packages from £725',
        'Fleet refresh service tailored on request'
      ]
    }
  };

  function populateSelect(select, options, placeholder){
    select.innerHTML = '';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = placeholder;
    select.appendChild(defaultOption);
    options.forEach(value => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = value;
      select.appendChild(opt);
    });
  }

  function updateSizeSummary(){
    if (state.category) {
      sizeSummary.innerHTML = `<div class="booking-summary-card"><strong>${state.category}</strong> — ready to continue.</div>`;
      nextButton.disabled = false;
    } else if (state.model) {
      sizeSummary.innerHTML = '<div class="booking-summary-card muted">Select the model year to confirm the size.</div>';
      nextButton.disabled = true;
    } else {
      sizeSummary.innerHTML = '<div class="booking-summary-card muted">Choose make and model to see size guidance.</div>';
      nextButton.disabled = true;
    }
  }

  function showStep(step){
    if (step === 'size') {
      stepOne.classList.add('is-active');
      stepTwo.classList.remove('is-active');
    } else {
      stepTwo.classList.add('is-active');
      stepOne.classList.remove('is-active');
    }
  }

  function formatDate(dateValue){
    if (!dateValue) return '';
    const [year, month, day] = dateValue.split('-');
    return `${day}/${month}/${year}`;
  }

  function applyPackageDetails(){
    const details = packageDetails[state.category] || null;
    if (!details) {
      packagesContainer.innerHTML = '<p class="muted">We will tailor the package to your vehicle size.</p>';
      return;
    }

    const listItems = details.bullets.map(item => `<li>${item}</li>`).join('');
    packagesContainer.innerHTML = `
      <div class="booking-package">
        <h4>${details.title}</h4>
        <ul>${listItems}</ul>
      </div>
    `;
  }

  function updateRecap(){
    sizeRecap.innerHTML = `
      <div class="booking-summary-card">
        <strong>${state.category}</strong>
        <div class="muted">${state.make} ${state.model}${state.year ? ' • ' + state.year : ''}</div>
      </div>
    `;
    applyPackageDetails();
  }

  function updateSubmitAvailability(){
    const ready = state.sizeConfirmed && state.scheduleConfirmed && state.date && state.time;
    submitButton.disabled = !ready;
  }

  function resetScheduleConfirmation(){
    state.scheduleConfirmed = false;
    bookingStatus.textContent = '';
    scheduleButton.textContent = 'Save schedule';
    scheduleButton.classList.remove('booking-button-saved');
    scheduleButton.disabled = !(dateField.value && timeField.value);
    updateSubmitAvailability();
  }

  populateSelect(makeSelect, Object.keys(vehicleDatabase).sort(), 'Select make');
  updateSizeSummary();

  makeSelect.addEventListener('change', () => {
    state.make = makeSelect.value;
    state.model = '';
    state.year = '';
    state.category = '';
    hiddenSizeInput.value = '';
    state.sizeConfirmed = false;
    if (state.make) {
      const models = Object.keys(vehicleDatabase[state.make]).sort();
      populateSelect(modelSelect, models, 'Select model');
      modelSelect.disabled = false;
    } else {
      populateSelect(modelSelect, [], 'Select model');
      modelSelect.disabled = true;
    }
    populateSelect(yearSelect, [], 'Select year / generation');
    yearSelect.disabled = true;
    updateSizeSummary();
    showStep('size');
    resetScheduleConfirmation();
  });

  modelSelect.addEventListener('change', () => {
    state.model = modelSelect.value;
    state.year = '';
    state.category = '';
    hiddenSizeInput.value = '';
    state.sizeConfirmed = false;
    if (state.make && state.model) {
      const years = Object.keys(vehicleDatabase[state.make][state.model]).sort().reverse();
      populateSelect(yearSelect, years, 'Select year / generation');
      yearSelect.disabled = false;
    } else {
      populateSelect(yearSelect, [], 'Select year / generation');
      yearSelect.disabled = true;
    }
    updateSizeSummary();
    showStep('size');
    resetScheduleConfirmation();
  });

  yearSelect.addEventListener('change', () => {
    state.year = yearSelect.value;
    if (state.make && state.model && state.year) {
      const spec = vehicleDatabase[state.make][state.model][state.year];
      state.category = spec && spec.category ? spec.category : '';
    } else {
      state.category = '';
    }
    state.sizeConfirmed = false;
    hiddenSizeInput.value = '';
    updateSizeSummary();
    showStep('size');
    resetScheduleConfirmation();
  });

  nextButton.addEventListener('click', () => {
    if (!state.category) return;
    state.sizeConfirmed = true;
    hiddenSizeInput.value = state.category;
    updateRecap();
    showStep('schedule');
    bookingStatus.textContent = 'Select your preferred date and time, then save the schedule.';
    scheduleButton.disabled = !(dateField.value && timeField.value);
    updateSubmitAvailability();
  });

  backButton.addEventListener('click', () => {
    showStep('size');
    state.sizeConfirmed = false;
    hiddenSizeInput.value = '';
    resetScheduleConfirmation();
    updateSubmitAvailability();
  });

  function buildScheduleSummary(){
    const primary = `${formatDate(state.date)}${state.time ? ' at ' + state.time : ''}`;
    let alt = '';
    if (state.altDate || state.altTime) {
      const altDate = formatDate(state.altDate);
      alt = `${altDate || 'Flexible date'}${state.altTime ? ' at ' + state.altTime : ''}`;
    }
    return alt ? `Primary: ${primary} | Alternate: ${alt}` : `Primary: ${primary}`;
  }

  function handleScheduleButton(){
    if (!dateField.value || !timeField.value) {
      bookingStatus.innerHTML = '<span class="booking-error">Choose a date and start time to continue.</span>';
      state.scheduleConfirmed = false;
      updateSubmitAvailability();
      return;
    }

    state.date = dateField.value;
    state.time = timeField.value;
    state.altDate = altDateField.value;
    state.altTime = altTimeField.value;
    state.scheduleConfirmed = true;

    const scheduleSummary = buildScheduleSummary();
    datesInput.value = scheduleSummary;
    bookingStatus.innerHTML = `<span class="booking-success">Schedule saved: ${scheduleSummary}</span>`;
    scheduleButton.textContent = 'Schedule saved';
    scheduleButton.classList.add('booking-button-saved');
    updateSubmitAvailability();
  }

  scheduleButton.addEventListener('click', handleScheduleButton);

  [dateField, timeField, altDateField, altTimeField].forEach(field => {
    field.addEventListener('input', () => {
      scheduleButton.textContent = 'Save schedule';
      scheduleButton.classList.remove('booking-button-saved');
      scheduleButton.disabled = !(dateField.value && timeField.value);
      if (field === dateField || field === timeField) {
        state.date = dateField.value;
        state.time = timeField.value;
      }
      if (field === altDateField || field === altTimeField) {
        state.altDate = altDateField.value;
        state.altTime = altTimeField.value;
      }
      resetScheduleConfirmation();
    });
  });

  form.addEventListener('submit', (event) => {
    if (submitButton.disabled) {
      event.preventDefault();
      bookingStatus.innerHTML = '<span class="booking-error">Please confirm vehicle size and save your schedule before sending.</span>';
    }
  });
})();
