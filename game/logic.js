(function (root, factory) {
  const logic = factory();
  if (typeof module === 'object' && module.exports) {
    module.exports = logic;
  } else {
    root.EchoEggLogic = logic;
  }
})(typeof globalThis === 'undefined' ? this : globalThis, function () {
  'use strict';

  const FAMILIES = Object.freeze({
    Aero: Object.freeze(['Airflow', 'Pressure']),
    Terra: Object.freeze(['Mineral bed', 'Vibration stability']),
    Verdant: Object.freeze(['Living soil', 'Plant cover']),
    Radiant: Object.freeze(['Clean-light', 'Purity'])
  });
  const HEALTHY_BAND = Object.freeze({ min: 40, max: 70 });
  const BLIGHT_THRESHOLD = 60;
  const MAX_TICK_SECONDS = 60;
  const CARE_ACTION_AMOUNT = 10;
  const PURIFICATION_AMOUNT = 40;
  const HATCH_PROGRESS = 100;

  function requireEgg(egg) {
    if (!egg || !Object.hasOwn(FAMILIES, egg.family)) {
      throw new TypeError('Unknown Echo Egg family.');
    }
    if (
      !Array.isArray(egg.care) ||
      egg.care.length !== 2 ||
      !egg.care.every(Number.isFinite) ||
      !Number.isFinite(egg.blight) ||
      !Number.isFinite(egg.incubation)
    ) {
      throw new TypeError('Invalid Echo Egg state.');
    }
    return egg;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function inHealthyBand(value) {
    return value >= HEALTHY_BAND.min && value <= HEALTHY_BAND.max;
  }

  function createEgg(family) {
    if (!Object.hasOwn(FAMILIES, family)) {
      throw new TypeError('Unknown Echo Egg family.');
    }
    return {
      family,
      care: [55, 55],
      blight: 0,
      incubation: 0,
      status: 'incubating'
    };
  }

  function tend(egg, meterIndex, amount = CARE_ACTION_AMOUNT) {
    requireEgg(egg);
    if (egg.status === 'complete') return egg;
    if (meterIndex !== 0 && meterIndex !== 1) {
      throw new RangeError('Care meter index must be 0 or 1.');
    }
    if (!Number.isFinite(amount) || amount <= 0 || amount > 25) {
      throw new RangeError('Care amount must be greater than 0 and at most 25.');
    }
    const care = [...egg.care];
    care[meterIndex] = clamp(care[meterIndex] + amount, 0, 100);
    return { ...egg, care };
  }

  function purify(egg) {
    requireEgg(egg);
    if (egg.status === 'complete') return egg;
    const blight = Math.max(0, egg.blight - PURIFICATION_AMOUNT);
    return {
      ...egg,
      blight,
      status: blight >= BLIGHT_THRESHOLD ? 'purify' : 'incubating'
    };
  }

  function tick(egg, elapsedSeconds = 1) {
    requireEgg(egg);
    if (!Number.isFinite(elapsedSeconds) || elapsedSeconds <= 0 || elapsedSeconds > MAX_TICK_SECONDS) {
      throw new RangeError(`Elapsed time must be greater than 0 and no more than ${MAX_TICK_SECONDS} seconds.`);
    }
    if (egg.status === 'complete') return egg;

    const care = egg.care.map(value => clamp(value - elapsedSeconds, 0, 100));
    let blight = clamp(egg.blight, 0, 100);

    if (blight < BLIGHT_THRESHOLD) {
      const imbalance = Math.abs(care[0] - care[1]);
      if (imbalance >= 35) {
        blight = clamp(blight + 2 * elapsedSeconds, 0, 100);
      } else if (imbalance <= 15) {
        blight = clamp(blight - elapsedSeconds, 0, 100);
      }
    }

    const isBlighted = blight >= BLIGHT_THRESHOLD;
    const canIncubate = care.every(inHealthyBand);
    const incubation = isBlighted
      ? egg.incubation
      : canIncubate
        ? Math.min(HATCH_PROGRESS, egg.incubation + elapsedSeconds)
        : egg.incubation;

    return {
      ...egg,
      care,
      blight,
      incubation,
      status: isBlighted ? 'purify' : incubation >= HATCH_PROGRESS ? 'complete' : 'incubating'
    };
  }

  return Object.freeze({
    BLIGHT_THRESHOLD,
    CARE_ACTION_AMOUNT,
    FAMILIES,
    HATCH_PROGRESS,
    HEALTHY_BAND,
    MAX_TICK_SECONDS,
    createEgg,
    purify,
    tend,
    tick
  });
});
