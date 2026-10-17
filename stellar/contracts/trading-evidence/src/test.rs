#![cfg(test)]

use super::*;

use soroban_sdk::{
    testutils::{Address as _, Ledger as _},
    Address, BytesN, Env,
};

#[test]
fn register_and_get_decision() {
    let env = Env::default();
    env.mock_all_auths();

    env.ledger().set_timestamp(1_760_000_000);

    let contract_id = env.register(TradingEvidence, ());
    let client = TradingEvidenceClient::new(&env, &contract_id);

    let owner = Address::generate(&env);
    let decision_hash = BytesN::from_array(&env, &[7u8; 32]);

    let created = client.register_decision(&owner, &decision_hash);

    assert!(created);
    assert!(client.exists(&decision_hash));

    let evidence = client
        .get_decision(&decision_hash)
        .expect("evidence should exist");

    assert_eq!(evidence.owner, owner);
    assert_eq!(evidence.registered_at, 1_760_000_000);
}

#[test]
fn duplicate_hash_cannot_be_overwritten() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register(TradingEvidence, ());
    let client = TradingEvidenceClient::new(&env, &contract_id);

    let first_owner = Address::generate(&env);
    let second_owner = Address::generate(&env);
    let decision_hash = BytesN::from_array(&env, &[9u8; 32]);

    env.ledger().set_timestamp(100);

    assert!(client.register_decision(&first_owner, &decision_hash,));

    env.ledger().set_timestamp(200);

    assert!(!client.register_decision(&second_owner, &decision_hash,));

    let evidence = client
        .get_decision(&decision_hash)
        .expect("evidence should still exist");

    assert_eq!(evidence.owner, first_owner);
    assert_eq!(evidence.registered_at, 100);
}

#[test]
fn unknown_hash_does_not_exist() {
    let env = Env::default();

    let contract_id = env.register(TradingEvidence, ());
    let client = TradingEvidenceClient::new(&env, &contract_id);

    let decision_hash = BytesN::from_array(&env, &[3u8; 32]);

    assert!(!client.exists(&decision_hash));
    assert_eq!(client.get_decision(&decision_hash), None);
}
