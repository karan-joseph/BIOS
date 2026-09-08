// ==========================================================================
// BIOS - PC, Laptop & Inventory Management Software
// Building Intelligent Outcomes with Solutions
// ==========================================================================

// ==========================================================================
// CENTRALIZED COMPANY BRANDING & OFFICIAL LOGO SYSTEM
// Single Source of Truth across UI, Modals, Print Documents & Reports
// ==========================================================================
const COMPANY_BRANDING = {
  name: 'BIOS',
  fullName: 'BIOS PC Solutions & Systems',
  tagline: 'BUILDING INTELLIGENT OUTCOMES WITH SOLUTION',
  subtitle: 'PC, Laptop & Inventory Management Suite',
  division: 'Enterprise PC, Laptop & Billing Solutions',
  address: '123 Startup Hub, Tech District',
  phone: '+91 98765 43210',
  email: 'billing@bios.solutions',
  website: 'www.bios.solutions',
  gstin: '29AABCB1234F1Z5',
  logoOriginal: 'assets/bios-logo.jpg',
  logoTransparent: 'assets/bios-logo-transparent.png',

  // Returns standardized logo image tag
  getLogoImg: function(className = 'print-brand-logo', useTransparent = true) {
    const src = useTransparent ? this.logoTransparent : this.logoOriginal;
    return `<img src="${src}" alt="BIOS Official Logo" class="${className} brand-logo-img" loading="eager" />`;
  },

  // Returns standardized print document header HTML
  getPrintHeaderHtml: function(subText = 'Computer Systems, Laptops, Components & Accessories', useTransparent = true) {
    const src = useTransparent ? this.logoTransparent : this.logoOriginal;
    return `
      <div class="print-brand-header">
        <img src="${src}" alt="BIOS Official Logo" class="print-brand-logo brand-logo-img" />
        <div class="print-brand-info">
          <h2>${this.name}</h2>
          <div class="print-brand-tagline">${this.tagline}</div>
          <div class="print-brand-desc">${subText}</div>
        </div>
      </div>
    `;
  }
};
window.COMPANY_BRANDING = COMPANY_BRANDING;


// Global Application State
let state = {
  enquiries: [],
  bookings: [],
  billings: [],
  activities: [],
  inventory: [],          // Stock items master
  purchases: [],          // Inward purchases
  suppliers: [],          // Supplier directory
  pcBuilds: [],           // Assembled PC builds
  returns: [],            // Sales and Purchase returns
  stockLedger: [],        // Complete stock movement history
  serviceJobCards: [],    // Service & Repair Job Cards
  serviceEstimations: [], // Service Quotations & Estimations
  serviceInvoices: []     // Service Bills & Invoices
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
  STOCK_LEDGER: 'bios_stock_ledger',
  SERVICE_JOB_CARDS: 'bios_service_job_cards',
  SERVICE_ESTIMATIONS: 'bios_service_estimations',
  SERVICE_INVOICES: 'bios_service_invoices'
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
  renderServiceModule();
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
    state.serviceJobCards = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICE_JOB_CARDS)) || [];
    state.serviceEstimations = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICE_ESTIMATIONS)) || [];
    state.serviceInvoices = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICE_INVOICES)) || [];
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
      serviceConsumedQty: 0,
      openingStock: 0,
      availableStock: 2,
      purchaseRate: 68500,
      sellingRate: 78990,
      minStock: 1,
      serials: ['LAP-ASUS-99120', 'LAP-ASUS-99121']
    },
    {
      itemCode: 'PART-LAP-KB-DELL',
      itemName: 'Dell Inspiron 15 Replacement Keyboard (Backlit UK/US)',
      category: 'Spare Part',
      brand: 'Dell OEM',
      model: 'Inspiron 3520 / 3511 / 5510',
      purchaseQty: 8,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 0,
      pcProducedQty: 0,
      serviceConsumedQty: 1,
      openingStock: 0,
      availableStock: 7,
      purchaseRate: 1200,
      sellingRate: 1850,
      minStock: 2,
      serials: []
    },
    {
      itemCode: 'PART-THERMAL-MX4',
      itemName: 'Arctic MX-4 High-Performance Thermal Compound (4g Syringe)',
      category: 'Spare Part',
      brand: 'Arctic',
      model: 'MX-4 4g Edition',
      purchaseQty: 15,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 0,
      pcProducedQty: 0,
      serviceConsumedQty: 2,
      openingStock: 0,
      availableStock: 13,
      purchaseRate: 450,
      sellingRate: 750,
      minStock: 3,
      serials: []
    },
    {
      itemCode: 'PART-SCREEN-156-FHD',
      itemName: '15.6" Full HD (1920x1080) IPS 30-Pin Slim LED Laptop Screen Panel',
      category: 'Spare Part',
      brand: 'BOE / LG Display',
      model: 'NV156FHM-N48 30Pin',
      purchaseQty: 5,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 0,
      pcProducedQty: 0,
      serviceConsumedQty: 1,
      openingStock: 0,
      availableStock: 4,
      purchaseRate: 3600,
      sellingRate: 4950,
      minStock: 2,
      serials: ['SCR-156-8821', 'SCR-156-8822', 'SCR-156-8823', 'SCR-156-8824']
    },
    {
      itemCode: 'PART-BAT-HP-HT03XL',
      itemName: 'HP Original HT03XL 3-Cell 41.04Wh Laptop Replacement Battery',
      category: 'Spare Part',
      brand: 'HP OEM',
      model: 'HT03XL L11119-855',
      purchaseQty: 6,
      salesQty: 0,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 0,
      pcProducedQty: 0,
      serviceConsumedQty: 0,
      openingStock: 0,
      availableStock: 6,
      purchaseRate: 2100,
      sellingRate: 2950,
      minStock: 2,
      serials: ['BAT-HP-44910', 'BAT-HP-44911']
    },
    {
      itemCode: 'PART-CHARGER-65W-TYPEC',
      itemName: 'Universal 65W Type-C Laptop Power Adapter Charger (PD 3.0)',
      category: 'Accessory',
      brand: 'BIOS Power',
      model: '65W USB-C GaN',
      purchaseQty: 10,
      salesQty: 1,
      salesReturnQty: 0,
      purchaseReturnQty: 0,
      adjustmentQty: 0,
      pcConsumedQty: 0,
      pcProducedQty: 0,
      serviceConsumedQty: 1,
      openingStock: 0,
      availableStock: 8,
      purchaseRate: 950,
      sellingRate: 1550,
      minStock: 3,
      serials: []
    }
  ];

  if (!state.inventory || state.inventory.length === 0) {
    state.inventory = starterItems;
  } else {
    starterItems.forEach(si => {
      if (!state.inventory.some(i => i.itemCode === si.itemCode)) {
        state.inventory.push(si);
      }
    });
  }
  saveToStorage(STORAGE_KEYS.INVENTORY, state.inventory);

  // Initial Suppliers
  if (!state.suppliers || state.suppliers.length === 0) {
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
      },
      {
        name: 'Compuage Spare & Parts Hub',
        phone: '9845112233',
        email: 'serviceparts@compuage.in',
        gstin: '29AABCC4455P1Z8',
        totalPurchases: 45000,
        balanceDue: 0
      }
    ];
    saveToStorage(STORAGE_KEYS.SUPPLIERS, state.suppliers);
  }

  // Initial Purchases
  const todayStr = getTodayDateString();
  if (!state.purchases || state.purchases.length === 0) {
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
    },
    {
      id: 'PUR-1003',
      invoiceNo: 'COMP-SP-2041',
      date: todayStr,
      supplier: 'Compuage Spare & Parts Hub',
      supplierPhone: '9845112233',
      itemCode: 'PART-SCREEN-156-FHD',
      itemName: '15.6" Full HD IPS 30-Pin Laptop Display Panel',
      category: 'Spare Part',
      brand: 'BOE / LG Display',
      model: 'NV156FHM-N48',
      qty: 5,
      rate: 3600,
      discount: 0,
      gstRate: 18,
      taxableAmount: 18000,
      gstAmount: 3240,
      totalAmount: 21240,
      paidAmount: 21240,
      balanceAmount: 0,
      status: 'Paid',
      serials: ['SCR-156-8821', 'SCR-156-8822', 'SCR-156-8823', 'SCR-156-8824', 'SCR-156-8825']
    }
  ];
    saveToStorage(STORAGE_KEYS.PURCHASES, state.purchases);
  }

  // Initial Assembled PC Build
  if (!state.pcBuilds || state.pcBuilds.length === 0) {
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
    if (!state.inventory.some(i => i.itemCode === 'PC-BUILD-2026-001')) {
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
        serviceConsumedQty: 0,
        openingStock: 0,
        availableStock: 1,
        purchaseRate: 120800,
        sellingRate: 139900,
        minStock: 1,
        serials: ['BIOS-PC-2026-001']
      });
      saveToStorage(STORAGE_KEYS.INVENTORY, state.inventory);
    }
  }

  // Seed Initial Stock Ledger
  if (!state.stockLedger || state.stockLedger.length === 0) {
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
        itemCode: 'PART-SCREEN-156-FHD',
        itemName: '15.6" Full HD IPS 30-Pin Laptop Display Panel',
        category: 'Spare Part',
        type: 'PURCHASE',
        refNo: 'COMP-SP-2041',
        inQty: 5,
        outQty: 0,
        balanceStock: 5,
        unitCost: 3600,
        remarks: 'Purchased from Compuage Spare & Parts Hub'
      },
      {
        id: 'LEDGER-004',
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
        id: 'LEDGER-005',
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
      },
      {
        id: 'LEDGER-006',
        timestamp: new Date().toISOString(),
        itemCode: 'PART-SCREEN-156-FHD',
        itemName: '15.6" Full HD IPS 30-Pin Laptop Display Panel',
        category: 'Spare Part',
        type: 'SERVICE_CONSUME',
        refNo: 'JC-2026-0001',
        inQty: 0,
        outQty: 1,
        balanceStock: 4,
        unitCost: 3600,
        remarks: 'Installed in Laptop Service Job Card: JC-2026-0001 (Vikram Patel)'
      }
    ];
    saveToStorage(STORAGE_KEYS.STOCK_LEDGER, state.stockLedger);
  }

  // Seed Initial Service Job Cards
  if (!state.serviceJobCards || state.serviceJobCards.length === 0) {
    state.serviceJobCards = [
      {
        id: 'JC-2026-0001',
        date: todayStr,
        deliveryDate: todayStr,
        customerName: 'Vikram Patel',
        customerMobile: '9845011223',
        customerAddress: 'Indiranagar 100ft Rd, Bangalore',
        deviceType: 'Laptop',
        deviceBrand: 'Dell',
        deviceModel: 'Inspiron 15 3520',
        deviceSerial: '8H3G9X2',
        complaint: 'Screen flickering with horizontal lines & laptop overheating after 30 mins use.',
        technician: 'Senior Hardware Engineer',
        techRemarks: 'FHD IPS screen replacement done and thermal paste re-applied with internal heatsink clean.',
        status: 'Ready',
        labourItems: [
          { description: 'Screen Panel Replacement Labour & Diagnostics', amount: 650 },
          { description: 'Complete Thermal Paste Re-application & Cooling Fan Servicing', amount: 500 }
        ],
        partsItems: [
          { itemCode: 'PART-SCREEN-156-FHD', partName: '15.6" Full HD IPS 30-Pin Laptop Display Panel', qty: 1, rate: 4950, amount: 4950 },
          { itemCode: 'PART-THERMAL-MX4', partName: 'Arctic MX-4 High-Performance Thermal Compound', qty: 1, rate: 750, amount: 750 }
        ],
        totalLabour: 1150,
        totalParts: 5700,
        subtotal: 6850,
        discount: 250,
        taxRate: 18,
        taxAmount: 1188,
        grandTotal: 7788,
        invoiceId: 'SINV-2026-0001'
      },
      {
        id: 'JC-2026-0002',
        date: todayStr,
        deliveryDate: getTodayDateString(),
        customerName: 'Ananya Sharma',
        customerMobile: '9988776655',
        customerAddress: 'Koramangala 4th Block, Bangalore',
        deviceType: 'Laptop',
        deviceBrand: 'HP',
        deviceModel: 'Pavilion 14-dv0054TU',
        deviceSerial: '5CD129848K',
        complaint: 'Battery draining in 15 minutes, keyboard keys "E" and "Spacebar" not responding.',
        technician: 'Laptop Chip-Level Technician',
        techRemarks: 'Original battery replacement and keyboard testing.',
        status: 'Under Service',
        labourItems: [
          { description: 'Internal Battery Replacement & Calibration', amount: 450 }
        ],
        partsItems: [
          { itemCode: 'PART-BAT-HP-HT03XL', partName: 'HP Original HT03XL 3-Cell Laptop Battery', qty: 1, rate: 2950, amount: 2950 }
        ],
        totalLabour: 450,
        totalParts: 2950,
        subtotal: 3400,
        discount: 0,
        taxRate: 18,
        taxAmount: 612,
        grandTotal: 4012,
        invoiceId: null
      },
      {
        id: 'JC-2026-0003',
        date: todayStr,
        deliveryDate: todayStr,
        customerName: 'Kiran Rao',
        customerMobile: '9741234567',
        customerAddress: 'Whitefield Main Rd, Bangalore',
        deviceType: 'Desktop',
        deviceBrand: 'Custom PC',
        deviceModel: 'Intel Core i5 Workstation Rig',
        deviceSerial: 'RIG-2025-998',
        complaint: 'Windows BSOD (Blue Screen 0x0000007E) on startup, RAM upgrade to 32GB requested.',
        technician: 'Software & OS Specialist',
        techRemarks: 'Corrupt OS drivers repaired, BIOS updated, RAM installed and dual channel memtested.',
        status: 'Open',
        labourItems: [
          { description: 'OS Driver Recovery, Malware Removal & BIOS Flash', amount: 800 }
        ],
        partsItems: [
          { itemCode: 'RAM-CORSAIR-16G-D5', partName: 'Corsair Vengeance 16GB DDR5 5600MHz RAM', qty: 1, rate: 5200, amount: 5200 }
        ],
        totalLabour: 800,
        totalParts: 5200,
        subtotal: 6000,
        discount: 0,
        taxRate: 18,
        taxAmount: 1080,
        grandTotal: 7080,
        invoiceId: null
      }
    ];
    saveToStorage(STORAGE_KEYS.SERVICE_JOB_CARDS, state.serviceJobCards);
  }

  // Seed Initial Estimations
  if (!state.serviceEstimations || state.serviceEstimations.length === 0) {
    state.serviceEstimations = [
      {
        id: 'EST-2026-0001',
        date: todayStr,
        customerName: 'Siddharth Roy',
        customerMobile: '9845667788',
        customerAddress: 'HSR Layout Sector 2, Bangalore',
        deviceType: 'Laptop',
        deviceBrand: 'Lenovo',
        deviceModel: 'IdeaPad Gaming 3',
        deviceSerial: 'MP23K8L',
        complaint: 'Liquid spill on keyboard, fan making loud rattling noise.',
        labourAmount: 950,
        partsAmount: 3200,
        accessoriesAmount: 0,
        otherCharges: 200,
        subtotal: 4350,
        discount: 150,
        taxRate: 18,
        taxAmount: 756,
        totalAmount: 4956,
        notes: 'Includes motherboard chemical wash & fan lubrication. Replacement keyboard is genuine Lenovo OEM with 6 months warranty.',
        status: 'Draft',
        convertedJobCardId: null,
        labourItems: [
          { description: 'Motherboard Chemical Decontamination & Ultrasonic Wash', amount: 650 },
          { description: 'Fan Lubrication & Deep Cleaning Labour', amount: 300 }
        ],
        partsItems: [
          { itemCode: 'PART-LAP-KB-DELL', partName: 'Lenovo IdeaPad Replacement Keyboard', qty: 1, rate: 3200, amount: 3200 }
        ]
      }
    ];
    saveToStorage(STORAGE_KEYS.SERVICE_ESTIMATIONS, state.serviceEstimations);
  }

  // Seed Initial Service Invoices
  if (!state.serviceInvoices || state.serviceInvoices.length === 0) {
    state.serviceInvoices = [
      {
        id: 'SINV-2026-0001',
        invoiceNo: 'SINV-2026-0001',
        jobCardId: 'JC-2026-0001',
        date: todayStr,
        customerName: 'Vikram Patel',
        customerMobile: '9845011223',
        customerAddress: 'Indiranagar 100ft Rd, Bangalore',
        deviceType: 'Laptop',
        deviceBrand: 'Dell',
        deviceModel: 'Inspiron 15 3520',
        deviceSerial: '8H3G9X2',
        labourAmount: 1150,
        partsAmount: 5700,
        subtotal: 6850,
        discount: 250,
        gstRate: 18,
        gstAmount: 1188,
        grandTotal: 7788,
        paymentStatus: 'Paid',
        paymentMethod: 'UPI',
        paidAmount: 7788,
        balanceAmount: 0,
        items: [
          { name: 'Screen Panel Replacement Labour & Diagnostics', type: 'Labour', qty: 1, rate: 650, amount: 650 },
          { name: 'Thermal Paste Re-application & Cooling Fan Servicing', type: 'Labour', qty: 1, rate: 500, amount: 500 },
          { name: '15.6" Full HD IPS 30-Pin Laptop Display Panel', type: 'Spare Part', qty: 1, rate: 4950, amount: 4950 },
          { name: 'Arctic MX-4 High-Performance Thermal Compound', type: 'Spare Part', qty: 1, rate: 750, amount: 750 }
        ]
      }
    ];
    saveToStorage(STORAGE_KEYS.SERVICE_INVOICES, state.serviceInvoices);
  }
}

