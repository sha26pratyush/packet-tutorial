const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Read SSL certificate and key
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

// Serve static files (like login.html)
const requestHandler = (req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  let filePath = '.' + req.url;
  if (filePath === './') filePath = './login.html';

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.css':
      contentType = 'text/css';
      break;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
};

// HTTP server on 8080
http.createServer(requestHandler).listen(8080, () => {
  console.log('HTTP server running at http://localhost:8080');
});

// HTTPS server on 8443
https.createServer(options, requestHandler).listen(8443, () => {
  console.log('HTTPS server running at https://localhost:8443');
});
