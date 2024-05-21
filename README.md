# Turkiye API

API containing information about Turkey's provinces, districts, neighborhoods and villages.

## IMPORTANT ANNOUNCEMENT (for cyclic.sh users)

The use of the cyclic.sh service will be discontinued starting from May 10, 2024.

Read more: [https://www.cyclic.sh/posts/cyclic-is-shutting-down/](https://www.cyclic.sh/posts/cyclic-is-shutting-down/)

If you are using one of the [https://turkiyeapi.dev](https://turkiyeapi.dev) or [https://turkiyeapi.herokuapp.com](https://turkiyeapi.herokuapp.com) domains, you do not need to worry. The API will continue to work without any problems.

However, if you are using the cyclic.sh domain, you must update your code with a new domain in May 2024, otherwise the parts of your site, program etc. that use TurkiyeAPI will not work.

You can review the "Domain Names" subheading below.

## Domain names

The API uses [turkiyeapi.dev](https://turkiyeapi.dev) as the main domain. But you can still use the following domains:

- [turkiyeapi.herokuapp.com](https://turkiyeapi.herokuapp.com)

We recommend using turkiyeapi.dev domain. If you are using the cyclic.sh domain, you must update your code with a new domain in May 2024.

## What's new?

> _Latest update: March 1, 2024_

- Neighborhoods and villages have been added to the API. (Experimental)
- Swagger UI has been added to the API. You can now use the API with the Swagger UI.
- Population data has been updated from 2021 to 2023. (2023 data has been released by TUIK, early 2024)

## Sources

- [Population of districts](https://biruni.tuik.gov.tr/medas)
- [Area of districts](https://web.archive.org/web/20190416051733/https://www.harita.gov.tr/images/urun/il_ilce_alanlari.pdf)

## Documentation

- [API Documentation](https://turkiyeapi.dev/docs)
- [Examples](https://turkiyeapi.dev/examples)
- [Postman Collection](https://documenter.getpostman.com/view/19561492/UzBguVHM)
- [Swagger UI](https://turkiyeapi.dev/swagger)

## Last Considerations

The v1 version seems to have started to lose its developability and maintainability. When I first started developing the project in 2022 (I had just started my first year of university at that time), the name of the project (and of course also the repository) was "Provinces of Turkey API". The reason for this is that during the first few months when the API was first developed, you could only retrieve province information (Also, this information consisted of only five properties: id, name, population, areaCode and isMetropolitan). Over time, I focused on fixing the bugs of the API and adding new features (one of them was districts). Over time, districts became a schema in their own right, just like provinces, but instead of being written separately with an ID-Key connection, these districts were written in the district arrays of the relevant provinces in the same json file. This is the first problem, I have largely solved this problem for v1, but there are still some problems. The second problem was that there was no support for query parameters at first. These parameters were added step by step over time (first added "name, offset, limit", then filtering parameters, then fields, lastly sort).

It is not easy to write the code from scratch without breaking the API requests of v1 users, however, I want to spare time for other projects and other work. That's why I'm taking a long break for this project. When the time comes, I will most likely start writing v2. Things I need to examine other sample APIs and also decide:

- Should I use database in v2 as opposed to v1?
- What kind of project structure should I create?
- Should I prefer snake_case instead of camelCase? (like area_code instead of areaCode)
- What kind of route structure should I use? (Should I use routes like "/provinces/34/districts/1852" instead of separate routes for provinces, districts, etc.?
- Municipality support was not added to v1 because it would have been a bit complicated if I had added it.
- What kind of connection should there be between Schemas? (How exactly can we position the municipalities when there is an order like provinces > districts > neighborhoods + villages)
- fields property cannot set quadratic (or more nested) props, also sort property does not work for all fields. How can I find a solution to this?
- Many more things I can't think of right now.

Because of all this, this time I will try to improve myself in terms of learning and plan well this time. The project has come a long way from when it first started and has much more advanced capabilities. Frankly, I think I've added enough features and made improvements to last until v2. I need some time to realize the things I plan to do for v2, so I'm taking a long break. When v2 is released (if it is released) it will have better and more descriptive documentation, be more systematic and expandable. You can still submit your suggestions, requests, etc. by opening an issue on the Türkiye API GitHub page. you can write. In this case, I will also consider these for v2.

Best wishes!

## Usage of API

## Provinces

### Get All Provinces

**Endpoint:** `GET /api/v1/provinces`

You can use this route to get data for all provinces. The available query parameters are:

- `name` (string): It shows all the provinces containing or matching your search query.
- `minPopulation` (number): It shows all the provinces with a population greater than or equal to the value you entered.
- `maxPopulation` (number): It shows all the provinces with a population less than or equal to the value you entered.
- `isMetropolitan` (boolean): It shows all the provinces that are metropolitan or not.
- `offset` (number): Used for pagination. Use this to set a starting point in search results.
- `limit` (number): Used for pagination. Use this to set the maximum number of results to show you.
- `fields` (string): It shows the fields you want to see in the response.
- `sort` (string): It sorts the results in ascending or descending order.

### Get Exact Province

**Endpoint:** `GET /api/v1/provinces/:id`

You can use this route to get data for exact province. The available path variables and query parameters are:

- `id` (Path Variable): ID of province
- `fields` (Query Parameter, string): It shows the fields you want to see in the response.
- `extend` (Query Parameter, boolean): It shows the extended data (neighborhoods and villages) of the province. [Default: false] (This is an experimental feature. It may not work properly.)

## Districts

### Get All Districts

**Endpoint:** `GET /api/v1/districts`

You can use this route to get data for all districts. The available query parameters are:

- `name` (string): It shows all the districts containing or matching your search query.
- `minPopulation` (number): It shows all the districts with a population greater than or equal to the value you entered.
- `maxPopulation` (number): It shows all the districts with a population less than or equal to the value you entered.
- `offset` (number): Used for pagination. Use this to set a starting point in search results.
- `limit` (number): Used for pagination. Use this to set the maximum number of results to show you.
- `fields` (string): It shows the fields you want to see in the response.
- `sort` (string): It sorts the results in ascending or descending order.

### Get Exact District

**Endpoint:** `GET /api/v1/districts/:id`

You can use this route to get data for exact district. The available path variables and query parameters are:

- `id` (Path Variable): ID of district
- `fields` (Query Parameter, string): It shows the fields you want to see in the response.

## Neighborhoods

### Get All Neighborhoods

**Endpoint:** `GET /api/v1/neighborhoods`

You can use this route to get data for all neighborhoods. This is a recently added endpoint and is experimental. It may not work properly. The available query parameters are:

- `name` (string): It shows all the neighborhoods containing or matching your search query.
- `minPopulation` (number): It shows all the neighborhoods with a population greater than or equal to the value you entered.
- `maxPopulation` (number): It shows all the neighborhoods with a population less than or equal to the value you entered.
- `offset` (number): Used for pagination. Use this to set a starting point in search results.
- `limit` (number): Used for pagination. Use this to set the maximum number of results to show you.
- `fields` (string): It shows the fields you want to see in the response.
- `sort` (string): It sorts the results in ascending or descending order.

### Get Exact Neighborhood

**Endpoint:** `GET /api/v1/neighborhoods/:id`

You can use this route to get data for exact neighborhood. This is a recently added endpoint and is experimental. It may not work properly. The available path variables and query parameters are:

- `id` (Path Variable): ID of neighborhood
- `fields` (Query Parameter, string): It shows the fields you want to see in the response.

## Villages

### Get All Villages

**Endpoint:** `GET /api/v1/villages`

You can use this route to get data for all villages. This is a recently added endpoint and is experimental. It may not work properly. The available query parameters are:

- `name` (string): It shows all the villages containing or matching your search query.
- `minPopulation` (number): It shows all the villages with a population greater than or equal to the value you entered.
- `maxPopulation` (number): It shows all the villages with a population less than or equal to the value you entered.
- `offset` (number): Used for pagination. Use this to set a starting point in search results.
- `limit` (number): Used for pagination. Use this to set the maximum number of results to show you.
- `fields` (string): It shows the fields you want to see in the response.
- `sort` (string): It sorts the results in ascending or descending order.

### Get Exact Village

**Endpoint:** `GET /api/v1/villages/:id`

You can use this route to get data for exact village. This is a recently added endpoint and is experimental. It may not work properly. The available path variables and query parameters are:

- `id` (Path Variable): ID of village
- `fields` (Query Parameter, string): It shows the fields you want to see in the response.

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Templates

[Index](https://ubeydeozdmr.github.io/turkiye-api-templates/index.html)

[v1](https://ubeydeozdmr.github.io/turkiye-api-templates/v1/index.html)
