// ==========================================================================
// BIOS - PC, Laptop & Inventory Management Software
// Building Intelligent Outcomes with Solutions
// ==========================================================================

// Global Application State
let state = {
  enquiries: [],
  bookings: [],
  billings: [],
  activities: [],
  inventory: [],      // Stock items master
  purchases: [],      // Inward purchases
  suppliers: [],      // Supplier directory
  pcBuilds: [],       // Assembled PC builds
  returns: [],        // Sales and Purchase returns
  stockLedger: []     // Complete stock movement history
};

// LocalStorage Keys
const STORAGE_KEYS = {
  ENQUIRIES: 'bios_enquiries',
  BOOKINGS: 'bios_bookings',
  BILLINGS: 'bios_billings',
  ACTIVITIES: 'bios_activities',
  INVENTORY: 'bios_inventory',
  PURCHASES: 'bios_purchases',
  SUPPLIERS: 'bios_suppliers',
  PC_BUILDS: 'bios_pc_builds',
  RETURNS: 'bios_returns',
  STOCK_LEDGER: 'bios_stock_ledger'
};

// ==========================================================================
// INITIALIZATION & DATA SEEDING
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  seedInitialInventoryIfEmpty();
  setupNavigation();
  setupMobileMenu();
  setupSubTabs();
  setupEventListeners();
  updateCurrentDateIndicator();
  
  // Initial renders
  renderDashboard();
  renderEnquiriesTable();
  renderBookingsTable();
  renderBillingsTable();
  renderPurchasesTable();
  renderInventoryTable();
  renderPCBuilderDropdowns();
  renderPCBuildHistoryTable();
  renderReturnsTables();
  renderReports();
});

// Load data from LocalStorage
function loadFromStorage() {
  try {
    state.enquiries = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) || [];
    state.bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
    state.billings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLINGS)) || [];
    state.activities = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) || [];
    state.inventory = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVENTORY)) || [];
    state.purchases = JSON.parse(localStorage.getItem(STORAGE_KEYS.PURCHASES)) || [];
    state.suppliers = JSON.parse(localStorage.getItem(STORAGE_KEYS.SUPPLIERS)) || [];
    state.pcBuilds = JSON.parse(localStorage.getItem(STORAGE_KEYS.PC_BUILDS)) || [];
    state.returns = JSON.parse(localStorage.getItem(STORAGE_KEYS.RETURNS)) || [];
    state.stockLedger = JSON.parse(localStorage.getItem(STORAGE_KEYS.STOCK_LEDGER)) || [];
  } catch (e) {
    console.error('Error loading data from LocalStorage:', e);
  }
}

// Save data to LocalStorage
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving data to LocalStorage:', e);
  }
}

// Seed Initial Inventory with Realistic Computer Components & Laptops if empty
function seedInitialInventoryIfEmpty() {
  if (state.inventory && state.inventory.length > 0) return;

  const starterItems = [
    {
      itemCode: 'CPU-INTEL-13400F',
      itemName: 'Intel Core i5-13400F 10-Core Processor (4.6GHz Turbo)',
      category: 'CPU',
      brand: 'Intel',
      model: 'Core i5-13400F Box',
      purchaseQty: 6,
      salesQty: 1,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 1,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 4,
      purchaseRate: 16500,
      sellingRate: 19200,
      minStock: 2,
      serials: ['INT-134-8891', 'INT-134-8892', 'INT-134-8893', 'INT-134-8894']
    },
    {
      itemCode: 'CPU-AMD-7800X3D',
      itemName: 'AMD Ryzen 7 7800X3D 8-Core 3D V-Cache Processor',
      category: 'CPU',
      brand: 'AMD',
      model: 'Ryzen 7 7800X3D',
      purchaseQty: 4,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 1,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 3,
      purchaseRate: 34500,
      sellingRate: 39500,
      minStock: 1,
      serials: ['AMD-780-9901', 'AMD-780-9902', 'AMD-780-9903']
    },
    {
      itemCode: 'MB-ASUS-B760M',
      itemName: 'ASUS TUF Gaming B760M-PLUS WiFi DDR5 Motherboard',
      category: 'Motherboard',
      brand: 'ASUS',
      model: 'TUF B760M-PLUS WIFI',
      purchaseQty: 5,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 1,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 4,
      purchaseRate: 15200,
      sellingRate: 17800,
      minStock: 2,
      serials: ['MB-ASUS-4401', 'MB-ASUS-4402', 'MB-ASUS-4403', 'MB-ASUS-4404']
    },
    {
      itemCode: 'RAM-CORSAIR-16G-D5',
      itemName: 'Corsair Vengeance 16GB DDR5 5600MHz CL36 Desktop RAM',
      category: 'RAM',
      brand: 'Corsair',
      model: 'Vengeance DDR5 5600',
      purchaseQty: 12,
      salesQty: 2,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 2,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 8,
      purchaseRate: 4100,
      sellingRate: 5200,
      minStock: 4,
      serials: []
    },
    {
      itemCode: 'SSD-SAMS-980P-1TB',
      itemName: 'Samsung 980 Pro 1TB PCIe 4.0 NVMe M.2 SSD (7000MB/s)',
      category: 'Storage',
      brand: 'Samsung',
      model: '980 Pro 1TB',
      purchaseQty: 8,
      salesQty: 1,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 1,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 6,
      purchaseRate: 7800,
      sellingRate: 9500,
      minStock: 3,
      serials: ['SAMS-NV-1001', 'SAMS-NV-1002', 'SAMS-NV-1003', 'SAMS-NV-1004', 'SAMS-NV-1005', 'SAMS-NV-1006']
    },
    {
      itemCode: 'GPU-RTX-4070-12G',
      itemName: 'ZOTAC Gaming GeForce RTX 4070 Twin Edge 12GB GDDR6X',
      category: 'GPU',
      brand: 'ZOTAC',
      model: 'RTX 4070 Twin Edge',
      purchaseQty: 3,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 1,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 2,
      purchaseRate: 49500,
      sellingRate: 56000,
      minStock: 1,
      serials: ['GPU-ZOT-7701', 'GPU-ZOT-7702']
    },
    {
      itemCode: 'PSU-DEEPCOOL-750W',
      itemName: 'DeepCool PM750D 750W 80 Plus Gold Non-Modular PSU',
      category: 'PSU',
      brand: 'DeepCool',
      model: 'PM750D Gold',
      purchaseQty: 6,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 1,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 5,
      purchaseRate: 5400,
      sellingRate: 6700,
      minStock: 2,
      serials: []
    },
    {
      itemCode: 'CAB-NZXT-H5-FLOW',
      itemName: 'NZXT H5 Flow Compact ATX Mid-Tower Case (Black)',
      category: 'Cabinet',
      brand: 'NZXT',
      model: 'H5 Flow Black',
      purchaseQty: 4,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 1,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 3,
      purchaseRate: 6900,
      sellingRate: 8400,
      minStock: 2,
      serials: []
    },
    {
      itemCode: 'CLR-DEEPCOOL-AK400',
      itemName: 'DeepCool AK400 High-Performance CPU Air Cooler',
      category: 'Cooler',
      brand: 'DeepCool',
      model: 'AK400 Performance',
      purchaseQty: 6,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 1,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 5,
      purchaseRate: 2100,
      sellingRate: 2800,
      minStock: 2,
      serials: []
    },
    {
      itemCode: 'LAP-ASUS-TUF-A15',
      itemName: 'ASUS TUF Gaming A15 Laptop (Ryzen 7, 16GB, 512GB SSD, RTX 4050, 144Hz)',
      category: 'Laptop',
      brand: 'ASUS',
      model: 'FA506NC-HN083W',
      purchaseQty: 3,
      salesQty: 1,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 0,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 2,
      purchaseRate: 68500,
      sellingRate: 78990,
      minStock: 1,
      serials: ['LAP-ASUS-99120', 'LAP-ASUS-99121']
    }
  ];

  state.inventory = starterItems;
  saveToStorage(STORAGE_KEYS.INVENTORY, state.inventory);

  // Initial Suppliers
  state.suppliers = [
    {
      name: 'Supertron Infotech Pvt Ltd',
      phone: '9845012345',
      email: 'sales@supertron.in',
      gstin: '29AABCS8812K1Z9',
      totalPurchases: 184500,
      balanceDue: 0
    },
    {
      name: 'Rashi Peripherals Ltd',
      phone: '9845098765',
      email: 'bangalore@rptechindia.com',
      gstin: '29AABCR1122M1Z3',
      totalPurchases: 145000,
      balanceDue: 25000
    }
  ];
  saveToStorage(STORAGE_KEYS.SUPPLIERS, state.suppliers);

  // Initial Purchases
  const todayStr = getTodayDateString();
  state.purchases = [
    {
      id: 'PUR-1001',
      invoiceNo: 'SUP-INV-8821',
      date: todayStr,
      supplier: 'Supertron Infotech Pvt Ltd',
      supplierPhone: '9845012345',
      itemCode: 'CPU-INTEL-13400F',
      itemName: 'Intel Core i5-13400F 10-Core Processor (4.6GHz Turbo)',
      category: 'CPU',
      brand: 'Intel',
      model: 'Core i5-13400F Box',
      qty: 6,
      rate: 16500,
      discount: 0,
      gstRate: 18,
      taxableAmount: 99000,
      gstAmount: 17820,
      totalAmount: 116820,
      paidAmount: 116820,
      balanceAmount: 0,
      status: 'Paid',
      serials: ['INT-134-8891', 'INT-134-8892', 'INT-134-8893', 'INT-134-8894']
    },
    {
      id: 'PUR-1002',
      invoiceNo: 'RP-BLR-4491',
      date: todayStr,
      supplier: 'Rashi Peripherals Ltd',
      supplierPhone: '9845098765',
      itemCode: 'GPU-RTX-4070-12G',
      itemName: 'ZOTAC Gaming GeForce RTX 4070 Twin Edge 12GB GDDR6X',
      category: 'GPU',
      brand: 'ZOTAC',
      model: 'RTX 4070 Twin Edge',
      qty: 3,
      rate: 49500,
      discount: 1000,
      gstRate: 18,
      taxableAmount: 147500,
      gstAmount: 26550,
      totalAmount: 174050,
      paidAmount: 149050,
      balanceAmount: 25000,
      status: 'Partial',
      serials: ['GPU-ZOT-7701', 'GPU-ZOT-7702']
    }
  ];
  saveToStorage(STORAGE_KEYS.PURCHASES, state.purchases);

  // Initial Assembled PC Build
  const starterBuild = {
    id: 'BUILD-2026-001',
    name: 'BIOS Core i5 RTX 4070 Gaming Rig',
    serialNo: 'BIOS-PC-2026-001',
    date: todayStr,
    componentsCost: 119300,
    laborCost: 1500,
    totalCost: 120800,
    sellingPrice: 139900,
    marginAmount: 19100,
    marginPercent: 13.65,
    components: [
      { category: 'CPU', itemCode: 'CPU-INTEL-13400F', itemName: 'Intel Core i5-13400F', cost: 16500, qty: 1 },
      { category: 'Motherboard', itemCode: 'MB-ASUS-B760M', itemName: 'ASUS TUF B760M-PLUS', cost: 15200, qty: 1 },
      { category: 'RAM', itemCode: 'RAM-CORSAIR-16G-D5', itemName: 'Corsair Vengeance 16GB DDR5', cost: 4100, qty: 2 },
      { category: 'Storage', itemCode: 'SSD-SAMS-980P-1TB', itemName: 'Samsung 980 Pro 1TB NVMe', cost: 7800, qty: 1 },
      { category: 'GPU', itemCode: 'GPU-RTX-4070-12G', itemName: 'ZOTAC RTX 4070 12GB', cost: 49500, qty: 1 },
      { category: 'PSU', itemCode: 'PSU-DEEPCOOL-750W', itemName: 'DeepCool PM750D 750W Gold', cost: 5400, qty: 1 },
      { category: 'Cabinet', itemCode: 'CAB-NZXT-H5-FLOW', itemName: 'NZXT H5 Flow Black', cost: 6900, qty: 1 },
      { category: 'Cooler', itemCode: 'CLR-DEEPCOOL-AK400', itemName: 'DeepCool AK400 Air Cooler', cost: 2100, qty: 1 }
    ]
  };
  state.pcBuilds = [starterBuild];
  saveToStorage(STORAGE_KEYS.PC_BUILDS, state.pcBuilds);

  // Add the Finished PC to Inventory
  state.inventory.push({
    itemCode: 'PC-BUILD-2026-001',
    itemName: 'BIOS Core i5 RTX 4070 Gaming Rig (i5-13400F / 32GB / 1TB / RTX 4070)',
    category: 'Finished PC',
    brand: 'BIOS Custom',
    model: 'BIOS-PC-2026-001',
    purchaseQty: 0,
    salesQty: 0,
    salesReturnQty: 0,
    purchaseReturnQty: 0,
    adjustmentQty: 0,
    pcConsumedQty: 0,
    pcProducedQty: 1,
    openingStock: 0,
    availableStock: 1,
    purchaseRate: 120800,
    sellingRate: 139900,
    minStock: 1,
    serials: ['BIOS-PC-2026-001']
  });
  saveToStorage(STORAGE_KEYS.INVENTORY, state.inventory);

  // Seed Initial Stock Ledger
  state.stockLedger = [
    {
      id: 'LEDGER-001',
      timestamp: new Date().toISOString(),
      itemCode: 'CPU-INTEL-13400F',
      itemName: 'Intel Core i5-13400F 10-Core Processor',
      category: 'CPU',
      type: 'PURCHASE',
      refNo: 'SUP-INV-8821',
      inQty: 6,
      outQty: 0,
      balanceStock: 6,
      unitCost: 16500,
      remarks: 'Purchased from Supertron Infotech Pvt Ltd'
    },
    {
      id: 'LEDGER-002',
      timestamp: new Date().toISOString(),
      itemCode: 'GPU-RTX-4070-12G',
      itemName: 'ZOTAC Gaming GeForce RTX 4070 Twin Edge 12GB',
      category: 'GPU',
      type: 'PURCHASE',
      refNo: 'RP-BLR-4491',
      inQty: 3,
      outQty: 0,
      balanceStock: 3,
      unitCost: 49500,
      remarks: 'Purchased from Rashi Peripherals Ltd'
    },
    {
      id: 'LEDGER-003',
      timestamp: new Date().toISOString(),
      itemCode: 'CPU-INTEL-13400F',
      itemName: 'Intel Core i5-13400F',
      category: 'CPU',
      type: 'PC_BUILD_CONSUME',
      refNo: 'BUILD-2026-001',
      inQty: 0,
      outQty: 1,
      balanceStock: 4,
      unitCost: 16500,
      remarks: 'Consumed in PC Assembly: BIOS-PC-2026-001'
    },
    {
      id: 'LEDGER-004',
      timestamp: new Date().toISOString(),
      itemCode: 'PC-BUILD-2026-001',
      itemName: 'BIOS Core i5 RTX 4070 Gaming Rig',
      category: 'Finished PC',
      type: 'PC_BUILD_PRODUCE',
      refNo: 'BUILD-2026-001',
      inQty: 1,
      outQty: 0,
      balanceStock: 1,
      unitCost: 120800,
      remarks: 'Custom PC Assembled & Added to Finished Stock'
    }
  ];
  saveToStorage(STORAGE_KEYS.STOCK_LEDGER, state.stockLedger);
}

// ==========================================================================
// CENTRAL STOCK CALCULATION ENGINE & LEDGER
// ==========================================================================
// Stock Formula: Available Stock = Opening + Purchase + Sales Return - Sales - Purchase Return +/- Adjustment - PC Consumed + PC Produced
function calculateAvailableStock(item) {
  const opening = parseFloat(item.openingStock || 0);
  const purchase = parseFloat(item.purchaseQty || 0);
  const salesReturn = parseFloat(item.salesReturnQty || 0);
  const sales = parseFloat(item.salesQty || 0);
  const purchaseReturn = parseFloat(item.purchaseReturnQty || 0);
  const adjustment = parseFloat(item.adjustmentQty || 0);
  const pcConsumed = parseFloat(item.pcConsumedQty || 0);
  const pcProduced = parseFloat(item.pcProducedQty || 0);

  return opening + purchase + salesReturn - sales - purchaseReturn + adjustment - pcConsumed + pcProduced;
}

// Get Stock Status: Available / Low Stock / Out of Stock
function getStockStatus(availableStock, minStock) {
  const stock = parseFloat(availableStock || 0);
  const min = parseFloat(minStock || 0);
  if (stock <= 0) return 'Out of Stock';
  if (stock <= min) return 'Low Stock';
  return 'Available';
}

// Record an immutable stock movement in the Stock Ledger and update Master Item
function recordStockMovement({ itemCode, itemName, category, type, refNo, inQty = 0, outQty = 0, unitCost = 0, remarks = '' }) {
  inQty = parseFloat(inQty || 0);
  outQty = parseFloat(outQty || 0);

  let item = state.inventory.find(i => i.itemCode === itemCode);
  if (!item) {
    // Create new master item entry if not existing
    item = {
      itemCode,
      itemName: itemName || itemCode,
      category: category || 'General',
      brand: 'Generic',
      model: '',
      purchaseQty: 0,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 0,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 0,
      purchaseRate: unitCost,
      sellingRate: unitCost * 1.25,
      minStock: 2,
      serials: []
    };
    state.inventory.push(item);
  }

  // Update specific counters based on movement type
  if (type === 'PURCHASE') {
    item.purchaseQty = (parseFloat(item.purchaseQty || 0) + inQty);
    if (unitCost > 0) item.purchaseRate = unitCost;
  } else if (type === 'SALE') {
    item.salesQty = (parseFloat(item.salesQty || 0) + outQty);
  } else if (type === 'SALES_RETURN') {
    item.salesReturnQty = (parseFloat(item.salesReturnQty || 0) + inQty);
  } else if (type === 'PURCHASE_RETURN') {
    item.purchaseReturnQty = (parseFloat(item.purchaseReturnQty || 0) + outQty);
  } else if (type === 'ADJUSTMENT') {
    if (inQty > 0) {
      item.adjustmentQty = (parseFloat(item.adjustmentQty || 0) + inQty);
    } else if (outQty > 0) {
      item.adjustmentQty = (parseFloat(item.adjustmentQty || 0) - outQty);
    }
  } else if (type === 'PC_BUILD_CONSUME') {
    item.pcConsumedQty = (parseFloat(item.pcConsumedQty || 0) + outQty);
  } else if (type === 'PC_BUILD_PRODUCE') {
    item.pcProducedQty = (parseFloat(item.pcProducedQty || 0) + inQty);
    if (unitCost > 0) item.purchaseRate = unitCost;
  }

  // Recalculate Available Stock
  item.availableStock = calculateAvailableStock(item);

  // Append to Stock Ledger Log
  const ledgerEntry = {
    id: 'LEDGER-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    itemCode: item.itemCode,
    itemName: item.itemName,
    category: item.category,
    type,
    refNo: refNo || '--',
    inQty,
    outQty,
    balanceStock: item.availableStock,
    unitCost: unitCost || item.purchaseRate,
    remarks: remarks || `${type} transaction recorded`
  };

  state.stockLedger.unshift(ledgerEntry);

  saveToStorage(STORAGE_KEYS.INVENTORY, state.inventory);
  saveToStorage(STORAGE_KEYS.STOCK_LEDGER, state.stockLedger);

  return item;
}

