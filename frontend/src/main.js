import {
  Networks,
  rpc,
  xdr,
} from "@stellar/stellar-sdk";

import {
  StellarWalletsKit,
} from "@creit.tech/stellar-wallets-kit/sdk";

import {
  defaultModules,
} from "@creit.tech/stellar-wallets-kit/modules/utils";

import {
  Client as TradingEvidenceClient,
} from "./contract-client/src/index.ts";

StellarWalletsKit.init({
  modules: defaultModules(),
});

StellarWalletsKit.setNetwork(Networks.TESTNET);

const CONTRACT_ID =
  "CCPJNMXZCTLAZGYIZXKMDTXLU4PDIDO5AK67GQW23OPA6C3KPEB35QM3";

const RPC_URL =
  "https://soroban-testnet.stellar.org";

const rpcServer =
  new rpc.Server(RPC_URL);

let walletAddress = null;

const connectWalletButton =
  document.getElementById("connectWalletButton");

const walletStatus =
  document.getElementById("walletStatus");

const walletAddressElement =
  document.getElementById("walletAddress");

const registerStellarButton =
  document.getElementById(
    "registerStellarButton"
  );

const stellarStatus =
  document.getElementById(
    "stellarStatus"
  );

const stellarWriteResult =
  document.getElementById(
    "stellarWriteResult"
  );

registerStellarButton.addEventListener(
  "click",
  async () => {

    stellarWriteResult.style.display =
      "block";

    if (!currentEvidence) {
      stellarWriteResult.textContent =
        "Primero debes generar una evidencia.";
      return;
    }

    if (!walletAddress) {
      stellarWriteResult.textContent =
        "Primero debes conectar tu wallet.";
      return;
    }

    registerStellarButton.disabled = true;

    try {

      stellarStatus.className = "pending";

      stellarStatus.textContent =
        "Preparando transacción...";

      stellarWriteResult.textContent =
        "Simulando registro en Stellar Testnet...";

      const client =
        getTradingEvidenceClient();

      const decisionHash =
        xdr.decodeBytes(
          currentEvidence.hash,
          "hex"
        );

      /*
       * Esta llamada construye y simula.
       * Todavía NO firma ni modifica Stellar.
       */
      const tx =
        await client.register_decision({
          owner: walletAddress,
          decision_hash: decisionHash,
        });

      /*
       * Nuestro contrato devuelve false
       * si el hash ya existe.
       *
       * No tiene sentido pedir firma
       * en ese caso.
       */
      if (tx.result !== true) {
        stellarStatus.className = "pending";

        stellarStatus.textContent =
          "Ya registrada";

        stellarWriteResult.textContent =
          [
            "Esta evidencia ya existe en Stellar.",
            "",
            `Hash: ${currentEvidence.hash}`,
            "",
            "No se solicitó una nueva firma.",
          ].join("\n");

        return;
      }

      stellarStatus.textContent =
        "Esperando firma...";

      stellarWriteResult.textContent =
        [
          "La simulación fue correcta.",
          "",
          "Revisa la transacción en tu wallet.",
        ].join("\n");

      /*
       * Aquí se abrirá Freighter.
       */
      await tx.sign();

      if (!tx.signed) {
        throw new Error(
          "La wallet no devolvió una transacción firmada."
        );
      }

      const transactionHash =
        bytesToHex(
          tx.signed.hash()
        );

      stellarStatus.textContent =
        "Enviando...";

      stellarWriteResult.textContent =
        [
          "Transacción firmada.",
          "",
          `Transaction hash: ${transactionHash}`,
          "",
          "Enviando a Stellar Testnet...",
        ].join("\n");

      /*
       * Envía la transacción ya firmada
       * y espera su resultado.
       */
      const sent =
        await tx.send();

      if (sent.result !== true) {
        throw new Error(
          "Stellar confirmó la transacción, pero el contrato no devolvió true."
        );
      }

      stellarStatus.className = "success";

      stellarStatus.textContent =
        "Confirmada";

      currentEvidence.stellarStatus =
        "CONFIRMED";

      currentEvidence.transactionHash =
        transactionHash;

      currentEvidence.owner =
        walletAddress;

      const history =
        JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

      const existingIndex =
        history.findIndex(
            item => item.hash === currentEvidence.hash
        );

      if (existingIndex >= 0) {
        history[existingIndex] = currentEvidence;
      } else {
        history.unshift(currentEvidence);
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
      );

      renderHistory();

      stellarWriteResult.textContent =
        [
          "✓ Evidencia registrada en Stellar Testnet",
          "",
          `Hash de evidencia: ${currentEvidence.hash}`,
          "",
          `Wallet: ${walletAddress}`,
          "",
          `Transaction hash: ${transactionHash}`,
        ].join("\n");

    } catch (error) {

      console.error(error);

      stellarStatus.className = "error";

      stellarStatus.textContent =
        "Error";

      stellarWriteResult.textContent =
        [
          "✗ No se pudo registrar la evidencia.",
          "",
          error?.message ?? String(error),
        ].join("\n");

    } finally {

      registerStellarButton.disabled =
        false;
    }
  }
);

 async function signWithConnectedWallet(
  transactionXdr,
  options = {}
) {
  if (!walletAddress) {
    throw new Error(
      "Debes conectar una wallet antes de firmar."
    );
  }

  return StellarWalletsKit.signTransaction(
    transactionXdr,
    {
      address: walletAddress,
      networkPassphrase:
        options.networkPassphrase ??
        Networks.TESTNET,
    }
  );
}


