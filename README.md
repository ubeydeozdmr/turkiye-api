# Turkiye API

API containing information about Turkey's provinces. It is still under development.

## Announcement

After a 1-month outage, deployment based on [cyclic.sh](https://cyclic.sh) was activated again. We will use [turkiyeapi.dev](https://turkiyeapi.dev) as the main domain. But you can still use the following domains:

- [turkiyeapi.cyclic.app](https://turkiyeapi.cyclic.app)
- [turkiyeapi.herokuapp.com](https://turkiyeapi.herokuapp.com)

## What's new?

- NUTS (_Turkish:_ [İBBS](https://tr.wikipedia.org/wiki/T%C3%BCrkiye%27nin_%C4%B0BBS%27si)) codes added for provinces. (October 11, 2023)
- I'll start working on the [**neighborhoods and towns**](https://github.com/ubeydeozdmr/turkiye-api/issues/13) soon (it won't be easy). I can make this feature available optionally during the development process.

## Sources

- [Population of districts](https://biruni.tuik.gov.tr/medas)
- [Area of districts](https://web.archive.org/web/20190416051733/https://www.harita.gov.tr/images/urun/il_ilce_alanlari.pdf)

## Usage of API

### Get all provinces

```bash
https://turkiyeapi.dev/api/v1/provinces
```

You can use this route to get data for all countries.

[Click here to take a quick look](https://turkiyeapi.dev/api/v1/provinces)

| Query          |  Type   | Description                                                                            |
| -------------- | :-----: | :------------------------------------------------------------------------------------- |
| name           | string  | It shows all the provinces containing or matching your search query.                   |
| minPopulation  | number  | It shows all the provinces with population greater than or equal to your search query. |
| maxPopulation  | number  | It shows all the provinces with population less than or equal to your search query.    |
| isMetropolitan | boolean | It shows all the provinces with metropolitan status equal to your search query.        |
| offset         | number  | Used for pagination. Use this to set a starting point in search results.               |
| limit          | number  | Used for pagination. Use this to set the maximum number of results to show you.        |
| fields         | string  | It shows only the fields you want to see.                                              |
| sort           | string  | It sorts the results by the field you want.                                            |

- Example usage 1:

```bash
https://turkiyeapi.dev/api/v1/provinces?name=ankara
```

[Click here to try it](https://turkiyeapi.dev/api/v1/provinces?name=ankara)

- Example usage 2:

```bash
https://turkiyeapi.dev/api/v1/provinces?offset=10&limit=10
```

[Click here to try it](https://turkiyeapi.dev/api/v1/provinces?offset=10&limit=10)

- Example usage 3:

```bash
https://turkiyeapi.dev/api/v1/provinces?fields=name,areaCode
```

It will show you only the name and area code of the provinces.

[Click here to try it](https://turkiyeapi.dev/api/v1/provinces?fields=name,areaCode)

### Get exact province

```bash
https://turkiyeapi.dev/api/v1/provinces/:id
```

You can use this route to obtain the data of the province whose ID you entered.

City IDs were created based on license plate numbers. Each license plate number is unique so I thought it appropriate to set this route as a parameter instead of a query.

NOTE: The ability to search by province name has been removed for this route. Try using `/api/v1/provinces?name={your search query}` instead.

| Query  |  Type  | Description                               |
| ------ | :----: | :---------------------------------------- |
| fields | string | It shows only the fields you want to see. |

- Example usage 1:

```bash
https://turkiyeapi.dev/api/v1/provinces/6
```

It will show you the data of the province whose ID is 6.

[Click here to try it](https://turkiyeapi.dev/api/v1/provinces/6)

- Example usage 2:

```bash
https://turkiyeapi.dev/api/v1/provinces/6?fields=name,areaCode
```

It will show you only the name and area code of the province.

[Click here to try it](https://turkiyeapi.dev/api/v1/provinces/6?fields=name,areaCode)

- Example response:

```json
{
  "status": "OK",
  "data": [
    {
      "id": 6,
      "name": "Ankara",
      "area": 25632,
      "population": 5747325,
      "altitude": 905,
      "areaCode": [312],
      "isMetropolitan": true,
      "nuts": {
        "nuts1": {
          "code": "TR5",
          "name": {
            "en": "West Anatolia",
            "tr": "Batı Anadolu"
          }
        },
        "nuts2": {
          "code": "TR51",
          "name": "Ankara"
        },
        "nuts3": "TR511"
      },
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
  ]
}
```

### Get all districts

```bash
https://turkiyeapi.dev/api/v1/districts
```

You can use this route to get data for all districts.

[Click here to take a quick look](https://turkiyeapi.dev/api/v1/districts)

| Query         |  Type  | Description                                                                            |
| ------------- | :----: | :------------------------------------------------------------------------------------- |
| name          | string | It shows all the districts containing or matching your search query.                   |
| minPopulation | number | It shows all the districts with population greater than or equal to your search query. |
| maxPopulation | number | It shows all the districts with population less than or equal to your search query.    |
| offset        | number | Used for pagination. Use this to set a starting point in search results.               |
| limit         | number | Used for pagination. Use this to set the maximum number of results to show you.        |
| fields        | string | It shows only the fields you want to see.                                              |
| sort          | string | It sorts the results by the field you want.                                            |

- Example usage 1:

```bash
https://turkiyeapi.dev/api/v1/districts?name=dağ
```

It will show all the districts containing or matching "dağ" in their name.

[Click here to try it](https://turkiyeapi.dev/api/v1/districts?name=dağ)

- Example usage 2:

```bash
https://turkiyeapi.dev/api/v1/districts?minPopulation=100000&maxPopulation=300000
```

It will show all the districts with a population between 100,000 and 300,000.

[Click here to try it](https://turkiyeapi.dev/api/v1/districts?minPopulation=100000&maxPopulation=300000)

- Example usage 3:

```bash
https://turkiyeapi.dev/api/v1/districts?offset=10&limit=10
```

It will show 10 districts starting from the 10th district.

[Click here to try it](https://turkiyeapi.dev/api/v1/districts?offset=10&limit=10)

- Example usage 4:

```bash
https://turkiyeapi.dev/api/v1/districts?fields=name,population
```

It will show only the name and population of the districts.

[Click here to try it](https://turkiyeapi.dev/api/v1/districts?fields=name,population)

- Example response:

```json
{
  "status": "OK",
  "data": [
    {
      "name": "Aladağ",
      "area": 1340,
      "population": 15855,
      "province": "Adana"
    },
    {
      "name": "Ceyhan",
      "area": 1426,
      "population": 159955,
      "province": "Adana"
    }
    // ... and so on
  ]
}
```

### Get exact district

```bash
https://turkiyeapi.dev/api/v1/districts/:id
```

You can use this route to obtain the data of the province whose ID you entered.

| Query  |  Type  | Description                               |
| ------ | :----: | :---------------------------------------- |
| fields | string | It shows only the fields you want to see. |

- Example usage 1:

```bash
https://turkiyeapi.dev/api/v1/districts/1832
```

It will show you the data of the district whose ID is 1832.

[Click here to try it](https://turkiyeapi.dev/api/v1/districts/1832)

- Example usage 2:

```bash
https://turkiyeapi.dev/api/v1/districts/1832?fields=id,name
```

It will show you only the id and name of the district.

[Click here to try it](https://turkiyeapi.dev/api/v1/districts/1832?fields=id,name)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
