from fastapi import Request, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv
import httpx
import json

load_dotenv()

# Clerk API details
CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_JWT_ISSUER = "https://api.clerk.com"  # Default Clerk issuer

# Set up security scheme
security = HTTPBearer()


async def get_clerk_jwks() -> Dict[str, Any]:
    """
    Fetch the JSON Web Key Set (JWKS) from Clerk.
    This is used to verify token signatures.
    """
    async with httpx.AsyncClient() as client:
        response = await client.get("https://api.clerk.com/.well-known/jwks.json")
        response.raise_for_status()
        return response.json()


async def verify_jwt_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict[str, Any]:
    """
    Verify the JWT token from Clerk and extract the payload.
    """
    if not credentials:
        raise HTTPException(status_code=401, detail="No credentials provided")
    
    token = credentials.credentials
    
    try:
        # In development mode, decode with a dummy key
        if os.getenv("DEBUG", "False").lower() == "true":
            # Providing a dummy key since python-jose requires a key parameter
            # even when verify_signature is False
            payload = jwt.decode(
                token,
                key="dummy_key_for_development",  # Dummy key that won't be used for verification
                options={
                    "verify_signature": False,
                    "verify_exp": False,  # Skip expiration verification
                    "verify_nbf": False,  # Skip "not before" verification
                    "verify_iat": False,  # Skip "issued at" verification
                    "verify_aud": False,  # Skip audience verification
                    "verify_iss": False,  # Skip issuer verification
                }
            )
            
            # Debug: Print token payload in development mode
            print("JWT Token Payload FULL:", token[:20] + "..." + token[-20:])
            print("JWT Token Payload:", json.dumps(payload, indent=2))
            
            # Enhanced email extraction - Clerk specific format
            email = None
            
            # Method 1: Direct email field
            if 'email' in payload:
                email = payload['email']
                print(f"Found email directly in token: {email}")
            
            # Method 2: Check for primary_email_address in Clerk tokens
            elif 'primary_email_address' in payload:
                email = payload['primary_email_address']
                print(f"Found email in primary_email_address: {email}")
            
            # Method 3: Check for Clerk's email_addresses array
            elif 'email_addresses' in payload and isinstance(payload['email_addresses'], list) and len(payload['email_addresses']) > 0:
                if isinstance(payload['email_addresses'][0], dict) and 'email_address' in payload['email_addresses'][0]:
                    email = payload['email_addresses'][0]['email_address']
                    print(f"Found email in email_addresses array: {email}")
                elif isinstance(payload['email_addresses'][0], str):
                    email = payload['email_addresses'][0]
                    print(f"Found email in email_addresses array (string format): {email}")
            
            # Method 4: Check Clerk's user_data structure
            elif 'user_data' in payload and isinstance(payload['user_data'], dict):
                user_data = payload['user_data']
                if 'email_addresses' in user_data and len(user_data['email_addresses']) > 0:
                    if isinstance(user_data['email_addresses'][0], dict) and 'email_address' in user_data['email_addresses'][0]:
                        email = user_data['email_addresses'][0]['email_address']
                        print(f"Found email in user_data.email_addresses: {email}")
                    elif isinstance(user_data['email_addresses'][0], str):
                        email = user_data['email_addresses'][0]
                        print(f"Found email in user_data.email_addresses (string format): {email}")
                elif 'primary_email_address' in user_data:
                    email = user_data['primary_email_address']
                    print(f"Found email in user_data.primary_email_address: {email}")
            
            # Method 5: Try standard OpenID Connect & OAuth2 fields
            elif 'preferred_username' in payload and '@' in payload['preferred_username']:
                email = payload['preferred_username']
                print(f"Found email-like username in preferred_username: {email}")
            elif 'sub' in payload and '@' in payload['sub']:
                email = payload['sub']
                print(f"Found email-like sub claim: {email}")
            
            # If we found an email, add it to the payload
            if email:
                payload['email'] = email
            else:
                print("Could not find email in token with keys:", list(payload.keys()))
                
                # For Clerk tokens, try to extract from azp or sub as a last resort
                if 'azp' in payload:
                    print(f"AZP claim found: {payload['azp']}")
                if 'sub' in payload:
                    print(f"SUB claim found: {payload['sub']}")
                
                # Clerk user ID might be in 'sub' claim
                if 'sub' in payload:
                    # Extracting Clerk user ID from sub claim
                    user_id = payload['sub']
                    print(f"Using Clerk user ID as fallback: {user_id}")
                    # For development: Create a fake email from the user ID
                    fake_email = f"{user_id}@clerk.user"
                    print(f"Created fake email for development: {fake_email}")
                    payload['email'] = fake_email
                    payload['is_fake_email'] = True
            
        else:
            # In production, use the Clerk secret key to verify
            payload = jwt.decode(
                token,
                CLERK_SECRET_KEY,
                algorithms=["HS256"],  # Clerk uses HS256 with the secret key
                options={"verify_aud": False, "verify_iss": False}
            )
        
        return payload
        
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}") 