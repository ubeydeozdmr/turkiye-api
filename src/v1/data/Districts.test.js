const { getDistricts, getExactDistrict } = require('./Districts');

test('getDistricts() should return an array of districts', () => {
  const districts = getDistricts();
  expect(districts).toBeInstanceOf(Array);
});

test('getDistricts() should return an array of districts with a length of 514', () => {
  const districts = getDistricts();
  expect(districts.length).toBe(972);
});

test('getExactDistrict() should return an object', () => {
  const district = getExactDistrict(1832);
  expect(district).toBeInstanceOf(Object);
});

test('getExactDistrict() should return an object with a name property', () => {
  const district = getExactDistrict(1832);
  expect(district.name).toBeDefined();
});

test('getExactDistrict() should return an object with a id property', () => {
  const district = getExactDistrict(1832);
  expect(district.id).toBeDefined();
});

test('getExactDistrict() should return an object with a population property', () => {
  const district = getExactDistrict(1832);
  expect(district.population).toBeDefined();
});
