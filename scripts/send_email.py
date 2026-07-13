#!/usr/bin/env python3
"""
Send a Gmail message via the Gmail API (gmail.send scope).

One-time setup performs an OAuth consent in the browser and caches a refresh
token at gmail_send_token.json, after which sending is fully non-interactive.

Reuses the existing Propcheck OAuth *client* (etls/credentials_new.json).
The Gmail API must be enabled in that client's Google Cloud project and the
gmail.send scope allowed on its consent screen.

Usage:
  python send_email.py --to a@b.com --subject "Hi" --body-file msg.txt
  python send_email.py --auth-only        # just do/refresh the consent
"""
import argparse
import base64
import os
import sys
from email.mime.text import MIMEText

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/gmail.send']
HERE = os.path.dirname(os.path.abspath(__file__))
# OAuth client reused from the etls project (Desktop app type)
CLIENT_SECRET = os.environ.get(
    'GMAIL_OAUTH_CLIENT',
    os.path.join(HERE, '..', '..', '..', 'etls', 'credentials_new.json'),
)
TOKEN_FILE = os.path.join(HERE, '..', 'gmail_send_token.json')


def get_service():
    creds = None
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(CLIENT_SECRET):
                sys.exit(f"ERROR: OAuth client not found at {CLIENT_SECRET}. "
                         "Set GMAIL_OAUTH_CLIENT to your client_secret json.")
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET, SCOPES)
            # Opens the browser for one-time consent. Try 8080 (a registered
            # redirect), fall back to an auto-chosen free port (the client also
            # allows the bare http://localhost redirect).
            try:
                creds = flow.run_local_server(port=8080, prompt='consent')
            except OSError:
                creds = flow.run_local_server(port=0, prompt='consent')
        with open(TOKEN_FILE, 'w') as f:
            f.write(creds.to_json())
    return build('gmail', 'v1', credentials=creds)


def send(to, subject, body, sender='me'):
    service = get_service()
    msg = MIMEText(body)
    msg['to'] = to
    msg['subject'] = subject
    raw = base64.urlsafe_b64encode(msg.as_bytes()).decode()
    sent = service.users().messages().send(userId='me', body={'raw': raw}).execute()
    return sent.get('id')


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--to')
    ap.add_argument('--subject', default='')
    ap.add_argument('--body-file')
    ap.add_argument('--body')
    ap.add_argument('--auth-only', action='store_true')
    a = ap.parse_args()

    if a.auth_only:
        get_service()
        print("AUTH OK — token cached at", os.path.abspath(TOKEN_FILE))
        return

    if not a.to:
        sys.exit("ERROR: --to is required")
    body = a.body
    if a.body_file:
        with open(a.body_file, encoding='utf-8') as f:
            body = f.read()
    if body is None:
        sys.exit("ERROR: provide --body or --body-file")

    mid = send(a.to, a.subject, body)
    print(f"SENT id={mid} to={a.to}")


if __name__ == '__main__':
    main()
