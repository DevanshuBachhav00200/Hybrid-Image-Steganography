"""
DCT Transformer Sub-module.
Provides production-ready Forward 2D-DCT and Inverse 2D-IDCT transformations for 8x8 image blocks.
Supports image padding, block partitioning, frequency coefficient matrix generation, and loss-free spatial image reconstruction.
"""

import io
import time
import logging
from typing import Dict, Any, Union, Tuple, Optional
import numpy as np
import scipy.fftpack as fft
from PIL import Image, UnidentifiedImageError

from app.core.exceptions import (
    InvalidImageException,
    CorruptedImageException,
    UnsupportedFormatException,
    TransformException,
)
from app.steganography.dct.utils import DCTUtils
from app.steganography.lsb.capacity import SUPPORTED_IMAGE_FORMATS, SUPPORTED_COLOR_MODES
from app.models.stego import DCTTransformResult

logger = logging.getLogger(__name__)


class DCTTransformer:
    """
    DCT Transformer Layer.
    Executes Forward 2D-DCT and Inverse 2D-IDCT transformations on 8x8 image blocks
    with orthogonal normalization and exact spatial reconstruction.
    """

    @staticmethod
    def forward_dct_block(block: np.ndarray) -> np.ndarray:
        """
        Apply Forward 2D Discrete Cosine Transform (2D-DCT) to an 8x8 pixel block.

        :param block: 8x8 numpy array of float pixel values.
        :return: 8x8 numpy array of DCT frequency coefficients.
        """
        if block.shape != (8, 8):
            raise TransformException(f"Expected 8x8 block, got shape {block.shape}.")
        try:
            # Orthogonal 2D-DCT using scipy.fftpack
            return fft.dct(fft.dct(block.astype(np.float64).T, norm="ortho").T, norm="ortho")
        except Exception as exc:
            raise TransformException(f"Forward 2D-DCT computation failed: {str(exc)}")

    @staticmethod
    def inverse_dct_block(coeff: np.ndarray) -> np.ndarray:
        """
        Apply Inverse 2D Discrete Cosine Transform (2D-IDCT) to an 8x8 coefficient matrix.

        :param coeff: 8x8 numpy array of DCT coefficients.
        :return: 8x8 numpy array of spatial pixel values.
        """
        if coeff.shape != (8, 8):
            raise TransformException(f"Expected 8x8 coefficient matrix, got shape {coeff.shape}.")
        try:
            # Orthogonal 2D-IDCT using scipy.fftpack
            spatial = fft.idct(fft.idct(coeff.astype(np.float64).T, norm="ortho").T, norm="ortho")
            return spatial
        except Exception as exc:
            raise TransformException(f"Inverse 2D-IDCT computation failed: {str(exc)}")

    def forward_dct_channel(
        self, channel_array: np.ndarray
    ) -> Tuple[np.ndarray, Tuple[int, int], Tuple[int, int]]:
        """
        Transform a full 2D image channel array into 4D 8x8 DCT coefficient blocks.

        :param channel_array: 2D numpy array (height, width).
        :return: Tuple of (4D_coeff_blocks, original_size, padding_xy).
        """
        orig_h, orig_w = channel_array.shape
        padded_channel, (pad_y, pad_x) = DCTUtils.pad_image_channel(channel_array, block_size=8)
        blocks = DCTUtils.partition_into_blocks(padded_channel, block_size=8)

        n_blocks_y, n_blocks_x, bh, bw = blocks.shape
        coeff_blocks = np.zeros_like(blocks, dtype=np.float64)

        for by in range(n_blocks_y):
            for bx in range(n_blocks_x):
                coeff_blocks[by, bx] = self.forward_dct_block(blocks[by, bx])

        return coeff_blocks, (orig_h, orig_w), (pad_y, pad_x)

    def inverse_dct_channel(
        self, coeff_blocks: np.ndarray, original_size: Tuple[int, int]
    ) -> np.ndarray:
        """
        Reconstruct a 2D spatial image channel from 4D 8x8 DCT coefficient blocks.

        :param coeff_blocks: 4D numpy array (N_blocks_y, N_blocks_x, 8, 8).
        :param original_size: Tuple of (original_height, original_width).
        :return: Unpadded 2D numpy array of spatial uint8 pixel values.
        """
        n_blocks_y, n_blocks_x, bh, bw = coeff_blocks.shape
        spatial_blocks = np.zeros_like(coeff_blocks, dtype=np.float64)

        for by in range(n_blocks_y):
            for bx in range(n_blocks_x):
                spatial_blocks[by, bx] = self.inverse_dct_block(coeff_blocks[by, bx])

        padded_shape = (n_blocks_y * bh, n_blocks_x * bw)
        padded_channel = DCTUtils.reassemble_from_blocks(spatial_blocks, padded_shape)
        unpadded_channel = DCTUtils.unpad_image_channel(padded_channel, original_size)

        # Clip values to valid uint8 range [0, 255] and round
        clipped_channel = np.clip(np.round(unpadded_channel), 0, 255).astype(np.uint8)
        return clipped_channel

    def transform_image(
        self, image_input: Union[bytes, Image.Image]
    ) -> Tuple[Dict[int, np.ndarray], DCTTransformResult]:
        """
        Transform all channels of a cover image into 4D 8x8 DCT coefficient matrices.

        :param image_input: Raw cover image bytes or PIL Image object.
        :return: Tuple of (dict_channel_coeff_blocks, DCTTransformResult_model).
        """
        start_time = time.perf_counter()

        if isinstance(image_input, bytes):
            if len(image_input) == 0:
                raise InvalidImageException("Image byte payload is empty (0 bytes).")
            try:
                raw_img = Image.open(io.BytesIO(image_input))
                detected_fmt = (raw_img.format or "PNG").upper()
                img = raw_img.copy()
                img.format = detected_fmt
            except UnidentifiedImageError:
                raise UnsupportedFormatException("Unidentified image format. Only PNG and BMP are supported.")
            except Exception as exc:
                raise CorruptedImageException(f"Corrupted cover image input bytes: {str(exc)}")
        elif isinstance(image_input, Image.Image):
            detected_fmt = (image_input.format or "PNG").upper()
            img = image_input.copy()
            img.format = detected_fmt
        else:
            raise InvalidImageException(f"Unsupported image_input type '{type(image_input).__name__}'.")

        fmt = img.format.upper()
        if fmt not in SUPPORTED_IMAGE_FORMATS:
            raise UnsupportedFormatException(f"Unsupported image format '{fmt}'. Only PNG and BMP are supported.")

        mode = img.mode.upper()
        if mode not in SUPPORTED_COLOR_MODES:
            raise UnsupportedFormatException(f"Unsupported color mode '{mode}'. Supported modes: {list(SUPPORTED_COLOR_MODES.keys())}")

        width, height = img.size
        channels = SUPPORTED_COLOR_MODES[mode]

        img_np = np.array(img, dtype=np.uint8)

        # Separate into 2D channel arrays
        channel_dict: Dict[int, np.ndarray] = {}
        if channels == 1:
            channel_dict[0] = img_np
        else:
            for c in range(channels):
                channel_dict[c] = img_np[:, :, c]

        coeff_dict: Dict[int, np.ndarray] = {}
        padded_w, padded_h = width, height
        pad_x, pad_y = 0, 0
        blocks_shape = (0, 0, 8, 8)

        for c, ch_arr in channel_dict.items():
            coeff_blocks, (orig_h, orig_w), (py, px) = self.forward_dct_channel(ch_arr)
            coeff_dict[c] = coeff_blocks
            pad_y, pad_x = py, px
            padded_h = orig_h + py
            padded_w = orig_w + px
            blocks_shape = coeff_blocks.shape

        total_blocks = blocks_shape[0] * blocks_shape[1] * channels
        execution_time_ms = round((time.perf_counter() - start_time) * 1000.0, 3)

        result_model = DCTTransformResult(
            image_width=width,
            image_height=height,
            padded_width=padded_w,
            padded_height=padded_h,
            padding_x=pad_x,
            padding_y=pad_y,
            channels=channels,
            color_mode=mode,
            format=fmt,
            total_blocks=total_blocks,
            blocks_shape=blocks_shape,
            transform_execution_time_ms=execution_time_ms,
            success=True,
        )

        logger.info(
            f"DCTTransformer: Transformed {width}x{height} ({mode}) image into {total_blocks} 8x8 blocks "
            f"in {execution_time_ms}ms (Padding: +{pad_x}x, +{pad_y}y)."
        )

        return coeff_dict, result_model

    def reconstruct_image(
        self,
        coeff_dict: Dict[int, np.ndarray],
        metadata: Dict[str, Any]
    ) -> bytes:
        """
        Reconstruct original cover image raw bytes from 4D 8x8 DCT coefficient matrices.

        :param coeff_dict: Dictionary mapping channel index to 4D coefficient block array.
        :param metadata: Dictionary or DCTTransformResult metadata containing image dimensions, mode, format.
        :return: Reconstructed raw image bytes.
        """
        if isinstance(metadata, DCTTransformResult):
            meta_dict = metadata.model_dump()
        else:
            meta_dict = metadata

        orig_w = meta_dict["image_width"]
        orig_h = meta_dict["image_height"]
        channels = meta_dict["channels"]
        mode = meta_dict["color_mode"]
        fmt = meta_dict["format"]

        reconstructed_channels = []
        for c in range(channels):
            coeff_blocks = coeff_dict[c]
            ch_spatial = self.inverse_dct_channel(coeff_blocks, (orig_h, orig_w))
            reconstructed_channels.append(ch_spatial)

        if channels == 1:
            reconstructed_np = reconstructed_channels[0]
        else:
            reconstructed_np = np.stack(reconstructed_channels, axis=2)

        stego_img = Image.fromarray(reconstructed_np, mode=mode)
        buffer = io.BytesIO()
        stego_img.save(buffer, format=fmt)
        return buffer.getvalue()
