const fs = require('fs');

const provinces = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/api.json`));
let query;

exports.checkQuery = (req, res, next, val) => {
  query = req.params.query.replace('İ', 'I').toLowerCase();
  // console.log(query)
  // console.log(query[0]);
  // console.log(query[0] === 'ı');
  // if (query[0] === 'ı') query.replace('ı', 'I');
  // console.log(query);

  if (+query > provinces.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  if (!isFinite(query)) {
    let state = false;
    provinces.forEach(el => {
      if (el.name.toLowerCase() == query) {
        state = true;
      }
    });

    if (!state) {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid province name',
      });
    }
  }
  next();
};

exports.getAllProvinces = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: provinces,
  });
};

exports.getProvince = (req, res) => {
  // console.log(req.params);
  const id = +query;
  const name = query;

  let province;

  isFinite(query)
    ? (province = provinces.find(el => el.id === id))
    : (province = provinces.find(el => el.name.toLowerCase() === name));

  // const province = provinces.find(el => el.id === id);

  res.status(200).json({
    status: 'success',
    data: province,
  });
};
