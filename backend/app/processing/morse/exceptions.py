from app.core.exceptions import StegoAppException


class MorseException(StegoAppException):
    """Base exception for all Morse code processing errors."""
    pass


class UnsupportedCharacterException(MorseException):
    """Raised when text contains a character not supported by Morse Code dictionary."""
    def __init__(self, character: str):
        super().__init__(f"Unsupported character '{character}' in Morse input.")
        self.character = character


class InvalidMorseCodeException(MorseException):
    """Raised when Morse string contains an unrecognized dot/dash sequence."""
    def __init__(self, sequence: str):
        super().__init__(f"Unrecognized Morse code sequence '{sequence}'.")
        self.sequence = sequence
