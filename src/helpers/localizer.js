exports.localizer = String.prototype.toLowerCaseLocalized = function () {
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
