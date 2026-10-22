'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const {
  BLIGHT_THRESHOLD,
  FAMILIES,
  HEALTHY_BAND,
  createEgg,
  purify,
  tend,
  tick
} = require('../logic.js');

test('exposes only the four approved prototype care families', () => {
  assert.deepEqual(Object.keys(FAMILIES), ['Aero', 'Terra', 'Verdant', 'Radiant']);
});

test('creates a stable initial care state with family-specific meters', () => {
  const egg = createEgg('Aero');
  assert.deepEqual(egg.care, [55, 55]);
  assert.deepEqual(FAMILIES[egg.family], ['Airflow', 'Pressure']);
  assert.equal(egg.status, 'incubating');
});

test('care drifts down without mutating the input state', () => {
  const egg = createEgg('Terra');
  const next = tick(egg);
  assert.deepEqual(next.care, [54, 54]);
  assert.deepEqual(egg.care, [55, 55]);
});

test('incubation advances while both meters are inside the healthy band', () => {
  const next = tick(createEgg('Verdant'));
  assert.equal(next.incubation, 1);
  assert.equal(next.status, 'incubating');
  assert.deepEqual(HEALTHY_BAND, { min: 40, max: 70 });
});

test('care below the healthy band stalls incubation', () => {
  const egg = { ...createEgg('Radiant'), care: [39, 55], incubation: 12 };
  assert.equal(tick(egg).incubation, 12);
});

test('over-tending above the healthy band stalls incubation', () => {
  const egg = { ...createEgg('Aero'), care: [72, 55], incubation: 12 };
  assert.equal(tick(egg).incubation, 12);
});

test('severe care imbalance builds Blight stress', () => {
  const egg = { ...createEgg('Terra'), care: [100, 0], blight: 10 };
  const next = tick(egg);
  assert.equal(next.blight, 12);
});

test('Blight at exactly 60 pauses incubation and requires purification', () => {
  const egg = { ...createEgg('Verdant'), blight: BLIGHT_THRESHOLD, incubation: 20 };
  const next = tick(egg);
  assert.equal(next.status, 'purify');
  assert.equal(next.incubation, 20);
});

test('critical Blight does not passively clear or resume incubation', () => {
  const egg = { ...createEgg('Radiant'), blight: 70, incubation: 20 };
  const next = tick(egg);
  assert.equal(next.blight, 70);
  assert.equal(next.status, 'purify');
  assert.equal(next.incubation, 20);
});

test('purification lowers Blight below the threshold without adding progress', () => {
  const egg = { ...createEgg('Aero'), blight: 60, incubation: 20 };
  const next = purify(egg);
  assert.equal(next.blight, 20);
  assert.equal(next.status, 'incubating');
  assert.equal(next.incubation, 20);
});

test('rejects invalid families, care actions, and elapsed-time bounds', () => {
  assert.throws(() => createEgg('Prismatic'), TypeError);
  assert.throws(() => tend(createEgg('Terra'), 2), RangeError);
  assert.throws(() => tend(createEgg('Terra'), 0, Infinity), RangeError);
  assert.throws(() => tick(createEgg('Aero'), 61), RangeError);
});

test('an egg completes without destruction or a generated species identity', () => {
  const egg = { ...createEgg('Radiant'), incubation: 99 };
  const next = tick(egg);
  assert.equal(next.status, 'complete');
  assert.equal(next.incubation, 100);
  assert.equal('speciesId' in next, false);
  assert.equal('dexId' in next, false);
  assert.equal(next.destroyed, undefined);
});
