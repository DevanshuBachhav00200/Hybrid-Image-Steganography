from pathlib import Path
from typing import Tuple, Dict, Any, Optional

from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import InvalidImageException, UploadFailedException
from app.schemas.upload import ImageMetadata
from app.utils.file_utils import ensure_directory_exists
from app.utils.image_utils import (
    generate_upload_id,
    extract_metadata,
    calculate_image_size,
    verify_integrity,
    delete_temp_file as remove_file,
)
from app.services.cleanup_service import CleanupService
from app.processing.image.loader import ImageLoader


class ImageService:
    """
    Enterprise Image Management Engine Service responsible for receiving, validating,
    loading, saving, managing metadata, and purging temporary cover & stego image files.
    """

    def __init__(self):
        self.upload_dir = ensure_directory_exists(settings.TEMP_UPLOADS_DIRECTORY)
        self.loader = ImageLoader()
        self.cleanup_service = CleanupService()

    def upload_image(self, file_bytes: bytes, filename: str) -> Tuple[str, ImageMetadata, Path]:
        """
        Ingest, validate, store temporarily, and extract metadata for an uploaded image file.
        Returns tuple of (upload_id, ImageMetadata, saved_file_path).
        """
        logger.info(f"ImageService.upload_image: Processing upload for '{filename}' ({len(file_bytes)} bytes)")
        
        # Generate unique upload UUID
        upload_id = generate_upload_id()

        # Validate image format, magic bytes, dimensions, and extract metadata
        meta = extract_metadata(file_bytes=file_bytes, filename=filename, upload_id=upload_id)

        # Construct unique temporary storage path
        safe_filename = f"{upload_id}_{Path(filename).name}"
        file_path = self.upload_dir / safe_filename

        # Write image bytes to temporary storage
        try:
            with open(file_path, "wb") as f:
                f.write(file_bytes)
            logger.info(f"ImageService.upload_image: Stored temp file at '{file_path}' [upload_id={upload_id}]")
        except Exception as exc:
            logger.error(f"ImageService.upload_image: Storage write failed for '{file_path}': {str(exc)}")
            raise UploadFailedException(f"Failed to write image file to temporary storage: {str(exc)}")

        return upload_id, meta, file_path

    def validate(self, file_bytes: bytes, filename: str) -> ImageMetadata:
        """
        Validate image format, header signatures, structural integrity, and dimension bounds.
        """
        logger.info(f"ImageService.validate: Validating image '{filename}'")
        dummy_id = generate_upload_id()
        return extract_metadata(file_bytes=file_bytes, filename=filename, upload_id=dummy_id)

    def load(self, upload_id: str) -> Tuple[bytes, ImageMetadata]:
        """
        Load image file bytes and metadata from temporary storage using upload_id.
        """
        logger.info(f"ImageService.load: Loading image [upload_id={upload_id}]")
        file_path = self.get(upload_id)
        if not file_path or not file_path.exists():
            raise InvalidImageException(f"Image upload ID '{upload_id}' not found or expired.")

        try:
            with open(file_path, "rb") as f:
                file_bytes = f.read()
            meta = extract_metadata(file_bytes=file_bytes, filename=file_path.name, upload_id=upload_id)
            return file_bytes, meta
        except Exception as exc:
            logger.error(f"ImageService.load: Error reading image file '{file_path}': {str(exc)}")
            raise InvalidImageException(f"Failed to read stored image file: {str(exc)}")

    def metadata(self, upload_id: str) -> ImageMetadata:
        """
        Retrieve ImageMetadata for an existing temporary upload.
        """
        _, meta = self.load(upload_id)
        return meta

    def get(self, upload_id: str) -> Optional[Path]:
        """
        Locate temporary image file path on disk by upload_id prefix.
        """
        for path in self.upload_dir.glob(f"{upload_id}_*"):
            if path.is_file():
                return path
        return None

    def delete(self, upload_id: str) -> bool:
        """
        Manually delete temporary image file by upload_id.
        """
        logger.info(f"ImageService.delete: Removing temp file [upload_id={upload_id}]")
        file_path = self.get(upload_id)
        if file_path and file_path.exists():
            return remove_file(str(file_path))
        return False

    def cleanup(self) -> int:
        """
        Trigger temporary file purge routine for expired upload files.
        """
        logger.info("ImageService.cleanup: Running purge routine for expired files")
        return self.cleanup_service.clean_expired_uploads()

    def prepare(self, file_bytes: bytes) -> bytes:
        """
        Prepare raw image bytes for processing modules (placeholder).
        """
        logger.info("ImageService.prepare: Preparing image buffer")
        img = self.loader.load_image(file_bytes)
        return file_bytes
