import { google } from "googleapis";

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
const CLIENT_EMAIL = "YOUR_SERVICE_ACCOUNT_EMAIL";
const PRIVATE_KEY = "YOUR_PRIVATE_KEY".replace(/\\n/g, "\n");

// Initialize Google Sheets API
const auth = new google.auth.JWT(CLIENT_EMAIL, undefined, PRIVATE_KEY, [
  "https://www.googleapis.com/auth/spreadsheets.readonly",
]);

const sheets = google.sheets({ version: "v4", auth });

export const validateUser = async (email: string, password: string) => {
  try {
    const range = "Users!A2:B"; // Assuming emails are in column A and passwords in column B
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range,
    });

    const users = response.data.values || [];

    // Check if the given email & password match any record
    return users.some(([storedEmail, storedPassword]) => 
      storedEmail === email && storedPassword === password
    );
  } catch (error) {
    console.error("Error validating user:", error);
    return false;
  }
};
