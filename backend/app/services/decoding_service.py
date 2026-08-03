from app.schemas.requests import DecodeRequest
from app.schemas.responses import DecodeResponse


class DecodingService:
    """
    Service handling extraction -> Binary Decoding -> AES Decryption -> Morse Decoding workflow.
    """
    def decode(self, request: DecodeRequest) -> DecodeResponse:
        """
        Execute payload extraction and decryption from stego image.
        Raises NotImplementedError until algorithm modules are implemented in Phase 3B.
        """
        raise NotImplementedError("Decoding pipeline not implemented yet.")
