// BIOS Application State Management
let state = {
  enquiries: [],
  bookings: [],
  billings: [],
  activities: []
};

// LocalStorage Keys
const STORAGE_KEYS = {
  ENQUIRIES: 'bios_enquiries',
  BOOKINGS: 'bios_bookings',
  BILLINGS: 'bios_billings',
  ACTIVITIES: 'bios_activities'
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  setupNavigation();
  setupMobileMenu();
  setupEventListeners();
  updateCurrentDateIndicator();
  
  // Initial page rendering
  renderDashboard();
  renderEnquiriesTable();
  renderBookingsTable();
  renderBillingsTable();
  renderReports();
});

// Load data from LocalStorage
function loadFromStorage() {
  try {
    state.enquiries = JSON.parse(localStorage.getItem(STORAGE_KEYS.ENQUIRIES)) || [];
    state.bookings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS)) || [];
    state.billings = JSON.parse(localStorage.getItem(STORAGE_KEYS.BILLINGS)) || [];
    state.activities = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) || [];
  } catch (e) {
    console.error('Error loading data from LocalStorage:', e);
    // Fallbacks
    state.enquiries = [];
    state.bookings = [];
    state.billings = [];
    state.activities = [];
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

// Add Activity Log
function addActivity(type, description) {
  const newActivity = {
    id: 'ACT-' + Date.now(),
    type: type, // 'enquiry', 'booking', 'billing'
    description: description,
    timestamp: new Date().toISOString()
  };
  state.activities.unshift(newActivity);
  // Keep only last 20 activities
  if (state.activities.length > 20) {
    state.activities.pop();
  }
  saveToStorage(STORAGE_KEYS.ACTIVITIES, state.activities);
  renderDashboard();
}

// Format Currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

// Format Date for table display (e.g. DD-MMM-YYYY)
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

// Get ISO Date for inputs (YYYY-MM-DD)
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

// --- NAVIGATION & ROUTING ---
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

      // Trigger context re-renders if required
      if (targetSectionId === 'dashboard') {
        renderDashboard();
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

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // --- Modals Toggle Listeners ---
  setupModalToggle('open-add-enquiry-btn', 'close-enquiry-modal-btn', 'cancel-enquiry-btn', 'enquiry-modal');
  setupModalToggle('open-add-booking-btn', 'close-booking-modal-btn', 'cancel-booking-btn', 'booking-modal');
  setupModalToggle('open-new-invoice-btn', 'close-billing-form-btn', 'cancel-billing-btn-el', 'billing-modal-form');
  setupModalToggle(null, 'close-invoice-preview-btn', 'close-invoice-modal-btn', 'invoice-modal');

  // Backdrop overlay click close all modals
  const overlays = document.querySelectorAll('.modal-overlay');
  overlays.forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
      }
    });
  });

  // --- Enquiry Event Handlers ---
  const enquiryForm = document.getElementById('enquiry-form');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', handleEnquirySubmit);
  }
  
  // Enquiry Search & Filters
  const enquirySearch = document.getElementById('enquiry-search');
  const enquiryFilterStatus = document.getElementById('enquiry-filter-status');
  const enquiryFilterSource = document.getElementById('enquiry-filter-source');

  if (enquirySearch) enquirySearch.addEventListener('input', renderEnquiriesTable);
  if (enquiryFilterStatus) enquiryFilterStatus.addEventListener('change', renderEnquiriesTable);
  if (enquiryFilterSource) enquiryFilterSource.addEventListener('change', renderEnquiriesTable);

  // Set default date when opening add modal
  const openEnquiryBtn = document.getElementById('open-add-enquiry-btn');
  if (openEnquiryBtn) {
    openEnquiryBtn.addEventListener('click', () => {
      document.getElementById('enquiry-modal-title').textContent = "Add Enquiry";
      document.getElementById('enquiry-edit-id').value = "";
      document.getElementById('enquiry-form').reset();
      document.getElementById('enquiry-date').value = getTodayDateString();
    });
  }

  // --- Booking Event Handlers ---
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  // Booking Search & Filters
  const bookingSearch = document.getElementById('booking-search');
  const bookingFilterPayment = document.getElementById('booking-filter-payment');

  if (bookingSearch) bookingSearch.addEventListener('input', renderBookingsTable);
  if (bookingFilterPayment) bookingFilterPayment.addEventListener('change', renderBookingsTable);

  // Set default date on booking add
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

  // --- Billing Event Handlers ---
  const openBillingBtn = document.getElementById('open-new-invoice-btn');
  if (openBillingBtn) {
    openBillingBtn.addEventListener('click', () => {
      document.getElementById('billing-form-el').reset();
      document.getElementById('billing-date').value = getTodayDateString();
      // Generate Next Invoice Number
      document.getElementById('billing-invoice-no').value = generateInvoiceNumber();
      // Reset calculations
      document.getElementById('billing-calc-gst').textContent = formatCurrency(0);
      document.getElementById('billing-calc-total').textContent = formatCurrency(0);
      // Populate confirmed bookings dropdown
      populateBillingBookingDropdown();
    });
  }

  const billingBookingSelect = document.getElementById('billing-booking-select');
  if (billingBookingSelect) {
    billingBookingSelect.addEventListener('change', handleBillingBookingSelection);
  }

  const billingAmountInput = document.getElementById('billing-amount');
  if (billingAmountInput) {
    billingAmountInput.addEventListener('input', handleBillingAmountChange);
  }

  const billingFormEl = document.getElementById('billing-form-el');
  if (billingFormEl) {
    billingFormEl.addEventListener('submit', handleBillingSubmit);
  }

  const printInvoiceBtn = document.getElementById('print-invoice-btn');
  if (printInvoiceBtn) {
    printInvoiceBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- Reports Event Handlers ---
  const reportModule = document.getElementById('report-filter-module');
  const reportFromDate = document.getElementById('report-from-date');
  const reportToDate = document.getElementById('report-to-date');
  const reportResetBtn = document.getElementById('reset-report-filters-btn');
  const reportExportBtn = document.getElementById('export-excel-btn');

  if (reportModule) reportModule.addEventListener('change', renderReports);
  if (reportFromDate) reportFromDate.addEventListener('change', renderReports);
  if (reportToDate) reportToDate.addEventListener('change', renderReports);
  
  if (reportResetBtn) {
    reportResetBtn.addEventListener('click', () => {
      if (reportFromDate) reportFromDate.value = '';
      if (reportToDate) reportToDate.value = '';
      renderReports();
    });
  }

  if (reportExportBtn) {
    reportExportBtn.addEventListener('click', handleReportExport);
  }
}

