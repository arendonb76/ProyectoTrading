# Problem Brief

## Decisión del problema

### Problema elegido

> El problema ganador en una frase, sin mencionar blockchain, y quién lo propuso.

Bitacora Trading

### Por qué elegimos este

> Qué inclinó al equipo por este problema frente a los demás, según los criterios de la Sesión 1.

No hubo equipo para discutir ideas

### Propuestas descartadas

> Cada propuesta considerada, quién la propuso y el motivo del descarte.

No hubieron propuestas para descartar

### Cómo tomamos la decisión

> Cómo llegó el equipo al acuerdo: votación, consenso tras debate u otro.

No hubo acuerdo al no haber equipo

---

## Problem Brief

### Encabezado

**Nombre del proyecto:** Bitácora Verificable de Decisiones de Trading  
**Frase que describe el problema:** Un trader que opera con un agente automático no puede demostrar que su historial de decisiones no fue alterado después de conocer los resultados.

### Equipo y roles

Dado que el equipo no logró conformarse por falta de respuesta de los integrantes en el canal de coordinación, este entregable se desarrolla de forma individual.  
- **Integrante:** Alejandro Rendon Blandon  
- **Usuario de GitHub:** arendonb76 
- **Rol asumido:** Desarrollador, investigador y responsable único de todas las entregas.  
- **Canal de coordinación interna:** Discord del curso / WhatsApp del curso (sin interacción de otros integrantes).  
- **Responsable de las entregas:** Alejandro Rendon Blandon 

### Problema y evidencia

Un trader que utiliza un agente automático de trading no puede demostrar posteriormente que las decisiones, señales y órdenes registradas por el sistema son exactamente las que existían antes de conocer el resultado de la operación.  

El problema ocurre cada vez que el trader necesita auditar su historial. Su sistema guarda un *journal* en una base de datos que él mismo (o el proveedor del agente) controla, lo que significa que, en teoría, cualquier registro podría ser modificado después de conocido el resultado: la señal original, el precio esperado, los parámetros, el timestamp o incluso el backtest asociado.  

La evidencia surge de la experiencia propia en el desarrollo de sistemas de trading automatizado y de la observación directa de la fragilidad de los registros locales. No existe hoy una fuente externa e independiente que certifique que el archivo mostrado al inversionista o al auditor es el mismo que existía antes de la operación. El alcance es individual: afecta a cualquier trader que use agentes automáticos y necesite demostrar credibilidad.  

### Usuario y actores

**Usuario principal:** Un trader individual que opera con un agente automático de trading.  
**Qué necesita resolver:** Poder demostrar, ante terceros (inversionistas, auditores o incluso ante sí mismo), que su historial de decisiones es auténtico y no fue reescrito después de conocer los resultados.  

**Cómo lo resuelve hoy y qué le cuesta:**  
Hoy confía ciegamente en el *journal* de su propio sistema. Para darle mayor credibilidad, puede contratar un auditor externo (alto costo económico y de tiempo), exportar capturas de pantalla (fáciles de falsificar), o simplemente asumir el riesgo de no ser creído. El costo principal es la pérdida de confianza y de oportunidades de negocio.  

**Otros actores en el flujo:**  
- **Agente de trading:** Genera las señales y decisiones de forma autónoma.  
- **Broker:** Ejecuta las órdenes en el mercado real.  
- **Auditor / Inversionista:** Tercero que revisa el historial para validar la estrategia.  
- **Proveedor del sistema (si aplica):** Administra la base de datos donde vive el *journal*; concentra la confianza del registro.  

### Flujo actual de valor

El flujo actual de la información y el valor sigue esta secuencia:  

1. **Mercado:** El agente recibe datos de mercado en tiempo real.  
2. **Análisis y señal:** El agente procesa la información y genera una señal (ej. comprar AAPL).  
3. **Decisión:** El agente decide ejecutar la operación según sus parámetros.  
4. **Orden:** Se envía la orden al broker.  
5. **Ejecución:** El broker ejecuta la orden en el mercado.  
6. **Resultado:** Se conoce el resultado de la operación (ganancia o pérdida).  
7. **Journal:** El sistema registra todo en una base de datos local o en la nube del proveedor.  

