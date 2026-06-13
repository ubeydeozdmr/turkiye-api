interface RowWithId {
  readonly id: number;
}

export function buildIdMap<Row extends RowWithId>(rows: readonly Row[], label: string): ReadonlyMap<number, Row> {
  const map = new Map<number, Row>();

  for (const row of rows) {
    if (map.has(row.id)) {
      throw new Error(`Duplicate id "${row.id}" found while building ${label}.`);
    }

    map.set(row.id, row);
  }

  return map;
}

export function buildGroupMap<Row>(
  rows: readonly Row[],
  getGroupId: (row: Row) => number,
): ReadonlyMap<number, readonly Row[]> {
  const groups = new Map<number, Row[]>();

  for (const row of rows) {
    const groupId = getGroupId(row);
    const group = groups.get(groupId);

    if (group === undefined) {
      groups.set(groupId, [row]);
      continue;
    }

    group.push(row);
  }

  const readonlyGroups = new Map<number, readonly Row[]>();

  for (const [groupId, group] of groups) {
    readonlyGroups.set(groupId, Object.freeze(group));
  }

  return readonlyGroups;
}

export function getGroup<Row>(groups: ReadonlyMap<number, readonly Row[]>, groupId: number): readonly Row[] {
  return groups.get(groupId) ?? [];
}
