# Contributing

Thanks for taking the time to improve TurkiyeAPI.

## What to Contribute

Good contributions include:

- Bug fixes for API behavior, validation, caching, logging, or rate limiting.
- Corrections to administrative-division data with verifiable public sources.
- Tests that cover existing behavior or prevent regressions.
- Documentation improvements for setup, examples, response shapes, or migration notes.
- Performance improvements that preserve the public API contract.

Please avoid unrelated refactors in the same pull request as a behavior change.

## Development Setup

Requirements:

- Node.js `>=22 <23`
- npm

Install dependencies:

```sh
npm install
```

Run the development server:

```sh
npm run dev
```

The local server listens on `http://localhost:3000` by default. You can override the host and port:

```sh
PORT=4000 HOST=127.0.0.1 npm run dev
```

## Checks

Run these before opening a pull request:

```sh
npm run format:check
npm run typecheck
npm test
npm run build
```

CI also builds the Docker image.

## Data Changes

Dataset changes should be easy to audit. Include the source and reasoning in the pull request description.

Preferred sources include:

- TÜİK MEDAS
- PTT Kargo postal code data
- T.C. MSB Harita Genel Müdürlüğü area data
- Türk Telekom phone area code data
- OpenStreetMap admin_centre coordinates

For estimated or derived postal codes, explain why the value is not marked `official` and how it was inferred.

## API Changes

TurkiyeAPI v2 is the current stable API. Pull requests should preserve existing response shapes, error codes, pagination behavior, filter semantics, cache headers, and rate-limit headers unless the change is explicitly intended to be breaking.

When adding or changing behavior:

- Update the relevant TypeBox schemas.
- Update OpenAPI output when applicable.
- Add focused tests under `tests/`.
- Update `README.md` or external documentation links if public behavior changes.

## Logging and Privacy

Do not add logging for request bodies, response bodies, cookies, authorization headers, API keys, full query parameter values, or other unnecessary personal data. Application logs should stay limited to operational metadata.

See [PRIVACY.md](./PRIVACY.md) and [SECURITY.md](./SECURITY.md) for more details.

## Pull Requests

Open a pull request with:

- A short summary of the change.
- The reason for the change.
- Test results.
- Data sources, if the change touches datasets.
- Any compatibility risks.
