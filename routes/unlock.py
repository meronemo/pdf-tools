from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from pikepdf import Pdf
import io

router = APIRouter()

@router.post("/unlock")
async def unlock_pdf(file: UploadFile = File(...),
                     file_name: str = Form(default="unlocked.pdf")):
    unlocked_pdf = Pdf.new()
    content = await file.read()
    pdf = Pdf.open(io.BytesIO(content))
    for n, page in enumerate(pdf.pages):
        unlocked_pdf.pages.append(page)
    pdf.close()
    unlocked_pdf.close()

    output_buffer = io.BytesIO()
    unlocked_pdf.save(output_buffer)
    output_buffer.seek(0)
    return StreamingResponse(output_buffer, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename={file_name}'})
