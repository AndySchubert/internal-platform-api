const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 8000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const token = JSON.parse(data).access_token;
    console.log("Token:", token.substring(0, 15) + "...");
    
    // Now call /projects
    http.get('http://127.0.0.1:8000/api/v1/projects', {
      headers: { 'Authorization': 'Bearer ' + token }
    }, (res2) => {
       let data2 = '';
       res2.on('data', chunk => data2+=chunk);
       res2.on('end', () => console.log("Projects:", data2));
    }).on('error', e => console.log("Projects error:", e));
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write('username=andy.schubert0201@gmail.com&password=password123');
req.end();
