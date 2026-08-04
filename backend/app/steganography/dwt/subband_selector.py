"""
DWT Sub-band Selector and Manager Sub-module (Phase 4C.2).
Provides APIs for selecting, reading, and writing detail sub-bands (LH, HL, HH) and approximations (LL).
"""

import logging
from typing import Tuple, List, Dict, Any, Union
import numpy as np

from app.core.exceptions import SubbandException

logger = logging.getLogger(__name__)


class SubbandSelector:
    """
    SubbandSelector.
    Manages and isolates coefficient arrays for LL, LH, HL, and HH sub-bands in multi-level DWT structures.
    """

    ALLOWED_SUBBANDS = ["LL", "LH", "HL", "HH"]

    def validate_subband_spec(self, subband_name: str, level: int, max_level: int) -> None:
        """
        Validate sub-band specifications.

        :param subband_name: Name of sub-band ('LL', 'LH', 'HL', 'HH').
        :param level: Target decomposition level (1-indexed).
        :param max_level: Maximum decomposition level available in coefficients.
        :raises SubbandException: If specification is invalid.
        """
        subband_upper = subband_name.upper().strip()
        if subband_upper not in self.ALLOWED_SUBBANDS:
            raise SubbandException(
                f"Invalid sub-band '{subband_name}'. Must be one of {self.ALLOWED_SUBBANDS}."
            )

        if level <= 0 or level > max_level:
            raise SubbandException(
                f"Requested level {level} is out of bounds. Available level range: [1, {max_level}]."
            )

        if subband_upper == "LL" and level != max_level:
            raise SubbandException(
                "LL (Approximation) sub-band is only available at the deepest decomposition level."
            )

    def extract_subband_coefficients(
        self,
        coeffs: List[Union[np.ndarray, Tuple[np.ndarray, np.ndarray, np.ndarray]]],
        subband_name: str,
        level: int = 1,
    ) -> np.ndarray:
        """
        Retrieve reference to specific sub-band coefficient matrix.

        :param coeffs: Decomposed PyWavelets coefficients list returned by pywt.wavedec2.
                       Structure: [cAn, (cHn, cVn, cDn), ..., (cH1, cV1, cD1)]
        :param subband_name: Subband target ('LL', 'LH', 'HL', 'HH').
        :param level: Decomposition level of target subband (1-indexed, where 1 is finest/outer level).
        :return: 2D numpy array reference to coefficients.
        :raises SubbandException: If specification or retrieval fails.
        """
        max_level = len(coeffs) - 1
        if max_level <= 0:
            raise SubbandException("Coefficient structure is invalid or empty.")

        self.validate_subband_spec(subband_name, level, max_level)

        subband_upper = subband_name.upper().strip()

        # LL subband is the approximation cAn at index 0 of coeffs list
        if subband_upper == "LL":
            return coeffs[0]

        # For LH, HL, HH details at level i:
        # The list indices are level-dependent: level 1 detail is at index -1, level n detail is at index 1.
        # So target index = max_level - level + 1
        list_idx = max_level - level + 1

        try:
            details_tuple = coeffs[list_idx]
            # PyWaveletswavedec2 returns details as (cH, cV, cD)
            # Map cH -> HL (Horizontal details correspond to vertical edges/High-Low filter)
            # Map cV -> LH (Vertical details correspond to horizontal edges/Low-High filter)
            # Map cD -> HH (Diagonal details)
            cH, cV, cD = details_tuple

            if subband_upper == "HL":
                return cH
            elif subband_upper == "LH":
                return cV
            elif subband_upper == "HH":
                return cD
        except (IndexError, ValueError) as exc:
            raise SubbandException(f"Failed to access detail sub-band tuple at index {list_idx}: {str(exc)}")

        raise SubbandException(f"Failed to extract sub-band coefficient matrix for {subband_name} at level {level}.")

    def update_subband_coefficients(
        self,
        coeffs: List[Union[np.ndarray, Tuple[np.ndarray, np.ndarray, np.ndarray]]],
        subband_name: str,
        level: int,
        new_coeff_matrix: np.ndarray,
    ) -> List[Union[np.ndarray, Tuple[np.ndarray, np.ndarray, np.ndarray]]]:
        """
        Update a specific sub-band coefficient matrix inside the coefficients list structure.

        :param coeffs: Decomposed PyWavelets coefficients list.
        :param subband_name: Subband target ('LL', 'LH', 'HL', 'HH').
        :param level: Decomposition level (1-indexed).
        :param new_coeff_matrix: New coefficient matrix (must match shape of target sub-band).
        :return: Updated coefficients list.
        :raises SubbandException: If shape mismatch or invalid specification.
        """
        max_level = len(coeffs) - 1
        self.validate_subband_spec(subband_name, level, max_level)

        target_ref = self.extract_subband_coefficients(coeffs, subband_name, level)
        if target_ref.shape != new_coeff_matrix.shape:
            raise SubbandException(
                f"Shape mismatch: Cannot replace sub-band coefficient matrix of shape {target_ref.shape} "
                f"with new matrix of shape {new_coeff_matrix.shape}."
            )

        subband_upper = subband_name.upper().strip()

        # Update in-place or construct a new list
        if subband_upper == "LL":
            coeffs[0] = new_coeff_matrix
        else:
            list_idx = max_level - level + 1
            cH, cV, cD = coeffs[list_idx]
            if subband_upper == "HL":
                coeffs[list_idx] = (new_coeff_matrix, cV, cD)
            elif subband_upper == "LH":
                coeffs[list_idx] = (cH, new_coeff_matrix, cD)
            elif subband_upper == "HH":
                coeffs[list_idx] = (cH, cV, new_coeff_matrix)

        return coeffs
