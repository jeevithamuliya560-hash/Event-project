const events = [
    {
        id: 'event-1',
        name: 'Sri Venkateswara Temple Visit',
        location: 'Tirupati, Andhra Pradesh',
        description: 'Morning spiritual darshan and guided temple visit.',
        dates: [
            { date: '2026-08-20', sessions: [{ name: 'Morning Darshan', time: '06:00 AM - 09:00 AM', capacity: 120 }, { name: 'Afternoon Seva', time: '12:00 PM - 02:00 PM', capacity: 80 }] },
            { date: '2026-08-21', sessions: [{ name: 'Morning Darshan', time: '06:00 AM - 09:00 AM', capacity: 100 }, { name: 'Evening Aarti', time: '05:30 PM - 07:00 PM', capacity: 90 }] }
        ]
    },
    {
        id: 'event-2',
        name: 'Navratri Cultural Festival',
        location: 'Bengaluru, Karnataka',
        description: 'Cultural performances, dance and devotional events.',
        dates: [
            { date: '2026-08-23', sessions: [{ name: 'Day Session', time: '10:00 AM - 12:30 PM', capacity: 150 }, { name: 'Evening Session', time: '06:00 PM - 09:00 PM', capacity: 200 }] },
            { date: '2026-08-24', sessions: [{ name: 'Family Session', time: '11:00 AM - 01:00 PM', capacity: 110 }, { name: 'Festival Gala', time: '07:00 PM - 10:00 PM', capacity: 180 }] }
        ]
    },
    {
        id: 'event-3',
        name: 'Meenakshi Amman Temple Visit',
        location: 'Madurai, Tamil Nadu',
        description: 'Temple darshan, evening aarti and cultural presence.',
        dates: [
            { date: '2026-08-26', sessions: [{ name: 'Morning Darshan', time: '05:30 AM - 08:30 AM', capacity: 140 }, { name: 'Evening Aarti', time: '06:00 PM - 08:00 PM', capacity: 130 }] },
            { date: '2026-08-27', sessions: [{ name: 'Special Pooja', time: '08:00 AM - 10:00 AM', capacity: 90 }, { name: 'Night Prayer', time: '07:30 PM - 09:00 PM', capacity: 110 }] }
        ]
    },
    {
        id: 'event-4',
        name: 'Kedarnath Yatra Registration',
        location: 'Uttarakhand',
        description: 'Pilgrim registration and group darshan scheduling.',
        dates: [
            { date: '2026-08-29', sessions: [{ name: 'Group Registration', time: '06:30 AM - 09:30 AM', capacity: 160 }, { name: 'Pilgrim Entry', time: '12:00 PM - 02:00 PM', capacity: 120 }] },
            { date: '2026-08-30', sessions: [{ name: 'Morning Batch', time: '05:00 AM - 08:00 AM', capacity: 170 }, { name: 'Evening Batch', time: '04:00 PM - 06:30 PM', capacity: 125 }] }
        ]
    }
];

const state = {
    selectedEventId: events[0].id,
    selectedBookingId: null,
    bookings: [
        {
            id: 'BK-1001',
            eventId: 'event-1',
            eventName: 'Sri Venkateswara Temple Visit',
            date: '2026-08-20',
            session: 'Morning Darshan',
            visitorName: 'Asha Nair',
            contactInfo: '9876543210',
            guestCount: 2,
            notes: 'Need wheelchair assistance.',
            status: 'Confirmed'
        },
        {
            id: 'BK-1002',
            eventId: 'event-2',
            eventName: 'Navratri Cultural Festival',
            date: '2026-08-23',
            session: 'Evening Session',
            visitorName: 'Rohit Kumar',
            contactInfo: '9988776655',
            guestCount: 3,
            notes: 'Family booking.',
            status: 'Pending'
        }
    ],
    filters: { query: '', status: 'all' }
};

const els = {
    eventList: document.getElementById('eventList'),
    eventSelect: document.getElementById('eventSelect'),
    dateInput: document.getElementById('dateInput'),
    sessionSelect: document.getElementById('sessionSelect'),
    bookingForm: document.getElementById('bookingForm'),
    bookingId: document.getElementById('bookingId'),
    visitorName: document.getElementById('visitorName'),
    contactInfo: document.getElementById('contactInfo'),
    guestCount: document.getElementById('guestCount'),
    notes: document.getElementById('notes'),
    message: document.getElementById('message'),
    bookingList: document.getElementById('bookingList'),
    bookingDetail: document.getElementById('bookingDetail'),
    searchInput: document.getElementById('searchInput'),
    statusFilter: document.getElementById('statusFilter'),
    cancelEdit: document.getElementById('cancelEdit'),
    formTitle: document.getElementById('formTitle')
};

