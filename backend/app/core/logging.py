import sys
import logging
from app.core.config import settings

try:
    from loguru import logger as _loguru_logger
    USE_LOGURU = True
except ImportError:
    USE_LOGURU = False


if USE_LOGURU:
    class InterceptHandler(logging.Handler):
        def emit(self, record: logging.LogRecord) -> None:
            try:
                level = _loguru_logger.level(record.levelname).name
            except ValueError:
                level = record.levelno

            frame, depth = logging.currentframe(), 2
            while frame and frame.f_code.co_filename == logging.__file__:
                frame = frame.f_back
                depth += 1

            _loguru_logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())

    def setup_logging() -> None:
        _loguru_logger.remove()
        _loguru_logger.add(
            sys.stdout,
            enqueue=True,
            backtrace=True,
            level=settings.LOG_LEVEL.upper(),
            format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
        )
        logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)
        for log_name in ("uvicorn", "uvicorn.error", "uvicorn.access", "fastapi"):
            mod_logger = logging.getLogger(log_name)
            mod_logger.handlers = [InterceptHandler()]

    setup_logging()
    logger = _loguru_logger

else:
    # Standard Python Logging Fallback
    def setup_standard_logging():
        logger_instance = logging.getLogger("stego_backend")
        logger_instance.setLevel(getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
        if not logger_instance.handlers:
            handler = logging.StreamHandler(sys.stdout)
            formatter = logging.Formatter(
                "[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s"
            )
            handler.setFormatter(formatter)
            logger_instance.addHandler(handler)
        return logger_instance

    logger = setup_standard_logging()

__all__ = ["logger"]
