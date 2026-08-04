"""
Unit tests for DWT Transform, Reconstruction, Subband selector, and Wavelet selector modules (Phase 4C.2).
"""

import io
import pytest
import numpy as np
from PIL import Image

from app.steganography.dwt.transform import DWTTransformer
from app.steganography.dwt.reconstruction import DWTReconstructor
from app.steganography.dwt.subband_selector import SubbandSelector
from app.steganography.dwt.wavelet_selector import WaveletSelector
from app.core.exceptions import (
    WaveletTransformException,
    SubbandException,
    ReconstructionException,
)


@pytest.fixture
def transformer():
    return DWTTransformer()


@pytest.fixture
def reconstructor():
    return DWTReconstructor()


@pytest.fixture
def subband_selector():
    return SubbandSelector()


@pytest.fixture
def wavelet_selector():
    return WaveletSelector()


@pytest.fixture
def sample_image_rgb():
    """Create a 128x128 RGB PNG image."""
    img = Image.new("RGB", (128, 128), color=(120, 160, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def sample_image_grayscale():
    """Create a 128x128 Grayscale PNG image."""
    img = Image.new("L", (128, 128), color=128)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


# 1. Test DWT Wavelet Selector Supported Families
def test_wavelet_selector(wavelet_selector):
    supported = wavelet_selector.get_supported_wavelets()
    assert len(supported) > 0
    assert "haar" in supported
    assert "db1" in supported

    # Get valid wavelets
    w_haar = wavelet_selector.get_wavelet("haar")
    assert w_haar.name == "haar"

    w_db4 = wavelet_selector.get_wavelet("db4")
    assert w_db4.name == "db4"

    # Invalid wavelet name raises exception
    with pytest.raises(WaveletTransformException):
        wavelet_selector.get_wavelet("invalid_wavelet_name")


# 2. Test Forward DWT Transform on RGB PNG
def test_forward_transform_rgb(transformer, sample_image_rgb):
    coeffs_dict, meta = transformer.transform_image(
        sample_image_rgb,
        options={"wavelet_family": "haar", "decomposition_level": 2}
    )

    assert meta.wavelet_family == "haar"
    assert meta.decomposition_level == 2
    assert meta.image_metadata["color_mode"] == "RGB"
    assert len(coeffs_dict) == 3  # R, G, B channels

    # Level 2 decomposition: coefficients structure should be length 3: [cAn, (cH2, cV2, cD2), (cH1, cV1, cD1)]
    for ch in range(3):
        assert len(coeffs_dict[ch]) == 3
        cA2 = coeffs_dict[ch][0]
        assert cA2.shape == (32, 32)  # 128 // (2^2) = 32


# 3. Test Inverse DWT Reconstruction on RGB PNG (Roundtrip correctness)
def test_dwt_roundtrip_rgb(transformer, reconstructor, sample_image_rgb):
    # Forward DWT
    coeffs_dict, meta = transformer.transform_image(
        sample_image_rgb,
        options={"wavelet_family": "db2", "decomposition_level": 1}
    )

    # Reconstruct Image
    reconstructed_bytes = reconstructor.reconstruct_image(coeffs_dict, meta)

    # Compare pixel arrays
    img_orig = np.array(Image.open(io.BytesIO(sample_image_rgb)))
    img_recon = np.array(Image.open(io.BytesIO(reconstructed_bytes)))

    # Compute mean absolute pixel difference (lossless compression roundtrip should be extremely close to 0)
    mae = np.mean(np.abs(img_orig.astype(float) - img_recon.astype(float)))
    assert mae < 0.5


# 4. Test Forward & Reconstruction on Grayscale L image
def test_dwt_roundtrip_grayscale(transformer, reconstructor, sample_image_grayscale):
    coeffs_dict, meta = transformer.transform_image(
        sample_image_grayscale,
        options={"wavelet_family": "haar", "decomposition_level": 1}
    )

    reconstructed_bytes = reconstructor.reconstruct_image(coeffs_dict, meta)

    img_orig = np.array(Image.open(io.BytesIO(sample_image_grayscale)))
    img_recon = np.array(Image.open(io.BytesIO(reconstructed_bytes)))

    mae = np.mean(np.abs(img_orig.astype(float) - img_recon.astype(float)))
    assert mae < 0.5


# 5. Test Subband Selector retrieval and update
def test_subband_selector(transformer, subband_selector, sample_image_rgb):
    coeffs_dict, _ = transformer.transform_image(
        sample_image_rgb,
        options={"wavelet_family": "haar", "decomposition_level": 2}
    )

    coeffs = coeffs_dict[0]  # R channel

    # Extract level 2 approximation LL (cAn)
    cA2 = subband_selector.extract_subband_coefficients(coeffs, "LL", level=2)
    assert cA2.shape == (32, 32)

    # Extract level 1 horizontal details HL (cH1)
    cH1 = subband_selector.extract_subband_coefficients(coeffs, "HL", level=1)
    assert cH1.shape == (64, 64)  # 128 // (2^1) = 64

    # Extract level 2 diagonal details HH (cD2)
    cD2 = subband_selector.extract_subband_coefficients(coeffs, "HH", level=2)
    assert cD2.shape == (32, 32)

    # Invalid level raises exception
    with pytest.raises(SubbandException):
        subband_selector.extract_subband_coefficients(coeffs, "LH", level=3)

    # Update HL subband at level 1
    new_matrix = np.zeros_like(cH1)
    updated_coeffs = subband_selector.update_subband_coefficients(coeffs, "HL", level=1, new_coeff_matrix=new_matrix)
    cH1_updated = subband_selector.extract_subband_coefficients(updated_coeffs, "HL", level=1)
    assert np.all(cH1_updated == 0)


# 6. Test Validator dimension error and wavelet error
def test_transform_invalid_inputs(transformer):
    # Image size below minimum 8x8 pixels
    tiny_img = Image.new("RGB", (4, 4), color=255)
    buf = io.BytesIO()
    tiny_img.save(buf, format="PNG")
    tiny_bytes = buf.getvalue()

    with pytest.raises(WaveletTransformException):
        transformer.transform_image(tiny_bytes)

    # Decomposition level too high for image dimensions
    img_16 = Image.new("RGB", (16, 16), color=255)
    buf = io.BytesIO()
    img_16.save(buf, format="PNG")
    bytes_16 = buf.getvalue()

    # level 5 requires at least 32x32 pixels
    with pytest.raises(WaveletTransformException):
        transformer.transform_image(bytes_16, options={"decomposition_level": 5})
