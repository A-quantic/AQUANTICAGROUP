"""Application configuration"""

from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "AQUANTICA API"
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/aquantica"
    
    # Clerk Auth
    CLERK_SECRET_KEY: str = ""
    CLERK_PUBLISHABLE_KEY: str = ""
    
    # AI Provider (openai, groq, gemini, huggingface, local)
    AI_PROVIDER: str = "local"  # Default: free local responses
    
    # OpenAI (optional - expensive)
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o"
    
    # Free AI Alternatives
    GROQ_API_KEY: str = ""  # Free tier: 20 req/min
    GEMINI_API_KEY: str = ""  # Free tier: 15 req/min
    HUGGINGFACE_API_KEY: str = ""  # Free tier: ~1000 req/day
    
    # Ollama (Local AI via ngrok)
    AI_BASE_URL: str = ""  # e.g., https://washbasin-sibling-appraiser.ngrok-free.dev
    AI_API_KEY: str = ""   # e.g., ollama_local
    AI_MODEL_NAME: str = ""  # e.g., inmo-assistant
    
    # Pinecone (optional for RAG)
    PINECONE_API_KEY: str = ""
    PINECONE_INDEX: str = "aquantica"
    PINECONE_ENVIRONMENT: str = "us-west-2"
    
    # AWS S3
    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_BUCKET_NAME: str = "aquantica-documents"
    AWS_REGION: str = "us-east-1"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "https://aquantica-group.com",
        "https://www.aquantica-group.com",
        "https://a-quantic-aquanticagroup.vercel.app",
        "https://*.vercel.app",
    ]
    
    # Webhooks
    WEBHOOK_SECRET: str = ""
    WHATSAPP_API_KEY: str = ""
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
