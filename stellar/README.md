# Trading Evidence - Soroban Contract

Contrato Soroban del proyecto **Bitácora Verificable de Decisiones de Trading**.

Su función es registrar en Stellar Testnet una huella SHA-256 de una decisión de trading sin almacenar en blockchain el registro completo ni la estrategia del trader.

## Contrato

Ruta:

```text
contracts/trading-evidence/
```

Contract ID desplegado en Testnet:

```text
CCPJNMXZCTLAZGYIZXKMDTXLU4PDIDO5AK67GQW23OPA6C3KPEB35QM3
```

WASM SHA-256:

```text
7382e5b2ac655eea9dd07725f934a29b8520ec79e368a253c4ffbbe5fbc8c56b
```

Los datos del despliegue se encuentran en:

```text
deployments/testnet.json
```

## API

El contrato expone tres métodos:

```text
register_decision(owner, decision_hash)
get_decision(decision_hash)
exists(decision_hash)
```

### `register_decision`

Registra una nueva evidencia.

El `owner` debe autorizar la operación mediante:

```rust
owner.require_auth();
```

Si el `decision_hash` ya existe, el contrato devuelve:

```text
false
```

y no sobrescribe la evidencia existente.

Si el hash no existe, almacena:

```text
owner
registered_at
```

y devuelve:

```text
true
```

### `get_decision`

Consulta una evidencia por su hash.

Devuelve:

```text
Option<Evidence>
```

### `exists`

Indica si un hash ya se encuentra registrado.

Devuelve:

```text
true / false
```

## Invariante principal

Un mismo `decision_hash` solo puede registrarse una vez mientras la entrada correspondiente permanezca disponible en el almacenamiento del contrato.

Esto permite impedir que una evidencia existente sea sustituida posteriormente por otra versión.

## Almacenamiento

El contrato utiliza:

```rust
env.storage().persistent()
```

El registro completo de trading no se almacena on-chain.

Cada entrada contiene únicamente:

```text
owner
registered_at
```

Esta versión del MVP no implementa todavía una política explícita de extensión o restauración de TTL de Soroban.

## Requisitos

- Rust
- target `wasm32v1-none`
- Stellar CLI

## Tests

Desde este directorio:

```bash
cargo test
```

Los tests actuales validan:

1. registro y posterior consulta de una evidencia;
2. imposibilidad de sobrescribir un hash duplicado;
3. respuesta correcta para un hash inexistente.

## Build

Desde `stellar/`:

```bash
stellar contract build
```

El WASM de release se genera en:

```text
target/wasm32v1-none/release/trading_evidence.wasm
```

## Estructura

```text
stellar/
├── contracts/
│   └── trading-evidence/
│       ├── src/
│       │   ├── lib.rs
│       │   └── test.rs
│       ├── Cargo.toml
│       └── Makefile
├── deployments/
│   └── testnet.json
├── Cargo.toml
└── Cargo.lock
```

## Red

El contrato actual está desplegado exclusivamente en:

```text
Stellar Testnet
```

No está desplegado en Mainnet.
