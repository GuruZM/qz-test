import logo from "./logo.svg";
import "./App.css";
import React from "react";
import qz from "qz-tray";
function App() {
  // Setup dummy certificate + signature
  qz.security.setCertificatePromise((resolve) => {
    resolve(
      "-----BEGIN CERTIFICATE-----\nFAKE_CERT\n-----END CERTIFICATE-----"
    );
  });

  qz.security.setSignaturePromise((toSign) => {
    return (resolve) => {
      resolve("FAKE_SIGNATURE");
    };
  });

  // List printers
  const listPrinters = async () => {
    try {
      await qz.websocket.connect();
      const printers = await qz.printers.find();
      console.log("printers", printers);

      await qz.websocket.disconnect();
    } catch (err) {
      console.error(err);
      alert("Error: " + err);
    }
  };
  const printPDF = async () => {
    try {
      await qz.websocket.connect();

      // PDF path relative to public folder
      const pdfUrl = `${window.location.origin}/dummy.pdf`;

      const config = qz.configs.create("EPSON TM-T20III Receipt"); // or your printer name

      const data = [
        {
          type: "pdf",
          format: "url",
          data: pdfUrl,
        },
      ];

      await qz.print(config, data);
      alert("PDF print job sent!");
      await qz.websocket.disconnect();
    } catch (err) {
      console.error("PDF Print Error:", err);
      alert("Error: " + err);
    }
  };

  // Print test page
  const printTest = async () => {
    try {
      await qz.websocket.connect();
      const config = qz.configs.create("EPSON TM-T20III Receipt"); // Exact printer name from OS
      const data = ["^XA^FO50,50^ADN,36,20^FDRAW ZPL EXAMPLE^FS^XZ"];
      // default printer
      qz.print(config, data).then(function () {
        alert("Sent data to printer");
      });

      // await qz.websocket.disconnect();
    } catch (err) {
      console.error(err);
      alert("Error: " + err);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>QZ Tray React Test</h1>
      <button onClick={listPrinters} style={{ marginRight: "1rem" }}>
        Show Printers
      </button>
      <button onClick={printTest}>Print Test Page</button>
      <button onClick={printPDF}>Print PDF</button>
    </div>
  );
}
export default App;
