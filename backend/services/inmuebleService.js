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
  const result = await pool.query(`
    SELECT id, nombre, apellido, documento_identidad, telefono, correo, direccion, fecha_nacimiento, estado_civil_id, fecha_registro, notas
    FROM "PropietarioPersona"
    ORDER BY nombre, apellido
  `);
  return result.rows.map(p => ({
    id: p.id,
    nombre: p.nombre + " " + p.apellido,
    documento: p.documento_identidad,
    telefono: p.telefono || '',
    correo: p.correo || '',
    direccion: p.direccion || '',
    fechaNacimiento: p.fecha_nacimiento,
    estadoCivilId: p.estado_civil_id,
    fechaRegistro: p.fecha_registro,
    notas: p.notas || ''
  }));
};

export const getPropietariosEmpresa = async () => {
  const result = await pool.query(`
    SELECT pe.id, e.nombre, e.rif, e.telefono, e.correo, e.direccion, pe.representante_legal, pe.documento_representante, pe.fecha_registro, pe.notas
    FROM "PropietarioEmpresa" pe
    JOIN "Empresa" e ON pe.empresa_id = e.id
    ORDER BY e.nombre
  `);
  return result.rows.map(p => ({
    id: p.id,
    nombre: p.nombre,
    rif: p.rif,
    telefono: p.telefono || '',
    correo: p.correo || '',
    direccion: p.direccion || '',
    representanteLegal: p.representante_legal || '',
    documentoRepresentante: p.documento_representante || '',
    fechaRegistro: p.fecha_registro,
    notas: p.notas || ''
  }));
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
  // Validar que ciudadId sea un número válido
  if (!ciudadId || isNaN(ciudadId)) {
    return []; // Retorna array vacío si no es válido
  }
  
  const result = await pool.query(
    'SELECT id, nombre, codigo_postal FROM "Zona" WHERE ciudad_id = $1 ORDER BY nombre', 
    [ciudadId]
  );
  return result.rows;
};

