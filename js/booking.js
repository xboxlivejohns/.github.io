(function () {
  const form = document.querySelector('[data-booking-form]');
  if (!form || typeof vehicleDatabase === 'undefined') {
    return;
  }

  const makeSelect = form.querySelector('#vehicleMake');
  const modelSelect = form.querySelector('#vehicleModel');
  const variantSelect = form.querySelector('#vehicleVariant');
  const conditionSelect = form.querySelector('#vehicleCondition');
  const categoryDisplay = form.querySelector('#vehicleCategoryDisplay');

  const hiddenMake = form.querySelector('#vehicleMakeHidden');
  const hiddenModel = form.querySelector('#vehicleModelHidden');
  const hiddenVariant = form.querySelector('#vehicleVariantHidden');
  const hiddenCategory = form.querySelector('#vehicleCategoryHidden');
  const hiddenCondition = form.querySelector('#vehicleConditionHidden');

  if (
    !makeSelect ||
    !modelSelect ||
    !variantSelect ||
    !conditionSelect ||
    !categoryDisplay ||
    !hiddenMake ||
    !hiddenModel ||
    !hiddenVariant ||
    !hiddenCategory ||
    !hiddenCondition
  ) {
    return;
  }

  const createOption = (value, text) => {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    return option;
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
  };

  const clearCategory = () => {
    categoryDisplay.value = '';
    categoryDisplay.dataset.category = '';
    hiddenCategory.value = '';
  };

  populateMakes();
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
      } else {
        clearCategory();
      }
    } else {
      clearCategory();
    }
  });

  conditionSelect.addEventListener('change', () => {
    updateHiddenFields();
  });

  form.addEventListener('submit', () => {
    updateHiddenFields();
    if (!hiddenCategory.value && categoryDisplay.dataset.category) {
      hiddenCategory.value = categoryDisplay.dataset.category;
    }
  });
})();
