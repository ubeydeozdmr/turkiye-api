# Turkiye API

TurkiyeAPI is a comprehensive REST API providing detailed information about Turkey's administrative divisions including provinces, districts, neighborhoods and villages with demographic and geographical data.

The API uses [turkiyeapi.dev](https://turkiyeapi.dev) as the main domain. You can visit: [https://turkiyeapi.dev](https://turkiyeapi.dev)

## Sources

- [Population of districts](https://biruni.tuik.gov.tr/medas)
- [Area of districts](https://web.archive.org/web/20190416051733/https://www.harita.gov.tr/images/urun/il_ilce_alanlari.pdf)

## Documentation

- [API Documentation](https://api.turkiyeapi.dev/docs)
- [Examples](https://api.turkiyeapi.dev/examples)
- [Postman Collection](https://documenter.getpostman.com/view/19561492/UzBguVHM)
- [Swagger UI](https://api.turkiyeapi.dev/swagger)

## Python Implementation

Python implementation of TurkiyeAPI v1 is available at [@gencharitaci/turkiye-api-py](https://github.com/gencharitaci/turkiye-api-py)

## Preview of v2 has been released

A preview of TurkiyeAPI version 2 has been publicly released! The full release will be in June, but in the meantime, you can use v2 and provide feedback.

Of course, you can still use v1, but I recommend using v2 as it has many new features and improvements. You can find the documentation and Postman collection for v2 in the links below. Also your feedback is very important for the development of v2, so please don't hesitate to provide feedback using the links below.

What's new in v2:

- **Municipal Units**: In v2, the concept of municipal units has been introduced. This means that in addition to provinces, districts, neighborhoods, and villages, there are now also municipal units. This allows for more detailed and accurate data representation. Towns, which were previously included as a patch in v1, have been removed and replaced with municipal units in v2. This change allows for a more comprehensive and accurate representation of the administrative divisions in Turkey.
- **Updated Data**: The data in v2 has been updated to reflect the latest information available. This includes changes in population and new administrative divisions.
- **Improved Performance**: The performance of the API has been improved in v2, allowing for faster response times and better handling of large datasets.
- **New Endpoints**: New endpoints have been added in v2 to provide more specific data and allow for more complex queries.
- **Postal Codes**: The postal code feature has been expanded in v2 to include neighborhoods and villages, in addition to provinces and districts. This allows for more detailed filtering and data retrieval based on postal codes.

Base v2 URL: `https://api.turkiyeapi.dev/v2`

[Documentation for v2](https://github.com/ubeydeozdmr/turkiye-api/tree/v2#readme)

[Postman Collection for v2](https://documenter.getpostman.com/view/19561492/UzBguVHM)

[Provide feedback for v2 (GitHub Issues)](https://github.com/ubeydeozdmr/turkiye-api/issues/58#issuecomment-4358464318)

[Provide feedback for v2 (Email)](mailto:ubeydeozdmr@gmail.com)

## Usage of API

## Provinces

### Get All Provinces

**Endpoint:** `GET /v1/provinces`

You can use this route to get data for all provinces. The available query parameters are:

- `name` (string): It shows all the provinces containing or matching your search query.
- `minPopulation` (number): It shows all the provinces with a population greater than or equal to the value you entered.
- `maxPopulation` (number): It shows all the provinces with a population less than or equal to the value you entered.
- `minArea` (number): It shows all the provinces with an area greater than or equal to the value you entered.
- `maxArea` (number): It shows all the provinces with an area less than or equal to the value you entered.
- `minAltitude` (number): It shows all the provinces with an altitude greater than or equal to the value you entered.
- `maxAltitude` (number): It shows all the provinces with an altitude less than or equal to the value you entered.
- `isCoastal` (boolean): It shows all the provinces that are coastal or not.
- `isMetropolitan` (boolean): It shows all the provinces that are metropolitan or not.
- `offset` (number): Used for pagination. Use this to set a starting point in search results.
- `limit` (number): Used for pagination. Use this to set the maximum number of results to show you.
- `fields` (string): It shows the fields you want to see in the response.
- `sort` (string): It sorts the results in ascending or descending order.

### Get Exact Province

**Endpoint:** `GET /v1/provinces/:id`

You can use this route to get data for exact province. The available path variables and query parameters are:

- `id` (Path Variable): ID of province
- `fields` (Query Parameter, string): It shows the fields you want to see in the response.
- `extend` (Query Parameter, boolean): It shows the extended data (neighborhoods and villages) of the province. [Default: false] (This is an experimental feature. It may not work properly.)

## Districts

### Get All Districts

**Endpoint:** `GET /v1/districts`

You can use this route to get data for all districts. The available query parameters are:

- `name` (string): It shows all the districts containing or matching your search query.
- `minPopulation` (number): It shows all the districts with a population greater than or equal to the value you entered.
- `maxPopulation` (number): It shows all the districts with a population less than or equal to the value you entered.
- `minArea` (number): It shows all the districts with an area greater than or equal to the value you entered.
- `maxArea` (number): It shows all the districts with an area less than or equal to the value you entered.
- `provinceId` (number): It shows all the districts in the province with the ID you entered.
- `province` (string): It shows all the districts in the province containing or matching your search query.
- `offset` (number): Used for pagination. Use this to set a starting point in search results.
- `limit` (number): Used for pagination. Use this to set the maximum number of results to show you.
- `fields` (string): It shows the fields you want to see in the response.
- `sort` (string): It sorts the results in ascending or descending order.

### Get Exact District

**Endpoint:** `GET /v1/districts/:id`

You can use this route to get data for exact district. The available path variables and query parameters are:

- `id` (Path Variable): ID of district
- `fields` (Query Parameter, string): It shows the fields you want to see in the response.

## Neighborhoods

### Get All Neighborhoods

**Endpoint:** `GET /v1/neighborhoods`

You can use this route to get data for all neighborhoods. The available query parameters are:

- `name` (string): It shows all the neighborhoods containing or matching your search query.
- `minPopulation` (number): It shows all the neighborhoods with a population greater than or equal to the value you entered.
- `maxPopulation` (number): It shows all the neighborhoods with a population less than or equal to the value you entered.
- `provinceId` (number): It shows all the neighborhoods in the province with the ID you entered.
- `province` (string): It shows all the neighborhoods in the province containing or matching your search query.
- `districtId` (number): It shows all the neighborhoods in the district with the ID you entered.
- `district` (string): It shows all the neighborhoods in the district containing or matching your search query.
- `offset` (number): Used for pagination. Use this to set a starting point in search results.
- `limit` (number): Used for pagination. Use this to set the maximum number of results to show you.
- `fields` (string): It shows the fields you want to see in the response.
- `sort` (string): It sorts the results in ascending or descending order.

### Get Exact Neighborhood

**Endpoint:** `GET /v1/neighborhoods/:id`

You can use this route to get data for exact neighborhood. The available path variables and query parameters are:

- `id` (Path Variable): ID of neighborhood
- `fields` (Query Parameter, string): It shows the fields you want to see in the response.

## Villages

### Get All Villages

**Endpoint:** `GET /v1/villages`

You can use this route to get data for all villages. The available query parameters are:

- `name` (string): It shows all the villages containing or matching your search query.
- `minPopulation` (number): It shows all the villages with a population greater than or equal to the value you entered.
- `maxPopulation` (number): It shows all the villages with a population less than or equal to the value you entered.
- `provinceId` (number): It shows all the villages in the province with the ID you entered.
- `province` (string): It shows all the villages in the province containing or matching your search query.
- `districtId` (number): It shows all the villages in the district with the ID you entered.
- `district` (string): It shows all the villages in the district containing or matching your search query.
- `offset` (number): Used for pagination. Use this to set a starting point in search results.
- `limit` (number): Used for pagination. Use this to set the maximum number of results to show you.
- `fields` (string): It shows the fields you want to see in the response.
- `sort` (string): It sorts the results in ascending or descending order.

### Get Exact Village

**Endpoint:** `GET /v1/villages/:id`

You can use this route to get data for exact village. The available path variables and query parameters are:

- `id` (Path Variable): ID of village
- `fields` (Query Parameter, string): It shows the fields you want to see in the response.

## Towns

Important Notes:

- The scope of the v1 version of TurkiyeAPI (without municipal units) is to include provinces, districts, neighborhoods, and villages. However, since towns (a type of municipality) have an important place in the country, two routes have been allocated to them, just like neighborhoods and villages. In short, this is a patch prepared for v1. However, unlike neighborhoods and villages, they are not shown in the `/districts/:id` route, meaning they are isolated within themselves. Nevertheless, in these routes starting with `/towns`, the province-district names and IDs to which the towns are connected are specified, meaning you can connect using these if you wish.

- This is just a patch update (Check issue [#29](https://github.com/ubeydeozdmr/turkiye-api/issues/29)), in version 2 I will probably remove the `/towns` route and add the `/municipalities` route instead.

### Get All Towns

**Endpoint:** `GET /v1/towns`

You can use this route to get data for all towns. The available query parameters are:

- `name` (string): It shows all the towns containing or matching your search query.
- `minPopulation` (number): It shows all the towns with a population greater than or equal to the value you entered.
- `maxPopulation` (number): It shows all the towns with a population less than or equal to the value you entered.
- `provinceId` (number): It shows all the towns in the province with the ID you entered.
- `province` (string): It shows all the towns in the province containing or matching your search query.
- `districtId` (number): It shows all the towns in the district with the ID you entered.
- `district` (string): It shows all the towns in the district containing or matching your search query.
- `offset` (number): Used for pagination. Use this to set a starting point in search results.
- `limit` (number): Used for pagination. Use this to set the maximum number of results to show you.
- `fields` (string): It shows the fields you want to see in the response.
- `sort` (string): It sorts the results in ascending or descending order.

### Get Exact Town

**Endpoint:** `GET /v1/towns/:id`

You can use this route to get data for exact town. The available path variables and query parameters are:

- `id` (Path Variable): ID of town
- `fields` (Query Parameter, string): It shows the fields you want to see in the response.

## About Postal Codes

The postal codes feature is currently partially missing. Currently, there is only a postal code feature for provinces and districts, and a postal code feature for neighborhoods and villages will come later. However, another important point is that the postal code filtering method can be changed, moved to another location, and postal codes for provinces and districts can be removed after neighborhood & village postal codes are added.

You can use the following query parameter (you should set it to true) to activate the postal code feature for this routes: Get All Provinces, Get Exact Province, Get All Districts, Get Exact District.

Firstly you should activate the postal code feature by setting the "activatePostalCodes" query parameter to true.

### Activate Postal Codes

- `activatePostalCodes` (boolean): It activates the postal code feature. [Default: false]

Then you can use the following query parameters to filter the provinces and districts by postal code:

- `postalCode` (string): It shows all the provinces/districts containing or matching your search query.

Although postal codes consist only of digits, they are still a string type. This is because postal codes can start with zero.

## License

[MIT](./LICENSE)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

<!-- ## Templates

[Index](https://ubeydeozdmr.github.io/turkiye-api-templates/index.html)

[v1](https://ubeydeozdmr.github.io/turkiye-api-templates/v1/index.html) -->

## Contact

You can contact me via [email](mailto:ubeydeozdmr@gmail.com) or [Telegram](https://t.me/ubeydeozdmr).

## Support

GitHub Sponsors and Buy Me a Coffee are the best ways to support me. Your support helps me to cover the server expenses and continue developing and improving the API.

<a href="https://www.buymeacoffee.com/ubeydeozdmr"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="buymeacoffee button" width="150" /></a>
