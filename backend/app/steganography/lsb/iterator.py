"""
Pixel Iterator Sub-module.
Generates pixel channel coordinate traversal sequences (Sequential and PRNG Randomized).
"""

import random
from typing import Generator, Tuple, Optional


class PixelIterator:
    """
    Generates pixel coordinate traversal streams for spatial steganography embedding & extraction.
    """

    def generate_coordinates(
        self,
        width: int,
        height: int,
        channels: int,
        mode: str = "sequential",
        seed: Optional[int] = None
    ) -> Generator[Tuple[int, int, int], None, None]:
        """
        Yields pixel coordinate tuples (x, y, channel).

        :param width: Image width in pixels.
        :param height: Image height in pixels.
        :param channels: Number of color channels (1, 3, 4).
        :param mode: Traversal mode ('sequential' or 'randomized').
        :param seed: PRNG seed for randomized mode.
        """
        coords = [
            (x, y, c)
            for y in range(height)
            for x in range(width)
            for c in range(channels)
        ]

        if mode.lower() == "randomized" and seed is not None:
            rng = random.Random(seed)
            rng.shuffle(coords)

        for coord in coords:
            yield coord
