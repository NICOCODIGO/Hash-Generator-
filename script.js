// script.js

function bufToHex(buffer) {
  const bytes = new Uint8Array(buffer);
  const hexArray = Array.from(bytes);
  const hexString = hexArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
  return hexString;
}

async function generateHash(algorithm) {
  const inputElement = document.getElementById("TextBox");
  const outputElement = document.getElementById("OutputText");

  if (!inputElement || !outputElement) {
    return;
  }

  const text = inputElement.value || "";

  if (!text.trim()) {
    outputElement.value = "";
    return;
  }

  const selectedAlgorithm = String(algorithm).toUpperCase();

  if (selectedAlgorithm === "MD5") {
    if (window.CryptoJS && CryptoJS.MD5) {
      try {
        const md5Hash = CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);
        outputElement.value = md5Hash;
      } catch (error) {
        console.error(error);
        outputElement.value = "Error generating MD5 hash.";
      }
    } else {
      outputElement.value = "MD5 requires the CryptoJS library.";
    }
    return;
  }

  const algorithmMap = {
    SHA1: "SHA-1",
    SHA256: "SHA-256",
    SHA512: "SHA-512"
  };

  const webCryptoAlgorithm = algorithmMap[selectedAlgorithm];

  if (!webCryptoAlgorithm || !window.crypto || !crypto.subtle) {
    outputElement.value = "This browser does not support hashing.";
    return;
  }

  try {
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(webCryptoAlgorithm, encodedText);
    const hashHex = bufToHex(hashBuffer);
    outputElement.value = hashHex;
  } catch (error) {
    console.error(error);
    outputElement.value = "Error generating hash.";
  }
}

document.addEventListener("keydown", (event) => {
  const isTextBoxFocused = document.activeElement && document.activeElement.id === "TextBox";
  if (event.key === "Enter" && !event.shiftKey && isTextBoxFocused) {
    event.preventDefault();
    generateHash("SHA256");
  }
});
