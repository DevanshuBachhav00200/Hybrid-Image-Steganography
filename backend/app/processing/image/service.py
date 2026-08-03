from app.processing.image.interfaces import ImageTransformProcessor

class ImageProcessingService(ImageTransformProcessor):
    def resize_or_format(self, image_bytes: bytes) -> bytes:
        raise NotImplementedError("Image transformation processing module not implemented yet.")
