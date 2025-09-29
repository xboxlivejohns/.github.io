(function(){
  const form = document.querySelector('[data-leisure-quote-form]');
  if (!form) {
    return;
  }

  const estimateBar = document.querySelector('[data-estimate-bar]');
  const estimateDisplay = document.querySelector('[data-estimate-display]');
  const estimateMeta = document.querySelector('[data-estimate-meta]');
  const estimateField = form.querySelector('[data-estimate-total]');
  const breakdownField = form.querySelector('[data-estimate-breakdown-field]');
  const scrollBtn = document.querySelector('[data-scroll-to-form]');
  const whatsappSummaryLink = document.querySelector('[data-success-whatsapp]');
  const statusBox = form.querySelector('[data-form-status]');

  const vehicleType = form.querySelector('[data-vehicle-type]');
  const lengthBand = form.querySelector('[data-length-band]');
  const exteriorSelect = form.querySelector('[data-exterior]');
  const interiorSelect = form.querySelector('[data-interior]');
  const roofToggle = form.querySelector('[data-roof-toggle]');
  const addonContainer = form.querySelector('[data-addon-checkboxes]');
  const distanceField = form.querySelector('[data-distance]');

  let pricingConfig = null;
  let currentEstimate = null;

  const toPounds = (pence) => {
    if (typeof pence !== 'number' || Number.isNaN(pence)) {
      return '£0';
    }
    return `£${(pence / 100).toFixed(2)}`;
  };

  const describeSelection = (state) => {
    const parts = [];
    if (state.band && state.band !== 'unknown') {
      parts.push(state.band);
    }
    if (state.exterior === 'EX_DEEP') {
      parts.push('Deep Exterior');
    } else if (state.exterior === 'EX_WASH') {
      parts.push('Exterior Wash');
    }
    if (state.roof) {
      parts.push('Roof');
    }
    if (state.interior === 'INT_STEAM') {
      parts.push('Interior Steam');
    }
    if (state.addons.length) {
      parts.push(`${state.addons.length} add-on${state.addons.length > 1 ? 's' : ''}`);
    }
    return parts.join(' • ');
  };

  const formatBreakdown = (items) => {
    return items.map((item) => {
      const sign = item.pence < 0 ? '-' : '';
      return `${item.code}: ${sign}${toPounds(Math.abs(item.pence))}`;
    });
  };

  const getState = () => {
    const addons = [];
    if (addonContainer) {
      addonContainer.querySelectorAll('input[type="checkbox"]').forEach((box) => {
        if (box.checked) {
          addons.push(box.value);
        }
      });
    }

    const bandValue = lengthBand ? lengthBand.value : '6-7m';

    return {
      vehicleType: vehicleType ? vehicleType.value : 'caravan',
      band: bandValue === 'unknown' ? '6-7m' : bandValue,
      rawBand: bandValue,
      exterior: exteriorSelect ? exteriorSelect.value : 'none',
      interior: interiorSelect ? interiorSelect.value : 'none',
      roof: roofToggle ? roofToggle.checked : false,
      addons,
      distanceBeyond: distanceField ? Number(distanceField.value || 0) : 0,
    };
  };

  const calculateTravel = (config, distanceBeyond) => {
    if (!config || !distanceBeyond || Number.isNaN(distanceBeyond) || distanceBeyond <= 0) {
      return 0;
    }
    const perMile = Number(config.travel_surcharge_per_mile || 0);
    const minCharge = Number(config.min_travel_surcharge || 0);
    const charge = Math.round(distanceBeyond * perMile);
    return Math.max(charge, minCharge);
  };

  const estimate = (config, state) => {
    if (!config) {
      return { items: [], total_pence: 0 };
    }
    const items = [];
    let subtotal = 0;
    let deepExteriorPrice = 0;
    let interiorSteamPrice = 0;
    const band = state.band;

    if (state.exterior === 'EX_WASH' || state.exterior === 'EX_DEEP') {
      const price = config.base[state.exterior]?.[band];
      if (typeof price === 'number') {
        items.push({ code: state.exterior, pence: price });
        subtotal += price;
        if (state.exterior === 'EX_DEEP') {
          deepExteriorPrice = price;
        }
      }
    }

    if (state.interior === 'INT_STEAM') {
      const price = config.base.INT_STEAM?.[band];
      if (typeof price === 'number') {
        items.push({ code: 'INT_STEAM', pence: price });
        subtotal += price;
        interiorSteamPrice = price;
      }
    }

    if (state.roof) {
      const price = config.base.ROOF_ADDON?.[band];
      if (typeof price === 'number') {
        items.push({ code: 'ROOF_ADDON', pence: price });
        subtotal += price;
      }
    }

    if (state.addons && state.addons.length) {
      state.addons.forEach((addon) => {
        const price = config.addons?.[addon]?.[band];
        if (typeof price === 'number') {
          items.push({ code: addon, pence: price });
          subtotal += price;
        }
      });
    }

    if (deepExteriorPrice > 0 && interiorSteamPrice > 0) {
      const baseBundleTotal = deepExteriorPrice + interiorSteamPrice;
      const discount = Math.round(baseBundleTotal * Number(config.bundle_discount || 0));
      if (discount > 0) {
        items.push({ code: 'BUNDLE_DISC', pence: -discount });
        subtotal -= discount;
      }
    }

    const travel = calculateTravel(config, state.distanceBeyond);
    if (travel > 0) {
      items.push({ code: 'TRAVEL', pence: travel });
      subtotal += travel;
    }

    return { items, total_pence: subtotal };
  };

  const updateEstimate = () => {
    if (!pricingConfig) {
      return;
    }
    const state = getState();
    const quote = estimate(pricingConfig, state);
    currentEstimate = { state, quote };

    if (estimateDisplay) {
      const low = Math.max(0, Math.round(quote.total_pence * 0.9));
      const high = Math.round(quote.total_pence * 1.1);
      estimateDisplay.textContent = `${toPounds(low)} – ${toPounds(high)}`;
    }

    if (estimateMeta) {
      estimateMeta.textContent = describeSelection(state);
    }

    if (estimateField) {
      estimateField.value = quote.total_pence;
    }

    if (breakdownField) {
      breakdownField.value = JSON.stringify({
        items: quote.items,
        selection: state,
      });
    }

    if (estimateBar) {
      estimateBar.hidden = false;
    }

    if (whatsappSummaryLink) {
      const summary = formatBreakdown(quote.items).join('%0A');
      const intro = encodeURIComponent('Hi John, here are my caravan/motorhome selections:');
      const selectionLines = encodeURIComponent(`Vehicle: ${state.vehicleType}\nLength: ${state.rawBand}\nPackages: ${describeSelection(state)}`);
      const totalLine = encodeURIComponent(`Estimate total: ${toPounds(quote.total_pence)}`);
      const url = `https://wa.me/447468286651?text=${intro}%0A${selectionLines}%0A%0A${summary}%0A${totalLine}`;
      whatsappSummaryLink.href = url;
    }
  };

  const fetchPricing = async () => {
    try {
      const res = await fetch('/config/leisure-pricing.json', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load pricing');
      }
      pricingConfig = await res.json();
      updateEstimate();
    } catch (error) {
      if (statusBox) {
        statusBox.textContent = 'Unable to load pricing right now. Please WhatsApp John on 07468 286651.';
        statusBox.classList.add('leisure-form__status--error');
      }
    }
  };

  const registerListeners = () => {
    [vehicleType, lengthBand, exteriorSelect, interiorSelect, roofToggle, distanceField].forEach((field) => {
      if (!field) return;
      const eventName = field.type === 'checkbox' ? 'change' : 'input';
      field.addEventListener(eventName, updateEstimate);
    });

    if (addonContainer) {
      addonContainer.querySelectorAll('input[type="checkbox"]').forEach((box) => {
        box.addEventListener('change', updateEstimate);
      });
    }

    if (scrollBtn) {
      scrollBtn.addEventListener('click', () => {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    form.addEventListener('submit', (event) => {
      if (!pricingConfig) {
        event.preventDefault();
        if (statusBox) {
          statusBox.textContent = 'Please wait for live pricing to load, then submit again or WhatsApp John on 07468 286651.';
          statusBox.classList.add('leisure-form__status--error');
        }
        return;
      }

      if (!currentEstimate) {
        updateEstimate();
      }

      if (statusBox) {
        statusBox.textContent = 'Submitting securely…';
        statusBox.classList.remove('leisure-form__status--error');
        statusBox.classList.remove('leisure-form__status--success');
      }
    });
  };

  fetchPricing();
  registerListeners();
})();
