
Esta arquitectura sigue muy de cerca el criterio de la Sesión 4: **solo va a la red lo que varias partes necesitan verificar**, y el propio ejemplo del curso plantea registrar únicamente el sello/hash en lugar de poner toda la información en blockchain.

---

# 3. `docs/semana2/LeanCanvas.md`

Así cumplimos el requisito de que el Lean Canvas esté disponible mediante **imagen o enlace** sin obligarte ahora a diseñar un gráfico externo. `ProductBlueprint.md` enlaza este documento.

```markdown
# Lean Canvas

## Bitácora Verificable de Decisiones de Trading

| Área | Contenido |
|---|---|
| **Problema** | Un trader que utiliza un agente automático no puede demostrar que las decisiones de su historial no fueron modificadas después de conocerse los resultados. |
| **Segmento de usuarios** | Trader individual que utiliza agentes automáticos. Como usuarios secundarios de la verificación: auditores e inversionistas. |
| **Propuesta de valor única** | Demostrar que una decisión ya existía antes de conocer su resultado, sin revelar la estrategia ni almacenar información confidencial en una red pública. |
| **Solución** | Generar una huella de cada decisión, registrarla antes del resultado y permitir posteriormente verificar el archivo original contra esa evidencia. |
| **Canales** | Comunidades de trading algorítmico y cuantitativo, GitHub, integración directa con agentes automáticos y demostraciones técnicas. |
| **Métricas clave** | Porcentaje de decisiones registradas antes del resultado; verificaciones correctas; modificaciones detectadas; tiempo necesario para registrar una evidencia. |
| **Ventaja diferencial** | La evidencia se genera automáticamente en el momento de la decisión y preserva la privacidad porque solo se publica una huella del registro. |
| **Estructura de costos** | Desarrollo y mantenimiento de la aplicación, almacenamiento de registros privados, infraestructura de ejecución y comisiones de red. |
| **Flujo de ingresos** | Posible suscripción para traders o equipos cuantitativos; acceso API o servicios de verificación para terceros. En el MVP no se valida todavía el modelo de ingresos. |