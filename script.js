
function bufToHex(buffer) { //inside the function, it will convert the raw buffer to a hexadecimal string representation. example: "0 => "00", "255" => "ff" when joined = "00ff"
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes, b => b.toString(16).padStart(2, "0")).join("");
}

const ALGORITHM_MAP = { //this takes the HTML input and maps it to the correct algorithm name used by the Web Crypto API
  SHA1: "SHA-1",
  SHA256: "SHA-256",
  SHA512: "SHA-512",
};

function normalizeAlgorithm(name) {
  return String(name || "").trim().toUpperCase(); //takes the input name, converts it to a string, trims whitespace, and converts it to uppercase
}

async function computeHash(text, algorithm) {
  const name = normalizeAlgorithm(algorithm);

  if (name === "MD5") { //md5 is an outdated algorithm and is not supported by the web crypto api, so I use the cryptojs library instead
    if (!(window.CryptoJS && CryptoJS.MD5)) {
      throw new Error("MD5 requires the CryptoJS library."); //if for some reason somethings wrong with the library, it will let the user know instead of nothing happening
    }
    return CryptoJS.MD5(text).toString(CryptoJS.enc.Hex);
  }  

  const webName = ALGORITHM_MAP[name]; //this is defensive check to make sure the algorithm is supported
  if (!webName) {
    throw new Error(`Unsupported algorithm: ${name}`);
  }
  if (!(window.crypto && crypto.subtle)) {
    throw new Error("This browser does not support hashing.");
  }

  const data = new TextEncoder().encode(text); //takes the inputed text and encodes it into a Uint8Array, which is the format required by the Web Crypto API
  const buffer = await crypto.subtle.digest(webName, data); //the Uint8Array is then encrypted using the specified algorithm, which them returns it ot the ArrayBuffer format. Basically it wont make the whole page freeze while the hashing is being computed
  return bufToHex(buffer); //finally, the ArrayBuffer is converted to a hexadecimal string using the bufToHex function defined earlier in line 1
}

async function generateHash(algorithm) {  //this function is called when the user clicks the "Generate Hash" button
  const inputEl = document.getElementById("TextBox");
  const outputEl = document.getElementById("OutputText");
  if (!inputEl || !outputEl) return;

  const text = (inputEl.value ?? "").trim();
  if (!text) {
    outputEl.value = "";
    return;
  }

  try {
    outputEl.value = "Computing...";
    const hex = await computeHash(text, algorithm); //runs the actual hashing function
    outputEl.value = hex;
  } catch (err) {
    outputEl.value = err?.message || "Error generating hash."; //if something goes wrong, it will display an error message to the user, just in case
  }
}

window.generateHash = generateHash;

document.addEventListener("keydown", (event) => {
  const active = document.activeElement;
  const inTextBox = active && active.id === "TextBox";
  if (inTextBox && event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    generateHash("SHA256");
  }
});