from fastapi import FastAPI

app = FastAPI(title="Financial Metrics API")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
