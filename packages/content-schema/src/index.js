export const CONTENT_STATUSES = ['synthetic', 'pending-review', 'approved'];
export function validateContent(item) {
  const required = ['title', 'quote', 'attribution', 'location', 'date', 'photoAsset', 'licenseRecord', 'approvalStatus', 'sourceUrl'];
  const missing = required.filter((key) => !item || !item[key]);
  if (missing.length) throw new Error(`content missing: ${missing.join(', ')}`);
  if (!CONTENT_STATUSES.includes(item.approvalStatus)) throw new Error('invalid approval status');
  return item;
}
