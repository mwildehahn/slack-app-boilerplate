import crypto from "crypto";

// Must be 256 bytes (32 chars)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// For AES, this is always 16
const IV_LENGTH = 16;

export function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    new Buffer(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text) {
  const parts = text.split(":");
  const iv = new Buffer(parts.shift(), "hex");
  const encrypted = new Buffer(parts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    new Buffer(ENCRYPTION_KEY),
    iv
  );

  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
}

export default {
  encrypt,
  decrypt
};
