const provinceService = require('../services/provinceService');

exports.getAllProvinces = (req, res) => {
  try {
    const provinces = provinceService.getAllProvinces();
    res.send({ status: 'OK', data: provinces });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'ERROR', error: error?.message || 'Internal Server Error' });
  }
};

exports.getProvince = (req, res) => {
  String.prototype.toLowerCaseLocalized = function () {
    var string = this;
    var letters = {
      A: 'a',
      B: 'b',
      C: 'c',
      Ç: 'ç',
      D: 'd',
      E: 'e',
      F: 'f',
      G: 'g',
      Ğ: 'ğ',
      H: 'h',
      I: 'ı',
      İ: 'i',
      J: 'j',
      K: 'k',
      L: 'l',
      M: 'm',
      N: 'n',
      O: 'o',
      Ö: 'ö',
      P: 'p',
      R: 'r',
      S: 's',
      Ş: 'ş',
      T: 't',
      U: 'u',
      Ü: 'ü',
      V: 'v',
      Y: 'y',
      Z: 'z',
    };
    return string.replace(/[ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ]/g, function (letter) {
      return letters[letter];
    });
  };
  String.prototype.toUpperCaseLocalized = function () {
    var string = this;
    var letters = {
      a: 'A',
      b: 'B',
      c: 'C',
      ç: 'Ç',
      d: 'D',
      e: 'E',
      f: 'F',
      g: 'G',
      ğ: 'Ğ',
      h: 'H',
      ı: 'I',
      i: 'İ',
      j: 'J',
      k: 'K',
      l: 'L',
      m: 'M',
      n: 'N',
      o: 'O',
      ö: 'Ö',
      p: 'P',
      r: 'R',
      s: 'S',
      ş: 'Ş',
      t: 'T',
      u: 'U',
      ü: 'Ü',
      v: 'V',
      y: 'Y',
      z: 'Z',
    };
    return string.replace(/[abcçdefgğhıijklmnoöprsştuüvyz]/g, function (letter) {
      return letters[letter];
    });
  };

  try {
    const { query } = req.params;
    let transformedQuery = query.trim();

    transformedQuery =
      transformedQuery.charAt(0).toUpperCaseLocalized() +
      transformedQuery.slice(1).toLowerCaseLocalized();

    const province = provinceService.getProvince(transformedQuery);
    res.send({ status: 'OK', data: province });
  } catch (error) {
    res
      .status(error?.status || 500)
      .send({ status: 'ERROR', error: error?.message || 'Internal Server Error' });
  }
};