// ==========================================================================
// CENTRAL STOCK CALCULATION ENGINE & LEDGER
// ==========================================================================
// Stock Formula: Available Stock = Opening + Purchase + Sales Return - Sales - Purchase Return +/- Adjustment - PC Consumed + PC Produced - Service Consumed
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

// Get Stock Status: Available / Low Stock / Out of Stock
function ensureSufficientStock(item, qty, actionLabel = 'Transaction') {
  const required = parseFloat(qty || 0);
  const available = parseFloat(item?.availableStock || 0);
  if (!item) { alert(`❌ ${actionLabel}: Item was not found in inventory.`); return false; }
  if (!Number.isFinite(required) || required <= 0) { alert(`❌ ${actionLabel}: Quantity must be greater than zero.`); return false; }
  if (required > available) { alert(`❌ ${actionLabel}: Insufficient stock for "${item.itemName}".\nAvailable: ${available}\nRequired: ${required}`); return false; }
  return true;
}

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
      serviceConsumedQty: 0,
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
  } else if (type === 'SALE_REVERSAL') {
    item.salesQty = Math.max(0, parseFloat(item.salesQty || 0) - inQty);
  } else if (type === 'SALES_RETURN') {
    item.salesReturnQty = (parseFloat(item.salesReturnQty || 0) + inQty);
  } else if (type === 'PURCHASE_RETURN') {
    item.purchaseReturnQty = (parseFloat(item.purchaseReturnQty || 0) + outQty);
  } else if (type === 'PURCHASE_REVERSAL') {
    item.purchaseQty = Math.max(0, parseFloat(item.purchaseQty || 0) - outQty);
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
  } else if (type === 'SERVICE_CONSUME') {
    item.serviceConsumedQty = (parseFloat(item.serviceConsumedQty || 0) + outQty);
  } else if (type === 'SERVICE_REVERSAL') {
    item.serviceConsumedQty = Math.max(0, parseFloat(item.serviceConsumedQty || 0) - inQty);
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
    type: type, // 'enquiry', 'booking', 'billing', 'purchase', 'inventory', 'pcbuild', 'return', 'service'
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
      } else if (targetSectionId === 'service') {
        renderServiceModule();
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

  // Service Sub-Tabs
  const serviceTabs = document.querySelectorAll('[data-service-tab]');
  serviceTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      serviceTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-service-tab');
      document.querySelectorAll('#service-section .sub-tab-pane').forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById(`service-tab-${target}`);
      if (targetPane) targetPane.classList.add('active');

      if (target === 'jobcards') renderJobCardsTable();
      else if (target === 'estimations') renderEstimationsTable();
      else if (target === 'invoices') renderServiceInvoicesTable();
      else if (target === 'history') renderServiceHistorySearch();
      else if (target === 'customers') renderServiceCustomersTable();
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

  // Service modals: close/cancel only. Open buttons must call openJobCardModal / openEstimationModal
  // (those reset the form, generate numbers, and then show the modal). Do not also bind
  // setupModalToggle on the New buttons — that only adds .active and duplicates listeners.
  setupModalToggle(null, 'close-jobcard-modal-btn', 'cancel-jobcard-btn', 'jobcard-modal');
  setupModalToggle(null, 'close-estimation-modal-btn', 'cancel-estimation-btn', 'estimation-modal');
  setupModalToggle(null, 'close-svc-inv-modal-btn', 'cancel-svc-inv-btn', 'svc-invoice-modal');
  setupModalToggle(null, 'close-jobcard-view-btn', 'close-jobcard-view-btn2', 'jobcard-view-modal');
  setupModalToggle(null, 'close-estimation-view-btn', 'close-estimation-view-btn2', 'estimation-view-modal');
  setupModalToggle(null, 'close-svc-inv-view-btn', 'close-svc-inv-view-btn2', 'svc-invoice-view-modal');

  // Service Print Buttons
  const printJobCardBtn = document.getElementById('print-jobcard-btn');
  if (printJobCardBtn) printJobCardBtn.addEventListener('click', () => {
    document.body.classList.add('printing-modal');
    window.print();
    window.addEventListener('afterprint', () => document.body.classList.remove('printing-modal'), { once: true });
  });

  const printEstimationBtn = document.getElementById('print-estimation-btn');
  if (printEstimationBtn) printEstimationBtn.addEventListener('click', () => {
    document.body.classList.add('printing-modal');
    window.print();
    window.addEventListener('afterprint', () => document.body.classList.remove('printing-modal'), { once: true });
  });

  const printSvcInvBtn = document.getElementById('print-svc-inv-btn');
  if (printSvcInvBtn) printSvcInvBtn.addEventListener('click', () => {
    document.body.classList.add('printing-modal');
    window.print();
    window.addEventListener('afterprint', () => document.body.classList.remove('printing-modal'), { once: true });
  });

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

  // --- Service Module Listeners ---
  setupCustomerAutoFill('jobcard-customer-name', 'jobcard-customer-mobile', 'jobcard-customer-address');
  setupCustomerAutoFill('estimation-customer-name', 'estimation-customer-mobile', 'estimation-customer-address');

  const openJobCardBtn = document.getElementById('open-new-jobcard-btn');
  if (openJobCardBtn) {
    openJobCardBtn.addEventListener('click', () => {
      openJobCardModal();
    });
  }

  const openEstBtn = document.getElementById('open-new-estimation-btn');
  if (openEstBtn) {
    openEstBtn.addEventListener('click', () => {
      openEstimationModal();
    });
  }

  // Job Card Dynamic Row Adders
  const addJcLabourBtn = document.getElementById('add-jobcard-labour-btn');
  if (addJcLabourBtn) addJcLabourBtn.addEventListener('click', () => addJobCardLabourRow());

  const addJcPartBtn = document.getElementById('add-jobcard-part-btn');
  if (addJcPartBtn) addJcPartBtn.addEventListener('click', () => addJobCardPartRow());

  // Job Card Form & Recalculations
  const jobcardForm = document.getElementById('jobcard-form');
  if (jobcardForm) jobcardForm.addEventListener('submit', handleJobCardSubmit);

  const jobcardDiscount = document.getElementById('jobcard-discount');
  const jobcardTaxRate = document.getElementById('jobcard-tax-rate');
  if (jobcardDiscount) jobcardDiscount.addEventListener('input', recalcJobCardTotals);
  if (jobcardTaxRate) jobcardTaxRate.addEventListener('change', recalcJobCardTotals);

  // Job Card Filters
  const jobcardSearch = document.getElementById('jobcard-search');
  const jobcardFilterStatus = document.getElementById('jobcard-filter-status');
  const jobcardFilterType = document.getElementById('jobcard-filter-type');
  const resetJobcardFiltersBtn = document.getElementById('reset-jobcard-filters-btn');

  if (jobcardSearch) jobcardSearch.addEventListener('input', renderJobCardsTable);
  if (jobcardFilterStatus) jobcardFilterStatus.addEventListener('change', renderJobCardsTable);
  if (jobcardFilterType) jobcardFilterType.addEventListener('change', renderJobCardsTable);
  if (resetJobcardFiltersBtn) {
    resetJobcardFiltersBtn.addEventListener('click', () => {
      if (jobcardSearch) jobcardSearch.value = '';
      if (jobcardFilterStatus) jobcardFilterStatus.value = 'All';
      if (jobcardFilterType) jobcardFilterType.value = 'All';
      renderJobCardsTable();
    });
  }

  // Estimation Form & Calculators
  const estimationForm = document.getElementById('estimation-form');
  if (estimationForm) estimationForm.addEventListener('submit', handleEstimationSubmit);

  // Estimation Add Row Buttons
  const addEstLabourBtn = document.getElementById('add-est-labour-btn');
  if (addEstLabourBtn) addEstLabourBtn.addEventListener('click', () => addEstimationLabourRow());

  const addEstPartBtn = document.getElementById('add-est-part-btn');
  if (addEstPartBtn) addEstPartBtn.addEventListener('click', () => addEstimationPartRow());

  // Estimation static inputs that trigger recalc
  ['estimation-accessories', 'estimation-other-charges', 'estimation-discount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', recalcEstimationTotals);
  });
  const estTaxRate = document.getElementById('estimation-tax-rate');
  if (estTaxRate) estTaxRate.addEventListener('change', recalcEstimationTotals);

  const estimationSearch = document.getElementById('estimation-search');
  const estimationFilterStatus = document.getElementById('estimation-filter-status');
  if (estimationSearch) estimationSearch.addEventListener('input', renderEstimationsTable);
  if (estimationFilterStatus) estimationFilterStatus.addEventListener('change', renderEstimationsTable);

  // Service Invoice Form & Calculators
  const svcInvForm = document.getElementById('svc-invoice-form');
  if (svcInvForm) svcInvForm.addEventListener('submit', handleServiceInvoiceSubmit);

  const svcInvJobCardSelect = document.getElementById('svc-inv-jobcard-select');
  if (svcInvJobCardSelect) svcInvJobCardSelect.addEventListener('change', handleServiceInvoiceJobCardSelection);

  ['svc-inv-labour-amt', 'svc-inv-parts-amt', 'svc-inv-discount', 'svc-inv-paid-amt'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', recalcServiceInvoiceTotals);
  });
  const svcInvGstRate = document.getElementById('svc-inv-gst-rate');
  if (svcInvGstRate) svcInvGstRate.addEventListener('change', recalcServiceInvoiceTotals);

  const svcInvSearch = document.getElementById('svc-inv-search');
  const svcInvFilterPay = document.getElementById('svc-inv-filter-payment');
  if (svcInvSearch) svcInvSearch.addEventListener('input', renderServiceInvoicesTable);
  if (svcInvFilterPay) svcInvFilterPay.addEventListener('change', renderServiceInvoicesTable);

  // Service History Search
  const historySearchInput = document.getElementById('history-search-input');
  const clearHistorySearchBtn = document.getElementById('clear-history-search-btn');
  if (historySearchInput) historySearchInput.addEventListener('input', renderServiceHistorySearch);
  if (clearHistorySearchBtn) {
    clearHistorySearchBtn.addEventListener('click', () => {
      if (historySearchInput) historySearchInput.value = '';
      renderServiceHistorySearch();
    });
  }

  // Service Customer Search
  const svcCustomerSearch = document.getElementById('svc-customer-search');
  if (svcCustomerSearch) svcCustomerSearch.addEventListener('input', renderServiceCustomersTable);
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

  // Service Dashboard summary for main page
  const activeServiceJobs = (state.serviceJobCards || []).filter(j => j.status !== 'Closed' && j.status !== 'Delivered').length;
  const readyServiceJobs = (state.serviceJobCards || []).filter(j => j.status === 'Ready').length;

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
  const elActiveService = document.getElementById('dash-active-jobs-count');
  const elReadyService = document.getElementById('dash-service-ready-count');

  if (elEnq) elEnq.textContent = totalEnquiriesCount;
  if (elBkg) elBkg.textContent = totalBookingsCount;
  if (elBill) elBill.textContent = formatCurrency(totalBillingAmount);
  if (elStockVal) elStockVal.textContent = formatCurrency(totalStockValuation);
  if (elStockItemsCount) elStockItemsCount.textContent = `${state.inventory.length} items in catalog`;
  if (elPurchVal) elPurchVal.textContent = formatCurrency(totalPurchasesAmount);
  if (elPurchCount) elPurchCount.textContent = `${state.purchases.length} purchase bills`;
  if (elLowStock) elLowStock.textContent = lowStockCount;
  if (elFinishedPCs) elFinishedPCs.textContent = finishedPCCount;
  if (elActiveService) elActiveService.textContent = activeServiceJobs;
  if (elReadyService) elReadyService.textContent = `${readyServiceJobs} ready for delivery`;

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
        } else if (act.type === 'service') {
          iconSvg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`;
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

  const costPrice = matchedItem ? (matchedItem.purchaseRate || 0) : 0;
  const itemCode = matchedItem ? matchedItem.itemCode : ('ITEM-' + Date.now());

  if (!invoiceNo || !customerName || !productName) { alert('❌ Invoice No, Customer Name and Product Name are required.'); return; }
  if (!Number.isFinite(qty) || qty <= 0) { alert('❌ Billing quantity must be greater than zero.'); return; }
  if (!Number.isFinite(unitRate) || unitRate < 0) { alert('❌ Invalid selling rate.'); return; }
  if (state.billings.some(b => b.invoiceNo === invoiceNo)) { alert(`❌ Invoice ${invoiceNo} already exists.`); return; }
  if (matchedItem && !ensureSufficientStock(matchedItem, qty, 'Sales Invoice')) return;
  if (matchedItem && Array.isArray(matchedItem.serials) && matchedItem.serials.length > 0) {
    if (qty > matchedItem.serials.length) { alert(`❌ Not enough serial numbers available for ${productName}.`); return; }
    if (serialNo && !matchedItem.serials.includes(serialNo)) { alert(`❌ Serial number ${serialNo} is not available in stock.`); return; }
  }

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

  if (matchedItem && Array.isArray(matchedItem.serials) && matchedItem.serials.length > 0) {
    const removeSerials = serialNo ? [serialNo] : matchedItem.serials.slice(0, qty);
    matchedItem.serials = matchedItem.serials.filter(sn => !removeSerials.includes(sn));
    saveToStorage(STORAGE_KEYS.INVENTORY, state.inventory);
  }

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
    paidAmount: 0,
    balanceAmount: totalAmount,
    status: 'Unpaid',
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
      type: 'SALE_REVERSAL',
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

  if (!supplier || !invoiceNo || !itemCode || !itemName) { alert('❌ Supplier, Invoice No, Item Code and Item Name are required.'); return; }
  if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(rate) || rate < 0) { alert('❌ Invalid purchase quantity or rate.'); return; }
  if (paidAmount < 0 || paidAmount > totalAmount) { alert('❌ Paid amount cannot be negative or greater than the invoice total.'); return; }
  if (state.purchases.some(p => p.invoiceNo === invoiceNo && p.id !== editId)) { alert(`❌ Purchase invoice ${invoiceNo} already exists.`); return; }

  const oldPurchase = editId ? state.purchases.find(p => p.id === editId) : null;
  if (oldPurchase) {
    const oldItem = state.inventory.find(i => i.itemCode === oldPurchase.itemCode);
    if (oldItem) {
      recordStockMovement({ itemCode: oldPurchase.itemCode, itemName: oldPurchase.itemName, category: oldPurchase.category, type: 'PURCHASE_REVERSAL', refNo: `EDIT-REVERSAL-${oldPurchase.invoiceNo}`, outQty: oldPurchase.qty || 0, unitCost: oldPurchase.rate || 0, remarks: `Reversed old purchase ${oldPurchase.invoiceNo} before editing` });
      oldItem.serials = (oldItem.serials || []).filter(sn => !(oldPurchase.serials || []).includes(sn));
    }
    const oldSup = state.suppliers.find(x => x.name.toLowerCase() === oldPurchase.supplier.toLowerCase());
    if (oldSup) {
      oldSup.totalPurchases = Math.max(0, parseFloat(oldSup.totalPurchases || 0) - parseFloat(oldPurchase.totalAmount || 0));
      oldSup.balanceDue = Math.max(0, parseFloat(oldSup.balanceDue || 0) - parseFloat(oldPurchase.balanceAmount || 0));
    }
  }

  const item = recordStockMovement({ itemCode, itemName, category, type: 'PURCHASE', refNo: invoiceNo, inQty: qty, unitCost: rate, remarks: `Inward Purchase from ${supplier} (Inv: ${invoiceNo})` });
  item.brand = brand; item.model = model; item.minStock = minStock;
  if (sellingRateInput > 0) item.sellingRate = sellingRateInput;
  if (serials.length > 0) item.serials = [...new Set([...(item.serials || []), ...serials])];
  saveToStorage(STORAGE_KEYS.INVENTORY, state.inventory);

  let sup = state.suppliers.find(x => x.name.toLowerCase() === supplier.toLowerCase());
  if (!sup) { sup = { name: supplier, phone: supplierPhone, email: '', gstin: '', totalPurchases: totalAmount, balanceDue: balanceAmount, creditBalance: 0 }; state.suppliers.push(sup); }
  else { sup.totalPurchases = parseFloat(sup.totalPurchases || 0) + totalAmount; sup.balanceDue = parseFloat(sup.balanceDue || 0) + balanceAmount; if (supplierPhone) sup.phone = supplierPhone; }
  saveToStorage(STORAGE_KEYS.SUPPLIERS, state.suppliers);

  const newPurchase = { id: editId || ('PUR-' + Date.now()), invoiceNo, date, supplier, supplierPhone, itemCode, itemName, category, brand, model, qty, rate, discount, gstRate, taxableAmount, gstAmount, totalAmount, paidAmount, balanceAmount, status, serials };
  if (editId) { const idx = state.purchases.findIndex(p => p.id === editId); if (idx !== -1) state.purchases[idx] = newPurchase; }
  else state.purchases.push(newPurchase);
  saveToStorage(STORAGE_KEYS.PURCHASES, state.purchases);
  addActivity('purchase', `Recorded Purchase <strong>${invoiceNo}</strong> from ${supplier} (Qty: ${qty}x ${itemName}, Stock Increased)`);
  document.getElementById('purchase-modal').classList.remove('active');
  renderPurchasesTable(); renderInventoryTable(); renderDashboard(); renderReports();
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

    const sup = state.suppliers.find(x => x.name.toLowerCase() === item.supplier.toLowerCase());
    if (sup) {
      sup.totalPurchases = Math.max(0, parseFloat(sup.totalPurchases || 0) - parseFloat(item.totalAmount || 0));
      sup.balanceDue = Math.max(0, parseFloat(sup.balanceDue || 0) - parseFloat(item.balanceAmount || 0));
      saveToStorage(STORAGE_KEYS.SUPPLIERS, state.suppliers);
    }
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

  if (!buildName || !serialNo) { alert('❌ PC Build Name and Serial / Tag are required.'); return; }
  if (state.inventory.some(i => (i.serials || []).includes(serialNo)) || state.pcBuilds.some(b => b.serialNo === serialNo)) { alert(`❌ Serial / Tag ${serialNo} already exists.`); return; }

  const selectedComponents = [];
  const requirements = new Map();
  const requiredSlots = ['pc-slot-cpu','pc-slot-motherboard','pc-slot-ram','pc-slot-storage'];
  if (requiredSlots.some(id => !document.getElementById(id)?.value)) { alert('❌ CPU, Motherboard, RAM and Storage are mandatory.'); return; }

  for (const slot of slotIds) {
    const select = document.getElementById(slot.id);
    const itemCode = select ? select.value : '';
    if (!itemCode) continue;
    const item = state.inventory.find(i => i.itemCode === itemCode);
    if (!item) { alert(`❌ Selected component ${itemCode} was not found.`); return; }
    requirements.set(itemCode, (requirements.get(itemCode) || 0) + slot.qty);
    selectedComponents.push({ category:item.category, itemCode:item.itemCode, itemName:item.itemName, cost:item.purchaseRate || 0, qty:slot.qty });
  }
  for (const [itemCode, requiredQty] of requirements) {
    if (!ensureSufficientStock(state.inventory.find(i => i.itemCode === itemCode), requiredQty, 'PC Build')) return;
  }
  if (selectedComponents.length < 4) { alert('❌ Please select CPU, Motherboard, RAM and Storage.'); return; }
  const totalComponentsCost = selectedComponents.reduce((sum,c) => sum + c.cost * c.qty, 0);

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
  if (!invoice) { alert('❌ Sales invoice not found.'); return; }
  if (!Number.isFinite(qty) || qty <= 0) { alert('❌ Return quantity must be greater than zero.'); return; }
  const itemCode = invoice.itemCode;
  const previousReturned = state.returns.filter(r => r.type === 'SALES_RETURN' && r.invNo === invNo).reduce((sum, r) => sum + (parseFloat(r.qty) || 0), 0);
  const remainingReturnQty = Math.max(0, (parseFloat(invoice.qty) || 0) - previousReturned);
  if (qty > remainingReturnQty) { alert(`❌ Cannot return ${qty}. Remaining returnable quantity is ${remainingReturnQty}.`); return; }
  const stockItem = state.inventory.find(i => i.itemCode === itemCode);
  if (!stockItem) { alert('❌ Inventory item for this invoice was not found.'); return; }

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

  if (invoice.serialNo && stockItem.serials && !stockItem.serials.includes(invoice.serialNo)) {
    stockItem.serials.push(invoice.serialNo);
    saveToStorage(STORAGE_KEYS.INVENTORY, state.inventory);
  }

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
  if (!purchase) { alert('❌ Purchase invoice not found.'); return; }
  if (!Number.isFinite(qty) || qty <= 0) { alert('❌ Return quantity must be greater than zero.'); return; }
  const previousReturned = state.returns.filter(r => r.type === 'PURCHASE_RETURN' && r.invNo === invNo).reduce((sum, r) => sum + (parseFloat(r.qty) || 0), 0);
  const remainingReturnQty = Math.max(0, (parseFloat(purchase.qty) || 0) - previousReturned);
  if (qty > remainingReturnQty) { alert(`❌ Cannot return ${qty}. Remaining returnable quantity is ${remainingReturnQty}.`); return; }
  const itemCode = purchase.itemCode;
  const stockItem = state.inventory.find(i => i.itemCode === itemCode);
  if (!ensureSufficientStock(stockItem, qty, 'Purchase Return')) return;

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
      const due = parseFloat(sup.balanceDue || 0);
      const reduction = Math.min(due, debitAmount);
      sup.balanceDue = due - reduction;
      sup.creditBalance = parseFloat(sup.creditBalance || 0) + Math.max(0, debitAmount - reduction);
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

// ==========================================================================
// SERVICE & REPAIR MODULE CONTROLLER
// ==========================================================================

function renderServiceModule() {
  renderServiceDashboard();
  renderJobCardsTable();
  renderEstimationsTable();
  renderServiceInvoicesTable();
  renderServiceHistorySearch();
  renderServiceCustomersTable();
  populateServiceCustomerSuggestions();
}

// 1. Service Dashboard Metrics
function renderServiceDashboard() {
  const jobCards = state.serviceJobCards || [];
  const invoices = state.serviceInvoices || [];
  const todayStr = getTodayDateString();

  const openCount = jobCards.filter(j => j.status === 'Open').length;
  const underServiceCount = jobCards.filter(j => j.status === 'Under Service').length;
  const readyCount = jobCards.filter(j => j.status === 'Ready').length;
  const closedCount = jobCards.filter(j => j.status === 'Closed' || j.status === 'Delivered').length;
  const todayCount = jobCards.filter(j => j.date === todayStr).length;

  // Pending Payments
  const pendingInvoices = invoices.filter(inv => inv.paymentStatus === 'Pending' || inv.paymentStatus === 'Partially Paid');
  const pendingAmount = pendingInvoices.reduce((sum, inv) => sum + (parseFloat(inv.balanceAmount) || 0), 0);

  // Today's Service Revenue
  const todayRevenue = invoices.filter(inv => inv.date === todayStr).reduce((sum, inv) => sum + (parseFloat(inv.grandTotal) || 0), 0);

  const elOpen = document.getElementById('svc-metric-open-count');
  const elUnder = document.getElementById('svc-metric-underservice-count');
  const elReady = document.getElementById('svc-metric-ready-count');
  const elClosed = document.getElementById('svc-metric-closed-count');
  const elToday = document.getElementById('svc-metric-today-count');
  const elPendingPay = document.getElementById('svc-metric-pending-pay');
  const elPendingCount = document.getElementById('svc-metric-pending-count');
  const elTodayAmt = document.getElementById('svc-metric-today-amt');

  if (elOpen) elOpen.textContent = openCount;
  if (elUnder) elUnder.textContent = underServiceCount;
  if (elReady) elReady.textContent = readyCount;
  if (elClosed) elClosed.textContent = closedCount;
  if (elToday) elToday.textContent = todayCount;
  if (elPendingPay) elPendingPay.textContent = formatCurrency(pendingAmount);
  if (elPendingCount) elPendingCount.textContent = `${pendingInvoices.length} pending / partial bills`;
  if (elTodayAmt) elTodayAmt.textContent = formatCurrency(todayRevenue);
}

// 2. ID Generators
function generateJobCardNumber() {
  const currentYear = new Date().getFullYear();
  const list = state.serviceJobCards || [];
  const nextNum = list.length + 1;
  return `JC-${currentYear}-${String(nextNum).padStart(4, '0')}`;
}

function generateEstimationNumber() {
  const currentYear = new Date().getFullYear();
  const list = state.serviceEstimations || [];
  const nextNum = list.length + 1;
  return `EST-${currentYear}-${String(nextNum).padStart(4, '0')}`;
}

function generateServiceInvoiceNumber() {
  const currentYear = new Date().getFullYear();
  const list = state.serviceInvoices || [];
  const nextNum = list.length + 1;
  return `SINV-${currentYear}-${String(nextNum).padStart(4, '0')}`;
}

// 3. Render Job Cards Table
function renderJobCardsTable() {
  const tableBody = document.getElementById('jobcard-table-body');
  if (!tableBody) return;

  const searchVal = document.getElementById('jobcard-search') ? document.getElementById('jobcard-search').value.toLowerCase().trim() : '';
  const statusFilter = document.getElementById('jobcard-filter-status') ? document.getElementById('jobcard-filter-status').value : 'All';
  const typeFilter = document.getElementById('jobcard-filter-type') ? document.getElementById('jobcard-filter-type').value : 'All';

  let filtered = (state.serviceJobCards || []).filter(jc => {
    const matchSearch = (jc.id || '').toLowerCase().includes(searchVal) ||
      (jc.customerName || '').toLowerCase().includes(searchVal) ||
      (jc.customerMobile || '').includes(searchVal) ||
      (jc.deviceSerial || '').toLowerCase().includes(searchVal) ||
      (jc.deviceBrand || '').toLowerCase().includes(searchVal) ||
      (jc.deviceModel || '').toLowerCase().includes(searchVal);

    const matchStatus = statusFilter === 'All' || jc.status === statusFilter;
    const matchType = typeFilter === 'All' || jc.deviceType === typeFilter;

    return matchSearch && matchStatus && matchType;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" class="no-data-msg">No Job Cards found matching criteria.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(jc => {
    let statusClass = 'badge-open';
    if (jc.status === 'Under Service') statusClass = 'badge-under-service';
    if (jc.status === 'Ready') statusClass = 'badge-ready';
    if (jc.status === 'Delivered') statusClass = 'badge-delivered';
    if (jc.status === 'Closed') statusClass = 'badge-closed';

    const hasInvoice = !!jc.invoiceId;

    return `
      <tr>
        <td>
          <a href="#" onclick="openJobCardPrintModal('${jc.id}'); return false;" style="font-family: monospace; font-weight: 700; color: var(--primary); text-decoration: underline;">
            ${jc.id}
          </a>
        </td>
        <td>
          <div style="font-weight: 600;">${formatDate(jc.date)}</div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">Exp: ${formatDate(jc.deliveryDate || jc.date)}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${jc.customerName}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${jc.customerMobile}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${jc.deviceBrand} ${jc.deviceModel}</div>
          <span class="device-chip">${jc.deviceType || 'Device'}</span>
        </td>
        <td style="font-family: monospace; font-size: 0.8rem;">${jc.deviceSerial || '--'}</td>
        <td style="max-width: 200px; font-size: 0.82rem;" title="${jc.complaint}">
          ${(jc.complaint || '').length > 45 ? jc.complaint.substring(0, 45) + '...' : jc.complaint}
        </td>
        <td style="font-size: 0.85rem;">${jc.technician}</td>
        <td style="font-weight: 700; color: var(--primary);">
          ${formatCurrency(jc.grandTotal || (parseFloat(jc.totalLabour || 0) + parseFloat(jc.totalParts || 0)))}
        </td>
        <td>
          <select class="status-select-badge ${statusClass}" onchange="updateJobCardStatus('${jc.id}', this.value)" style="border-radius: 9999px; padding: 0.25rem 0.5rem; font-size: 0.75rem; font-weight: 700; border: none; cursor: pointer;">
            <option value="Open" ${jc.status === 'Open' ? 'selected' : ''}>Open</option>
            <option value="Under Service" ${jc.status === 'Under Service' ? 'selected' : ''}>Under Service</option>
            <option value="Ready" ${jc.status === 'Ready' ? 'selected' : ''}>Ready</option>
            <option value="Delivered" ${jc.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Closed" ${jc.status === 'Closed' ? 'selected' : ''}>Closed</option>
          </select>
        </td>
        <td>
          <div class="action-btn-group" style="display: flex; gap: 0.35rem; align-items: center;">
            <button class="btn btn-secondary btn-sm" onclick="openJobCardPrintModal('${jc.id}')" title="Print Job Sheet / Job Card">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="openJobCardModal('${jc.id}')" title="Edit Job Card">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            ${!hasInvoice ? `
              <button class="btn btn-primary btn-sm" onclick="openServiceInvoiceModal(null, '${jc.id}')" title="Generate Service Bill / Invoice">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </button>
            ` : `
              <button class="btn btn-success btn-sm" onclick="openServiceInvoicePrintModal('${jc.invoiceId}')" title="View Service Invoice (${jc.invoiceId})">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </button>
            `}
            <button class="btn btn-danger btn-sm" onclick="deleteJobCard('${jc.id}')" title="Delete Job Card">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 4. Render Estimations Table
function renderEstimationsTable() {
  const tableBody = document.getElementById('estimation-table-body');
  if (!tableBody) return;

  const searchVal = document.getElementById('estimation-search') ? document.getElementById('estimation-search').value.toLowerCase().trim() : '';
  const statusFilter = document.getElementById('estimation-filter-status') ? document.getElementById('estimation-filter-status').value : 'All';

  let filtered = (state.serviceEstimations || []).filter(est => {
    const matchSearch = (est.id || '').toLowerCase().includes(searchVal) ||
      (est.customerName || '').toLowerCase().includes(searchVal) ||
      (est.customerMobile || '').includes(searchVal) ||
      (est.deviceBrand || '').toLowerCase().includes(searchVal) ||
      (est.deviceModel || '').toLowerCase().includes(searchVal);

    const matchStatus = statusFilter === 'All' || est.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="10" class="no-data-msg">No estimations found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(est => {
    let badgeClass = 'badge-draft';
    if (est.status === 'Approved') badgeClass = 'badge-approved';
    if (est.status === 'Rejected') badgeClass = 'badge-rejected';

    const partsAndAcc = (parseFloat(est.partsAmount || 0) + parseFloat(est.accessoriesAmount || 0) + parseFloat(est.otherCharges || 0));

    return `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${est.id}</td>
        <td>${formatDate(est.date)}</td>
        <td>
          <div style="font-weight: 600;">${est.customerName}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${est.customerMobile}</div>
        </td>
        <td>
          <div style="font-weight: 600;">${est.deviceBrand} ${est.deviceModel}</div>
          <span class="device-chip">${est.deviceType}</span>
        </td>
        <td>${formatCurrency(est.labourAmount)}</td>
        <td>${formatCurrency(partsAndAcc)}</td>
        <td>${formatCurrency(est.taxAmount)}</td>
        <td style="font-weight: 700; color: var(--primary); font-size: 1rem;">${formatCurrency(est.totalAmount)}</td>
        <td><span class="badge ${badgeClass}">${est.status}</span></td>
        <td>
          <div class="action-btn-group" style="display: flex; gap: 0.35rem; align-items: center;">
            <button class="btn btn-secondary btn-sm" onclick="openEstimationPrintModal('${est.id}')" title="Print Quotation / Estimate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
            ${est.status !== 'Approved' ? `
              <button class="btn btn-success btn-sm" onclick="convertEstimationToJobCard('${est.id}')" title="Convert to Job Card (Customer Approved)">
                ⚡ Convert to Job Card
              </button>
            ` : `
              <span class="badge badge-ready" title="Job Card Created: ${est.convertedJobCardId || ''}">Job Card Active</span>
            `}
            <button class="btn btn-secondary btn-sm" onclick="openEstimationModal('${est.id}')" title="Edit Estimate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteEstimation('${est.id}')" title="Delete Estimate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 5. Render Service Invoices Table
function renderServiceInvoicesTable() {
  const tableBody = document.getElementById('svc-invoice-table-body');
  if (!tableBody) return;

  const searchVal = document.getElementById('svc-inv-search') ? document.getElementById('svc-inv-search').value.toLowerCase().trim() : '';
  const paymentFilter = document.getElementById('svc-inv-filter-payment') ? document.getElementById('svc-inv-filter-payment').value : 'All';

  let filtered = (state.serviceInvoices || []).filter(inv => {
    const matchSearch = (inv.invoiceNo || '').toLowerCase().includes(searchVal) ||
      (inv.jobCardId || '').toLowerCase().includes(searchVal) ||
      (inv.customerName || '').toLowerCase().includes(searchVal) ||
      (inv.customerMobile || '').includes(searchVal);

    const matchPayment = paymentFilter === 'All' || inv.paymentStatus === paymentFilter;
    return matchSearch && matchPayment;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="11" class="no-data-msg">No Service Invoices found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = filtered.map(inv => {
    let payClass = 'badge-paid';
    if (inv.paymentStatus === 'Partially Paid') payClass = 'badge-partial';
    if (inv.paymentStatus === 'Pending') payClass = 'badge-pending';

    return `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${inv.invoiceNo}</td>
        <td>${formatDate(inv.date)}</td>
        <td style="font-family: monospace;">${inv.jobCardId || '--'}</td>
        <td>
          <div style="font-weight: 600;">${inv.customerName}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">${inv.customerMobile}</div>
        </td>
        <td>
          <div>${inv.deviceBrand} ${inv.deviceModel}</div>
          <span class="device-chip">${inv.deviceType}</span>
        </td>
        <td>${formatCurrency(inv.labourAmount)}</td>
        <td>${formatCurrency(inv.partsAmount)}</td>
        <td>${formatCurrency(inv.gstAmount)}</td>
        <td style="font-weight: 800; color: var(--primary);">${formatCurrency(inv.grandTotal)}</td>
        <td>
          <span class="badge ${payClass}">${inv.paymentStatus}</span>
          ${inv.paymentStatus === 'Partially Paid' ? `<div style="font-size:0.75rem; color:var(--danger-dark); font-weight:600;">Bal: ${formatCurrency(inv.balanceAmount)}</div>` : ''}
        </td>
        <td>
          <div class="action-btn-group" style="display: flex; gap: 0.35rem; align-items: center;">
            <button class="btn btn-primary btn-sm" onclick="openServiceInvoicePrintModal('${inv.id || inv.invoiceNo}')" title="Print Service Invoice">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
            <button class="btn btn-secondary btn-sm" onclick="openServiceInvoiceModal('${inv.id || inv.invoiceNo}')" title="Edit / Update Payment">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            </button>
            <button class="btn btn-danger btn-sm" onclick="deleteServiceInvoice('${inv.id || inv.invoiceNo}')" title="Delete Invoice">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 6. Render Service History Search (Customer / Device History)
function renderServiceHistorySearch() {
  const container = document.getElementById('service-history-results-container');
  if (!container) return;

  const searchInput = document.getElementById('history-search-input');
  const searchVal = searchInput ? searchInput.value.toLowerCase().trim() : '';

  const jobCards = state.serviceJobCards || [];
  const invoices = state.serviceInvoices || [];

  if (jobCards.length === 0) {
    container.innerHTML = `<div class="no-data-msg" style="padding: 2rem;">No service history records yet.</div>`;
    return;
  }

  // Filter job cards
  let matchedCards = jobCards.filter(jc => {
    if (!searchVal) return true; // Show all when empty
    return (jc.customerName || '').toLowerCase().includes(searchVal) ||
      (jc.customerMobile || '').includes(searchVal) ||
      (jc.deviceSerial || '').toLowerCase().includes(searchVal) ||
      (jc.id || '').toLowerCase().includes(searchVal) ||
      (jc.invoiceId || '').toLowerCase().includes(searchVal) ||
      (jc.deviceBrand || '').toLowerCase().includes(searchVal) ||
      (jc.deviceModel || '').toLowerCase().includes(searchVal);
  });

  if (matchedCards.length === 0) {
    container.innerHTML = `
      <div class="no-data-msg" style="padding: 2.5rem; text-align: center;">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 0.75rem; color: var(--text-muted);"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <h4>No Service History Records Found</h4>
        <p style="color: var(--text-muted); font-size: 0.9rem;">No repairs matching "${searchVal}". Try searching with customer mobile number, serial tag, or Job Card #.</p>
      </div>
    `;
    return;
  }

  // Group matched job cards by Customer & Device
  const groups = {};
  matchedCards.forEach(jc => {
    const key = `${jc.customerMobile || jc.customerName}_${jc.deviceSerial || jc.deviceModel}`;
    if (!groups[key]) {
      groups[key] = {
        customerName: jc.customerName,
        customerMobile: jc.customerMobile,
        customerAddress: jc.customerAddress,
        deviceType: jc.deviceType,
        deviceBrand: jc.deviceBrand,
        deviceModel: jc.deviceModel,
        deviceSerial: jc.deviceSerial,
        services: []
      };
    }
    groups[key].services.push(jc);
  });

  container.innerHTML = Object.values(groups).map(grp => {
    const totalVisits = grp.services.length;
    const totalSpent = grp.services.reduce((sum, s) => sum + (parseFloat(s.grandTotal) || 0), 0);

    const timelineItems = grp.services.sort((a, b) => new Date(b.date) - new Date(a.date)).map(s => {
      let statusBadge = 'badge-open';
      if (s.status === 'Under Service') statusBadge = 'badge-under-service';
      if (s.status === 'Ready') statusBadge = 'badge-ready';
      if (s.status === 'Delivered') statusBadge = 'badge-delivered';
      if (s.status === 'Closed') statusBadge = 'badge-closed';

      const partsListHtml = (s.partsItems || []).map(p => `
        <div style="font-size: 0.8rem; color: var(--text-main); margin-bottom: 0.2rem;">
          • <strong>${p.partName || p.itemCode}</strong> (Qty: ${p.qty || 1} @ ${formatCurrency(p.rate)}) = <strong>${formatCurrency(p.amount)}</strong>
        </div>
      `).join('');

      const labourListHtml = (s.labourItems || []).map(l => `
        <div style="font-size: 0.8rem; color: var(--text-main); margin-bottom: 0.2rem;">
          • ${l.description} = <strong>${formatCurrency(l.amount)}</strong>
        </div>
      `).join('');

      return `
        <div class="history-event-item">
          <div class="history-event-header">
            <div>
              <span style="font-family: monospace; font-weight: 700; color: var(--primary); font-size: 0.95rem;">${s.id}</span>
              <span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 0.5rem;">${formatDate(s.date)}</span>
            </div>
            <span class="badge ${statusBadge}">${s.status}</span>
          </div>

          <div style="margin-bottom: 0.5rem; font-size: 0.85rem;">
            <strong>Customer Complaint:</strong> <span style="color: var(--text-muted);">${s.complaint}</span>
          </div>
          
          <div style="margin-bottom: 0.5rem; font-size: 0.85rem;">
            <strong>Technician:</strong> ${s.technician || '--'}
            ${s.techRemarks ? ` | <em>${s.techRemarks}</em>` : ''}
          </div>

          <!-- Parts & Labour Breakdown -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: #ffffff; padding: 0.75rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin: 0.5rem 0;">
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 0.35rem;">Labour Details</div>
              ${labourListHtml || '<div style="font-size: 0.8rem; color: var(--text-muted);">No labour line items</div>'}
              <div style="font-size: 0.8rem; font-weight: 700; margin-top: 0.25rem;">Total Labour: ${formatCurrency(s.totalLabour)}</div>
            </div>
            <div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 0.35rem;">Parts Replaced from Stock</div>
              ${partsListHtml || '<div style="font-size: 0.8rem; color: var(--text-muted);">No spare parts used</div>'}
              <div style="font-size: 0.8rem; font-weight: 700; margin-top: 0.25rem;">Total Parts: ${formatCurrency(s.totalParts)}</div>
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; font-size: 0.9rem;">
            <div><strong>Service Total Amount:</strong> <span style="color: var(--primary); font-weight: 800; font-size: 1.05rem;">${formatCurrency(s.grandTotal)}</span></div>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-secondary btn-sm" onclick="openJobCardPrintModal('${s.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Print Job Sheet
              </button>
              ${s.invoiceId ? `
                <button class="btn btn-primary btn-sm" onclick="openServiceInvoicePrintModal('${s.invoiceId}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  View Invoice (${s.invoiceId})
                </button>
              ` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="history-customer-card">
        <div class="history-customer-header">
          <div>
            <div class="history-customer-title">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
              ${grp.deviceBrand} ${grp.deviceModel}
              <span class="device-chip">${grp.deviceType}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
              Serial / Service Tag: <strong style="font-family: monospace; color: var(--text-main);">${grp.deviceSerial || 'N/A'}</strong> | Owner: <strong>${grp.customerName}</strong> (${grp.customerMobile})
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.8rem; color: var(--text-muted);">${totalVisits} Service Job(s) Recorded</div>
            <div style="font-size: 1.15rem; font-weight: 800; color: var(--primary);">Total Spent: ${formatCurrency(totalSpent)}</div>
          </div>
        </div>

        <!-- Timeline of Services -->
        <div class="history-timeline">
          ${timelineItems}
        </div>
      </div>
    `;
  }).join('');
}

// 7. Render Service Customers Table
function renderServiceCustomersTable() {
  const tableBody = document.getElementById('svc-customers-table-body');
  if (!tableBody) return;

  const searchVal = document.getElementById('svc-customer-search') ? document.getElementById('svc-customer-search').value.toLowerCase().trim() : '';

  const jobCards = state.serviceJobCards || [];
  const customerMap = {};

  jobCards.forEach(jc => {
    const key = jc.customerMobile || jc.customerName;
    if (!key) return;

    if (!customerMap[key]) {
      customerMap[key] = {
        name: jc.customerName,
        mobile: jc.customerMobile,
        address: jc.customerAddress || '',
        devices: new Set(),
        totalServices: 0,
        totalSpent: 0
      };
    }

    customerMap[key].devices.add(`${jc.deviceBrand} ${jc.deviceModel} (${jc.deviceSerial || jc.deviceType})`);
    customerMap[key].totalServices++;
    customerMap[key].totalSpent += (parseFloat(jc.grandTotal) || 0);
  });

  let list = Object.values(customerMap).filter(c => {
    return c.name.toLowerCase().includes(searchVal) ||
      c.mobile.includes(searchVal) ||
      Array.from(c.devices).some(d => d.toLowerCase().includes(searchVal));
  });

  if (list.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="no-data-msg">No service customer records found.</td></tr>`;
    return;
  }

  tableBody.innerHTML = list.map(c => {
    const devicesList = Array.from(c.devices).map(d => `<span class="device-chip" style="margin-right: 0.35rem; margin-bottom: 0.25rem;">${d}</span>`).join('');

    return `
      <tr>
        <td style="font-weight: 700;">${c.name}</td>
        <td>${c.mobile}</td>
        <td>${c.address || '--'}</td>
        <td style="max-width: 250px;">${devicesList}</td>
        <td style="text-align: center; font-weight: 700;">${c.totalServices}</td>
        <td style="font-weight: 700; color: var(--primary);">${formatCurrency(c.totalSpent)}</td>
        <td>
          <button class="btn btn-primary btn-sm" onclick="openNewJobCardForCustomer('${c.name}', '${c.mobile}', '${c.address}')">
            + New Service
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

window.openNewJobCardForCustomer = function(name, mobile, address) {
  openJobCardModal();
  document.getElementById('jobcard-customer-name').value = name;
  document.getElementById('jobcard-customer-mobile').value = mobile;
  document.getElementById('jobcard-customer-address').value = address || '';
};

// 8. Datalist Auto-completion for Service Customers & Devices
function populateServiceCustomerSuggestions() {
  const dataList = document.getElementById('service-customer-list');
  if (!dataList) return;

  const names = new Set();
  (state.enquiries || []).forEach(e => { if (e.name) names.add(e.name); });
  (state.bookings || []).forEach(b => { if (b.name) names.add(b.name); });
  (state.serviceJobCards || []).forEach(j => { if (j.customerName) names.add(j.customerName); });

  dataList.innerHTML = Array.from(names).map(n => `<option value="${n}">`).join('');
}

// 9. Job Card Dynamic Rows (Labour & Parts)
function addJobCardLabourRow(description = '', amount = 0) {
  const container = document.getElementById('jobcard-labour-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'service-repeater-row labour-row';
  row.innerHTML = `
    <div>
      <input type="text" class="jc-labour-desc" placeholder="e.g. OS Installation / Screen Replacement Labour / General Service" required value="${description}" style="font-size: 0.85rem;">
    </div>
    <div>
      <input type="number" class="jc-labour-amt" placeholder="Rate ₹" min="0" step="0.01" value="${amount || ''}" required style="font-size: 0.85rem;" oninput="recalcJobCardTotals()">
    </div>
    <div>
      <button type="button" class="btn-remove-row" onclick="this.closest('.service-repeater-row').remove(); recalcJobCardTotals();" title="Remove row">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `;
  container.appendChild(row);
  recalcJobCardTotals();
}

function addJobCardPartRow(itemCode = '', partName = '', qty = 1, rate = 0) {
  const container = document.getElementById('jobcard-parts-container');
  if (!container) return;

  // Build stock item options
  const stockOptions = state.inventory.map(item => {
    const avail = calculateAvailableStock(item);
    const selected = item.itemCode === itemCode ? 'selected' : '';
    return `<option value="${item.itemCode}" data-name="${item.itemName}" data-rate="${item.sellingRate || item.purchaseRate}" data-avail="${avail}" ${selected}>
      [Stock: ${avail}] ${item.itemName} - ₹${item.sellingRate || item.purchaseRate}
    </option>`;
  }).join('');

  const row = document.createElement('div');
  row.className = 'service-repeater-row part-row';
  row.innerHTML = `
    <div>
      <select class="jc-part-select" onchange="handleJobCardPartSelect(this)" style="font-size: 0.85rem; width: 100%;">
        <option value="">-- Choose Spare Part from Stock (or type custom) --</option>
        ${stockOptions}
      </select>
      <input type="text" class="jc-part-custom-name" placeholder="Part description" value="${partName}" style="font-size: 0.82rem; margin-top: 0.25rem;">
    </div>
    <div>
      <label style="font-size: 0.72rem; color: var(--text-muted);">Qty</label>
      <input type="number" class="jc-part-qty" min="1" step="1" value="${qty || 1}" required style="font-size: 0.85rem;" oninput="handleJobCardPartQtyOrRateChange(this)">
    </div>
    <div>
      <label style="font-size: 0.72rem; color: var(--text-muted);">Unit Rate (₹)</label>
      <input type="number" class="jc-part-rate" min="0" step="0.01" value="${rate || ''}" required style="font-size: 0.85rem;" oninput="handleJobCardPartQtyOrRateChange(this)">
    </div>
    <div>
      <label style="font-size: 0.72rem; color: var(--text-muted);">Amount (₹)</label>
      <input type="text" class="jc-part-amount" readonly value="${(qty * rate).toFixed(2)}" style="font-size: 0.85rem; background: var(--secondary-light); font-weight: 700;">
    </div>
    <div>
      <button type="button" class="btn-remove-row" onclick="this.closest('.service-repeater-row').remove(); recalcJobCardTotals();" title="Remove part" style="margin-top: 1rem;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `;
  container.appendChild(row);
  recalcJobCardTotals();
}

window.handleJobCardPartSelect = function(selectEl) {
  const row = selectEl.closest('.service-repeater-row');
  if (!row) return;

  const selectedOpt = selectEl.options[selectEl.selectedIndex];
  if (selectedOpt && selectedOpt.value) {
    const itemName = selectedOpt.getAttribute('data-name');
    const rate = parseFloat(selectedOpt.getAttribute('data-rate') || 0);
    const avail = parseFloat(selectedOpt.getAttribute('data-avail') || 0);

    const nameInput = row.querySelector('.jc-part-custom-name');
    const rateInput = row.querySelector('.jc-part-rate');
    const qtyInput = row.querySelector('.jc-part-qty');
    const amtInput = row.querySelector('.jc-part-amount');

    if (nameInput) nameInput.value = itemName;
    if (rateInput) rateInput.value = rate;
    const qty = parseFloat(qtyInput?.value || 1);
    if (amtInput) amtInput.value = (qty * rate).toFixed(2);

    if (avail <= 0) {
      alert(`⚠️ Note: Selected item currently has 0 available stock. Please restock via Purchase module.`);
    }
  }
  recalcJobCardTotals();
};

window.handleJobCardPartQtyOrRateChange = function(inputEl) {
  const row = inputEl.closest('.service-repeater-row');
  if (!row) return;
  const qty = parseFloat(row.querySelector('.jc-part-qty')?.value || 0);
  const rate = parseFloat(row.querySelector('.jc-part-rate')?.value || 0);
  const amtInput = row.querySelector('.jc-part-amount');
  if (amtInput) amtInput.value = (qty * rate).toFixed(2);
  recalcJobCardTotals();
};

// 10. Recalculate Job Card Totals
function recalcJobCardTotals() {
  let totalLabour = 0;
  document.querySelectorAll('#jobcard-labour-container .jc-labour-amt').forEach(el => {
    totalLabour += parseFloat(el.value || 0);
  });

  let totalParts = 0;
  document.querySelectorAll('#jobcard-parts-container .jc-part-amount').forEach(el => {
    totalParts += parseFloat(el.value || 0);
  });

  const discount = parseFloat(document.getElementById('jobcard-discount')?.value || 0);
  const taxRate = parseFloat(document.getElementById('jobcard-tax-rate')?.value || 18);

  const subtotal = Math.max(0, totalLabour + totalParts - discount);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  const elLabour = document.getElementById('jobcard-calc-labour-total');
  const elParts = document.getElementById('jobcard-calc-parts-total');
  const elSubtotal = document.getElementById('jobcard-calc-subtotal');
  const elTax = document.getElementById('jobcard-tax-amount');
  const elGrand = document.getElementById('jobcard-calc-grand-total');

  if (elLabour) elLabour.textContent = formatCurrency(totalLabour);
  if (elParts) elParts.textContent = formatCurrency(totalParts);
  if (elSubtotal) elSubtotal.textContent = formatCurrency(subtotal);
  if (elTax) elTax.value = taxAmount.toFixed(2);
  if (elGrand) elGrand.textContent = formatCurrency(grandTotal);
}

// 11a. Add Estimation Labour Row
function addEstimationLabourRow(description = '', amount = 0) {
  const container = document.getElementById('estimation-labour-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'service-repeater-row est-labour-row';
  row.innerHTML = `
    <div>
      <input type="text" class="est-labour-desc" placeholder="e.g. OS Re-installation / Screen Cleaning / Virus Removal" value="${description}" style="font-size: 0.85rem;">
    </div>
    <div>
      <input type="number" class="est-labour-amt" placeholder="Estimated Rate ₹" min="0" step="0.01" value="${amount || ''}" style="font-size: 0.85rem;" oninput="recalcEstimationTotals()">
    </div>
    <div>
      <button type="button" class="btn-remove-row" onclick="this.closest('.est-labour-row').remove(); recalcEstimationTotals();" title="Remove">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `;
  container.appendChild(row);
  recalcEstimationTotals();
}

// 11b. Add Estimation Part Row
function addEstimationPartRow(itemCode = '', partName = '', qty = 1, rate = 0) {
  const container = document.getElementById('estimation-parts-container');
  if (!container) return;

  const stockOptions = state.inventory.map(item => {
    const avail = calculateAvailableStock(item);
    const selected = item.itemCode === itemCode ? 'selected' : '';
    return `<option value="${item.itemCode}" data-name="${item.itemName}" data-rate="${item.sellingRate || item.purchaseRate}" data-avail="${avail}" ${selected}>[Stock: ${avail}] ${item.itemName} - ₹${item.sellingRate || item.purchaseRate}</option>`;
  }).join('');

  const row = document.createElement('div');
  row.className = 'service-repeater-row est-part-row';
  row.innerHTML = `
    <div>
      <select class="est-part-select" onchange="handleEstimationPartSelect(this)" style="font-size: 0.85rem; width: 100%;">
        <option value="">-- Choose Spare Part to Quote (from Stock) --</option>
        ${stockOptions}
      </select>
      <input type="text" class="est-part-custom-name" placeholder="Part name (or type custom)" value="${partName}" style="font-size: 0.82rem; margin-top: 0.25rem;">
    </div>
    <div>
      <label style="font-size: 0.72rem; color: var(--text-muted);">Qty</label>
      <input type="number" class="est-part-qty" min="1" step="1" value="${qty || 1}" style="font-size: 0.85rem;" oninput="handleEstimationPartQtyOrRateChange(this)">
    </div>
    <div>
      <label style="font-size: 0.72rem; color: var(--text-muted);">Unit Rate (₹)</label>
      <input type="number" class="est-part-rate" min="0" step="0.01" value="${rate || ''}" style="font-size: 0.85rem;" oninput="handleEstimationPartQtyOrRateChange(this)">
    </div>
    <div>
      <label style="font-size: 0.72rem; color: var(--text-muted);">Amount (₹)</label>
      <input type="text" class="est-part-amount" readonly value="${(qty * rate).toFixed(2)}" style="font-size: 0.85rem; background: var(--secondary-light); font-weight: 700;">
    </div>
    <div>
      <button type="button" class="btn-remove-row" onclick="this.closest('.est-part-row').remove(); recalcEstimationTotals();" title="Remove" style="margin-top: 1rem;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  `;
  container.appendChild(row);
  recalcEstimationTotals();
}

window.handleEstimationPartSelect = function(selectEl) {
  const row = selectEl.closest('.est-part-row');
  if (!row) return;
  const selectedOpt = selectEl.options[selectEl.selectedIndex];
  if (selectedOpt && selectedOpt.value) {
    const itemName = selectedOpt.getAttribute('data-name');
    const rate = parseFloat(selectedOpt.getAttribute('data-rate') || 0);
    const nameInput = row.querySelector('.est-part-custom-name');
    const rateInput = row.querySelector('.est-part-rate');
    const qtyInput = row.querySelector('.est-part-qty');
    const amtInput = row.querySelector('.est-part-amount');
    if (nameInput) nameInput.value = itemName;
    if (rateInput) rateInput.value = rate;
    const qty = parseFloat(qtyInput?.value || 1);
    if (amtInput) amtInput.value = (qty * rate).toFixed(2);
  }
  recalcEstimationTotals();
};

window.handleEstimationPartQtyOrRateChange = function(inputEl) {
  const row = inputEl.closest('.est-part-row');
  if (!row) return;
  const qty = parseFloat(row.querySelector('.est-part-qty')?.value || 0);
  const rate = parseFloat(row.querySelector('.est-part-rate')?.value || 0);
  const amtInput = row.querySelector('.est-part-amount');
  if (amtInput) amtInput.value = (qty * rate).toFixed(2);
  recalcEstimationTotals();
};

// 11. Recalculate Estimation Totals (uses dynamic rows)
function recalcEstimationTotals() {
  // Sum labour rows
  let totalLabour = 0;
  document.querySelectorAll('#estimation-labour-container .est-labour-amt').forEach(el => {
    totalLabour += parseFloat(el.value || 0);
  });

  // Sum parts rows
  let totalParts = 0;
  document.querySelectorAll('#estimation-parts-container .est-part-amount').forEach(el => {
    totalParts += parseFloat(el.value || 0);
  });

  const accessories = parseFloat(document.getElementById('estimation-accessories')?.value || 0);
  const other = parseFloat(document.getElementById('estimation-other-charges')?.value || 0);
  const discount = parseFloat(document.getElementById('estimation-discount')?.value || 0);
  const taxRate = parseFloat(document.getElementById('estimation-tax-rate')?.value || 18);

  const subtotal = Math.max(0, (totalLabour + totalParts + accessories + other) - discount);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  // Update row totals labels
  const elLabourTotal = document.getElementById('est-calc-labour-total');
  const elPartsTotal = document.getElementById('est-calc-parts-total');
  if (elLabourTotal) elLabourTotal.textContent = formatCurrency(totalLabour);
  if (elPartsTotal) elPartsTotal.textContent = formatCurrency(totalParts);

  // Update summary
  const elSubtotal = document.getElementById('estimation-calc-subtotal');
  const elGstAmt = document.getElementById('estimation-calc-gst-amt');
  const elGrand = document.getElementById('estimation-calc-grand-total');

  if (elSubtotal) elSubtotal.textContent = formatCurrency(subtotal);
  if (elGstAmt) elGstAmt.textContent = formatCurrency(taxAmount);
  if (elGrand) elGrand.textContent = formatCurrency(grandTotal);
}


// 12. Recalculate Service Invoice Totals
function recalcServiceInvoiceTotals() {
  const labour = parseFloat(document.getElementById('svc-inv-labour-amt')?.value || 0);
  const parts = parseFloat(document.getElementById('svc-inv-parts-amt')?.value || 0);
  const discount = parseFloat(document.getElementById('svc-inv-discount')?.value || 0);
  const gstRate = parseFloat(document.getElementById('svc-inv-gst-rate')?.value || 18);
  const paid = parseFloat(document.getElementById('svc-inv-paid-amt')?.value || 0);

  const taxable = Math.max(0, (labour + parts) - discount);
  const gst = (taxable * gstRate) / 100;
  const grandTotal = taxable + gst;
  const balance = Math.max(0, grandTotal - paid);

  const elTaxable = document.getElementById('svc-inv-calc-taxable');
  const elGst = document.getElementById('svc-inv-calc-gst');
  const elGrand = document.getElementById('svc-inv-calc-grand-total');
  const elBalance = document.getElementById('svc-inv-balance-amt');

  if (elTaxable) elTaxable.textContent = formatCurrency(taxable);
  if (elGst) elGst.textContent = formatCurrency(gst);
  if (elGrand) elGrand.textContent = formatCurrency(grandTotal);
  if (elBalance) elBalance.value = balance.toFixed(2);
}

function requireServiceElement(id) {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error('Required Service form element not found: #' + id);
  }
  return el;
}

// 13. Open Job Card Modal (New or Edit)
window.openJobCardModal = function(jobCardId = null, fromEstimationObj = null) {
  const modal = requireServiceElement('jobcard-modal');
  const form = requireServiceElement('jobcard-form');
  requireServiceElement('jobcard-customer-name');
  requireServiceElement('jobcard-customer-mobile');
  requireServiceElement('jobcard-customer-address');
  requireServiceElement('jobcard-number');
  requireServiceElement('jobcard-date');
  requireServiceElement('jobcard-status');
  requireServiceElement('jobcard-labour-container');
  requireServiceElement('jobcard-parts-container');

  form.reset();

  const labourContainer = document.getElementById('jobcard-labour-container');
  const partsContainer = document.getElementById('jobcard-parts-container');
  labourContainer.innerHTML = '';
  partsContainer.innerHTML = '';

  populateServiceCustomerSuggestions();

  if (jobCardId) {
    // Edit existing Job Card
    const jc = (state.serviceJobCards || []).find(j => j.id === jobCardId);
    if (!jc) return;

    document.getElementById('jobcard-modal-title').textContent = `Edit Service Job Card - ${jc.id}`;
    document.getElementById('jobcard-edit-id').value = jc.id;
    document.getElementById('jobcard-from-estimation-id').value = '';
    document.getElementById('jobcard-number').value = jc.id;
    document.getElementById('jobcard-date').value = jc.date || getTodayDateString();
    document.getElementById('jobcard-delivery-date').value = jc.deliveryDate || getTodayDateString();
    document.getElementById('jobcard-status').value = jc.status || 'Open';
    document.getElementById('jobcard-customer-name').value = jc.customerName || '';
    document.getElementById('jobcard-customer-mobile').value = jc.customerMobile || '';
    document.getElementById('jobcard-customer-address').value = jc.customerAddress || '';
    document.getElementById('jobcard-device-type').value = jc.deviceType || 'Laptop';
    document.getElementById('jobcard-device-brand').value = jc.deviceBrand || '';
    document.getElementById('jobcard-device-model').value = jc.deviceModel || '';
    document.getElementById('jobcard-device-serial').value = jc.deviceSerial || '';
    document.getElementById('jobcard-complaint').value = jc.complaint || '';
    document.getElementById('jobcard-technician').value = jc.technician || '';
    document.getElementById('jobcard-tech-remarks').value = jc.techRemarks || '';
    document.getElementById('jobcard-discount').value = jc.discount || 0;
    document.getElementById('jobcard-tax-rate').value = jc.taxRate !== undefined ? jc.taxRate : 18;

    // Populate Labour items
    if (jc.labourItems && jc.labourItems.length > 0) {
      jc.labourItems.forEach(l => addJobCardLabourRow(l.description, l.amount));
    } else {
      addJobCardLabourRow();
    }

    // Populate Parts items
    if (jc.partsItems && jc.partsItems.length > 0) {
      jc.partsItems.forEach(p => addJobCardPartRow(p.itemCode, p.partName, p.qty, p.rate));
    }

  } else if (fromEstimationObj) {
    // Convert from Estimation
    document.getElementById('jobcard-modal-title').textContent = `New Job Card (From Estimation ${fromEstimationObj.id})`;
    document.getElementById('jobcard-edit-id').value = '';
    document.getElementById('jobcard-from-estimation-id').value = fromEstimationObj.id;
    document.getElementById('jobcard-number').value = generateJobCardNumber();
    document.getElementById('jobcard-date').value = getTodayDateString();
    document.getElementById('jobcard-delivery-date').value = getTodayDateString();
    document.getElementById('jobcard-status').value = 'Open';
    document.getElementById('jobcard-customer-name').value = fromEstimationObj.customerName || '';
    document.getElementById('jobcard-customer-mobile').value = fromEstimationObj.customerMobile || '';
    document.getElementById('jobcard-customer-address').value = fromEstimationObj.customerAddress || '';
    document.getElementById('jobcard-device-type').value = fromEstimationObj.deviceType || 'Laptop';
    document.getElementById('jobcard-device-brand').value = fromEstimationObj.deviceBrand || '';
    document.getElementById('jobcard-device-model').value = fromEstimationObj.deviceModel || '';
    document.getElementById('jobcard-device-serial').value = fromEstimationObj.deviceSerial || '';
    document.getElementById('jobcard-complaint').value = fromEstimationObj.complaint || '';
    document.getElementById('jobcard-technician').value = 'Senior Hardware Engineer';
    document.getElementById('jobcard-tech-remarks').value = fromEstimationObj.notes || '';
    document.getElementById('jobcard-discount').value = fromEstimationObj.discount || 0;
    document.getElementById('jobcard-tax-rate').value = fromEstimationObj.taxRate !== undefined ? fromEstimationObj.taxRate : 18;

    // Transfer labour items from estimation
    if (fromEstimationObj.labourItems && fromEstimationObj.labourItems.length > 0) {
      fromEstimationObj.labourItems.forEach(l => addJobCardLabourRow(l.description, l.amount));
    } else if (fromEstimationObj.labourAmount > 0) {
      addJobCardLabourRow('Approved Estimation Labour & Repair Service', fromEstimationObj.labourAmount);
    } else {
      addJobCardLabourRow();
    }

    // Transfer parts items from estimation
    if (fromEstimationObj.partsItems && fromEstimationObj.partsItems.length > 0) {
      fromEstimationObj.partsItems.forEach(p => addJobCardPartRow(p.itemCode, p.partName, p.qty, p.rate));
    } else if (fromEstimationObj.partsAmount > 0) {
      addJobCardPartRow('', 'Approved Estimation Spare Parts', 1, fromEstimationObj.partsAmount);
    }


  } else {
    // New Job Card from Scratch
    document.getElementById('jobcard-modal-title').textContent = 'New Service Job Card';
    document.getElementById('jobcard-edit-id').value = '';
    document.getElementById('jobcard-from-estimation-id').value = '';
    document.getElementById('jobcard-number').value = generateJobCardNumber();
    document.getElementById('jobcard-date').value = getTodayDateString();
    document.getElementById('jobcard-delivery-date').value = getTodayDateString();
    document.getElementById('jobcard-status').value = 'Open';
    document.getElementById('jobcard-customer-name').value = '';
    document.getElementById('jobcard-customer-mobile').value = '';
    document.getElementById('jobcard-customer-address').value = '';
    document.getElementById('jobcard-discount').value = 0;
    document.getElementById('jobcard-tax-rate').value = 18;

    addJobCardLabourRow('General Diagnostic & Hardware Servicing', 500);
  }

  recalcJobCardTotals();

  // Show "Close Job Card" button only when editing an active (non-closed) job card
  const closeDirectBtn = document.getElementById('close-jobcard-direct-btn');
  if (closeDirectBtn) {
    if (jobCardId) {
      const jc = (state.serviceJobCards || []).find(j => j.id === jobCardId);
      const activeStatuses = ['Open', 'Under Service', 'Ready', 'Delivered'];
      closeDirectBtn.style.display = (jc && activeStatuses.includes(jc.status)) ? 'inline-flex' : 'none';
      closeDirectBtn.setAttribute('data-jcid', jobCardId);
    } else {
      closeDirectBtn.style.display = 'none';
      closeDirectBtn.removeAttribute('data-jcid');
    }
  }

  modal.classList.add('active');
};

// Close Job Card directly from modal footer button
window.handleDirectCloseFromModal = function() {
  const closeDirectBtn = document.getElementById('close-jobcard-direct-btn');
  const jobCardId = closeDirectBtn ? closeDirectBtn.getAttribute('data-jcid') : null;
  if (!jobCardId) {
    alert('No Job Card ID found. Please save the Job Card first, then close it.');
    return;
  }
  closeJobCardDirectly(jobCardId);
};

window.closeJobCardDirectly = function(jobCardId) {
  const jc = (state.serviceJobCards || []).find(j => j.id === jobCardId);
  if (!jc) return;

  if (confirm(`Close Job Card ${jc.id} for "${jc.customerName}"?\n\nThis will mark the job as CLOSED. You can still view it in Service History.`)) {
    jc.status = 'Closed';
    jc.closedDate = getTodayDateString();
    saveToStorage(STORAGE_KEYS.SERVICE_JOB_CARDS, state.serviceJobCards);
    addActivity('service', `Job Card #${jc.id} CLOSED for ${jc.customerName} (${jc.deviceBrand} ${jc.deviceModel})`);

    // Close the modal
    document.getElementById('jobcard-modal').classList.remove('active');
    renderServiceModule();
    renderDashboard();
    alert(`✅ Job Card ${jc.id} has been successfully Closed.`);
  }
};

// 14. Handle Job Card Save & Stock Deduction
function handleJobCardSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('jobcard-edit-id').value;
  const fromEstId = document.getElementById('jobcard-from-estimation-id').value;
  const jcNumber = editId || generateJobCardNumber();
  const date = document.getElementById('jobcard-date').value;
  const deliveryDate = document.getElementById('jobcard-delivery-date').value;
  const status = document.getElementById('jobcard-status').value;
  const customerName = document.getElementById('jobcard-customer-name').value.trim();
  const customerMobile = document.getElementById('jobcard-customer-mobile').value.trim();
  const customerAddress = document.getElementById('jobcard-customer-address').value.trim();
  const deviceType = document.getElementById('jobcard-device-type').value;
  const deviceBrand = document.getElementById('jobcard-device-brand').value.trim();
  const deviceModel = document.getElementById('jobcard-device-model').value.trim();
  const deviceSerial = document.getElementById('jobcard-device-serial').value.trim();
  const complaint = document.getElementById('jobcard-complaint').value.trim();
  const technician = document.getElementById('jobcard-technician').value.trim();
  const techRemarks = document.getElementById('jobcard-tech-remarks').value.trim();
  const discount = parseFloat(document.getElementById('jobcard-discount').value || 0);
  const taxRate = parseFloat(document.getElementById('jobcard-tax-rate').value || 18);

  // Collect Labour items
  const labourItems = [];
  let totalLabour = 0;
  document.querySelectorAll('#jobcard-labour-container .service-repeater-row').forEach(row => {
    const desc = row.querySelector('.jc-labour-desc')?.value.trim();
    const amt = parseFloat(row.querySelector('.jc-labour-amt')?.value || 0);
    if (desc && amt >= 0) {
      labourItems.push({ description: desc, amount: amt });
      totalLabour += amt;
    }
  });

  // Collect Parts items
  const partsItems = [];
  let totalParts = 0;
  const stockValidationFailed = [];

  // Previous parts if editing
  const existingJC = editId ? (state.serviceJobCards || []).find(j => j.id === editId) : null;
  const prevPartsMap = {};
  if (existingJC && existingJC.partsItems) {
    existingJC.partsItems.forEach(p => {
      if (p.itemCode) prevPartsMap[p.itemCode] = (prevPartsMap[p.itemCode] || 0) + parseFloat(p.qty || 0);
    });
  }

  document.querySelectorAll('#jobcard-parts-container .service-repeater-row').forEach(row => {
    const select = row.querySelector('.jc-part-select');
    const customName = row.querySelector('.jc-part-custom-name')?.value.trim();
    const itemCode = select?.value || '';
    const partName = customName || (select?.options[select.selectedIndex]?.getAttribute('data-name')) || itemCode;
    const qty = parseFloat(row.querySelector('.jc-part-qty')?.value || 0);
    const rate = parseFloat(row.querySelector('.jc-part-rate')?.value || 0);
    const amount = qty * rate;

    if (partName && qty > 0) {
      // If linked to inventory item, check stock
      if (itemCode) {
        const item = state.inventory.find(i => i.itemCode === itemCode);
        if (item) {
          const avail = calculateAvailableStock(item);
          const previouslyUsed = prevPartsMap[itemCode] || 0;
          const netRequired = qty - previouslyUsed;
          if (netRequired > avail) {
            stockValidationFailed.push(`• ${item.itemName} (Available: ${avail}, Net Required: ${netRequired})`);
          }
        }
      }
      partsItems.push({ itemCode, partName, qty, rate, amount });
      totalParts += amount;
    }
  });

  if (stockValidationFailed.length > 0) {
    alert(`❌ Cannot save Job Card due to insufficient stock for the following spare parts:\n\n${stockValidationFailed.join('\n')}\n\nPlease reduce quantity or add stock through the Purchase module.`);
    return;
  }

  // Calculate Grand Totals
  const subtotal = Math.max(0, totalLabour + totalParts - discount);
  const taxAmount = (subtotal * taxRate) / 100;
  const grandTotal = subtotal + taxAmount;

  // --- REVERSE PREVIOUS STOCK USAGE (IF EDITING) ---
  if (existingJC && existingJC.partsItems) {
    existingJC.partsItems.forEach(p => {
      if (p.itemCode && p.qty > 0) {
        recordStockMovement({
          itemCode: p.itemCode,
          itemName: p.partName,
          type: 'SERVICE_REVERSAL',
          refNo: jcNumber,
          inQty: p.qty,
          remarks: `Job Card ${jcNumber} updated/recalculated - previous stock restored`
        });
      }
    });
  }

  // --- DEDUCT CURRENT SPARE PARTS FROM STOCK ---
  partsItems.forEach(p => {
    if (p.itemCode && p.qty > 0) {
      recordStockMovement({
        itemCode: p.itemCode,
        itemName: p.partName,
        type: 'SERVICE_CONSUME',
        refNo: jcNumber,
        outQty: p.qty,
        unitCost: p.rate,
        remarks: `Consumed in Laptop/PC Service Job Card: ${jcNumber} (${customerName} - ${deviceBrand} ${deviceModel})`
      });
    }
  });

  // Construct Job Card Object
  const jobCardObj = {
    id: jcNumber,
    date,
    deliveryDate,
    status,
    customerName,
    customerMobile,
    customerAddress,
    deviceType,
    deviceBrand,
    deviceModel,
    deviceSerial,
    complaint,
    technician,
    techRemarks,
    labourItems,
    partsItems,
    totalLabour,
    totalParts,
    subtotal,
    discount,
    taxRate,
    taxAmount,
    grandTotal,
    invoiceId: existingJC ? existingJC.invoiceId : null
  };

  if (editId) {
    const idx = state.serviceJobCards.findIndex(j => j.id === editId);
    if (idx !== -1) state.serviceJobCards[idx] = jobCardObj;
    addActivity('service', `Updated Service Job Card #${jcNumber} for ${customerName} (${deviceBrand} ${deviceModel})`);
  } else {
    state.serviceJobCards.unshift(jobCardObj);
    addActivity('service', `Created new Service Job Card #${jcNumber} for ${customerName} (${deviceBrand} ${deviceModel})`);

    // If converted from estimation, mark estimation approved
    if (fromEstId) {
      const est = (state.serviceEstimations || []).find(e => e.id === fromEstId);
      if (est) {
        est.status = 'Approved';
        est.convertedJobCardId = jcNumber;
        saveToStorage(STORAGE_KEYS.SERVICE_ESTIMATIONS, state.serviceEstimations);
      }
    }
  }

  saveToStorage(STORAGE_KEYS.SERVICE_JOB_CARDS, state.serviceJobCards);

  // Close modal and re-render
  document.getElementById('jobcard-modal').classList.remove('active');
  renderServiceModule();
  renderInventoryTable();
  renderDashboard();

  alert(`✅ Service Job Card #${jcNumber} saved successfully!\nInventory spare parts stock automatically updated.`);
}

// 15. Convert Estimation to Job Card
window.convertEstimationToJobCard = function(estId) {
  const est = (state.serviceEstimations || []).find(e => e.id === estId);
  if (!est) return;

  if (confirm(`Convert Estimation ${est.id} into an Active Service Job Card for "${est.customerName}"?`)) {
    openJobCardModal(null, est);
  }
};

// 16. Quick Update Status for Job Card
window.updateJobCardStatus = function(jobCardId, newStatus) {
  const jc = (state.serviceJobCards || []).find(j => j.id === jobCardId);
  if (!jc) return;

  const oldStatus = jc.status;
  jc.status = newStatus;
  saveToStorage(STORAGE_KEYS.SERVICE_JOB_CARDS, state.serviceJobCards);

  addActivity('service', `Job Card #${jc.id} status changed from "${oldStatus}" to "${newStatus}"`);
  renderServiceModule();
  renderDashboard();
};

// 17. Delete Job Card (with stock reversal)
window.deleteJobCard = function(jobCardId) {
  const jc = (state.serviceJobCards || []).find(j => j.id === jobCardId);
  if (!jc) return;

  if (confirm(`Are you sure you want to delete Service Job Card ${jc.id}?\n\n⚠️ Any spare parts consumed from stock will be automatically returned to inventory.`)) {
    // Reverse spare parts stock
    if (jc.partsItems && jc.partsItems.length > 0) {
      jc.partsItems.forEach(p => {
        if (p.itemCode && p.qty > 0) {
          recordStockMovement({
            itemCode: p.itemCode,
            itemName: p.partName,
            type: 'SERVICE_REVERSAL',
            refNo: jc.id,
            inQty: p.qty,
            remarks: `Job Card ${jc.id} deleted - stock reversed to inventory`
          });
        }
      });
    }

    state.serviceJobCards = state.serviceJobCards.filter(j => j.id !== jobCardId);
    saveToStorage(STORAGE_KEYS.SERVICE_JOB_CARDS, state.serviceJobCards);

    addActivity('service', `Deleted Service Job Card #${jc.id}`);
    renderServiceModule();
    renderInventoryTable();
    renderDashboard();
  }
};

// 18. Estimation Modal & Submissions
window.openEstimationModal = function(estId = null) {
  const modal = requireServiceElement('estimation-modal');
  const form = requireServiceElement('estimation-form');
  requireServiceElement('estimation-customer-name');
  requireServiceElement('estimation-customer-mobile');
  requireServiceElement('estimation-customer-address');
  requireServiceElement('estimation-number');
  requireServiceElement('estimation-date');
  requireServiceElement('estimation-status');
  requireServiceElement('estimation-labour-container');
  requireServiceElement('estimation-parts-container');

  form.reset();

  // Clear dynamic row containers
  const labourContainer = document.getElementById('estimation-labour-container');
  const partsContainer = document.getElementById('estimation-parts-container');
  labourContainer.innerHTML = '';
  partsContainer.innerHTML = '';

  populateServiceCustomerSuggestions();

  if (estId) {
    const est = (state.serviceEstimations || []).find(e => e.id === estId);
    if (!est) return;

    document.getElementById('estimation-modal-title').textContent = `Edit Estimation - ${est.id}`;
    document.getElementById('estimation-edit-id').value = est.id;
    document.getElementById('estimation-number').value = est.id;
    document.getElementById('estimation-date').value = est.date || getTodayDateString();
    document.getElementById('estimation-status').value = est.status || 'Draft';
    document.getElementById('estimation-customer-name').value = est.customerName || '';
    document.getElementById('estimation-customer-mobile').value = est.customerMobile || '';
    document.getElementById('estimation-customer-address').value = est.customerAddress || '';
    document.getElementById('estimation-device-type').value = est.deviceType || 'Laptop';
    document.getElementById('estimation-device-brand').value = est.deviceBrand || '';
    document.getElementById('estimation-device-model').value = est.deviceModel || '';
    document.getElementById('estimation-device-serial').value = est.deviceSerial || '';
    document.getElementById('estimation-complaint').value = est.complaint || '';
    document.getElementById('estimation-accessories').value = est.accessoriesAmount || 0;
    document.getElementById('estimation-other-charges').value = est.otherCharges || 0;
    document.getElementById('estimation-discount').value = est.discount || 0;
    document.getElementById('estimation-tax-rate').value = est.taxRate !== undefined ? est.taxRate : 18;
    document.getElementById('estimation-notes').value = est.notes || '';

    // Populate dynamic labour rows
    if (est.labourItems && est.labourItems.length > 0) {
      est.labourItems.forEach(l => addEstimationLabourRow(l.description, l.amount));
    } else if (est.labourAmount > 0) {
      // Legacy: single amount
      addEstimationLabourRow('Repair & Service Labour', est.labourAmount);
    } else {
      addEstimationLabourRow();
    }

    // Populate dynamic parts rows
    if (est.partsItems && est.partsItems.length > 0) {
      est.partsItems.forEach(p => addEstimationPartRow(p.itemCode, p.partName, p.qty, p.rate));
    } else if (est.partsAmount > 0) {
      // Legacy: single amount
      addEstimationPartRow('', 'Spare Parts & Components', 1, est.partsAmount);
    }

  } else {
    document.getElementById('estimation-modal-title').textContent = 'New Repair & Service Estimation';
    document.getElementById('estimation-edit-id').value = '';
    document.getElementById('estimation-number').value = generateEstimationNumber();
    document.getElementById('estimation-date').value = getTodayDateString();
    document.getElementById('estimation-status').value = 'Draft';
    document.getElementById('estimation-customer-name').value = '';
    document.getElementById('estimation-customer-mobile').value = '';
    document.getElementById('estimation-customer-address').value = '';
    document.getElementById('estimation-accessories').value = 0;
    document.getElementById('estimation-other-charges').value = 0;
    document.getElementById('estimation-discount').value = 0;
    document.getElementById('estimation-tax-rate').value = 18;

    // Start with one default labour row
    addEstimationLabourRow('General Diagnostic & Service Labour', 500);
  }

  recalcEstimationTotals();
  modal.classList.add('active');
};

function handleEstimationSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('estimation-edit-id').value;
  const estNumber = editId || generateEstimationNumber();
  const date = document.getElementById('estimation-date').value;
  const status = document.getElementById('estimation-status').value;
  const customerName = document.getElementById('estimation-customer-name').value.trim();
  const customerMobile = document.getElementById('estimation-customer-mobile').value.trim();
  const customerAddress = document.getElementById('estimation-customer-address').value.trim();
  const deviceType = document.getElementById('estimation-device-type').value;
  const deviceBrand = document.getElementById('estimation-device-brand').value.trim();
  const deviceModel = document.getElementById('estimation-device-model').value.trim();
  const deviceSerial = document.getElementById('estimation-device-serial').value.trim();
  const complaint = document.getElementById('estimation-complaint').value.trim();
  const accessoriesAmount = parseFloat(document.getElementById('estimation-accessories').value || 0);
  const otherCharges = parseFloat(document.getElementById('estimation-other-charges').value || 0);
  const discount = parseFloat(document.getElementById('estimation-discount').value || 0);
  const taxRate = parseFloat(document.getElementById('estimation-tax-rate').value || 18);
  const notes = document.getElementById('estimation-notes').value.trim();

  // Collect labour rows
  const labourItems = [];
  let labourAmount = 0;
  document.querySelectorAll('#estimation-labour-container .est-labour-row').forEach(row => {
    const desc = row.querySelector('.est-labour-desc')?.value.trim();
    const amt = parseFloat(row.querySelector('.est-labour-amt')?.value || 0);
    if (desc) {
      labourItems.push({ description: desc, amount: amt });
      labourAmount += amt;
    }
  });

  // Collect parts rows
  const partsItems = [];
  let partsAmount = 0;
  document.querySelectorAll('#estimation-parts-container .est-part-row').forEach(row => {
    const select = row.querySelector('.est-part-select');
    const customName = row.querySelector('.est-part-custom-name')?.value.trim();
    const itemCode = select?.value || '';
    const partName = customName || (select?.options[select.selectedIndex]?.getAttribute('data-name')) || '';
    const qty = parseFloat(row.querySelector('.est-part-qty')?.value || 0);
    const rate = parseFloat(row.querySelector('.est-part-rate')?.value || 0);
    const amount = parseFloat(row.querySelector('.est-part-amount')?.value || qty * rate);
    if (partName && qty > 0) {
      partsItems.push({ itemCode, partName, qty, rate, amount });
      partsAmount += amount;
    }
  });

  const subtotal = Math.max(0, (labourAmount + partsAmount + accessoriesAmount + otherCharges) - discount);
  const taxAmount = (subtotal * taxRate) / 100;
  const totalAmount = subtotal + taxAmount;

  const estObj = {
    id: estNumber,
    date,
    status,
    customerName,
    customerMobile,
    customerAddress,
    deviceType,
    deviceBrand,
    deviceModel,
    deviceSerial,
    complaint,
    labourItems,
    labourAmount,
    partsItems,
    partsAmount,
    accessoriesAmount,
    otherCharges,
    subtotal,
    discount,
    taxRate,
    taxAmount,
    totalAmount,
    notes,
    convertedJobCardId: null
  };

  if (editId) {
    const idx = state.serviceEstimations.findIndex(e => e.id === editId);
    if (idx !== -1) {
      estObj.convertedJobCardId = state.serviceEstimations[idx].convertedJobCardId;
      estObj.status = state.serviceEstimations[idx].status === 'Approved' ? 'Approved' : status;
      state.serviceEstimations[idx] = estObj;
    }
    addActivity('service', `Updated Service Estimation #${estNumber} for ${customerName}`);
  } else {
    state.serviceEstimations.unshift(estObj);
    addActivity('service', `Created new Service Estimation #${estNumber} for ${customerName}`);
  }

  saveToStorage(STORAGE_KEYS.SERVICE_ESTIMATIONS, state.serviceEstimations);

  document.getElementById('estimation-modal').classList.remove('active');
  renderEstimationsTable();
  alert(`✅ Service Estimation #${estNumber} saved successfully!`);
}


window.deleteEstimation = function(estId) {
  if (confirm(`Are you sure you want to delete Estimation ${estId}?`)) {
    state.serviceEstimations = state.serviceEstimations.filter(e => e.id !== estId);
    saveToStorage(STORAGE_KEYS.SERVICE_ESTIMATIONS, state.serviceEstimations);
    renderEstimationsTable();
  }
};

// 19. Service Invoice Modal & Handlers
window.openServiceInvoiceModal = function(invId = null, jobCardId = null) {
  const modal = document.getElementById('svc-invoice-modal');
  if (!modal) return;

  const form = document.getElementById('svc-invoice-form');
  if (form) form.reset();

  // Populate Job Cards Select dropdown
  const jcSelect = document.getElementById('svc-inv-jobcard-select');
  if (jcSelect) {
    jcSelect.innerHTML = '<option value="">-- Direct Service Billing / Select Job Card --</option>' +
      (state.serviceJobCards || []).map(jc => `
        <option value="${jc.id}" ${jc.id === jobCardId ? 'selected' : ''}>
          ${jc.id} - ${jc.customerName} (${jc.deviceBrand} ${jc.deviceModel}) - ${formatCurrency(jc.grandTotal)}
        </option>
      `).join('');
  }

  if (invId) {
    const inv = (state.serviceInvoices || []).find(i => i.id === invId || i.invoiceNo === invId);
    if (!inv) return;

    document.getElementById('svc-invoice-modal-title').textContent = `Edit Service Invoice - ${inv.invoiceNo}`;
    document.getElementById('svc-inv-edit-id').value = inv.id || inv.invoiceNo;
    document.getElementById('svc-inv-jobcard-id').value = inv.jobCardId || '';
    document.getElementById('svc-inv-number').value = inv.invoiceNo;
    document.getElementById('svc-inv-date').value = inv.date || getTodayDateString();
    if (jcSelect) jcSelect.value = inv.jobCardId || '';
    document.getElementById('svc-inv-cust-name').value = inv.customerName || '';
    document.getElementById('svc-inv-cust-mobile').value = inv.customerMobile || '';
    document.getElementById('svc-inv-cust-address').value = inv.customerAddress || '';
    document.getElementById('svc-inv-device-type').value = inv.deviceType || 'Laptop';
    document.getElementById('svc-inv-device-brand').value = inv.deviceBrand || '';
    document.getElementById('svc-inv-device-model').value = inv.deviceModel || '';
    document.getElementById('svc-inv-device-serial').value = inv.deviceSerial || '';
    document.getElementById('svc-inv-labour-amt').value = inv.labourAmount || 0;
    document.getElementById('svc-inv-parts-amt').value = inv.partsAmount || 0;
    document.getElementById('svc-inv-discount').value = inv.discount || 0;
    document.getElementById('svc-inv-gst-rate').value = inv.gstRate !== undefined ? inv.gstRate : 18;
    document.getElementById('svc-inv-payment-status').value = inv.paymentStatus || 'Paid';
    document.getElementById('svc-inv-payment-method').value = inv.paymentMethod || 'UPI';
    document.getElementById('svc-inv-paid-amt').value = inv.paidAmount !== undefined ? inv.paidAmount : inv.grandTotal;

  } else if (jobCardId) {
    const jc = (state.serviceJobCards || []).find(j => j.id === jobCardId);
    if (!jc) return;

    document.getElementById('svc-invoice-modal-title').textContent = `Generate Service Invoice for Job Card #${jc.id}`;
    document.getElementById('svc-inv-edit-id').value = '';
    document.getElementById('svc-inv-jobcard-id').value = jc.id;
    document.getElementById('svc-inv-number').value = generateServiceInvoiceNumber();
    document.getElementById('svc-inv-date').value = getTodayDateString();
    if (jcSelect) jcSelect.value = jc.id;
    document.getElementById('svc-inv-cust-name').value = jc.customerName || '';
    document.getElementById('svc-inv-cust-mobile').value = jc.customerMobile || '';
    document.getElementById('svc-inv-cust-address').value = jc.customerAddress || '';
    document.getElementById('svc-inv-device-type').value = jc.deviceType || 'Laptop';
    document.getElementById('svc-inv-device-brand').value = jc.deviceBrand || '';
    document.getElementById('svc-inv-device-model').value = jc.deviceModel || '';
    document.getElementById('svc-inv-device-serial').value = jc.deviceSerial || '';
    document.getElementById('svc-inv-labour-amt').value = jc.totalLabour || 0;
    document.getElementById('svc-inv-parts-amt').value = jc.totalParts || 0;
    document.getElementById('svc-inv-discount').value = jc.discount || 0;
    document.getElementById('svc-inv-gst-rate').value = jc.taxRate !== undefined ? jc.taxRate : 18;
    document.getElementById('svc-inv-payment-status').value = 'Paid';
    document.getElementById('svc-inv-payment-method').value = 'UPI';
    document.getElementById('svc-inv-paid-amt').value = jc.grandTotal || 0;

  } else {
    document.getElementById('svc-invoice-modal-title').textContent = 'Generate Service Invoice';
    document.getElementById('svc-inv-edit-id').value = '';
    document.getElementById('svc-inv-jobcard-id').value = '';
    document.getElementById('svc-inv-number').value = generateServiceInvoiceNumber();
    document.getElementById('svc-inv-date').value = getTodayDateString();
    document.getElementById('svc-inv-labour-amt').value = 500;
    document.getElementById('svc-inv-parts-amt').value = 0;
    document.getElementById('svc-inv-discount').value = 0;
    document.getElementById('svc-inv-gst-rate').value = 18;
    document.getElementById('svc-inv-payment-status').value = 'Paid';
    document.getElementById('svc-inv-payment-method').value = 'UPI';
    document.getElementById('svc-inv-paid-amt').value = 0;
  }

  recalcServiceInvoiceTotals();
  modal.classList.add('active');
};

function handleServiceInvoiceJobCardSelection(e) {
  const jcId = e.target.value;
  if (!jcId) return;

  const jc = (state.serviceJobCards || []).find(j => j.id === jcId);
  if (jc) {
    document.getElementById('svc-inv-jobcard-id').value = jc.id;
    document.getElementById('svc-inv-cust-name').value = jc.customerName || '';
    document.getElementById('svc-inv-cust-mobile').value = jc.customerMobile || '';
    document.getElementById('svc-inv-cust-address').value = jc.customerAddress || '';
    document.getElementById('svc-inv-device-type').value = jc.deviceType || 'Laptop';
    document.getElementById('svc-inv-device-brand').value = jc.deviceBrand || '';
    document.getElementById('svc-inv-device-model').value = jc.deviceModel || '';
    document.getElementById('svc-inv-device-serial').value = jc.deviceSerial || '';
    document.getElementById('svc-inv-labour-amt').value = jc.totalLabour || 0;
    document.getElementById('svc-inv-parts-amt').value = jc.totalParts || 0;
    document.getElementById('svc-inv-discount').value = jc.discount || 0;
    document.getElementById('svc-inv-gst-rate').value = jc.taxRate !== undefined ? jc.taxRate : 18;
    document.getElementById('svc-inv-paid-amt').value = jc.grandTotal || 0;
    recalcServiceInvoiceTotals();
  }
}

function handleServiceInvoiceSubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('svc-inv-edit-id').value;
  const jobCardId = document.getElementById('svc-inv-jobcard-id').value || document.getElementById('svc-inv-jobcard-select').value;
  const invNumber = editId || generateServiceInvoiceNumber();
  const date = document.getElementById('svc-inv-date').value;
  const customerName = document.getElementById('svc-inv-cust-name').value.trim();
  const customerMobile = document.getElementById('svc-inv-cust-mobile').value.trim();
  const customerAddress = document.getElementById('svc-inv-cust-address').value.trim();
  const deviceType = document.getElementById('svc-inv-device-type').value.trim();
  const deviceBrand = document.getElementById('svc-inv-device-brand').value.trim();
  const deviceModel = document.getElementById('svc-inv-device-model').value.trim();
  const deviceSerial = document.getElementById('svc-inv-device-serial').value.trim();
  const labourAmount = parseFloat(document.getElementById('svc-inv-labour-amt').value || 0);
  const partsAmount = parseFloat(document.getElementById('svc-inv-parts-amt').value || 0);
  const discount = parseFloat(document.getElementById('svc-inv-discount').value || 0);
  const gstRate = parseFloat(document.getElementById('svc-inv-gst-rate').value || 18);
  const paymentStatus = document.getElementById('svc-inv-payment-status').value;
  const paymentMethod = document.getElementById('svc-inv-payment-method').value;
  const paidAmount = parseFloat(document.getElementById('svc-inv-paid-amt').value || 0);

  const taxable = Math.max(0, (labourAmount + partsAmount) - discount);
  const gstAmount = (taxable * gstRate) / 100;
  const grandTotal = taxable + gstAmount;
  const balanceAmount = Math.max(0, grandTotal - paidAmount);

  // Collect itemized list from linked job card or generic
  let items = [];
  const linkedJC = jobCardId ? (state.serviceJobCards || []).find(j => j.id === jobCardId) : null;
  if (linkedJC) {
    (linkedJC.labourItems || []).forEach(l => {
      items.push({ name: l.description, type: 'Labour', qty: 1, rate: l.amount, amount: l.amount });
    });
    (linkedJC.partsItems || []).forEach(p => {
      items.push({ name: p.partName, type: 'Spare Part', qty: p.qty, rate: p.rate, amount: p.amount });
    });
  } else {
    items.push({ name: 'Laptop / PC Repair & Diagnostics Labour', type: 'Labour', qty: 1, rate: labourAmount, amount: labourAmount });
    if (partsAmount > 0) {
      items.push({ name: 'Replacement Hardware Spare Parts', type: 'Spare Part', qty: 1, rate: partsAmount, amount: partsAmount });
    }
  }

  const invoiceObj = {
    id: invNumber,
    invoiceNo: invNumber,
    jobCardId: jobCardId || null,
    date,
    customerName,
    customerMobile,
    customerAddress,
    deviceType,
    deviceBrand,
    deviceModel,
    deviceSerial,
    labourAmount,
    partsAmount,
    subtotal: taxable,
    discount,
    gstRate,
    gstAmount,
    grandTotal,
    paymentStatus,
    paymentMethod,
    paidAmount,
    balanceAmount,
    items
  };

  if (editId) {
    const idx = state.serviceInvoices.findIndex(i => (i.id === editId || i.invoiceNo === editId));
    if (idx !== -1) state.serviceInvoices[idx] = invoiceObj;
    addActivity('service', `Updated Service Invoice #${invNumber} for ${customerName}`);
  } else {
    state.serviceInvoices.unshift(invoiceObj);
    addActivity('service', `Generated Service Tax Invoice #${invNumber} for ${customerName} (₹${grandTotal.toFixed(2)})`);

    // Link invoice with Job Card if present
    if (linkedJC) {
      linkedJC.invoiceId = invNumber;
      if (linkedJC.status === 'Open' || linkedJC.status === 'Under Service') {
        linkedJC.status = 'Ready';
      }
      saveToStorage(STORAGE_KEYS.SERVICE_JOB_CARDS, state.serviceJobCards);
    }
  }

  saveToStorage(STORAGE_KEYS.SERVICE_INVOICES, state.serviceInvoices);

  document.getElementById('svc-invoice-modal').classList.remove('active');
  renderServiceModule();
  renderDashboard();

  alert(`✅ Service Invoice #${invNumber} generated successfully!`);
}

window.deleteServiceInvoice = function(invId) {
  if (confirm(`Are you sure you want to delete Service Invoice ${invId}?`)) {
    state.serviceInvoices = state.serviceInvoices.filter(i => (i.id !== invId && i.invoiceNo !== invId));
    saveToStorage(STORAGE_KEYS.SERVICE_INVOICES, state.serviceInvoices);
    renderServiceModule();
    renderDashboard();
  }
};

// 20. Print Modals Logic (Job Card, Estimation, Service Invoice)
window.openJobCardPrintModal = function(jobCardId) {
  const jc = (state.serviceJobCards || []).find(j => j.id === jobCardId);
  if (!jc) return;

  document.getElementById('jc-prev-number').textContent = jc.id;
  document.getElementById('jc-prev-date').textContent = formatDate(jc.date);
  document.getElementById('jc-prev-delv').textContent = formatDate(jc.deliveryDate || jc.date);
  document.getElementById('jc-prev-cust-name').textContent = jc.customerName;
  document.getElementById('jc-prev-cust-phone').textContent = `Phone: ${jc.customerMobile}`;
  document.getElementById('jc-prev-cust-address').textContent = jc.customerAddress ? `Address: ${jc.customerAddress}` : 'Address: --';
  document.getElementById('jc-prev-device-model').textContent = `${jc.deviceBrand} ${jc.deviceModel}`;
  document.getElementById('jc-prev-device-type').textContent = `Device Type: ${jc.deviceType}`;
  document.getElementById('jc-prev-device-serial').textContent = `Serial / Tag: ${jc.deviceSerial || '--'}`;
  document.getElementById('jc-prev-status-badge').textContent = jc.status;
  document.getElementById('jc-prev-complaint').textContent = jc.complaint;
  document.getElementById('jc-prev-technician').textContent = jc.technician || 'Hardware Engineer';
  document.getElementById('jc-prev-remarks').textContent = jc.techRemarks || 'Standard Diagnostics & Service Checklist';

  // Table items
  const tbody = document.getElementById('jc-prev-items-tbody');
  if (tbody) {
    let rowsHtml = '';
    (jc.labourItems || []).forEach(l => {
      rowsHtml += `
        <tr>
          <td style="font-weight:600;">${l.description}</td>
          <td><span class="badge badge-category">Labour</span></td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">${formatCurrency(l.amount)}</td>
          <td style="text-align: right; font-weight:600;">${formatCurrency(l.amount)}</td>
        </tr>
      `;
    });

    (jc.partsItems || []).forEach(p => {
      rowsHtml += `
        <tr>
          <td style="font-weight:600;">
            ${p.partName}
            ${p.itemCode ? `<div style="font-size:0.75rem; color:#64748b; font-family:monospace;">${p.itemCode}</div>` : ''}
          </td>
          <td><span class="badge badge-paid">Spare Part</span></td>
          <td style="text-align: center;">${p.qty || 1}</td>
          <td style="text-align: right;">${formatCurrency(p.rate)}</td>
          <td style="text-align: right; font-weight:600;">${formatCurrency(p.amount)}</td>
        </tr>
      `;
    });

    if (!rowsHtml) {
      rowsHtml = `<tr><td colspan="5" style="text-align:center; color:#64748b;">General Inspection & Diagnostic Service</td></tr>`;
    }

    tbody.innerHTML = rowsHtml;
  }

  document.getElementById('jc-prev-total-labour').textContent = formatCurrency(jc.totalLabour);
  document.getElementById('jc-prev-total-parts').textContent = formatCurrency(jc.totalParts);
  document.getElementById('jc-prev-discount').textContent = formatCurrency(jc.discount || 0);
  document.getElementById('jc-prev-tax-rate').textContent = `${jc.taxRate !== undefined ? jc.taxRate : 18}%`;
  document.getElementById('jc-prev-tax-amt').textContent = formatCurrency(jc.taxAmount);
  document.getElementById('jc-prev-grand-total').textContent = formatCurrency(jc.grandTotal);

  document.getElementById('jobcard-view-modal').classList.add('active');
};

window.openEstimationPrintModal = function(estId) {
  const est = (state.serviceEstimations || []).find(e => e.id === estId);
  if (!est) return;

  document.getElementById('est-prev-number').textContent = est.id;
  document.getElementById('est-prev-date').textContent = formatDate(est.date);
  document.getElementById('est-prev-cust-name').textContent = est.customerName;
  document.getElementById('est-prev-cust-phone').textContent = `Phone: ${est.customerMobile}`;
  document.getElementById('est-prev-cust-address').textContent = est.customerAddress ? `Address: ${est.customerAddress}` : 'Address: --';
  document.getElementById('est-prev-device-model').textContent = `${est.deviceBrand} ${est.deviceModel}`;
  document.getElementById('est-prev-device-type').textContent = `Device Type: ${est.deviceType}`;
  document.getElementById('est-prev-device-serial').textContent = `Serial / Tag: ${est.deviceSerial || '--'}`;
  document.getElementById('est-prev-complaint').textContent = est.complaint;

  document.getElementById('est-prev-labour').textContent = formatCurrency(est.labourAmount);
  document.getElementById('est-prev-parts').textContent = formatCurrency(est.partsAmount);
  document.getElementById('est-prev-accessories').textContent = formatCurrency(est.accessoriesAmount);
  document.getElementById('est-prev-other').textContent = formatCurrency(est.otherCharges);
  document.getElementById('est-prev-subtotal').textContent = formatCurrency(est.subtotal);
  document.getElementById('est-prev-discount').textContent = formatCurrency(est.discount);
  document.getElementById('est-prev-tax-rate').textContent = `${est.taxRate !== undefined ? est.taxRate : 18}%`;
  document.getElementById('est-prev-tax-amt').textContent = formatCurrency(est.taxAmount);
  document.getElementById('est-prev-grand-total').textContent = formatCurrency(est.totalAmount);

  document.getElementById('estimation-view-modal').classList.add('active');
};

window.openServiceInvoicePrintModal = function(invId) {
  const inv = (state.serviceInvoices || []).find(i => i.id === invId || i.invoiceNo === invId);
  if (!inv) return;

  document.getElementById('sinv-prev-number').textContent = inv.invoiceNo;
  document.getElementById('sinv-prev-date').textContent = formatDate(inv.date);
  document.getElementById('sinv-prev-jc-ref').textContent = inv.jobCardId || 'DIRECT-SERVICE';
  document.getElementById('sinv-prev-cust-name').textContent = inv.customerName;
  document.getElementById('sinv-prev-cust-phone').textContent = `Phone: ${inv.customerMobile}`;
  document.getElementById('sinv-prev-cust-address').textContent = inv.customerAddress ? `Address: ${inv.customerAddress}` : 'Address: --';
  document.getElementById('sinv-prev-device-info').textContent = `${inv.deviceBrand} ${inv.deviceModel} (${inv.deviceType}) ${inv.deviceSerial ? `[SN: ${inv.deviceSerial}]` : ''}`;

  const tbody = document.getElementById('sinv-prev-items-tbody');
  if (tbody) {
    if (inv.items && inv.items.length > 0) {
      tbody.innerHTML = inv.items.map(it => `
        <tr>
          <td style="font-weight:600;">
            ${it.name}
            <span class="badge ${it.type === 'Labour' ? 'badge-category' : 'badge-paid'}" style="margin-left: 0.5rem; font-size:0.7rem;">${it.type}</span>
          </td>
          <td style="text-align: center;">${it.qty || 1}</td>
          <td style="text-align: right;">${formatCurrency(it.rate)}</td>
          <td style="text-align: right; font-weight:600;">${formatCurrency(it.amount)}</td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = `
        <tr>
          <td style="font-weight:600;">Laptop / PC Service & Labour Charges</td>
          <td style="text-align: center;">1</td>
          <td style="text-align: right;">${formatCurrency(inv.labourAmount)}</td>
          <td style="text-align: right; font-weight:600;">${formatCurrency(inv.labourAmount)}</td>
        </tr>
        ${inv.partsAmount > 0 ? `
          <tr>
            <td style="font-weight:600;">Spare Parts & Replacement Components</td>
            <td style="text-align: center;">1</td>
            <td style="text-align: right;">${formatCurrency(inv.partsAmount)}</td>
            <td style="text-align: right; font-weight:600;">${formatCurrency(inv.partsAmount)}</td>
          </tr>
        ` : ''}
      `;
    }
  }

  document.getElementById('sinv-prev-labour').textContent = formatCurrency(inv.labourAmount);
  document.getElementById('sinv-prev-parts').textContent = formatCurrency(inv.partsAmount);
  document.getElementById('sinv-prev-discount').textContent = formatCurrency(inv.discount || 0);
  document.getElementById('sinv-prev-gst-rate').textContent = `${inv.gstRate !== undefined ? inv.gstRate : 18}%`;
  document.getElementById('sinv-prev-gst-amt').textContent = formatCurrency(inv.gstAmount);
  document.getElementById('sinv-prev-grand-total').textContent = formatCurrency(inv.grandTotal);
  document.getElementById('sinv-prev-pay-status').textContent = `${inv.paymentStatus} (${inv.paymentMethod || 'UPI'})`;
  document.getElementById('sinv-prev-paid-amt').textContent = formatCurrency(inv.paidAmount);
  document.getElementById('sinv-prev-balance-amt').textContent = formatCurrency(inv.balanceAmount);

  document.getElementById('svc-invoice-view-modal').classList.add('active');
};

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

  // 14. SERVICE JOB CARDS REPORT
  } else if (moduleVal === 'ServiceJobCards') {
    tableHeadersHtml = `
      <tr>
        <th>Job Card #</th>
        <th>Date</th>
        <th>Customer Name</th>
        <th>Mobile</th>
        <th>Device</th>
        <th>Serial #</th>
        <th>Technician</th>
        <th>Status</th>
        <th>Total Amount</th>
      </tr>
    `;
    const data = (state.serviceJobCards || []).filter(j => {
      const matchSearch = j.id.toLowerCase().includes(searchVal) ||
        j.customerName.toLowerCase().includes(searchVal) ||
        j.customerMobile.includes(searchVal) ||
        (j.deviceSerial || '').toLowerCase().includes(searchVal);
      return matchSearch && isWithinDateRange(j.date);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="9" class="no-data-msg">No service job cards found.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${item.id}</td>
          <td>${formatDate(item.date)}</td>
          <td style="font-weight:600;">${item.customerName}</td>
          <td>${item.customerMobile}</td>
          <td>${item.deviceBrand} ${item.deviceModel}</td>
          <td style="font-family: monospace;">${item.deviceSerial || '--'}</td>
          <td>${item.technician}</td>
          <td><span class="badge ${item.status === 'Open' ? 'badge-open' : item.status === 'Ready' ? 'badge-ready' : item.status === 'Closed' ? 'badge-closed' : 'badge-under-service'}">${item.status}</span></td>
          <td style="font-weight:700; color: var(--primary);">${formatCurrency(item.grandTotal)}</td>
        </tr>
      `).join('');
    }

  // 15. SERVICE INVOICES REPORT
  } else if (moduleVal === 'ServiceInvoices') {
    tableHeadersHtml = `
      <tr>
        <th>Invoice #</th>
        <th>Date</th>
        <th>Job Card #</th>
        <th>Customer Name</th>
        <th>Device</th>
        <th>Labour (₹)</th>
        <th>Parts (₹)</th>
        <th>GST (₹)</th>
        <th>Grand Total (₹)</th>
        <th>Payment Status</th>
      </tr>
    `;
    const data = (state.serviceInvoices || []).filter(i => {
      const matchSearch = i.invoiceNo.toLowerCase().includes(searchVal) ||
        (i.jobCardId || '').toLowerCase().includes(searchVal) ||
        i.customerName.toLowerCase().includes(searchVal);
      return matchSearch && isWithinDateRange(i.date);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="10" class="no-data-msg">No service invoices found.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${item.invoiceNo}</td>
          <td>${formatDate(item.date)}</td>
          <td style="font-family: monospace;">${item.jobCardId || '--'}</td>
          <td style="font-weight:600;">${item.customerName}</td>
          <td>${item.deviceBrand} ${item.deviceModel}</td>
          <td>${formatCurrency(item.labourAmount)}</td>
          <td>${formatCurrency(item.partsAmount)}</td>
          <td>${formatCurrency(item.gstAmount)}</td>
          <td style="font-weight:700; color: var(--primary);">${formatCurrency(item.grandTotal)}</td>
          <td><span class="badge ${item.paymentStatus === 'Paid' ? 'badge-paid' : item.paymentStatus === 'Partially Paid' ? 'badge-partial' : 'badge-pending'}">${item.paymentStatus}</span></td>
        </tr>
      `).join('');
    }

  // 16. SERVICE PARTS REPORT
  } else if (moduleVal === 'ServiceParts') {
    tableHeadersHtml = `
      <tr>
        <th>Job Card #</th>
        <th>Date</th>
        <th>Part Code</th>
        <th>Part Description</th>
        <th style="text-align: center;">Qty Consumed</th>
        <th>Unit Rate</th>
        <th>Total Amount</th>
      </tr>
    `;
    const rows = [];
    (state.serviceJobCards || []).filter(j => isWithinDateRange(j.date)).forEach(j => {
      (j.partsItems || []).forEach(p => {
        if (!searchVal || (p.partName || '').toLowerCase().includes(searchVal) || (p.itemCode || '').toLowerCase().includes(searchVal) || j.id.toLowerCase().includes(searchVal)) {
          rows.push({ jcId: j.id, date: j.date, itemCode: p.itemCode, partName: p.partName, qty: p.qty, rate: p.rate, amount: p.amount });
        }
      });
    });

    if (rows.length === 0) {
      tableRowsHtml = `<tr><td colspan="7" class="no-data-msg">No spare parts consumption recorded in this period.</td></tr>`;
    } else {
      tableRowsHtml = rows.map(r => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${r.jcId}</td>
          <td>${formatDate(r.date)}</td>
          <td style="font-family: monospace;">${r.itemCode || '--'}</td>
          <td style="font-weight:600;">${r.partName}</td>
          <td style="text-align: center; font-weight:700; color: var(--danger-dark);">${r.qty}</td>
          <td>${formatCurrency(r.rate)}</td>
          <td style="font-weight:700; color: var(--primary);">${formatCurrency(r.amount)}</td>
        </tr>
      `).join('');
    }

  // 17. SERVICE ESTIMATIONS REPORT
  } else if (moduleVal === 'ServiceEstimations') {
    tableHeadersHtml = `
      <tr>
        <th>Estimate #</th>
        <th>Date</th>
        <th>Customer Name</th>
        <th>Device</th>
        <th>Labour (₹)</th>
        <th>Parts (₹)</th>
        <th>Total Estimate (₹)</th>
        <th>Status</th>
      </tr>
    `;
    const data = (state.serviceEstimations || []).filter(e => {
      const matchSearch = e.id.toLowerCase().includes(searchVal) ||
        e.customerName.toLowerCase().includes(searchVal) ||
        (e.deviceBrand || '').toLowerCase().includes(searchVal);
      return matchSearch && isWithinDateRange(e.date);
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="8" class="no-data-msg">No estimations found.</td></tr>`;
    } else {
      tableRowsHtml = data.map(item => `
        <tr>
          <td style="font-family: monospace; font-weight:700;">${item.id}</td>
          <td>${formatDate(item.date)}</td>
          <td style="font-weight:600;">${item.customerName}</td>
          <td>${item.deviceBrand} ${item.deviceModel}</td>
          <td>${formatCurrency(item.labourAmount)}</td>
          <td>${formatCurrency(parseFloat(item.partsAmount || 0) + parseFloat(item.accessoriesAmount || 0))}</td>
          <td style="font-weight:700; color: var(--primary);">${formatCurrency(item.totalAmount)}</td>
          <td><span class="badge ${item.status === 'Approved' ? 'badge-approved' : item.status === 'Rejected' ? 'badge-rejected' : 'badge-draft'}">${item.status}</span></td>
        </tr>
      `).join('');
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

  // 14. Service Job Cards
  } else if (moduleVal === 'ServiceJobCards') {
    const list = (state.serviceJobCards || []).filter(j => isWithinDateRange(j.date));
    if (list.length === 0) return alert("No service job cards to export!");
    csvContent += "Job Card No,Date,Expected Delivery,Customer Name,Customer Mobile,Customer Address,Device Type,Brand,Model,Serial No,Customer Complaint,Assigned Technician,Technician Remarks,Labour Amount (INR),Parts Amount (INR),Subtotal (INR),Discount (INR),Tax Rate (%),Tax Amount (INR),Grand Total (INR),Status,Linked Invoice No\n";
    list.forEach(j => {
      csvContent += `${escapeCSV(j.id)},${escapeCSV(j.date)},${escapeCSV(j.deliveryDate || j.date)},${escapeCSV(j.customerName)},${escapeCSV(j.customerMobile)},${escapeCSV(j.customerAddress || "")},${escapeCSV(j.deviceType)},${escapeCSV(j.deviceBrand)},${escapeCSV(j.deviceModel)},${escapeCSV(j.deviceSerial || "")},${escapeCSV(j.complaint)},${escapeCSV(j.technician)},${escapeCSV(j.techRemarks || "")},${escapeCSV(j.totalLabour)},${escapeCSV(j.totalParts)},${escapeCSV(j.subtotal)},${escapeCSV(j.discount)},${escapeCSV(j.taxRate)},${escapeCSV(j.taxAmount)},${escapeCSV(j.grandTotal)},${escapeCSV(j.status)},${escapeCSV(j.invoiceId || "")}\n`;
    });

  // 15. Service Invoices
  } else if (moduleVal === 'ServiceInvoices') {
    const list = (state.serviceInvoices || []).filter(i => isWithinDateRange(i.date));
    if (list.length === 0) return alert("No service invoices to export!");
    csvContent += "Invoice No,Date,Job Card Ref,Customer Name,Customer Mobile,Customer Address,Device Details,Labour Charges (INR),Parts Charges (INR),Taxable Subtotal (INR),Discount (INR),GST Rate (%),GST Amount (INR),Grand Total (INR),Payment Status,Payment Method,Paid Amount (INR),Balance Due (INR)\n";
    list.forEach(i => {
      csvContent += `${escapeCSV(i.invoiceNo)},${escapeCSV(i.date)},${escapeCSV(i.jobCardId || "")},${escapeCSV(i.customerName)},${escapeCSV(i.customerMobile)},${escapeCSV(i.customerAddress || "")},${escapeCSV(i.deviceBrand + " " + i.deviceModel)},${escapeCSV(i.labourAmount)},${escapeCSV(i.partsAmount)},${escapeCSV(i.subtotal)},${escapeCSV(i.discount)},${escapeCSV(i.gstRate)},${escapeCSV(i.gstAmount)},${escapeCSV(i.grandTotal)},${escapeCSV(i.paymentStatus)},${escapeCSV(i.paymentMethod || "")},${escapeCSV(i.paidAmount)},${escapeCSV(i.balanceAmount)}\n`;
    });

  // 16. Service Parts Consumption
  } else if (moduleVal === 'ServiceParts') {
    const rows = [];
    (state.serviceJobCards || []).filter(j => isWithinDateRange(j.date)).forEach(j => {
      (j.partsItems || []).forEach(p => {
        rows.push({ jcId: j.id, date: j.date, cust: j.customerName, device: `${j.deviceBrand} ${j.deviceModel}`, itemCode: p.itemCode, partName: p.partName, qty: p.qty, rate: p.rate, amount: p.amount });
      });
    });
    if (rows.length === 0) return alert("No service parts consumed to export!");
    csvContent += "Job Card No,Date,Customer Name,Device,Part Code,Part Description,Quantity Used,Unit Rate (INR),Total Amount (INR)\n";
    rows.forEach(r => {
      csvContent += `${escapeCSV(r.jcId)},${escapeCSV(r.date)},${escapeCSV(r.cust)},${escapeCSV(r.device)},${escapeCSV(r.itemCode || "")},${escapeCSV(r.partName)},${escapeCSV(r.qty)},${escapeCSV(r.rate)},${escapeCSV(r.amount)}\n`;
    });

  // 17. Service Estimations
  } else if (moduleVal === 'ServiceEstimations') {
    const list = (state.serviceEstimations || []).filter(e => isWithinDateRange(e.date));
    if (list.length === 0) return alert("No service estimations to export!");
    csvContent += "Estimate No,Date,Customer Name,Customer Mobile,Device Type,Brand,Model,Serial No,Customer Complaint,Labour Amount (INR),Parts Amount (INR),Accessories (INR),Other Charges (INR),Subtotal (INR),Discount (INR),Tax (INR),Grand Total (INR),Status,Notes\n";
    list.forEach(e => {
      csvContent += `${escapeCSV(e.id)},${escapeCSV(e.date)},${escapeCSV(e.customerName)},${escapeCSV(e.customerMobile)},${escapeCSV(e.deviceType)},${escapeCSV(e.deviceBrand)},${escapeCSV(e.deviceModel)},${escapeCSV(e.deviceSerial || "")},${escapeCSV(e.complaint)},${escapeCSV(e.labourAmount)},${escapeCSV(e.partsAmount)},${escapeCSV(e.accessoriesAmount || 0)},${escapeCSV(e.otherCharges || 0)},${escapeCSV(e.subtotal)},${escapeCSV(e.discount)},${escapeCSV(e.taxAmount)},${escapeCSV(e.totalAmount)},${escapeCSV(e.status)},${escapeCSV(e.notes || "")}\n`;
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
