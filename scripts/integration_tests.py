#!/usr/bin/env python3
import urllib.request
import urllib.parse
import urllib.error
import json
import http.cookiejar
import unittest
import sys
import argparse

# Global variable to hold target URL
BACKEND_URL = "http://localhost:8001"

class TestConectarAuth(unittest.TestCase):
    # Class variables to persist tokens between sequential tests
    admin_token = None
    parent_token = None
    cookie_jar = None
    opener = None

    @classmethod
    def setUpClass(cls):
        # Set up a cookie jar to persist cookies (like refreshToken HttpOnly cookie)
        cls.cookie_jar = http.cookiejar.CookieJar()
        cookie_processor = urllib.request.HTTPCookieProcessor(cls.cookie_jar)
        cls.opener = urllib.request.build_opener(cookie_processor)
        
        # Verify connection to the API before running tests
        try:
            # We hit a public endpoint or check if online
            print(f"Testing connectivity to NestJS Backend at: {BACKEND_URL}")
            cls.opener.open(f"{BACKEND_URL}/api/auth/login", data=b"", timeout=3)
        except urllib.error.HTTPError as e:
            # We expect a 400/401/405 for empty POST, which is fine (means backend is up)
            print("Connected successfully to the backend API.")
        except Exception as e:
            print(f"\n[ERROR] Could not connect to backend at {BACKEND_URL}.\nMake sure the NestJS server is running!\nDetails: {e}\n")
            sys.exit(1)

    def make_request(self, path, method="GET", data=None, token=None):
        url = f"{BACKEND_URL}/api{path}"
        req_data = None
        if data is not None:
            req_data = json.dumps(data).encode("utf-8")

        req = urllib.request.Request(url, data=req_data, method=method)
        req.add_header("Content-Type", "application/json")
        
        if token:
            req.add_header("Authorization", f"Bearer {token}")

        try:
            response = self.opener.open(req)
            resp_body = response.read().decode("utf-8")
            return response.status, json.loads(resp_body) if resp_body else {}
        except urllib.error.HTTPError as e:
            resp_body = e.read().decode("utf-8")
            try:
                err_json = json.loads(resp_body)
            except Exception:
                err_json = {"message": resp_body}
            return e.code, err_json

    def test_01_login_professional_success(self):
        print("\n[TEST 1] Logging in as Professional/Admin...")
        credentials = {
            "email": "admin@conectar.com",
            "password": "123456"
        }
        status, body = self.make_request("/auth/login", "POST", data=credentials)
        
        self.assertEqual(status, 200, f"Login failed: {body}")
        self.assertIn("accessToken", body)
        self.assertIn("usuario", body)
        self.assertEqual(body["usuario"]["email"], "admin@conectar.com")
        self.assertEqual(body["usuario"]["perfil"], "ADMINISTRADOR")
        
        # Save token for next tests
        TestConectarAuth.admin_token = body["accessToken"]
        
        # Check if the refreshToken cookie was stored in the jar
        cookies = [c.name for c in self.cookie_jar]
        self.assertIn("refreshToken", cookies, "HttpOnly refreshToken cookie was not set by the server!")
        print("✔ Success: Professional logged in and HttpOnly cookie captured.")

    def test_02_get_profile_success(self):
        print("\n[TEST 2] Getting authenticated profile (/auth/me)...")
        self.assertIsNotNone(TestConectarAuth.admin_token, "Skip: Admin token not set")
        
        status, body = self.make_request("/auth/me", "GET", token=TestConectarAuth.admin_token)
        
        self.assertEqual(status, 200, f"Profile request failed: {body}")
        self.assertEqual(body["email"], "admin@conectar.com")
        self.assertEqual(body["perfil"], "ADMINISTRADOR")
        print("✔ Success: Profile authenticated successfully using Bearer token.")

    def test_03_login_parent_portal_success(self):
        print("\n[TEST 3] Logging in as Parent (Portal dos Pais)...")
        # Reset cookies for parent login to simulate a fresh browser session
        self.cookie_jar.clear()
        
        credentials = {
            "email": "mariana.mendes@email.com",
            "password": "123456"
        }
        status, body = self.make_request("/auth/login-responsavel", "POST", data=credentials)
        
        self.assertEqual(status, 200, f"Parent portal login failed: {body}")
        self.assertIn("accessToken", body)
        self.assertIn("responsavel", body)
        self.assertEqual(body["responsavel"]["email"], "mariana.mendes@email.com")
        self.assertEqual(body["responsavel"]["perfil"], "PAIS")
        
        # Save parent token for rotation test
        TestConectarAuth.parent_token = body["accessToken"]
        
        # Verify the cookie was stored
        cookies = [c.name for c in self.cookie_jar]
        self.assertIn("refreshToken", cookies, "HttpOnly refreshToken cookie not set for parent login!")
        print("✔ Success: Parent logged in successfully to the portal.")

    def test_04_token_refresh_success(self):
        print("\n[TEST 4] Refreshing access token (/auth/refresh)...")
        # We send NO Authorization header, only the stored cookies (refreshToken)
        status, body = self.make_request("/auth/refresh", "POST")
        
        self.assertEqual(status, 200, f"Refresh token failed: {body}")
        self.assertIn("accessToken", body)
        self.assertIsNotNone(body["accessToken"])
        self.assertNotEqual(body["accessToken"], TestConectarAuth.parent_token, "Refreshed token must be different")
        
        # Update the token
        TestConectarAuth.parent_token = body["accessToken"]
        print("✔ Success: Token refreshed and rotated using HTTP-only cookie.")

    def test_05_logout_success(self):
        print("\n[TEST 5] Logging out (/auth/logout)...")
        # Send logout call (needs authentication token to authorize audit logging)
        status, body = self.make_request("/auth/logout", "POST", token=TestConectarAuth.parent_token)
        
        self.assertEqual(status, 200, f"Logout failed: {body}")
        self.assertEqual(body["message"], "Logout realizado com sucesso")
        
        # Verify the cookie was deleted/cleared in the cookie jar
        # Note: server should respond with clearCookie which expires the cookie
        # In urllib cookie jar, expired cookies are removed automatically or have old expiration.
        # Let's inspect the cookies inside the jar
        non_expired_cookies = [c.value for c in self.cookie_jar if not c.is_expired()]
        self.assertNotIn("refreshToken", [c.name for c in self.cookie_jar if not c.is_expired()], "refreshToken cookie was not cleared after logout!")
        print("✔ Success: Logged out and cookie successfully cleared.")

    def test_06_login_invalid_credentials(self):
        print("\n[TEST 6] Testing invalid login credentials...")
        bad_credentials = {
            "email": "admin@conectar.com",
            "password": "wrongpassword"
        }
        status, body = self.make_request("/auth/login", "POST", data=bad_credentials)
        self.assertEqual(status, 401)
        self.assertEqual(body["message"], "Credenciais inválidas")
        print("✔ Success: Server correctly rejected invalid credentials with 401.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Integration Tests for Conectar Auth API")
    parser.add_argument(
        "--url", "-u",
        default="http://localhost:8001",
        help="Base URL of the backend API (default: http://localhost:8001)"
    )
    
    # Parse known args so unittest doesn't crash on unrecognized flags
    args, unknown = parser.parse_known_args()
    BACKEND_URL = args.url.rstrip("/")
    
    # Remove our custom args from sys.argv so unittest.main() doesn't parse them
    sys.argv = [sys.argv[0]] + unknown
    
    # Run the tests sequentially
    unittest.main()
