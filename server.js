const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const validStatuses = ['Confirmed', 'Pending', 'Checked In', 'Cancelled'];

let bookings = [
  {
    id: 1,
    templeName: 'Sri Meenakshi Temple',
    visitDate: '2026-08-20',
    session: 'Morning',
    visitorName: 'Ananya Reddy',
    contactNumber: '9876543210',
    guestCount: 2,
    notes: 'Need wheelchair assistance',
    status: 'Confirmed'
  },
  {
    id: 2,
    templeName: 'Venkateswara Temple',
    visitDate: '2026-08-22',
    session: 'Evening',
    visitorName: 'Karthik Rao',
    contactNumber: '9988776655',
    guestCount: 3,
    notes: 'Family group visit',
    status: 'Pending'
  }
];

function buildBookingResponse(booking) {
  return {
    id: booking.id,
    templeName: booking.templeName,
    visitDate: booking.visitDate,
    session: booking.session,
    visitorName: booking.visitorName,
    contactNumber: booking.contactNumber,
    guestCount: booking.guestCount,
    notes: booking.notes,
    status: booking.status
  };
}

function validateBooking(data) {
  const errors = [];

  if (!data.templeName || !data.templeName.trim()) {
    errors.push('templeName is required');
  }

  if (!data.visitDate) {
    errors.push('visitDate is required');
  }

  if (!data.session || !data.session.trim()) {
    errors.push('session is required');
  }

  if (!data.visitorName || !data.visitorName.trim()) {
    errors.push('visitorName is required');
  }

  if (!data.contactNumber || !/^\d{10}$/.test(String(data.contactNumber).trim())) {
    errors.push('contactNumber must be a valid 10-digit number');
  }

  if (data.guestCount === undefined || Number(data.guestCount) < 1 || Number(data.guestCount) > 20) {
    errors.push('guestCount must be between 1 and 20');
  }

  if (data.status && !validStatuses.includes(data.status)) {
    errors.push('status must be one of: Confirmed, Pending, Checked In, Cancelled');
  }

  return errors;
}

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Temple Booking API is running successfully.'
  });
});

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Temple Booking API',
    endpoints: [
      'GET /api/bookings',
      'GET /api/bookings/:id',
      'POST /api/bookings',
      'PUT /api/bookings/:id',
      'DELETE /api/bookings/:id'
    ]
  });
});

app.get('/api/bookings', (req, res) => {
  const { status, search } = req.query;

  let filteredBookings = [...bookings];

  if (status && status !== 'all') {
    filteredBookings = filteredBookings.filter((booking) => booking.status === status);
  }

  if (search) {
    const keyword = search.toLowerCase();
    filteredBookings = filteredBookings.filter((booking) =>
      booking.templeName.toLowerCase().includes(keyword) ||
      booking.visitorName.toLowerCase().includes(keyword) ||
      booking.contactNumber.includes(keyword)
    );
  }

  res.status(200).json({
    count: filteredBookings.length,
    data: filteredBookings.map(buildBookingResponse)
  });
});

app.get('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id);
  const booking = bookings.find((item) => item.id === id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  return res.status(200).json({ data: buildBookingResponse(booking) });
});

app.post('/api/bookings', (req, res) => {
  const errors = validateBooking(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }

  const newBooking = {
    id: bookings.length ? bookings[bookings.length - 1].id + 1 : 1,
    templeName: req.body.templeName.trim(),
    visitDate: req.body.visitDate,
    session: req.body.session.trim(),
    visitorName: req.body.visitorName.trim(),
    contactNumber: String(req.body.contactNumber).trim(),
    guestCount: Number(req.body.guestCount),
    notes: req.body.notes ? req.body.notes.trim() : '',
    status: req.body.status || 'Pending'
  };

  bookings.push(newBooking);

  return res.status(201).json({
    message: 'Booking created successfully',
    data: buildBookingResponse(newBooking)
  });
});

app.put('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id);
  const bookingIndex = bookings.findIndex((item) => item.id === id);

  if (bookingIndex === -1) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  const errors = validateBooking(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors
    });
  }

  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    templeName: req.body.templeName.trim(),
    visitDate: req.body.visitDate,
    session: req.body.session.trim(),
    visitorName: req.body.visitorName.trim(),
    contactNumber: String(req.body.contactNumber).trim(),
    guestCount: Number(req.body.guestCount),
    notes: req.body.notes ? req.body.notes.trim() : '',
    status: req.body.status || bookings[bookingIndex].status
  };

  return res.status(200).json({
    message: 'Booking updated successfully',
    data: buildBookingResponse(bookings[bookingIndex])
  });
});

app.delete('/api/bookings/:id', (req, res) => {
  const id = Number(req.params.id);
  const initialLength = bookings.length;

  bookings = bookings.filter((booking) => booking.id !== id);

  if (bookings.length === initialLength) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  return res.status(200).json({
    message: 'Booking deleted successfully',
    deletedId: id
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
