import dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });


console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

import { createAsesor } from '../services/asesorService.js';
import { createUsuario } from '../services/usuarioService.js';
import readline from 'readline';

async function registerAnyUser(userData) {
  try {
    // Create asesor first
    const asesorData = {
      nombre: userData.Nombre,
      apellido: userData.Apellido,
      cedula: userData.Cedula || '',
      telefono: userData.Telefono || '',
      correo: userData.Correo,
      fecha_ingreso: new Date(),
      comision_base: 2.5,
      activo: true,
      especialidad: null,
      foto_perfil: null,
      direccion: null
    };
    const asesor = await createAsesor(asesorData);
    console.log('Asesor created:', asesor);

    // Create usuario linked to asesor
    const usuarioData = {
      correo: userData.Correo,
      contrasena: userData.Contraseña,
      asesor_id: asesor.id,
      rol_id: userData.RolId || 3, // Default to ASESOR role id 3
      nombre_usuario: userData.NombreUsuario
    };
    const usuario = await createUsuario(usuarioData);
    console.log('Usuario created:', usuario);

    return { asesor, usuario };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function promptUserData() {
  const userData = {};
  userData.Nombre = await askQuestion('Nombre: ');
  userData.Apellido = await askQuestion('Apellido: ');
  userData.Cedula = await askQuestion('Cedula (optional): ');
  userData.Telefono = await askQuestion('Telefono (optional): ');
  userData.Correo = await askQuestion('Correo: ');
  userData.Contraseña = await askQuestion('Contraseña: ');
  userData.NombreUsuario = await askQuestion('NombreUsuario: ');
  const rolInput = await askQuestion('Rol (1=ADMINISTRADOR, 2=GERENTE, 3=ASESOR): ');
  userData.RolId = parseInt(rolInput) || 3;
  return userData;
}

console.log('Script started');

const isMain = process.argv[1] && process.argv[1].endsWith('registerAnyUser.js');

if (isMain) {
  (async () => {
    const choice = await askQuestion('Register example user? (y/n): ');
    let userData;
    if (choice.toLowerCase() === 'y') {
      userData = {
        Nombre: 'Test',
        Apellido: 'User',
        Cedula: '1234567890',
        Telefono: '555-1234',
        Correo: 'testuser@example.com',
        Contraseña: 'password123',
        NombreUsuario: 'testuser',
        RolId: 3 // ASESOR
      };
    } else {
      console.log('Please enter user details:');
      userData = await promptUserData();
    }
    try {
      await registerAnyUser(userData);
      console.log('User registration script completed successfully.');
      process.exit(0);
    } catch (err) {
      console.error('User registration script failed:', err);
      process.exit(1);
    }
  })();
}

export default registerAnyUser;
