import pytest
from app.processing.morse.service import MorseService
from app.processing.morse.exceptions import (
    UnsupportedCharacterException,
    InvalidMorseCodeException,
)
from app.processing.morse.constants import CHAR_TO_MORSE


@pytest.fixture
def morse_service():
    return MorseService()


# 1. Single Character Encoding & Decoding
def test_single_character_encoding(morse_service):
    assert morse_service.encode("A") == ".-"
    assert morse_service.encode("s") == "..."
    assert morse_service.decode(".-") == "A"
    assert morse_service.decode("...") == "S"


# 2. Entire Alphabet (A-Z, a-z)
def test_entire_alphabet(morse_service):
    alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    encoded = morse_service.encode(alphabet)
    decoded = morse_service.decode(encoded)
    assert decoded == alphabet

    lowercase_alphabet = "abcdefghijklmnopqrstuvwxyz"
    encoded_lower = morse_service.encode(lowercase_alphabet)
    decoded_lower = morse_service.decode(encoded_lower)
    assert decoded_lower == alphabet


# 3. Numeric Digits (0-9)
def test_numbers(morse_service):
    numbers = "0123456789"
    encoded = morse_service.encode(numbers)
    decoded = morse_service.decode(encoded)
    assert decoded == numbers


# 4. Punctuation & Symbols
def test_punctuation_and_symbols(morse_service):
    symbols = ".,?!:;'\"@&()+-/=_$"
    encoded = morse_service.encode(symbols)
    decoded = morse_service.decode(encoded)
    assert decoded == symbols


# 5. Spaces & Multi-Word Sentences
def test_multi_word_sentence(morse_service):
    sentence = "HELLO WORLD"
    expected_morse = "...././.-../.-../--- .--/---/.-./.-../-.."
    encoded = morse_service.encode(sentence)
    assert encoded == expected_morse

    decoded = morse_service.decode(encoded)
    assert decoded == sentence


# 6. Invalid / Unsupported Character Exception
def test_unsupported_character_exception(morse_service):
    with pytest.raises(UnsupportedCharacterException) as excinfo:
        morse_service.encode("HELLO # WORLD")
    assert excinfo.value.character == "#"
    assert "Unsupported character '#'" in str(excinfo.value)


# 7. Invalid Morse Code Sequence Exception
def test_invalid_morse_code_exception(morse_service):
    invalid_morse = "...././.-../.-.. /............"  # Unrecognized 12-dot sequence
    with pytest.raises(InvalidMorseCodeException) as excinfo:
        morse_service.decode(invalid_morse)
    assert excinfo.value.sequence == "............"
    assert "Unrecognized Morse code sequence" in str(excinfo.value)


# 8. Round-Trip Conversion Fidelity
@pytest.mark.parametrize(
    "text",
    [
        "FASTAPI BACKEND SYSTEM 2026",
        "STGANOGRAPHY SYSTEM @ DEVANSHU!",
        "TEST (PAYLOAD) + 123 - 456 / 789 = OK",
        "SECRET_MESSAGE$PAYLOAD",
    ],
)
def test_round_trip_fidelity(morse_service, text):
    encoded = morse_service.encode(text)
    decoded = morse_service.decode(encoded)
    assert decoded == text


# 9. Large Messages Performance & Correctness
def test_large_message(morse_service):
    large_text = ("THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG 1234567890 . , ! ? " * 100).strip()
    encoded = morse_service.encode(large_text)
    decoded = morse_service.decode(encoded)
    assert decoded == large_text


# 10. Empty String & Null Input Validation
def test_empty_string_and_null_inputs(morse_service):
    with pytest.raises(ValueError):
        morse_service.encode("")

    with pytest.raises(ValueError):
        morse_service.encode(None)

    with pytest.raises(ValueError):
        morse_service.decode("")

    with pytest.raises(ValueError):
        morse_service.decode(None)

    with pytest.raises(ValueError):
        morse_service.validate(None)

    with pytest.raises(ValueError):
        morse_service.validate("")


# 11. Supported Characters Method
def test_supported_characters(morse_service):
    supported = morse_service.supported_characters()
    assert "A" in supported
    assert "0" in supported
    assert "@" in supported
    assert " " in supported
    assert len(supported) == len(CHAR_TO_MORSE) + 1
