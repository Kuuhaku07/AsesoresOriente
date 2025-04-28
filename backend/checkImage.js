import http from 'http';

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/uploads/profile_pictures/1745862581110-924654321.jpg',
  method: 'HEAD',
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', res.headers);
  if (res.statusCode === 200) {
    console.log('La imagen está accesible.');
  } else {
    console.log('No se pudo acceder a la imagen.');
  }
});

req.on('error', (e) => {
  console.error(`Error en la petición: ${e.message}`);
});

req.end();