// Add Activity Log
function addActivity(type, description) {
  const newActivity = {
    id: 'ACT-' + Date.now(),
    type: type, // 'enquiry', 'booking', 'billing', 'purchase', 'inventory', 'pcbuild', 'return'
    description: description,
    timestamp: new Date().toISOString()
  };
  state.activities.unshift(newActivity);
  if (state.activities.length > 30) {
    state.activities.pop();
  }
  saveToStorage(STORAGE_KEYS.ACTIVITIES, state.activities);
  renderDashboard();
}

// Format Currency
function formatCurrency(amount) {
  const val = parseFloat(amount || 0);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(val);
}

// Format Date for table display
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

// Format Date & Time for ledger
function formatDateTime(isoStr) {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return isoStr;
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// Get ISO Date string (YYYY-MM-DD)
function getTodayDateString() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Update UI Date Indicator in Header
function updateCurrentDateIndicator() {
  const dateSpan = document.getElementById('current-date-span');
  if (dateSpan) {
    const today = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    dateSpan.textContent = today.toLocaleDateString('en-US', options);
  }
}

// ==========================================================================
// NAVIGATION & ROUTING
// ==========================================================================
function setupNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.page-section');
  const headerTitle = document.getElementById('header-view-title');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetSectionId = link.getAttribute('data-target');

      // Update Active Navigation Item
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');

      // Update Section Visibility
      sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === `${targetSectionId}-section`) {
          section.classList.add('active');
        }
      });

      // Update Header Title
      headerTitle.textContent = link.textContent.trim();

      // Trigger context re-renders
      if (targetSectionId === 'dashboard') {
        renderDashboard();
      } else if (targetSectionId === 'purchases') {
        renderPurchasesTable();
      } else if (targetSectionId === 'inventory') {
        renderInventoryTable();
      } else if (targetSectionId === 'pcbuilder') {
        renderPCBuilderDropdowns();
        renderPCBuildHistoryTable();
      } else if (targetSectionId === 'returns') {
        renderReturnsTables();
      } else if (targetSectionId === 'reports') {
        renderReports();
      }

      // Close mobile sidebar if open
      document.body.classList.remove('sidebar-open');
    });
  });
}

function setupMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const backdrop = document.getElementById('sidebar-backdrop');

  if (menuBtn && backdrop) {
    menuBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });

    backdrop.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    });
  }
}

// Sub-Tab Switcher Helper
function setupSubTabs() {
  // PC Builder Sub-Tabs
  const pcTabs = document.querySelectorAll('[data-pc-tab]');
  pcTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pcTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-pc-tab');
      document.querySelectorAll('#pcbuilder-section .sub-tab-pane').forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById(`pc-tab-${target}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });

  // Returns & Suppliers Sub-Tabs
  const returnTabs = document.querySelectorAll('[data-returns-tab]');
  returnTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      returnTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-returns-tab');
      document.querySelectorAll('#returns-section .sub-tab-pane').forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById(`returns-tab-${target}`);
      if (targetPane) targetPane.classList.add('active');
    });
  });
}

// Helper to handle Modal Opening/Closing
function setupModalToggle(openBtnId, closeBtnId, cancelBtnId, modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const closeBtn = document.getElementById(closeBtnId);
  const cancelBtn = document.getElementById(cancelBtnId);

  if (openBtnId) {
    const openBtn = document.getElementById(openBtnId);
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        modal.classList.add('active');
      });
    }
  }

  const closeModal = () => modal.classList.remove('active');
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
}

// ==========================================================================
// EVENT LISTENERS SETUP
// ==========================================================================
function setupEventListeners() {
  // Modals Setup
  setupModalToggle('open-add-enquiry-btn', 'close-enquiry-modal-btn', 'cancel-enquiry-btn', 'enquiry-modal');
  setupModalToggle('open-add-booking-btn', 'close-booking-modal-btn', 'cancel-booking-btn', 'booking-modal');
  setupModalToggle('open-new-invoice-btn', 'close-billing-form-btn', 'cancel-billing-btn-el', 'billing-modal-form');
  setupModalToggle('open-new-purchase-btn', 'close-purchase-modal-btn', 'cancel-purchase-btn', 'purchase-modal');
  setupModalToggle('open-stock-adjust-btn', 'close-stock-adjust-btn', 'cancel-stock-adjust-btn', 'stock-adjust-modal');
  setupModalToggle('open-sales-return-btn', 'close-sales-return-btn', 'cancel-sales-return-btn', 'sales-return-modal');
  setupModalToggle('open-purchase-return-btn', 'close-purchase-return-modal-btn', 'cancel-purchase-return-btn', 'purchase-return-modal');
  setupModalToggle(null, 'close-invoice-preview-btn', 'close-invoice-modal-btn', 'invoice-modal');
  setupModalToggle(null, 'close-purchase-view-btn', 'close-purchase-view-btn2', 'purchase-view-modal');
  setupModalToggle(null, 'close-pc-view-btn', 'close-pc-view-btn2', 'pc-view-modal');
  setupModalToggle(null, 'close-serial-modal-btn', 'close-serial-modal-btn2', 'serial-modal');

  const printPCSpecBtn = document.getElementById('print-pc-spec-btn');
  if (printPCSpecBtn) printPCSpecBtn.addEventListener('click', () => {
    document.body.classList.add('printing-modal');
    window.print();
    window.addEventListener('afterprint', () => document.body.classList.remove('printing-modal'), { once: true });
  });

  // Backdrop overlay click close all modals
  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // --- Enquiries ---
  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) enquiryForm.addEventListener('submit', handleEnquirySubmit);
  const enquirySearch = document.getElementById('enquiry-search');
  const enquiryFilterStatus = document.getElementById('enquiry-filter-status');
  const enquiryFilterSource = document.getElementById('enquiry-filter-source');
  if (enquirySearch) enquirySearch.addEventListener('input', renderEnquiriesTable);
  if (enquiryFilterStatus) enquiryFilterStatus.addEventListener('change', renderEnquiriesTable);
  if (enquiryFilterSource) enquiryFilterSource.addEventListener('change', renderEnquiriesTable);

  const openEnquiryBtn = document.getElementById('open-add-enquiry-btn');
  if (openEnquiryBtn) {
    openEnquiryBtn.addEventListener('click', () => {
      document.getElementById('enquiry-modal-title').textContent = "Add Enquiry";
      document.getElementById('enquiry-edit-id').value = "";
      document.getElementById('enquiry-form').reset();
      document.getElementById('enquiry-date').value = getTodayDateString();
    });
  }

  // --- Bookings ---
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) bookingForm.addEventListener('submit', handleBookingSubmit);
  const bookingSearch = document.getElementById('booking-search');
  const bookingFilterPayment = document.getElementById('booking-filter-payment');
  if (bookingSearch) bookingSearch.addEventListener('input', renderBookingsTable);
  if (bookingFilterPayment) bookingFilterPayment.addEventListener('change', renderBookingsTable);

  const openBookingBtn = document.getElementById('open-add-booking-btn');
  if (openBookingBtn) {
    openBookingBtn.addEventListener('click', () => {
      document.getElementById('booking-modal-title').textContent = "New Booking";
      document.getElementById('booking-edit-id').value = "";
      document.getElementById('booking-enquiry-link-id').value = "";
      document.getElementById('booking-form').reset();
      document.getElementById('booking-date').value = getTodayDateString();
      populateCustomerSuggestions();
    });
  }

  // --- Billing & Stock Connection ---
  const openBillingBtn = document.getElementById('open-new-invoice-btn');
  if (openBillingBtn) {
    openBillingBtn.addEventListener('click', () => {
      document.getElementById('billing-form-el').reset();
      document.getElementById('billing-date').value = getTodayDateString();
      document.getElementById('billing-invoice-no').value = generateInvoiceNumber();
      document.getElementById('billing-qty').value = 1;
      document.getElementById('billing-calc-subtotal').textContent = formatCurrency(0);
      document.getElementById('billing-calc-gst').textContent = formatCurrency(0);
      document.getElementById('billing-calc-total').textContent = formatCurrency(0);
      populateBillingBookingDropdown();
      populateBillingInventoryDropdown();
      populateCustomerSuggestions();
    });
  }

  const billingBookingSelect = document.getElementById('billing-booking-select');
  if (billingBookingSelect) billingBookingSelect.addEventListener('change', handleBillingBookingSelection);

  const billingInventorySelect = document.getElementById('billing-inventory-select');
  if (billingInventorySelect) billingInventorySelect.addEventListener('change', handleBillingInventorySelection);

  const billingAmountInput = document.getElementById('billing-amount');
  const billingQtyInput = document.getElementById('billing-qty');
  const billingGstSelect = document.getElementById('billing-gst');
  if (billingAmountInput) billingAmountInput.addEventListener('input', handleBillingAmountChange);
  if (billingQtyInput) billingQtyInput.addEventListener('input', handleBillingAmountChange);
  if (billingGstSelect) billingGstSelect.addEventListener('change', handleBillingAmountChange);

  // Auto-fill customer details in Billing
  setupCustomerAutoFill('billing-customer-name', 'billing-customer-mobile', 'billing-customer-address', 'billing-customer-gst');
  // Auto-fill customer details in PC Building
  setupCustomerAutoFill('pc-customer-name', 'pc-customer-phone', 'pc-customer-address', 'pc-customer-gst');

  const billingFormEl = document.getElementById('billing-form-el');
  if (billingFormEl) billingFormEl.addEventListener('submit', handleBillingSubmit);

  const printInvoiceBtn = document.getElementById('print-invoice-btn');
  if (printInvoiceBtn) printInvoiceBtn.addEventListener('click', () => {
    document.body.classList.add('printing-modal');
    window.print();
    window.addEventListener('afterprint', () => document.body.classList.remove('printing-modal'), { once: true });
  });

  // --- Purchases ---
  const openPurchaseBtn = document.getElementById('open-new-purchase-btn');
  if (openPurchaseBtn) {
    openPurchaseBtn.addEventListener('click', () => {
      document.getElementById('purchase-modal-title').textContent = "New Purchase Entry";
      document.getElementById('purchase-edit-id').value = "";
      document.getElementById('purchase-form').reset();
      document.getElementById('purchase-date').value = getTodayDateString();
      document.getElementById('purchase-qty').value = 1;
      document.getElementById('purchase-min-stock').value = 2;
      document.getElementById('purchase-gst-rate').value = "18";
      document.getElementById('purchase-paid-amount').value = "0";
      populatePurchaseDataLists();
      calculatePurchaseTotals();
    });
  }

  // Live Purchase Calculations
  ['purchase-qty', 'purchase-rate', 'purchase-discount', 'purchase-gst-rate', 'purchase-paid-amount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calculatePurchaseTotals);
  });

  const purchaseItemCodeInput = document.getElementById('purchase-item-code');
  if (purchaseItemCodeInput) {
    purchaseItemCodeInput.addEventListener('change', (e) => {
      const code = e.target.value.trim();
      const existing = state.inventory.find(i => i.itemCode.toLowerCase() === code.toLowerCase());
      if (existing) {
        document.getElementById('purchase-item-name').value = existing.itemName;
        document.getElementById('purchase-category').value = existing.category;
        document.getElementById('purchase-brand').value = existing.brand;
        document.getElementById('purchase-model').value = existing.model || '';
        document.getElementById('purchase-rate').value = existing.purchaseRate || '';
        document.getElementById('purchase-selling-rate').value = existing.sellingRate || '';
        document.getElementById('purchase-min-stock').value = existing.minStock || 2;
        calculatePurchaseTotals();
      }
    });
  }

  const purchaseForm = document.getElementById('purchase-form');
  if (purchaseForm) purchaseForm.addEventListener('submit', handlePurchaseSubmit);

  const purchaseSearch = document.getElementById('purchase-search');
  const purchaseFilterStatus = document.getElementById('purchase-filter-status');
  const purchaseFilterFrom = document.getElementById('purchase-filter-from');
  const purchaseFilterTo = document.getElementById('purchase-filter-to');
  const resetPurchaseBtn = document.getElementById('reset-purchase-filters-btn');

  if (purchaseSearch) purchaseSearch.addEventListener('input', renderPurchasesTable);
  if (purchaseFilterStatus) purchaseFilterStatus.addEventListener('change', renderPurchasesTable);
  if (purchaseFilterFrom) purchaseFilterFrom.addEventListener('change', renderPurchasesTable);
  if (purchaseFilterTo) purchaseFilterTo.addEventListener('change', renderPurchasesTable);
  if (resetPurchaseBtn) {
    resetPurchaseBtn.addEventListener('click', () => {
      if (purchaseSearch) purchaseSearch.value = '';
      if (purchaseFilterStatus) purchaseFilterStatus.value = 'All';
      if (purchaseFilterFrom) purchaseFilterFrom.value = '';
      if (purchaseFilterTo) purchaseFilterTo.value = '';
      renderPurchasesTable();
    });
  }

  const printPurchaseBtn = document.getElementById('print-purchase-btn');
  if (printPurchaseBtn) printPurchaseBtn.addEventListener('click', () => {
    document.body.classList.add('printing-modal');
    window.print();
    window.addEventListener('afterprint', () => document.body.classList.remove('printing-modal'), { once: true });
  });

  // --- Inventory & Stock ---
  const stockSearch = document.getElementById('stock-search');
  const stockFilterCategory = document.getElementById('stock-filter-category');
  const stockFilterStatus = document.getElementById('stock-filter-status');
  const resetStockBtn = document.getElementById('reset-stock-filters-btn');

  if (stockSearch) stockSearch.addEventListener('input', renderInventoryTable);
  if (stockFilterCategory) stockFilterCategory.addEventListener('change', renderInventoryTable);
  if (stockFilterStatus) stockFilterStatus.addEventListener('change', renderInventoryTable);
  if (resetStockBtn) {
    resetStockBtn.addEventListener('click', () => {
      if (stockSearch) stockSearch.value = '';
      if (stockFilterCategory) stockFilterCategory.value = 'All';
      if (stockFilterStatus) stockFilterStatus.value = 'All';
      renderInventoryTable();
    });
  }

  const openAddMasterItemBtn = document.getElementById('open-add-stock-item-btn');
  if (openAddMasterItemBtn) {
    openAddMasterItemBtn.addEventListener('click', () => {
      // Trigger new purchase modal as the primary streamlined inward gateway
      const openPurch = document.getElementById('open-new-purchase-btn');
      if (openPurch) openPurch.click();
    });
  }

  const openStockAdjustBtn = document.getElementById('open-stock-adjust-btn');
  if (openStockAdjustBtn) {
    openStockAdjustBtn.addEventListener('click', () => {
      const select = document.getElementById('adjust-item-select');
      if (select) {
        select.innerHTML = '<option value="">-- Choose item to adjust --</option>' +
          state.inventory.map(i => `<option value="${i.itemCode}">${i.itemName} (Code: ${i.itemCode}, Available: ${i.availableStock})</option>`).join('');
      }
      document.getElementById('stock-adjust-form').reset();
      document.getElementById('adjust-qty').value = 1;
    });
  }

  const stockAdjustForm = document.getElementById('stock-adjust-form');
  if (stockAdjustForm) stockAdjustForm.addEventListener('submit', handleStockAdjustmentSubmit);

  // --- PC Builder ---
  const pcBuilderForm = document.getElementById('pc-builder-form');
  if (pcBuilderForm) pcBuilderForm.addEventListener('submit', handlePCBuildSubmit);

  document.querySelectorAll('.pc-component-select, #pc-slot-ram-qty, #pc-labor-cost, #pc-selling-price').forEach(el => {
    el.addEventListener('change', updatePCBuildCalculations);
    el.addEventListener('input', updatePCBuildCalculations);
  });

  // --- Returns ---
  const openSalesReturnBtn = document.getElementById('open-sales-return-btn');
  if (openSalesReturnBtn) {
    openSalesReturnBtn.addEventListener('click', () => {
      const select = document.getElementById('sales-return-inv');
      select.innerHTML = '<option value="">-- Choose Sales Invoice --</option>' +
        state.billings.map(b => `<option value="${b.invoiceNo}">${b.invoiceNo} - ${b.customerName} (${b.productName})</option>`).join('');
      document.getElementById('sales-return-form').reset();
      document.getElementById('sales-return-date').value = getTodayDateString();
      document.getElementById('sales-return-qty').value = 1;
    });
  }

  const salesReturnInvSelect = document.getElementById('sales-return-inv');
  if (salesReturnInvSelect) {
    salesReturnInvSelect.addEventListener('change', (e) => {
      const invNo = e.target.value;
      const invoice = state.billings.find(b => b.invoiceNo === invNo);
      if (invoice) {
        document.getElementById('sales-return-item-name').value = invoice.productName;
        document.getElementById('sales-return-qty').value = invoice.qty || 1;
        document.getElementById('sales-return-refund').value = invoice.totalAmount || 0;
      }
    });
  }

  const salesReturnForm = document.getElementById('sales-return-form');
  if (salesReturnForm) salesReturnForm.addEventListener('submit', handleSalesReturnSubmit);

  const openPurchReturnBtn = document.getElementById('open-purchase-return-btn');
  if (openPurchReturnBtn) {
    openPurchReturnBtn.addEventListener('click', () => {
      const select = document.getElementById('purchase-return-inv');
      select.innerHTML = '<option value="">-- Choose Purchase Invoice --</option>' +
        state.purchases.map(p => `<option value="${p.invoiceNo}">${p.invoiceNo} - ${p.supplier} (${p.itemName})</option>`).join('');
      document.getElementById('purchase-return-form').reset();
      document.getElementById('purchase-return-date').value = getTodayDateString();
      document.getElementById('purchase-return-qty').value = 1;
    });
  }

  const purchReturnInvSelect = document.getElementById('purchase-return-inv');
  if (purchReturnInvSelect) {
    purchReturnInvSelect.addEventListener('change', (e) => {
      const invNo = e.target.value;
      const purch = state.purchases.find(p => p.invoiceNo === invNo);
      if (purch) {
        document.getElementById('purchase-return-item-desc').value = purch.itemName;
        document.getElementById('purchase-return-qty').value = purch.qty || 1;
        document.getElementById('purchase-return-amount').value = purch.totalAmount || 0;
      }
    });
  }

  const purchaseReturnForm = document.getElementById('purchase-return-form');
  if (purchaseReturnForm) purchaseReturnForm.addEventListener('submit', handlePurchaseReturnSubmit);

  // --- Ledger Search & Filters ---
  const ledgerSearch = document.getElementById('ledger-search');
  const ledgerFilterType = document.getElementById('ledger-filter-type');
  if (ledgerSearch) ledgerSearch.addEventListener('input', renderStockLedgerTable);
  if (ledgerFilterType) ledgerFilterType.addEventListener('change', renderStockLedgerTable);

  // --- Reports ---
  const reportModule = document.getElementById('report-filter-module');
  const reportSearchInput = document.getElementById('report-search-input');
  const reportFromDate = document.getElementById('report-from-date');
  const reportToDate = document.getElementById('report-to-date');
  const reportResetBtn = document.getElementById('reset-report-filters-btn');
  const reportExportBtn = document.getElementById('export-excel-btn');
  const reportPrintBtn = document.getElementById('print-report-btn');

  if (reportModule) reportModule.addEventListener('change', renderReports);
  if (reportSearchInput) reportSearchInput.addEventListener('input', renderReports);
  if (reportFromDate) reportFromDate.addEventListener('change', renderReports);
  if (reportToDate) reportToDate.addEventListener('change', renderReports);
  
  if (reportResetBtn) {
    reportResetBtn.addEventListener('click', () => {
      if (reportSearchInput) reportSearchInput.value = '';
      if (reportFromDate) reportFromDate.value = '';
      if (reportToDate) reportToDate.value = '';
      renderReports();
    });
  }

  if (reportExportBtn) reportExportBtn.addEventListener('click', handleReportExport);
  if (reportPrintBtn) reportPrintBtn.addEventListener('click', handleReportPrint);
}

// ==========================================================================
// DASHBOARD CONTROLLER
// ==========================================================================
function renderDashboard() {
  const totalEnquiriesCount = state.enquiries.length;
  const totalBookingsCount = state.bookings.length;
  const totalBillingAmount = state.billings.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);
  const totalPurchasesAmount = state.purchases.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);
  
  // Total Inventory Valuation (Available Stock * Purchase Rate)
  let totalStockValuation = 0;
  let lowStockCount = 0;
  let finishedPCCount = 0;

  state.inventory.forEach(item => {
    const avail = parseFloat(item.availableStock || 0);
    const rate = parseFloat(item.purchaseRate || 0);
    const min = parseFloat(item.minStock || 0);
    if (avail > 0) totalStockValuation += (avail * rate);
    if (avail <= min) lowStockCount++;
    if (item.category === 'Finished PC') finishedPCCount += Math.max(0, avail);
  });

  // DOM Elements
  const elEnq = document.getElementById('dash-total-enquiries');
  const elBkg = document.getElementById('dash-total-bookings');
  const elBill = document.getElementById('dash-total-billing');
  const elStockVal = document.getElementById('dash-stock-value');
  const elStockItemsCount = document.getElementById('dash-stock-items-count');
  const elPurchVal = document.getElementById('dash-total-purchases');
  const elPurchCount = document.getElementById('dash-purchase-invoices-count');
  const elLowStock = document.getElementById('dash-low-stock-count');
  const elFinishedPCs = document.getElementById('dash-finished-pcs-count');

  if (elEnq) elEnq.textContent = totalEnquiriesCount;
  if (elBkg) elBkg.textContent = totalBookingsCount;
  if (elBill) elBill.textContent = formatCurrency(totalBillingAmount);
  if (elStockVal) elStockVal.textContent = formatCurrency(totalStockValuation);
  if (elStockItemsCount) elStockItemsCount.textContent = `${state.inventory.length} items in catalog`;
  if (elPurchVal) elPurchVal.textContent = formatCurrency(totalPurchasesAmount);
  if (elPurchCount) elPurchCount.textContent = `${state.purchases.length} purchase bills`;
  if (elLowStock) elLowStock.textContent = lowStockCount;
  if (elFinishedPCs) elFinishedPCs.textContent = finishedPCCount;

  // Enquiry breakdown
  const counts = { New: 0, 'Follow Up': 0, Booking: 0, Cancelled: 0 };
  state.enquiries.forEach(e => {
    if (counts[e.status] !== undefined) counts[e.status]++;
  });

  const getPercent = (count) => totalEnquiriesCount > 0 ? (count / totalEnquiriesCount) * 100 : 0;
  const setBar = (id, count) => {
    const bar = document.getElementById(`breakdown-${id}-bar`);
    const txt = document.getElementById(`breakdown-${id}-count`);
    if (txt) txt.textContent = count;
    if (bar) bar.style.width = `${getPercent(count)}%`;
  };
  setBar('new', counts.New);
  setBar('followup', counts['Follow Up']);
  setBar('booking', counts.Booking);
  setBar('cancelled', counts.Cancelled);

  // Activity feed
  const activityList = document.getElementById('dashboard-activity-list');
  if (activityList) {
    if (state.activities.length === 0) {
      activityList.innerHTML = `<div class="no-data-msg" style="padding: 1.5rem !important;">No activities recorded yet.</div>`;
    } else {
      activityList.innerHTML = state.activities.slice(0, 6).map(act => {
        let iconSvg = '';
        if (act.type === 'enquiry') {
          iconSvg = `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
        } else if (act.type === 'booking') {
          iconSvg = `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
        } else if (act.type === 'billing') {
          iconSvg = `<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
        } else if (act.type === 'purchase') {
          iconSvg = `<svg viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`;
        } else if (act.type === 'pcbuild') {
          iconSvg = `<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/></svg>`;
        } else {
          iconSvg = `<svg viewBox="0 0 24 24"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>`;
        }

        const diffMs = Date.now() - new Date(act.timestamp).getTime();
        const diffMins = Math.floor(diffMs / 60000);
        let timeText = 'Just now';
        if (diffMins > 0 && diffMins < 60) timeText = `${diffMins}m ago`;
        else if (diffMins >= 60) {
          const diffHrs = Math.floor(diffMins / 60);
          timeText = diffHrs < 24 ? `${diffHrs}h ago` : formatDate(act.timestamp);
        }

        return `
          <div class="activity-item">
            <div class="activity-icon ${act.type}">${iconSvg}</div>
            <div class="activity-desc">${act.description}</div>
            <div class="activity-time">${timeText}</div>
          </div>
        `;
      }).join('');
    }
  }
}

