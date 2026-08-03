# International Morse Code Module

Production-ready, high-performance Morse Code encoding and decoding module for the **Hybrid Image Steganography System**.

---

## 📌 Purpose

Converts plain text messages into International Morse Code representation (and vice-versa) as the initial processing stage of the steganographic embedding pipeline.

---

## ⚙️ Encoding Delimiters & Rules

- **Dot**: `.`
- **Dash**: `-`
- **Character Separator**: `/`
- **Word Separator**: ` ` (space)

### Example
`HELLO WORLD` $\rightarrow$ `...././.-../.-.. /---/.--/---/.-./.-../-..`

---

## 🔤 Supported Characters

- **Alphabetic**: `A-Z`, `a-z` (case-insensitive, normalized to uppercase)
- **Numeric**: `0-9`
- **Punctuation & Symbols**: `.`, `,`, `?`, `!`, `:`, `;`, `'`, `"`, `@`, `&`, `(`, `)`, `+`, `-`, `/`, `=`, `_`, `$`
- **Space**: ` `

---

## 🚀 Usage Example

```python
from app.processing.morse.service import MorseService

morse_service = MorseService()

# Encoding
morse_code = morse_service.encode("Hello World!")
print(morse_code)
# Output: "...././.-../.-.. /---/.--/---/.-./.-../-../-.-.--"

# Decoding
plain_text = morse_service.decode(morse_code)
print(plain_text)
# Output: "HELLO WORLD!"
```

---

## 🧪 Testing

Execute unit tests:
```bash
pytest tests/test_morse.py
```
