from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="FactCheck AI API", version="0.1.0")


class ClaimRequest(BaseModel):
    text: str
    language: str = "ru"


class ClaimResponse(BaseModel):
    claim: str
    verdict: str = "not_enough"
    explanation: str | None = None


@app.post("/check", response_model=ClaimResponse)
async def check_claim(req: ClaimRequest) -> ClaimResponse:
    """Placeholder endpoint for claim checking."""
    # TODO: integrate OpenAI and search services
    return ClaimResponse(claim=req.text)


@app.get("/ping")
async def ping() -> dict[str, str]:
    return {"status": "ok"}
