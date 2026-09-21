/**
 * Lightweight workflow tests (stock math + ID sequencing) — run: node test-workflows.mjs
 */

function calculateAvailableStock(item) {
  const opening = parseFloat(item.openingStock || 0);
  const purchase = parseFloat(item.purchaseQty || 0);
  const salesReturn = parseFloat(item.salesReturnQty || 0);
  const sales = parseFloat(item.salesQty || 0);
  const purchaseReturn = parseFloat(item.purchaseReturnQty || 0);
  const adjustment = parseFloat(item.adjustmentQty || 0);
  const pcConsumed = parseFloat(item.pcConsumedQty || 0);
  const pcProduced = parseFloat(item.pcProducedQty || 0);
  const serviceConsumed = parseFloat(item.serviceConsumedQty || 0);
  return opening + purchase + salesReturn - sales - purchaseReturn + adjustment - pcConsumed + pcProduced - serviceConsumed;
}

function applyPurchase(item, qty) {
  item.purchaseQty = parseFloat(item.purchaseQty || 0) + qty;
}

function applyPurchaseReversal(item, qty) {
  item.purchaseQty = Math.max(0, parseFloat(item.purchaseQty || 0) - qty);
}

function nextSequentialDocumentId(prefix, year, existingIds) {
  let maxNum = 0;
  const pattern = new RegExp(`^${prefix}-${year}-(\\d+)$`, 'i');
  (existingIds || []).forEach(id => {
    const match = String(id || '').match(pattern);
    if (match) maxNum = Math.max(maxNum, parseInt(match[1], 10));
  });
  return `${prefix}-${year}-${String(maxNum + 1).padStart(4, '0')}`;
}

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) {
    passed++;
    console.log('  OK:', msg);
  } else {
    failed++;
    console.error('  FAIL:', msg);
  }
}

console.log('Purchase edit stock simulation');
{
  const item = { purchaseQty: 0 };
  applyPurchase(item, 10);
  assert(calculateAvailableStock(item) === 10, 'After purchase +10, stock is 10');
  applyPurchaseReversal(item, 10);
  applyPurchase(item, 15);
  assert(calculateAvailableStock(item) === 15, 'After edit reversal + new +15, stock is 15');
  applyPurchaseReversal(item, 15);
  assert(calculateAvailableStock(item) === 0, 'After remove bill reversal, stock is 0');
}

console.log('Job card ID sequencing after delete');
{
  const year = 2026;
  const ids = ['JC-2026-0001', 'JC-2026-0003'];
  const next = nextSequentialDocumentId('JC', year, ids);
  assert(next === 'JC-2026-0004', 'Next JC is 0004 not length+1');
}

console.log('Minimum stock parsing (mirrors app.js parseMinStockField)');
function parseMinStockField(rawValue) {
  if (rawValue === '' || rawValue === null || rawValue === undefined) {
    return { ok: false };
  }
  const minStock = parseFloat(String(rawValue).trim());
  if (!Number.isFinite(minStock) || minStock < 0) return { ok: false };
  return { ok: true, value: minStock };
}
assert(parseMinStockField('0').ok && parseMinStockField('0').value === 0, 'Min stock 0 is valid');
assert(parseMinStockField('5').ok && parseMinStockField('5').value === 5, 'Min stock 5 is valid');
assert(!parseMinStockField('').ok, 'Empty min stock is invalid');

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed > 0 ? 1 : 0);
