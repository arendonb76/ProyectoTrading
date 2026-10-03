# Product Blueprint

## Bitácora Verificable de Decisiones de Trading

## 1. Priorización de historias

Las historias se priorizaron según una pregunta central: ¿qué funcionalidades son necesarias para demostrar que una decisión del agente ya existía antes de conocer su resultado?

### Imprescindibles

1. Registrar la evidencia de una decisión en el momento en que el agente la toma.
2. Verificar posteriormente una decisión contra la evidencia registrada.
3. Detectar si el registro original fue modificado.
4. Confirmar que la evidencia quedó registrada correctamente.

### Debería

5. Consultar un historial de decisiones verificables.

### Podría

6. Facilitar al auditor o inversionista una consulta independiente del historial.

La funcionalidad central del MVP es el ciclo **registrar → confirmar → verificar**. Sin él, el producto no resuelve el problema identificado en el Problem Brief.

---

## 2. Propuesta de valor

Para un trader que utiliza un agente automático y necesita demostrar que su historial de decisiones no fue modificado después de conocer los resultados, la Bitácora Verificable de Decisiones de Trading ofrece una evidencia independiente de cada decisión tomada por el sistema.

Actualmente el trader depende del journal almacenado en su propia base de datos o en la del proveedor del agente. Aunque ese historial pueda contener toda la información de la operación, quien administra la base de datos también tiene capacidad técnica para modificarla. Esto limita la credibilidad del registro cuando debe presentarse ante un inversionista, auditor o cualquier tercero.

La solución cambia ese punto del recorrido. En el momento en que el agente toma una decisión, el sistema genera una huella única del registro y la ancla antes de que se conozca el resultado de la operación. Más adelante, cualquier modificación del archivo produce una huella diferente y puede ser detectada.

El usuario obtiene así una forma sencilla de demostrar que una decisión concreta ya existía en un momento determinado, sin publicar su estrategia, sus parámetros confidenciales ni toda la información del journal. La diferencia frente al proceso actual es que la prueba ya no depende únicamente de la base de datos controlada por el trader.

---

## 3. Flujo de usuario

### Entrada

El trader utiliza su agente automático de trading de la forma habitual. Cuando el agente genera una decisión, el sistema dispone del registro original de esa decisión antes de que se conozca el resultado de la operación.

### Pasos intermedios

1. El agente genera una decisión de trading.
2. La aplicación prepara un registro mínimo de la decisión.
3. La aplicación genera una huella única de ese registro.
4. El trader solicita registrar la evidencia.
5. La aplicación envía la evidencia y espera su confirmación.
6. La aplicación guarda la referencia del registro confirmado.
7. Posteriormente se conoce el resultado de la operación.
8. Cuando el trader, auditor o inversionista quiere comprobar la decisión, entrega el registro original.
9. La aplicación vuelve a calcular su huella y la compara con la evidencia previamente registrada.

### Salida

La aplicación muestra uno de dos resultados:

- **Verificación correcta:** el registro presentado coincide exactamente con el registrado originalmente.
- **Verificación fallida:** el archivo fue modificado o no corresponde a la evidencia registrada.

De esta manera, el usuario termina el recorrido con una prueba verificable sobre la integridad de la decisión original.

---

## 4. Alcance del MVP

El MVP se limitará a demostrar una sola capacidad: que una decisión de trading registrada antes de conocer su resultado puede ser verificada posteriormente y que cualquier modificación puede detectarse.

La funcionalidad imprescindible será registrar una decisión, generar su huella, confirmar que la evidencia quedó registrada y permitir posteriormente verificar el archivo original.

El MVP no necesita conectarse a un broker real ni operar dinero. Las decisiones podrán generarse mediante datos simulados o registros de prueba. Tampoco necesita ejecutar una estrategia de trading, calcular rentabilidad, gestionar portafolios ni evaluar si una decisión fue buena o mala. Esos elementos pertenecen al sistema de trading y no al problema que este producto intenta resolver.

También quedan fuera del MVP los perfiles públicos, notificaciones, dashboards avanzados, pagos, gestión de inversionistas, contratos financieros y almacenamiento completo del journal en la red.

Este recorte sigue entregando valor porque permite demostrar el supuesto central del proyecto: que una evidencia externa registrada antes del resultado permite detectar modificaciones posteriores. Si ese ciclo funciona, las integraciones con sistemas reales pueden añadirse después sin cambiar la propuesta principal.

---

## 5. Lean Canvas

[Ver Lean Canvas](./LeanCanvas.md)

---

## 6. Backlog priorizado

El backlog del proyecto se gestiona mediante GitHub Projects.

**Tablero Kanban:**  
[AGREGAR AQUÍ URL DEL GITHUB PROJECT]

Las historias priorizadas incluyen criterios de aceptación dentro de cada tarjeta.

---

## 7. Arquitectura inicial

La arquitectura separa deliberadamente los datos privados del trader de la evidencia que necesita ser verificable.

El agente de trading, o un simulador durante el MVP, genera una decisión. Una capa de lógica de la aplicación convierte esa decisión en una representación consistente y calcula su huella criptográfica. El archivo completo permanece fuera de Stellar y puede almacenarse localmente por el trader.

La aplicación utiliza el SDK de Stellar para enviar únicamente la huella a Stellar Testnet mediante una transacción. Una vez confirmada, almacena localmente la referencia de la transacción y la información necesaria para encontrar posteriormente esa evidencia.

La función de verificación realiza el proceso inverso: recibe el registro original, calcula nuevamente su huella y consulta la evidencia registrada en Stellar. Si ambas coinciden, la aplicación indica que el registro conserva exactamente el mismo contenido que tenía cuando fue anclado.

En esta versión no es necesario un contrato inteligente porque no existen reglas condicionales que ejecutar. Stellar funciona como la capa externa de evidencia verificable, mientras que la interfaz y la lógica de negocio permanecen en la aplicación.

```mermaid
flowchart LR
    A[Agente de trading o simulador] --> B[Registro de decisión]
    B --> C[Generador de huella]
    C --> D[Archivo local]
    C --> E[Stellar SDK]
    E --> F[Stellar Testnet]
    F --> G[Confirmación y referencia]
    G --> H[Verificador]
    D --> H
    H --> I[Coincide / No coincide]