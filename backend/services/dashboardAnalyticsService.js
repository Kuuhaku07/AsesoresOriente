import pool from '../db.js';

/**
 * Enhanced dashboard analytics service with advanced statistics
 */
export const getEnhancedDashboardStats = async () => {
  const client = await pool.connect();
  try {
    // 1. Basic metrics (existing)
    const basicStats = await getBasicStats(client);
    
    // 2. Financial analytics
    const financialStats = await getFinancialStats(client);
    
    // 3. Performance metrics
    const performanceStats = await getPerformanceStats(client);
    
    // 4. Geographic distribution
    const geographicStats = await getGeographicStats(client);
    
    // 5. Time-based analytics
    const timeStats = await getTimeBasedStats(client);
    
    // 6. Market insights
    const marketInsights = await getMarketInsights(client);

    return {
      ...basicStats,
      ...financialStats,
      ...performanceStats,
      ...geographicStats,
      ...timeStats,
      ...marketInsights
    };
  } catch (error) {
    throw error;
  } finally {
    client.release();
  }
};

const getBasicStats = async (client) => {
  // Total properties
  const totalResult = await client.query('SELECT COUNT(*) as count FROM "Inmueble"');
  const totalProperties = parseInt(totalResult.rows[0].count);

  // Properties by type
  const typeResult = await client.query(`
    SELECT ti.nombre as type, COUNT(i.id) as count
    FROM "Inmueble" i
    JOIN "TipoInmueble" ti ON i.tipo_inmueble_id = ti.id
    GROUP BY ti.nombre
    ORDER BY count DESC
  `);

  // Properties by status
  const statusResult = await client.query(`
    SELECT ei.nombre as status, COUNT(i.id) as count, ei.color
    FROM "Inmueble" i
    JOIN "EstadoInmueble" ei ON i.estado_id = ei.id
    GROUP BY ei.nombre, ei.color
    ORDER BY count DESC
  `);

  return {
    totalProperties,
    propertiesByType: typeResult.rows,
    propertiesByStatus: statusResult.rows
  };
};

const getFinancialStats = async (client) => {
  // Total potential revenue
  const revenueResult = await client.query(`
    SELECT 
      SUM(itn.precio * COALESCE(itn.comision, 2.5) / 100) as total_potential_revenue,
      AVG(itn.precio) as avg_price,
      MIN(itn.precio) as min_price,
      MAX(itn.precio) as max_price
    FROM "InmuebleTipoNegocio" itn
    JOIN "Inmueble" i ON itn.inmueble_id = i.id
    WHERE itn.disponible = true
  `);

  // Revenue by agent
  const agentRevenueResult = await client.query(`
    SELECT 
      CONCAT(a.nombre, ' ', a.apellido) as agent,
      SUM(itn.precio * COALESCE(itn.comision, 2.5) / 100) as potential_revenue,
      COUNT(i.id) as property_count
    FROM "Asesor" a
    JOIN "Inmueble" i ON a.id = i.asesor_id
    JOIN "InmuebleTipoNegocio" itn ON i.id = itn.inmueble_id
    WHERE itn.disponible = true
    GROUP BY a.id, a.nombre, a.apellido
    ORDER BY potential_revenue DESC
    LIMIT 10
  `);

  // Price by type and location
  const priceByLocationResult = await client.query(`
    SELECT 
      ti.nombre as type,
      e.nombre as estado,
      AVG(itn.precio) as avg_price,
      COUNT(i.id) as count
    FROM "Inmueble" i
    JOIN "TipoInmueble" ti ON i.tipo_inmueble_id = ti.id
    JOIN "UbicacionInmueble" ui ON i.id = ui.inmueble_id
    JOIN "Zona" z ON ui.zona_id = z.id
    JOIN "Ciudad" c ON z.ciudad_id = c.id
    JOIN "Estado" e ON c.estado_id = e.id
    JOIN "InmuebleTipoNegocio" itn ON i.id = itn.inmueble_id
    GROUP BY ti.nombre, e.nombre
    ORDER BY avg_price DESC
  `);

  return {
    financialOverview: revenueResult.rows[0],
    agentRevenue: agentRevenueResult.rows,
    priceByLocation: priceByLocationResult.rows
  };
};

