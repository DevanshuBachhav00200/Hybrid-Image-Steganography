import pytest
from app.services.metrics_service import MetricsService


def test_metrics_service_raises_not_implemented():
    service = MetricsService()
    with pytest.raises(NotImplementedError):
        service.calculate_metrics(None)

    with pytest.raises(NotImplementedError):
        service.get_history()

    with pytest.raises(NotImplementedError):
        service.get_system_metrics()
