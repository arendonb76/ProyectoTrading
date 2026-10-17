import { Networks } from "@stellar/stellar-sdk";

import {
  StellarWalletsKit,
} from "@creit.tech/stellar-wallets-kit/sdk";

import {
  defaultModules,
} from "@creit.tech/stellar-wallets-kit/modules/utils";


StellarWalletsKit.init({
  modules: defaultModules(),
});

StellarWalletsKit.setNetwork(Networks.TESTNET);

let walletAddress = null;

const connectWalletButton =
  document.getElementById("connectWalletButton");

const walletStatus =
  document.getElementById("walletStatus");

const walletAddressElement =
  document.getElementById("walletAddress");


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
        <td class="pending">Pendiente Testnet</td>
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