###### Firebase Setup for Android for google login (Step-by-Step) ######

## 1. Go to Firebase Console
🔗 [https://console.firebase.google.com/](https://console.firebase.google.com/)

## 2. Create a New Project
- Click **Add Project**
- Enter project name
- Complete the setup until project dashboard appears

## 3. Enable Google Sign-In
- Go to **Authentication** -> **Sign-in method**
- Click **Add new provider**
- Select **Google**
- Enable it and save

## 4. Configure Web Client ID
- Under the **Google** provider settings, find **Web SDK configuration**
- Copy the **Web Client ID**
- Add it to your mobile app's `.env` file:
  ```env
  EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=your-web-client-id
  ```

## 5. Add Android App to Firebase
- In Firebase Console → Open your project
- Navigate to **Project Settings**
- Under **Your Apps** section → click **Add App**
- Select **Android icon** 🤖

## 6. Enter Android Package Name
> [!IMPORTANT]
> This must match your app package exactly.

- **Example Current Project Package Name:** `com.myproject.dev`
- If this does not match your Android project → Firebase will not work.

## 7. Add SHA Certificate Fingerprints
- Still inside **Project Settings**
- Under **Your Apps** → select your Android app
- Find **SHA Fingerprints** section
- Add SHA1 keys for Google Sign-In, Phone Auth

## 8. Download google-services.json
- After adding SHA key → click **Download google-services.json**
- Move the file into your mobile app folder.

### Project Specific Location
Based on your `app.json` configuration, place the file in:
- **Dev:** `apps/mobile/config/dev/google-services.json`
- **Production:** `apps/mobile/config/production/google-services.json`

## Firebase Android Setup Complete 🎉








###### Firebase Setup for iOS for Google Login (Step-by-Step)###########

## 1. Go to Firebase Console
🔗 [https://console.firebase.google.com/](https://console.firebase.google.com/)

## 2. Create a New Project
- Create a new project or use an existing one.

## 3. Enable Google Sign-In
- Go to **Authentication** > **Sign-in method**
- Click **Add new provider**
- Select **Google**
- Enable it and **Save**

## 4. Configure Web Client ID
- Under the **Google** provider settings, find **Web SDK configuration**
- Copy the **Web Client ID**
- Add it to your mobile app's `.env` file:
  ```env
  EXPO_PUBLIC_FIREBASE_WEB_CLIENT_ID=your-web-client-id
  ```

## 5. Add iOS App to Firebase
- Open your Firebase project
- Navigate to **Project Settings**
- Under **Your Apps** → click **Add App**
- Select **iOS icon** 🍎

## 6. Enter iOS App Information
> [!IMPORTANT]
> The Bundle ID must match your Xcode project exactly.

- **Example Current Project Package Name:** `com.myproject.dev`
- If it does not match exactly → Authentication will fail.

| Field | Required | Notes |
| :--- | :--- | :--- |
| Apple Bundle ID | Must Match Project Package Name
| App Nickname | optional | For easier identification |
| App Store ID | optional | Only needed for release |

## 7. Download GoogleService-Info.plist
- Still in the iOS app setup page
- Click **Download GoogleService-Info.plist**
- Add this file to your mobile app project

### Project Specific Location
Based on your `app.json` configuration, place the file in:
- **Dev:** `apps/mobile/config/dev/GoogleService-Info.plist`
- **Production:** `apps/mobile/config/production/GoogleService-Info.plist`

## Firebase iOS Setup Complete 🎉

---







### Firebase Setup for Backend (Service Account)###

## 1. Generate Private Key
- Go to **Firebase Console** → **Project Settings**
- Navigate to **Service accounts** tab
- Select **Firebase Admin SDK**
- Click **Generate new private key**
- Confirm by clicking **Generate key**
- A JSON file will be downloaded containing your service account credentials.

## 2. Configure Backend Environment
- Open the downloaded JSON file.
- Copy the following values to your backend `.env` file (`apps/backend/.env`):

```env
FIREBASE_PROJECT_ID=your_project_id_from_json
FIREBASE_CLIENT_EMAIL=your_client_email_from_json
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```
---







##### Firebase Setup for Android for Phone Login (Step-by-Step)#####

## 1. Go to Firebase Console
🔗 [https://console.firebase.google.com/](https://console.firebase.google.com/)

## 2. Create a New Project
- Click **Add Project**
- Enter project name
- Complete the setup until project dashboard appears

## 3. Enable Phone Sign-In
- Go to **Authentication** -> **Sign-in method**
- Click **Add new provider**
- Select **Phone**
- Enable it and **Save**

## 4. Configure Test Phone Numbers (Optional)
- Under the **Phone** provider settings
- Find **Phone numbers for testing**
- Add a test phone number and verification code for development/testing purposes.

## 5. Add Android App to Firebase
- In Firebase Console → Open your project
- Navigate to **Project Settings**
- Under **Your Apps** section → click **Add App**
- Select **Android icon** 🤖

## 6. Enter Android Package Name
> [!IMPORTANT]
> This must match your app package exactly.

- **Example Current Project Package Name:** `com.myproject.dev`
- If this does not match your Android project → Firebase will not work.

## 7. Add SHA Certificate Fingerprints
- Still inside **Project Settings**
- Under **Your Apps** → select your Android app
- Find **SHA Fingerprints** section
- Add SHA1 keys for Google Sign-In, Phone Auth

## 8. Download google-services.json
- After adding SHA key → click **Download google-services.json**
- Move the file into your mobile app folder.

### Project Specific Location
Based on your `app.json` configuration, place the file in:
- **Dev:** `apps/mobile/config/dev/google-services.json`
- **Production:** `apps/mobile/config/production/google-services.json`

## Firebase Android Setup for phone login Complete 🎉

---





#### Firebase Setup for iOS for Phone Login (Step-by-Step) ###

## 1. Enable Phone Sign-In
- Go to **Authentication** -> **Sign-in method**
- Click **Add new provider**
- Select **Phone**
- Enable it and **Save** (if not already done)


## 3. Download GoogleService-Info.plist
- Go to **Project Settings** -> **General**
- Select your iOS App
- Click **Download GoogleService-Info.plist**
- Add this file to your mobile app project

#   4. Add iOS App to Firebase
- Open Firebase project
- Navigate to **Project Settings**
- Under **Your Apps** → click **Add App**
- Select **iOS icon** 🍎
orackage
## 5. Enter iOS App Information
> [!IMPORTANT]
> The Bundle ID must match your Xcode project exactly.

- **Example Current Project Package Name:** `com.myproject.dev`
- If it does not match exactly → Authentication will fail.

| Field | Required | Notes |
| :--- | :--- | :--- |
| Apple Bundle ID | Must Match Project Package Name
| App Nickname | optional | For easier identification |
| App Store ID | optional | Only needed for release |

## 6. Download GoogleService-Info.plist
- Still in the iOS app setup page
- Click **Download GoogleService-Info.plist**
- Add this file to your mobile app project


### Project Specific Location
Based on your `app.json` configuration, place the file in:
- **Dev:** `apps/mobile/config/dev/GoogleService-Info.plist`
- **Production:** `apps/mobile/config/production/GoogleService-Info.plist`

## Firebase iOS Phone Auth Setup Complete 🎉

---


##### Firebase Setup for Email/Password Login (Step-by-Step)#####

## 1. Enable Email/Password Sign-In
- Go to **Authentication** -> **Sign-in method**
- Click **Add new provider**
- Select **Email/Password**
- Enable **Email/Password**
- (Optional) Enable **Email link (passwordless sign-in)** if needed
- Click **Save**

## 2. No Additional Config Required
- Unlike Google or Phone auth, Email/Password does not require extra keys or certificates.

## Firebase Email/Password Setup Complete 🎉

---
