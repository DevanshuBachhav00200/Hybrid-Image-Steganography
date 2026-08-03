from typing import Set, List
from app.core.logging import logger
from app.processing.morse.interfaces import MorseInterface
from app.processing.morse.constants import (
    CHAR_TO_MORSE,
    MORSE_TO_CHAR,
    CHAR_SEPARATOR,
    WORD_SEPARATOR,
)
from app.processing.morse.exceptions import (
    UnsupportedCharacterException,
    InvalidMorseCodeException,
)


class MorseService(MorseInterface):
    """
    Production-ready International Morse Code processing service providing deterministic,
    high-performance O(1) text-to-Morse encoding and Morse-to-text decoding.
    """

    def normalize_text(self, text: str) -> str:
        """
        Normalize plain text input by trimming whitespace and converting to uppercase.
        """
        if text is None:
            raise ValueError("Input plain text cannot be None.")
        return text.strip().upper()

    def split_words(self, morse: str) -> List[str]:
        """
        Split Morse code string into word components using space delimiter.
        """
        if not morse:
            return []
        return morse.strip().split(WORD_SEPARATOR)

    def split_characters(self, word_morse: str) -> List[str]:
        """
        Split Morse word string into individual character codes using slash delimiter.
        """
        if not word_morse:
            return []
        return word_morse.split(CHAR_SEPARATOR)

    def lookup_encode(self, char: str) -> str:
        """
        Perform O(1) lookup to convert single character to Morse code sequence.
        Raises UnsupportedCharacterException for invalid characters.
        """
        if char in CHAR_TO_MORSE:
            return CHAR_TO_MORSE[char]
        raise UnsupportedCharacterException(char)

    def lookup_decode(self, code: str) -> str:
        """
        Perform O(1) lookup to convert single Morse code sequence back to character.
        Raises InvalidMorseCodeException for invalid Morse sequences.
        """
        if code in MORSE_TO_CHAR:
            return MORSE_TO_CHAR[code]
        raise InvalidMorseCodeException(code)

    def supported_characters(self) -> Set[str]:
        """
        Return the set of all supported characters.
        """
        chars = set(CHAR_TO_MORSE.keys())
        chars.add(" ")
        return chars

    def validate(self, text: str) -> bool:
        """
        Validate that input plain text contains supported Morse characters only.
        Raises UnsupportedCharacterException on first invalid character.
        """
        if text is None:
            raise ValueError("Input text cannot be None.")
        
        normalized = self.normalize_text(text)
        if not normalized:
            raise ValueError("Input plain text cannot be empty.")

        for char in normalized:
            if char != WORD_SEPARATOR and char not in CHAR_TO_MORSE:
                logger.warning(f"Morse Validation Failure: Unsupported character '{char}'")
                raise UnsupportedCharacterException(char)
        return True

    def encode(self, text: str) -> str:
        """
        Encode plain text into International Morse Code sequence.
        Example: "HELLO WORLD" -> "...././.-../.-.. /---/.--/---/.-./.-../-.."
        """
        if text is None:
            raise ValueError("Input text cannot be None.")
        
        normalized = self.normalize_text(text)
        if not normalized:
            raise ValueError("Input plain text message cannot be empty.")

        logger.info(f"Morse Encoding Started: Input length {len(normalized)} characters")

        words = normalized.split(WORD_SEPARATOR)
        encoded_words = []

        for word in words:
            if not word:
                continue
            morse_chars = [self.lookup_encode(char) for char in word]
            encoded_words.append(CHAR_SEPARATOR.join(morse_chars))

        morse_result = WORD_SEPARATOR.join(encoded_words)
        logger.info(f"Morse Encoding Completed: Encoded length {len(morse_result)} Morse symbols")
        return morse_result

    def decode(self, morse: str) -> str:
        """
        Decode International Morse Code sequence back to original plain text string.
        Example: "...././.-../.-.. /---/.--/---/.-./.-../-.." -> "HELLO WORLD"
        """
        if morse is None:
            raise ValueError("Input Morse string cannot be None.")
        
        trimmed = morse.strip()
        if not trimmed:
            raise ValueError("Input Morse string cannot be empty.")

        logger.info(f"Morse Decoding Started: Input length {len(trimmed)} Morse symbols")

        words = self.split_words(trimmed)
        decoded_words = []

        for word in words:
            if not word:
                continue
            char_codes = self.split_characters(word)
            decoded_chars = [self.lookup_decode(code) for code in char_codes if code]
            decoded_words.append("".join(decoded_chars))

        plain_result = WORD_SEPARATOR.join(decoded_words)
        logger.info(f"Morse Decoding Completed: Decoded length {len(plain_result)} characters")
        return plain_result
