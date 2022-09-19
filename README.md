# Provinces of Turkey API

API containing information about Turkey's provinces. It is still under development.

## Sources

- [Population of districts](https://biruni.tuik.gov.tr/medas)
- [Area of districts](https://web.archive.org/web/20190416051733/https://www.harita.gov.tr/images/urun/il_ilce_alanlari.pdf)

## Usage of API

### Get all provinces

```bash
https://provinces-of-turkey-api.herokuapp.com/api/v1/provinces
```

You can use this route to get data for all countries.

[Click here to take a quick look](https://provinces-of-turkey-api.herokuapp.com/api/v1/provinces)

| Query  |  Type  | Description                                                                     |
| ------ | :----: | :------------------------------------------------------------------------------ |
| name   | string | It shows all the provinces containing or matching your search query.            |
| offset | number | Used for pagination. Use this to set a starting point in search results.        |
| limit  | number | Used for pagination. Use this to set the maximum number of results to show you. |

- Example usage 1:

```bash
https://provinces-of-turkey-api.herokuapp.com/api/v1/provinces?name=ankara
```

[Click here to try it](https://provinces-of-turkey-api.herokuapp.com/api/v1/provinces?name=ankara)

- Example usage 2:

```bash
https://provinces-of-turkey-api.herokuapp.com/api/v1/provinces?offset=10&limit=10
```

[Click here to try it](https://provinces-of-turkey-api.herokuapp.com/api/v1/provinces?offset=10&limit=10)

### Get exact province

```bash
https://provinces-of-turkey-api.herokuapp.com/api/v1/provinces/:id
```

You can use this route to obtain the data of the province whose ID you entered.

City IDs were created based on license plate numbers. Each license plate number is unique so I thought it appropriate to set this route as a parameter instead of a query.

NOTE: The ability to search by province name has been removed for this route. Try using /api/v1/provinces?name={your search query} instead.

[Example URL](https://provinces-of-turkey-api.herokuapp.com/api/v1/provinces/6)

- Example response:

```json
{
  "status": "OK",
  "data": {
    "id": 6,
    "name": "Ankara",
    "area": 25632,
    "population": 5747325,
    "areaCode": [312],
    "isMetropolitan": true,
    "maps": {
      "googleMaps": "https://goo.gl/maps/Ri3Zh3yBka5RhXdG8",
      "openStreetMaps": "https://www.openstreetmap.org/relation/223422"
    },
    "region": {
      "en": "Central Anatolia",
      "tr": "Orta Anadolu"
    },
    "districts": [
      // Districts of Ankara
    ]
  }
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