// ==========================================================================
// ENQUIRIES CONTROLLER (PRESERVED 100%)
// ==========================================================================
function handleEnquirySubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('enquiry-edit-id').value;
  const name = document.getElementById('enquiry-name').value.trim();
  const mobile = document.getElementById('enquiry-mobile').value.trim();
  const date = document.getElementById('enquiry-date').value;
  const source = document.getElementById('enquiry-source').value;
  const status = document.getElementById('enquiry-status').value;

  if (editId) {
    const index = state.enquiries.findIndex(item => item.id === editId);
    if (index !== -1) {
      const oldStatus = state.enquiries[index].status;
      state.enquiries[index] = { ...state.enquiries[index], name, mobile, date, source, status };
      saveToStorage(STORAGE_KEYS.ENQUIRIES, state.enquiries);
      
      let logMsg = `Updated Enquiry for <strong>${name}</strong> (Status: ${status})`;
      if (oldStatus !== 'Booking' && status === 'Booking') {
        logMsg = `Converted Enquiry for <strong>${name}</strong> to Booking status`;
        triggerQuickBookingFromEnquiry(state.enquiries[index]);
      }
      addActivity('enquiry', logMsg);
    }
  } else {
    const newEnquiry = {
      id: 'ENQ-' + Date.now(),
      name,
      mobile,
      date,
      source,
      status
    };
    state.enquiries.push(newEnquiry);
    saveToStorage(STORAGE_KEYS.ENQUIRIES, state.enquiries);
    addActivity('enquiry', `Added new Enquiry for <strong>${name}</strong> from ${source}`);
    if (status === 'Booking') {
      triggerQuickBookingFromEnquiry(newEnquiry);
    }
  }

  document.getElementById('enquiry-modal').classList.remove('active');
  renderEnquiriesTable();
  renderDashboard();
}

function renderEnquiriesTable() {
  const tableBody = document.getElementById('enquiry-table-body');
  if (!tableBody) return;
  const searchVal = document.getElementById('enquiry-search') ? document.getElementById('enquiry-search').value.toLowerCase().trim() : '';
  const statusVal = document.getElementById('enquiry-filter-status') ? document.getElementById('enquiry-filter-status').value : 'All';
  const sourceVal = document.getElementById('enquiry-filter-source') ? document.getElementById('enquiry-filter-source').value : 'All';

  const filtered = state.enquiries.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchVal) || item.mobile.includes(searchVal);
    const matchesStatus = statusVal === 'All' || item.status === statusVal;
    const matchesSource = sourceVal === 'All' || item.source === sourceVal;
    return matchesSearch && matchesStatus && matchesSource;
  });

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="no-data-msg">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
          <p>No enquiries found matching filters.</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(item => {
    let statusClass = 'badge-new';
    if (item.status === 'Follow Up') statusClass = 'badge-followup';
    if (item.status === 'Booking') statusClass = 'badge-booking';
    if (item.status === 'Cancelled') statusClass = 'badge-cancelled';

    const convertBtn = item.status !== 'Booking' ? `
      <button class="btn btn-outline btn-sm btn-success" onclick="convertEnquiryToBooking('${item.id}')" title="Confirm Booking">
        ✓ Book
      </button>
    ` : '';

    return `
      <tr>
        <td style="font-weight: 600;">${item.name}</td>
        <td>${item.mobile}</td>
        <td>${formatDate(item.date)}</td>
        <td>${item.source}</td>
        <td><span class="badge ${statusClass}">${item.status}</span></td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-sm" onclick="editEnquiry('${item.id}')">Edit</button>
          <button class="btn btn-outline btn-sm btn-danger" onclick="deleteEnquiry('${item.id}')">Delete</button>
          ${convertBtn}
        </td>
      </tr>
    `;
  }).join('');
}

window.editEnquiry = function(id) {
  const item = state.enquiries.find(e => e.id === id);
  if (!item) return;
  document.getElementById('enquiry-modal-title').textContent = "Edit Enquiry";
  document.getElementById('enquiry-edit-id').value = item.id;
  document.getElementById('enquiry-name').value = item.name;
  document.getElementById('enquiry-mobile').value = item.mobile;
  document.getElementById('enquiry-date').value = item.date;
  document.getElementById('enquiry-source').value = item.source;
  document.getElementById('enquiry-status').value = item.status;
  document.getElementById('enquiry-modal').classList.add('active');
};

window.deleteEnquiry = function(id) {
  const item = state.enquiries.find(e => e.id === id);
  if (!item) return;
  if (confirm(`Are you sure you want to delete the enquiry for ${item.name}?`)) {
    state.enquiries = state.enquiries.filter(e => e.id !== id);
    saveToStorage(STORAGE_KEYS.ENQUIRIES, state.enquiries);
    addActivity('enquiry', `Deleted enquiry of <strong>${item.name}</strong>`);
    renderEnquiriesTable();
    renderDashboard();
  }
};

window.convertEnquiryToBooking = function(id) {
  const item = state.enquiries.find(e => e.id === id);
  if (!item) return;
  triggerQuickBookingFromEnquiry(item);
};

function triggerQuickBookingFromEnquiry(enquiry) {
  enquiry.status = 'Booking';
  saveToStorage(STORAGE_KEYS.ENQUIRIES, state.enquiries);
  renderEnquiriesTable();

  document.getElementById('booking-modal-title').textContent = "Booking from Enquiry";
  document.getElementById('booking-edit-id').value = "";
  document.getElementById('booking-enquiry-link-id').value = enquiry.id;
  document.getElementById('booking-name').value = enquiry.name;
  document.getElementById('booking-mobile').value = enquiry.mobile;
  document.getElementById('booking-date').value = getTodayDateString();
  document.getElementById('booking-amount').value = "";
  document.getElementById('booking-payment').value = "";
  document.getElementById('booking-modal').classList.add('active');
}

function populateCustomerSuggestions() {
  const customersMap = new Map();

  state.enquiries.forEach(e => {
    if (e.name) {
      const key = e.name.toLowerCase();
      if (!customersMap.has(key)) {
        customersMap.set(key, { name: e.name, phone: e.mobile || '', address: '', gst: '' });
      }
    }
  });

  state.bookings.forEach(b => {
    if (b.name) {
      const key = b.name.toLowerCase();
      if (!customersMap.has(key)) {
        customersMap.set(key, { name: b.name, phone: b.mobile || '', address: '', gst: '' });
      } else if (b.mobile) {
        const existing = customersMap.get(key);
        if (!existing.phone) existing.phone = b.mobile;
      }
    }
  });

  state.billings.forEach(inv => {
    if (inv.customerName) {
      const key = inv.customerName.toLowerCase();
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          name: inv.customerName,
          phone: inv.customerMobile || '',
          address: inv.customerAddress || '',
          gst: inv.customerGst || ''
        });
      } else {
        const existing = customersMap.get(key);
        if (!existing.phone && inv.customerMobile) existing.phone = inv.customerMobile;
        if (!existing.address && inv.customerAddress) existing.address = inv.customerAddress;
        if (!existing.gst && inv.customerGst) existing.gst = inv.customerGst;
      }
    }
  });

  state.pcBuilds.forEach(build => {
    if (build.customerName) {
      const key = build.customerName.toLowerCase();
      if (!customersMap.has(key)) {
        customersMap.set(key, {
          name: build.customerName,
          phone: build.customerPhone || '',
          address: build.customerAddress || '',
          gst: build.customerGst || ''
        });
      } else {
        const existing = customersMap.get(key);
        if (!existing.phone && build.customerPhone) existing.phone = build.customerPhone;
        if (!existing.address && build.customerAddress) existing.address = build.customerAddress;
        if (!existing.gst && build.customerGst) existing.gst = build.customerGst;
      }
    }
  });

  const optionsHtml = Array.from(customersMap.values())
    .map(c => `<option value="${c.name}">${c.phone ? ' (' + c.phone + ')' : ''}</option>`)
    .join('');

  const datalistBkg = document.getElementById('booking-customer-suggestions');
  if (datalistBkg) datalistBkg.innerHTML = optionsHtml;

  const datalistBill = document.getElementById('billing-customer-suggestions');
  if (datalistBill) datalistBill.innerHTML = optionsHtml;

  const datalistPC = document.getElementById('pc-customer-suggestions');
  if (datalistPC) datalistPC.innerHTML = optionsHtml;

  return customersMap;
}

function setupCustomerAutoFill(nameInputId, phoneInputId, addressInputId, gstInputId) {
  const nameInput = document.getElementById(nameInputId);
  if (!nameInput) return;

  const handleLookup = () => {
    const nameVal = nameInput.value.trim().toLowerCase();
    if (!nameVal) return;

    const customersMap = populateCustomerSuggestions();
    const found = customersMap.get(nameVal);
    if (found) {
      const phoneInput = document.getElementById(phoneInputId);
      const addressInput = document.getElementById(addressInputId);
      const gstInput = document.getElementById(gstInputId);

      if (phoneInput && found.phone && (!phoneInput.value || phoneInput.value.length < 10)) {
        phoneInput.value = found.phone;
      }
      if (addressInput && found.address && !addressInput.value) {
        addressInput.value = found.address;
      }
      if (gstInput && found.gst && !gstInput.value) {
        gstInput.value = found.gst;
      }
    }
  };

  nameInput.addEventListener('change', handleLookup);
  nameInput.addEventListener('input', handleLookup);
}

// ==========================================================================
// BOOKINGS CONTROLLER (PRESERVED 100%)
// ==========================================================================
function handleBookingSubmit(e) {
  e.preventDefault();
  const editId = document.getElementById('booking-edit-id').value;
  const linkId = document.getElementById('booking-enquiry-link-id').value;
  const name = document.getElementById('booking-name').value.trim();
  const mobile = document.getElementById('booking-mobile').value.trim();
  const date = document.getElementById('booking-date').value;
  const amount = parseFloat(document.getElementById('booking-amount').value || 0);
  const payment = document.getElementById('booking-payment').value;

  if (editId) {
    const index = state.bookings.findIndex(item => item.id === editId);
    if (index !== -1) {
      state.bookings[index] = { ...state.bookings[index], name, mobile, date, amount, payment };
      saveToStorage(STORAGE_KEYS.BOOKINGS, state.bookings);
      addActivity('booking', `Updated booking for <strong>${name}</strong> (Amount: ${formatCurrency(amount)})`);
    }
  } else {
    const newBooking = {
      id: 'BKG-' + Date.now(),
      name,
      mobile,
      date,
      amount,
      payment,
      enquiryLinkId: linkId || null
    };
    state.bookings.push(newBooking);
    saveToStorage(STORAGE_KEYS.BOOKINGS, state.bookings);
    addActivity('booking', `Confirmed booking for <strong>${name}</strong> using ${payment} (${formatCurrency(amount)})`);

    if (linkId) {
      const enqIndex = state.enquiries.findIndex(enq => enq.id === linkId);
      if (enqIndex !== -1 && state.enquiries[enqIndex].status !== 'Booking') {
        state.enquiries[enqIndex].status = 'Booking';
        saveToStorage(STORAGE_KEYS.ENQUIRIES, state.enquiries);
        renderEnquiriesTable();
      }
    }
  }

  document.getElementById('booking-modal').classList.remove('active');
  renderBookingsTable();
  renderDashboard();
}

