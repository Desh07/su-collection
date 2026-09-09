// ==========================================
// GOOGLE APPS SCRIPT - CRM OPTIMIZED WEBHOOK
// ==========================================
// 1. Go to Google Sheets, open your Leads spreadsheet.
// 2. Ensure the first tab is named exactly "Leads"
// 3. Set the following column headers exactly in Row 1:
//    A: Timestamp
//    B: Name
//    C: Phone
//    D: Email
//    E: Location
//    F: Primary Route
//    G: Current Situation
//    H: Primary Goal
//    I: Business Type / Industry
//    J: Experience / Maturity
//    K: Main Challenges
//    L: Digital Presence
//    M: Closing Note
//    N: Technical Score
//    O: Business Score
//    P: DIY Score
//    Q: DFY Score
// 4. Go to Extensions > Apps Script
// 5. Paste this entire code block into Code.gs (replace everything there)
// 6. Click Deploy > Manage Deployments
// 7. Click the pencil icon (Edit) on your existing deployment.
// 8. Under "Version", select "New version"
// 9. Click Deploy. (DO NOT create a whole new deployment from scratch, just a new version).

function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ "error": "Sheet 'Leads' not found" })).setMimeType(ContentService.MimeType.JSON);
    }

    const data = JSON.parse(e.postData.contents);
    let answers = {};
    try {
      answers = JSON.parse(data.rawAnswers || "{}");
    } catch(err) {
      // Ignore parse errors if rawAnswers is empty
    }

    // Prepare CRM row data
    const problemsText = Array.isArray(answers.problems) ? answers.problems.join(", ") : (answers.problems || "");
    const experienceMaturity = answers.tailoringYears ? answers.tailoringYears : (answers.businessMaturity || "");

    const rowData = [
      data.timestamp,
      data.name || "",
      data.phone || "",
      data.email || "",
      data.location || "",
      data.primaryRoute || "NURTURE",
      answers.currentSituation || "",
      answers.primaryGoal || "",
      answers.businessType || "",
      experienceMaturity,
      problemsText,
      answers.digitalPresence || "",
      answers.closingNote || "",
      data.technicalScore || 0,
      data.businessScore || 0,
      data.diyScore || 0,
      data.dfyScore || 0
    ];

    // Search for existing entry to prevent duplicates
    const lastRow = sheet.getLastRow();
    let targetRowIndex = -1;
    
    if (lastRow > 1) {
      // Fetch Phone (Col C) and Email (Col D)
      const searchData = sheet.getRange(2, 3, lastRow - 1, 2).getValues();
      
      const incomingPhone = (data.phone || "").toString().trim();
      const incomingEmail = (data.email || "").toString().trim().toLowerCase();
      
      // Search backwards to update the most recent attempt
      for (let i = searchData.length - 1; i >= 0; i--) {
        const rowPhone = searchData[i][0].toString().trim();
        const rowEmail = searchData[i][1].toString().trim().toLowerCase();
        
        if (incomingPhone && rowPhone === incomingPhone) {
          targetRowIndex = i + 2;
          break;
        }
        if (incomingEmail && rowEmail === incomingEmail) {
          targetRowIndex = i + 2;
          break;
        }
      }
    }

    if (targetRowIndex > -1) {
      // Update existing row (prevents duplicates and fills in the rest of the data)
      sheet.getRange(targetRowIndex, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // Append new row
      sheet.appendRow(rowData);
    }

    return ContentService.createTextOutput(JSON.stringify({ "status": "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ "error": error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}
