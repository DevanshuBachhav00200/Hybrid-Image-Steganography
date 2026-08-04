"""
Pixel Iterator Sub-module (Architecture Component).
Implementation scheduled for Phase 4A.3.
"""

from typing import Generator, Tuple, Optional


class PixelIterator:
    """
    Generates pixel coordinate traversal streams (Sequential, Pseudorandom PRNG, Edge-based).
    """

    def generate_coordinates(
        self, width: int, height: int, channels: int, seed: Optional[int] = None
    ) -> Generator[Tuple[int, int, int], None, None]:
        """
        Yields pixel coordinate tuples (x, y, channel).
        """
        for y in range(height):
            for x in range(width):
                for c in range(channels):
                    yield (x, y, c)
