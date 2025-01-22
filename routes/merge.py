from fastapi import APIRouter, File, UploadFile, Form
from fastapi.responses import StreamingResponse
from pikepdf import Pdf
import io

router = APIRouter()

@router.post("/merge")
async def merge_pdfs(files: list[UploadFile] = File(...), 
                     insert_blank: bool = Form(default=False),
                     file_order: str = Form(default=""),
                     file_name: str = Form(default="merged.pdf")):
    merged_pdf = Pdf.new()

    order = list(map(int, file_order.split(' ')))
    files = [files[i] for i in order]

    for file in files:
        content = await file.read()
        pdf = Pdf.open(io.BytesIO(content))
        for n, page in enumerate(pdf.pages):
            merged_pdf.pages.append(page)
        if insert_blank and len(pdf.pages) % 2 != 0:
            merged_pdf.add_blank_page()
        pdf.close()
    merged_pdf.close()

    output_buffer = io.BytesIO()
    merged_pdf.save(output_buffer)
    output_buffer.seek(0)
    if not file_name.endswith('.pdf'):
        file_name += '.pdf'
    return StreamingResponse(output_buffer, media_type="application/pdf", headers={"Content-Disposition": f'attachment; filename={file_name}'})