function renderBookingsTable() {
  const tableBody = document.getElementById('booking-table-body');
  if (!tableBody) return;
  const searchVal = document.getElementById('booking-search') ? document.getElementById('booking-search').value.toLowerCase().trim() : '';
  const paymentVal = document.getElementById('booking-filter-payment') ? document.getElementById('booking-filter-payment').value : 'All';

  const filtered = state.bookings.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchVal);
    const matchesPayment = paymentVal === 'All' || item.payment === paymentVal;
    return matchesSearch && matchesPayment;
  });

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="no-data-msg">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
          <p>No bookings found.</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(item => `
    <tr>
      <td style="font-weight: 600;">
        ${item.name}
        ${item.mobile ? `<br><small style="color: var(--text-muted); font-weight: normal;">Mob: ${item.mobile}</small>` : ''}
      </td>
      <td>${formatDate(item.date)}</td>
      <td style="font-weight: 700; color: var(--primary);">${formatCurrency(item.amount)}</td>
      <td><span class="badge" style="background-color: var(--secondary-light); color: var(--secondary-hover);">${item.payment}</span></td>
      <td class="actions-cell">
        <button class="btn btn-outline btn-sm" onclick="editBooking('${item.id}')">Edit</button>
        <button class="btn btn-outline btn-sm btn-danger" onclick="deleteBooking('${item.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.editBooking = function(id) {
  const item = state.bookings.find(b => b.id === id);
  if (!item) return;
  document.getElementById('booking-modal-title').textContent = "Edit Booking";
  document.getElementById('booking-edit-id').value = item.id;
  document.getElementById('booking-enquiry-link-id').value = item.enquiryLinkId || "";
  document.getElementById('booking-name').value = item.name;
  document.getElementById('booking-mobile').value = item.mobile || "";
  document.getElementById('booking-date').value = item.date;
  document.getElementById('booking-amount').value = item.amount;
  document.getElementById('booking-payment').value = item.payment;
  document.getElementById('booking-modal').classList.add('active');
};

window.deleteBooking = function(id) {
  const item = state.bookings.find(b => b.id === id);
  if (!item) return;
  if (confirm(`Delete booking of ${item.name} for ${formatCurrency(item.amount)}?`)) {
    state.bookings = state.bookings.filter(b => b.id !== id);
    saveToStorage(STORAGE_KEYS.BOOKINGS, state.bookings);
    addActivity('booking', `Cancelled & deleted booking of <strong>${item.name}</strong>`);
    renderBookingsTable();
    renderDashboard();
  }
};

// ==========================================================================
// BILLING / INVOICE CONTROLLER + STOCK CONNECTION
// ==========================================================================
function generateInvoiceNumber() {
  const currentYear = new Date().getFullYear();
  const prefix = `BIOS-${currentYear}-`;
  let maxSeq = 0;
  state.billings.forEach(inv => {
    if (inv.invoiceNo && inv.invoiceNo.startsWith(prefix)) {
      const parts = inv.invoiceNo.split('-');
      if (parts.length === 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSeq) maxSeq = seq;
      }
    }
  });
  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `${prefix}${nextSeq}`;
}

function populateBillingBookingDropdown() {
  const select = document.getElementById('billing-booking-select');
  if (!select) return;
  const invoicedBookingIds = state.billings.map(b => b.bookingId).filter(Boolean);
  const uninvoicedBookings = state.bookings.filter(b => !invoicedBookingIds.includes(b.id));

  let html = '<option value="">-- Create custom invoice (or select booking) --</option>';
  uninvoicedBookings.forEach(b => {
    html += `<option value="${b.id}">${b.name} (${formatDate(b.date)}) - ${formatCurrency(b.amount)}</option>`;
  });
  select.innerHTML = html;
}

function populateBillingInventoryDropdown() {
  const select = document.getElementById('billing-inventory-select');
  if (!select) return;
  let html = '<option value="">-- Select from Inventory (or enter custom product below) --</option>';
  state.inventory.forEach(item => {
    const stockStatus = item.availableStock > 0 ? `Stock: ${item.availableStock}` : 'OUT OF STOCK';
    html += `<option value="${item.itemCode}">${item.itemName} (${item.brand}) - ₹${item.sellingRate} [${stockStatus}]</option>`;
  });
  select.innerHTML = html;
}

function handleBillingBookingSelection(e) {
  const bookingId = e.target.value;
  if (!bookingId) return;
  const booking = state.bookings.find(b => b.id === bookingId);
  if (!booking) return;

  document.getElementById('billing-customer-name').value = booking.name;
  document.getElementById('billing-customer-mobile').value = booking.mobile || '';
  document.getElementById('billing-product-name').value = `PC Hardware & Consulting Services`;
  document.getElementById('billing-amount').value = booking.amount;
  handleBillingAmountChange();
}

function handleBillingInventorySelection(e) {
  const code = e.target.value;
  if (!code) return;
  const item = state.inventory.find(i => i.itemCode === code);
  if (!item) return;

  document.getElementById('billing-product-name').value = item.itemName;
  document.getElementById('billing-amount').value = item.sellingRate || item.purchaseRate || 0;
  
  if (item.serials && item.serials.length > 0) {
    document.getElementById('billing-serial-no').value = item.serials[0];
  } else {
    document.getElementById('billing-serial-no').value = '';
  }

  if (item.availableStock <= 0) {
    alert(`⚠️ Warning: "${item.itemName}" currently has ZERO available stock in inventory. Saving this invoice will register a negative stock deficit.`);
  }

  handleBillingAmountChange();
}

function handleBillingAmountChange() {
  const baseRate = parseFloat(document.getElementById('billing-amount').value || 0);
  const qty = parseFloat(document.getElementById('billing-qty').value || 1);
  const gstRate = parseFloat(document.getElementById('billing-gst').value || 18);

  const subtotal = baseRate * qty;
  const gstAmount = subtotal * (gstRate / 100);
  const totalAmount = subtotal + gstAmount;

  document.getElementById('billing-calc-subtotal').textContent = formatCurrency(subtotal);
  document.getElementById('billing-calc-gst').textContent = formatCurrency(gstAmount);
  document.getElementById('billing-calc-total').textContent = formatCurrency(totalAmount);
}

// Submit Sales Invoice -> Automatically decreases Stock & Logs to Ledger
function handleBillingSubmit(e) {
  e.preventDefault();

  const bookingSelect = document.getElementById('billing-booking-select');
  const bookingId = bookingSelect ? bookingSelect.value : null;

  const invoiceNo = document.getElementById('billing-invoice-no').value;
  const invoiceDate = document.getElementById('billing-date').value;
  const customerName = document.getElementById('billing-customer-name').value.trim();
  const customerMobile = document.getElementById('billing-customer-mobile').value.trim();
  const customerAddress = document.getElementById('billing-customer-address') ? document.getElementById('billing-customer-address').value.trim() : '';
  const customerGst = document.getElementById('billing-customer-gst') ? document.getElementById('billing-customer-gst').value.trim().toUpperCase() : '';
  const productName = document.getElementById('billing-product-name').value.trim();
  const serialNo = document.getElementById('billing-serial-no').value.trim();
  const qty = parseFloat(document.getElementById('billing-qty').value || 1);
  const unitRate = parseFloat(document.getElementById('billing-amount').value || 0);
  const gstRate = parseFloat(document.getElementById('billing-gst').value || 18);

  const baseAmount = unitRate * qty;
  const gstAmount = baseAmount * (gstRate / 100);
  const totalAmount = baseAmount + gstAmount;

  // Identify if item is matched to Inventory Stock
  const inventorySelect = document.getElementById('billing-inventory-select');
  const selectedItemCode = inventorySelect ? inventorySelect.value : '';
  
  let matchedItem = null;
  if (selectedItemCode) {
    matchedItem = state.inventory.find(i => i.itemCode === selectedItemCode);
  } else {
    // Fallback fuzzy match by Name
    matchedItem = state.inventory.find(i => i.itemName.toLowerCase() === productName.toLowerCase());
  }

  const costPrice = matchedItem ? (matchedItem.purchaseRate || 0) : (unitRate * 0.8);
  const itemCode = matchedItem ? matchedItem.itemCode : ('ITEM-' + Date.now());

  // 1. Automatically reduce stock and record in Stock Ledger
  recordStockMovement({
    itemCode: itemCode,
    itemName: productName,
    category: matchedItem ? matchedItem.category : 'General',
    type: 'SALE',
    refNo: invoiceNo,
    inQty: 0,
    outQty: qty,
    unitCost: costPrice,
    remarks: `Sales Invoice ${invoiceNo} to ${customerName}`
  });

  // 2. Save Invoice record with complete customer details
  const newInvoice = {
    id: 'INV-' + Date.now(),
    invoiceNo,
    date: invoiceDate,
    customerName,
    customerMobile,
    customerAddress,
    customerGst,
    itemCode,
    productName,
    serialNo,
    qty,
    unitRate,
    baseAmount,
    gstRate,
    gstAmount,
    totalAmount,
    costPrice,
    bookingId: bookingId || null
  };

  state.billings.push(newInvoice);
  saveToStorage(STORAGE_KEYS.BILLINGS, state.billings);
  addActivity('billing', `Generated Sales Invoice <strong>${invoiceNo}</strong> for ${customerName} (Total: ${formatCurrency(totalAmount)}, Stock Deducted: ${qty})`);

  document.getElementById('billing-modal-form').classList.remove('active');
  openInvoicePreviewModal(newInvoice);
  renderBillingsTable();
  renderInventoryTable();
  renderDashboard();
}

function renderBillingsTable() {
  const tableBody = document.getElementById('billing-table-body');
  if (!tableBody) return;
  const sorted = [...state.billings].sort((a, b) => b.invoiceNo.localeCompare(a.invoiceNo));

  if (sorted.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="no-data-msg">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
          <p>No sales invoices generated yet.</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = sorted.map(item => `
    <tr>
      <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${item.invoiceNo}</td>
      <td>
        <span style="font-weight: 600;">${item.customerName}</span>
        ${item.customerMobile ? `<br><small style="color: var(--text-muted);">Mob: ${item.customerMobile}</small>` : ''}
        ${item.customerGst ? `<br><small style="color: var(--primary); font-family: monospace;">GST: ${item.customerGst}</small>` : ''}
      </td>
      <td>
        <strong>${item.productName}</strong>
        ${item.serialNo ? `<br><small style="color: var(--text-muted); font-family: monospace;">S/N: ${item.serialNo}</small>` : ''}
      </td>
      <td style="text-align: center; font-weight: 600;">${item.qty || 1}</td>
      <td>${formatCurrency(item.baseAmount)}</td>
      <td>${formatCurrency(item.gstAmount)} <small style="color: var(--text-muted);">(${item.gstRate || 18}%)</small></td>
      <td style="font-weight: 700; color: var(--success-dark);">${formatCurrency(item.totalAmount)}</td>
      <td class="actions-cell">
        <button class="btn btn-primary btn-sm" onclick="previewInvoice('${item.id}')">⎙ Print</button>
        <button class="btn btn-outline btn-sm btn-danger" onclick="deleteInvoice('${item.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.previewInvoice = function(id) {
  const item = state.billings.find(i => i.id === id);
  if (!item) return;
  openInvoicePreviewModal(item);
};

function openInvoicePreviewModal(invoice) {
  document.getElementById('inv-preview-no').textContent = invoice.invoiceNo;
  document.getElementById('inv-preview-date').textContent = formatDate(invoice.date);
  document.getElementById('inv-preview-client-name').textContent = invoice.customerName;
  document.getElementById('inv-preview-client-phone').textContent = invoice.customerMobile ? `Phone: +91 ${invoice.customerMobile}` : 'Phone: --';
  
  const addrEl = document.getElementById('inv-preview-client-address');
  if (addrEl) {
    if (invoice.customerAddress) {
      addrEl.textContent = `Address: ${invoice.customerAddress}`;
      addrEl.style.display = 'block';
    } else {
      addrEl.style.display = 'none';
    }
  }

  const gstEl = document.getElementById('inv-preview-client-gst');
  if (gstEl) {
    if (invoice.customerGst) {
      gstEl.textContent = `GSTIN: ${invoice.customerGst}`;
      gstEl.style.display = 'block';
    } else {
      gstEl.style.display = 'none';
    }
  }

  document.getElementById('inv-preview-product').textContent = invoice.productName;
  
  const serialDiv = document.getElementById('inv-preview-serial');
  if (serialDiv) {
    serialDiv.textContent = invoice.serialNo ? `Serial / Tag No: ${invoice.serialNo}` : '';
  }

  const qty = invoice.qty || 1;
  const unitRate = invoice.unitRate || (invoice.baseAmount / qty);
  document.getElementById('inv-preview-qty').textContent = qty;
  document.getElementById('inv-preview-unit-rate').textContent = formatCurrency(unitRate);
  document.getElementById('inv-preview-base').textContent = formatCurrency(invoice.baseAmount);
  document.getElementById('inv-preview-subtotal').textContent = formatCurrency(invoice.baseAmount);
  document.getElementById('inv-preview-gst-rate').textContent = `${invoice.gstRate || 18}%`;
  document.getElementById('inv-preview-gst').textContent = formatCurrency(invoice.gstAmount);
  document.getElementById('inv-preview-total').textContent = formatCurrency(invoice.totalAmount);

  document.getElementById('invoice-modal').classList.add('active');
}

window.deleteInvoice = function(id) {
  const item = state.billings.find(b => b.id === id);
  if (!item) return;
  if (confirm(`Delete Invoice ${item.invoiceNo}? Note: Stock will be automatically restored.`)) {
    // Reverse stock deduction
    recordStockMovement({
      itemCode: item.itemCode,
      itemName: item.productName,
      type: 'SALES_RETURN',
      refNo: `REVERSAL-${item.invoiceNo}`,
      inQty: item.qty || 1,
      outQty: 0,
      unitCost: item.costPrice || 0,
      remarks: `Invoice ${item.invoiceNo} deleted - Stock restored`
    });

    state.billings = state.billings.filter(b => b.id !== id);
    saveToStorage(STORAGE_KEYS.BILLINGS, state.billings);
    addActivity('billing', `Deleted Invoice <strong>${item.invoiceNo}</strong> (Stock Restored)`);
    renderBillingsTable();
    renderInventoryTable();
    renderDashboard();
  }
};

// ==========================================================================
// PURCHASES CONTROLLER (AUTO STOCK INCREMENT)
// ==========================================================================
function populatePurchaseDataLists() {
  const supplierList = document.getElementById('purchase-supplier-list');
  if (supplierList) {
    supplierList.innerHTML = state.suppliers.map(s => `<option value="${s.name}">`).join('');
  }
  const itemCodeList = document.getElementById('inventory-code-list');
  if (itemCodeList) {
    itemCodeList.innerHTML = state.inventory.map(i => `<option value="${i.itemCode}">${i.itemName} (${i.brand})</option>`).join('');
  }
}

function calculatePurchaseTotals() {
  const qty = parseFloat(document.getElementById('purchase-qty').value || 0);
  const rate = parseFloat(document.getElementById('purchase-rate').value || 0);
  const discount = parseFloat(document.getElementById('purchase-discount').value || 0);
  const gstRate = parseFloat(document.getElementById('purchase-gst-rate').value || 18);
  const paidAmount = parseFloat(document.getElementById('purchase-paid-amount').value || 0);

  const rawAmount = (qty * rate) - discount;
  const taxableAmount = Math.max(0, rawAmount);
  const gstAmount = taxableAmount * (gstRate / 100);
  const totalAmount = taxableAmount + gstAmount;
  const balanceAmount = Math.max(0, totalAmount - paidAmount);

  document.getElementById('purchase-calc-taxable').textContent = formatCurrency(taxableAmount);
  document.getElementById('purchase-calc-gst').textContent = formatCurrency(gstAmount);
  document.getElementById('purchase-calc-total').textContent = formatCurrency(totalAmount);
  document.getElementById('purchase-balance-amount').value = formatCurrency(balanceAmount);
}

function handlePurchaseSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('purchase-edit-id').value;
  const supplier = document.getElementById('purchase-supplier').value.trim();
  const supplierPhone = document.getElementById('purchase-supplier-phone').value.trim();
  const invoiceNo = document.getElementById('purchase-invoice-no').value.trim();
  const date = document.getElementById('purchase-date').value;
  const itemCode = document.getElementById('purchase-item-code').value.trim().toUpperCase();
  const itemName = document.getElementById('purchase-item-name').value.trim();
  const category = document.getElementById('purchase-category').value;
  const brand = document.getElementById('purchase-brand').value.trim();
  const model = document.getElementById('purchase-model').value.trim();
  const minStock = parseFloat(document.getElementById('purchase-min-stock').value || 2);
  const serialRaw = document.getElementById('purchase-serial-numbers').value.trim();
  const serials = serialRaw ? serialRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

  const qty = parseFloat(document.getElementById('purchase-qty').value || 1);
  const rate = parseFloat(document.getElementById('purchase-rate').value || 0);
  const discount = parseFloat(document.getElementById('purchase-discount').value || 0);
  const gstRate = parseFloat(document.getElementById('purchase-gst-rate').value || 18);
  const sellingRateInput = parseFloat(document.getElementById('purchase-selling-rate').value || 0);
  const paidAmount = parseFloat(document.getElementById('purchase-paid-amount').value || 0);

  const taxableAmount = Math.max(0, (qty * rate) - discount);
  const gstAmount = taxableAmount * (gstRate / 100);
  const totalAmount = taxableAmount + gstAmount;
  const balanceAmount = Math.max(0, totalAmount - paidAmount);
  const status = balanceAmount <= 0 ? 'Paid' : (paidAmount > 0 ? 'Partial' : 'Unpaid');

  // 1. Automatically increase stock and record in Stock Ledger
  const item = recordStockMovement({
    itemCode,
    itemName,
    category,
    type: 'PURCHASE',
    refNo: invoiceNo,
    inQty: qty,
    outQty: 0,
    unitCost: rate,
    remarks: `Inward Purchase from ${supplier} (Inv: ${invoiceNo})`
  });

  // Update additional metadata on Master Item
  item.brand = brand;
  item.model = model;
  item.minStock = minStock;
  if (sellingRateInput > 0) item.sellingRate = sellingRateInput;
  if (serials.length > 0) {
    item.serials = [...new Set([...(item.serials || []), ...serials])];
  }
  saveToStorage(STORAGE_KEYS.INVENTORY, state.inventory);

  // 2. Update Supplier record
  let sup = state.suppliers.find(s => s.name.toLowerCase() === supplier.toLowerCase());
  if (!sup) {
    sup = {
      name: supplier,
      phone: supplierPhone,
      email: '',
      gstin: '',
      totalPurchases: totalAmount,
      balanceDue: balanceAmount
    };
    state.suppliers.push(sup);
  } else {
    sup.totalPurchases = (parseFloat(sup.totalPurchases || 0) + totalAmount);
    sup.balanceDue = (parseFloat(sup.balanceDue || 0) + balanceAmount);
    if (supplierPhone) sup.phone = supplierPhone;
  }
  saveToStorage(STORAGE_KEYS.SUPPLIERS, state.suppliers);

  // 3. Save Purchase record
  const newPurchase = {
    id: editId || ('PUR-' + Date.now()),
    invoiceNo,
    date,
    supplier,
    supplierPhone,
    itemCode,
    itemName,
    category,
    brand,
    model,
    qty,
    rate,
    discount,
    gstRate,
    taxableAmount,
    gstAmount,
    totalAmount,
    paidAmount,
    balanceAmount,
    status,
    serials
  };

  if (editId) {
    const idx = state.purchases.findIndex(p => p.id === editId);
    if (idx !== -1) state.purchases[idx] = newPurchase;
  } else {
    state.purchases.push(newPurchase);
  }

  saveToStorage(STORAGE_KEYS.PURCHASES, state.purchases);
  addActivity('purchase', `Recorded Purchase <strong>${invoiceNo}</strong> from ${supplier} (Qty: ${qty}x ${itemName}, Stock Increased)`);

  document.getElementById('purchase-modal').classList.remove('active');
  renderPurchasesTable();
  renderInventoryTable();
  renderDashboard();
  renderReports();
}

