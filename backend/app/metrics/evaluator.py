class MetricsEvaluator:
    """
    Image Metrics Evaluator Stub (PSNR, SSIM, MSE).
    Architecture Placeholder - No metric evaluation implementation included.
    """
    @staticmethod
    def calculate_mse(original_image: bytes, stego_image: bytes) -> float:
        """Calculate Mean Squared Error."""
        raise NotImplementedError("MSE calculation metric is not implemented yet.")

    @staticmethod
    def calculate_psnr(original_image: bytes, stego_image: bytes) -> float:
        """Calculate Peak Signal-to-Noise Ratio (dB)."""
        raise NotImplementedError("PSNR calculation metric is not implemented yet.")

    @staticmethod
    def calculate_ssim(original_image: bytes, stego_image: bytes) -> float:
        """Calculate Structural Similarity Index Measure."""
        raise NotImplementedError("SSIM calculation metric is not implemented yet.")
