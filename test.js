const https = require('https');

const data = JSON.stringify({
  isFinal: false,
  timestamp: new Date().toISOString(),
  name: "Test User From Backend",
  phone: "123456789",
  email: "test@example.com",
  location: "Colombo"
});

const options = {
  hostname: 'script.google.com',
  path: '/macros/s/AKfycbzwMpZPIH1OVt9cVslrLOCT53Eydwc5SKWtsNhE_ZI8HtbW9ZVZDx2wnI0heM4dR0s/exec',
  method: 'POST',
  headers: {
    'Content-Type': 'text/plain',
    'Content-Length': data.length
  }
};

const req = https.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
