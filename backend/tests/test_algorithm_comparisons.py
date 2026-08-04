"""
Comparative Benchmarking Suite for LSB vs DCT vs DWT Steganography Algorithms (Phase 4C.5).
Generates image quality parameters (PSNR, MSE, SSIM), capacity analyses, and computational execution speeds.
"""

import io
import time
import pytest
import numpy as np
from PIL import Image
from skimage.metrics import structural_similarity as ssim

from app.steganography.factory import EmbeddingFactory
from app.processing.binary.service import BinaryService
from app.steganography.lsb.utils import LSBUtils


def generate_test_image(width: int, height: int) -> bytes:
    img = Image.new("RGB", (width, height), color=(120, 160, 200))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def test_algorithm_comparative_matrix():
    binary_service = BinaryService()
    cover_bytes = generate_test_image(256, 256)

    # 1000-bit sample payload
    payload_dict = {
        "ciphertext": "Q2lwaGVydGV4dERhdGExMjM0NTZfY29tcGFyaXNvbl90ZXN0X3N5c3RlbQ==",
        "salt": "U2FsdEJ5dGVzMTZfQnl0ZQ==",
        "nonce": "Tm9uY2VCeXRlczEy",
        "authentication_tag": "QXV0aFRhZ0J5dGVzMTZfXw==",
        "algorithm": "AES-256-GCM",
        "key_length": 256,
        "iterations": 100000,
    }
    payload_bitstream = binary_service.serialize(payload_dict)

    algorithms = ["LSB", "DCT", "DWT"]
    comparison_results = {}

    for alg in algorithms:
        strategy = EmbeddingFactory.get_strategy(alg)

        # Usable Capacity
        cap_bits = strategy.calculate_capacity(cover_bytes)

        # 1. Measure Embedding Execution
        t0 = time.perf_counter()
        stego_bytes, embed_meta = strategy.embed(cover_bytes, payload_bitstream)
        t_embed_ms = (time.perf_counter() - t0) * 1000.0

        # 2. Measure Extraction Execution
        t0 = time.perf_counter()
        extract_result = strategy.extract(stego_bytes)
        t_extract_ms = (time.perf_counter() - t0) * 1000.0

        # Verify Roundtrip
        if alg == "LSB":
            assert extract_result == payload_bitstream
        else:
            assert extract_result.recovered_payload == payload_bitstream

        # 3. Quality Metrics
        psnr = LSBUtils.calculate_psnr(cover_bytes, stego_bytes)
        mse = LSBUtils.calculate_mse(cover_bytes, stego_bytes)

        img_cover = np.array(Image.open(io.BytesIO(cover_bytes)))
        img_stego = np.array(Image.open(io.BytesIO(stego_bytes)))
        val_ssim = ssim(img_cover, img_stego, channel_axis=-1)

        comparison_results[alg] = {
            "capacity_bits": cap_bits,
            "embed_time_ms": round(t_embed_ms, 3),
            "extract_time_ms": round(t_extract_ms, 3),
            "psnr_db": round(psnr, 2),
            "mse": round(mse, 6),
            "ssim": round(val_ssim, 6),
        }

    # Print Comparative Matrix Table
    print("\n" + "=" * 100)
    print("HYBRID IMAGE STEGANOGRAPHY SYSTEM - ALGORITHM COMPARATIVE MATRIX REPORT")
    print("=" * 100)
    print(f"{'Algorithm':<12} | {'Capacity (bits)':<15} | {'Embed Speed (ms)':<16} | {'Extract Speed (ms)':<18} | {'PSNR (dB)':<10} | {'SSIM':<8}")
    print("-" * 100)
    for alg, res in comparison_results.items():
        print(f"{alg:<12} | {res['capacity_bits']:<15} | {res['embed_time_ms']:<16} | {res['extract_time_ms']:<18} | {res['psnr_db']:<10} | {res['ssim']:<8}")
    print("=" * 100)
