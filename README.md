# Provinces of Turkey API

API containing information about Turkey's provinces. It is still under development.

## Sources

- [Population of districts](https://biruni.tuik.gov.tr/medas)
- [Area of districts](https://web.archive.org/web/20190416051733/https://www.harita.gov.tr/images/urun/il_ilce_alanlari.pdf)

## Known BUGs / TODOs:

- Province search functionality has not been implemented yet.
- CORS has not been implemented yet.
- Work will be done on some non-English characters such as "İ / ı".
- The province cannot be found when capital letters are used (a problem for some provinces, due to Turkish characters) will be tried to be fixed.
- API features will be tried to be increased.

## Differences between pico, nano and default api.json file

|                |    Pico    |   Nano    |  Default  |
| -------------- | :--------: | :-------: | :-------: |
| Size           |    12kB    |   18kB    |   94kB    |
| Province IDs   |     +      |     +     |     +     |
| Province Names |     +      |     +     |     +     |
| Province Areas | + (Number) | + (Array) | + (Array) |
| Regions        |     -      |     +     |     +     |
| Districts      |     -      |     -     |     +     |
