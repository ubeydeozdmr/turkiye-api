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

## TurkiyeAPI v2 has been released

For a detailed migration guide from v1, see [Migration from v1](https://docs.turkiyeapi.dev/en/v2/guide/migration-from-v1.html).

### Added

- Added the `/v2` API prefix.
- Added metadata-rich response envelopes with `data` and `meta`.
- Added structured error responses with stable `error.code`, `error.message`, and `error.status` fields.
- Added explicit relationship loading with `include` and nested collection routes.
- Added first-class `municipalities` resources, including province center, district center, and town municipality types.
- Added static JSON dataset downloads under `/v2/datasets`.
- Added versioned dataset downloads, such as `/v2/datasets/2025/provinces.json`.
- Added `/v2/meta` for API, dataset, source, and record count metadata.
- Added OpenAPI 3.1 output at `/v2/openapi.json`.
- Added postal code filters for neighborhood and village list endpoints.

### Changed

- Standardized list pagination with `limit`, `offset`, `meta.count`, and `meta.total`.
- Standardized search around the `search` query parameter.
- Replaced parent name filters with ID filters and nested routes.
- Made related resources opt-in instead of embedding them by default.
- Tightened query parameter, field selection, hierarchy, and range validation.
- Moved scalar measurement fields such as `area` and `altitude` into structured objects with `value` and `unit`.
- Replaced `areaCode` with `phoneAreaCodes`.
- Modeled postal codes only on neighborhood and village records with `postalCode` and `postalCodeStatus`.

### Removed

- Removed support for the legacy `/api/v1` prefix in v2.
- Removed the top-level `status` field from successful responses.
- Removed `extend=true`; use `include` or nested routes instead.
- Removed `/towns`; use `/v2/municipalities?type=town` for town municipalities.
- Removed `activatePostalCodes`; postal code fields are returned directly where supported.

Base v2 URL: `https://api.turkiyeapi.dev/v2`

[v2 GitHub Source Code](https://github.com/ubeydeozdmr/turkiye-api/tree/v2)

[v2 Documentation (Guide)](https://docs.turkiyeapi.dev/en/v2/guide/)

[v2 Documentation (API Reference)](https://docs.turkiyeapi.dev/en/v2/api-reference/)

[Postman Collection for v2](https://documenter.getpostman.com/view/19561492/UzBguVHM)

[Provide feedback for v2 (GitHub Issues)](https://github.com/ubeydeozdmr/turkiye-api/issues/58#issuecomment-4358464318)

[Provide feedback for v2 (Email)](mailto:ubeydeozdmr@gmail.com)

## Legacy v1

The v1 version of TurkiyeAPI is still available and will continue to be available for a while. However, it will not receive any new features or updates, and it may eventually be deprecated in the future. Therefore, it is recommended to use the v2 version of the API for new projects.

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
