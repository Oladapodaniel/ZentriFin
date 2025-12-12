# Authentication Setup Guide

## 1. API Keys for Social Login

To enable Google and Microsoft login, you need to obtain API keys from their respective developer consoles and add them to your `.env` file.

### Google OAuth
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  Select **Web application**.
6.  Add `http://localhost:3000` to **Authorized JavaScript origins**.
7.  Add `http://localhost:3000/api/auth/callback/google` to **Authorized redirect URIs**.
8.  Copy the **Client ID** and **Client Secret**.
9.  Add them to your `.env` file:
    ```env
    AUTH_GOOGLE_ID=your_client_id
    AUTH_GOOGLE_SECRET=your_client_secret
    ```

### Microsoft Entra ID (Azure AD)
1.  Go to the [Azure Portal](https://portal.azure.com/).
2.  Search for **App registrations** and select it.
3.  Click **New registration**.
4.  Enter a name (e.g., "BankStatement Pro").
5.  Set **Redirect URI** to `Web` and `http://localhost:3000/api/auth/callback/microsoft-entra-id`.
6.  Register the app.
7.  Copy the **Application (client) ID** -> this is your `AUTH_MICROSOFT_ENTRA_ID_ID`.
8.  Go to **Certificates & secrets** > **New client secret**.
9.  Copy the **Value** (not the Secret ID) -> this is your `AUTH_MICROSOFT_ENTRA_ID_SECRET`.
10. Add them to your `.env` file:
    ```env
    AUTH_MICROSOFT_ENTRA_ID_ID=your_client_id
    AUTH_MICROSOFT_ENTRA_ID_SECRET=your_client_secret
    AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=common
    ```

## 2. Auto-Login
The signup flow has been updated to automatically log you in upon successful registration. You will be redirected directly to the `/projects` dashboard.