function renderPurchasesTable() {
  const tableBody = document.getElementById('purchases-table-body');
  if (!tableBody) return;

  const searchVal = document.getElementById('purchase-search') ? document.getElementById('purchase-search').value.toLowerCase().trim() : '';
  const statusVal = document.getElementById('purchase-filter-status') ? document.getElementById('purchase-filter-status').value : 'All';
  const fromDateVal = document.getElementById('purchase-filter-from') ? document.getElementById('purchase-filter-from').value : '';
  const toDateVal = document.getElementById('purchase-filter-to') ? document.getElementById('purchase-filter-to').value : '';

  const isWithinDateRange = (itemDateStr) => {
    if (!itemDateStr) return true;
    const itemDate = new Date(itemDateStr).setHours(0, 0, 0, 0);
    if (fromDateVal && itemDate < new Date(fromDateVal).setHours(0, 0, 0, 0)) return false;
    if (toDateVal && itemDate > new Date(toDateVal).setHours(0, 0, 0, 0)) return false;
    return true;
  };

  const filtered = state.purchases.filter(item => {
    const matchesSearch = item.supplier.toLowerCase().includes(searchVal) ||
      item.invoiceNo.toLowerCase().includes(searchVal) ||
      item.itemCode.toLowerCase().includes(searchVal) ||
      item.itemName.toLowerCase().includes(searchVal) ||
      (item.brand && item.brand.toLowerCase().includes(searchVal));
    const matchesStatus = statusVal === 'All' || item.status === statusVal;
    return matchesSearch && matchesStatus && isWithinDateRange(item.date);
  });

  filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Update Summary Metrics
  const totalPurchases = filtered.reduce((sum, p) => sum + (parseFloat(p.totalAmount) || 0), 0);
  const totalPaid = filtered.reduce((sum, p) => sum + (parseFloat(p.paidAmount) || 0), 0);
  const totalBalance = filtered.reduce((sum, p) => sum + (parseFloat(p.balanceAmount) || 0), 0);

  const elTot = document.getElementById('purchase-metric-total');
  const elPaid = document.getElementById('purchase-metric-paid');
  const elBal = document.getElementById('purchase-metric-balance');
  const elCnt = document.getElementById('purchase-metric-count');
  if (elTot) elTot.textContent = formatCurrency(totalPurchases);
  if (elPaid) elPaid.textContent = formatCurrency(totalPaid);
  if (elBal) elBal.textContent = formatCurrency(totalBalance);
  if (elCnt) elCnt.textContent = `${filtered.length} Invoices`;

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="12" class="no-data-msg">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
          <p>No purchase records found matching filters.</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(item => {
    let statusClass = 'badge-paid';
    if (item.status === 'Partial') statusClass = 'badge-partial';
    if (item.status === 'Unpaid') statusClass = 'badge-unpaid';

    const serialsBtn = (item.serials && item.serials.length > 0) ? `
      <br><button class="btn btn-sm btn-outline" style="font-size:0.7rem; padding:0.1rem 0.4rem; margin-top:0.2rem;" onclick="viewItemSerials('${item.itemCode}')">
        🔍 S/N (${item.serials.length})
      </button>
    ` : '';

    return `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${item.invoiceNo}</td>
        <td>${formatDate(item.date)}</td>
        <td>
          <span style="font-weight: 600;">${item.supplier}</span>
          ${item.supplierPhone ? `<br><small style="color: var(--text-muted);">Ph: ${item.supplierPhone}</small>` : ''}
        </td>
        <td>
          <span style="font-weight: 600;">${item.itemName}</span>
          <br><small style="color: var(--text-muted); font-family: monospace;">${item.itemCode}</small>
          ${serialsBtn}
        </td>
        <td><span class="badge badge-category">${item.brand || '--'}</span></td>
        <td style="text-align: center; font-weight: 700;">${item.qty}</td>
        <td>${formatCurrency(item.rate)}</td>
        <td><small>${item.gstRate || 18}%</small></td>
        <td style="font-weight: 700;">${formatCurrency(item.totalAmount)}</td>
        <td>
          <span style="color: var(--success-dark); font-weight: 600;">Paid: ${formatCurrency(item.paidAmount)}</span>
          ${item.balanceAmount > 0 ? `<br><small style="color: var(--danger-dark); font-weight: 700;">Bal: ${formatCurrency(item.balanceAmount)}</small>` : ''}
        </td>
        <td><span class="badge ${statusClass}">${item.status}</span></td>
        <td class="actions-cell">
          <button class="btn btn-primary btn-sm" onclick="previewPurchaseInvoice('${item.id}')">⎙ View</button>
          <button class="btn btn-outline btn-sm btn-danger" onclick="deletePurchase('${item.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.previewPurchaseInvoice = function(id) {
  const item = state.purchases.find(p => p.id === id);
  if (!item) return;

  document.getElementById('purch-prev-inv').textContent = item.invoiceNo;
  document.getElementById('purch-prev-date').textContent = formatDate(item.date);
  document.getElementById('purch-prev-supplier').textContent = item.supplier;
  document.getElementById('purch-prev-supplier-phone').textContent = item.supplierPhone ? `Phone: ${item.supplierPhone}` : 'Phone: --';
  document.getElementById('purch-prev-item').textContent = `${item.itemName} (${item.itemCode})`;
  
  const serialDiv = document.getElementById('purch-prev-serials');
  if (serialDiv) {
    serialDiv.textContent = item.serials && item.serials.length > 0 ? `Serial Nos: ${item.serials.join(', ')}` : '';
  }

  document.getElementById('purch-prev-brand-model').textContent = `${item.brand} / ${item.model || '--'}`;
  document.getElementById('purch-prev-qty').textContent = item.qty;
  document.getElementById('purch-prev-rate').textContent = formatCurrency(item.rate);
  document.getElementById('purch-prev-total').textContent = formatCurrency(item.totalAmount);
  document.getElementById('purch-prev-taxable').textContent = formatCurrency(item.taxableAmount || (item.qty * item.rate));
  document.getElementById('purch-prev-gst-rate').textContent = `${item.gstRate || 18}%`;
  document.getElementById('purch-prev-gst').textContent = formatCurrency(item.gstAmount);
  document.getElementById('purch-prev-grand').textContent = formatCurrency(item.totalAmount);
  document.getElementById('purch-prev-paid').textContent = formatCurrency(item.paidAmount);
  document.getElementById('purch-prev-balance').textContent = formatCurrency(item.balanceAmount);

  document.getElementById('purchase-view-modal').classList.add('active');
};

window.deletePurchase = function(id) {
  const item = state.purchases.find(p => p.id === id);
  if (!item) return;
  if (confirm(`Delete Purchase Invoice ${item.invoiceNo}? Note: This will automatically deduct ${item.qty} units from stock.`)) {
    // Reverse purchase stock
    recordStockMovement({
      itemCode: item.itemCode,
      itemName: item.itemName,
      type: 'PURCHASE_RETURN',
      refNo: `REVERSAL-${item.invoiceNo}`,
      inQty: 0,
      outQty: item.qty,
      unitCost: item.rate,
      remarks: `Purchase Bill ${item.invoiceNo} deleted - Inward stock reversed`
    });

    state.purchases = state.purchases.filter(p => p.id !== id);
    saveToStorage(STORAGE_KEYS.PURCHASES, state.purchases);
    addActivity('purchase', `Deleted Purchase Bill <strong>${item.invoiceNo}</strong> (Stock Deducted)`);
    renderPurchasesTable();
    renderInventoryTable();
    renderDashboard();
  }
};

// ==========================================================================
// STOCK AVAILABILITY CONTROLLER
// ==========================================================================
function renderInventoryTable() {
  const tableBody = document.getElementById('inventory-table-body');
  if (!tableBody) return;

  const searchVal = document.getElementById('stock-search') ? document.getElementById('stock-search').value.toLowerCase().trim() : '';
  const categoryVal = document.getElementById('stock-filter-category') ? document.getElementById('stock-filter-category').value : 'All';
  const statusVal = document.getElementById('stock-filter-status') ? document.getElementById('stock-filter-status').value : 'All';

  // Ensure all items have availableStock freshly computed
  state.inventory.forEach(item => {
    item.availableStock = calculateAvailableStock(item);
  });

  const filtered = state.inventory.filter(item => {
    const matchesSearch = item.itemCode.toLowerCase().includes(searchVal) ||
      item.itemName.toLowerCase().includes(searchVal) ||
      (item.brand && item.brand.toLowerCase().includes(searchVal)) ||
      (item.model && item.model.toLowerCase().includes(searchVal));
    const matchesCategory = categoryVal === 'All' || item.category === categoryVal;
    
    const status = getStockStatus(item.availableStock, item.minStock);
    const matchesStatus = statusVal === 'All' || status === statusVal;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Metrics
  let totalValuation = 0;
  let availableCount = 0;
  let lowCount = 0;
  let outCount = 0;

  state.inventory.forEach(item => {
    const avail = item.availableStock || 0;
    const rate = item.purchaseRate || 0;
    const min = item.minStock || 0;
    if (avail > 0) totalValuation += (avail * rate);
    const st = getStockStatus(avail, min);
    if (st === 'Available') availableCount++;
    else if (st === 'Low Stock') lowCount++;
    else if (st === 'Out of Stock') outCount++;
  });

  const elTotVal = document.getElementById('stock-metric-total-val');
  const elTotItems = document.getElementById('stock-metric-total-items');
  const elAvailCnt = document.getElementById('stock-metric-available-count');
  const elLowCnt = document.getElementById('stock-metric-low-count');
  const elOutCnt = document.getElementById('stock-metric-out-count');

  if (elTotVal) elTotVal.textContent = formatCurrency(totalValuation);
  if (elTotItems) elTotItems.textContent = `${state.inventory.length} Unique Items`;
  if (elAvailCnt) elAvailCnt.textContent = availableCount;
  if (elLowCnt) elLowCnt.textContent = lowCount;
  if (elOutCnt) elOutCnt.textContent = outCount;

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="13" class="no-data-msg">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
          <p>No inventory items match the current search or category filter.</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(item => {
    const avail = item.availableStock || 0;
    const status = getStockStatus(avail, item.minStock);
    let statusClass = 'badge-available';
    if (status === 'Low Stock') statusClass = 'badge-low-stock';
    if (status === 'Out of Stock') statusClass = 'badge-out-of-stock';

    const stockValue = Math.max(0, avail) * (item.purchaseRate || 0);

    const serialsBtn = (item.serials && item.serials.length > 0) ? `
      <button class="btn btn-sm btn-outline" style="font-size:0.7rem; padding:0.15rem 0.45rem;" onclick="viewItemSerials('${item.itemCode}')">
        S/N (${item.serials.length})
      </button>
    ` : '';

    return `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${item.itemCode}</td>
        <td>
          <span style="font-weight: 600;">${item.itemName}</span>
        </td>
        <td><span class="badge badge-category">${item.category}</span></td>
        <td>${item.brand || '--'} ${item.model ? `<small style="color:var(--text-muted);">(${item.model})</small>` : ''}</td>
        <td style="text-align: center; color: var(--text-muted);">${item.purchaseQty || 0}</td>
        <td style="text-align: center; color: var(--text-muted);">${item.salesQty || 0}</td>
        <td style="text-align: center; font-size: 1.05rem; font-weight: 800; color: ${avail <= 0 ? 'var(--danger)' : 'var(--text-main)'};">
          ${avail}
        </td>
        <td>${formatCurrency(item.purchaseRate)}</td>
        <td style="font-weight: 600; color: var(--primary);">${formatCurrency(item.sellingRate)}</td>
        <td style="font-weight: 700; color: var(--success-dark);">${formatCurrency(stockValue)}</td>
        <td style="text-align: center; color: var(--text-muted);">${item.minStock || 2}</td>
        <td><span class="badge ${statusClass}">${status}</span></td>
        <td class="actions-cell">
          <button class="btn btn-outline btn-sm" onclick="quickStockAdjust('${item.itemCode}')" title="Adjust Stock (±)">± Adjust</button>
          ${serialsBtn}
        </td>
      </tr>
    `;
  }).join('');
}

window.quickStockAdjust = function(itemCode) {
  const item = state.inventory.find(i => i.itemCode === itemCode);
  if (!item) return;
  const select = document.getElementById('adjust-item-select');
  if (select) {
    select.innerHTML = `<option value="${item.itemCode}">${item.itemName} (Code: ${item.itemCode}, Available: ${item.availableStock})</option>`;
    select.value = item.itemCode;
  }
  document.getElementById('adjust-qty').value = 1;
  document.getElementById('stock-adjust-modal').classList.add('active');
};

function handleStockAdjustmentSubmit(e) {
  e.preventDefault();
  const itemCode = document.getElementById('adjust-item-select').value;
  const type = document.getElementById('adjust-type').value; // 'ADD' or 'DEDUCT'
  const qty = parseFloat(document.getElementById('adjust-qty').value || 1);
  const reason = document.getElementById('adjust-reason').value;
  const remarks = document.getElementById('adjust-remarks').value.trim();

  const item = state.inventory.find(i => i.itemCode === itemCode);
  if (!item) return;

  const inQty = type === 'ADD' ? qty : 0;
  const outQty = type === 'DEDUCT' ? qty : 0;

  recordStockMovement({
    itemCode: item.itemCode,
    itemName: item.itemName,
    category: item.category,
    type: 'ADJUSTMENT',
    refNo: `ADJ-${Date.now().toString().slice(-4)}`,
    inQty,
    outQty,
    unitCost: item.purchaseRate,
    remarks: `${reason} (${type === 'ADD' ? '+' : '-'}${qty}) ${remarks ? '- ' + remarks : ''}`
  });

  addActivity('inventory', `Stock Adjustment: <strong>${type === 'ADD' ? '+' : '-'}${qty}</strong> for ${item.itemName} (${reason})`);

  document.getElementById('stock-adjust-modal').classList.remove('active');
  renderInventoryTable();
  renderDashboard();
  renderReports();
}

window.viewItemSerials = function(itemCode) {
  const item = state.inventory.find(i => i.itemCode === itemCode);
  if (!item) return;
  document.getElementById('serial-modal-title').textContent = `Serial Numbers: ${item.itemCode}`;
  document.getElementById('serial-modal-subtitle').textContent = `${item.itemName} (${item.serials ? item.serials.length : 0} serial numbers tracked)`;

  const container = document.getElementById('serial-tags-list');
  if (item.serials && item.serials.length > 0) {
    container.innerHTML = item.serials.map(s => `<span class="serial-tag">${s}</span>`).join('');
  } else {
    container.innerHTML = `<div class="no-data-msg" style="padding: 1rem !important;">No serial numbers recorded for this item.</div>`;
  }

  document.getElementById('serial-modal').classList.add('active');
};

// ==========================================================================
// PC BUILD / ASSEMBLY CONTROLLER
// ==========================================================================
function renderPCBuilderDropdowns() {
  const slots = [
    { id: 'pc-slot-cpu', category: 'CPU' },
    { id: 'pc-slot-motherboard', category: 'Motherboard' },
    { id: 'pc-slot-ram', category: 'RAM' },
    { id: 'pc-slot-storage', category: 'Storage' },
    { id: 'pc-slot-gpu', category: 'GPU' },
    { id: 'pc-slot-psu', category: 'PSU' },
    { id: 'pc-slot-cabinet', category: 'Cabinet' },
    { id: 'pc-slot-cooler', category: 'Cooler' },
    { id: 'pc-slot-extra', category: 'All' }
  ];

  slots.forEach(slot => {
    const el = document.getElementById(slot.id);
    if (!el) return;
    const currentVal = el.value;

    let items = state.inventory;
    if (slot.category !== 'All') {
      items = items.filter(i => i.category === slot.category);
    }

    let defaultOption = `<option value="">-- Choose ${slot.category} from Stock --</option>`;
    if (slot.id === 'pc-slot-gpu') defaultOption = `<option value="">-- No Dedicated GPU (Integrated Graphics) --</option>`;
    if (slot.id === 'pc-slot-extra') defaultOption = `<option value="">-- None / Optional --</option>`;

    let html = defaultOption;
    items.forEach(item => {
      const stockInfo = item.availableStock > 0 ? `In Stock: ${item.availableStock}` : `OUT OF STOCK`;
      html += `<option value="${item.itemCode}" data-cost="${item.purchaseRate || 0}" data-sell="${item.sellingRate || 0}">
        ${item.brand} - ${item.itemName} (Cost: ₹${item.purchaseRate}) [${stockInfo}]
      </option>`;
    });

    el.innerHTML = html;
    if (currentVal) el.value = currentVal;
  });

  const dateInput = document.getElementById('pc-build-date');
  if (dateInput && !dateInput.value) dateInput.value = getTodayDateString();

  const serialInput = document.getElementById('pc-build-serial');
  if (serialInput && !serialInput.value) {
    serialInput.value = `BIOS-PC-${new Date().getFullYear()}-${String(state.pcBuilds.length + 1).padStart(3, '0')}`;
  }

  updatePCBuildCalculations();
}

function updatePCBuildCalculations() {
  const slotMappings = [
    { selectId: 'pc-slot-cpu', badgeId: 'slot-cpu-cost', label: 'CPU Processor', qty: 1 },
    { selectId: 'pc-slot-motherboard', badgeId: 'slot-motherboard-cost', label: 'Motherboard', qty: 1 },
    { selectId: 'pc-slot-ram', badgeId: 'slot-ram-cost', label: 'RAM Memory', qtyMultiplierId: 'pc-slot-ram-qty' },
    { selectId: 'pc-slot-storage', badgeId: 'slot-storage-cost', label: 'Primary SSD Storage', qty: 1 },
    { selectId: 'pc-slot-gpu', badgeId: 'slot-gpu-cost', label: 'Graphics Card (GPU)', qty: 1 },
    { selectId: 'pc-slot-psu', badgeId: 'slot-psu-cost', label: 'Power Supply Unit', qty: 1 },
    { selectId: 'pc-slot-cabinet', badgeId: 'slot-cabinet-cost', label: 'PC Cabinet', qty: 1 },
    { selectId: 'pc-slot-cooler', badgeId: 'slot-cooler-cost', label: 'CPU Cooler', qty: 1 },
    { selectId: 'pc-slot-extra', badgeId: 'slot-extra-cost', label: 'Extra Component', qty: 1 }
  ];

  let totalComponentsCost = 0;
  let recommendedSellingPrice = 0;
  let summaryRowsHtml = '';

  slotMappings.forEach(mapping => {
    const select = document.getElementById(mapping.selectId);
    const badge = document.getElementById(mapping.badgeId);
    if (!select || !badge) return;

    const itemCode = select.value;
    let qty = mapping.qty || 1;
    if (mapping.qtyMultiplierId) {
      const qtyEl = document.getElementById(mapping.qtyMultiplierId);
      if (qtyEl) qty = parseFloat(qtyEl.value || 1);
    }

    if (itemCode) {
      const item = state.inventory.find(i => i.itemCode === itemCode);
      if (item) {
        const unitCost = parseFloat(item.purchaseRate || 0);
        const unitSell = parseFloat(item.sellingRate || unitCost * 1.25);
        const slotCost = unitCost * qty;
        const slotSell = unitSell * qty;

        totalComponentsCost += slotCost;
        recommendedSellingPrice += slotSell;
        badge.textContent = formatCurrency(slotCost);

        summaryRowsHtml += `
          <div class="build-item-row">
            <span>${mapping.label} (${qty}x):</span>
            <strong>${formatCurrency(slotCost)}</strong>
          </div>
        `;
      }
    } else {
      badge.textContent = formatCurrency(0);
    }
  });

  const laborCost = parseFloat(document.getElementById('pc-labor-cost') ? document.getElementById('pc-labor-cost').value : 1500) || 0;
  const totalBuildCost = totalComponentsCost + laborCost;

  const summaryContainer = document.getElementById('pc-build-items-summary');
  if (summaryContainer) {
    if (summaryRowsHtml) {
      summaryContainer.innerHTML = summaryRowsHtml;
    } else {
      summaryContainer.innerHTML = `<div class="no-data-msg" style="padding: 0.5rem 0 !important; font-size: 0.85rem;">Select components above to preview cost breakdown.</div>`;
    }
  }

  const elCompCost = document.getElementById('pc-calc-components-cost');
  const elTotCost = document.getElementById('pc-calc-total-cost');
  const elMargin = document.getElementById('pc-calc-margin');
  const sellingInput = document.getElementById('pc-selling-price');

  if (elCompCost) elCompCost.textContent = formatCurrency(totalComponentsCost);
  if (elTotCost) elTotCost.textContent = formatCurrency(totalBuildCost);

  // Auto recommend selling price if input is empty
  if (sellingInput && (!sellingInput.value || sellingInput.value == 0)) {
    sellingInput.value = Math.round((recommendedSellingPrice + laborCost) / 100) * 100;
  }

  const currentSellingPrice = parseFloat(sellingInput ? sellingInput.value : 0) || 0;
  const marginAmount = currentSellingPrice - totalBuildCost;
  const marginPercent = currentSellingPrice > 0 ? ((marginAmount / currentSellingPrice) * 100).toFixed(2) : 0;

  if (elMargin) {
    elMargin.textContent = `${formatCurrency(marginAmount)} (${marginPercent}%)`;
    elMargin.style.color = marginAmount >= 0 ? 'var(--success-dark)' : 'var(--danger-dark)';
  }
}

// Assemble PC: Deduct components from stock, create Finished PC stock item, log to ledger & history
function handlePCBuildSubmit(e) {
  e.preventDefault();

  const buildName = document.getElementById('pc-build-name').value.trim();
  const serialNo = document.getElementById('pc-build-serial').value.trim();
  const buildDate = document.getElementById('pc-build-date').value;
  const customerName = document.getElementById('pc-customer-name').value.trim();
  const customerPhone = document.getElementById('pc-customer-phone').value.trim();
  const customerAddress = document.getElementById('pc-customer-address') ? document.getElementById('pc-customer-address').value.trim() : '';
  const customerGst = document.getElementById('pc-customer-gst') ? document.getElementById('pc-customer-gst').value.trim().toUpperCase() : '';
  const laborCost = parseFloat(document.getElementById('pc-labor-cost').value || 1500);
  const sellingPrice = parseFloat(document.getElementById('pc-selling-price').value || 0);

  const slotIds = [
    { id: 'pc-slot-cpu', name: 'CPU', qty: 1 },
    { id: 'pc-slot-motherboard', name: 'Motherboard', qty: 1 },
    { id: 'pc-slot-ram', name: 'RAM', qty: parseFloat(document.getElementById('pc-slot-ram-qty').value || 1) },
    { id: 'pc-slot-storage', name: 'Storage', qty: 1 },
    { id: 'pc-slot-gpu', name: 'GPU', qty: 1 },
    { id: 'pc-slot-psu', name: 'PSU', qty: 1 },
    { id: 'pc-slot-cabinet', name: 'Cabinet', qty: 1 },
    { id: 'pc-slot-cooler', name: 'Cooler', qty: 1 },
    { id: 'pc-slot-extra', name: 'Extra', qty: 1 }
  ];

  const selectedComponents = [];
  let totalComponentsCost = 0;

  // Verify stock availability for each selected component
  for (const slot of slotIds) {
    const select = document.getElementById(slot.id);
    const itemCode = select ? select.value : '';
    if (itemCode) {
      const item = state.inventory.find(i => i.itemCode === itemCode);
      if (!item) continue;
      if (item.availableStock < slot.qty) {
        alert(`❌ Cannot build PC: Component "${item.itemName}" does not have enough stock (Available: ${item.availableStock}, Required: ${slot.qty}). Please restock before assembly.`);
        return;
      }
      const cost = (item.purchaseRate || 0) * slot.qty;
      totalComponentsCost += cost;
      selectedComponents.push({
        category: item.category,
        itemCode: item.itemCode,
        itemName: item.itemName,
        cost: item.purchaseRate,
        qty: slot.qty
      });
    }
  }

  if (selectedComponents.length < 4) {
    alert("Please select at least CPU, Motherboard, RAM, and Storage to assemble a PC.");
    return;
  }

  const buildId = 'BUILD-' + Date.now().toString().slice(-6);
  const totalCost = totalComponentsCost + laborCost;
  const marginAmount = sellingPrice - totalCost;
  const marginPercent = sellingPrice > 0 ? parseFloat(((marginAmount / sellingPrice) * 100).toFixed(2)) : 0;

  // 1. Deduct component stocks and record in Stock Ledger
  selectedComponents.forEach(comp => {
    recordStockMovement({
      itemCode: comp.itemCode,
      itemName: comp.itemName,
      category: comp.category,
      type: 'PC_BUILD_CONSUME',
      refNo: buildId,
      inQty: 0,
      outQty: comp.qty,
      unitCost: comp.cost,
      remarks: `Consumed in Assembling PC: ${buildName} (${serialNo}) for ${customerName}`
    });
  });

  // 2. Add Finished PC to Stock (Category: 'Finished PC')
  const pcItemCode = `PC-${serialNo.replace(/[^a-zA-Z0-9]/g, '-')}`;
  let pcItem = state.inventory.find(i => i.itemCode === pcItemCode);
  if (!pcItem) {
    pcItem = {
      itemCode: pcItemCode,
      itemName: `${buildName} [${serialNo}]`,
      category: 'Finished PC',
      brand: 'BIOS Custom',
      model: serialNo,
      purchaseQty: 0,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 0,
      pcProducedQty: 0,
      openingStock: 0,
      availableStock: 0,
      purchaseRate: totalCost,
      sellingRate: sellingPrice,
      minStock: 1,
      serials: [serialNo]
    };
    state.inventory.push(pcItem);
  }

  recordStockMovement({
    itemCode: pcItemCode,
    itemName: pcItem.itemName,
    category: 'Finished PC',
    type: 'PC_BUILD_PRODUCE',
    refNo: buildId,
    inQty: 1,
    outQty: 0,
    unitCost: totalCost,
    remarks: `Custom Assembled PC for ${customerName} ready in stock`
  });

  // 3. Save PC Build record with customer details
  const newBuild = {
    id: buildId,
    name: buildName,
    serialNo,
    date: buildDate,
    customerName,
    customerPhone,
    customerAddress,
    customerGst,
    componentsCost: totalComponentsCost,
    laborCost,
    totalCost,
    sellingPrice,
    marginAmount,
    marginPercent,
    components: selectedComponents
  };

  state.pcBuilds.unshift(newBuild);
  saveToStorage(STORAGE_KEYS.PC_BUILDS, state.pcBuilds);
  addActivity('pcbuild', `Assembled Finished PC <strong>${buildName}</strong> for ${customerName} (Cost: ${formatCurrency(totalCost)}, Stock Added)`);

  alert(`✅ PC Assembled Successfully!\n\nCustomer: ${customerName} (${customerPhone})\nModel: ${buildName}\nSerial No: ${serialNo}\nTotal Build Cost: ${formatCurrency(totalCost)}\nTarget Selling Price: ${formatCurrency(sellingPrice)}\n\nComponent stocks deducted and Finished PC added to Inventory Stock.`);

  // Reset Form & Switch to History Tab
  document.getElementById('pc-builder-form').reset();
  renderPCBuilderDropdowns();
  renderPCBuildHistoryTable();
  renderInventoryTable();
  renderDashboard();
  populateCustomerSuggestions();

  // Switch tab to history
  const historyTabBtn = document.querySelector('[data-pc-tab="history"]');
  if (historyTabBtn) historyTabBtn.click();
}

function renderPCBuildHistoryTable() {
  const tableBody = document.getElementById('pc-history-table-body');
  if (!tableBody) return;

  if (state.pcBuilds.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="no-data-msg">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
          <p>No PC builds recorded yet. Configure and assemble your first custom PC!</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = state.pcBuilds.map(build => {
    const compSummary = build.components ? build.components.map(c => `${c.category}: ${c.itemName}`).join(', ') : '--';
    return `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--primary);">
          ${build.id}
          <br><small style="color: var(--text-muted); font-family: monospace;">Tag: ${build.serialNo}</small>
        </td>
        <td>${formatDate(build.date)}</td>
        <td>
          <span style="font-weight: 600;">${build.customerName || 'Shop Build'}</span>
          ${build.customerPhone ? `<br><small style="color: var(--text-muted);">Mob: ${build.customerPhone}</small>` : ''}
          ${build.customerGst ? `<br><small style="color: var(--primary); font-family: monospace;">GST: ${build.customerGst}</small>` : ''}
        </td>
        <td style="font-weight: 700;">${build.name}</td>
        <td style="font-size: 0.8rem; color: var(--text-muted); max-width: 300px;">${compSummary}</td>
        <td style="font-weight: 700;">${formatCurrency(build.totalCost)}</td>
        <td style="font-weight: 700; color: var(--primary);">${formatCurrency(build.sellingPrice)}</td>
        <td>
          <span style="font-weight: 700; color: var(--success-dark);">${formatCurrency(build.marginAmount)}</span>
          <br><small style="color: var(--text-muted);">(${build.marginPercent}%)</small>
        </td>
        <td class="actions-cell">
          <button class="btn btn-primary btn-sm" onclick="viewBuildComponents('${build.id}')">⎙ Print / Spec Sheet</button>
        </td>
      </tr>
    `;
  }).join('');
}

window.viewBuildComponents = function(buildId) {
  const build = state.pcBuilds.find(b => b.id === buildId);
  if (!build) return;

  document.getElementById('pc-prev-build-id').textContent = build.id;
  document.getElementById('pc-prev-date').textContent = formatDate(build.date);
  document.getElementById('pc-prev-client-name').textContent = build.customerName || 'Shop Display Build';
  document.getElementById('pc-prev-client-phone').textContent = build.customerPhone ? `Phone: +91 ${build.customerPhone}` : 'Phone: --';
  
  const addrEl = document.getElementById('pc-prev-client-address');
  if (addrEl) {
    if (build.customerAddress) {
      addrEl.textContent = `Address: ${build.customerAddress}`;
      addrEl.style.display = 'block';
    } else {
      addrEl.style.display = 'none';
    }
  }

  const gstEl = document.getElementById('pc-prev-client-gst');
  if (gstEl) {
    if (build.customerGst) {
      gstEl.textContent = `GSTIN: ${build.customerGst}`;
      gstEl.style.display = 'block';
    } else {
      gstEl.style.display = 'none';
    }
  }

  document.getElementById('pc-prev-model-name').textContent = build.name;
  document.getElementById('pc-prev-serial').textContent = `Serial / Tag: ${build.serialNo}`;

  const tbody = document.getElementById('pc-prev-components-tbody');
  if (tbody) {
    if (build.components && build.components.length > 0) {
      tbody.innerHTML = build.components.map(comp => `
        <tr>
          <td><span class="badge badge-category">${comp.category}</span></td>
          <td style="font-weight: 600;">${comp.itemName} <small style="color: var(--text-muted); font-family: monospace;">(${comp.itemCode})</small></td>
          <td style="text-align: center; font-weight: 700;">${comp.qty || 1}</td>
          <td style="text-align: right;">${formatCurrency(comp.cost)}</td>
          <td style="text-align: right; font-weight: 700;">${formatCurrency((comp.cost || 0) * (comp.qty || 1))}</td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = `<tr><td colspan="5" class="no-data-msg">No component details stored.</td></tr>`;
    }
  }

  document.getElementById('pc-prev-comp-total').textContent = formatCurrency(build.componentsCost);
  document.getElementById('pc-prev-labor').textContent = formatCurrency(build.laborCost);
  document.getElementById('pc-prev-final-price').textContent = formatCurrency(build.sellingPrice);

  document.getElementById('pc-view-modal').classList.add('active');
};

