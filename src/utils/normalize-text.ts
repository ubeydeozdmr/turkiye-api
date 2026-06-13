export function normalizeText(text: string): string {
  return text.normalize('NFC').toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ').trim();
}

export function includesNormalizedText(value: string, search: string): boolean {
  return normalizeText(value).includes(normalizeText(search));
}
