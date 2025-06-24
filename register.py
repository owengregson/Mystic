import argparse
import getpass
import sys
import requests

"""Simple CLI utility to create Mystic accounts via the API."""

API_URL = "https://mystic.ac/api/register/"

def register(username: str, password: str, token: str = "your_creation_key_here") -> dict:
    payload = {
        "username": username,
        "password": password,
        "token": token
    }
    resp = requests.post(API_URL, json=payload, timeout=10)
    try:
        resp.raise_for_status()
    except requests.HTTPError as e:
        raise SystemExit(
            f"Registration failed [{resp.status_code}]: {resp.text}"
        ) from e
    return resp.json()

def main(argv: list[str]) -> None:
    parser = argparse.ArgumentParser(
        description="Register a new user on Mystic."
    )
    parser.add_argument("username", help="Desired username (3-16 chars A-Z 0-9 _)")
    args = parser.parse_args(argv)

    pwd = getpass.getpass("Choose password (min 8 chars): ")
    if len(pwd) < 8:
        sys.exit("Password too short.")

    token = getpass.getpass("Enter creation key: ")
    if len(token) < 1:
        sys.exit("Creation key cannot be empty.")

    result = register(args.username, pwd, token)
    print("Server response:", result)

if __name__ == "__main__":
    main(sys.argv[1:])