// ==========================================================================
// RETURNS & SUPPLIERS CONTROLLER
// ==========================================================================
function handleSalesReturnSubmit(e) {
  e.preventDefault();
  const invNo = document.getElementById('sales-return-inv').value;
  const date = document.getElementById('sales-return-date').value;
  const itemName = document.getElementById('sales-return-item-name').value;
  const qty = parseFloat(document.getElementById('sales-return-qty').value || 1);
  const refundAmount = parseFloat(document.getElementById('sales-return-refund').value || 0);
  const reason = document.getElementById('sales-return-reason').value.trim();

  const invoice = state.billings.find(b => b.invoiceNo === invNo);
  const itemCode = invoice ? invoice.itemCode : ('ITEM-' + Date.now());

  // 1. Sales Return automatically increases stock
  recordStockMovement({
    itemCode,
    itemName,
    type: 'SALES_RETURN',
    refNo: `SR-${Date.now().toString().slice(-4)}`,
    inQty: qty,
    outQty: 0,
    unitCost: invoice ? (invoice.costPrice || 0) : 0,
    remarks: `Sales Return on Inv ${invNo} (${reason})`
  });

  const returnRecord = {
    id: 'SR-' + Date.now(),
    type: 'SALES_RETURN',
    invNo,
    date,
    customerName: invoice ? invoice.customerName : 'Customer',
    itemCode,
    itemName,
    qty,
    amount: refundAmount,
    reason
  };

  state.returns.unshift(returnRecord);
  saveToStorage(STORAGE_KEYS.RETURNS, state.returns);
  addActivity('return', `Processed Sales Return for <strong>${itemName}</strong> (Qty: ${qty}, Stock Restocked)`);

  document.getElementById('sales-return-modal').classList.remove('active');
  renderReturnsTables();
  renderInventoryTable();
  renderDashboard();
  renderReports();
}

function handlePurchaseReturnSubmit(e) {
  e.preventDefault();
  const invNo = document.getElementById('purchase-return-inv').value;
  const date = document.getElementById('purchase-return-date').value;
  const itemDesc = document.getElementById('purchase-return-item-desc').value;
  const qty = parseFloat(document.getElementById('purchase-return-qty').value || 1);
  const debitAmount = parseFloat(document.getElementById('purchase-return-amount').value || 0);
  const reason = document.getElementById('purchase-return-reason').value.trim();

  const purchase = state.purchases.find(p => p.invoiceNo === invNo);
  const itemCode = purchase ? purchase.itemCode : ('ITEM-' + Date.now());

  // 1. Purchase Return automatically decreases stock
  recordStockMovement({
    itemCode,
    itemName: itemDesc,
    type: 'PURCHASE_RETURN',
    refNo: `PR-${Date.now().toString().slice(-4)}`,
    inQty: 0,
    outQty: qty,
    unitCost: purchase ? purchase.rate : 0,
    remarks: `Purchase Return on Bill ${invNo} to ${purchase ? purchase.supplier : 'Supplier'} (${reason})`
  });

  // Adjust supplier dues
  if (purchase) {
    const sup = state.suppliers.find(s => s.name.toLowerCase() === purchase.supplier.toLowerCase());
    if (sup) {
      sup.balanceDue = Math.max(0, parseFloat(sup.balanceDue || 0) - debitAmount);
      saveToStorage(STORAGE_KEYS.SUPPLIERS, state.suppliers);
    }
  }

  const returnRecord = {
    id: 'PR-' + Date.now(),
    type: 'PURCHASE_RETURN',
    invNo,
    date,
    supplierName: purchase ? purchase.supplier : 'Supplier',
    itemCode,
    itemName: itemDesc,
    qty,
    amount: debitAmount,
    reason
  };

  state.returns.unshift(returnRecord);
  saveToStorage(STORAGE_KEYS.RETURNS, state.returns);
  addActivity('return', `Processed Purchase Return for <strong>${itemDesc}</strong> (Qty: ${qty}, Stock Deducted)`);

  document.getElementById('purchase-return-modal').classList.remove('active');
  renderReturnsTables();
  renderInventoryTable();
  renderDashboard();
  renderReports();
}

function renderReturnsTables() {
  // 1. Sales Returns Table
  const salesTableBody = document.getElementById('sales-returns-table-body');
  if (salesTableBody) {
    const salesReturns = state.returns.filter(r => r.type === 'SALES_RETURN');
    if (salesReturns.length === 0) {
      salesTableBody.innerHTML = `<tr><td colspan="9" class="no-data-msg">No sales returns recorded.</td></tr>`;
    } else {
      salesTableBody.innerHTML = salesReturns.map(r => `
        <tr>
          <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${r.id}</td>
          <td>${formatDate(r.date)}</td>
          <td style="font-family: monospace; font-weight: 600;">${r.invNo}</td>
          <td style="font-weight: 600;">${r.customerName}</td>
          <td>${r.itemName}</td>
          <td style="text-align: center; font-weight: 700; color: var(--success-dark);">+${r.qty}</td>
          <td style="font-weight: 700;">${formatCurrency(r.amount)}</td>
          <td>${r.reason}</td>
          <td><span class="badge badge-booking">Restocked</span></td>
        </tr>
      `).join('');
    }
  }

  // 2. Purchase Returns Table
  const purchTableBody = document.getElementById('purchase-returns-table-body');
  if (purchTableBody) {
    const purchaseReturns = state.returns.filter(r => r.type === 'PURCHASE_RETURN');
    if (purchaseReturns.length === 0) {
      purchTableBody.innerHTML = `<tr><td colspan="9" class="no-data-msg">No purchase returns recorded.</td></tr>`;
    } else {
      purchTableBody.innerHTML = purchaseReturns.map(r => `
        <tr>
          <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${r.id}</td>
          <td>${formatDate(r.date)}</td>
          <td style="font-family: monospace; font-weight: 600;">${r.invNo}</td>
          <td style="font-weight: 600;">${r.supplierName}</td>
          <td>${r.itemName}</td>
          <td style="text-align: center; font-weight: 700; color: var(--danger-dark);">-${r.qty}</td>
          <td style="font-weight: 700;">${formatCurrency(r.amount)}</td>
          <td>${r.reason}</td>
          <td><span class="badge badge-cancelled">Debited</span></td>
        </tr>
      `).join('');
    }
  }

  // 3. Suppliers Directory Table
  const supTableBody = document.getElementById('suppliers-table-body');
  if (supTableBody) {
    if (state.suppliers.length === 0) {
      supTableBody.innerHTML = `<tr><td colspan="7" class="no-data-msg">No suppliers in directory.</td></tr>`;
    } else {
      supTableBody.innerHTML = state.suppliers.map(s => `
        <tr>
          <td style="font-weight: 700;">${s.name}</td>
          <td>${s.phone || '--'}</td>
          <td>${s.email || '--'}</td>
          <td style="font-family: monospace;">${s.gstin || '--'}</td>
          <td style="font-weight: 700;">${formatCurrency(s.totalPurchases)}</td>
          <td style="font-weight: 700; color: ${s.balanceDue > 0 ? 'var(--danger-dark)' : 'var(--success-dark)'};">
            ${formatCurrency(s.balanceDue)}
          </td>
          <td class="actions-cell">
            <button class="btn btn-outline btn-sm" onclick="filterReportsBySupplier('${s.name}')">Purchase History</button>
          </td>
        </tr>
      `).join('');
    }
  }

  // 4. Stock Ledger Table
  renderStockLedgerTable();
}