**Intermediarios explícitos:**  
- El **broker** actúa como intermediario financiero (obligación normativa para operar en mercados regulados).  
- El **proveedor del sistema** o el propio trader administra la base de datos del *journal*, concentrando la confianza en que los registros no serán alterados.  

**Obligación normativa:** La ejecución a través de un broker regulado es un paso obligatorio para operar en mercados financieros formales.  

### Fricciones identificadas

1. **Fricción en el paso 7 (Journal):**  
   - **Qué ocurre:** El registro histórico vive en una base de datos centralizada y controlada por el propio trader o por el proveedor.  
   - **Causa:** No existe un mecanismo independiente que garantice que los datos no fueron modificados después de conocido el resultado.  
   - **A quién afecta:** Al trader, que no puede demostrar la autenticidad de su historial; y al auditor o inversionista, que no puede confiar plenamente en la información.  

2. **Fricción en el paso 3 (Decisión):**  
   - **Qué ocurre:** Los parámetros y la lógica de decisión pueden ser ajustados *a posteriori* para simular un mejor rendimiento.  
   - **Causa:** El código y los parámetros no quedan anclados a un registro inmutable.  
   - **A quién afecta:** Al trader, que pierde credibilidad; y al inversionista, que puede ser engañado.  

3. **Fricción en el paso 6 (Resultado):**  
   - **Qué ocurre:** La tentación de modificar el *journal* después de conocer el resultado es alta, y no hay forma de detectarlo.  
   - **Causa:** La base de datos permite ediciones sin dejar rastro verificable.  
   - **A quién afecta:** A todo el ecosistema de confianza alrededor de la estrategia.  

### Oportunidad e hipótesis

**Oportunidad priorizada:** Atacar la fricción del paso 7 (Journal), creando una **bitácora verificable de decisiones de trading**.  

**Motivo de la elección:** Es la fricción más crítica porque invalida todo el historial ante terceros. Si el registro no es confiable, ninguna otra mejora importa. Además, es técnicamente viable de resolver con un MVP pequeño.  

**Hipótesis inicial:** Si cada decisión del agente se registra en una red distribuida con un *hash* y un *timestamp* (sin guardar datos confidenciales), el trader podrá demostrar que su historial no fue manipulado. Blockchain aportaría porque el registro quedaría anclado de forma inmutable, y ni siquiera el administrador de la aplicación podría reescribir el pasado.  

**Qué cambiaría para el usuario:** El trader pasaría de "confiar en su propia base de datos" a "tener una prueba criptográfica independiente" de que sus decisiones son auténticas.  

### Criterio de pertinencia

Este caso requiere un registro distribuido y no una base de datos tradicional porque cumple con el criterio de **histórico inalterable** visto en la Sesión 1.  

En una base de datos tradicional (PostgreSQL, MySQL, etc.), el administrador siempre tiene la capacidad técnica de modificar registros, incluso si se implementan logs de auditoría, ya que estos también pueden ser alterados. La confianza sigue concentrada en una sola parte.  

En cambio, al anclar el *hash* de cada decisión en una red blockchain, el registro se vuelve inmutable: cualquier cambio en el archivo original produciría un *hash* diferente y la verificación fallaría. No se trata de guardar toda la estrategia en la red, sino solo una huella mínima que permita comprobar la integridad del historial.  

Además, se elimina la necesidad de un intermediario que concentre la confianza (el proveedor del sistema o el propio trader como administrador). La verificación queda en manos de cualquiera que consulte la red, sin depender de la palabra de un tercero.  

### Supuestos y riesgos

**Supuestos:**  
1. **Los traders están dispuestos a registrar hashes de sus decisiones en una red pública:** Si no ven valor en la verificabilidad, no adoptarán la solución.  
2. **El costo de registrar en la red es despreciable:** Para que sea viable, la red debe permitir transacciones de bajo costo (como Stellar) o incluso gratuitas.  
3. **La privacidad se mantiene:** El hecho de no subir datos confidenciales a la red (solo hashes) es suficiente para que el trader se sienta cómodo.  

**Qué podría invalidar la hipótesis:**  
- Que los traders no consideren relevante demostrar la autenticidad de su historial (falta de demanda).  
- Que el proceso de verificación sea tan complejo que el usuario prefiera seguir confiando en su base de datos centralizada.  
- Que la red elegida tenga fallas de seguridad o caídas que impidan el registro oportuno de las decisiones.  