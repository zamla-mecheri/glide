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
  getDrivers: (available) => api(`https://glide-aa8l.onrender.com/api/drivers${available ? '?available=true' : ''}`),
  registerDriver: (body) => api('https://glide-aa8l.onrender.com/api/drivers', { method: 'POST', body: JSON.stringify(body) }),
  loginDriver: (phone, password) => api('https://glide-aa8l.onrender.com/api/drivers/login', { method: 'POST', body: JSON.stringify({ phone, password }) }),
  updateDriver: (id, body) => api(`https://glide-aa8l.onrender.com/api/drivers/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),

  // Passengers
  registerPassenger: (body) => api('https://glide-aa8l.onrender.com/api/passengers', { method: 'POST', body: JSON.stringify(body) }),
  loginPassenger: (phone, password) => api('https://glide-aa8l.onrender.com/api/passengers/login', { method: 'POST', body: JSON.stringify({ phone, password }) }),

  // Requests (Bookings)
  getRequests: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`https://glide-aa8l.onrender.com/api/requests${q ? '?' + q : ''}`);
  },
  createRequest: (body) => api('https://glide-aa8l.onrender.com/api/requests', { method: 'POST', body: JSON.stringify(body) }),
  updateRequest: (id, status) => api(`https://glide-aa8l.onrender.com/api/requests/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Reviews
  getReviews: (driverId) => api(`https://glide-aa8l.onrender.com/api/reviews${driverId ? '?driverId=' + driverId : ''}`),
  createReview: (body) => api('https://glide-aa8l.onrender.com/api/reviews', { method: 'POST', body: JSON.stringify(body) }),

  // Complaints
  getComplaints: () => api('https://glide-aa8l.onrender.com/api/complaints'),
  createComplaint: (body) => api('https://glide-aa8l.onrender.com/api/complaints', { method: 'POST', body: JSON.stringify(body) }),
  resolveComplaint: (id) => api(`https://glide-aa8l.onrender.com/api/complaints/${id}`, { method: 'PATCH', body: JSON.stringify({ status: 'resolved' }) }),

  // Admin
  getDriversAll: () => api('https://glide-aa8l.onrender.com/api/drivers'),
  getPassengersAll: () => api('https://glide-aa8l.onrender.com/api/passengers'),
  getBookingsAll: () => api('https://glide-aa8l.onrender.com/api/requests'),
  getReviewsAll: () => api('https://glide-aa8l.onrender.com/api/reviews'),
  getComplaintsAll: () => api('https://glide-aa8l.onrender.com/api/complaints')
};
