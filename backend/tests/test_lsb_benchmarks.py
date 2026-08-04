"""
Performance & Throughput Benchmarks for LSB Steganography System (Phase 4A.5).
Measures capacity calculation speed, embedding throughput, extraction throughput, and image quality (PSNR/MSE).
"""

import io
import time
import pytest
from PIL import Image

from app.steganography.lsb.capacity import LSBCapacityCalculator
from app.steganography.lsb.embed import LSBEmbedder
from app.steganography.lsb.extract import LSBExtractor
from app.steganography.lsb.utils import LSBUtils


def generate_test_image(width: int, height: int, mode: str = "RGB", fmt: str = "PNG") -> bytes:
    img = Image.new(mode, (width, height), color=(100, 150, 200))
    buf = io.BytesIO()
    img.save(buf, format=fmt)
    return buf.getvalue()


@pytest.mark.benchmark
def test_lsb_performance_benchmarks():
    calculator = LSBCapacityCalculator()
    embedder = LSBEmbedder()
    extractor = LSBExtractor()

    resolutions = [
        ("Small (100x100)", 100, 100),
        ("Medium (300x300)", 300, 300),
        ("Large (500x500)", 500, 500),
    ]

    benchmark_results = []

    for name, w, h in resolutions:
        cover_bytes = generate_test_image(w, h)

        # 1. Benchmark Capacity Calculation
        t0 = time.perf_counter()
        usable_capacity_bits = calculator.calculate_capacity(cover_bytes)
        t_calc_ms = (time.perf_counter() - t0) * 1000.0

        from app.processing.binary.service import BinaryService
        binary_service = BinaryService()
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



        # 2. Benchmark Embedding Engine
        t0 = time.perf_counter()
        embed_res = embedder.embed(cover_bytes, payload_bits)
        t_embed_ms = (time.perf_counter() - t0) * 1000.0
        stego_bytes = embed_res.stego_image_bytes

        # 3. Benchmark Extraction Engine
        t0 = time.perf_counter()
        extract_res = extractor.extract(stego_bytes)
        t_extract_ms = (time.perf_counter() - t0) * 1000.0

        # 4. Image Quality Metrics
        psnr = LSBUtils.calculate_psnr(cover_bytes, stego_bytes)
        mse = LSBUtils.calculate_mse(cover_bytes, stego_bytes)

        # Assert correctness
        assert extract_res.recovered_payload == payload_bits
        assert psnr >= 40.0

        benchmark_results.append({
            "resolution": name,
            "calc_time_ms": round(t_calc_ms, 3),
            "embed_time_ms": round(t_embed_ms, 3),
            "extract_time_ms": round(t_extract_ms, 3),
            "psnr_db": psnr,
            "mse": round(mse, 6),
        })

    print("\n" + "=" * 70)
    print("LSB STEGANOGRAPHY SYSTEM PERFORMANCE BENCHMARK REPORT")
    print("=" * 70)
    for res in benchmark_results:
        print(f"[{res['resolution']}]")
        print(f"  Capacity Calc Time : {res['calc_time_ms']} ms")
        print(f"  Embedding Time     : {res['embed_time_ms']} ms")
        print(f"  Extraction Time    : {res['extract_time_ms']} ms")
        print(f"  PSNR Image Quality : {res['psnr_db']} dB (MSE: {res['mse']})")
        print("-" * 70)
