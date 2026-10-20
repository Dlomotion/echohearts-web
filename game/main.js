'use strict';

(() => {
  const Logic = window.EchoEggLogic;
  const familyCopy = {
    Aero: 'Care focuses on airflow and pressure stability.',
    Terra: 'Care focuses on a mineral bed and vibration stability.',
    Verdant: 'Care focuses on living soil and protective plant cover.',
    Radiant: 'Care focuses on clean light and Purity.'
  };
  const elements = {
    familyOptions: [...document.querySelectorAll('[data-family]')],
    familyName: document.getElementById('family-name'),
    familyCopy: document.getElementById('family-copy'),
    meterNames: [0, 1].map(index => document.getElementById(`meter-name-${index}`)),
    meterValues: [0, 1].map(index => document.getElementById(`meter-value-${index}`)),
    meters: [0, 1].map(index => document.getElementById(`meter-${index}`)),
    fills: [0, 1].map(index => document.getElementById(`fill-${index}`)),
    blightValue: document.getElementById('blight-value'),
    blightMeter: document.getElementById('blight-meter'),
    blightFill: document.getElementById('blight-fill'),
    blightMessage: document.getElementById('blight-message'),
    status: document.getElementById('egg-status'),
    progressValue: document.getElementById('progress-value'),
    progress: document.getElementById('incubation-progress'),
    progressFill: document.getElementById('progress-fill'),
    tendButtons: [0, 1].map(index => document.getElementById(`tend-${index}`)),
    purify: document.getElementById('purify'),
    pause: document.getElementById('pause'),
    completion: document.getElementById('completion-message')
  };

  let egg = Logic.createEgg('Aero');
  let paused = false;

  function setMeter(element, fill, value) {
    const rounded = Math.round(value);
    element.setAttribute('aria-valuenow', String(rounded));
    element.setAttribute('aria-valuetext', `${rounded} percent`);
    fill.style.width = `${rounded}%`;
  }

  function render() {
    const names = Logic.FAMILIES[egg.family];
    elements.familyName.textContent = `${egg.family} Echo Egg`;
    elements.familyCopy.textContent = familyCopy[egg.family];
    elements.familyOptions.forEach(option => {
      option.checked = option.value === egg.family;
    });

    names.forEach((name, index) => {
      elements.meterNames[index].textContent = name;
      elements.meterValues[index].textContent = `${Math.round(egg.care[index])}%`;
      elements.meters[index].setAttribute('aria-label', name);
      setMeter(elements.meters[index], elements.fills[index], egg.care[index]);
      elements.tendButtons[index].textContent = `Tend ${name.toLowerCase()}`;
      elements.tendButtons[index].disabled = egg.status === 'complete';
    });

    elements.blightValue.textContent = `${Math.round(egg.blight)}%`;
    setMeter(elements.blightMeter, elements.blightFill, egg.blight);
    elements.status.textContent = egg.status === 'purify'
      ? 'Purification needed'
      : egg.status === 'complete'
        ? 'Care cycle complete'
        : paused
          ? 'Care paused'
          : 'Incubating';
    elements.progressValue.textContent = `${Math.round(egg.incubation)}%`;
    elements.progress.setAttribute('aria-valuenow', String(Math.round(egg.incubation)));
    elements.progressFill.style.width = `${egg.incubation}%`;
    elements.purify.disabled = egg.status === 'complete' || egg.blight === 0;
    elements.pause.disabled = egg.status === 'complete';
    elements.pause.textContent = paused ? 'Resume care' : 'Pause care';
    elements.completion.hidden = egg.status !== 'complete';

    if (egg.status === 'purify') {
      elements.blightMessage.textContent = 'Incubation is paused. Purify the egg to lower Blight stress.';
    } else if (egg.status === 'complete') {
      elements.blightMessage.textContent = 'This care cycle is complete. No species or Dex identity was generated.';
    } else {
      elements.blightMessage.textContent = 'Keep care balanced. At 60% stress, purify before incubation can continue.';
    }
  }

  elements.familyOptions.forEach(option => {
    option.addEventListener('change', () => {
      if (!option.checked) return;
      egg = Logic.createEgg(option.value);
      paused = false;
      render();
    });
  });
  elements.tendButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      egg = Logic.tend(egg, index);
      render();
    });
  });
  elements.purify.addEventListener('click', () => {
    egg = Logic.purify(egg);
    render();
  });
  elements.pause.addEventListener('click', () => {
    paused = !paused;
    render();
  });

  window.setInterval(() => {
    if (!paused && egg.status !== 'complete') {
      egg = Logic.tick(egg);
      render();
    }
  }, 1000);

  render();
})();
