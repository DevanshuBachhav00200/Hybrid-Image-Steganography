"""
DCT Utilities Sub-module.
Provides helper functions for 8x8 block partitioning, reassembly, and symmetric edge padding.
"""

import numpy as np
from typing import Tuple
from app.core.exceptions import InvalidBlockException, PaddingException


class DCTUtils:
    """
    Utility class for partitioning image channels into 8x8 blocks, reassembling blocks,
    and handling dimension padding.
    """

    @staticmethod
    def pad_image_channel(
        channel_array: np.ndarray, block_size: int = 8
    ) -> Tuple[np.ndarray, Tuple[int, int]]:
        """
        Pad 2D image channel array so height and width are exact multiples of block_size (8).
        Uses symmetric edge padding to avoid sharp boundary artificial high frequencies.

        :param channel_array: 2D numpy array of shape (height, width).
        :param block_size: Block dimension (default 8).
        :return: Tuple of (padded_channel_array, (pad_y, pad_x)).
        :raises PaddingException: If channel array is invalid.
        """
        if channel_array.ndim != 2:
            raise PaddingException(f"Expected 2D image channel array, got {channel_array.ndim}D array.")

        height, width = channel_array.shape
        if height <= 0 or width <= 0:
            raise PaddingException(f"Invalid channel array dimensions ({height}x{width}).")

        pad_y = (block_size - (height % block_size)) % block_size
        pad_x = (block_size - (width % block_size)) % block_size

        if pad_y == 0 and pad_x == 0:
            return channel_array.copy(), (0, 0)

        try:
            padded_array = np.pad(
                channel_array, ((0, pad_y), (0, pad_x)), mode="edge"
            )
            return padded_array, (pad_y, pad_x)
        except Exception as exc:
            raise PaddingException(f"Failed to pad image channel: {str(exc)}")

    @staticmethod
    def unpad_image_channel(
        channel_array: np.ndarray, original_size: Tuple[int, int]
    ) -> np.ndarray:
        """
        Crop padded 2D image channel array back to original (height, width).

        :param channel_array: Padded 2D numpy array.
        :param original_size: Tuple of (original_height, original_width).
        :return: Unpadded 2D numpy array.
        """
        orig_h, orig_w = original_size
        if channel_array.ndim != 2:
            raise PaddingException(f"Expected 2D image channel array, got {channel_array.ndim}D array.")
        if orig_h > channel_array.shape[0] or orig_w > channel_array.shape[1]:
            raise PaddingException(
                f"Original size ({orig_h}x{orig_w}) exceeds padded array size ({channel_array.shape})."
            )

        return channel_array[:orig_h, :orig_w].copy()

    @staticmethod
    def partition_into_blocks(
        channel_array: np.ndarray, block_size: int = 8
    ) -> np.ndarray:
        """
        Partition a 2D image channel array (Padded_H, Padded_W) into a 4D array of 8x8 blocks.

        :param channel_array: 2D numpy array where H and W are divisible by block_size.
        :param block_size: Block size (default 8).
        :return: 4D numpy array of shape (N_blocks_y, N_blocks_x, block_size, block_size).
        :raises InvalidBlockException: If array dimensions are not divisible by block_size.
        """
        if channel_array.ndim != 2:
            raise InvalidBlockException(f"Expected 2D channel array, got {channel_array.ndim}D array.")

        height, width = channel_array.shape
        if height % block_size != 0 or width % block_size != 0:
            raise InvalidBlockException(
                f"Channel dimensions ({height}x{width}) are not multiples of block size ({block_size})."
            )

        n_blocks_y = height // block_size
        n_blocks_x = width // block_size

        try:
            # Reshape into (n_blocks_y, block_size, n_blocks_x, block_size) then swap axes to (n_blocks_y, n_blocks_x, block_size, block_size)
            blocks = channel_array.reshape(n_blocks_y, block_size, n_blocks_x, block_size).swapaxes(1, 2)
            return blocks.copy()
        except Exception as exc:
            raise InvalidBlockException(f"Failed to partition image array into 8x8 blocks: {str(exc)}")

    @staticmethod
    def reassemble_from_blocks(
        blocks: np.ndarray, padded_shape: Tuple[int, int]
    ) -> np.ndarray:
        """
        Reassemble a 4D array of 8x8 blocks (N_blocks_y, N_blocks_x, 8, 8) back into a 2D image channel array.

        :param blocks: 4D numpy array of shape (N_blocks_y, N_blocks_x, 8, 8).
        :param padded_shape: Expected (height, width) of 2D array.
        :return: 2D numpy array of shape (height, width).
        """
        if blocks.ndim != 4:
            raise InvalidBlockException(f"Expected 4D block array, got {blocks.ndim}D array.")

        n_blocks_y, n_blocks_x, bh, bw = blocks.shape
        expected_h, expected_w = padded_shape

        if n_blocks_y * bh != expected_h or n_blocks_x * bw != expected_w:
            raise InvalidBlockException(
                f"Block dimensions ({n_blocks_y}x{n_blocks_x} of {bh}x{bw}) do not match target shape {padded_shape}."
            )

        try:
            # Swap axes back and reshape to 2D
            channel_array = blocks.swapaxes(1, 2).reshape(expected_h, expected_w)
            return channel_array.copy()
        except Exception as exc:
            raise InvalidBlockException(f"Failed to reassemble blocks into 2D channel array: {str(exc)}")
