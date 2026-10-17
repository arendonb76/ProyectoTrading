#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Address, BytesN, Env};

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Evidence {
    pub owner: Address,
    pub registered_at: u64,
}

#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Evidence(BytesN<32>),
}

#[contract]
pub struct TradingEvidence;

#[contractimpl]
impl TradingEvidence {
    /// Registra una huella SHA-256 de 32 bytes.
    ///
    /// Devuelve:
    /// - true: la evidencia fue registrada.
    /// - false: ese hash ya existía y no fue sobrescrito.
    pub fn register_decision(env: Env, owner: Address, decision_hash: BytesN<32>) -> bool {
        owner.require_auth();

        let key = DataKey::Evidence(decision_hash);
        let storage = env.storage().persistent();

        if storage.has(&key) {
            return false;
        }

        let evidence = Evidence {
            owner,
            registered_at: env.ledger().timestamp(),
        };

        storage.set(&key, &evidence);

        true
    }

    /// Recupera la evidencia asociada a un hash.
    pub fn get_decision(env: Env, decision_hash: BytesN<32>) -> Option<Evidence> {
        let key = DataKey::Evidence(decision_hash);

        env.storage().persistent().get(&key)
    }

    /// Indica si una huella ya está registrada.
    pub fn exists(env: Env, decision_hash: BytesN<32>) -> bool {
        let key = DataKey::Evidence(decision_hash);

        env.storage().persistent().has(&key)
    }
}

mod test;
