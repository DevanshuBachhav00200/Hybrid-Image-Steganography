# Binary Conversion Module

Production-grade binary bitstream serialization and deserialization engine for the **Hybrid Image Steganography System**.

---

## 📌 Header & Bitstream Layout

### 1. Fixed Binary Header (16 Bytes)

Packed using big-endian struct format `>5sBBIB2sH`:

| Offset | Field | Type | Size | Description |
| :--- | :--- | :--- | :--- | :--- |
| `0..4` | Magic Bytes | `char[5]` | 5 Bytes | `b"STEGO"` |
| `5` | Version | `uint8` | 1 Byte | Format version (`1`) |
| `6` | Algorithm ID | `uint8` | 1 Byte | `1` (AES-256-GCM) |
| `7..10` | Payload Length | `uint32` | 4 Bytes | Big-endian payload byte length |
| `11` | Header Size | `uint8` | 1 Byte | Fixed size (`16` bytes) |
| `12..13`| Reserved | `bytes[2]`| 2 Bytes | Reserved padding (`\x00\x00`) |
| `14..15`| Checksum | `uint16` | 2 Bytes | CRC16 checksum over payload |

---

### 2. Complete Bitstream Layout

```
[HEADER (16 Bytes)] -> [Nonce (12 Bytes)] -> [Salt (16 Bytes)] -> [Auth Tag (16 Bytes)] -> [Ciphertext (N Bytes)]
```

Converted to MSB-first binary string representation (`'0101...'`).

---

## 🚀 Usage Example

```python
from app.processing.binary.service import BinaryService

binary_service = BinaryService()

aes_payload = {
    "ciphertext": "...",
    "salt": "...",
    "nonce": "...",
    "authentication_tag": "...",
    "algorithm": "AES-256-GCM",
    "key_length": 256,
    "iterations": 100000,
}

# Serialization to binary bitstream
bitstream = binary_service.serialize(aes_payload)
print(f"Total bits: {len(bitstream)}")

# Deserialization back to payload dictionary
reconstructed_payload = binary_service.deserialize(bitstream)
assert reconstructed_payload == aes_payload
```

---

## 🧪 Testing

Execute unit tests:
```bash
pytest tests/test_binary.py
```
