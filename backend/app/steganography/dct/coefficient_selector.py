"""
Mid-Frequency Coefficient Selector Sub-module.
Manages DCT frequency coefficient selection policies for data embedding.
"""

from typing import List, Tuple
from app.core.exceptions import CoefficientSelectionException

# Standard 8x8 DCT Mid-Frequency Coefficients (Ordered by visual imperceptibility and robustness)
STANDARD_MID_FREQ_COORDINATES: List[Tuple[int, int]] = [
    (4, 1), (3, 2), (2, 3), (1, 4),
    (3, 3), (4, 2), (2, 4), (5, 0),
    (0, 5), (4, 3), (3, 4), (5, 1),
    (1, 5), (5, 2), (2, 5), (4, 4),
]


class MidFrequencySelector:
    """
    Manages selection of mid-frequency DCT coefficients for steganographic embedding.
    Excludes DC coefficient (0,0) and high-frequency noise coefficients.
    """

    def __init__(self, coordinates: List[Tuple[int, int]] = None):
        """
        Initialize selector with custom coordinate list or standard mid-frequency defaults.
        """
        self.coordinates = coordinates if coordinates is not None else STANDARD_MID_FREQ_COORDINATES
        self._validate_coordinates(self.coordinates)

    @staticmethod
    def _validate_coordinates(coords: List[Tuple[int, int]]) -> None:
        """
        Validate that coordinates are within 8x8 matrix bounds and exclude DC (0,0).
        """
        if not coords or len(coords) == 0:
            raise CoefficientSelectionException("Coefficient selection list cannot be empty.")

        for r, c in coords:
            if r == 0 and c == 0:
                raise CoefficientSelectionException("DC coefficient (0,0) must not be selected for embedding.")
            if r < 0 or r >= 8 or c < 0 or c >= 8:
                raise CoefficientSelectionException(f"Coefficient coordinate ({r},{c}) is outside 8x8 bounds.")

    def get_selected_coordinates(self, count: int = 1) -> List[Tuple[int, int]]:
        """
        Return the first `count` mid-frequency coefficient coordinates.

        :param count: Number of coefficients to select per 8x8 block (1-16).
        :return: List of coordinate tuples (row, col).
        """
        if count < 1 or count > len(self.coordinates):
            raise CoefficientSelectionException(
                f"Requested coefficient count ({count}) must be between 1 and {len(self.coordinates)}."
            )
        return self.coordinates[:count]
