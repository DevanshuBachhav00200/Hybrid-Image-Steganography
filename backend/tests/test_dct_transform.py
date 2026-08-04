"""
Unit tests for DCT Transform Layer (Phase 4B.2).
"""

import io
import pytest
import numpy as np
from PIL import Image

from app.steganography.dct.transform import DCTTransformer
from app.steganography.dct.utils import DCTUtils
from app.steganography.dct.coefficient_selector import MidFrequencySelector
from app.steganography.dct.quantization import QuantizationTable
from app.core.exceptions import (
    TransformException,
    InvalidBlockException,
    PaddingException,
    CoefficientSelectionException,
    QuantizationException,
    UnsupportedFormatException,
    InvalidImageException,
)


@pytest.fixture
def transformer():
    return DCTTransformer()


@pytest.fixture
def sample_rgb_png():
    """Create a 64x64 RGB PNG cover image (exact multiple of 8)."""
    img = Image.new("RGB", (64, 64), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_odd_dim_png():
    """Create a 103x107 RGB PNG cover image (requires padding)."""
    img = Image.new("RGB", (103, 107), color=(80, 120, 160))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_bmp_image():
    """Create a 48x48 BMP cover image."""
    img = Image.new("RGB", (48, 48), color=(90, 130, 170))
    buf = io.BytesIO()
    img.save(buf, format="BMP")
    return buf.getvalue()


# 1. Forward 2D-DCT & Inverse 2D-IDCT Orthogonal Roundtrip
def test_dct_block_orthogonal_roundtrip(transformer):
    original_block = np.random.rand(8, 8) * 255.0
    coeff_matrix = transformer.forward_dct_block(original_block)
    reconstructed_block = transformer.inverse_dct_block(coeff_matrix)

    # Orthogonal 2D-DCT must preserve precision within 1e-12
    max_diff = np.max(np.abs(original_block - reconstructed_block))
    assert max_diff < 1e-11


# 2. Image Edge Padding & Unpadding Helpers
def test_dct_padding_and_unpadding():
    odd_arr = np.random.randint(0, 256, size=(103, 107), dtype=np.uint8)
    padded_arr, (pad_y, pad_x) = DCTUtils.pad_image_channel(odd_arr, block_size=8)

    assert pad_y == 1  # 103 + 1 = 104 (multiple of 8)
    assert pad_x == 5  # 107 + 5 = 112 (multiple of 8)
    assert padded_arr.shape == (104, 112)

    unpadded_arr = DCTUtils.unpad_image_channel(padded_arr, (103, 107))
    assert unpadded_arr.shape == (103, 107)
    assert np.array_equal(odd_arr, unpadded_arr)


# 3. Block Partitioning and Reassembly Helpers
def test_dct_block_partitioning_and_reassembly():
    channel_arr = np.random.randint(0, 256, size=(64, 64), dtype=np.uint8)
    blocks = DCTUtils.partition_into_blocks(channel_arr, block_size=8)

    assert blocks.shape == (8, 8, 8, 8)  # (N_blocks_y, N_blocks_x, 8, 8)

    reassembled_arr = DCTUtils.reassemble_from_blocks(blocks, (64, 64))
    assert reassembled_arr.shape == (64, 64)
    assert np.array_equal(channel_arr, reassembled_arr)


# 4. Full Image Transform & Reconstruction Roundtrip (Exact Multiples of 8)
def test_dct_transform_image_exact_multiples(transformer, sample_rgb_png):
    coeff_dict, result_model = transformer.transform_image(sample_rgb_png)

    assert result_model.success is True
    assert result_model.image_width == 64
    assert result_model.image_height == 64
    assert result_model.padding_x == 0
    assert result_model.padding_y == 0
    assert result_model.channels == 3
    assert result_model.total_blocks == 64 * 3  # (8*8) blocks * 3 channels = 192

    reconstructed_bytes = transformer.reconstruct_image(coeff_dict, result_model)
    assert len(reconstructed_bytes) > 0

    img_orig = Image.open(io.BytesIO(sample_rgb_png))
    img_rec = Image.open(io.BytesIO(reconstructed_bytes))

    arr_orig = np.array(img_orig, dtype=np.int16)
    arr_rec = np.array(img_rec, dtype=np.int16)

    # Spatial reconstruction maximum pixel error <= 1 due to uint8 rounding
    max_pixel_diff = np.max(np.abs(arr_orig - arr_rec))
    assert max_pixel_diff <= 1


# 5. Full Image Transform & Reconstruction with Odd Dimensions (Padding Handling)
def test_dct_transform_image_odd_dimensions(transformer, sample_odd_dim_png):
    coeff_dict, result_model = transformer.transform_image(sample_odd_dim_png)

    assert result_model.success is True
    assert result_model.image_width == 103
    assert result_model.image_height == 107
    assert result_model.padding_x > 0 or result_model.padding_y > 0
    assert result_model.padded_width % 8 == 0
    assert result_model.padded_height % 8 == 0

    reconstructed_bytes = transformer.reconstruct_image(coeff_dict, result_model)
    img_rec = Image.open(io.BytesIO(reconstructed_bytes))
    assert img_rec.size == (103, 107)  # Original size preserved cleanly


# 6. BMP Image Format Support
def test_dct_transform_bmp_image(transformer, sample_bmp_image):
    coeff_dict, result_model = transformer.transform_image(sample_bmp_image)
    assert result_model.format == "BMP"

    reconstructed_bytes = transformer.reconstruct_image(coeff_dict, result_model)
    img_rec = Image.open(io.BytesIO(reconstructed_bytes))
    assert img_rec.format == "BMP"


# 7. MidFrequencySelector Coordinate Verification
def test_mid_frequency_selector():
    selector = MidFrequencySelector()
    coords = selector.get_selected_coordinates(count=4)

    assert len(coords) == 4
    assert (0, 0) not in coords  # DC coefficient (0,0) MUST NOT be selected

    with pytest.raises(CoefficientSelectionException):
        selector.get_selected_coordinates(count=999)  # Out of bounds count


# 8. QuantizationTable Scaling Verification
def test_quantization_table():
    q50 = QuantizationTable.get_luminance_table(quality=50)
    q90 = QuantizationTable.get_luminance_table(quality=90)

    assert q50.shape == (8, 8)
    assert q90.shape == (8, 8)
    # Higher quality results in smaller quantization step values
    assert np.mean(q90) < np.mean(q50)

    with pytest.raises(QuantizationException):
        QuantizationTable.get_luminance_table(quality=0)  # Invalid quality


# 9. Exception & Negative Tests
def test_dct_transform_invalid_inputs(transformer):
    with pytest.raises(InvalidImageException):
        transformer.transform_image(b"")

    with pytest.raises(UnsupportedFormatException):
        transformer.transform_image(b"NOT_AN_IMAGE_HEADER_BYTES")

    with pytest.raises(InvalidBlockException):
        unaligned_channel = np.random.randint(0, 256, size=(65, 65), dtype=np.uint8)
        DCTUtils.partition_into_blocks(unaligned_channel, block_size=8)