function getTradingEvidenceClient() {
  if (!walletAddress) {
    throw new Error(
      "Debes conectar una wallet antes de registrar evidencia."
    );
  }

  return new TradingEvidenceClient({
    contractId: CONTRACT_ID,
    rpcUrl: RPC_URL,
    networkPassphrase: Networks.TESTNET,
    publicKey: walletAddress,
    signTransaction: signWithConnectedWallet,
    timeoutInSeconds: 300,
  });
}


function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
}

connectWalletButton.addEventListener(
  "click",
  async () => {

    try {
      walletStatus.textContent =
        "Esperando conexión...";

      const { address } =
        await StellarWalletsKit.authModal();

      walletAddress = address;

      walletStatus.textContent =
        "Conectada a Stellar Testnet";

      walletAddressElement.textContent =
        walletAddress;

      connectWalletButton.textContent =
        "Cambiar billetera";

    } catch (error) {
      console.error(error);

      walletStatus.textContent =
        "No se pudo conectar la billetera";

      walletAddressElement.textContent = "";
    }
  }
);

const checkStellarButton =
  document.getElementById("checkStellarButton");

const stellarReadResult =
  document.getElementById("stellarReadResult");


checkStellarButton.addEventListener(
  "click",
  async () => {

    const hash =
      document
        .getElementById("expectedHash")
        .value
        .trim()
        .toLowerCase();

    stellarReadResult.style.display = "block";

    if (!/^[0-9a-f]{64}$/.test(hash)) {
      stellarReadResult.textContent =
        "Hash inválido. Debe contener exactamente 64 caracteres hexadecimales.";
      return;
    }

    checkStellarButton.disabled = true;
    checkStellarButton.textContent =
      "Consultando Stellar...";

    stellarReadResult.textContent =
      "Consultando contrato en Stellar Testnet...";

    try {

      const decisionHash =
        xdr.decodeBytes(hash, "hex");

      const existsResponse =
        await rpcServer.queryContract(
          CONTRACT_ID,
          "exists",
          {
            decision_hash: decisionHash,
          },
          Networks.TESTNET
        );

      if (!existsResponse.result) {
        stellarReadResult.textContent =
          [
            "Evidencia no encontrada en Stellar.",
            "",
            `Hash: ${hash}`,
            `Lectura sin firma: ${existsResponse.isReadCall}`,
          ].join("\n");

        return;
      }

      const evidenceResponse =
        await rpcServer.queryContract(
          CONTRACT_ID,
          "get_decision",
          {
            decision_hash: decisionHash,
          },
          Networks.TESTNET
        );

      const evidence =
        evidenceResponse.result;

      if (!evidence) {
        throw new Error(
          "El contrato indicó que existe la evidencia, pero no devolvió sus datos."
        );
      }

      const owner =
        typeof evidence.owner === "string"
          ? evidence.owner
          : evidence.owner?.toString?.() ??
            String(evidence.owner);

      const registeredAt =
        Number(evidence.registered_at);

      const registeredDate =
        new Date(
          registeredAt * 1000
        ).toISOString();

      stellarReadResult.textContent =
        [
          "✓ Evidencia encontrada en Stellar Testnet",
          "",
          `Hash: ${hash}`,
          `Owner: ${owner}`,
          `Timestamp: ${registeredAt}`,
          `Fecha UTC: ${registeredDate}`,
          `Lectura sin firma: ${evidenceResponse.isReadCall}`,
        ].join("\n");

    } catch (error) {

      console.error(error);

      stellarReadResult.textContent =
        [
          "✗ Error consultando Stellar Testnet",
          "",
          error?.message ?? String(error),
        ].join("\n");

    } finally {

      checkStellarButton.disabled = false;

      checkStellarButton.textContent =
        "Consultar evidencia en Stellar";
    }
  }
);

