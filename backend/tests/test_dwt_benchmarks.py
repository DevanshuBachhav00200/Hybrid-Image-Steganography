"""
Performance, Quality, and Throughput Benchmarks for DWT Steganography Engine (Phase 4C.5).
Measures forward/inverse transform speed, embedding/extraction throughput, and visual metrics (PSNR, MSE, SSIM).
"""

import io
import time
import pytest
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity as ssim

from app.steganography.dwt.capacity import DWTCapacityCalculator
from app.steganography.dwt.transform import DWTTransformer
from app.steganography.dwt.reconstruction import DWTReconstructor
from app.steganography.dwt.embed import DWTEmbedder
from app.steganography.dwt.extract import DWTExtractor
from app.steganography.lsb.utils import LSBUtils
from app.processing.binary.service import BinaryService


def generate_test_image(width: int, height: int, mode: str = "RGB", fmt: str = "PNG") -> bytes:
    img = Image.new(mode, (width, height), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return buf.getvalue()


def test_dwt_performance_benchmarks():
    calculator = DWTCapacityCalculator()
    transformer = DWTTransformer()
    reconstructor = DWTReconstructor()
    embedder = DWTEmbedder()
    extractor = DWTExtractor()
    binary_service = BinaryService()

    # Sample payload dictionary to simulate standard AES ciphertext payload
    sample_aes_payload = {
        "ciphertext": "Q2lwaGVydGV4dERhdGExMjM0NTY=",
        "salt": "U2FsdEJ5dGVzMTZfQnl0ZQ==",
        "nonce": "Tm9uY2VCeXRlczEy",
        "authentication_tag": "QXV0aFRhZ0J5dGVzMTZfXw==",
        "algorithm": "AES-256-GCM",
        "key_length": 256,
        "iterations": 100000,
    }
    payload_bits = binary_service.serialize(sample_aes_payload)

    resolutions = [
        ("Small (128x128)", 128, 128),
        ("Medium (320x320)", 320, 320),
        ("Large (512x512)", 512, 512),
    ]

    benchmark_results = []

    for name, w, h in resolutions:
        cover_bytes = generate_test_image(w, h)

        # 1. Benchmark Capacity Calculation
        t0 = time.perf_counter()
        _ = calculator.calculate_capacity(cover_bytes, options={"decomposition_level": 1, "selected_subbands": ["LH", "HL"]})
        t_calc_ms = (time.perf_counter() - t0) * 1000.0

        # 2. Benchmark Forward DWT Transformation
        t0 = time.perf_counter()
        coeff_dict, transform_meta = transformer.transform_image(cover_bytes, options={"decomposition_level": 1, "wavelet_family": "haar"})
        t_forward_ms = (time.perf_counter() - t0) * 1000.0

        # 3. Benchmark Inverse DWT Reconstruction
        t0 = time.perf_counter()
        _ = reconstructor.reconstruct_image(coeff_dict, transform_meta)
        t_inverse_ms = (time.perf_counter() - t0) * 1000.0

        # 4. Benchmark Embedding
        t0 = time.perf_counter()
        embed_res = embedder.embed(cover_bytes, payload_bits, options={"decomposition_level": 1, "selected_subbands": ["LH", "HL"]})
        t_embed_ms = (time.perf_counter() - t0) * 1000.0
        stego_bytes = embed_res.stego_image_bytes

        # 5. Benchmark Extraction
        t0 = time.perf_counter()
        extract_res = extractor.extract(stego_bytes, options={"decomposition_level": 1, "selected_subbands": ["LH", "HL"]})
        t_extract_ms = (time.perf_counter() - t0) * 1000.0

        # 6. Quality Metrics Calculation (PSNR, MSE, SSIM)
        psnr = LSBUtils.calculate_psnr(cover_bytes, stego_bytes)
        mse = LSBUtils.calculate_mse(cover_bytes, stego_bytes)

        # Calculate Structural Similarity Index (SSIM)
        img_cover = np.array(Image.open(io.BytesIO(cover_bytes)))
        img_stego = np.array(Image.open(io.BytesIO(stego_bytes)))
        val_ssim = ssim(img_cover, img_stego, channel_axis=-1)

        # Assert correctness
        assert extract_res.recovered_payload == payload_bits
        assert psnr >= 35.0
        assert val_ssim >= 0.95  # Visual structural similarity must be exceptionally high

        benchmark_results.append({
            "resolution": name,
            "calc_time_ms": round(t_calc_ms, 3),
            "forward_time_ms": round(t_forward_ms, 3),
            "inverse_time_ms": round(t_inverse_ms, 3),
            "embed_time_ms": round(t_embed_ms, 3),
            "extract_time_ms": round(t_extract_ms, 3),
            "psnr_db": psnr,
            "mse": round(mse, 6),
            "ssim": round(val_ssim, 6),
        })

    print("\n" + "=" * 80)
    print("DWT STEGANOGRAPHY SYSTEM PERFORMANCE BENCHMARK & QUALITY REPORT")
    print("=" * 80)
    for res in benchmark_results:
        print(f"[{res['resolution']}]")
        print(f"  Capacity Calc Speed: {res['calc_time_ms']} ms")
        print(f"  Forward DWT Speed  : {res['forward_time_ms']} ms")
        print(f"  Inverse IDWT Speed : {res['inverse_time_ms']} ms")
        print(f"  Embedding Speed    : {res['embed_time_ms']} ms")
        print(f"  Extraction Speed   : {res['extract_time_ms']} ms")
        print(f"  PSNR Image Quality : {res['psnr_db']} dB")
        print(f"  MSE Distortion     : {res['mse']}")
        print(f"  SSIM Similarity    : {res['ssim']}")
        print("-" * 80)
