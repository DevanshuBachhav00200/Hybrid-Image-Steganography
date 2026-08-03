# AES-256-GCM Cryptography Module

Production-grade authenticated encryption and key derivation module for the **Hybrid Image Steganography System**.

---

## 📌 Cryptography Standards & Security Decisions

- **Encryption Algorithm**: **AES-256-GCM** (Galois/Counter Mode). Provides authenticated encryption with associated data (AEAD) to prevent ciphertext tampering.
- **Key Derivation**: **PBKDF2-HMAC-SHA256** with **100,000 iterations** to mitigate brute-force and dictionary attacks.
- **Key Length**: 256 bits (32 bytes).
- **Salt Size**: 16 bytes (128 bits random per encryption).
- **Nonce Size**: 12 bytes (96 bits random per encryption).
- **Authentication Tag Size**: 16 bytes (128 bits MAC verification tag).

---

## 📦 Payload Structure

```json
{
  "ciphertext": "base64_encoded_string",
  "salt": "base64_encoded_string",
  "nonce": "base64_encoded_string",
  "authentication_tag": "base64_encoded_string",
  "algorithm": "AES-256-GCM",
  "key_length": 256,
  "iterations": 100000
}
```

---

## 🚀 Usage Example

```python
from app.processing.aes.service import AESService

aes_service = AESService()

# Encryption
password = "StrongPassword123!"
morse_payload = "...././.-../.-../---"

payload = aes_service.encrypt(morse_payload, password)
print(payload["ciphertext"])

# Decryption
decrypted = aes_service.decrypt(payload, password)
assert decrypted == morse_payload
```

---

## 🧪 Testing

Execute unit tests:
```bash
pytest tests/test_aes.py
```
