FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Expose port (Railway will provide PORT env var)
EXPOSE 8000

# Run application using shell form to expand $PORT
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
