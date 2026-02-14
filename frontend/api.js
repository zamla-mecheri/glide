// API client for AutoConnect - use when served from Node backend (e.g. localhost:3000)
const API_BASE = ''; // same origin when served by backend

async function api(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

const AutoAPI = {
  // Drivers
  getDrivers: (available) => api(`/api/drivers${available ? '?available=true' : ''}`),
  registerDriver: (body) => api('/api/drivers', { method: 'POST', body: JSON.stringify(body) }),
  loginDriver: (phone, password) => api('/api/drivers/login', { method: 'POST', body: JSON.stringify({ phone, password }) }),
  updateDriver: (id, body) => api(`/api/drivers/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  // Passengers
  registerPassenger: (body) => api('/api/passengers', { method: 'POST', body: JSON.stringify(body) }),
  loginPassenger: (phone, password) => api('/api/passengers/login', { method: 'POST', body: JSON.stringify({ phone, password }) }),

  // Requests (Bookings)
  getRequests: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/api/requests${q ? '?' + q : ''}`);
  },
  createRequest: (body) => api('/api/requests', { method: 'POST', body: JSON.stringify(body) }),
  updateRequest: (id, status) => api(`/api/requests/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Reviews
  getReviews: (driverId) => api(`/api/reviews${driverId ? '?driverId=' + driverId : ''}`),
  createReview: (body) => api('/api/reviews', { method: 'POST', body: JSON.stringify(body) }),

  // Complaints
  getComplaints: () => api('/api/complaints'),
  createComplaint: (body) => api('/api/complaints', { method: 'POST', body: JSON.stringify(body) }),
  resolveComplaint: (id) => api(`/api/complaints/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'resolved' }) }),

  // Admin
  getDriversAll: () => api('/api/drivers'),
  getPassengersAll: () => api('/api/passengers'),
  getBookingsAll: () => api('/api/requests'),
  getReviewsAll: () => api('/api/reviews'),
  getComplaintsAll: () => api('/api/complaints')
};