function renderStockLedgerTable() {
  const tableBody = document.getElementById('stock-ledger-table-body');
  if (!tableBody) return;

  const searchVal = document.getElementById('ledger-search') ? document.getElementById('ledger-search').value.toLowerCase().trim() : '';
  const typeVal = document.getElementById('ledger-filter-type') ? document.getElementById('ledger-filter-type').value : 'All';

  const filtered = state.stockLedger.filter(entry => {
    const matchesSearch = entry.itemCode.toLowerCase().includes(searchVal) ||
      entry.itemName.toLowerCase().includes(searchVal) ||
      entry.refNo.toLowerCase().includes(searchVal) ||
      entry.remarks.toLowerCase().includes(searchVal);
    const matchesType = typeVal === 'All' || entry.type === typeVal;
    return matchesSearch && matchesType;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" class="no-data-msg">No stock movements found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(entry => {
    let typeBadge = 'badge-category';
    if (entry.type === 'PURCHASE') typeBadge = 'badge-paid';
    if (entry.type === 'SALE') typeBadge = 'badge-new';
    if (entry.type === 'SALES_RETURN') typeBadge = 'badge-booking';
    if (entry.type === 'PURCHASE_RETURN') typeBadge = 'badge-cancelled';
    if (entry.type.startsWith('PC_BUILD')) typeBadge = 'badge-pc';

    return `
      <tr>
        <td style="font-size: 0.8rem; white-space: nowrap;">${formatDateTime(entry.timestamp)}</td>
        <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${entry.itemCode}</td>
        <td style="font-weight: 600;">${entry.itemName}</td>
        <td><span class="badge ${typeBadge}">${entry.type}</span></td>
        <td style="font-family: monospace;">${entry.refNo}</td>
        <td style="text-align: right; font-weight: 700; color: var(--success-dark);">${entry.inQty > 0 ? `+${entry.inQty}` : '-'}</td>
        <td style="text-align: right; font-weight: 700; color: var(--danger-dark);">${entry.outQty > 0 ? `-${entry.outQty}` : '-'}</td>
        <td style="text-align: right; font-size: 1rem; font-weight: 800;">${entry.balanceStock}</td>
        <td>${formatCurrency(entry.unitCost)}</td>
        <td style="font-size: 0.85rem; color: var(--text-muted);">${entry.remarks}</td>
      </tr>
    `;
  }).join('');
}

window.filterReportsBySupplier = function(supplierName) {
  const repLink = document.querySelector('[data-target="reports"]');
  if (repLink) repLink.click();
  const modSelect = document.getElementById('report-filter-module');
  if (modSelect) {
    modSelect.value = 'SupplierPurchase';
    const searchInput = document.getElementById('report-search-input');
    if (searchInput) searchInput.value = supplierName;
    renderReports();
  }
};

