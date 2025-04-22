CREATE TABLE "Inmueble"(
    "id" SERIAL NOT NULL,
    "Estado" VARCHAR(255) NOT NULL,
    "Asesor" INTEGER NOT NULL,
    "Precio" BIGINT NULL,
    "TipoInmueble" VARCHAR(255) NOT NULL,
    "TipoNegocio" VARCHAR(255) NOT NULL,
    "Id_Ubicacion" INTEGER NULL,
    "Id_Caracteristicas" INTEGER NULL,
    "Id_Propietario" INTEGER NULL,
    "Id_Documentos" INTEGER NULL,
    "Fecha_Creacion" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Fecha_Actualizacion" TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE
    "Inmueble" ADD PRIMARY KEY("id");
CREATE TABLE "Ubicacion"(
    "id" SERIAL NOT NULL,
    "Estado" VARCHAR(255) NULL,
    "Ciudad" VARCHAR(255) NULL,
    "Descripcion" VARCHAR(255) NULL,
    "Maps" VARCHAR(255) NULL
);
ALTER TABLE
    "Ubicacion" ADD PRIMARY KEY("id");
CREATE TABLE "Caracteristicas"(
    "id" SERIAL NOT NULL,
    "AreaTerreno" DECIMAL(8, 2) NULL,
    "AreaConstruida" BIGINT NULL,
    "Habitaciones" INTEGER NULL,
    "Baños" INTEGER NULL,
    "Estacionamiento" INTEGER NULL,
    "Descripcion" TEXT NULL
);
ALTER TABLE
    "Caracteristicas" ADD PRIMARY KEY("id");
CREATE TABLE "Asesor"(
    "id" SERIAL NOT NULL,
    "Nombre" VARCHAR(255) NULL,
    "Apellido" VARCHAR(255) NULL,
    "Cedula" VARCHAR(255) NULL,
    "Telefono" VARCHAR(255) NULL,
    "Pfp" VARCHAR(255) NULL
);
ALTER TABLE
    "Asesor" ADD PRIMARY KEY("id");
CREATE TABLE "ListaCaracteristicas"(
    "id" SERIAL NOT NULL,
    "id_caracteristica" BIGINT NOT NULL,
    "Caracteristica" VARCHAR(255) NOT NULL,
    "Tipo" INTEGER NOT NULL
);
ALTER TABLE
    "ListaCaracteristicas" ADD PRIMARY KEY("id");
CREATE TABLE "Propietario"(
    "id" SERIAL NOT NULL,
    "Telefono" VARCHAR(255) NULL,
    "Correo" VARCHAR(255) NULL,
    "Tipo_Propietario" VARCHAR(255) NOT NULL,
    "Id_Persona" INTEGER NULL,
    "Id_Empresa" INTEGER NULL
);
ALTER TABLE
    "Propietario" ADD PRIMARY KEY("id");
CREATE TABLE "Documentos"(
    "id" SERIAL NOT NULL,
    "Rif" VARCHAR(255) NULL,
    "Cedula" VARCHAR(255) NULL,
    "Ficha_Catastral" VARCHAR(255) NULL,
    "Pago_impuestos" VARCHAR(255) NULL,
    "Sentencia_Divorcio" VARCHAR(255) NULL,
    "Declaracion_Sucesorial" VARCHAR(255) NULL,
    "Hipoteca" VARCHAR(255) NULL,
    "Acta_constitutiva" VARCHAR(255) NULL,
    "D_Propiedad" VARCHAR(255) NULL
);
ALTER TABLE
    "Documentos" ADD PRIMARY KEY("id");
CREATE TABLE "Empresa"(
    "id" SERIAL NOT NULL,
    "RIF" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Empresa" ADD PRIMARY KEY("id");
CREATE TABLE "RedesAsesor"(
    "id" SERIAL NOT NULL,
    "id_asesor" INTEGER NOT NULL,
    "Red" VARCHAR(255) NOT NULL,
    "Link" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "RedesAsesor" ADD PRIMARY KEY("id");
CREATE TABLE "Persona"(
    "id" SERIAL NOT NULL,
    "Nombre" VARCHAR(255) NOT NULL,
    "Apellido" VARCHAR(255) NOT NULL,
    "Cedula" VARCHAR(255) NOT NULL,
    "Estado_Civil" VARCHAR(255) NULL
);
ALTER TABLE
    "Persona" ADD PRIMARY KEY("id");
COMMENT
ON COLUMN
    "Persona"."Estado_Civil" IS 'Soltero - Casado - Viudo - Divorciado';
CREATE TABLE "Usuario"(
    "id" SERIAL NOT NULL,
    "Correo" VARCHAR(255) NOT NULL,
    "Contraseña" VARCHAR(255) NOT NULL,
    "id_asesor" INTEGER NOT NULL,
    "Rol" VARCHAR(255) NOT NULL
);
ALTER TABLE
    "Usuario" ADD PRIMARY KEY("id");
ALTER TABLE
    "Inmueble" ADD CONSTRAINT "inmueble_id_ubicacion_foreign" FOREIGN KEY("Id_Ubicacion") REFERENCES "Ubicacion"("id");
ALTER TABLE
    "RedesAsesor" ADD CONSTRAINT "redesasesor_id_asesor_foreign" FOREIGN KEY("id_asesor") REFERENCES "Asesor"("id");
ALTER TABLE
    "Propietario" ADD CONSTRAINT "propietario_id_persona_foreign" FOREIGN KEY("Id_Persona") REFERENCES "Persona"("id");
ALTER TABLE
    "Inmueble" ADD CONSTRAINT "inmueble_id_documentos_foreign" FOREIGN KEY("Id_Documentos") REFERENCES "Documentos"("id");
ALTER TABLE
    "Usuario" ADD CONSTRAINT "usuario_id_asesor_foreign" FOREIGN KEY("id_asesor") REFERENCES "Asesor"("id");
ALTER TABLE
    "Inmueble" ADD CONSTRAINT "inmueble_asesor_foreign" FOREIGN KEY("Asesor") REFERENCES "Asesor"("id");
ALTER TABLE
    "ListaCaracteristicas" ADD CONSTRAINT "listacaracteristicas_id_caracteristica_foreign" FOREIGN KEY("id_caracteristica") REFERENCES "Caracteristicas"("id");
ALTER TABLE
    "Inmueble" ADD CONSTRAINT "inmueble_id_propietario_foreign" FOREIGN KEY("Id_Propietario") REFERENCES "Propietario"("id");
ALTER TABLE
    "Propietario" ADD CONSTRAINT "propietario_id_empresa_foreign" FOREIGN KEY("Id_Empresa") REFERENCES "Empresa"("id");
ALTER TABLE
    "Inmueble" ADD CONSTRAINT "inmueble_id_caracteristicas_foreign" FOREIGN KEY("Id_Caracteristicas") REFERENCES "Caracteristicas"("id");