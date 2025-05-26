import pool from '../db.js';

/**
 * Crea un nuevo inmueble y sus datos relacionados en una transacción.
 * @param {Object} inmuebleData - Datos del inmueble y relacionados.
 * @returns {Object} - El inmueble creado con sus relaciones.
 */
export const createInmueble = async (inmuebleData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Insertar en tabla Inmueble
    const {
      codigo,
      titulo,
      descripcion,
      tipoInmuebleId,
      estadoInmuebleId,
      asesorId,
      propietarioTipo,
      propietarioId,
      areaConstruida,
      areaTerreno,
      habitaciones,
      banos,
      estacionamientos,
      niveles,
      anoConstruccion,
      amueblado,
      climatizado,
      tipoNegocios,
      caracteristicas,
      caracteristicasPersonalizadas,
      imagenes,
      documentos,
      estadoId,
      ciudadId,
      zonaId,
      direccionExacta,
      referencia,
      coordenadas
    } = inmuebleData;

    let propietario_persona_id = null;
    let propietario_empresa_id = null;
    if (propietarioTipo === 'persona') {
      propietario_persona_id = propietarioId;
    } else if (propietarioTipo === 'empresa') {
      propietario_empresa_id = propietarioId;
    }

    const inmuebleInsertQuery = `
      INSERT INTO "Inmueble" 
      (codigo, titulo, descripcion, tipo_inmueble_id, estado_id, asesor_id, propietario_persona_id, propietario_empresa_id,
       area_construida, area_terreno, habitaciones, banos, estacionamientos, niveles, ano_construccion, amueblado, climatizado)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *`;

    const inmuebleResult = await client.query(inmuebleInsertQuery, [
      codigo,
      titulo,
      descripcion,
      tipoInmuebleId,
      estadoInmuebleId,
      asesorId,
      propietario_persona_id,
      propietario_empresa_id,
      areaConstruida,
      areaTerreno,
      habitaciones,
      banos,
      estacionamientos,
      niveles,
      anoConstruccion,
      amueblado,
      climatizado
    ]);

    const inmueble = inmuebleResult.rows[0];

    // Insertar ubicación
    const ubicacionInsertQuery = `
      INSERT INTO "UbicacionInmueble" (inmueble_id, zona_id, direccion_exacta, referencia, coordenadas)
      VALUES ($1,$2,$3,$4,$5)`;

    await client.query(ubicacionInsertQuery, [
      inmueble.id,
      zonaId,
      direccionExacta,
      referencia,
      coordenadas
    ]);

    // Insertar tipos de negocio
    if (Array.isArray(tipoNegocios)) {
      for (const tn of tipoNegocios) {
        const { tipoNegocioId, precio, moneda, disponible } = tn;
        const negocioInsertQuery = `
          INSERT INTO "InmuebleTipoNegocio" (inmueble_id, tipo_negocio_id, precio, moneda, disponible)
          VALUES ($1,$2,$3,$4,$5)`;
        await client.query(negocioInsertQuery, [
          inmueble.id,
          tipoNegocioId,
          precio,
          moneda || 'USD',
          disponible !== false
        ]);
      }
    }

    // Insertar características
    if (Array.isArray(caracteristicas)) {
      for (const c of caracteristicas) {
        const { caracteristicaId, valor, cantidad } = c;
        const caracteristicaInsertQuery = `
          INSERT INTO "InmuebleCaracteristica" (inmueble_id, caracteristica_id, valor, cantidad)
          VALUES ($1,$2,$3,$4)`;
        await client.query(caracteristicaInsertQuery, [
          inmueble.id,
          caracteristicaId,
          valor,
          cantidad || null
        ]);
      }
    }

    // Insertar características personalizadas (como características con nombre y valor)
    if (Array.isArray(caracteristicasPersonalizadas)) {
      for (const c of caracteristicasPersonalizadas) {
        // Insertar en Caracteristica si no existe o manejar de otra forma
        // Para simplificar, se omite inserción en Caracteristica y se guarda como InmuebleCaracteristica con nombre personalizado
        // Esto requiere un ajuste en el esquema o manejo especial, here we skip DB insert for custom for now
      }
    }

    // Insertar imágenes
    if (Array.isArray(imagenes)) {
      for (const [index, img] of imagenes.entries()) {
        const { ruta, titulo, descripcion, subidoPor } = img;
        const imagenInsertQuery = `
          INSERT INTO "ImagenInmueble" (inmueble_id, ruta, orden, titulo, descripcion, subido_por)
          VALUES ($1,$2,$3,$4,$5,$6)`;
        await client.query(imagenInsertQuery, [
          inmueble.id,
          ruta,
          index,
          titulo || null,
          descripcion || null,
          subidoPor || null
        ]);
      }
    }

    // Insertar documentos
    if (Array.isArray(documentos)) {
      for (const doc of documentos) {
        const { tipoId, nombreArchivo, ruta, tamano, subidoPor } = doc;
        const documentoInsertQuery = `
          INSERT INTO "Documento" (tipo_id, nombre_archivo, ruta, tamano, subido_por, inmueble_id)
          VALUES ($1,$2,$3,$4,$5,$6)`;
        await client.query(documentoInsertQuery, [
          tipoId,
          nombreArchivo,
          ruta,
          tamano,
          subidoPor || null,
          inmueble.id
        ]);
      }
    }

    await client.query('COMMIT');
    return inmueble;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Funciones para obtener datos de opciones para dropdowns.
 */
export const getTipoInmuebles = async () => {
  const result = await pool.query('SELECT id, nombre FROM "TipoInmueble" ORDER BY nombre');
  return result.rows;
};

export const getEstadoInmuebles = async () => {
  const result = await pool.query('SELECT id, nombre, color FROM "EstadoInmueble" ORDER BY nombre');
  return result.rows;
};

export const getAsesores = async () => {
  const result = await pool.query('SELECT id, nombre, apellido FROM "Asesor" WHERE activo = true ORDER BY nombre, apellido');
  return result.rows.map(a => ({ id: a.id, nombre: a.nombre + " " + a.apellido }));
};

export const getPropietariosPersona = async () => {
  const result = await pool.query('SELECT id, nombre, apellido, documento_identidad FROM "PropietarioPersona" ORDER BY nombre, apellido');
  return result.rows.map(p => ({ id: p.id, nombre: p.nombre + " " + p.apellido, documento: p.documento_identidad }));
};

export const getPropietariosEmpresa = async () => {
  const result = await pool.query('SELECT pe.id, e.nombre, e.rif FROM "PropietarioEmpresa" pe JOIN "Empresa" e ON pe.empresa_id = e.id ORDER BY e.nombre');
  return result.rows.map(p => ({ id: p.id, nombre: p.nombre, rif: p.rif }));
};

export const getEstados = async () => {
  const result = await pool.query('SELECT id, nombre FROM "Estado" ORDER BY nombre');
  return result.rows;
};

export const getCiudades = async (estadoId) => {
  const result = await pool.query('SELECT id, nombre FROM "Ciudad" WHERE estado_id = $1 ORDER BY nombre', [estadoId]);
  return result.rows;
};

export const getZonas = async (ciudadId) => {
  const result = await pool.query('SELECT id, nombre, codigo_postal FROM "Zona" WHERE ciudad_id = $1 ORDER BY nombre', [ciudadId]);
  return result.rows;
};

export const getTipoNegocios = async () => {
  const result = await pool.query('SELECT id, nombre FROM "TipoNegocio" ORDER BY nombre');
  return result.rows;
};

export const getCaracteristicas = async () => {
  const result = await pool.query('SELECT c.id, c.nombre, tc.nombre AS tipo FROM "Caracteristica" c JOIN "TipoCaracteristica" tc ON c.tipo_id = tc.id ORDER BY c.nombre');
  return result.rows.map(c => ({ id: c.id, nombre: c.nombre, tipo: c.tipo }));
};

/**
 * Funciones para crear y actualizar propietarios persona y empresa
 */

export const getEstadoCivil = async () => {
  const result = await pool.query('SELECT id, nombre FROM "EstadoCivil" ORDER BY nombre');
  return result.rows;
};

export const createPropietarioPersona = async (propietarioData) => {
  const { nombre, apellido, documento, telefono, correo, direccion, fechaNacimiento, estadoCivilId, notas } = propietarioData;
  const client = await pool.connect();
  try {
    const insertQuery = `
      INSERT INTO "PropietarioPersona" (nombre, apellido, documento_identidad, telefono, correo, direccion, fecha_nacimiento, estado_civil_id, notas)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, nombre, apellido, documento_identidad AS documento, telefono, correo, direccion, fecha_nacimiento, estado_civil_id, notas
    `;
    const result = await client.query(insertQuery, [nombre, apellido, documento, telefono, correo, direccion, fechaNacimiento, estadoCivilId, notas]);
    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const updatePropietarioPersona = async (id, propietarioData) => {
  const { nombre, apellido, documento, telefono, correo, direccion, fechaNacimiento, estadoCivilId, notas } = propietarioData;
  const client = await pool.connect();
  try {
    const updateQuery = `
      UPDATE "PropietarioPersona"
      SET nombre = $1, apellido = $2, documento_identidad = $3, telefono = $4, correo = $5, direccion = $6, fecha_nacimiento = $7, estado_civil_id = $8, notas = $9
      WHERE id = $10
      RETURNING id, nombre, apellido, documento_identidad AS documento, telefono, correo, direccion, fecha_nacimiento, estado_civil_id, notas
    `;
    const result = await client.query(updateQuery, [nombre, apellido, documento, telefono, correo, direccion, fechaNacimiento, estadoCivilId, notas, id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

export const createPropietarioEmpresa = async (propietarioData) => {
  const { empresaNombre, rif, representanteLegal, documentoRepresentante, telefono, correo, direccion, notas } = propietarioData;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Insertar en tabla Empresa
    const insertEmpresaQuery = `
      INSERT INTO "Empresa" (nombre, rif, telefono, correo, direccion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `;
    const empresaResult = await client.query(insertEmpresaQuery, [empresaNombre, rif, telefono, correo, direccion]);
    const empresaId = empresaResult.rows[0].id;

    // Insertar en tabla PropietarioEmpresa
    const insertPropietarioEmpresaQuery = `
      INSERT INTO "PropietarioEmpresa" (empresa_id, representante_legal, documento_representante, notas)
      VALUES ($1, $2, $3, $4)
      RETURNING id, empresa_id, representante_legal, documento_representante, notas
    `;
    const propietarioEmpresaResult = await client.query(insertPropietarioEmpresaQuery, [empresaId, representanteLegal, documentoRepresentante, notas]);
    await client.query('COMMIT');
    return {
      id: propietarioEmpresaResult.rows[0].id,
      empresa_id: empresaId,
      representante_legal: representanteLegal,
      documento_representante: documentoRepresentante,
      notas: propietarioEmpresaResult.rows[0].notas
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updatePropietarioEmpresa = async (id, propietarioData) => {
  const { empresaNombre, rif, representanteLegal, documentoRepresentante, telefono, correo, direccion, notas } = propietarioData;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Obtener empresa_id desde PropietarioEmpresa
    const empresaIdResult = await client.query('SELECT empresa_id FROM "PropietarioEmpresa" WHERE id = $1', [id]);
    if (empresaIdResult.rowCount === 0) {
      throw new Error('PropietarioEmpresa not found');
    }
    const empresaId = empresaIdResult.rows[0].empresa_id;

    // Actualizar tabla Empresa
    const updateEmpresaQuery = `
      UPDATE "Empresa"
      SET nombre = $1, rif = $2, telefono = $3, correo = $4, direccion = $5
      WHERE id = $6
    `;
    await client.query(updateEmpresaQuery, [empresaNombre, rif, telefono, correo, direccion, empresaId]);

    // Actualizar tabla PropietarioEmpresa
    const updatePropietarioEmpresaQuery = `
      UPDATE "PropietarioEmpresa"
      SET representante_legal = $1, documento_representante = $2, notas = $3
      WHERE id = $4
      RETURNING id, empresa_id, representante_legal, documento_representante, notas
    `;
    const propietarioEmpresaResult = await client.query(updatePropietarioEmpresaQuery, [representanteLegal, documentoRepresentante, notas, id]);

    await client.query('COMMIT');
    return {
      id: propietarioEmpresaResult.rows[0].id,
      empresa_id: empresaId,
      representante_legal: representanteLegal,
      documento_representante: documentoRepresentante,
      notas: propietarioEmpresaResult.rows[0].notas
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
