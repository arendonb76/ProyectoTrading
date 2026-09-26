# Propuesta individual

**Nombre:** Alejandro Rendon Blandon

**Usuario de GitHub:** arendonb76

---

## El problema

> El problema en una sola frase, sin mencionar blockchain.

Un trader que opera con un agente automático no puede demostrar que las decisiones, señales y órdenes que el sistema registró son exactamente las que existían antes de conocer el resultado de la operación.

## ¿Quién lo sufre?

> Quién tiene el problema y en qué situación lo vive.

Lo sufre un trader individual que utiliza un agente automático de trading para operar en mercados financieros. Lo vive en el momento en que necesita auditar su propio historial: cuando revisa su journal de operaciones, no tiene forma de probar que los datos que ve (la señal original, el precio esperado, los parámetros, el timestamp o incluso el backtest asociado) no fueron modificados después de que se conociera el resultado de la operación. Esta situación se vuelve crítica cuando el trader quiere presentar su track record ante un inversionista, un auditor o una entidad reguladora, o simplemente cuando quiere confiar en su propio sistema sin depender de la palabra del administrador de la base de datos.

## ¿Cómo se resuelve hoy y qué cuesta?

> Cómo lo resuelven hoy las personas afectadas y qué les cuesta en dinero, tiempo o esfuerzo.

Hoy el trader confía en el journal que genera su propio sistema, que vive en una base de datos controlada por él mismo o por el proveedor del agente. Como no existe una prueba independiente de que ese registro no fue alterado, las alternativas son costosas: contratar un auditor externo que revise manualmente los logs (alto costo en dinero y tiempo), exportar capturas de pantalla o archivos con firmas digitales simples (frágiles y fáciles de falsificar), o simplemente aceptar el riesgo de que su historial no sea creíble. El costo principal es la pérdida de confianza: sin una prueba verificable, el trader no puede demostrar que su estrategia es real y no un ajuste posterior a los resultados.

## ¿Por qué creo que blockchain podría aportar?

> Hipótesis personal, no certeza, apoyada en al menos un criterio de la Sesión 1: partes que no confían entre sí comparten un registro, histórico inalterable, o eliminar un intermediario que concentra la confianza.

Mi hipótesis es que blockchain podría aportar porque cumple con el criterio de **histórico inalterable** visto en la Sesión 1: el registro de las decisiones del agente quedaría anclado con un hash y un timestamp en una red distribuida, de modo que ni siquiera el administrador de la aplicación (el propio trader o el proveedor del sistema) pueda reescribir el pasado. No se trata de guardar toda la estrategia ni datos confidenciales en la red, sino solo una huella mínima (timestamp + activo + tipo de decisión + hash) que permita verificar después que el archivo original coincide exactamente con lo que se registró antes de conocer el resultado. Así, el trader tendría una prueba independiente de que su historial de decisiones no fue manipulado, sin depender de un tercero que concentre la confianza.
