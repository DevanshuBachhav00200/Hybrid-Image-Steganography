"""
DWT Wavelet Selector Sub-module (Phase 4C.2).
Manages configurable wavelet families (Haar, Daubechies, Biorthogonal, Symlets, Coiflets).
"""

import logging
import pywt
from typing import List

from app.core.exceptions import WaveletTransformException

logger = logging.getLogger(__name__)

SUPPORTED_FAMILIES = ["haar", "db", "bior", "sym", "coif"]


class WaveletSelector:
    """
    Wavelet Selector.
    Validates and retrieves PyWavelets wavelet basis functions.
    """

    @staticmethod
    def get_supported_wavelets() -> List[str]:
        """
        Get all built-in wavelets supported by PyWavelets.
        """
        all_wavelets = pywt.wavelist()
        # Filter for families we want to expose
        filtered = [w for w in all_wavelets if any(w.startswith(fam) for fam in SUPPORTED_FAMILIES)]
        return filtered

    def get_wavelet(self, wavelet_name: str) -> pywt.Wavelet:
        """
        Validate and load pywt.Wavelet instance.

        :param wavelet_name: Name of the wavelet basis function (e.g. 'haar', 'db4', 'bior1.3').
        :return: pywt.Wavelet object.
        :raises WaveletTransformException: If the wavelet name is invalid or unsupported.
        """
        if not wavelet_name:
            logger.warning("WaveletSelector: Received empty wavelet name. Defaulting to 'haar'.")
            wavelet_name = "haar"

        wavelet_name_clean = wavelet_name.lower().strip()

        # Direct check if pywt supports the wavelet name
        try:
            wavelet_obj = pywt.Wavelet(wavelet_name_clean)
            return wavelet_obj
        except ValueError as exc:
            err_msg = f"Wavelet '{wavelet_name}' is not supported or recognized by PyWavelets: {str(exc)}"
            logger.error(f"WaveletSelector error: {err_msg}")
            raise WaveletTransformException(err_msg)
        except Exception as exc:
            err_msg = f"Failed to load wavelet '{wavelet_name}': {str(exc)}"
            logger.error(f"WaveletSelector error: {err_msg}")
            raise WaveletTransformException(err_msg)
