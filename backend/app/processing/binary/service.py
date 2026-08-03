from app.processing.binary.interfaces import BinaryConverter

class BinaryProcessingService(BinaryConverter):
    def text_to_binary(self, text: str) -> str:
        raise NotImplementedError("Binary conversion module not implemented yet.")

    def binary_to_text(self, binary: str) -> str:
        raise NotImplementedError("Binary decoding module not implemented yet.")
