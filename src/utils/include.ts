export type IncludeName = string;
export type IncludeSelection<Include extends IncludeName> = readonly Include[];

export interface IncludeParseSuccess<Include extends IncludeName> {
  readonly ok: true;
  readonly includes: IncludeSelection<Include>;
}

export interface IncludeParseFailure {
  readonly ok: false;
  readonly message: string;
}

export type IncludeParseResult<Include extends IncludeName> = IncludeParseSuccess<Include> | IncludeParseFailure;

export const PROVINCE_INCLUDES = ['districts', 'municipalities', 'neighborhoods', 'villages'] as const;

export const DISTRICT_INCLUDES = ['province', 'municipalities', 'neighborhoods', 'villages'] as const;

export const MUNICIPALITY_INCLUDES = ['province', 'district', 'neighborhoods'] as const;

export const NEIGHBORHOOD_INCLUDES = ['province', 'district', 'municipality'] as const;

export const VILLAGE_INCLUDES = ['province', 'district'] as const;

export type ProvinceInclude = (typeof PROVINCE_INCLUDES)[number];
export type DistrictInclude = (typeof DISTRICT_INCLUDES)[number];
export type MunicipalityInclude = (typeof MUNICIPALITY_INCLUDES)[number];
export type NeighborhoodInclude = (typeof NEIGHBORHOOD_INCLUDES)[number];
export type VillageInclude = (typeof VILLAGE_INCLUDES)[number];

export function parseIncludes<Include extends IncludeName>(
  rawIncludes: string | undefined,
  allowedIncludes: readonly Include[],
): IncludeParseResult<Include> {
  if (rawIncludes === undefined) {
    return { ok: true, includes: [] };
  }

  const allowedIncludeSet = new Set<string>(allowedIncludes);
  const includes = rawIncludes.split(',').map((include) => include.trim());

  if (includes.some((include) => include.length === 0)) {
    return {
      ok: false,
      message: 'include must be a comma-separated list of include names.',
    };
  }

  const unknownIncludes = includes.filter((include) => !allowedIncludeSet.has(include));

  if (unknownIncludes.length > 0) {
    return {
      ok: false,
      message: `Unknown include(s): ${unknownIncludes.join(', ')}.`,
    };
  }

  const uniqueIncludes: Include[] = [];
  const seenIncludes = new Set<string>();

  for (const include of includes) {
    if (seenIncludes.has(include)) {
      continue;
    }

    seenIncludes.add(include);
    uniqueIncludes.push(include as Include);
  }

  return { ok: true, includes: uniqueIncludes };
}

export function hasInclude<Include extends IncludeName>(
  includes: IncludeSelection<Include>,
  include: Include,
): boolean {
  return includes.includes(include);
}
