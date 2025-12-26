# Dashboard Operativo con Métricas en Tiempo Real

## Arquitectura

El dashboard operativo combina:

- **MCP (eventos)** → **API metrics** → **Ionic Dashboard** → **Mermaid (estructura)** → **Cards / Badges / KPIs (datos vivos)**

## Componentes

### 1. Servicio de Métricas (PilotMetricsService)

- `getMetrics()`: Obtiene métricas reales del endpoint `/api/mcp/metrics/today`
- Interfaz `PilotMetrics`: Define la estructura de datos

### 2. Servicio de Demostración (DemoMetricsService)

- `getDemoMetrics()`: Proporciona datos mockeados para demostraciones
- `simulateEvent()`: Simula eventos para actualizar métricas en tiempo real
- `toggleMode()`: Cambia entre modo piloto/demo en el dashboard

### 3. Dashboard (PilotDashboardPage)

- Visualiza métricas operativas del día
- Muestra horas ahorradas como KPI principal
- Incluye el diagrama Mermaid como mapa visual del flujo
- Permite cambiar entre modo piloto y demo con un toggle
- Controles de simulación en modo demo

## Endpoints del Backend

### `/mcp/metrics/today` (GET)

Devuelve las métricas operativas del día actual:

```json
{
  "sales_ml": 24,
  "pos_tx": 18,
  "onboardings": 3,
  "errors_prevented": 12,
  "minutes_saved_today": 150,
  "timestamp": "2025-12-26T10:30:00.123456"
}
```

### `/mcp/metrics/event` (POST)

Registra eventos que actualizan las métricas:

```json
{
  "event_type": "ml_sale | pos_transaction | onboarding_completed | error_prevented"
}
```

## Métricas Clave

- **Ventas ML**: Ventas realizadas a través del marketplace
- **POS QR**: Transacciones realizadas vía POS QR
- **Onboarding**: Usuarios nuevos dados de alta
- **Errores evitados**: Errores prevenidos por el sistema
- **Horas ahorradas hoy**: Tiempo ahorrado en minutos (convertido a horas visualmente)

## Modo de Uso

### En Producción (Piloto)
1. El sistema opera con datos reales del MCP
2. Los eventos del MCP actualizan las métricas en tiempo real
3. El dashboard refleja el estado actual del negocio

### En Demostración
1. Toggle cambia a modo demo
2. Se usan datos mockeados para mostrar funcionalidad
3. Controles de simulación permiten demostrar el impacto de eventos
4. Ideal para presentaciones comerciales

## ROI Visual

La métrica principal "horas ahorradas hoy" comunica claramente el valor:

> "Cada flecha en el diagrama es tiempo que ya no pago en sueldo"

Esto convierte el dashboard en:
- Una UI de decisión
- Una herramienta comercial
- Un argumento de ROI vivo