(function () {
  const form = document.querySelector('[data-booking-form]');
  if (!form || typeof vehicleDatabase === 'undefined') {
    return;
  }

  const makeSelect = form.querySelector('#vehicleMake');
  const modelSelect = form.querySelector('#vehicleModel');
  const variantSelect = form.querySelector('#vehicleVariant');
  const conditionSelect = form.querySelector('#vehicleCondition');
  const packageSelect = form.querySelector('#servicePackage');
  const serviceSelect = form.querySelector('#service');
  const addonList = form.querySelector('[data-addon-list]');
  const totalDisplay = form.querySelector('[data-total-display]');
  const totalNote = form.querySelector('[data-total-note]');
  const totalBase = form.querySelector('[data-total-base]');
  const totalCondition = form.querySelector('[data-total-condition]');
  const totalExtras = form.querySelector('[data-total-extras]');
  const defaultTotalNote = totalNote ? totalNote.textContent : '';
  const categoryDisplay = form.querySelector('#vehicleCategoryDisplay');

  const hiddenMake = form.querySelector('#vehicleMakeHidden');
  const hiddenModel = form.querySelector('#vehicleModelHidden');
  const hiddenVariant = form.querySelector('#vehicleVariantHidden');
  const hiddenCategory = form.querySelector('#vehicleCategoryHidden');
  const hiddenCondition = form.querySelector('#vehicleConditionHidden');
  const hiddenPackage = form.querySelector('#servicePackageHidden');
  const hiddenExtras = form.querySelector('#selectedExtrasHidden');
  const hiddenTotal = form.querySelector('#calculatedTotalHidden');

  if (
    !makeSelect ||
    !modelSelect ||
    !variantSelect ||
    !conditionSelect ||
    !packageSelect ||
    !serviceSelect ||
    !addonList ||
    !totalDisplay ||
    !totalBase ||
    !totalCondition ||
    !totalExtras ||
    !categoryDisplay ||
    !hiddenMake ||
    !hiddenModel ||
    !hiddenVariant ||
    !hiddenCategory ||
    !hiddenCondition ||
    !hiddenPackage ||
    !hiddenExtras ||
    !hiddenTotal
  ) {
    return;
  }

  const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
  };

  const pricingConfig = {
    packages: [
      {
        id: 'maintenance-valet',
        label: 'Maintenance valet (exterior & interior)',
        service: 'Valeting / Interior',
        description: '2-3 hour maintenance detail ideal for well-kept cars.',
        pricing: {
          'Small Car': 55,
          'Medium Car': 65,
          'Large Car': 75,
          'Small SUV': 80,
          SUV: 85,
          Van: 110,
          default: 70,
        },
      },
      {
        id: 'deep-clean-valet',
        label: 'Deep clean valet + gloss boost',
        service: 'Valeting / Interior',
        description: 'Full interior shampoo, steam clean and machine glaze.',
        pricing: {
          'Small Car': 95,
          'Medium Car': 110,
          'Large Car': 125,
          'Small SUV': 130,
          SUV: 145,
          Van: 170,
          default: 120,
        },
      },
      {
        id: 'single-stage-correction',
        label: 'Single-stage paint correction',
        service: 'Paint correction',
        description: 'Enhancement polish to remove light swirls and restore gloss.',
        pricing: {
          'Small Car': 220,
          'Medium Car': 260,
          'Large Car': 300,
          'Small SUV': 310,
          SUV: 340,
          Van: 380,
          default: 280,
        },
      },
      {
        id: 'two-stage-ceramic',
        label: 'Two-stage correction + 2yr ceramic',
        service: 'Ceramic coating (polish included)',
        description: 'Heavy correction, panel wipe and 2-year ceramic coating.',
        pricing: {
          'Small Car': 420,
          'Medium Car': 470,
          'Large Car': 520,
          'Small SUV': 540,
          SUV: 580,
          Van: 650,
          default: 480,
        },
      },
      {
        id: 'ppf-front',
        label: 'PPF partial front (bumper, bonnet, wings, mirrors)',
        service: 'PPF',
        description: 'Stone-chip protection film for the most exposed panels.',
        pricing: {
          'Small Car': 650,
          'Medium Car': 700,
          'Large Car': 780,
          'Small SUV': 780,
          SUV: 840,
          Van: 900,
          default: 720,
        },
      },
    ],
    conditionMultipliers: {
      Excellent: 1,
      Good: 1.08,
      'Needs correction': 1.18,
      'Severe correction': 1.35,
      default: 1,
    },
    extras: [
      {
        id: 'glass-coating',
        label: 'Glass coating (windscreen & fronts)',
        pricing: {
          'Small Car': 45,
          'Medium Car': 45,
          'Large Car': 50,
          'Small SUV': 50,
          SUV: 55,
          Van: 55,
          default: 45,
        },
      },
      {
        id: 'wheel-coating',
        label: 'Wheel face ceramic upgrade',
        pricing: {
          default: 60,
        },
      },
      {
        id: 'interior-protectant',
        label: 'Fabric & leather protection',
        pricing: {
          'Small Car': 60,
          'Medium Car': 65,
          'Large Car': 70,
          'Small SUV': 70,
          SUV: 75,
          Van: 80,
          default: 65,
        },
      },
      {
        id: 'engine-bay',
        label: 'Engine bay detail',
        pricing: {
          Van: 45,
          default: 35,
        },
      },
      {
        id: 'clay-bar',
        label: 'Clay bar & tar removal',
        pricing: {
          'Small Car': 40,
          'Medium Car': 45,
          'Large Car': 50,
          'Small SUV': 50,
          SUV: 55,
          Van: 60,
          default: 45,
        },
      },
    ],
  };

  const resolvePrice = (pricingMap, category) => {
    if (!pricingMap) {
      return 0;
    }
    if (category && Object.prototype.hasOwnProperty.call(pricingMap, category)) {
      return pricingMap[category];
    }
    if (Object.prototype.hasOwnProperty.call(pricingMap, 'default')) {
      return pricingMap.default;
    }
    const firstKey = Object.keys(pricingMap)[0];
    return firstKey ? pricingMap[firstKey] : 0;
  };

  const resetSelect = (select, placeholder) => {
    select.innerHTML = '';
    select.appendChild(createOption('', placeholder));
    select.value = '';
    select.disabled = true;
  };

  const populateMakes = () => {
    resetSelect(makeSelect, 'Select make');
    Object.keys(vehicleDatabase)
      .sort((a, b) => a.localeCompare(b))
      .forEach((make) => {
        makeSelect.appendChild(createOption(make, make));
      });
    makeSelect.disabled = false;
  };

  const populateModels = (make) => {
    resetSelect(modelSelect, 'Select model');
    resetSelect(variantSelect, 'Select year / variant');
    if (!make || !vehicleDatabase[make]) {
      return;
    }

    Object.keys(vehicleDatabase[make])
      .sort((a, b) => a.localeCompare(b))
      .forEach((model) => {
        modelSelect.appendChild(createOption(model, model));
      });

    modelSelect.disabled = false;
  };

  const populateVariants = (make, model) => {
    resetSelect(variantSelect, 'Select year / variant');
    if (!make || !model || !vehicleDatabase[make] || !vehicleDatabase[make][model]) {
      return;
    }

    Object.keys(vehicleDatabase[make][model])
      .sort((a, b) => a.localeCompare(b))
      .forEach((variant) => {
        variantSelect.appendChild(createOption(variant, variant));
      });

    variantSelect.disabled = false;
  };

  const updateHiddenFields = () => {
    hiddenMake.value = makeSelect.value;
    hiddenModel.value = modelSelect.value;
    hiddenVariant.value = variantSelect.value;
    hiddenCondition.value = conditionSelect.value;
    hiddenPackage.value = packageSelect.value;
  };

  const getCategory = () => categoryDisplay.dataset.category || categoryDisplay.value || '';

  const getConditionMultiplier = () => {
    const multiplier = pricingConfig.conditionMultipliers[conditionSelect.value];
    return typeof multiplier === 'number'
      ? multiplier
      : pricingConfig.conditionMultipliers.default;
  };

  const getSelectedPackage = () =>
    pricingConfig.packages.find((pkg) => pkg.id === packageSelect.value) || null;

  const formatCurrency = (value) => {
    if (!Number.isFinite(value)) {
      return '—';
    }
    return `£${value.toFixed(0)}`;
  };

  const populatePackages = () => {
    packageSelect.innerHTML = '';
    packageSelect.appendChild(createOption('', 'Select package (auto-pricing)'));
    pricingConfig.packages.forEach((pkg) => {
      const option = createOption(pkg.id, pkg.label);
      option.dataset.service = pkg.service;
      if (pkg.description) {
        option.title = pkg.description;
      }
      packageSelect.appendChild(option);
    });
    packageSelect.disabled = false;
  };

  const renderExtras = () => {
    addonList.innerHTML = '';
    pricingConfig.extras.forEach((extra) => {
      const id = `addon-${extra.id}`;
      const wrapper = document.createElement('label');
      wrapper.setAttribute('for', id);
      wrapper.style.display = 'grid';
      wrapper.style.gridTemplateColumns = 'auto 1fr';
      wrapper.style.alignItems = 'start';
      wrapper.style.gap = '10px';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = id;
      checkbox.dataset.extraId = extra.id;
      checkbox.dataset.extraLabel = extra.label;
      checkbox.style.marginTop = '3px';

      const textWrap = document.createElement('div');
      const title = document.createElement('div');
      title.textContent = extra.label;
      title.style.fontWeight = '600';
      const price = document.createElement('div');
      price.className = 'muted';
      price.style.fontSize = '0.9rem';
      price.dataset.priceDisplay = extra.id;

      textWrap.appendChild(title);
      textWrap.appendChild(price);

      wrapper.appendChild(checkbox);
      wrapper.appendChild(textWrap);
      addonList.appendChild(wrapper);
    });
  };

  const getExtrasCheckboxes = () => addonList.querySelectorAll('input[type="checkbox"]');

  const updateServiceSelection = (pkg) => {
    if (!pkg) {
      return;
    }
    const match = Array.from(serviceSelect.options).find(
      (option) => option.value === pkg.service
    );
    if (match) {
      serviceSelect.value = match.value;
    }
  };

  const updateExtrasPricingDisplay = () => {
    const category = getCategory();
    pricingConfig.extras.forEach((extra) => {
      const priceElement = addonList.querySelector(
        `[data-price-display="${extra.id}"]`
      );
      if (!priceElement) {
        return;
      }
      const price = resolvePrice(extra.pricing, category);
      priceElement.textContent = price
        ? `${formatCurrency(price)} inc. VAT`
        : 'Included';
    });
  };

  const updateTotal = () => {
    const category = getCategory();
    const selectedPackage = getSelectedPackage();
    const packageBase = selectedPackage
      ? resolvePrice(selectedPackage.pricing, category)
      : 0;
    const conditionMultiplier = getConditionMultiplier();

    const extrasTotal = Array.from(getExtrasCheckboxes()).reduce((sum, checkbox) => {
      if (!checkbox.checked) {
        return sum;
      }
      const extra = pricingConfig.extras.find((item) => item.id === checkbox.dataset.extraId);
      if (!extra) {
        return sum;
      }
      return sum + resolvePrice(extra.pricing, category);
    }, 0);

    if (!selectedPackage) {
      totalDisplay.textContent = category
        ? 'Select a package to see pricing'
        : 'Select vehicle & package';
      hiddenTotal.value = '';
      hiddenPackage.value = '';
      hiddenExtras.value = '';
      totalBase.textContent = 'Base package: —';
      totalCondition.textContent = 'Condition uplift: —';
      totalExtras.textContent = 'Extras: —';
      if (totalNote) {
        totalNote.textContent = defaultTotalNote;
      }
      return;
    }

    const adjustedBase = Math.round(packageBase * conditionMultiplier);
    const total = adjustedBase + extrasTotal;
    totalDisplay.textContent = formatCurrency(total);

    if (totalBase) {
      totalBase.textContent = `Base package: ${formatCurrency(packageBase)} (${selectedPackage.service})`;
    }

    if (totalCondition) {
      if (!conditionSelect.value) {
        totalCondition.textContent = 'Condition uplift: Waiting for condition';
      } else if (conditionMultiplier > 1) {
        const upliftValue = Math.max(0, adjustedBase - packageBase);
        totalCondition.textContent = `Condition uplift: +${formatCurrency(upliftValue)} (${conditionSelect.value})`;
      } else {
        totalCondition.textContent = `Condition uplift: £0 (${conditionSelect.value})`;
      }
    }

    const multiplierLabel = conditionSelect.value
      ? `${conditionSelect.value} condition`
      : 'Condition not provided';

    const extrasSummary = Array.from(getExtrasCheckboxes())
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => {
        const extra = pricingConfig.extras.find((item) => item.id === checkbox.dataset.extraId);
        if (!extra) {
          return checkbox.dataset.extraLabel;
        }
        const price = resolvePrice(extra.pricing, category);
        return `${extra.label} (${formatCurrency(price)})`;
      });

    if (totalExtras) {
      totalExtras.textContent =
        extrasTotal > 0
          ? `Extras: +${formatCurrency(extrasTotal)}`
          : 'Extras: None selected';
    }

    hiddenPackage.value = `${selectedPackage.label} — base ${formatCurrency(
      packageBase
    )} (${multiplierLabel})`;
    hiddenExtras.value = extrasSummary.length > 0 ? extrasSummary.join('; ') : 'None selected';
    hiddenTotal.value = formatCurrency(total);

    if (totalNote) {
      totalNote.textContent = conditionSelect.value
        ? 'Estimate = package price × condition uplift + extras. We confirm the figure after hands-on inspection.'
        : 'Select a vehicle condition to confirm the uplift. Estimate currently assumes excellent condition.';
    }
  };

  const clearCategory = () => {
    categoryDisplay.value = '';
    categoryDisplay.dataset.category = '';
    hiddenCategory.value = '';
    updateExtrasPricingDisplay();
    updateTotal();
  };

  populateMakes();
  populatePackages();
  renderExtras();
  clearCategory();

  makeSelect.addEventListener('change', () => {
    updateHiddenFields();
    clearCategory();
    populateModels(makeSelect.value);
  });

  modelSelect.addEventListener('change', () => {
    updateHiddenFields();
    clearCategory();
    populateVariants(makeSelect.value, modelSelect.value);
  });

  variantSelect.addEventListener('change', () => {
    updateHiddenFields();
    const make = makeSelect.value;
    const model = modelSelect.value;
    const variant = variantSelect.value;
    if (make && model && variant && vehicleDatabase[make] && vehicleDatabase[make][model]) {
      const details = vehicleDatabase[make][model][variant];
      if (details && details.category) {
        categoryDisplay.value = details.category;
        categoryDisplay.dataset.category = details.category;
        hiddenCategory.value = details.category;
        updateExtrasPricingDisplay();
        updateTotal();
      } else {
        clearCategory();
      }
    } else {
      clearCategory();
    }
  });

  conditionSelect.addEventListener('change', () => {
    updateHiddenFields();
    updateTotal();
  });

  packageSelect.addEventListener('change', () => {
    updateHiddenFields();
    const pkg = getSelectedPackage();
    updateServiceSelection(pkg);
    updateTotal();
  });

  addonList.addEventListener('change', (event) => {
    if (event.target && event.target.matches('input[type="checkbox"]')) {
      updateTotal();
    }
  });

  form.addEventListener('submit', () => {
    updateHiddenFields();
    if (!hiddenCategory.value && categoryDisplay.dataset.category) {
      hiddenCategory.value = categoryDisplay.dataset.category;
    }
    updateTotal();
  });
})();