function getSelectedEvent() {
    return events.find(e => e.id === state.selectedEventId) || events[0];
}

function formatDate(date) {
    return new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function showMessage(text, type) {
    els.message.textContent = text;
    els.message.className = `message show ${type}`;
    setTimeout(() => els.message.className = 'message', 2600);
}

function populateEventOptions() {
    els.eventSelect.innerHTML = events.map(event => `<option value="${event.id}">${event.name}</option>`).join('');
    els.eventSelect.value = state.selectedEventId;
}

function populateSessionOptions() {
    const event = getSelectedEvent();
    const sessions = event.dates[0].sessions;
    els.sessionSelect.innerHTML = sessions.map(s => `<option value="${s.name}">${s.name} (${s.time})</option>`).join('');
}

function renderEventList() {
    els.eventList.innerHTML = events.map(event => `
    <div class="event-card">
      <h3>${event.name}</h3>
      <div class="event-meta">
        <div>${event.location}</div>
        <div>${event.description}</div>
      </div>
      <button type="button" data-event-id="${event.id}">Select</button>
    </div>
  `).join('');

    els.eventList.querySelectorAll('button').forEach(btn => {
        btn.onclick = () => {
            state.selectedEventId = btn.dataset.eventId;
            populateEventOptions();
            populateSessionOptions();
        };
    });
}

function validateBooking(data) {
    if (!data.eventId) return 'Please select a temple or event.';
    if (!data.date) return 'Please select a valid visit date.';
    if (!data.session) return 'Please select a session.';
    if (!data.visitorName || data.visitorName.length < 3) return 'Visitor name must have at least 3 characters.';
    if (!/^\d{10}$/.test(data.contactInfo)) return 'Contact number must be 10 digits.';
    if (!data.guestCount || Number(data.guestCount) < 1 || Number(data.guestCount) > 20) return 'Number of visitors must be between 1 and 20.';
    return '';
}

function resetForm() {
    els.bookingForm.reset();
    els.bookingId.value = '';
    els.dateInput.value = '';
    els.formTitle.textContent = 'Book a Visit';
    els.cancelEdit.style.display = 'none';
    els.guestCount.value = 1;
    state.selectedEventId = events[0].id;
    populateEventOptions();
    populateSessionOptions();
}

function collectBooking() {
    return {
        id: els.bookingId.value || `BK-${Date.now()}`,
        eventId: els.eventSelect.value,
        eventName: events.find(e => e.id === els.eventSelect.value)?.name || '',
        date: els.dateInput.value,
        session: els.sessionSelect.value,
        visitorName: els.visitorName.value.trim(),
        contactInfo: els.contactInfo.value.trim(),
        guestCount: Number(els.guestCount.value),
        notes: els.notes.value.trim(),
        status: els.bookingId.value ? state.bookings.find(b => b.id === els.bookingId.value)?.status || 'Pending' : 'Confirmed'
    };
}

function renderBookings() {
    let list = [...state.bookings];
    const q = state.filters.query.toLowerCase();
    const status = state.filters.status;

    list = list.filter(b => {
        const text = `${b.eventName} ${b.visitorName} ${b.contactInfo} ${b.session}`.toLowerCase();
        const okQuery = !q || text.includes(q);
        const okStatus = status === 'all' || b.status === status;
        return okQuery && okStatus;
    });

    if (!list.length) {
        els.bookingList.innerHTML = '<div class="booking-card"><h3>No bookings found</h3></div>';
        return;
    }

    els.bookingList.innerHTML = list.map(booking => `
    <div class="booking-card ${booking.id === state.selectedBookingId ? 'selected' : ''}">
      <div class="booking-top">
        <span class="booking-id">${booking.id}</span>
        <span class="status ${booking.status}">${booking.status}</span>
      </div>
      <h3>${booking.eventName}</h3>
      <div class="booking-meta">
        <span>${booking.visitorName}</span>
        <span>${formatDate(booking.date)}</span>
        <span>${booking.session}</span>
      </div>
      <div class="booking-actions">
        <button class="small-btn" type="button" data-action="view" data-id="${booking.id}">View</button>
        <button class="small-btn" type="button" data-action="edit" data-id="${booking.id}">Edit</button>
        <button class="small-btn delete" type="button" data-action="delete" data-id="${booking.id}">Delete</button>
      </div>
    </div>
  `).join('');
}

function renderDetail() {
    const booking = state.bookings.find(b => b.id === state.selectedBookingId);
    if (!booking) {
        els.bookingDetail.className = 'detail-box empty';
        els.bookingDetail.textContent = 'Select a booking to view details.';
        return;
    }

    els.bookingDetail.className = 'detail-box';
    els.bookingDetail.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item"><span class="detail-label">Booking ID</span><span class="detail-value">${booking.id}</span></div>
      <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value">${booking.status}</span></div>
      <div class="detail-item"><span class="detail-label">Visitor</span><span class="detail-value">${booking.visitorName}</span></div>
      <div class="detail-item"><span class="detail-label">Contact</span><span class="detail-value">${booking.contactInfo}</span></div>
      <div class="detail-item"><span class="detail-label">Event</span><span class="detail-value">${booking.eventName}</span></div>
      <div class="detail-item"><span class="detail-label">Date</span><span class="detail-value">${formatDate(booking.date)}</span></div>
      <div class="detail-item"><span class="detail-label">Session</span><span class="detail-value">${booking.session}</span></div>
      <div class="detail-item"><span class="detail-label">Visitors</span><span class="detail-value">${booking.guestCount}</span></div>
      <div class="detail-item" style="grid-column: 1 / -1;"><span class="detail-label">Notes</span><span class="detail-value">${booking.notes || 'No additional notes.'}</span></div>
    </div>
  `;
}

function saveBooking(event) {
    event.preventDefault();
    const booking = collectBooking();
    const error = validateBooking(booking);
    if (error) {
        showMessage(error, 'error');
        return;
    }

    const index = state.bookings.findIndex(b => b.id === booking.id);
    if (index >= 0) {
        state.bookings[index] = booking;
        showMessage('Booking updated successfully.', 'success');
    } else {
        state.bookings.unshift(booking);
        showMessage('Booking submitted successfully.', 'success');
    }

    state.selectedBookingId = booking.id;
    renderBookings();
    renderDetail();
    resetForm();
}

function handleBookingActions(event) {
    const btn = event.target.closest('[data-action]');
    if (!btn) return;

    const id = btn.dataset.id;
    const booking = state.bookings.find(b => b.id === id);
    if (!booking) return;

    const action = btn.dataset.action;
    if (action === 'view') {
        state.selectedBookingId = id;
        renderBookings();
        renderDetail();
    }

    if (action === 'edit') {
        state.selectedBookingId = id;
        const eventData = events.find(e => e.name === booking.eventName) || events[0];
        state.selectedEventId = eventData.id;
        populateEventOptions();
        populateSessionOptions();
        els.eventSelect.value = eventData.id;
        els.dateInput.value = booking.date;
        els.sessionSelect.value = booking.session;
        els.visitorName.value = booking.visitorName;
        els.contactInfo.value = booking.contactInfo;
        els.guestCount.value = booking.guestCount;
        els.notes.value = booking.notes || '';
        els.bookingId.value = booking.id;
        els.formTitle.textContent = 'Update Booking';
        els.cancelEdit.style.display = 'inline-block';
        renderBookings();
        renderDetail();
    }

    if (action === 'delete') {
        const ok = confirm('Delete this booking?');
        if (!ok) return;
        state.bookings = state.bookings.filter(b => b.id !== id);
        if (state.selectedBookingId === id) state.selectedBookingId = null;
        renderBookings();
        renderDetail();
        showMessage('Booking deleted successfully.', 'success');
    }
}

function bindEvents() {
    els.bookingForm.addEventListener('submit', saveBooking);
    els.eventSelect.addEventListener('change', (e) => {
        state.selectedEventId = e.target.value;
        populateSessionOptions();
    });
    els.searchInput.addEventListener('input', (e) => {
        state.filters.query = e.target.value;
        renderBookings();
    });
    els.statusFilter.addEventListener('change', (e) => {
        state.filters.status = e.target.value;
        renderBookings();
    });
    els.bookingList.addEventListener('click', handleBookingActions);
    els.cancelEdit.addEventListener('click', () => {
        resetForm();
        showMessage('Edit cancelled.', 'success');
    });
}

function init() {
    renderEventList();
    populateEventOptions();
    populateSessionOptions();
    bindEvents();
    renderBookings();
    renderDetail();
    resetForm();
}

init();