const getPerformanceStats = async (client) => {
  // Days on market by status - FIXED query
  const daysOnMarketResult = await client.query(`
    SELECT 
      ei.nombre as status,
      AVG(CASE 
        WHEN i.fecha_publicacion IS NOT NULL 
        THEN EXTRACT(DAY FROM (CURRENT_DATE - i.fecha_publicacion::timestamp))
        ELSE EXTRACT(DAY FROM (CURRENT_DATE - i.fecha_creacion::timestamp))
      END) as avg_days_on_market,
      COUNT(i.id) as count
    FROM "Inmueble" i
    JOIN "EstadoInmueble" ei ON i.estado_id = ei.id
    GROUP BY ei.nombre
  `);

  // Agent performance
  const agentPerformanceResult = await client.query(`
    SELECT 
      CONCAT(a.nombre, ' ', a.apellido) as agent,
      COUNT(i.id) as total_properties,
      COUNT(CASE WHEN ei.nombre = 'VENDIDO' THEN 1 END) as sold_properties,
      COUNT(CASE WHEN ei.nombre = 'DISPONIBLE' THEN 1 END) as available_properties,
      ROUND(
        COUNT(CASE WHEN ei.nombre = 'VENDIDO' THEN 1 END) * 100.0 / COUNT(i.id), 
        2
      ) as conversion_rate
    FROM "Asesor" a
    JOIN "Inmueble" i ON a.id = i.asesor_id
    JOIN "EstadoInmueble" ei ON i.estado_id = ei.id
    GROUP BY a.id, a.nombre, a.apellido
    ORDER BY total_properties DESC
  `);

  return {
    daysOnMarket: daysOnMarketResult.rows,
    agentPerformance: agentPerformanceResult.rows
  };
};

const getGeographicStats = async (client) => {
  // Properties by state
  const stateResult = await client.query(`
    SELECT 
      e.nombre as estado,
      COUNT(i.id) as count,
      AVG(itn.precio) as avg_price
    FROM "Inmueble" i
    JOIN "UbicacionInmueble" ui ON i.id = ui.inmueble_id
    JOIN "Zona" z ON ui.zona_id = z.id
    JOIN "Ciudad" c ON z.ciudad_id = c.id
    JOIN "Estado" e ON c.estado_id = e.id
    JOIN "InmuebleTipoNegocio" itn ON i.id = itn.inmueble_id
    GROUP BY e.nombre
    ORDER BY count DESC
  `);

  // Properties by city (top 10)
  const cityResult = await client.query(`
    SELECT 
      c.nombre as ciudad,
      e.nombre as estado,
      COUNT(i.id) as count,
      AVG(itn.precio) as avg_price
    FROM "Inmueble" i
    JOIN "UbicacionInmueble" ui ON i.id = ui.inmueble_id
    JOIN "Zona" z ON ui.zona_id = z.id
    JOIN "Ciudad" c ON z.ciudad_id = c.id
    JOIN "Estado" e ON c.estado_id = e.id
    JOIN "InmuebleTipoNegocio" itn ON i.id = itn.inmueble_id
    GROUP BY c.nombre, e.nombre
    ORDER BY count DESC
    LIMIT 10
  `);

  return {
    propertiesByState: stateResult.rows,
    propertiesByCity: cityResult.rows
  };
};

const getTimeBasedStats = async (client) => {
  // Properties created by month
  const monthlyResult = await client.query(`
    SELECT 
      TO_CHAR(DATE_TRUNC('month', fecha_creacion), 'YYYY-MM') as month,
      COUNT(*) as count
    FROM "Inmueble"
    WHERE fecha_creacion >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', fecha_creacion)
    ORDER BY month
  `);

  // Properties by day of week
  const dayOfWeekResult = await client.query(`
    SELECT 
      TO_CHAR(fecha_creacion, 'Day') as day,
      COUNT(*) as count
    FROM "Inmueble"
    WHERE fecha_creacion >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY TO_CHAR(fecha_creacion, 'Day'), EXTRACT(DOW FROM fecha_creacion)
    ORDER BY EXTRACT(DOW FROM fecha_creacion)
  `);

  return {
    propertiesByMonth: monthlyResult.rows,
    propertiesByDayOfWeek: dayOfWeekResult.rows
  };
};

const getMarketInsights = async (client) => {
  // Price distribution
  const priceDistributionResult = await client.query(`
    SELECT 
      CASE 
        WHEN precio < 50000 THEN '0-50K'
        WHEN precio < 100000 THEN '50K-100K'
        WHEN precio < 200000 THEN '100K-200K'
        WHEN precio < 500000 THEN '200K-500K'
        ELSE '500K+'
      END as price_range,
      COUNT(*) as count
    FROM "InmuebleTipoNegocio"
    WHERE disponible = true
    GROUP BY price_range
    ORDER BY min(precio)
  `);

  // Feature impact on price
  const featureImpactResult = await client.query(`
    SELECT 
      CASE WHEN amueblado THEN 'Amueblado' ELSE 'No Amueblado' END as feature,
      AVG(itn.precio) as avg_price,
      COUNT(i.id) as count
    FROM "Inmueble" i
    JOIN "InmuebleTipoNegocio" itn ON i.id = itn.inmueble_id
    WHERE itn.disponible = true
    GROUP BY amueblado
    
    UNION ALL
    
    SELECT 
      CASE WHEN climatizado THEN 'Climatizado' ELSE 'No Climatizado' END as feature,
      AVG(itn.precio) as avg_price,
      COUNT(i.id) as count
    FROM "Inmueble" i
    JOIN "InmuebleTipoNegocio" itn ON i.id = itn.inmueble_id
    WHERE itn.disponible = true
    GROUP BY climatizado
  `);

  return {
    priceDistribution: priceDistributionResult.rows,
    featureImpact: featureImpactResult.rows
  };
};