const STORAGE_KEY = "trading-proof-demo";

  let currentEvidence = null;

  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById("decisionAt").value =
    now.toISOString().slice(0, 16);


  function canonicalRecord() {

    return {
      version: "1",
      symbol: document
        .getElementById("symbol")
        .value
        .trim()
        .toUpperCase(),

      action: document
        .getElementById("action")
        .value,

      price: Number(
        document.getElementById("price").value
      ).toFixed(4),

      decisionAt: new Date(
        document.getElementById("decisionAt").value
      ).toISOString(),

      modelVersion: document
        .getElementById("modelVersion")
        .value
        .trim()
    };
  }


  async function sha256(text) {

    const data =
      new TextEncoder().encode(text);

    const digest =
      await crypto.subtle.digest("SHA-256", data);

    return [...new Uint8Array(digest)]
      .map(byte => byte.toString(16).padStart(2, "0"))
      .join("");
  }


  document
    .getElementById("generateButton")
    .addEventListener("click", async () => {

      const record = canonicalRecord();

      const canonical =
        JSON.stringify(record);

      const hash =
        await sha256(canonical);

      currentEvidence = {
        id: crypto.randomUUID(),
        record,
        canonical,
        hash,
        createdAt: new Date().toISOString(),
        stellarStatus: "PENDING_INTEGRATION"
      };

      document
        .getElementById("evidenceId")
        .textContent = currentEvidence.id;

      document
        .getElementById("canonical")
        .textContent = canonical;

      document
        .getElementById("hash")
        .textContent = hash;

      document
        .getElementById("verifyJson")
        .value = canonical;

      document
        .getElementById("expectedHash")
        .value = hash;

      document
        .getElementById("resultCard")
        .style.display = "block";
    });


  document
    .getElementById("saveButton")
    .addEventListener("click", () => {

      if (!currentEvidence) return;

      const history =
        JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );

      history.unshift(currentEvidence);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
      );

      renderHistory();

      alert("Evidencia guardada localmente.");
    });


  document
    .getElementById("verifyButton")
    .addEventListener("click", async () => {

      const json =
        document
          .getElementById("verifyJson")
          .value
          .trim();

      const expected =
        document
          .getElementById("expectedHash")
          .value
          .trim()
          .toLowerCase();

      const calculated =
        await sha256(json);

      const output =
        document.getElementById("verificationResult");

      if (calculated === expected) {

        output.className = "success";

        output.textContent =
          "✓ Verificación correcta: el registro coincide con la evidencia.";

      } else {

        output.className = "error";

        output.textContent =
          "✗ Verificación fallida: el registro fue modificado o no corresponde a esta evidencia.";
      }
    });


  function renderHistory() {

    const history =
      JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

    const table =
      document.getElementById("historyTable");

    table.innerHTML = "";

    history.forEach(item => {

      const row =
        document.createElement("tr");

      row.innerHTML = `
        <td>${item.record.symbol}</td>
        <td>${item.record.action}</td>
        <td>${new Date(item.record.decisionAt).toLocaleString()}</td>
        <td><code>${item.hash.slice(0, 12)}...</code></td>
        <td class="${item.stellarStatus === "CONFIRMED" ? "success" : "pending"}">
            ${item.stellarStatus === "CONFIRMED" ? "Confirmada" : "Pendiente Testnet"}
        </td>
      `;

      table.appendChild(row);
    });
  }


  document
    .querySelectorAll(".tab")
    .forEach(button => {

      button.addEventListener("click", () => {

        document
          .querySelectorAll(".tab")
          .forEach(b => b.classList.remove("active"));

        document
          .querySelectorAll("section")
          .forEach(section =>
            section.classList.remove("active")
          );

        button.classList.add("active");

        document
          .getElementById(button.dataset.target)
          .classList.add("active");

        if (button.dataset.target === "historial") {
          renderHistory();
        }
      });
    });


  renderHistory();