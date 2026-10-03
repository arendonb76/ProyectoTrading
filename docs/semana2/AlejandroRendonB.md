# Historias de usuario - Alejandro Rendon Blandon

**Proyecto:** Bitácora Verificable de Decisiones de Trading  
**Usuario de GitHub:** arendonb76

## Mis historias de usuario

### 1. Registrar una decisión

Como trader que utiliza un agente automático, quiero registrar la evidencia de una decisión en el momento en que el agente la toma, para poder demostrar después que esa decisión existía antes de conocer su resultado.

### 2. Verificar una decisión

Como auditor o inversionista, quiero verificar una decisión utilizando su registro original, para comprobar que la información presentada no fue modificada posteriormente.

### 3. Detectar modificaciones

Como trader, quiero saber si un registro de decisión fue modificado después de su creación, para evitar presentar como auténtica información que ya no coincide con la original.

### 4. Confirmar que una decisión quedó registrada

Como trader, quiero conocer si la evidencia de una decisión quedó registrada correctamente, para tener certeza de que podré verificarla posteriormente.

### 5. Consultar el historial

Como trader, quiero consultar las decisiones que cuentan con evidencia verificable, para revisar qué operaciones de mi historial pueden ser demostradas ante un tercero.

### 6. Verificar sin depender del trader

Como auditor o inversionista, quiero consultar la evidencia de una decisión sin depender de la base de datos administrada por el trader, para realizar una validación independiente.

## Orden de importancia

1. Registrar una decisión.
2. Verificar una decisión.
3. Detectar modificaciones.
4. Confirmar que una decisión quedó registrada.
5. Verificar sin depender del trader.
6. Consultar el historial.

La historia más importante es **registrar una decisión**, porque sin crear evidencia en el momento en que el agente toma la decisión no existe nada que pueda verificarse posteriormente. Es el punto donde el producto cambia el proceso actual: la decisión deja de depender únicamente del journal administrado por el trader y obtiene una evidencia independiente antes de que se conozca el resultado de la operación.

La segunda historia es verificarla, porque la evidencia solo entrega valor si un tercero puede comprobarla. Las demás historias mejoran esa capacidad central, pero el MVP podría funcionar inicialmente con registrar y verificar.