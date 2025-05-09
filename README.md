# Proyecto Inmobiliaria

Este proyecto es una aplicación web para la gestión inmobiliaria, que incluye funcionalidades para usuarios, asesores, propiedades, y más.

## Seguridad Implementada

Para garantizar la seguridad de la aplicación, se han implementado las siguientes medidas:

### 1. Hashing de Contraseñas

Las contraseñas de los usuarios se almacenan de forma segura utilizando la librería `bcrypt`. Esto asegura que las contraseñas no se guarden en texto plano en la base de datos, protegiendo la información en caso de una brecha.

### 2. Autenticación con JWT

Se utiliza JSON Web Tokens (JWT) para la autenticación de usuarios. Los tokens incluyen información relevante del usuario y tienen un tiempo de expiración para mejorar la seguridad.

### 3. Validación de Entradas

Se valida y sanitiza toda la información recibida en los endpoints de la API utilizando `express-validator`. Esto previene ataques de inyección y asegura que los datos sean correctos antes de procesarlos.

### 4. Limitación de Intentos de Login

Para prevenir ataques de fuerza bruta, se ha implementado un middleware de limitación de intentos (`express-rate-limit`) en el endpoint de login. Esto limita la cantidad de intentos de acceso desde una misma IP en un periodo de tiempo.

### 5. Uso de Variables de Entorno

Se utilizan variables de entorno para almacenar información sensible como la clave secreta para firmar los JWT, evitando que esta información esté expuesta en el código fuente.

## Próximas Mejoras Recomendadas

- Implementar control de acceso basado en roles (RBAC) para restringir funcionalidades según el tipo de usuario.
- Configurar HTTPS para cifrar la comunicación entre cliente y servidor.
- Mejorar el manejo de errores para no exponer información sensible.
- Añadir logging y monitoreo para detectar actividades sospechosas.
- Realizar pruebas unitarias e integrales para asegurar la robustez del sistema.

---

Para más detalles sobre la instalación, configuración y uso, consulte la documentación específica de cada módulo.
