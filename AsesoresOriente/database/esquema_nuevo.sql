-- Tablas básicas de configuración
CREATE TABLE "TipoInmueble" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL UNIQUE,
    "descripcion" TEXT NULL,
    "icono" VARCHAR(50) NULL
);

CREATE TABLE "TipoNegocio" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL UNIQUE,
    "descripcion" TEXT NULL
);

CREATE TABLE "EstadoInmueble" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL UNIQUE,
    "color" VARCHAR(20) NULL DEFAULT '#cccccc'
);

CREATE TABLE "EstadoCivil" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(20) NOT NULL UNIQUE
);

-- Tablas de ubicación geográfica
CREATE TABLE "Estado" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL UNIQUE,
    "codigo" VARCHAR(5) NULL
);

CREATE TABLE "Ciudad" (
    "id" SERIAL PRIMARY KEY,
    "estado_id" INTEGER NOT NULL REFERENCES "Estado"("id"),
    "nombre" VARCHAR(50) NOT NULL,
    CONSTRAINT uq_ciudad_estado UNIQUE (estado_id, nombre)
);

CREATE TABLE "Zona" (
    "id" SERIAL PRIMARY KEY,
    "ciudad_id" INTEGER NOT NULL REFERENCES "Ciudad"("id"),
    "nombre" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(10) NULL,
    CONSTRAINT uq_zona_ciudad UNIQUE (ciudad_id, nombre)
);

-- Tablas de personas y empresas
CREATE TABLE "Empresa" (
    "id" SERIAL PRIMARY KEY,
    "rif" VARCHAR(20) NOT NULL UNIQUE,
    "nombre" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20) NULL,
    "correo" VARCHAR(100) NULL CHECK (correo ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    "direccion" TEXT NULL,
    "fecha_registro" DATE DEFAULT CURRENT_DATE
);

