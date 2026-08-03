from typing import Dict, Any
from app.core.logging import logger


class ReportService:
    """
    Service generating benchmark and evaluation report documents in PDF, JSON, and HTML formats.
    """

    def generate_pdf(self, metrics_data: Dict[str, Any]) -> bytes:
        """
        Generate PDF report document for metrics comparison.
        Raises NotImplementedError until report module active.
        """
        logger.info("Executing ReportService.generate_pdf()")
        raise NotImplementedError("PDF report generation logic not implemented yet.")

    def generate_json(self, metrics_data: Dict[str, Any]) -> str:
        """
        Generate JSON report document for metrics comparison.
        Raises NotImplementedError until report module active.
        """
        logger.info("Executing ReportService.generate_json()")
        raise NotImplementedError("JSON report generation logic not implemented yet.")

    def generate_html(self, metrics_data: Dict[str, Any]) -> str:
        """
        Generate HTML report document for metrics comparison.
        Raises NotImplementedError until report module active.
        """
        logger.info("Executing ReportService.generate_html()")
        raise NotImplementedError("HTML report generation logic not implemented yet.")
