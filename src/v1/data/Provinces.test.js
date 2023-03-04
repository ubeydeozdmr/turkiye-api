const { getProvinces, getExactProvince } = require('./Provinces');

test('getProvinces() should return an array of provinces', () => {
  const provinces = getProvinces();
  expect(provinces).toBeInstanceOf(Array);
});

test('getProvinces() should return an array of provinces with a length of 81', () => {
  const provinces = getProvinces();
  expect(provinces.length).toBe(81);
});

test('getExactProvince() should return an object', () => {
  const province = getExactProvince(6);
  expect(province).toBeInstanceOf(Object);
});

test('getExactProvince() should return an object with a name property', () => {
  const province = getExactProvince(6);
  expect(province.name).toBeDefined();
});

test('getExactProvince() should return an object with a id property', () => {
  const province = getExactProvince(6);
  expect(province.id).toBeDefined();
});

test('getExactProvince() should return an object with a population property', () => {
  const province = getExactProvince(6);
  expect(province.population).toBeDefined();
});
