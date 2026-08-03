from app.schemas.requests import MetricsRequest
from app.schemas.responses import MetricsResponse


class MetricsService:
    """
    Service handling quality metrics (PSNR, SSIM, MSE) and execution history queries.
    """
    def calculate_metrics(self, request: MetricsRequest) -> MetricsResponse:
        """
        Calculate quality and distortion metrics for a specific operation.
        Raises NotImplementedError until metric calculators are implemented in Phase 3C.
        """
        raise NotImplementedError("Metrics calculation engine not implemented yet.")

    def get_history(self) -> MetricsResponse:
        """
        Retrieve historical metric analysis operations.
        Raises NotImplementedError until persistence layer is active.
        """
        raise NotImplementedError("Metrics history not implemented yet.")

    def get_system_metrics(self) -> MetricsResponse:
        """
        Retrieve backend system performance and load metrics.
        Raises NotImplementedError until monitoring is implemented.
        """
        raise NotImplementedError("System metrics telemetry not implemented yet.")
