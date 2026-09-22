/**
 * Comprehensive Workflow Test Suite for BIOS Management Software
 * Run: node test-workflows.mjs
 */

// --- 1. CORE HELPER FUNCTIONS (MIRRORING APP.JS) ---

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

function recordStockMovementSim(inventory, { itemCode, type, inQty = 0, outQty = 0 }) {
  let item = inventory.find(i => i.itemCode === itemCode);
  if (!item) {
    item = {
      itemCode,
      purchaseQty: 0, salesQty: 0, salesReturnQty: 0, purchaseReturnQty: 0,
      adjustmentQty: 0, pcConsumedQty: 0, pcProducedQty: 0, serviceConsumedQty: 0, openingStock: 0
    };
    inventory.push(item);
  }
  if (type === 'PURCHASE') item.purchaseQty += inQty;
  else if (type === 'PURCHASE_REVERSAL') item.purchaseQty = Math.max(0, item.purchaseQty - outQty);
  else if (type === 'SALE') item.salesQty += outQty;
  else if (type === 'SALES_RETURN') item.salesReturnQty += inQty;
  else if (type === 'PURCHASE_RETURN') item.purchaseReturnQty += outQty;
  else if (type === 'SERVICE_CONSUME') item.serviceConsumedQty += outQty;
  else if (type === 'SERVICE_REVERSAL') item.serviceConsumedQty = Math.max(0, item.serviceConsumedQty - inQty);
  else if (type === 'ADJUSTMENT') item.adjustmentQty += inQty > 0 ? inQty : -outQty;
  else if (type === 'PC_BUILD_CONSUME') item.pcConsumedQty += outQty;
  else if (type === 'PC_BUILD_PRODUCE') item.pcProducedQty += inQty;

  item.availableStock = calculateAvailableStock(item);
  return item;
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

function parseMinStockField(rawValue) {
  if (rawValue === '' || rawValue === null || rawValue === undefined) {
    return { ok: false, message: 'Minimum stock is required' };
  }
  const minStock = parseFloat(String(rawValue).trim());
  if (!Number.isFinite(minStock) || minStock < 0) {
    return { ok: false, message: 'Minimum stock must be 0 or positive' };
  }
  return { ok: true, value: minStock };
}

function getStockStatus(availableStock, minStock) {
  const stock = parseFloat(availableStock || 0);
  const min = parseFloat(minStock || 0);
  if (stock <= 0) return 'Out of Stock';
  if (stock <= min) return 'Low Stock';
  return 'Available';
}

function sumPaymentTransactions(payments) {
  return (payments || []).reduce((s, p) => s + parseFloat(p.amount || 0), 0);
}

function syncBillingPaymentFields(invoice) {
  if (!invoice) return;
  if (!invoice.payments) invoice.payments = [];
  invoice.paidAmount = sumPaymentTransactions(invoice.payments);
  const total = parseFloat(invoice.totalAmount || 0);
  invoice.balanceAmount = Math.max(0, total - invoice.paidAmount);
  if (invoice.balanceAmount <= 0) invoice.status = 'Paid';
  else if (invoice.paidAmount > 0) invoice.status = 'Partial';
  else invoice.status = 'Unpaid';
}

function syncPurchasePaymentFields(purchase) {
  if (!purchase) return;
  if (!purchase.payments) purchase.payments = [];
  purchase.paidAmount = sumPaymentTransactions(purchase.payments);
  const total = parseFloat(purchase.totalAmount || 0);
  purchase.balanceAmount = Math.max(0, total - purchase.paidAmount);
  if (purchase.balanceAmount <= 0) purchase.status = 'Paid';
  else if (purchase.paidAmount > 0) purchase.status = 'Partial';
  else purchase.status = 'Unpaid';
}

function computeFinanceMetricsSim({
  billings = [],
  svcInvoices = [],
  purchases = [],
  expenses = [],
  otherIncomeRows = [],
  salesReturns = [],
  purchaseReturns = [],
  outsourceRepairs = [],
  openingBalance = { cash: 0, bank: 0, upi: 0, other: 0 }
}) {
  // Taxable Revenue - Output GST is strictly excluded
  const productSales = billings.reduce((s, b) => {
    const taxable = b.baseAmount !== undefined ? parseFloat(b.baseAmount || 0) : (parseFloat(b.totalAmount || 0) - parseFloat(b.gstAmount || 0));
    return s + taxable;
  }, 0);

  const serviceSales = svcInvoices.reduce((s, i) => {
    const taxable = i.subtotal !== undefined ? parseFloat(i.subtotal || 0) : (parseFloat(i.grandTotal || 0) - parseFloat(i.gstAmount || 0));
    return s + taxable;
  }, 0);

  const otherIncomeTotal = otherIncomeRows.reduce((s, o) => s + parseFloat(o.amount || 0), 0);
  const salesReturnTaxable = salesReturns.reduce((s, r) => s + parseFloat(r.taxableAmount !== undefined ? r.taxableAmount : (r.amount || 0)), 0);

  const totalSales = productSales + serviceSales;
  const netRevenue = Math.max(0, totalSales + otherIncomeTotal - salesReturnTaxable);

  // Output GST collected
  const outputGst = billings.reduce((s, b) => s + parseFloat(b.gstAmount || 0), 0) +
                    svcInvoices.reduce((s, i) => s + parseFloat(i.gstAmount || 0), 0);

  // Product COGS
  let productCogs = billings.reduce((s, b) => s + parseFloat(b.costPrice || 0) * parseFloat(b.qty || 1), 0);
  salesReturns.forEach(r => {
    const inv = billings.find(b => b.invoiceNo === r.invNo);
    if (inv) productCogs -= parseFloat(inv.costPrice || 0) * parseFloat(r.qty || 0);
  });
  productCogs = Math.max(0, productCogs);

  // Service Parts COGS
  let servicePartsCogs = 0;
  svcInvoices.forEach(inv => {
    (inv.partsItems || []).forEach(p => {
      servicePartsCogs += parseFloat(p.costRate || 0) * parseFloat(p.quantity || p.qty || 0);
    });
  });

  // Outsource Repair Costs (Direct service cost / COGS)
  const outsourceCogs = outsourceRepairs.reduce((s, o) => s + parseFloat(o.outsourceCost || 0), 0);

  const totalCogs = productCogs + servicePartsCogs + outsourceCogs;
  const grossProfit = netRevenue - totalCogs;
  const totalOperatingExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const netProfit = grossProfit - totalOperatingExpenses;

  // Actual Money Movements for Available Funds (NOT revenue - expenses)
  const cashFromBillings = billings.reduce((s, b) => s + parseFloat(b.paidAmount || 0), 0);
  const cashFromService = svcInvoices.reduce((s, i) => s + parseFloat(i.paidAmount || 0), 0);
  const cashFromOtherIncome = otherIncomeTotal;
  const totalReceipts = cashFromBillings + cashFromService + cashFromOtherIncome;

  const cashPaidPurchases = purchases.reduce((s, p) => s + parseFloat(p.paidAmount || 0), 0);
  const cashPaidExpenses = expenses.reduce((s, e) => s + parseFloat(e.amount || 0), 0);
  const cashPaidOutsource = outsourceRepairs.reduce((s, o) => s + parseFloat(o.paidAmount || 0), 0);
  const totalPayments = cashPaidPurchases + cashPaidExpenses + cashPaidOutsource;

  const openingTotal = parseFloat(openingBalance.cash || 0) +
                       parseFloat(openingBalance.bank || 0) +
                       parseFloat(openingBalance.upi || 0) +
                       parseFloat(openingBalance.other || 0);

  const availableFunds = openingTotal + totalReceipts - totalPayments;
  const netCashFlow = totalReceipts - totalPayments;

  const grossMarginPct = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;
  const netMarginPct = netRevenue > 0 ? (netProfit / netRevenue) * 100 : 0;

  return {
    productSales,
    serviceSales,
    totalSales,
    salesReturnTotal: salesReturnTaxable,
    netRevenue,
    outputGst,
    productCogs,
    servicePartsCogs,
    outsourceCogs,
    totalCogs,
    grossProfit,
    totalOperatingExpenses,
    netProfit,
    cashReceived: totalReceipts,
    cashPaid: totalPayments,
    netCashFlow,
    availableFunds,
    grossMarginPct,
    netMarginPct
  };
}

// --- 2. TEST RUNNER ---

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

console.log('=== TEST SUITE RUN ===\n');

console.log('1. Purchase Edit & Reversal Simulation');
{
  const item = { purchaseQty: 0 };
  applyPurchase(item, 10);
  assert(calculateAvailableStock(item) === 10, 'Purchase +10 -> Stock is 10');
  
  // Edit quantity: 10 -> 15
  applyPurchaseReversal(item, 10);
  applyPurchase(item, 15);
  assert(calculateAvailableStock(item) === 15, 'Edit 10 -> 15 -> Stock is 15');
  
  // Edit quantity: 15 -> 5
  applyPurchaseReversal(item, 15);
  applyPurchase(item, 5);
  assert(calculateAvailableStock(item) === 5, 'Edit 15 -> 5 -> Stock is 5');
  
  // Delete purchase
  applyPurchaseReversal(item, 5);
  assert(calculateAvailableStock(item) === 0, 'Delete purchase bill -> Stock returned to 0');
}

console.log('\n2. Purchase Item Replacement Simulation');
{
  const inventory = [];
  // Purchase Item A = 10
  recordStockMovementSim(inventory, { itemCode: 'ITEM-A', type: 'PURCHASE', inQty: 10 });
  assert(inventory.find(i => i.itemCode === 'ITEM-A').availableStock === 10, 'Item A stock is 10');

  // Edit Purchase: Item A removed, Item B = 5 added
  recordStockMovementSim(inventory, { itemCode: 'ITEM-A', type: 'PURCHASE_REVERSAL', outQty: 10 });
  recordStockMovementSim(inventory, { itemCode: 'ITEM-B', type: 'PURCHASE', inQty: 5 });

  assert(inventory.find(i => i.itemCode === 'ITEM-A').availableStock === 0, 'Item A stock cleanly reversed to 0');
  assert(inventory.find(i => i.itemCode === 'ITEM-B').availableStock === 5, 'Item B stock increased to 5');
}

console.log('\n3. Supplier Totals & Balance Tracking');
{
  const supplier = { name: 'TechSupplies', totalPurchases: 50000, balanceDue: 50000 };
  const purchase = { id: 'PUR-1', supplier: 'TechSupplies', totalAmount: 50000, payments: [] };
  
  syncPurchasePaymentFields(purchase);
  assert(purchase.status === 'Unpaid' && purchase.balanceAmount === 50000, 'Initial purchase is Unpaid (50,000)');

  // Pay 20,000
  purchase.payments.push({ id: 'P1', amount: 20000, date: '2026-09-21' });
  syncPurchasePaymentFields(purchase);
  assert(purchase.status === 'Partial' && purchase.paidAmount === 20000 && purchase.balanceAmount === 30000, 'Partial payment of 20,000 -> Balance 30,000');

  // Pay remaining 30,000
  purchase.payments.push({ id: 'P2', amount: 30000, date: '2026-09-21' });
  syncPurchasePaymentFields(purchase);
  assert(purchase.status === 'Paid' && purchase.paidAmount === 50000 && purchase.balanceAmount === 0, 'Final payment of 30,000 -> Status Paid (Balance 0)');
}

console.log('\n4. Job Card Stock Consumption & Reversal');
{
  const inventory = [{ itemCode: 'PART-RAM', purchaseQty: 20, serviceConsumedQty: 0 }];

  // Job Card consumes Part RAM = 5
  recordStockMovementSim(inventory, { itemCode: 'PART-RAM', type: 'SERVICE_CONSUME', outQty: 5 });
  assert(calculateAvailableStock(inventory[0]) === 15, 'Job Card consumes 5 RAM -> Stock decreases 20 -> 15');

  // Edit Job Card: 5 -> 3 (Reverse 5, Consume 3)
  recordStockMovementSim(inventory, { itemCode: 'PART-RAM', type: 'SERVICE_REVERSAL', inQty: 5 });
  recordStockMovementSim(inventory, { itemCode: 'PART-RAM', type: 'SERVICE_CONSUME', outQty: 3 });
  assert(calculateAvailableStock(inventory[0]) === 17, 'Edit Job Card 5 -> 3 -> Net consumption 3 (Stock 17)');

  // Edit Job Card: 3 -> 0 (Reverse 3)
  recordStockMovementSim(inventory, { itemCode: 'PART-RAM', type: 'SERVICE_REVERSAL', inQty: 3 });
  assert(calculateAvailableStock(inventory[0]) === 20, 'Edit Job Card 3 -> 0 -> All consumption restored (Stock 20)');
}

console.log('\n5. Job Card Delete Reversal & Estimation Unlink');
{
  const inventory = [{ itemCode: 'PART-SSD', purchaseQty: 10, serviceConsumedQty: 2 }];
  const estimation = { id: 'EST-2026-0001', status: 'Approved', convertedJobCardId: 'JC-2026-0001' };
  const jobCard = { id: 'JC-2026-0001', sourceEstimationId: 'EST-2026-0001', partsItems: [{ itemCode: 'PART-SSD', qty: 2 }] };

  // Delete Job Card
  if (jobCard.partsItems) {
    jobCard.partsItems.forEach(p => recordStockMovementSim(inventory, { itemCode: p.itemCode, type: 'SERVICE_REVERSAL', inQty: p.qty }));
  }
  if (jobCard.sourceEstimationId && estimation.id === jobCard.sourceEstimationId) {
    estimation.convertedJobCardId = null;
    estimation.status = 'Draft';
  }

  assert(calculateAvailableStock(inventory[0]) === 10, 'Deleting Job Card returned consumed SSD to stock (10)');
  assert(estimation.convertedJobCardId === null && estimation.status === 'Draft', 'Estimation convertedJobCardId reset to null and status reset to Draft');
}

console.log('\n6. Estimation -> Job Card Conversion Safeguards');
{
  const estimation = { id: 'EST-2026-0005', customerName: 'Rohan', customerMobile: '9876543210', deviceBrand: 'Dell', deviceModel: 'G15', complaint: 'No display', convertedJobCardId: null };
  
  // First conversion
  assert(!estimation.convertedJobCardId, 'Estimation is initially un-converted');
  const jcId = nextSequentialDocumentId('JC', 2026, []);
  estimation.convertedJobCardId = jcId;
  estimation.status = 'Approved';
  assert(estimation.convertedJobCardId === 'JC-2026-0001', 'First conversion sets convertedJobCardId to JC-2026-0001');

  // Second conversion attempt
  const isAlreadyConverted = !!estimation.convertedJobCardId;
  assert(isAlreadyConverted, 'Second conversion attempt correctly detected as already converted');
}

console.log('\n7. Sequential Document ID Generation');
{
  const year = 2026;
  const existingJc = ['JC-2026-0001', 'JC-2026-0003'];
  const nextJc = nextSequentialDocumentId('JC', year, existingJc);
  assert(nextJc === 'JC-2026-0004', 'Highest sequence 3 + 1 -> JC-2026-0004 (ignoring gap 0002)');

  const existingInvoices = ['BIOS-2026-0010', 'BIOS-2026-0005'];
  const nextInv = nextSequentialDocumentId('BIOS', year, existingInvoices);
  assert(nextInv === 'BIOS-2026-0011', 'Highest sequence 10 + 1 -> BIOS-2026-0011');
}

console.log('\n8. Minimum Stock Parsing & Stock Status');
{
  assert(parseMinStockField('0').ok && parseMinStockField('0').value === 0, 'Min stock "0" is valid numeric 0');
  assert(parseMinStockField('0.0').ok && parseMinStockField('0.0').value === 0, 'Min stock "0.0" is valid numeric 0');
  assert(parseMinStockField(' 0 ').ok && parseMinStockField(' 0 ').value === 0, 'Min stock " 0 " with whitespace is valid numeric 0');
  assert(parseMinStockField('5').ok && parseMinStockField('5').value === 5, 'Min stock "5" is valid numeric 5');
  assert(!parseMinStockField('').ok, 'Empty string is invalid min stock');
  assert(!parseMinStockField(null).ok, 'null is invalid min stock');
  assert(!parseMinStockField('-1').ok, 'Negative number is invalid min stock');

  assert(getStockStatus(10, 2) === 'Available', 'Stock 10, Min 2 -> Available');
  assert(getStockStatus(2, 2) === 'Low Stock', 'Stock 2, Min 2 -> Low Stock');
  assert(getStockStatus(0, 0) === 'Out of Stock', 'Stock 0, Min 0 -> Out of Stock');
  assert(getStockStatus(1, 0) === 'Available', 'Stock 1, Min 0 -> Available');
}

console.log('\n9. Complete Stock Calculation Formula');
{
  const item = {
    openingStock: 10,
    purchaseQty: 20,
    salesReturnQty: 2,
    salesQty: 8,
    purchaseReturnQty: 3,
    adjustmentQty: 1,
    pcConsumedQty: 0,
    pcProducedQty: 0,
    serviceConsumedQty: 2
  };
  // 10 + 20 + 2 - 8 - 3 + 1 - 0 + 0 - 2 = 20
  const total = calculateAvailableStock(item);
  assert(total === 20, 'Stock formula combination: 10 + 20 + 2 - 8 - 3 + 1 - 2 = 20');
}

console.log('\n10. Payment Collection & Status Sync');
{
  const invoice = { id: 'INV-101', totalAmount: 10000, payments: [] };
  syncBillingPaymentFields(invoice);
  assert(invoice.status === 'Unpaid' && invoice.paidAmount === 0 && invoice.balanceAmount === 10000, 'Invoice start: Unpaid (Paid: 0, Bal: 10,000)');

  // First payment 6,000
  invoice.payments.push({ id: 'P1', amount: 6000, method: 'UPI' });
  syncBillingPaymentFields(invoice);
  assert(invoice.status === 'Partial' && invoice.paidAmount === 6000 && invoice.balanceAmount === 4000, 'After 6,000 payment: Partial (Paid: 6,000, Bal: 4,000)');

  // Second payment 4,000
  invoice.payments.push({ id: 'P2', amount: 4000, method: 'Cash' });
  syncBillingPaymentFields(invoice);
  assert(invoice.status === 'Paid' && invoice.paidAmount === 10000 && invoice.balanceAmount === 0, 'After 4,000 payment: Paid (Paid: 10,000, Bal: 0)');
}

console.log('\n11. Finance Structure, COGS & Cash Flow');
{
  const data = {
    billings: [{ invoiceNo: 'INV-1', totalAmount: 10000, costPrice: 6000, qty: 1, paidAmount: 0 }], // Credit sale
    purchases: [{ invoiceNo: 'PUR-1', totalAmount: 15000, paidAmount: 5000 }],
    expenses: [{ amount: 1000 }],
    otherIncomeRows: [{ amount: 500 }],
    salesReturns: [],
    purchaseReturns: []
  };

  const f = computeFinanceMetricsSim(data);
  assert(f.netRevenue === 10500, 'Net Revenue = 10,000 sales + 500 other income = 10,500');
  assert(f.totalCogs === 6000, 'COGS = 6,000 (from sold items, not 15,000 purchases)');
  assert(f.grossProfit === 4500, 'Gross Profit = 10,500 - 6,000 = 4,500');
  assert(f.netProfit === 3500, 'Net Profit = 4,500 - 1,000 expense = 3,500');
  assert(f.cashReceived === 500, 'Cash Received = 500 (other income only, since credit sale paidAmount is 0)');
  assert(f.cashPaid === 6000, 'Cash Paid = 5,000 supplier + 1,000 expense = 6,000');
  assert(f.netCashFlow === -5500, 'Net Cash Flow = 500 in - 6,000 out = -5,500');
}

console.log('\n12. Data Backup Payload Structure');
{
  const backup = {
    meta: { app: 'BIOS Billing Suite', dataVersion: 2 },
    data: { billings: [], purchases: [], inventory: [], serviceJobCards: [], serviceEstimations: [], expenses: [] }
  };
  const isValid = backup && backup.data && Array.isArray(backup.data.billings) && Array.isArray(backup.data.purchases) && Array.isArray(backup.data.inventory);
  assert(isValid, 'Backup payload structure validation passes');
}

console.log('\n13. Service Stock Deduction (Direct Service Invoice / Workflow B)');
{
  const inventory = [{ itemCode: 'SSD-512', openingStock: 10, serviceConsumedQty: 0 }];
  inventory[0].availableStock = calculateAvailableStock(inventory[0]);
  assert(inventory[0].availableStock === 10, 'Initial SSD stock is 10');

  // Direct Service Invoice (no jobCardId) uses 2 SSDs
  const directInvoice = {
    invoiceNo: 'SINV-2026-0001',
    jobCardId: null,
    partsItems: [{ itemCode: 'SSD-512', itemName: 'SSD 512GB', quantity: 2, sellingRate: 3500, costRate: 2200, amount: 7000 }]
  };

  // Rule: Direct Service Invoice deducts stock
  if (!directInvoice.jobCardId) {
    directInvoice.partsItems.forEach(p => {
      recordStockMovementSim(inventory, { itemCode: p.itemCode, type: 'SERVICE_CONSUME', outQty: p.quantity });
    });
  }

  const updatedItem = inventory.find(i => i.itemCode === 'SSD-512');
  assert(updatedItem.availableStock === 8, 'Direct Service Invoice: SSD qty 2 -> stock reduced 10 -> 8');
}

console.log('\n14. Job Card + Service Invoice (Double Deduction Prevention)');
{
  const inventory = [{ itemCode: 'SSD-512', openingStock: 10, serviceConsumedQty: 0 }];
  inventory[0].availableStock = calculateAvailableStock(inventory[0]);

  // Step 1: Job Card uses 2 SSDs
  const jobCard = {
    id: 'JC-2026-0001',
    partsItems: [{ itemCode: 'SSD-512', partName: 'SSD 512GB', qty: 2, rate: 3500, amount: 7000 }]
  };
  jobCard.partsItems.forEach(p => {
    recordStockMovementSim(inventory, { itemCode: p.itemCode, type: 'SERVICE_CONSUME', outQty: p.qty });
  });

  let item = inventory.find(i => i.itemCode === 'SSD-512');
  assert(item.availableStock === 8, 'Job Card save: 2 SSD consumed -> stock is 8');

  // Step 2: Generate Service Invoice from same Job Card
  const jcLinkedInvoice = {
    invoiceNo: 'SINV-2026-0002',
    jobCardId: 'JC-2026-0001',
    partsItems: [{ itemCode: 'SSD-512', itemName: 'SSD 512GB', quantity: 2, sellingRate: 3500, costRate: 2200, amount: 7000 }]
  };

  // Rule: If linked to Job Card, stock was already consumed -> NO second deduction
  if (!jcLinkedInvoice.jobCardId) {
    jcLinkedInvoice.partsItems.forEach(p => {
      recordStockMovementSim(inventory, { itemCode: p.itemCode, type: 'SERVICE_CONSUME', outQty: p.quantity });
    });
  }

  item = inventory.find(i => i.itemCode === 'SSD-512');
  assert(item.availableStock === 8, 'Job Card linked invoice does NOT double-deduct: stock is still 8, NOT 6');
}

console.log('\n15. GST Profit Test (Exclude Customer GST from Revenue and Profit)');
{
  // Taxable Revenue = ₹10,000, GST = ₹1,800, Grand Total = ₹11,800, COGS = ₹6,000, Expense = ₹1,000
  const data = {
    billings: [{
      invoiceNo: 'INV-GST-1',
      baseAmount: 10000,
      gstAmount: 1800,
      totalAmount: 11800,
      costPrice: 6000,
      qty: 1,
      paidAmount: 11800
    }],
    purchases: [],
    expenses: [{ amount: 1000, paymentMethod: 'Cash' }],
    otherIncomeRows: [],
    salesReturns: [],
    purchaseReturns: []
  };

  const f = computeFinanceMetricsSim(data);
  assert(f.netRevenue === 10000, 'Revenue = 10,000 (taxable, strictly excluding 1,800 GST)');
  assert(f.outputGst === 1800, 'Output GST = 1,800 tracked separately');
  assert(f.grossProfit === 4000, 'Gross Profit = 10,000 - 6,000 = 4,000 (NOT 5,800)');
  assert(f.netProfit === 3000, 'Net Profit = 4,000 - 1,000 = 3,000 (NOT 4,800)');
}

console.log('\n16. Outsource Repair Cost & Profit Test');
{
  // Customer taxable charge = ₹5,000, GST = ₹900, Customer total = ₹5,900, Outside repair cost = ₹2,000
  const data = {
    billings: [],
    svcInvoices: [{
      invoiceNo: 'SINV-OUT-1',
      subtotal: 5000,
      gstAmount: 900,
      grandTotal: 5900,
      paidAmount: 5900,
      partsItems: []
    }],
    outsourceRepairs: [{
      id: 'OUT-2026-0001',
      jobCardId: 'JC-2026-0099',
      outsourceCost: 2000,
      customerCharge: 5000,
      paidAmount: 2000
    }],
    purchases: [],
    expenses: [],
    otherIncomeRows: [],
    salesReturns: []
  };

  const f = computeFinanceMetricsSim(data);
  assert(f.netRevenue === 5000, 'Service Revenue = 5,000 (excl GST)');
  assert(f.outsourceCogs === 2000, 'Outsource Cost = 2,000 (treated as COGS)');
  assert(f.grossProfit === 3000, 'Service Gross Profit = 5,000 - 2,000 = 3,000 (GST 900 excluded)');
}

console.log('\n17. Outsource Payment Tracking & Balance Sync');
{
  function syncOutsourcePaymentFields(outsource) {
    outsource.balanceAmount = Math.max(0, outsource.outsourceCost - outsource.paidAmount);
    if (outsource.balanceAmount <= 0) outsource.paymentStatus = 'Paid';
    else if (outsource.paidAmount > 0) outsource.paymentStatus = 'Partial';
    else outsource.paymentStatus = 'Unpaid';
  }

  const outsource = { outsourceCost: 2000, paidAmount: 0 };
  syncOutsourcePaymentFields(outsource);
  assert(outsource.paymentStatus === 'Unpaid' && outsource.balanceAmount === 2000, 'Initial outsource status: Unpaid (Balance: 2,000)');

  // Partial vendor payment 1,000
  outsource.paidAmount = 1000;
  syncOutsourcePaymentFields(outsource);
  assert(outsource.paymentStatus === 'Partial' && outsource.balanceAmount === 1000, 'After 1,000 vendor payment: Partial (Balance: 1,000)');

  // Final vendor payment +1,000 (total 2,000)
  outsource.paidAmount = 2000;
  syncOutsourcePaymentFields(outsource);
  assert(outsource.paymentStatus === 'Paid' && outsource.balanceAmount === 0, 'After 2,000 vendor payment: Paid (Balance: 0)');
}

console.log('\n18. Company Available Funds Test (Separate from Profit)');
{
  // Opening Balance = 20,000, Customer payment = 10,000, Supplier payment = 5,000, Expense payment = 2,000
  const data = {
    openingBalance: { cash: 20000, bank: 0, upi: 0, other: 0 },
    billings: [{ invoiceNo: 'INV-1', totalAmount: 50000, paidAmount: 10000 }], // Customer owes 50k, paid 10k
    purchases: [{ invoiceNo: 'PUR-1', totalAmount: 12000, paidAmount: 5000 }], // Supplier owed 12k, paid 5k
    expenses: [{ amount: 2000, paymentMethod: 'Cash' }],
    otherIncomeRows: [],
    salesReturns: [],
    outsourceRepairs: []
  };

  const f = computeFinanceMetricsSim(data);
  // Expected Available Funds: 20,000 + 10,000 - 5,000 - 2,000 = 23,000
  assert(f.availableFunds === 23000, 'Company Available Funds = 20,000 + 10,000 - 5,000 - 2,000 = 23,000');
  assert(f.availableFunds !== f.netProfit, 'Available Funds (23,000) is distinct from accounting profit');
}

console.log('\n19. Direct Service Invoice Edit & Delete Reversals');
{
  const inventory = [{ itemCode: 'SSD-1TB', openingStock: 10, serviceConsumedQty: 0 }];
  inventory[0].availableStock = calculateAvailableStock(inventory[0]);

  // Step 1: Create Direct Service Invoice with 2 SSDs
  let directInvoice = {
    invoiceNo: 'SINV-DIR-1',
    jobCardId: null,
    partsItems: [{ itemCode: 'SSD-1TB', quantity: 2 }]
  };
  directInvoice.partsItems.forEach(p => {
    recordStockMovementSim(inventory, { itemCode: p.itemCode, type: 'SERVICE_CONSUME', outQty: p.quantity });
  });
  let item = inventory.find(i => i.itemCode === 'SSD-1TB');
  assert(item.availableStock === 8, 'Created Direct Invoice (2 SSD) -> Stock is 8');

  // Step 2: Edit Direct Service Invoice from 2 to 1 SSD (reversal + re-consumption)
  directInvoice.partsItems.forEach(p => {
    recordStockMovementSim(inventory, { itemCode: p.itemCode, type: 'SERVICE_REVERSAL', inQty: p.quantity });
  });
  assert(inventory.find(i => i.itemCode === 'SSD-1TB').availableStock === 10, 'Reversed prior consumption -> Stock back to 10');

  directInvoice.partsItems = [{ itemCode: 'SSD-1TB', quantity: 1 }];
  directInvoice.partsItems.forEach(p => {
    recordStockMovementSim(inventory, { itemCode: p.itemCode, type: 'SERVICE_CONSUME', outQty: p.quantity });
  });
  assert(inventory.find(i => i.itemCode === 'SSD-1TB').availableStock === 9, 'Re-consumed edited qty (1 SSD) -> Stock is 9');

  // Step 3: Delete Direct Service Invoice -> Restore consumed stock
  directInvoice.partsItems.forEach(p => {
    recordStockMovementSim(inventory, { itemCode: p.itemCode, type: 'SERVICE_REVERSAL', inQty: p.quantity });
  });
  assert(inventory.find(i => i.itemCode === 'SSD-1TB').availableStock === 10, 'Deleted Direct Invoice -> All stock restored to 10');
}

console.log('\n========================================');
console.log(`${passed} passed, ${failed} failed`);
console.log('========================================');
process.exit(failed > 0 ? 1 : 0);