CREATE TABLE "Propietario" (
    "id" SERIAL PRIMARY KEY,
    "tipo" VARCHAR(10) NOT NULL CHECK (tipo IN ('PERSONA', 'EMPRESA')),
    "nombre_completo" VARCHAR(200) NOT NULL,
    "documento_identidad" VARCHAR(20) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "correo" VARCHAR(100) NULL CHECK (correo ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    "direccion" TEXT NULL,
    "empresa_id" INTEGER NULL REFERENCES "Empresa"("id"),
    "fecha_registro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notas" TEXT NULL,
    CONSTRAINT uq_documento_propietario UNIQUE (tipo, documento_identidad)
);

-- Tablas de asesores y usuarios
CREATE TABLE "Asesor" (
    "id" SERIAL PRIMARY KEY,
    "cedula" VARCHAR(20) NOT NULL UNIQUE,
    "nombre" VARCHAR(100) NOT NULL,
    "apellido" VARCHAR(100) NOT NULL,
    "telefono" VARCHAR(20) NOT NULL,
    "correo" VARCHAR(100) NOT NULL UNIQUE CHECK (correo ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    "fecha_ingreso" DATE NOT NULL DEFAULT CURRENT_DATE,
    "fecha_nacimiento" DATE NULL,
    "comision_base" DECIMAL(5,2) NOT NULL DEFAULT 2.5 CHECK (comision_base BETWEEN 0 AND 100),
    "activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "especialidad" VARCHAR(100) NULL,
    "foto_perfil" VARCHAR(255) NULL,
    "direccion" TEXT NULL,
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "RedSocial" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL UNIQUE,
    "icono" VARCHAR(50) NULL
);

CREATE TABLE "RedAsesor" (
    "id" SERIAL PRIMARY KEY,
    "asesor_id" INTEGER NOT NULL REFERENCES "Asesor"("id") ON DELETE CASCADE,
    "red_social_id" INTEGER NOT NULL REFERENCES "RedSocial"("id"),
    "url" VARCHAR(255) NOT NULL,
    CONSTRAINT uq_red_asesor UNIQUE (asesor_id, red_social_id)
);

CREATE TABLE "Rol" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL UNIQUE,
    "descripcion" TEXT NULL,
    "nivel_acceso" INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE "Usuario" (
    "id" SERIAL PRIMARY KEY,
    "asesor_id" INTEGER NOT NULL UNIQUE REFERENCES "Asesor"("id") ON DELETE CASCADE,
    "nombre_usuario" VARCHAR(50) NOT NULL UNIQUE,
    "correo" VARCHAR(100) NOT NULL UNIQUE CHECK (correo ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    "contrasena_hash" VARCHAR(255) NOT NULL,
    "rol_id" INTEGER NOT NULL REFERENCES "Rol"("id"),
    "activo" BOOLEAN NOT NULL DEFAULT TRUE,
    "ultimo_login" TIMESTAMP NULL,
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tablas de características de inmuebles
CREATE TABLE "TipoCaracteristica" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL UNIQUE,
    "unidad_medida" VARCHAR(20) NULL,
    "es_prioritaria" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "Caracteristica" (
    "id" SERIAL PRIMARY KEY,
    "tipo_id" INTEGER NOT NULL REFERENCES "TipoCaracteristica"("id"),
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NULL,
    CONSTRAINT uq_caracteristica UNIQUE (tipo_id, nombre)
);

-- Tablas de documentos
CREATE TABLE "TipoDocumento" (
    "id" SERIAL PRIMARY KEY,
    "nombre" VARCHAR(50) NOT NULL UNIQUE,
    "descripcion" TEXT NULL,
    "requerido" BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE "Documento" (
    "id" SERIAL PRIMARY KEY,
    "tipo_id" INTEGER NOT NULL REFERENCES "TipoDocumento"("id"),
    "nombre_archivo" VARCHAR(255) NOT NULL,
    "ruta" VARCHAR(255) NOT NULL,
    "tamano" INTEGER NOT NULL CHECK (tamano > 0),
    "fecha_subida" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valido" BOOLEAN NOT NULL DEFAULT FALSE,
    "observaciones" TEXT NULL,
    "fecha_vencimiento" DATE NULL
);

-- Tablas principales de inmuebles
CREATE TABLE "Inmueble" (
    "id" SERIAL PRIMARY KEY,
    "codigo" VARCHAR(20) NOT NULL UNIQUE,
    "titulo" VARCHAR(100) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo_inmueble_id" INTEGER NOT NULL REFERENCES "TipoInmueble"("id"),
    "tipo_negocio_id" INTEGER NOT NULL REFERENCES "TipoNegocio"("id"),
    "estado_id" INTEGER NOT NULL REFERENCES "EstadoInmueble"("id"),
    "asesor_id" INTEGER NOT NULL REFERENCES "Asesor"("id"),
    "propietario_id" INTEGER NOT NULL REFERENCES "Propietario"("id"),
    "precio" DECIMAL(15,2) NOT NULL CHECK (precio > 0),
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'USD' CHECK (moneda IN ('USD', 'EUR', 'VES')),
    "area_construida" DECIMAL(10,2) NOT NULL CHECK (area_construida > 0),
    "area_terreno" DECIMAL(10,2) NOT NULL CHECK (area_terreno > 0),
    "habitaciones" INTEGER NOT NULL DEFAULT 0 CHECK (habitaciones >= 0),
    "banos" INTEGER NOT NULL DEFAULT 0 CHECK (banos >= 0),
    "estacionamientos" INTEGER NOT NULL DEFAULT 0 CHECK (estacionamientos >= 0),
    "niveles" INTEGER NOT NULL DEFAULT 1 CHECK (niveles >= 1),
    "ano_construccion" INTEGER NULL CHECK (ano_construccion > 1800 AND ano_construccion <= EXTRACT(YEAR FROM CURRENT_DATE)),
    "amueblado" BOOLEAN NOT NULL DEFAULT FALSE,
    "climatizado" BOOLEAN NOT NULL DEFAULT FALSE,
    "visible" BOOLEAN NOT NULL DEFAULT TRUE,
    "fecha_creacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_publicacion" TIMESTAMP NULL
);

CREATE TABLE "UbicacionInmueble" (
    "inmueble_id" INTEGER PRIMARY KEY REFERENCES "Inmueble"("id") ON DELETE CASCADE,
    "zona_id" INTEGER NOT NULL REFERENCES "Zona"("id"),
    "direccion_exacta" TEXT NOT NULL,
    "referencia" TEXT NULL,
    "coordenadas" VARCHAR(100) NULL, -- Formato: 'lat,long'
    "mapa_url" VARCHAR(255) NULL
);

CREATE TABLE "InmuebleCaracteristica" (
    "inmueble_id" INTEGER NOT NULL REFERENCES "Inmueble"("id") ON DELETE CASCADE,
    "caracteristica_id" INTEGER NOT NULL REFERENCES "Caracteristica"("id"),
    "valor" VARCHAR(255) NULL,
    "cantidad" INTEGER NULL,
    PRIMARY KEY ("inmueble_id", "caracteristica_id")
);

CREATE TABLE "InmuebleDocumento" (
    "inmueble_id" INTEGER NOT NULL REFERENCES "Inmueble"("id") ON DELETE CASCADE,
    "documento_id" INTEGER NOT NULL REFERENCES "Documento"("id") ON DELETE CASCADE,
    "fecha_asociacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "es_principal" BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY ("inmueble_id", "documento_id")
);

CREATE TABLE "ImagenInmueble" (
    "id" SERIAL PRIMARY KEY,
    "inmueble_id" INTEGER NOT NULL REFERENCES "Inmueble"("id") ON DELETE CASCADE,
    "ruta" VARCHAR(255) NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "titulo" VARCHAR(100) NULL,
    "descripcion" TEXT NULL,
    "fecha_subida" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "es_portada" BOOLEAN NOT NULL DEFAULT FALSE
);

-- Tablas de seguimiento y ventas
CREATE TABLE "SeguimientoInmueble" (
    "id" SERIAL PRIMARY KEY,
    "inmueble_id" INTEGER NOT NULL REFERENCES "Inmueble"("id") ON DELETE CASCADE,
    "asesor_id" INTEGER NOT NULL REFERENCES "Asesor"("id"),
    "tipo" VARCHAR(50) NOT NULL CHECK (tipo IN ('VISITA', 'LLAMADA', 'EMAIL', 'MENSAJE', 'OTRO')),
    "descripcion" TEXT NOT NULL,
    "fecha" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "proxima_accion" TEXT NULL,
    "fecha_proxima_accion" TIMESTAMP NULL
);

CREATE TABLE "Visita" (
    "id" SERIAL PRIMARY KEY,
    "inmueble_id" INTEGER NOT NULL REFERENCES "Inmueble"("id") ON DELETE CASCADE,
    "asesor_id" INTEGER NOT NULL REFERENCES "Asesor"("id"),
    "cliente_nombre" VARCHAR(200) NOT NULL,
    "cliente_telefono" VARCHAR(20) NOT NULL,
    "cliente_correo" VARCHAR(100) NULL CHECK (cliente_correo ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    "fecha_visita" TIMESTAMP NOT NULL,
    "duracion_minutos" INTEGER NULL,
    "observaciones" TEXT NULL,
    "interes" INTEGER NULL CHECK (interes BETWEEN 1 AND 10),
    "fecha_registro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_inmueble_asesor ON "Inmueble"("asesor_id");
CREATE INDEX idx_inmueble_propietario ON "Inmueble"("propietario_id");
CREATE INDEX idx_inmueble_tipo ON "Inmueble"("tipo_inmueble_id");
CREATE INDEX idx_inmueble_negocio ON "Inmueble"("tipo_negocio_id");
CREATE INDEX idx_inmueble_estado ON "Inmueble"("estado_id");
CREATE INDEX idx_inmueble_precio ON "Inmueble"("precio");
CREATE INDEX idx_inmueble_ubicacion ON "UbicacionInmueble"("zona_id");
CREATE INDEX idx_imagen_inmueble ON "ImagenInmueble"("inmueble_id");
CREATE INDEX idx_seguimiento_inmueble ON "SeguimientoInmueble"("inmueble_id");
CREATE INDEX idx_visita_inmueble ON "Visita"("inmueble_id");

-- Datos básicos iniciales
INSERT INTO "EstadoInmueble" ("nombre", "color") VALUES 
('DISPONIBLE', '#4CAF50'),
('RESERVADO', '#FFC107'),
('VENDIDO', '#F44336'),
('NO_DISPONIBLE', '#9E9E9E');

INSERT INTO "TipoNegocio" ("nombre") VALUES 
('VENTA'),
('ALQUILER'),
('ALQUILER_CON_OPCION_COMPRA');

INSERT INTO "Rol" ("nombre", "nivel_acceso") VALUES 
('ADMINISTRADOR', 100),
('GERENTE', 80),
('ASESOR_PRINCIPAL', 60),
('ASESOR', 40),
('ASISTENTE', 20);

-- Función para actualizar fechas de modificación
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."fecha_actualizacion" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para actualización automática
CREATE TRIGGER update_inmueble_modtime
BEFORE UPDATE ON "Inmueble"
FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_usuario_modtime
BEFORE UPDATE ON "Usuario"
FOR EACH ROW EXECUTE FUNCTION update_modified_column();