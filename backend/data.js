const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const FILES = {
  drivers: 'drivers.json',
  passengers: 'passengers.json',
  requests: 'requests.json',
  reviews: 'reviews.json',
  complaints: 'complaints.json'
};

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function read(key) {
  ensureDir();
  const file = path.join(DATA_DIR, FILES[key]);
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    if (e.code === 'ENOENT') return [];
    throw e;
  }
}

function write(key, data) {
  ensureDir();
  const file = path.join(DATA_DIR, FILES[key]);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = { read, write, FILES };
