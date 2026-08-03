from app.processing.morse.interfaces import MorseProcessor

class MorseProcessingService(MorseProcessor):
    def text_to_morse(self, text: str) -> str:
        raise NotImplementedError("Morse encoding module not implemented yet.")

    def morse_to_text(self, morse: str) -> str:
        raise NotImplementedError("Morse decoding module not implemented yet.")
