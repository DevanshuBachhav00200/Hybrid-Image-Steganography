import io
import time
from pathlib import Path
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
from app.services.image_service import ImageService
from app.services.cleanup_service import CleanupService

client = TestClient(app)


def create_test_image_bytes(format_name: str = "PNG", size: tuple = (100, 100), color: str = "red") -> bytes:
    """Helper utility to generate valid in-memory image bytes for PNG or BMP formats."""
    img = Image.new("RGB", size, color=color)
    buf = io.BytesIO()
    img.save(buf, format=format_name)
    return buf.getvalue()


# Test 1: Valid PNG Upload
def test_upload_valid_png():
    file_bytes = create_test_image_bytes("PNG")
    files = {"file": ("test_cover.png", file_bytes, "image/png")}
    response = client.post("/api/v1/upload/image", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "upload_id" in data
    assert data["filename"] == "test_cover.png"
    assert data["metadata"]["extension"] == "PNG"
    assert data["metadata"]["width"] == 100
    assert data["metadata"]["height"] == 100


# Test 2: Valid BMP Upload
def test_upload_valid_bmp():
    file_bytes = create_test_image_bytes("BMP")
    files = {"file": ("test_stego.bmp", file_bytes, "image/bmp")}
    response = client.post("/api/v1/upload/image", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["metadata"]["extension"] == "BMP"


# Test 3: Invalid JPEG Upload (Rejected)
def test_upload_invalid_jpeg_rejected():
    img = Image.new("RGB", (100, 100), color="blue")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    jpeg_bytes = buf.getvalue()

    files = {"file": ("sample.jpg", jpeg_bytes, "image/jpeg")}
    response = client.post("/api/v1/upload/image", files=files)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "UNSUPPORTEDFORMAT"
    assert ".jpg" in data["error"]["message"] or "PNG and BMP" in data["error"]["message"]


# Test 4: Invalid MIME / Magic Bytes Mismatch (Fake extension)
def test_upload_fake_extension_magic_bytes_mismatch():
    # JPEG content named fake.png
    img = Image.new("RGB", (100, 100), color="green")
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    fake_png_bytes = buf.getvalue()

    files = {"file": ("fake.png", fake_png_bytes, "image/png")}
    response = client.post("/api/v1/upload/image", files=files)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "UNSUPPORTEDFORMAT"


# Test 5: Oversized File Rejection
def test_upload_oversized_file():
    # Simulate oversized byte array > 10MB
    oversized_bytes = b"\x89PNG\r\n\x1a\n" + b"\x00" * (10485760 + 100)
    files = {"file": ("large.png", oversized_bytes, "image/png")}
    response = client.post("/api/v1/upload/image", files=files)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "IMAGETOOLARGE"


# Test 6: Corrupted Image Rejection
def test_upload_corrupted_image():
    corrupted_bytes = b"\x89PNG\r\n\x1a\ncorrupted_pixel_garbage_data_12345"
    files = {"file": ("corrupt.png", corrupted_bytes, "image/png")}
    response = client.post("/api/v1/upload/image", files=files)
    assert response.status_code == 400
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] in ["CORRUPTEDIMAGE", "INVALIDIMAGE"]


# Test 7: Missing File Parameter
def test_upload_missing_file():
    response = client.post("/api/v1/upload/image")
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_FAILED"


# Test 8: Cleanup Service Purge
def test_temp_cleanup_service():
    service = ImageService()
    cleanup = CleanupService()
    
    # Create test upload
    png_bytes = create_test_image_bytes("PNG")
    upload_id, meta, path = service.upload_image(png_bytes, "cleanup_test.png")
    assert path.exists()

    # Immediate cleanup shouldn't purge recent file
    purged_recent = cleanup.clean_expired_uploads(expiration_seconds=3600)
    assert path.exists()

    # Force cleanup with expiration_seconds=-1 to purge immediately
    purged_expired = cleanup.clean_expired_uploads(expiration_seconds=-1)
    assert purged_expired >= 1
    assert not path.exists()