export const getZonaById = async (zonaId) => {
  if (!zonaId || isNaN(zonaId)) {
    return null;
  }
  const result = await pool.query(
    `SELECT z.id, z.nombre, z.ciudad_id, z.codigo_postal,
            c.nombre AS ciudad_nombre, c.estado_id,
            e.nombre AS estado_nombre
     FROM "Zona" z
     JOIN "Ciudad" c ON z.ciudad_id = c.id
     JOIN "Estado" e ON c.estado_id = e.id
     WHERE z.id = $1`,
    [zonaId]
  );
  return result.rows[0] || null;
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
/**
 * Obtiene los tipos de documento disponibles
 */
export const getTiposDocumento = async () => {
  const result = await pool.query(`
    SELECT id, nombre, descripcion, requerido, 
           aplica_inmueble, aplica_propietario 
    FROM "TipoDocumento" 
    ORDER BY nombre
  `);
  return result.rows.map(t => ({
    id: t.id,
    nombre: t.nombre,
    descripcion: t.descripcion || '',
    requerido: t.requerido,
    aplicaInmueble: t.aplica_inmueble,
    aplicaPropietario: t.aplica_propietario
  }));
};

/**
 * Obtiene todos los datos necesarios para modificar o ver un inmueble,
 * incluyendo datos del inmueble si se proporciona un inmuebleId.
 * @param {number|null} inmuebleId - ID del inmueble a obtener (opcional).
 * @returns {Object} - Datos agregados para modificar/ver inmueble.
 */
export const getAllModificarInmuebleData = async (inmuebleId = null) => {
  const client = await pool.connect();
  try {
    // Fetch dropdown and related data in parallel
    const [
      tipoInmuebles,
      estadoInmuebles,
      asesores,
      propietariosPersona,
      propietariosEmpresa,
      estados,
      tipoNegocios,
      caracteristicas,
      estadoCivil,
      tiposDocumento
    ] = await Promise.all([
      getTipoInmuebles(),
      getEstadoInmuebles(),
      getAsesores(),
      getPropietariosPersona(),
      getPropietariosEmpresa(),
      getEstados(),
      getTipoNegocios(),
      getCaracteristicas(),
      getEstadoCivil(),
      getTiposDocumento()
    ]);

    // Initialize inmuebleData as null
    let inmuebleData = null;

    if (inmuebleId) {
      // Fetch inmueble main data
      const inmuebleResult = await client.query(`
        SELECT i.*, 
               up.zona_id, up.direccion_exacta, up.referencia, up.coordenadas, up.mapa_url
        FROM "Inmueble" i
        LEFT JOIN "UbicacionInmueble" up ON i.id = up.inmueble_id
        WHERE i.id = $1
      `, [inmuebleId]);

      if (inmuebleResult.rowCount === 0) {
        throw new Error('Inmueble no encontrado');
      }

      inmuebleData = inmuebleResult.rows[0];

      // Fetch inmueble tipoNegocios
      const tipoNegociosResult = await client.query(`
        SELECT tipo_negocio_id AS id, precio, moneda, disponible, comision
        FROM "InmuebleTipoNegocio"
        WHERE inmueble_id = $1
      `, [inmuebleId]);
      inmuebleData.tipoNegocios = tipoNegociosResult.rows;

      // Fetch inmueble caracteristicas
      const caracteristicasResult = await client.query(`
        SELECT ic.caracteristica_id AS id, c.nombre, c.tipo_id, ic.valor, ic.cantidad
        FROM "InmuebleCaracteristica" ic
        JOIN "Caracteristica" c ON ic.caracteristica_id = c.id
        WHERE ic.inmueble_id = $1
      `, [inmuebleId]);
      inmuebleData.caracteristicas = caracteristicasResult.rows;

      // Fetch inmueble imagenes
      const imagenesResult = await client.query(`
        SELECT id, ruta, orden, titulo, descripcion, es_portada, subido_por
        FROM "ImagenInmueble"
        WHERE inmueble_id = $1
        ORDER BY orden
      `, [inmuebleId]);
      inmuebleData.imagenes = imagenesResult.rows;

      // Fetch inmueble documentos
      const documentosResult = await client.query(`
        SELECT id, tipo_id, nombre_archivo, ruta, tamano, subido_por, valido, validado_por, fecha_validacion, observaciones, fecha_vencimiento
        FROM "Documento"
        WHERE inmueble_id = $1
      `, [inmuebleId]);
      inmuebleData.documentos = documentosResult.rows;

      // Fetch propietario info (persona or empresa)
      if (inmuebleData.propietario_persona_id) {
        const propietarioPersonaResult = await client.query(`
          SELECT id, nombre, apellido, documento_identidad, telefono, correo, direccion, fecha_nacimiento, estado_civil_id, fecha_registro, notas
          FROM "PropietarioPersona"
          WHERE id = $1
        `, [inmuebleData.propietario_persona_id]);
        inmuebleData.propietario = propietarioPersonaResult.rows[0] || null;
        inmuebleData.propietarioTipo = 'persona';
      } else if (inmuebleData.propietario_empresa_id) {
        const propietarioEmpresaResult = await client.query(`
          SELECT pe.id, e.nombre, e.rif, e.telefono, e.correo, e.direccion, pe.representante_legal, pe.documento_representante, pe.fecha_registro, pe.notas
          FROM "PropietarioEmpresa" pe
          JOIN "Empresa" e ON pe.empresa_id = e.id
          WHERE pe.id = $1
        `, [inmuebleData.propietario_empresa_id]);
        inmuebleData.propietario = propietarioEmpresaResult.rows[0] || null;
        inmuebleData.propietarioTipo = 'empresa';
      }
    }

    return {
      tipoInmuebles,
      estadoInmuebles,
      asesores,
      propietariosPersona,
      propietariosEmpresa,
      estados,
      tipoNegocios,
      caracteristicas,
      estadoCivil,
      tiposDocumento,
      inmuebleData
    };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};




/**
 * Actualiza un inmueble existente y sus datos relacionados en una transacción.
 * @param {number} inmuebleId - ID del inmueble a actualizar.
 * @param {Object} inmuebleData - Datos del inmueble y relacionados.
 * @returns {Object} - El inmueble actualizado con sus relaciones.
 */
export const updateInmueble = async (inmuebleId, inmuebleData) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

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

    // Actualizar tabla Inmueble
    const inmuebleUpdateQuery = `
      UPDATE "Inmueble" 
      SET 
        codigo = $1,
        titulo = $2,
        descripcion = $3,
        tipo_inmueble_id = $4,
        estado_id = $5,
        asesor_id = $6,
        propietario_persona_id = $7,
        propietario_empresa_id = $8,
        area_construida = $9,
        area_terreno = $10,
        habitaciones = $11,
        banos = $12,
        estacionamientos = $13,
        niveles = $14,
        ano_construccion = $15,
        amueblado = $16,
        climatizado = $17
      WHERE id = $18
      RETURNING *`;

    const inmuebleResult = await client.query(inmuebleUpdateQuery, [
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
      climatizado,
      inmuebleId
    ]);

    if (inmuebleResult.rowCount === 0) {
      throw new Error('Inmueble no encontrado');
    }

    const inmueble = inmuebleResult.rows[0];

    // Actualizar ubicación (upsert)
    const ubicacionUpsertQuery = `
      INSERT INTO "UbicacionInmueble" (inmueble_id, zona_id, direccion_exacta, referencia, coordenadas)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (inmueble_id) 
      DO UPDATE SET
        zona_id = EXCLUDED.zona_id,
        direccion_exacta = EXCLUDED.direccion_exacta,
        referencia = EXCLUDED.referencia,
        coordenadas = EXCLUDED.coordenadas`;

    await client.query(ubicacionUpsertQuery, [
      inmueble.id,
      zonaId,
      direccionExacta,
      referencia,
      coordenadas
    ]);

    // Eliminar y recrear tipos de negocio
    await client.query('DELETE FROM "InmuebleTipoNegocio" WHERE inmueble_id = $1', [inmueble.id]);
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

    // Eliminar y recrear características
    await client.query('DELETE FROM "InmuebleCaracteristica" WHERE inmueble_id = $1', [inmueble.id]);
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

    // Eliminar y recrear imágenes
    await client.query('DELETE FROM "ImagenInmueble" WHERE inmueble_id = $1', [inmueble.id]);
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

    // Eliminar y recrear documentos del inmueble
    await client.query('DELETE FROM "Documento" WHERE inmueble_id = $1', [inmueble.id]);
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