// Helper to handle Modal Opening/Closing
function setupModalToggle(openBtnId, closeBtnId, cancelBtnId, modalId) {
  const modal = document.getElementById(modalId);
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


// --- DASHBOARD CONTROLLER ---
function renderDashboard() {
  // 1. Calculate Metrics
  const totalEnquiriesCount = state.enquiries.length;
  const totalBookingsCount = state.bookings.length;
  
  const totalBillingAmount = state.billings.reduce((sum, item) => sum + parseFloat(item.totalAmount || 0), 0);

  // Update DOM metrics
  document.getElementById('dash-total-enquiries').textContent = totalEnquiriesCount;
  document.getElementById('dash-total-bookings').textContent = totalBookingsCount;
  document.getElementById('dash-total-billing').textContent = formatCurrency(totalBillingAmount);

  // 2. Status Breakdown Gauges
  const counts = { New: 0, 'Follow Up': 0, Booking: 0, Cancelled: 0 };
  state.enquiries.forEach(e => {
    if (counts[e.status] !== undefined) {
      counts[e.status]++;
    }
  });

  // Calculate percentages
  const getPercent = (count) => totalEnquiriesCount > 0 ? (count / totalEnquiriesCount) * 100 : 0;

  // New
  document.getElementById('breakdown-new-count').textContent = counts.New;
  document.getElementById('breakdown-new-bar').style.width = `${getPercent(counts.New)}%`;
  
  // Follow Up
  document.getElementById('breakdown-followup-count').textContent = counts['Follow Up'];
  document.getElementById('breakdown-followup-bar').style.width = `${getPercent(counts['Follow Up'])}%`;
  
  // Booking
  document.getElementById('breakdown-booking-count').textContent = counts.Booking;
  document.getElementById('breakdown-booking-bar').style.width = `${getPercent(counts.Booking)}%`;
  
  // Cancelled
  document.getElementById('breakdown-cancelled-count').textContent = counts.Cancelled;
  document.getElementById('breakdown-cancelled-bar').style.width = `${getPercent(counts.Cancelled)}%`;

  // 3. Activity Feed List
  const activityList = document.getElementById('dashboard-activity-list');
  if (state.activities.length === 0) {
    activityList.innerHTML = `
      <div class="no-data-msg" style="padding: 1.5rem !important;">
        No activities recorded yet. Start by managing enquiries or bookings!
      </div>
    `;
  } else {
    activityList.innerHTML = state.activities.slice(0, 5).map(act => {
      let iconSvg = '';
      if (act.type === 'enquiry') {
        iconSvg = `<svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
      } else if (act.type === 'booking') {
        iconSvg = `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
      } else if (act.type === 'billing') {
        iconSvg = `<svg viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;
      }

      // Time difference formatting
      const diffMs = Date.now() - new Date(act.timestamp).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      let timeText = 'Just now';
      if (diffMins > 0 && diffMins < 60) {
        timeText = `${diffMins}m ago`;
      } else if (diffMins >= 60) {
        const diffHrs = Math.floor(diffMins / 60);
        if (diffHrs < 24) {
          timeText = `${diffHrs}h ago`;
        } else {
          timeText = formatDate(act.timestamp);
        }
      }

      return `
        <div class="activity-item">
          <div class="activity-icon ${act.type}">
            ${iconSvg}
          </div>
          <div class="activity-desc">
            ${act.description}
          </div>
          <div class="activity-time">${timeText}</div>
        </div>
      `;
    }).join('');
  }
}


// --- ENQUIRIES CONTROLLER ---

// Add / Edit submission
function handleEnquirySubmit(e) {
  e.preventDefault();

  const editId = document.getElementById('enquiry-edit-id').value;
  const name = document.getElementById('enquiry-name').value.trim();
  const mobile = document.getElementById('enquiry-mobile').value.trim();
  const date = document.getElementById('enquiry-date').value;
  const source = document.getElementById('enquiry-source').value;
  const status = document.getElementById('enquiry-status').value;

  if (editId) {
    // Edit Action
    const index = state.enquiries.findIndex(item => item.id === editId);
    if (index !== -1) {
      const oldStatus = state.enquiries[index].status;
      state.enquiries[index] = { ...state.enquiries[index], name, mobile, date, source, status };
      saveToStorage(STORAGE_KEYS.ENQUIRIES, state.enquiries);
      
      let logMsg = `Updated Enquiry for <strong>${name}</strong> (Status: ${status})`;
      // Special activity tracking when converting
      if (oldStatus !== 'Booking' && status === 'Booking') {
        logMsg = `Converted Enquiry for <strong>${name}</strong> to Booking status`;
        // Propose creating a Booking
        triggerQuickBookingFromEnquiry(state.enquiries[index]);
      }
      
      addActivity('enquiry', logMsg);
    }
  } else {
    // Add Action
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

    // If status is Booking, trigger quick booking creation
    if (status === 'Booking') {
      triggerQuickBookingFromEnquiry(newEnquiry);
    }
  }

  // Reset & Close Modal
  document.getElementById('enquiry-modal').classList.remove('active');
  renderEnquiriesTable();
  renderDashboard();
}

function renderEnquiriesTable() {
  const tableBody = document.getElementById('enquiry-table-body');
  const searchVal = document.getElementById('enquiry-search').value.toLowerCase().trim();
  const statusVal = document.getElementById('enquiry-filter-status').value;
  const sourceVal = document.getElementById('enquiry-filter-source').value;

  // Filter list
  const filtered = state.enquiries.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchVal) || item.mobile.includes(searchVal);
    const matchesStatus = statusVal === 'All' || item.status === statusVal;
    const matchesSource = sourceVal === 'All' || item.source === sourceVal;
    return matchesSearch && matchesStatus && matchesSource;
  });

  // Sort by date descending
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
    // Status Badge Selector
    let statusClass = 'badge-new';
    if (item.status === 'Follow Up') statusClass = 'badge-followup';
    if (item.status === 'Booking') statusClass = 'badge-booking';
    if (item.status === 'Cancelled') statusClass = 'badge-cancelled';

    // Show conversion action only if not already booking
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

// Edit Enquiry Action
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

// Delete Enquiry Action
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

// Quick Convert to Booking trigger
window.convertEnquiryToBooking = function(id) {
  const item = state.enquiries.find(e => e.id === id);
  if (!item) return;

  // Open Booking Modal pre-filled
  triggerQuickBookingFromEnquiry(item);
};

function triggerQuickBookingFromEnquiry(enquiry) {
  // Update status in state & save
  enquiry.status = 'Booking';
  saveToStorage(STORAGE_KEYS.ENQUIRIES, state.enquiries);
  renderEnquiriesTable();

  // Populate Booking modal fields
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

// Populate Auto-Suggestions in Booking Input
function populateCustomerSuggestions() {
  const datalist = document.getElementById('booking-customer-suggestions');
  if (datalist) {
    // Get unique names from enquiries
    const uniqueNames = [...new Set(state.enquiries.map(e => e.name))];
    datalist.innerHTML = uniqueNames.map(name => `<option value="${name}">`).join('');
  }
}


// --- BOOKINGS CONTROLLER ---

// Add / Edit Booking Submission
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
    // Edit Action
    const index = state.bookings.findIndex(item => item.id === editId);
    if (index !== -1) {
      state.bookings[index] = { ...state.bookings[index], name, mobile, date, amount, payment };
      saveToStorage(STORAGE_KEYS.BOOKINGS, state.bookings);
      addActivity('booking', `Updated booking for <strong>${name}</strong> (Amount: ${formatCurrency(amount)})`);
    }
  } else {
    // Add Action
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
    addActivity('booking', `Confirmed booking for <strong>${name}</strong> using ${payment} (Amount: ${formatCurrency(amount)})`);

    // If this booking was linked to an enquiry, ensure that enquiry status is set to 'Booking'
    if (linkId) {
      const enqIndex = state.enquiries.findIndex(enq => enq.id === linkId);
      if (enqIndex !== -1 && state.enquiries[enqIndex].status !== 'Booking') {
        state.enquiries[enqIndex].status = 'Booking';
        saveToStorage(STORAGE_KEYS.ENQUIRIES, state.enquiries);
        renderEnquiriesTable();
      }
    }
  }

  // Close modal and render tables
  document.getElementById('booking-modal').classList.remove('active');
  renderBookingsTable();
  renderDashboard();
}

function renderBookingsTable() {
  const tableBody = document.getElementById('booking-table-body');
  const searchVal = document.getElementById('booking-search').value.toLowerCase().trim();
  const paymentVal = document.getElementById('booking-filter-payment').value;

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

  tableBody.innerHTML = filtered.map(item => {
    return `
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
    `;
  }).join('');
}

// Edit Booking
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

// Delete Booking
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


// --- BILLING CONTROLLER ---

// Generate Auto Invoice Number: BIOS-YYYY-XXXX (starts from 0001)
function generateInvoiceNumber() {
  const currentYear = new Date().getFullYear();
  const prefix = `BIOS-${currentYear}-`;
  
  // Find largest invoice suffix for the current year
  let maxSeq = 0;
  state.billings.forEach(inv => {
    if (inv.invoiceNo && inv.invoiceNo.startsWith(prefix)) {
      const parts = inv.invoiceNo.split('-');
      if (parts.length === 3) {
        const seq = parseInt(parts[2], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  });

  const nextSeq = String(maxSeq + 1).padStart(4, '0');
  return `${prefix}${nextSeq}`;
}

// Fill Confirmed Bookings in Billing dropdown
function populateBillingBookingDropdown() {
  const select = document.getElementById('billing-booking-select');
  if (!select) return;

  // Filter bookings that have NOT already been invoiced
  const invoicedBookingIds = state.billings.map(b => b.bookingId).filter(Boolean);
  const uninvoicedBookings = state.bookings.filter(b => !invoicedBookingIds.includes(b.id));

  let html = '<option value="">-- Create custom invoice (or select booking) --</option>';
  uninvoicedBookings.forEach(b => {
    html += `<option value="${b.id}">${b.name} (${formatDate(b.date)}) - ${formatCurrency(b.amount)}</option>`;
  });
  select.innerHTML = html;
}

// Autofill fields when booking is chosen in Billing Form
function handleBillingBookingSelection(e) {
  const bookingId = e.target.value;
  if (!bookingId) return;

  const booking = state.bookings.find(b => b.id === bookingId);
  if (!booking) return;

  document.getElementById('billing-customer-name').value = booking.name;
  document.getElementById('billing-customer-mobile').value = booking.mobile || '';
  document.getElementById('billing-product-name').value = `Consultation & Booking Services`;
  document.getElementById('billing-amount').value = booking.amount;

  // Trigger GST calculation
  handleBillingAmountChange();
}

// Live GST and Total calculations
function handleBillingAmountChange() {
  const baseAmount = parseFloat(document.getElementById('billing-amount').value || 0);
  const gstRate = 18; // Fixed 18% GST

  const gstAmount = baseAmount * (gstRate / 100);
  const totalAmount = baseAmount + gstAmount;

  document.getElementById('billing-calc-gst').textContent = formatCurrency(gstAmount);
  document.getElementById('billing-calc-total').textContent = formatCurrency(totalAmount);
}

// Save Invoice
function handleBillingSubmit(e) {
  e.preventDefault();

  const bookingSelect = document.getElementById('billing-booking-select');
  const bookingId = bookingSelect ? bookingSelect.value : null;

  const invoiceNo = document.getElementById('billing-invoice-no').value;
  const invoiceDate = document.getElementById('billing-date').value;
  const customerName = document.getElementById('billing-customer-name').value.trim();
  const customerMobile = document.getElementById('billing-customer-mobile').value.trim();
  const productName = document.getElementById('billing-product-name').value.trim();
  const baseAmount = parseFloat(document.getElementById('billing-amount').value || 0);

  const gstRate = 18;
  const gstAmount = baseAmount * (gstRate / 100);
  const totalAmount = baseAmount + gstAmount;

  const newInvoice = {
    id: 'INV-' + Date.now(),
    invoiceNo,
    date: invoiceDate,
    customerName,
    customerMobile,
    productName,
    baseAmount,
    gstRate,
    gstAmount,
    totalAmount,
    bookingId: bookingId || null
  };

  state.billings.push(newInvoice);
  saveToStorage(STORAGE_KEYS.BILLINGS, state.billings);
  addActivity('billing', `Generated Tax Invoice <strong>${invoiceNo}</strong> for ${customerName} (Total: ${formatCurrency(totalAmount)})`);

  // Close Form Modal
  document.getElementById('billing-modal-form').classList.remove('active');

  // Open Print Preview Modal directly
  openInvoicePreviewModal(newInvoice);

  // Render Table & Dashboard
  renderBillingsTable();
  renderDashboard();
}

function renderBillingsTable() {
  const tableBody = document.getElementById('billing-table-body');
  
  // Sort Invoices by Date / Number descending
  const sorted = [...state.billings].sort((a, b) => b.invoiceNo.localeCompare(a.invoiceNo));

  if (sorted.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="7" class="no-data-msg">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>
          <p>No invoices generated yet.</p>
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = sorted.map(item => {
    return `
      <tr>
        <td style="font-family: monospace; font-weight: 700; color: var(--primary);">${item.invoiceNo}</td>
        <td>
          <span style="font-weight: 600;">${item.customerName}</span>
          ${item.customerMobile ? `<br><small style="color: var(--text-muted);">Mob: ${item.customerMobile}</small>` : ''}
        </td>
        <td>${item.productName}</td>
        <td>${formatCurrency(item.baseAmount)}</td>
        <td>${formatCurrency(item.gstAmount)} <small style="color: var(--text-muted);">(18%)</small></td>
        <td style="font-weight: 700; color: var(--success-dark);">${formatCurrency(item.totalAmount)}</td>
        <td class="actions-cell">
          <button class="btn btn-primary btn-sm" onclick="previewInvoice('${item.id}')">
            ⎙ Print
          </button>
          <button class="btn btn-outline btn-sm btn-danger" onclick="deleteInvoice('${item.id}')">Delete</button>
        </td>
      </tr>
    `;
  }).join('');
}

// Preview Invoice triggering modal
window.previewInvoice = function(id) {
  const item = state.billings.find(i => i.id === id);
  if (!item) return;
  openInvoicePreviewModal(item);
};

// Populate and show Print Preview Modal
function openInvoicePreviewModal(invoice) {
  document.getElementById('inv-preview-no').textContent = invoice.invoiceNo;
  document.getElementById('inv-preview-date').textContent = formatDate(invoice.date);
  document.getElementById('inv-preview-client-name').textContent = invoice.customerName;
  document.getElementById('inv-preview-client-phone').textContent = invoice.customerMobile ? `Phone: +91 ${invoice.customerMobile}` : 'Phone: --';
  document.getElementById('inv-preview-product').textContent = invoice.productName;
  
  document.getElementById('inv-preview-base').textContent = formatCurrency(invoice.baseAmount);
  document.getElementById('inv-preview-subtotal').textContent = formatCurrency(invoice.baseAmount);
  document.getElementById('inv-preview-gst').textContent = formatCurrency(invoice.gstAmount);
  document.getElementById('inv-preview-total').textContent = formatCurrency(invoice.totalAmount);

  // Show Modal
  document.getElementById('invoice-modal').classList.add('active');
}

// Delete Invoice Action
window.deleteInvoice = function(id) {
  const item = state.billings.find(b => b.id === id);
  if (!item) return;

  if (confirm(`Are you sure you want to delete Invoice ${item.invoiceNo}?`)) {
    state.billings = state.billings.filter(b => b.id !== id);
    saveToStorage(STORAGE_KEYS.BILLINGS, state.billings);
    addActivity('billing', `Deleted Invoice <strong>${item.invoiceNo}</strong>`);
    renderBillingsTable();
    renderDashboard();
  }
};


// --- REPORTS CONTROLLER ---

// Render and filter Reports Table view
function renderReports() {
  const moduleVal = document.getElementById('report-filter-module').value;
  const fromDateVal = document.getElementById('report-from-date').value;
  const toDateVal = document.getElementById('report-to-date').value;

  const tableHead = document.getElementById('report-table-head');
  const tableBody = document.getElementById('report-table-body');

  let data = [];
  let tableHeadersHtml = '';
  let tableRowsHtml = '';

  // Get date range filter function
  const isWithinDateRange = (itemDateStr) => {
    if (!itemDateStr) return true;
    const itemDate = new Date(itemDateStr).setHours(0, 0, 0, 0);
    
    if (fromDateVal) {
      const from = new Date(fromDateVal).setHours(0, 0, 0, 0);
      if (itemDate < from) return false;
    }
    if (toDateVal) {
      const to = new Date(toDateVal).setHours(0, 0, 0, 0);
      if (itemDate > to) return false;
    }
    return true;
  };

  if (moduleVal === 'Enquiries') {
    // --- Enquiries Report ---
    tableHeadersHtml = `
      <tr>
        <th>Customer Name</th>
        <th>Mobile Number</th>
        <th>Enquiry Date</th>
        <th>Source</th>
        <th>Status</th>
      </tr>
    `;

    data = state.enquiries.filter(e => isWithinDateRange(e.date));
    // Sort by date desc
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="5" class="no-data-msg">No enquiries found for the selected date range.</td></tr>`;
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

  } else if (moduleVal === 'Bookings') {
    // --- Bookings Report ---
    tableHeadersHtml = `
      <tr>
        <th>Customer Name</th>
        <th>Mobile Number</th>
        <th>Booking Date</th>
        <th>Booking Amount</th>
        <th>Payment Method</th>
      </tr>
    `;

    data = state.bookings.filter(b => isWithinDateRange(b.date));
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="5" class="no-data-msg">No bookings found for the selected date range.</td></tr>`;
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

  } else if (moduleVal === 'Billings') {
    // --- Billings Report ---
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

    data = state.billings.filter(b => isWithinDateRange(b.date));
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (data.length === 0) {
      tableRowsHtml = `<tr><td colspan="7" class="no-data-msg">No billings found for the selected date range.</td></tr>`;
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
  }

  tableHead.innerHTML = tableHeadersHtml;
  tableBody.innerHTML = tableRowsHtml;
  
  // Store filtered records temporarily on the export button for reference when exporting
  document.getElementById('export-excel-btn').setAttribute('data-length', data.length);
}

// Generate CSV data and trigger download
function handleReportExport() {
  const moduleVal = document.getElementById('report-filter-module').value;
  const fromDateVal = document.getElementById('report-from-date').value;
  const toDateVal = document.getElementById('report-to-date').value;

  let csvContent = "";
  let fileName = `BIOS_${moduleVal}_Report`;
  
  if (fromDateVal) fileName += `_from_${fromDateVal}`;
  if (toDateVal) fileName += `_to_${toDateVal}`;
  fileName += ".csv";

  // Re-fetch the same filtered data
  const isWithinDateRange = (itemDateStr) => {
    if (!itemDateStr) return true;
    const itemDate = new Date(itemDateStr).setHours(0, 0, 0, 0);
    
    if (fromDateVal) {
      const from = new Date(fromDateVal).setHours(0, 0, 0, 0);
      if (itemDate < from) return false;
    }
    if (toDateVal) {
      const to = new Date(toDateVal).setHours(0, 0, 0, 0);
      if (itemDate > to) return false;
    }
    return true;
  };

  // Helper to escape commas & quotes in CSV strings
  const escapeCSVField = (val) => {
    if (val === null || val === undefined) return "";
    let str = String(val);
    if (str.includes(",") || str.includes("\"") || str.includes("\n") || str.includes("\r")) {
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    }
    return str;
  };

  if (moduleVal === 'Enquiries') {
    const list = state.enquiries.filter(e => isWithinDateRange(e.date));
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (list.length === 0) {
      alert("No data available to export!");
      return;
    }

    // CSV Headers
    csvContent += "Customer Name,Mobile Number,Enquiry Date,Source,Status\n";
    // CSV Rows
    list.forEach(item => {
      csvContent += `${escapeCSVField(item.name)},${escapeCSVField(item.mobile)},${escapeCSVField(item.date)},${escapeCSVField(item.source)},${escapeCSVField(item.status)}\n`;
    });

  } else if (moduleVal === 'Bookings') {
    const list = state.bookings.filter(b => isWithinDateRange(b.date));
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (list.length === 0) {
      alert("No data available to export!");
      return;
    }

    // CSV Headers
    csvContent += "Customer Name,Mobile Number,Booking Date,Booking Amount (INR),Payment Method\n";
    list.forEach(item => {
      csvContent += `${escapeCSVField(item.name)},${escapeCSVField(item.mobile || "")},${escapeCSVField(item.date)},${escapeCSVField(item.amount)},${escapeCSVField(item.payment)}\n`;
    });

  } else if (moduleVal === 'Billings') {
    const list = state.billings.filter(b => isWithinDateRange(b.date));
    list.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (list.length === 0) {
      alert("No data available to export!");
      return;
    }

    // CSV Headers
    csvContent += "Invoice Number,Invoice Date,Customer Name,Product/Service,Base Amount (INR),GST Rate (%),GST Amount (INR),Grand Total (INR)\n";
    list.forEach(item => {
      csvContent += `${escapeCSVField(item.invoiceNo)},${escapeCSVField(item.date)},${escapeCSVField(item.customerName)},${escapeCSVField(item.productName)},${escapeCSVField(item.baseAmount)},${escapeCSVField(item.gstRate)},${escapeCSVField(item.gstAmount)},${escapeCSVField(item.totalAmount)}\n`;
    });
  }

  // Trigger Client-side download with BOM (\uFEFF) to make Excel parse UTF-8 characters properly
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
