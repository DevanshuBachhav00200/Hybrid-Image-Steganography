import os
import time
from pathlib import Path
from app.core.config import settings
from app.core.logging import logger
from app.utils.file_utils import ensure_directory_exists


class CleanupService:
    """
    Background storage management service responsible for purging expired temporary
    uploaded files from app/temp/uploads/.
    """

    def clean_expired_uploads(self, expiration_seconds: int = None) -> int:
        """
        Scan temporary upload directory and delete files exceeding expiration threshold.
        Returns count of purged files.
        """
        if expiration_seconds is None:
            expiration_seconds = settings.TEMP_FILE_EXPIRATION_SECONDS

        upload_dir = ensure_directory_exists(settings.TEMP_UPLOADS_DIRECTORY)
        now = time.time()
        purged_count = 0

        logger.info(f"CleanupService: Scanning '{upload_dir}' for files older than {expiration_seconds}s")
        
        try:
            for file_path in upload_dir.glob("*"):
                if file_path.is_file() and not file_path.name.startswith("."):
                    file_age = now - file_path.stat().st_mtime
                    if file_age > expiration_seconds:
                        try:
                            os.remove(file_path)
                            purged_count += 1
                            logger.info(f"CleanupService: Purged expired temp file '{file_path.name}' (age: {file_age:.0f}s)")
                        except Exception as exc:
                            logger.error(f"CleanupService: Failed to remove file '{file_path.name}': {str(exc)}")
        except Exception as exc:
            logger.error(f"CleanupService: Error scanning upload directory: {str(exc)}")

        return purged_count