// ==========================================================================
// REPORTS CONTROLLER (ALL 13 REPORTS WITH SEARCH, EXCEL & PRINT)
// ==========================================================================
function renderReports() {
  const moduleVal = document.getElementById('report-filter-module').value;
  const searchVal = document.getElementById('report-search-input') ? document.getElementById('report-search-input').value.toLowerCase().trim() : '';
  const fromDateVal = document.getElementById('report-from-date') ? document.getElementById('report-from-date').value : '';
  const toDateVal = document.getElementById('report-to-date') ? document.getElementById('report-to-date').value : '';

  const tableHead = document.getElementById('report-table-head');
  const tableBody = document.getElementById('report-table-body');
  if (!tableHead || !tableBody) return;

  const isWithinDateRange = (itemDateStr) => {
    if (!itemDateStr) return true;
    const itemDate = new Date(itemDateStr).setHours(0, 0, 0, 0);
    if (fromDateVal && itemDate < new Date(fromDateVal).setHours(0, 0, 0, 0)) return false;
    if (toDateVal && itemDate > new Date(toDateVal).setHours(0, 0, 0, 0)) return false;
    return true;
  };

  let tableHeadersHtml = '';
  let tableRowsHtml = '';

  // 1. ENQUIRIES REPORT (EXISTING)
  if (moduleVal === 'Enquiries') {
    tableHeadersHtml = `
      <tr>
        <th>Customer Name</th>
        <th>Mobile Number</th>
        <th>Enquiry Date</th>
        <th>Source</th>
        <th>Status</th>
      </tr>
    `;
    const data = state.enquiries.filter(e => {
      const matchSearch = e.name.toLowerCase().includes(searchVal) || e.mobile.includes(searchVal);
      return matchSearch && isWithinDateRange(e.date);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="5" class="no-data-msg">No enquiries found matching filters.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-weight:600;">${item.name}</td>
          <td>${item.mobile}</td>
          <td>${formatDate(item.date)}</td>
          <td>${item.source}</td>
          <td>${item.status}</td>
        </tr>
      `).join('');
    }

  // 2. BOOKINGS REPORT (EXISTING)
  } else if (moduleVal === 'Bookings') {
    tableHeadersHtml = `
      <tr>
        <th>Customer Name</th>
        <th>Mobile Number</th>
        <th>Booking Date</th>
        <th>Booking Amount</th>
        <th>Payment Method</th>
      </tr>
    `;
    const data = state.bookings.filter(b => {
      const matchSearch = b.name.toLowerCase().includes(searchVal) || (b.mobile && b.mobile.includes(searchVal));
      return matchSearch && isWithinDateRange(b.date);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="5" class="no-data-msg">No bookings found matching filters.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-weight:600;">${item.name}</td>
          <td>${item.mobile || '--'}</td>
          <td>${formatDate(item.date)}</td>
          <td style="font-weight: 700; color: var(--primary);">${formatCurrency(item.amount)}</td>
          <td>${item.payment}</td>
        </tr>
      `).join('');
    }

  // 3. BILLINGS / SALES REPORT (EXISTING)
  } else if (moduleVal === 'Billings') {
    tableHeadersHtml = `
      <tr>
        <th>Invoice Number</th>
        <th>Invoice Date</th>
        <th>Customer Name</th>
        <th>Product Description</th>
        <th>Base Amount</th>
        <th>GST Amount</th>
        <th>Grand Total</th>
      </tr>
    `;
    const data = state.billings.filter(b => {
      const matchSearch = b.invoiceNo.toLowerCase().includes(searchVal) ||
        b.customerName.toLowerCase().includes(searchVal) ||
        b.productName.toLowerCase().includes(searchVal);
      return matchSearch && isWithinDateRange(b.date);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="7" class="no-data-msg">No billings found matching filters.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${item.invoiceNo}</td>
          <td>${formatDate(item.date)}</td>
          <td style="font-weight:600;">${item.customerName}</td>
          <td>${item.productName}</td>
          <td>${formatCurrency(item.baseAmount)}</td>
          <td>${formatCurrency(item.gstAmount)}</td>
          <td style="font-weight: 700; color: var(--success-dark);">${formatCurrency(item.totalAmount)}</td>
        </tr>
      `).join('');
    }

  // 4. PURCHASE REPORT (NEW)
  } else if (moduleVal === 'Purchases') {
    tableHeadersHtml = `
      <tr>
        <th>Purchase Inv #</th>
        <th>Date</th>
        <th>Supplier</th>
        <th>Item Code & Name</th>
        <th>Brand</th>
        <th style="text-align: center;">Qty</th>
        <th>Rate (₹)</th>
        <th>GST</th>
        <th>Total Amount</th>
        <th>Paid</th>
        <th>Balance</th>
        <th>Status</th>
      </tr>
    `;
    const data = state.purchases.filter(p => {
      const matchSearch = p.invoiceNo.toLowerCase().includes(searchVal) ||
        p.supplier.toLowerCase().includes(searchVal) ||
        p.itemCode.toLowerCase().includes(searchVal) ||
        p.itemName.toLowerCase().includes(searchVal);
      return matchSearch && isWithinDateRange(p.date);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="12" class="no-data-msg">No purchases found.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${item.invoiceNo}</td>
          <td>${formatDate(item.date)}</td>
          <td style="font-weight:600;">${item.supplier}</td>
          <td>${item.itemName} (${item.itemCode})</td>
          <td>${item.brand || '--'}</td>
          <td style="text-align: center; font-weight:700;">${item.qty}</td>
          <td>${formatCurrency(item.rate)}</td>
          <td>${item.gstRate || 18}%</td>
          <td style="font-weight: 700;">${formatCurrency(item.totalAmount)}</td>
          <td style="color: var(--success-dark);">${formatCurrency(item.paidAmount)}</td>
          <td style="color: var(--danger-dark); font-weight:700;">${formatCurrency(item.balanceAmount)}</td>
          <td>${item.status}</td>
        </tr>
      `).join('');
    }

  // 5. STOCK AVAILABILITY REPORT (NEW)
  } else if (moduleVal === 'StockAvailability') {
    tableHeadersHtml = `
      <tr>
        <th>Item Code</th>
        <th>Item Name</th>
        <th>Category</th>
        <th>Brand</th>
        <th style="text-align: center;">Purchase Qty</th>
        <th style="text-align: center;">Sales Qty</th>
        <th style="text-align: center;">Available Stock</th>
        <th>Purchase Rate</th>
        <th>Selling Rate</th>
        <th>Stock Valuation</th>
        <th>Min Stock</th>
        <th>Status</th>
      </tr>
    `;
    const data = state.inventory.filter(i => {
      const matchSearch = i.itemCode.toLowerCase().includes(searchVal) ||
        i.itemName.toLowerCase().includes(searchVal) ||
        (i.brand && i.brand.toLowerCase().includes(searchVal));
      return matchSearch;
    });

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="12" class="no-data-msg">No inventory items found.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => {
        const avail = calculateAvailableStock(item);
        const st = getStockStatus(avail, item.minStock);
        const val = Math.max(0, avail) * (item.purchaseRate || 0);
        return `
          <tr>
            <td style="font-family: monospace; font-weight:700;">${item.itemCode}</td>
            <td style="font-weight:600;">${item.itemName}</td>
            <td>${item.category}</td>
            <td>${item.brand || '--'}</td>
            <td style="text-align: center;">${item.purchaseQty || 0}</td>
            <td style="text-align: center;">${item.salesQty || 0}</td>
            <td style="text-align: center; font-weight:800; font-size:1rem;">${avail}</td>
            <td>${formatCurrency(item.purchaseRate)}</td>
            <td>${formatCurrency(item.sellingRate)}</td>
            <td style="font-weight:700; color: var(--success-dark);">${formatCurrency(val)}</td>
            <td style="text-align: center;">${item.minStock || 2}</td>
            <td>${st}</td>
          </tr>
        `;
      }).join('');
    }

  // 6. STOCK MOVEMENT / LEDGER REPORT (NEW)
  } else if (moduleVal === 'StockMovement') {
    tableHeadersHtml = `
      <tr>
        <th>Date & Time</th>
        <th>Item Code</th>
        <th>Item Name</th>
        <th>Movement Type</th>
        <th>Ref Doc #</th>
        <th style="text-align: right;">In Qty (+)</th>
        <th style="text-align: right;">Out Qty (-)</th>
        <th style="text-align: right;">Balance Stock</th>
        <th>Unit Cost</th>
        <th>Remarks</th>
      </tr>
    `;
    const data = state.stockLedger.filter(l => {
      const matchSearch = l.itemCode.toLowerCase().includes(searchVal) ||
        l.itemName.toLowerCase().includes(searchVal) ||
        l.refNo.toLowerCase().includes(searchVal) ||
        l.type.toLowerCase().includes(searchVal);
      return matchSearch && isWithinDateRange(l.timestamp);
    });

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="10" class="no-data-msg">No stock movements recorded.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td>${formatDateTime(item.timestamp)}</td>
          <td style="font-family: monospace; font-weight:700;">${item.itemCode}</td>
          <td>${item.itemName}</td>
          <td><strong>${item.type}</strong></td>
          <td style="font-family: monospace;">${item.refNo}</td>
          <td style="text-align: right; color: var(--success-dark); font-weight:700;">${item.inQty > 0 ? `+${item.inQty}` : '-'}</td>
          <td style="text-align: right; color: var(--danger-dark); font-weight:700;">${item.outQty > 0 ? `-${item.outQty}` : '-'}</td>
          <td style="text-align: right; font-weight:800;">${item.balanceStock}</td>
          <td>${formatCurrency(item.unitCost)}</td>
          <td>${item.remarks}</td>
        </tr>
      `).join('');
    }

  // 7. LOW STOCK REPORT (NEW)
  } else if (moduleVal === 'LowStock') {
    tableHeadersHtml = `
      <tr>
        <th>Item Code</th>
        <th>Item Name</th>
        <th>Category</th>
        <th>Brand</th>
        <th style="text-align: center;">Available Stock</th>
        <th style="text-align: center;">Min Threshold</th>
        <th style="text-align: center;">Deficit to Restock</th>
        <th>Unit Purchase Rate</th>
        <th>Estimated Restock Cost</th>
        <th>Status</th>
      </tr>
    `;
    const data = state.inventory.filter(i => {
      const avail = calculateAvailableStock(i);
      const min = i.minStock || 2;
      return (avail > 0 && avail <= min);
    });

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="10" class="no-data-msg">✅ All in-stock items are currently above minimum threshold!</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => {
        const avail = calculateAvailableStock(item);
        const min = item.minStock || 2;
        const deficit = Math.max(0, min * 2 - avail);
        const restockCost = deficit * (item.purchaseRate || 0);
        return `
          <tr>
            <td style="font-family: monospace; font-weight:700;">${item.itemCode}</td>
            <td style="font-weight:600;">${item.itemName}</td>
            <td>${item.category}</td>
            <td>${item.brand || '--'}</td>
            <td style="text-align: center; font-weight:800; color: var(--warning-dark);">${avail}</td>
            <td style="text-align: center;">${min}</td>
            <td style="text-align: center; font-weight:700; color: var(--danger-dark);">${deficit}</td>
            <td>${formatCurrency(item.purchaseRate)}</td>
            <td style="font-weight:700;">${formatCurrency(restockCost)}</td>
            <td><span class="badge badge-low-stock">Low Stock</span></td>
          </tr>
        `;
      }).join('');
    }

  // 8. OUT OF STOCK REPORT (NEW)
  } else if (moduleVal === 'OutOfStock') {
    tableHeadersHtml = `
      <tr>
        <th>Item Code</th>
        <th>Item Name</th>
        <th>Category</th>
        <th>Brand</th>
        <th style="text-align: center;">Available Stock</th>
        <th>Purchase Rate</th>
        <th>Selling Rate</th>
        <th>Status</th>
      </tr>
    `;
    const data = state.inventory.filter(i => calculateAvailableStock(i) <= 0);

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="8" class="no-data-msg">✅ Great news! No items are currently out of stock.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${item.itemCode}</td>
          <td style="font-weight:600;">${item.itemName}</td>
          <td>${item.category}</td>
          <td>${item.brand || '--'}</td>
          <td style="text-align: center; font-weight:800; color: var(--danger);">0</td>
          <td>${formatCurrency(item.purchaseRate)}</td>
          <td>${formatCurrency(item.sellingRate)}</td>
          <td><span class="badge badge-out-of-stock">Out of Stock</span></td>
        </tr>
      `).join('');
    }

  // 9. SUPPLIER PURCHASE REPORT (NEW)
  } else if (moduleVal === 'SupplierPurchase') {
    tableHeadersHtml = `
      <tr>
        <th>Supplier Name</th>
        <th>Contact Phone</th>
        <th>GSTIN</th>
        <th>Total Invoices</th>
        <th>Total Purchases (₹)</th>
        <th>Total Paid (₹)</th>
        <th>Total Balance Due (₹)</th>
      </tr>
    `;
    const data = state.suppliers.filter(s => s.name.toLowerCase().includes(searchVal));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="7" class="no-data-msg">No suppliers found.</td></tr>`;
    } else {
      tableRowsHtml = data.map(sup => {
        const bills = state.purchases.filter(p => p.supplier.toLowerCase() === sup.name.toLowerCase() && isWithinDateRange(p.date));
        const totalPurch = bills.reduce((sum, b) => sum + (parseFloat(b.totalAmount) || 0), 0);
        const totalPaid = bills.reduce((sum, b) => sum + (parseFloat(b.paidAmount) || 0), 0);
        const balance = bills.reduce((sum, b) => sum + (parseFloat(b.balanceAmount) || 0), 0);

        return `
          <tr>
            <td style="font-weight:700;">${sup.name}</td>
            <td>${sup.phone || '--'}</td>
            <td style="font-family: monospace;">${sup.gstin || '--'}</td>
            <td style="text-align: center; font-weight:700;">${bills.length}</td>
            <td style="font-weight:700;">${formatCurrency(totalPurch)}</td>
            <td style="color: var(--success-dark); font-weight:600;">${formatCurrency(totalPaid)}</td>
            <td style="color: ${balance > 0 ? 'var(--danger-dark)' : 'var(--success-dark)'}; font-weight:700;">${formatCurrency(balance)}</td>
          </tr>
        `;
      }).join('');
    }

  // 10. PURCHASE RETURN REPORT (NEW)
  } else if (moduleVal === 'PurchaseReturns') {
    tableHeadersHtml = `
      <tr>
        <th>Return ID</th>
        <th>Date</th>
        <th>Purchase Inv #</th>
        <th>Supplier Name</th>
        <th>Item Description</th>
        <th style="text-align: center;">Returned Qty</th>
        <th>Debit Amount</th>
        <th>Reason</th>
      </tr>
    `;
    const data = state.returns.filter(r => r.type === 'PURCHASE_RETURN' && isWithinDateRange(r.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="8" class="no-data-msg">No purchase returns recorded.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${item.id}</td>
          <td>${formatDate(item.date)}</td>
          <td style="font-family: monospace;">${item.invNo}</td>
          <td style="font-weight:600;">${item.supplierName}</td>
          <td>${item.itemName}</td>
          <td style="text-align: center; font-weight:700; color: var(--danger-dark);">-${item.qty}</td>
          <td style="font-weight:700;">${formatCurrency(item.amount)}</td>
          <td>${item.reason}</td>
        </tr>
      `).join('');
    }

  // 11. SALES / INVOICE STOCK REPORT (NEW)
  } else if (moduleVal === 'SalesStock') {
    tableHeadersHtml = `
      <tr>
        <th>Invoice Number</th>
        <th>Date</th>
        <th>Customer Name</th>
        <th>Item Code & Description</th>
        <th style="text-align: center;">Sold Qty</th>
        <th>Unit Selling Rate</th>
        <th>Base Amount</th>
        <th>Total Invoice Amount</th>
      </tr>
    `;
    const data = state.billings.filter(b => {
      const matchSearch = b.invoiceNo.toLowerCase().includes(searchVal) ||
        b.customerName.toLowerCase().includes(searchVal) ||
        b.productName.toLowerCase().includes(searchVal);
      return matchSearch && isWithinDateRange(b.date);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="8" class="no-data-msg">No sales stock movements found.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${item.invoiceNo}</td>
          <td>${formatDate(item.date)}</td>
          <td style="font-weight:600;">${item.customerName}</td>
          <td>${item.productName} <small style="color: var(--text-muted); font-family: monospace;">(${item.itemCode || '--'})</small></td>
          <td style="text-align: center; font-weight:700;">${item.qty || 1}</td>
          <td>${formatCurrency(item.unitRate || (item.baseAmount / (item.qty || 1)))}</td>
          <td>${formatCurrency(item.baseAmount)}</td>
          <td style="font-weight:700; color: var(--success-dark);">${formatCurrency(item.totalAmount)}</td>
        </tr>
      `).join('');
    }

  // 12. PC BUILD REPORT (NEW)
  } else if (moduleVal === 'PCBuilds') {
    tableHeadersHtml = `
      <tr>
        <th>Build ID</th>
        <th>Build Date</th>
        <th>PC Model Name</th>
        <th>Serial / Tag No</th>
        <th>Components Cost</th>
        <th>Labor Charge</th>
        <th>Total Build Cost</th>
        <th>Target Selling Price</th>
        <th>Gross Profit</th>
        <th>Margin %</th>
      </tr>
    `;
    const data = state.pcBuilds.filter(b => {
      const matchSearch = b.id.toLowerCase().includes(searchVal) ||
        b.name.toLowerCase().includes(searchVal) ||
        b.serialNo.toLowerCase().includes(searchVal);
      return matchSearch && isWithinDateRange(b.date);
    });

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="10" class="no-data-msg">No PC builds assembled in this period.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${item.id}</td>
          <td>${formatDate(item.date)}</td>
          <td style="font-weight:700;">${item.name}</td>
          <td style="font-family: monospace;">${item.serialNo}</td>
          <td>${formatCurrency(item.componentsCost)}</td>
          <td>${formatCurrency(item.laborCost)}</td>
          <td style="font-weight:700;">${formatCurrency(item.totalCost)}</td>
          <td style="font-weight:700; color: var(--primary);">${formatCurrency(item.sellingPrice)}</td>
          <td style="font-weight:700; color: var(--success-dark);">${formatCurrency(item.marginAmount)}</td>
          <td style="font-weight:600;">${item.marginPercent}%</td>
        </tr>
      `).join('');
    }

  // 13. PROFIT / MARGIN REPORT (NEW)
  } else if (moduleVal === 'ProfitMargin') {
    tableHeadersHtml = `
      <tr>
        <th>Invoice Number</th>
        <th>Date</th>
        <th>Customer Name</th>
        <th>Product Description</th>
        <th style="text-align: center;">Qty</th>
        <th>Estimated Cost Price (COGS)</th>
        <th>Selling Revenue (Base)</th>
        <th>Gross Profit</th>
        <th>Profit Margin %</th>
      </tr>
    `;
    const data = state.billings.filter(b => isWithinDateRange(b.date)).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="9" class="no-data-msg">No sales data for profit analysis.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => {
        const qty = item.qty || 1;
        const costPrice = parseFloat(item.costPrice || 0) * qty;
        const sellingPrice = parseFloat(item.baseAmount || 0);
        const profit = sellingPrice - costPrice;
        const margin = sellingPrice > 0 ? ((profit / sellingPrice) * 100).toFixed(2) : 0;

        return `
          <tr>
            <td style="font-family: monospace; font-weight:700;">${item.invoiceNo}</td>
            <td>${formatDate(item.date)}</td>
            <td style="font-weight:600;">${item.customerName}</td>
            <td>${item.productName}</td>
            <td style="text-align: center;">${qty}</td>
            <td>${formatCurrency(costPrice)}</td>
            <td style="font-weight:600;">${formatCurrency(sellingPrice)}</td>
            <td style="font-weight:700; color: ${profit >= 0 ? 'var(--success-dark)' : 'var(--danger-dark)'};">
              ${formatCurrency(profit)}
            </td>
            <td style="font-weight:700; color: ${profit >= 0 ? 'var(--success-dark)' : 'var(--danger-dark)'};">
              ${margin}%
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  tableHead.innerHTML = tableHeadersHtml;
  tableBody.innerHTML = tableRowsHtml;
}

// Print Current Report
function handleReportPrint() {
  const moduleVal = document.getElementById('report-filter-module').value;
  const printHeader = document.getElementById('report-print-header');
  const printTitle = document.getElementById('report-print-title');
  const printSub = document.getElementById('report-print-subtitle');

  if (printHeader && printTitle && printSub) {
    printHeader.style.display = 'block';
    printTitle.textContent = `BIOS - ${moduleVal.replace(/([A-Z])/g, ' $1').trim()} Report`;
    printSub.textContent = `Generated on ${new Date().toLocaleString()} | BIOS PC & Billing Solutions`;
  }

  document.body.classList.add('printing-report');
  window.print();
  window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing-report');
    if (printHeader) printHeader.style.display = 'none';
  }, { once: true });
}

// ==========================================================================
// EXCEL / CSV REPORT EXPORT (UTF-8 WITH BOM FOR 100% EXCEL COMPATIBILITY)
// ==========================================================================
function handleReportExport() {
  const moduleVal = document.getElementById('report-filter-module').value;
  const fromDateVal = document.getElementById('report-from-date') ? document.getElementById('report-from-date').value : '';
  const toDateVal = document.getElementById('report-to-date') ? document.getElementById('report-to-date').value : '';
  const searchVal = document.getElementById('report-search-input') ? document.getElementById('report-search-input').value.toLowerCase().trim() : '';

  let csvContent = "";
  let fileName = `BIOS_${moduleVal}_Report`;
  if (fromDateVal) fileName += `_from_${fromDateVal}`;
  if (toDateVal) fileName += `_to_${toDateVal}`;
  fileName += ".csv";

  const isWithinDateRange = (itemDateStr) => {
    if (!itemDateStr) return true;
    const itemDate = new Date(itemDateStr).setHours(0, 0, 0, 0);
    if (fromDateVal && itemDate < new Date(fromDateVal).setHours(0, 0, 0, 0)) return false;
    if (toDateVal && itemDate > new Date(toDateVal).setHours(0, 0, 0, 0)) return false;
    return true;
  };

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return "";
    let str = String(val);
    if (str.includes(",") || str.includes("\"") || str.includes("\n") || str.includes("\r")) {
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    }
    return str;
  };

  // 1. Enquiries
  if (moduleVal === 'Enquiries') {
    const list = state.enquiries.filter(e => isWithinDateRange(e.date));
    if (list.length === 0) return alert("No data available to export!");
    csvContent += "Customer Name,Mobile Number,Enquiry Date,Source,Status\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.name)},${escapeCSV(item.mobile)},${escapeCSV(item.date)},${escapeCSV(item.source)},${escapeCSV(item.status)}\n`;
    });

  // 2. Bookings
  } else if (moduleVal === 'Bookings') {
    const list = state.bookings.filter(b => isWithinDateRange(b.date));
    if (list.length === 0) return alert("No data available to export!");
    csvContent += "Customer Name,Mobile Number,Booking Date,Booking Amount (INR),Payment Method\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.name)},${escapeCSV(item.mobile || "")},${escapeCSV(item.date)},${escapeCSV(item.amount)},${escapeCSV(item.payment)}\n`;
    });

  // 3. Billings
  } else if (moduleVal === 'Billings') {
    const list = state.billings.filter(b => isWithinDateRange(b.date));
    if (list.length === 0) return alert("No data available to export!");
    csvContent += "Invoice Number,Invoice Date,Customer Name,Customer Phone,Customer Address,Customer GSTIN,Product/Service,Qty,Base Amount (INR),GST Rate (%),GST Amount (INR),Grand Total (INR)\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.invoiceNo)},${escapeCSV(item.date)},${escapeCSV(item.customerName)},${escapeCSV(item.customerMobile || "")},${escapeCSV(item.customerAddress || "")},${escapeCSV(item.customerGst || "")},${escapeCSV(item.productName)},${escapeCSV(item.qty || 1)},${escapeCSV(item.baseAmount)},${escapeCSV(item.gstRate || 18)},${escapeCSV(item.gstAmount)},${escapeCSV(item.totalAmount)}\n`;
    });

  // 4. Purchases
  } else if (moduleVal === 'Purchases') {
    const list = state.purchases.filter(p => isWithinDateRange(p.date));
    if (list.length === 0) return alert("No data available to export!");
    csvContent += "Purchase Inv No,Purchase Date,Supplier Name,Supplier Phone,Item Code,Item Description,Category,Brand,Model,Quantity,Purchase Rate (INR),GST Rate (%),Taxable Value (INR),GST (INR),Total Amount (INR),Paid (INR),Balance Due (INR),Status\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.invoiceNo)},${escapeCSV(item.date)},${escapeCSV(item.supplier)},${escapeCSV(item.supplierPhone || "")},${escapeCSV(item.itemCode)},${escapeCSV(item.itemName)},${escapeCSV(item.category)},${escapeCSV(item.brand || "")},${escapeCSV(item.model || "")},${escapeCSV(item.qty)},${escapeCSV(item.rate)},${escapeCSV(item.gstRate || 18)},${escapeCSV(item.taxableAmount)},${escapeCSV(item.gstAmount)},${escapeCSV(item.totalAmount)},${escapeCSV(item.paidAmount)},${escapeCSV(item.balanceAmount)},${escapeCSV(item.status)}\n`;
    });

  // 5. Stock Availability
  } else if (moduleVal === 'StockAvailability') {
    const list = state.inventory;
    if (list.length === 0) return alert("No inventory data to export!");
    csvContent += "Item Code,Item Name,Category,Brand,Model,Opening Stock,Purchase Qty,Sales Qty,Available Stock,Purchase Rate (INR),Selling Rate (INR),Stock Valuation (INR),Min Stock,Status\n";
    list.forEach(item => {
      const avail = calculateAvailableStock(item);
      const val = Math.max(0, avail) * (item.purchaseRate || 0);
      const st = getStockStatus(avail, item.minStock);
      csvContent += `${escapeCSV(item.itemCode)},${escapeCSV(item.itemName)},${escapeCSV(item.category)},${escapeCSV(item.brand || "")},${escapeCSV(item.model || "")},${escapeCSV(item.openingStock || 0)},${escapeCSV(item.purchaseQty || 0)},${escapeCSV(item.salesQty || 0)},${escapeCSV(avail)},${escapeCSV(item.purchaseRate)},${escapeCSV(item.sellingRate)},${escapeCSV(val)},${escapeCSV(item.minStock || 2)},${escapeCSV(st)}\n`;
    });

  // 6. Stock Movement / Ledger
  } else if (moduleVal === 'StockMovement') {
    const list = state.stockLedger.filter(l => isWithinDateRange(l.timestamp));
    if (list.length === 0) return alert("No ledger records to export!");
    csvContent += "Timestamp,Item Code,Item Name,Category,Movement Type,Ref Document No,In Qty (+),Out Qty (-),Balance Stock,Unit Cost (INR),Remarks\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.timestamp)},${escapeCSV(item.itemCode)},${escapeCSV(item.itemName)},${escapeCSV(item.category)},${escapeCSV(item.type)},${escapeCSV(item.refNo)},${escapeCSV(item.inQty)},${escapeCSV(item.outQty)},${escapeCSV(item.balanceStock)},${escapeCSV(item.unitCost)},${escapeCSV(item.remarks)}\n`;
    });

  // 7. Low Stock
  } else if (moduleVal === 'LowStock') {
    const list = state.inventory.filter(i => {
      const avail = calculateAvailableStock(i);
      const min = i.minStock || 2;
      return (avail > 0 && avail <= min);
    });
    if (list.length === 0) return alert("No low stock items!");
    csvContent += "Item Code,Item Name,Category,Brand,Available Stock,Min Stock Threshold,Deficit Qty,Unit Purchase Rate (INR),Estimated Restock Cost (INR)\n";
    list.forEach(item => {
      const avail = calculateAvailableStock(item);
      const min = item.minStock || 2;
      const deficit = Math.max(0, min * 2 - avail);
      csvContent += `${escapeCSV(item.itemCode)},${escapeCSV(item.itemName)},${escapeCSV(item.category)},${escapeCSV(item.brand || "")},${escapeCSV(avail)},${escapeCSV(min)},${escapeCSV(deficit)},${escapeCSV(item.purchaseRate)},${escapeCSV(deficit * item.purchaseRate)}\n`;
    });

  // 8. Out of Stock
  } else if (moduleVal === 'OutOfStock') {
    const list = state.inventory.filter(i => calculateAvailableStock(i) <= 0);
    if (list.length === 0) return alert("No out of stock items!");
    csvContent += "Item Code,Item Name,Category,Brand,Available Stock,Purchase Rate (INR),Selling Rate (INR)\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.itemCode)},${escapeCSV(item.itemName)},${escapeCSV(item.category)},${escapeCSV(item.brand || "")},0,${escapeCSV(item.purchaseRate)},${escapeCSV(item.sellingRate)}\n`;
    });

  // 9. Supplier Purchase
  } else if (moduleVal === 'SupplierPurchase') {
    const list = state.suppliers;
    if (list.length === 0) return alert("No supplier records!");
    csvContent += "Supplier Name,Phone,Email,GSTIN,Total Purchases (INR),Outstanding Balance Due (INR)\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.name)},${escapeCSV(item.phone || "")},${escapeCSV(item.email || "")},${escapeCSV(item.gstin || "")},${escapeCSV(item.totalPurchases)},${escapeCSV(item.balanceDue)}\n`;
    });

  // 10. Purchase Returns
  } else if (moduleVal === 'PurchaseReturns') {
    const list = state.returns.filter(r => r.type === 'PURCHASE_RETURN' && isWithinDateRange(r.date));
    if (list.length === 0) return alert("No purchase returns to export!");
    csvContent += "Return ID,Return Date,Purchase Inv No,Supplier Name,Item Description,Returned Qty,Debit Amount (INR),Reason\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.id)},${escapeCSV(item.date)},${escapeCSV(item.invNo)},${escapeCSV(item.supplierName)},${escapeCSV(item.itemName)},${escapeCSV(item.qty)},${escapeCSV(item.amount)},${escapeCSV(item.reason)}\n`;
    });

  // 11. Sales Stock
  } else if (moduleVal === 'SalesStock') {
    const list = state.billings.filter(b => isWithinDateRange(b.date));
    if (list.length === 0) return alert("No sales records to export!");
    csvContent += "Invoice No,Date,Customer Name,Customer Phone,Item Code,Product Description,Sold Qty,Unit Selling Rate (INR),Base Amount (INR),GST (INR),Grand Total (INR)\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.invoiceNo)},${escapeCSV(item.date)},${escapeCSV(item.customerName)},${escapeCSV(item.customerMobile || "")},${escapeCSV(item.itemCode || "")},${escapeCSV(item.productName)},${escapeCSV(item.qty || 1)},${escapeCSV(item.unitRate || (item.baseAmount / (item.qty || 1)))},${escapeCSV(item.baseAmount)},${escapeCSV(item.gstAmount)},${escapeCSV(item.totalAmount)}\n`;
    });

  // 12. PC Builds
  } else if (moduleVal === 'PCBuilds') {
    const list = state.pcBuilds.filter(b => isWithinDateRange(b.date));
    if (list.length === 0) return alert("No PC build records to export!");
    csvContent += "Build ID,Assembly Date,Customer Name,Customer Phone,Customer Address,Customer GSTIN,PC Model Name,Serial/Tag No,Components Cost (INR),Labor Charge (INR),Total Build Cost (INR),Target Selling Price (INR),Gross Margin (INR),Margin (%)\n";
    list.forEach(item => {
      csvContent += `${escapeCSV(item.id)},${escapeCSV(item.date)},${escapeCSV(item.customerName || "Shop Build")},${escapeCSV(item.customerPhone || "")},${escapeCSV(item.customerAddress || "")},${escapeCSV(item.customerGst || "")},${escapeCSV(item.name)},${escapeCSV(item.serialNo)},${escapeCSV(item.componentsCost)},${escapeCSV(item.laborCost)},${escapeCSV(item.totalCost)},${escapeCSV(item.sellingPrice)},${escapeCSV(item.marginAmount)},${escapeCSV(item.marginPercent)}\n`;
    });

  // 13. Profit Margin
  } else if (moduleVal === 'ProfitMargin') {
    const list = state.billings.filter(b => isWithinDateRange(b.date));
    if (list.length === 0) return alert("No sales records to export!");
    csvContent += "Invoice No,Date,Customer Name,Product Description,Qty,Cost Price / COGS (INR),Selling Price / Revenue (INR),Gross Profit (INR),Profit Margin (%)\n";
    list.forEach(item => {
      const qty = item.qty || 1;
      const cost = (parseFloat(item.costPrice || 0) * qty);
      const sell = parseFloat(item.baseAmount || 0);
      const profit = sell - cost;
      const margin = sell > 0 ? ((profit / sell) * 100).toFixed(2) : 0;
      csvContent += `${escapeCSV(item.invoiceNo)},${escapeCSV(item.date)},${escapeCSV(item.customerName)},${escapeCSV(item.productName)},${escapeCSV(qty)},${escapeCSV(cost)},${escapeCSV(sell)},${escapeCSV(profit)},${escapeCSV(margin)}\n`;
    });
  }

  // Trigger UTF-8 Download with BOM
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", fileName);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
