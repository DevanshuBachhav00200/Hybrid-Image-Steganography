from app.schemas.requests import EncodeRequest
from app.schemas.responses import EncodeResponse
from app.core.enums import StatusType


class EncodingService:
    """
    Service handling Morse -> AES -> Binary -> LSB/DCT/DWT encoding workflow.
    """
    def encode(self, request: EncodeRequest) -> EncodeResponse:
        """
        Execute steganographic message encoding into image.
        Raises NotImplementedError until algorithm modules are implemented in Phase 3B.
        """
        raise NotImplementedError("Encoding pipeline not implemented yet.")
