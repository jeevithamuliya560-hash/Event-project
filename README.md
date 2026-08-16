# Temple Booking API

This project contains a simple Node.js + Express REST API for a temple booking system. It is designed to be tested directly in Postman and covers the required backend concepts.

## Features

- Node.js server
- Express.js REST API
- GET, POST, PUT, DELETE operations
- JSON request/response handling
- Basic validation
- HTTP status codes
- Error handling
- Postman-ready collection

## Start the server

```bash
npm install
npm start
```

## API Endpoints

### GET /health
Returns server status.

### GET /api/bookings
Returns all bookings. You can also filter with query parameters:

- `?status=Pending`
- `?search=Ananya`

### GET /api/bookings/:id
Fetch a single booking by ID.

### POST /api/bookings
Create a new booking.

Example JSON body:

```json
{
  "templeName": "Srisailam Temple",
  "visitDate": "2026-08-25",
  "session": "Morning",
  "visitorName": "Priya Nair",
  "contactNumber": "9123456789",
  "guestCount": 4,
  "notes": "Need darshan slot confirmation",
  "status": "Pending"
}
```

### PUT /api/bookings/:id
Update an existing booking.

### DELETE /api/bookings/:id
Delete a booking by ID.

## Validation rules

- templeName is required
- visitDate is required
- session is required
- visitorName is required
- contactNumber must be valid 10 digits
- guestCount must be between 1 and 20
- status must be one of: Confirmed, Pending, Checked In, Cancelled

## HTTP status codes used

- 200 OK
- 201 Created
- 400 Bad Request
- 404 Not Found
- 500 Internal Server Error

## Postman setup

1. Import the file `postman_collection.json`.
2. Start the server with `npm start`.
3. Use the endpoints in the collection.
4. Set the request body to JSON and send requests.

## Example URLs

- http://localhost:3000/health
- http://localhost:3000/api/bookings
- http://localhost:3000/api/bookings/1

## Notes

This is an in-memory backend, so data is reset when the server restarts.
