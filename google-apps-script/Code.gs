/**
 * ============================================================================
 * AARANYA INTERIORS — GOOGLE SHEETS CRM & EMAIL AUTOMATION (Google Apps Script)
 * Developed by AI Business Growth Lab
 * ============================================================================
 *
 * SETUP SUMMARY:
 * 1. Create a Google Sheet (one for LIVE, and a separate one for DEMO if desired).
 * 2. Open Extensions -> Apps Script and paste this entire file into Code.gs.
 * 3. In Project Settings -> Script Properties, add:
 *      - WEBHOOK_SECRET = <same random string as APPS_SCRIPT_SECRET in .env / Vercel>
 *      - OWNER_EMAIL    = <your studio owner email address>
 * 4. Run `setupLiveWorkspace()` once (or `setupDemoWorkspace()` on your demo sheet).
 *    Authorize permissions when prompted.
 * 5. Optional: Run `installDailyReminderTrigger()` once to enable daily 9:00 AM
 *    pending & overdue follow-up email digests.
 * 6. Click Deploy -> New deployment -> Web app:
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Copy the Web App URL into Vercel / .env as APPS_SCRIPT_WEBHOOK_URL.
 */

var SHEET_NAMES = {
  LEADS: 'Customer Leads',
  QUERIES: 'Customer Queries',
  DASHBOARD: 'Dashboard',
  SETTINGS: 'Settings',
  LOG: 'Notification Log',
};

var LEAD_STATUSES = [
  'New Lead',
  'Contacted',
  'Consultation Scheduled',
  'Site Visit Done',
  'Quotation Shared',
  'Negotiation',
  'Converted',
  'Lost',
  'On Hold',
];

var QUERY_STATUSES = ['Pending', 'In Review', 'Resolved'];

var DESIGNERS = ['Unassigned', 'Kavya Nair', 'Raghav Menon', 'Nikhil Rao'];

/**
 * Custom menu inside Google Sheets for one-click administration.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Aaranya Studio CRM')
    .addItem('Initialize Live Workspace', 'setupLiveWorkspace')
    .addItem('Initialize & Seed Demo Workspace (25 Leads + 10 Queries)', 'setupDemoWorkspace')
    .addSeparator()
    .addItem('Rebuild Dashboard Charts & Formulas', 'rebuildDashboardOnly')
    .addItem('Run Daily Follow-Up Digest Now', 'sendDailyFollowUpDigest')
    .addItem('Install Daily 9 AM Reminder Trigger', 'installDailyReminderTrigger')
    .addToUi();
}

/**
 * One-click setup for LIVE production spreadsheet (empty data rows, full structure).
 */
function setupLiveWorkspace() {
  initializeSpreadsheetStructure('LIVE');
}

/**
 * One-click setup for DEMONSTRATION spreadsheet (populates 25 synthetic leads + 10 queries).
 */
function setupDemoWorkspace() {
  var ss = initializeSpreadsheetStructure('DEMO');
  seedDemoRecords(ss);
  buildDashboardTab(ss);
}

function rebuildDashboardOnly() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  buildDashboardTab(ss);
}

/**
 * Creates all 5 tabs, headers, validations, conditional formatting, and dashboard.
 */
function initializeSpreadsheetStructure(mode) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  ensureTab(ss, SHEET_NAMES.DASHBOARD);
  ensureTab(ss, SHEET_NAMES.LEADS);
  ensureTab(ss, SHEET_NAMES.QUERIES);
  ensureTab(ss, SHEET_NAMES.SETTINGS);
  ensureTab(ss, SHEET_NAMES.LOG);

  // Remove default "Sheet1" if empty and unused
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1 && defaultSheet.getLastRow() === 0) {
    ss.deleteSheet(defaultSheet);
  }

  setupSettingsTab(ss, mode);
  setupLeadsTab(ss);
  setupQueriesTab(ss);
  setupNotificationLogTab(ss);
  buildDashboardTab(ss);

  return ss;
}

function ensureTab(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  return sheet;
}

function setupSettingsTab(ss, mode) {
  var sheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  sheet.clear();

  var ownerEmail =
    PropertiesService.getScriptProperties().getProperty('OWNER_EMAIL') ||
    Session.getActiveUser().getEmail() ||
    '';

  var rows = [
    ['Setting Key', 'Setting Value', 'Description'],
    ['WORKSPACE_MODE', mode === 'DEMO' ? 'DEMO' : 'LIVE', 'LIVE sends emails; DEMO disables external customer outreach'],
    ['BUSINESS_NAME', 'Aaranya Interiors', 'Studio name used in automated email signatures'],
    ['OWNER_EMAIL', ownerEmail, 'Primary recipient for new lead, query, and overdue follow-up alerts'],
    ['STUDIO_PHONE', 'Configure in Settings', 'Contact phone displayed in customer acknowledgement emails'],
    ['STUDIO_ADDRESS', 'Greater Noida · Noida Extension · Delhi NCR', 'Studio location included in emails'],
    ['AUTO_REPLY_CUSTOMER', mode === 'DEMO' ? 'NO' : 'YES', 'YES sends instant acknowledgement emails to live customers'],
    ['OWNER_ALERT_EMAILS', 'YES', 'YES notifies business owner on new enquiries & queries'],
    ['DAILY_REMINDER_ENABLED', mode === 'DEMO' ? 'NO' : 'YES', 'YES enables daily pending & overdue follow-up digest'],
    ['DEVELOPER_BRAND', 'AI Business Growth Lab', 'Automation architecture partner'],
  ];

  sheet.getRange(1, 1, rows.length, 3).setValues(rows);
  styleHeaderRow(sheet, 1, 3);
  sheet.setColumnWidths(1, 3, 260);
  sheet.setFrozenRows(1);
}

function setupLeadsTab(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.LEADS);
  var headers = [
    'Lead ID',
    'Submitted Timestamp',
    'Submitted Month',
    'Customer Name',
    'Mobile Number',
    'Email Address',
    'Property Type',
    'Location / Society',
    'Property Status',
    'Interior Requirements',
    'Budget Band',
    'Expected Start Date',
    'Consultation Date',
    'Consultation Time',
    'Consultation Mode',
    'Additional Requirements',
    'Contact Consent',
    'Lead Status',
    'Estimated Value (INR)',
    'Actual Converted Value (INR)',
    'Follow-Up Date',
    'Assigned Designer',
    'Owner Remarks',
    'Customer Ack Status',
    'Owner Alert Status',
    'Record Type',
  ];

  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }

  styleHeaderRow(sheet, 1, headers.length);
  sheet.setFrozenRows(1);

  // Number & Date formatting for rows 2..500
  sheet.getRange('S2:T500').setNumberFormat('₹#,##,##0');
  sheet.getRange('U2:U500').setNumberFormat('yyyy-mm-dd');

  // Data validation dropdowns
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(LEAD_STATUSES, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('R2:R500').setDataValidation(statusRule);

  var designerRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(DESIGNERS, true)
    .setAllowInvalid(true)
    .build();
  sheet.getRange('V2:V500').setDataValidation(designerRule);

  // Conditional Formatting rules
  sheet.clearConditionalFormatRules();
  var fullRange = sheet.getRange('A2:Z500');

  // 1. Overdue follow-up highlight (Follow-up date < TODAY and status not Converted/Lost)
  var overdueRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied(
      '=AND($U2<>"", $U2<TODAY(), $R2<>"Converted", $R2<>"Lost", $A2<>"")'
    )
    .setBackground('#FDE8E8')
    .setFontColor('#9B1C1C')
    .setRanges([sheet.getRange('A2:Z500')])
    .build();

  // 2. Converted lead row tint
  var convertedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$R2="Converted"')
    .setBackground('#ECFDF5')
    .setFontColor('#065F46')
    .setRanges([fullRange])
    .build();

  // 3. Quotation Shared / Negotiation tint
  var quoteRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=OR($R2="Quotation Shared", $R2="Negotiation")')
    .setBackground('#FEF9EC')
    .setFontColor('#725B2F')
    .setRanges([fullRange])
    .build();

  sheet.setConditionalFormatRules([overdueRule, convertedRule, quoteRule]);

  sheet.setColumnWidth(1, 165);
  sheet.setColumnWidth(2, 165);
  sheet.setColumnWidth(4, 180);
  sheet.setColumnWidth(8, 220);
  sheet.setColumnWidth(10, 260);
  sheet.setColumnWidth(18, 175);
  sheet.setColumnWidth(23, 250);
}

function setupQueriesTab(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.QUERIES);
  var headers = [
    'Query ID',
    'Submitted Timestamp',
    'Customer Name',
    'Contact Details',
    'Query Category',
    'Question',
    'Contact Consent',
    'Query Status',
    'Assigned Person',
    'Resolution Notes',
    'Customer Ack Status',
    'Owner Alert Status',
    'Record Type',
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  styleHeaderRow(sheet, 1, headers.length);
  sheet.setFrozenRows(1);

  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(QUERY_STATUSES, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange('H2:H500').setDataValidation(statusRule);

  sheet.clearConditionalFormatRules();
  var pendingRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$H2="Pending"')
    .setBackground('#FEF3C7')
    .setFontColor('#92400E')
    .setRanges([sheet.getRange('A2:M500')])
    .build();
  var resolvedRule = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$H2="Resolved"')
    .setBackground('#ECFDF5')
    .setFontColor('#065F46')
    .setRanges([sheet.getRange('A2:M500')])
    .build();
  sheet.setConditionalFormatRules([pendingRule, resolvedRule]);

  sheet.setColumnWidth(1, 165);
  sheet.setColumnWidth(6, 360);
  sheet.setColumnWidth(10, 260);
}

function setupNotificationLogTab(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.LOG);
  if (sheet.getLastRow() === 0) {
    var headers = [
      'Timestamp',
      'Event Type',
      'Reference ID',
      'Recipient',
      'Status',
      'Dedup Key',
      'Details',
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  styleHeaderRow(sheet, 1, 7);
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, 7, 190);
}

/**
 * Builds an automatically updating Executive Business Dashboard using native
 * Google Sheets formulas and native Embedded Charts.
 */
function buildDashboardTab(ss) {
  var dash = ss.getSheetByName(SHEET_NAMES.DASHBOARD);
  dash.clear();

  // Remove old charts before rebuilding
  var existingCharts = dash.getCharts();
  for (var i = 0; i < existingCharts.length; i++) {
    dash.removeChart(existingCharts[i]);
  }

  // Title Banner
  dash.getRange('A1:G1').merge().setValue('AARANYA INTERIORS — EXECUTIVE LEAD & STUDIO DASHBOARD');
  dash.getRange('A1:G1')
    .setBackground('#252824')
    .setFontColor('#F8F5EF')
    .setFontFamily('Playfair Display')
    .setFontSize(16)
    .setFontWeight('bold')
    .setVerticalAlignment('middle');
  dash.setRowHeight(1, 42);

  dash.getRange('A2:G2').merge().setFormula(
    '="Workspace Mode: " & Settings!B2 & "  |  Automated CRM Formulas & Charts  |  Last Refreshed: " & TEXT(NOW(), "dd mmm yyyy hh:mm")'
  );
  dash.getRange('A2:G2')
    .setBackground('#F0EEE8')
    .setFontColor('#454843')
    .setFontSize(10);

  // KPI Summary Table (Rows 4 to 18)
  dash.getRange('A4:B4').setValues([['Executive KPI Metric', 'Live Value']]);
  styleHeaderRow(dash, 4, 2);

  var kpiRows = [
    ['Total Enquiries', "=COUNTA('Customer Leads'!A2:A)"],
    ['New Leads', "=COUNTIF('Customer Leads'!R2:R, \"New Lead\")"],
    [
      'Pending Follow-Ups (Open Pipeline)',
      "=COUNTIFS('Customer Leads'!A2:A, \"<>\", 'Customer Leads'!R2:R, \"<>Converted\", 'Customer Leads'!R2:R, \"<>Lost\")",
    ],
    [
      'Overdue Follow-Ups (Past Due Date)',
      "=COUNTIFS('Customer Leads'!A2:A, \"<>\", 'Customer Leads'!U2:U, \"<\"&TODAY(), 'Customer Leads'!U2:U, \"<>\", 'Customer Leads'!R2:R, \"<>Converted\", 'Customer Leads'!R2:R, \"<>Lost\")",
    ],
    ['Consultations Scheduled', "=COUNTIF('Customer Leads'!R2:R, \"Consultation Scheduled\")"],
    ['Quotations Shared', "=COUNTIF('Customer Leads'!R2:R, \"Quotation Shared\")"],
    ['Converted Leads', "=COUNTIF('Customer Leads'!R2:R, \"Converted\")"],
    ['Lost Leads', "=COUNTIF('Customer Leads'!R2:R, \"Lost\")"],
    ['Conversion Percentage', '=IFERROR(B11/B5, 0)'],
    [
      'Estimated Active Pipeline Value (INR)',
      "=SUMIFS('Customer Leads'!S2:S, 'Customer Leads'!R2:R, \"<>Converted\", 'Customer Leads'!R2:R, \"<>Lost\")",
    ],
    ['Actual Converted Project Value (INR)', "=SUMIF('Customer Leads'!R2:R, \"Converted\", 'Customer Leads'!T2:T)"],
    ['Pending Customer Queries', "=COUNTIF('Customer Queries'!H2:H, \"Pending\") + COUNTIF('Customer Queries'!H2:H, \"In Review\")"],
    ['Resolved Customer Queries', "=COUNTIF('Customer Queries'!H2:H, \"Resolved\")"],
  ];

  dash.getRange(5, 1, kpiRows.length, 2).setValues(kpiRows);
  dash.getRange('B13').setNumberFormat('0.0%');
  dash.getRange('B14:B15').setNumberFormat('₹#,##,##0');
  dash.getRange('B8').setBackground('#FDE8E8').setFontColor('#9B1C1C').setFontWeight('bold');
  dash.getRange('A5:B17').setBorder(true, true, true, true, true, true, '#D8C8B4', SpreadsheetApp.BorderStyle.SOLID);

  // Breakdown 1: Enquiries by Service (Columns D:E, Rows 4..11)
  dash.getRange('D4:E4').setValues([['Enquiries by Interior Service', 'Count']]);
  dash.getRange('D4:E4').setBackground('#252824').setFontColor('#F8F5EF').setFontWeight('bold');

  var serviceRows = [
    ['Complete Home Interiors', "=COUNTIF('Customer Leads'!J2:J, \"*Complete Home Interiors*\")"],
    ['Modular Kitchen', "=COUNTIF('Customer Leads'!J2:J, \"*Modular Kitchen*\")"],
    ['Custom Furniture & Wardrobes', "=COUNTIF('Customer Leads'!J2:J, \"*Custom Furniture*\")"],
    ['Living & Dining Design', "=COUNTIF('Customer Leads'!J2:J, \"*Living & Dining*\")"],
    ['Bedroom & Study Design', "=COUNTIF('Customer Leads'!J2:J, \"*Bedroom & Study*\")"],
    ['False Ceiling & Lighting', "=COUNTIF('Customer Leads'!J2:J, \"*Lighting*\")"],
    ['Painting & Wall Finishes', "=COUNTIF('Customer Leads'!J2:J, \"*Painting*\")"],
  ];
  dash.getRange(5, 4, serviceRows.length, 2).setValues(serviceRows);
  dash.getRange('D5:E11').setBorder(true, true, true, true, true, true, '#D8C8B4', SpreadsheetApp.BorderStyle.SOLID);

  // Breakdown 2: Customer Budget Distribution (Columns D:E, Rows 13..18)
  dash.getRange('D13:E13').setValues([['Budget Distribution', 'Leads']]);
  dash.getRange('D13:E13').setBackground('#252824').setFontColor('#F8F5EF').setFontWeight('bold');

  var budgetRows = [
    ['Individual Room Interiors: Customized Quote', "=COUNTIF('Customer Leads'!K2:K, \"Individual Room Interiors: Customized Quote\")"],
    ['Essential Home Interiors: ₹3–6 lakh', "=COUNTIF('Customer Leads'!K2:K, \"Essential Home Interiors: ₹3–6 lakh\")"],
    ['Signature Home Interiors: ₹6–12 lakh', "=COUNTIF('Customer Leads'!K2:K, \"Signature Home Interiors: ₹6–12 lakh\")"],
    ['Premium Home Interiors: ₹12–25 lakh', "=COUNTIF('Customer Leads'!K2:K, \"Premium Home Interiors: ₹12–25 lakh\")"],
    ['Luxury Custom Interiors: ₹25 lakh+', "=COUNTIF('Customer Leads'!K2:K, \"Luxury Custom Interiors: ₹25 lakh+\")"],
  ];
  dash.getRange(14, 4, budgetRows.length, 2).setValues(budgetRows);
  dash.getRange('D14:E18').setBorder(true, true, true, true, true, true, '#D8C8B4', SpreadsheetApp.BorderStyle.SOLID);

  // Breakdown 3: Monthly Enquiry Trends & Lead Status Funnel (Columns A:B & D:E below)
  dash.getRange('A20:B20').setValues([['Monthly Enquiry Trends', 'Enquiries']]);
  dash.getRange('A20:B20').setBackground('#252824').setFontColor('#F8F5EF').setFontWeight('bold');
  var monthRows = [
    ['2026-09', "=COUNTIF('Customer Leads'!C2:C, \"2026-09\")"],
    ['2026-10', "=COUNTIF('Customer Leads'!C2:C, \"2026-10\")"],
    ['2026-11', "=COUNTIF('Customer Leads'!C2:C, \"2026-11\")"],
    ['2026-12', "=COUNTIF('Customer Leads'!C2:C, \"2026-12\")"],
  ];
  dash.getRange(21, 1, monthRows.length, 2).setValues(monthRows);
  dash.getRange('A21:B24').setBorder(true, true, true, true, true, true, '#D8C8B4', SpreadsheetApp.BorderStyle.SOLID);

  dash.getRange('D20:E20').setValues([['Lead Pipeline Stage', 'Count']]);
  dash.getRange('D20:E20').setBackground('#252824').setFontColor('#F8F5EF').setFontWeight('bold');
  var stageRows = [
    ['New Lead', "=COUNTIF('Customer Leads'!R2:R, \"New Lead\")"],
    ['Contacted', "=COUNTIF('Customer Leads'!R2:R, \"Contacted\")"],
    ['Consultation Scheduled', "=COUNTIF('Customer Leads'!R2:R, \"Consultation Scheduled\")"],
    ['Site Visit Done', "=COUNTIF('Customer Leads'!R2:R, \"Site Visit Done\")"],
    ['Quotation Shared', "=COUNTIF('Customer Leads'!R2:R, \"Quotation Shared\")"],
    ['Negotiation', "=COUNTIF('Customer Leads'!R2:R, \"Negotiation\")"],
    ['Converted', "=COUNTIF('Customer Leads'!R2:R, \"Converted\")"],
    ['Lost', "=COUNTIF('Customer Leads'!R2:R, \"Lost\")"],
  ];
  dash.getRange(21, 4, stageRows.length, 2).setValues(stageRows);
  dash.getRange('D21:E28').setBorder(true, true, true, true, true, true, '#D8C8B4', SpreadsheetApp.BorderStyle.SOLID);

  dash.setColumnWidth(1, 290);
  dash.setColumnWidth(2, 160);
  dash.setColumnWidth(3, 30);
  dash.setColumnWidth(4, 240);
  dash.setColumnWidth(5, 110);

  // Embedded Native Charts placed neatly to the right (Column G)
  var serviceChart = dash.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(dash.getRange('D4:E11'))
    .setPosition(4, 7, 0, 0)
    .setOption('title', 'Enquiries by Interior Service')
    .setOption('colors', ['#626B55'])
    .setOption('legend', { position: 'none' })
    .setOption('width', 460)
    .setOption('height', 260)
    .build();
  dash.insertChart(serviceChart);

  var budgetChart = dash.newChart()
    .setChartType(Charts.ChartType.PIE)
    .addRange(dash.getRange('D13:E18'))
    .setPosition(18, 7, 0, 0)
    .setOption('title', 'Customer Budget Distribution')
    .setOption('pieHole', 0.45)
    .setOption('colors', ['#D8C8B4', '#B69A68', '#626B55', '#454843', '#252824'])
    .setOption('width', 460)
    .setOption('height', 260)
    .build();
  dash.insertChart(budgetChart);

  var trendChart = dash.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .addRange(dash.getRange('A20:B24'))
    .setPosition(32, 7, 0, 0)
    .setOption('title', 'Monthly Enquiry Trend')
    .setOption('colors', ['#B69A68'])
    .setOption('legend', { position: 'none' })
    .setOption('width', 460)
    .setOption('height', 240)
    .build();
  dash.insertChart(trendChart);
}

/**
 * HTTP POST Webhook invoked securely by Vercel / Express server.
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    var rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var payload = JSON.parse(rawBody);

    // Validate shared secret if configured in Script Properties
    var expectedSecret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET');
    if (expectedSecret && payload.secret !== expectedSecret) {
      return jsonResponse({ ok: false, saved: false, error: 'Unauthorized webhook secret.' });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var settings = readSettingsMap(ss);
    var workspaceMode = settings['WORKSPACE_MODE'] || 'LIVE';

    if (payload.action === 'create_lead') {
      return handleCreateLead(ss, settings, workspaceMode, payload);
    }

    if (payload.action === 'create_query') {
      return handleCreateQuery(ss, settings, workspaceMode, payload);
    }

    return jsonResponse({ ok: false, saved: false, error: 'Unsupported action.' });
  } catch (err) {
    return jsonResponse({ ok: false, saved: false, error: err.message });
  } finally {
    lock.releaseLock();
  }
}

function handleCreateLead(ss, settings, workspaceMode, payload) {
  var sheet = ss.getSheetByName(SHEET_NAMES.LEADS);
  if (!sheet) {
    initializeSpreadsheetStructure(workspaceMode);
    sheet = ss.getSheetByName(SHEET_NAMES.LEADS);
  }

  var leadId = sanitizeCell(payload.leadId || '');
  if (!leadId) {
    return jsonResponse({ ok: false, saved: false, error: 'Missing Lead ID.' });
  }

  // Duplicate ID protection inside sheet
  if (idExistsInColumn(sheet, 1, leadId)) {
    return jsonResponse({ ok: true, saved: true, duplicateIgnored: true, emailStatus: 'skipped' });
  }

  var submittedAt = payload.submittedAt || new Date().toISOString();
  var submittedMonth = submittedAt.slice(0, 7);
  var defaultFollowUp = addDaysIso(2);
  var isDemo = workspaceMode === 'DEMO' || payload.mode === 'demo' || payload.disableOutreach === true;

  // Attempt email automation AFTER saving; email errors must NEVER invalidate saved lead.
  var rowValues = [
    leadId,
    submittedAt,
    submittedMonth,
    sanitizeCell(payload.customerName),
    sanitizeCell(payload.mobileNumber),
    sanitizeCell(payload.email),
    sanitizeCell(payload.propertyType),
    sanitizeCell(payload.propertyLocation),
    sanitizeCell(payload.propertyStatus),
    sanitizeCell(payload.requirements),
    sanitizeCell(payload.estimatedBudget),
    sanitizeCell(payload.expectedStartDate),
    sanitizeCell(payload.preferredConsultDate),
    sanitizeCell(payload.preferredConsultTime),
    sanitizeCell(payload.consultationMode),
    sanitizeCell(payload.additionalRequirements),
    sanitizeCell(payload.contactConsent || 'Yes'),
    'New Lead',
    Number(payload.estimatedValueInr) || 0,
    0,
    defaultFollowUp,
    'Unassigned',
    isDemo ? '[DEMO TEST SUBMISSION]' : '',
    isDemo ? 'Disabled (Demo)' : 'Pending',
    isDemo ? 'Disabled (Demo)' : 'Pending',
    isDemo ? 'DEMO' : 'LIVE',
  ];

  sheet.appendRow(rowValues);
  var insertedRow = sheet.getLastRow();

  var emailStatus = 'skipped';
  if (!isDemo) {
    emailStatus = dispatchLeadEmails(ss, settings, payload, leadId, insertedRow, sheet);
  } else {
    logNotification(ss, 'DEMO_LEAD_CAPTURED', leadId, 'N/A (Demo)', 'SKIPPED', 'LEAD_DEMO_' + leadId, 'Outreach disabled in Demo Mode.');
  }

  return jsonResponse({
    ok: true,
    saved: true,
    leadId: leadId,
    emailStatus: emailStatus,
  });
}

function handleCreateQuery(ss, settings, workspaceMode, payload) {
  var sheet = ss.getSheetByName(SHEET_NAMES.QUERIES);
  if (!sheet) {
    initializeSpreadsheetStructure(workspaceMode);
    sheet = ss.getSheetByName(SHEET_NAMES.QUERIES);
  }

  var queryId = sanitizeCell(payload.queryId || '');
  if (!queryId) {
    return jsonResponse({ ok: false, saved: false, error: 'Missing Query ID.' });
  }

  if (idExistsInColumn(sheet, 1, queryId)) {
    return jsonResponse({ ok: true, saved: true, duplicateIgnored: true, emailStatus: 'skipped' });
  }

  var submittedAt = payload.submittedAt || new Date().toISOString();
  var isDemo = workspaceMode === 'DEMO' || payload.mode === 'demo' || payload.disableOutreach === true;

  var rowValues = [
    queryId,
    submittedAt,
    sanitizeCell(payload.customerName),
    sanitizeCell(payload.contactDetails),
    sanitizeCell(payload.queryCategory),
    sanitizeCell(payload.question),
    sanitizeCell(payload.contactConsent || 'Yes'),
    'Pending',
    'Unassigned',
    '',
    isDemo ? 'Disabled (Demo)' : 'Pending',
    isDemo ? 'Disabled (Demo)' : 'Pending',
    isDemo ? 'DEMO' : 'LIVE',
  ];

  sheet.appendRow(rowValues);
  var insertedRow = sheet.getLastRow();

  var emailStatus = 'skipped';
  if (!isDemo) {
    emailStatus = dispatchQueryEmails(ss, settings, payload, queryId, insertedRow, sheet);
  } else {
    logNotification(ss, 'DEMO_QUERY_CAPTURED', queryId, 'N/A (Demo)', 'SKIPPED', 'QUERY_DEMO_' + queryId, 'Outreach disabled in Demo Mode.');
  }

  return jsonResponse({
    ok: true,
    saved: true,
    queryId: queryId,
    emailStatus: emailStatus,
  });
}

function dispatchLeadEmails(ss, settings, payload, leadId, rowNum, sheet) {
  var ownerEmail = settings['OWNER_EMAIL'];
  var sendOwner = settings['OWNER_ALERT_EMAILS'] === 'YES' && ownerEmail;
  var sendCustomer = settings['AUTO_REPLY_CUSTOMER'] === 'YES' && payload.email && String(payload.email).indexOf('@') > -1;

  var overallStatus = 'triggered';

  if (sendOwner) {
    var ownerDedupKey = 'OWNER_LEAD_' + leadId;
    if (!notificationAlreadySent(ss, ownerDedupKey)) {
      try {
        if (MailApp.getRemainingDailyQuota() < 2) {
          throw new Error('Daily MailApp quota critically low.');
        }
        var subject = '[Aaranya Lead] ' + leadId + ' — ' + payload.customerName + ' (' + payload.estimatedBudget + ')';
        var body = [
          'New Consultation Enquiry Received',
          '----------------------------------------',
          'Lead ID: ' + leadId,
          'Customer: ' + payload.customerName,
          'Mobile: ' + payload.mobileNumber,
          'Email: ' + payload.email,
          'Property: ' + payload.propertyType + ' — ' + payload.propertyLocation,
          'Status: ' + payload.propertyStatus,
          'Scope: ' + payload.requirements,
          'Budget: ' + payload.estimatedBudget,
          'Consultation: ' + payload.preferredConsultDate + ' (' + payload.preferredConsultTime + ') via ' + payload.consultationMode,
          'Notes: ' + (payload.additionalRequirements || 'None'),
          '',
          'Open Google Sheet to update status & follow-up date.',
        ].join('\n');

        MailApp.sendEmail(ownerEmail, subject, body);
        sheet.getRange(rowNum, 25).setValue('Sent');
        logNotification(ss, 'OWNER_NEW_LEAD', leadId, ownerEmail, 'SENT', ownerDedupKey, 'Owner alert delivered.');
      } catch (err) {
        overallStatus = 'failed_logged';
        sheet.getRange(rowNum, 25).setValue('Failed: ' + err.message);
        logNotification(ss, 'OWNER_NEW_LEAD', leadId, ownerEmail, 'FAILED', ownerDedupKey, err.message);
      }
    }
  }

  if (sendCustomer) {
    var custDedupKey = 'CUST_LEAD_' + leadId;
    if (!notificationAlreadySent(ss, custDedupKey)) {
      try {
        if (MailApp.getRemainingDailyQuota() < 1) {
          throw new Error('Daily MailApp quota exhausted.');
        }
        var custSubject = 'Consultation Request Received (' + leadId + ') — ' + (settings['BUSINESS_NAME'] || 'Aaranya Interiors');
        var custBody = [
          'Dear ' + payload.customerName + ',',
          '',
          'Thank you for submitting a design consultation request with ' + (settings['BUSINESS_NAME'] || 'Aaranya Interiors') + '.',
          'Your request Reference ID is: ' + leadId,
          '',
          'Summary of your request:',
          '- Property: ' + payload.propertyType + ' at ' + payload.propertyLocation,
          '- Requested Slot (Pending Confirmation): ' + payload.preferredConsultDate + ', ' + payload.preferredConsultTime,
          '- Scope: ' + payload.requirements,
          '',
          'Please note that your preferred date and time are logged as a request. Our design team will contact you to confirm the appointment.',
          '',
          'Warm regards,',
          settings['BUSINESS_NAME'] || 'Aaranya Interiors',
          settings['STUDIO_ADDRESS'] || '',
        ].join('\n');

        MailApp.sendEmail(payload.email, custSubject, custBody);
        sheet.getRange(rowNum, 24).setValue('Sent');
        logNotification(ss, 'CUSTOMER_LEAD_ACK', leadId, payload.email, 'SENT', custDedupKey, 'Acknowledgement delivered.');
      } catch (err) {
        overallStatus = 'failed_logged';
        sheet.getRange(rowNum, 24).setValue('Failed: ' + err.message);
        logNotification(ss, 'CUSTOMER_LEAD_ACK', leadId, payload.email, 'FAILED', custDedupKey, err.message);
      }
    }
  }

  return overallStatus;
}

function dispatchQueryEmails(ss, settings, payload, queryId, rowNum, sheet) {
  var ownerEmail = settings['OWNER_EMAIL'];
  var sendOwner = settings['OWNER_ALERT_EMAILS'] === 'YES' && ownerEmail;
  var contact = String(payload.contactDetails || '');
  var isEmailContact = contact.indexOf('@') > -1;
  var sendCustomer = settings['AUTO_REPLY_CUSTOMER'] === 'YES' && isEmailContact;
  var overallStatus = 'triggered';

  if (sendOwner) {
    var ownerKey = 'OWNER_QUERY_' + queryId;
    if (!notificationAlreadySent(ss, ownerKey)) {
      try {
        MailApp.sendEmail(
          ownerEmail,
          '[Aaranya Query] ' + queryId + ' — ' + payload.queryCategory,
          'Name: ' + payload.customerName + '\nContact: ' + contact + '\nCategory: ' + payload.queryCategory + '\n\nQuestion:\n' + payload.question
        );
        sheet.getRange(rowNum, 12).setValue('Sent');
        logNotification(ss, 'OWNER_NEW_QUERY', queryId, ownerEmail, 'SENT', ownerKey, 'Owner query alert delivered.');
      } catch (err) {
        overallStatus = 'failed_logged';
        sheet.getRange(rowNum, 12).setValue('Failed: ' + err.message);
        logNotification(ss, 'OWNER_NEW_QUERY', queryId, ownerEmail, 'FAILED', ownerKey, err.message);
      }
    }
  }

  if (sendCustomer) {
    var custKey = 'CUST_QUERY_' + queryId;
    if (!notificationAlreadySent(ss, custKey)) {
      try {
        MailApp.sendEmail(
          contact,
          'We Received Your Question (' + queryId + ') — Aaranya Interiors',
          'Dear ' + payload.customerName + ',\n\nThank you for reaching out regarding "' + payload.queryCategory + '".\nYour Question ID is ' + queryId + '. Our studio advisor will reply within 1 business day.\n\nWarm regards,\nAaranya Interiors'
        );
        sheet.getRange(rowNum, 11).setValue('Sent');
        logNotification(ss, 'CUSTOMER_QUERY_ACK', queryId, contact, 'SENT', custKey, 'Query acknowledgement sent.');
      } catch (err) {
        overallStatus = 'failed_logged';
        sheet.getRange(rowNum, 11).setValue('Failed: ' + err.message);
        logNotification(ss, 'CUSTOMER_QUERY_ACK', queryId, contact, 'FAILED', custKey, err.message);
      }
    }
  }

  return overallStatus;
}

/**
 * Daily automated digest of Pending & Overdue follow-ups.
 */
function sendDailyFollowUpDigest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var settings = readSettingsMap(ss);

  if (settings['WORKSPACE_MODE'] === 'DEMO' || settings['DAILY_REMINDER_ENABLED'] !== 'YES') {
    return;
  }

  var ownerEmail = settings['OWNER_EMAIL'];
  if (!ownerEmail) return;

  var todayStr = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var digestDedupKey = 'DAILY_DIGEST_' + todayStr;
  if (notificationAlreadySent(ss, digestDedupKey)) {
    return; // Prevent duplicate daily digests
  }

  var sheet = ss.getSheetByName(SHEET_NAMES.LEADS);
  if (!sheet || sheet.getLastRow() < 2) return;

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 23).getValues();
  var overdue = [];
  var dueToday = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    var leadId = row[0];
    var status = row[17];
    var followUpVal = row[20];
    if (!leadId || status === 'Converted' || status === 'Lost' || !followUpVal) continue;

    var fStr = followUpVal instanceof Date
      ? Utilities.formatDate(followUpVal, Session.getScriptTimeZone(), 'yyyy-MM-dd')
      : String(followUpVal).slice(0, 10);

    var line = '- ' + leadId + ' | ' + row[3] + ' (' + row[7] + ') | Status: ' + status + ' | Due: ' + fStr;
    if (fStr < todayStr) {
      overdue.push(line);
    } else if (fStr === todayStr) {
      dueToday.push(line);
    }
  }

  if (overdue.length === 0 && dueToday.length === 0) return;

  var body = [
    'Aaranya Interiors — Daily Follow-Up Digest (' + todayStr + ')',
    '================================================================',
    '',
    'OVERDUE FOLLOW-UPS (' + overdue.length + '):',
    overdue.length ? overdue.join('\n') : 'None',
    '',
    'DUE TODAY (' + dueToday.length + '):',
    dueToday.length ? dueToday.join('\n') : 'None',
  ].join('\n');

  try {
    MailApp.sendEmail(ownerEmail, '[Aaranya CRM] Daily Follow-Up Digest (' + overdue.length + ' Overdue)', body);
    logNotification(ss, 'DAILY_DIGEST', todayStr, ownerEmail, 'SENT', digestDedupKey, overdue.length + ' overdue, ' + dueToday.length + ' due today.');
  } catch (err) {
    logNotification(ss, 'DAILY_DIGEST', todayStr, ownerEmail, 'FAILED', digestDedupKey, err.message);
  }
}

function installDailyReminderTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'sendDailyFollowUpDigest') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
  ScriptApp.newTrigger('sendDailyFollowUpDigest')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
}

/**
 * Populates 25 synthetic leads and 10 synthetic queries into the DEMO sheet.
 */
function seedDemoRecords(ss) {
  var leadsSheet = ss.getSheetByName(SHEET_NAMES.LEADS);
  if (leadsSheet.getLastRow() > 1) {
    leadsSheet.getRange(2, 1, leadsSheet.getLastRow() - 1, 26).clearContent();
  }

  var sampleLeads = [
    ['DEMO-LD-2611-1001', '2026-10-03T10:15:00Z', '2026-10', 'Aarav Sharma [Demo]', '+91 98*** **101', 'aarav.demo1@example.invalid', '3 BHK Apartment', 'Noida Extension (Sample Society A)', 'Ready to Move', 'Complete Home Interiors, Modular Kitchen', 'Premium Home Interiors: ₹12–25 lakh', 'Within 30 Days', '2026-10-06', '10:30 AM – 12:00 PM', 'Studio Design Call / Video Meeting', 'Warm minimalist palette', 'Yes', 'Converted', 1850000, 1780000, '2026-11-25', 'Kavya Nair', 'Signed BOQ; kitchen & wardrobe finishes finalized.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1002', '2026-10-06T11:20:00Z', '2026-10', 'Priya Deshmukh [Demo]', '+91 98*** **102', 'priya.demo2@example.invalid', '4 BHK / Penthouse', 'Greater Noida (Sample Golf Estate)', 'Existing Home Renovation', 'Complete Home Interiors, Living & Dining Design, Custom Furniture & Wardrobes', 'Luxury Custom Interiors: ₹25 lakh+', '1 – 3 Months', '2026-10-09', '03:30 PM – 05:00 PM', 'On-Site Property Visit Request', 'Stone and veneer finishes', 'Yes', 'Quotation Shared', 3200000, 0, '2026-11-15', 'Raghav Menon', 'Reviewing stone vs veneer finish quotation.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1003', '2026-10-09T09:40:00Z', '2026-10', 'Vikramaditya Joshi [Demo]', '+91 97*** **103', 'vikram.demo3@example.invalid', '3 BHK Apartment', 'Techzone IV, Noida Extension', 'Ready to Move', 'Modular Kitchen, Custom Furniture & Wardrobes', 'Signature Home Interiors: ₹6–12 lakh', 'Within 30 Days', '2026-10-12', '12:30 PM – 02:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'Converted', 950000, 920000, '2026-11-28', 'Kavya Nair', 'Kitchen & 3 wardrobes approved.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1004', '2026-10-12T14:10:00Z', '2026-10', 'Neha Malhotra [Demo]', '+91 99*** **104', 'neha.demo4@example.invalid', '2 BHK Apartment', 'Greater Noida West (Sample Sector 1)', 'Ready to Move', 'Complete Home Interiors', 'Essential Home Interiors: ₹3–6 lakh', 'Immediately (Within 15 Days)', '2026-10-14', '05:30 PM – 07:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'Lost', 520000, 0, '2026-10-28', 'Nikhil Rao', 'Client chose local contractor for urgent move-in.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1005', '2026-10-14T16:00:00Z', '2026-10', 'Devansh Kulkarni [Demo]', '+91 98*** **105', 'devansh.demo5@example.invalid', 'Independent Villa / Kothi', 'Sector Alpha, Greater Noida', 'Bare Shell / New Handover', 'Complete Home Interiors, False Ceiling & Lighting, Bedroom & Study Design', 'Luxury Custom Interiors: ₹25 lakh+', 'Within 30 Days', '2026-10-17', '10:30 AM – 12:00 PM', 'On-Site Property Visit Request', 'Full villa design', 'Yes', 'Converted', 4200000, 4050000, '2026-12-01', 'Raghav Menon', 'Full villa design & execution confirmed.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1006', '2026-10-18T12:30:00Z', '2026-10', 'Sanya Kapoor [Demo]', '+91 96*** **106', 'sanya.demo6@example.invalid', '3 BHK Apartment', 'Sector 150, Noida Expressway', 'Under Construction (Possession Soon)', 'Complete Home Interiors, Modular Kitchen', 'Signature Home Interiors: ₹6–12 lakh', '3 – 6 Months', '2026-11-22', '10:30 AM – 12:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'Consultation Scheduled', 1080000, 0, '2026-11-22', 'Kavya Nair', 'Video design walkthrough scheduled.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1007', '2026-10-21T15:45:00Z', '2026-10', 'Karanvir Gill [Demo]', '+91 98*** **107', 'karan.demo7@example.invalid', '4 BHK / Penthouse', 'Sector 144, Noida', 'Ready to Move', 'Living & Dining Design, Modular Kitchen, Custom Furniture & Wardrobes', 'Premium Home Interiors: ₹12–25 lakh', '1 – 3 Months', '2026-10-24', '03:30 PM – 05:00 PM', 'On-Site Property Visit Request', '', 'Yes', 'Negotiation', 2150000, 0, '2026-11-17', 'Raghav Menon', 'Finalizing hardware and dining unit scope.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1008', '2026-10-25T10:05:00Z', '2026-10', 'Ritika Banerjee [Demo]', '+91 95*** **108', 'ritika.demo8@example.invalid', '3 BHK Apartment', 'Noida Extension (Sample Society B)', 'Ready to Move', 'Modular Kitchen, False Ceiling & Lighting', 'Signature Home Interiors: ₹6–12 lakh', 'Within 30 Days', '2026-10-28', '12:30 PM – 02:00 PM', 'On-Site Property Visit Request', '', 'Yes', 'Site Visit Done', 820000, 0, '2026-11-16', 'Nikhil Rao', 'Site measurements done; preparing 3D views.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1009', '2026-10-29T13:15:00Z', '2026-10', 'Arjun Sengupta [Demo]', '+91 98*** **109', 'arjun.demo9@example.invalid', 'Office / Commercial Space', 'Sector 142, Noida', 'Bare Shell / New Handover', 'Bedroom & Study Design, False Ceiling & Lighting', 'Premium Home Interiors: ₹12–25 lakh', 'Within 30 Days', '2026-11-01', '03:30 PM – 05:00 PM', 'On-Site Property Visit Request', '', 'Yes', 'Converted', 1600000, 1540000, '2026-12-03', 'Raghav Menon', 'Boutique office lounge underway.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1010', '2026-11-01T09:50:00Z', '2026-11', 'Meenakshi Iyer [Demo]', '+91 99*** **110', 'meenakshi.demo10@example.invalid', '3 BHK Apartment', 'Sector 1, Greater Noida West', 'Ready to Move', 'Complete Home Interiors, Custom Furniture & Wardrobes', 'Signature Home Interiors: ₹6–12 lakh', '1 – 3 Months', '2026-11-04', '10:30 AM – 12:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'Quotation Shared', 1120000, 0, '2026-11-21', 'Kavya Nair', 'Shared Essential vs Signature quote.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1011', '2026-11-02T11:10:00Z', '2026-11', 'Harshvardhan Tiwari [Demo]', '+91 97*** **111', 'harsh.demo11@example.invalid', 'Independent Villa / Kothi', 'South Delhi (Sample Residence)', 'Existing Home Renovation', 'Complete Home Interiors, Modular Kitchen, Bedroom & Study Design', 'Luxury Custom Interiors: ₹25 lakh+', '1 – 3 Months', '2026-11-05', '03:30 PM – 05:00 PM', 'On-Site Property Visit Request', '', 'Yes', 'Quotation Shared', 3800000, 0, '2026-11-14', 'Raghav Menon', 'Awaiting family approval on ground floor quote.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1012', '2026-11-04T14:25:00Z', '2026-11', 'Anjali Verma [Demo]', '+91 98*** **112', 'anjali.demo12@example.invalid', '2 BHK Apartment', 'Techzone IV, Greater Noida West', 'Ready to Move', 'Modular Kitchen, Custom Furniture & Wardrobes', 'Essential Home Interiors: ₹3–6 lakh', 'Within 30 Days', '2026-11-06', '12:30 PM – 02:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'Converted', 490000, 475000, '2026-11-29', 'Nikhil Rao', 'Essential package confirmed.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1013', '2026-11-05T16:40:00Z', '2026-11', 'Siddharth Chawla [Demo]', '+91 98*** **113', 'siddharth.demo13@example.invalid', '3 BHK Apartment', 'Sector 150, Noida', 'Under Construction (Possession Soon)', 'Complete Home Interiors', 'Premium Home Interiors: ₹12–25 lakh', '3 – 6 Months', '2026-11-10', '05:30 PM – 07:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'Contacted', 1550000, 0, '2026-11-18', 'Kavya Nair', 'Waiting for builder possession update.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1014', '2026-11-07T10:30:00Z', '2026-11', 'Ishita Bhatnagar [Demo]', '+91 96*** **114', 'ishita.demo14@example.invalid', 'Builder Floor', 'South Delhi (Sample Builder Floor)', 'Bare Shell / New Handover', 'Complete Home Interiors, Living & Dining Design', 'Luxury Custom Interiors: ₹25 lakh+', '1 – 3 Months', '2026-11-23', '10:30 AM – 12:00 PM', 'On-Site Property Visit Request', '', 'Yes', 'Consultation Scheduled', 2950000, 0, '2026-11-23', 'Raghav Menon', 'Initial site inspection scheduled.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1015', '2026-11-08T12:15:00Z', '2026-11', 'Manish Tandon [Demo]', '+91 98*** **115', 'manish.demo15@example.invalid', '3 BHK Apartment', 'Sector 1, Greater Noida West', 'Existing Home Renovation', 'Living & Dining Design, False Ceiling & Lighting', 'Individual Room Interiors: Customized Quote', '3 – 6 Months', '2026-11-10', '03:30 PM – 05:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'Lost', 280000, 0, '2026-11-11', 'Nikhil Rao', 'Postponed renovation to next year.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1016', '2026-11-10T11:00:00Z', '2026-11', 'Pooja Khurana [Demo]', '+91 99*** **116', 'pooja.demo16@example.invalid', '3 BHK Apartment', 'Sector 107, Noida', 'Ready to Move', 'Complete Home Interiors, Modular Kitchen, Bedroom & Study Design', 'Premium Home Interiors: ₹12–25 lakh', 'Within 30 Days', '2026-11-12', '12:30 PM – 02:00 PM', 'On-Site Property Visit Request', '', 'Yes', 'Negotiation', 1950000, 0, '2026-11-21', 'Kavya Nair', 'Adjusting master wardrobe finish option.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1017', '2026-11-11T15:20:00Z', '2026-11', 'Tarun Oberoi [Demo]', '+91 98*** **117', 'tarun.demo17@example.invalid', '2 BHK Apartment', 'Techzone IV, Noida Extension', 'Ready to Move', 'Modular Kitchen, Custom Furniture & Wardrobes', 'Essential Home Interiors: ₹3–6 lakh', 'Within 30 Days', '2026-11-14', '10:30 AM – 12:00 PM', 'On-Site Property Visit Request', '', 'Yes', 'Site Visit Done', 560000, 0, '2026-11-22', 'Nikhil Rao', 'Preparing itemized modular estimate.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1018', '2026-11-12T09:10:00Z', '2026-11', 'Nandini Krishnan [Demo]', '+91 97*** **118', 'nandini.demo18@example.invalid', '3 BHK Apartment', 'Sector 43, Noida', 'Under Construction (Possession Soon)', 'Complete Home Interiors, Bedroom & Study Design', 'Premium Home Interiors: ₹12–25 lakh', '1 – 3 Months', '2026-11-24', '05:30 PM – 07:00 PM', 'Studio Design Call / Video Meeting', 'Outstation owner coordination', 'Yes', 'Consultation Scheduled', 1650000, 0, '2026-11-24', 'Kavya Nair', 'Video consultation scheduled.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1019', '2026-11-14T13:30:00Z', '2026-11', 'Rishabh Agarwal [Demo]', '+91 98*** **119', 'rishabh.demo19@example.invalid', 'Independent Villa / Kothi', 'Sector Omega, Greater Noida', 'Ready to Move', 'Complete Home Interiors, Living & Dining Design, Modular Kitchen', 'Luxury Custom Interiors: ₹25 lakh+', '1 – 3 Months', '2026-11-16', '03:30 PM – 05:00 PM', 'On-Site Property Visit Request', '', 'Yes', 'Quotation Shared', 2800000, 0, '2026-11-19', 'Raghav Menon', 'Follow up on living & kitchen quote.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1020', '2026-11-15T17:05:00Z', '2026-11', 'Shreya Saxena [Demo]', '+91 95*** **120', 'shreya.demo20@example.invalid', '3 BHK Apartment', 'Sector 1, Greater Noida West', 'Ready to Move', 'Custom Furniture & Wardrobes, Bedroom & Study Design', 'Individual Room Interiors: Customized Quote', 'Within 30 Days', '2026-11-18', '12:30 PM – 02:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'Contacted', 340000, 0, '2026-11-21', 'Nikhil Rao', 'Awaiting floor plan PDF.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1021', '2026-11-17T10:15:00Z', '2026-11', 'Kabir Ahluwalia [Demo]', '+91 98*** **121', 'kabir.demo21@example.invalid', '4 BHK / Penthouse', 'Sector 128, Noida', 'Under Construction (Possession Soon)', 'Complete Home Interiors, Modular Kitchen, False Ceiling & Lighting', 'Premium Home Interiors: ₹12–25 lakh', '3 – 6 Months', '2026-11-23', '10:30 AM – 12:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'New Lead', 2300000, 0, '2026-11-21', 'Unassigned', 'Requested Signature & Premium comparison.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1022', '2026-11-18T14:50:00Z', '2026-11', 'Pallavi Gokhale [Demo]', '+91 99*** **122', 'pallavi.demo22@example.invalid', '2 BHK Apartment', 'Techzone IV, Noida Extension', 'Ready to Move', 'Modular Kitchen, Painting & Wall Finishes', 'Individual Room Interiors: Customized Quote', 'Within 30 Days', '2026-11-22', '03:30 PM – 05:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'New Lead', 290000, 0, '2026-11-20', 'Unassigned', 'Modular kitchen + living wall upgrade.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1023', '2026-11-18T16:15:00Z', '2026-11', 'Gaurav Singhal [Demo]', '+91 98*** **123', 'gaurav.demo23@example.invalid', 'Office / Commercial Space', 'Knowledge Park, Greater Noida', 'Bare Shell / New Handover', 'Bedroom & Study Design, False Ceiling & Lighting', 'Signature Home Interiors: ₹6–12 lakh', '1 – 3 Months', '2026-11-23', '12:30 PM – 02:00 PM', 'On-Site Property Visit Request', '', 'Yes', 'Consultation Scheduled', 980000, 0, '2026-11-23', 'Raghav Menon', 'Consultation room & reception layout.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1024', '2026-11-19T11:45:00Z', '2026-11', 'Aditi Chauhan [Demo]', '+91 96*** **124', 'aditi.demo24@example.invalid', '3 BHK Apartment', 'Sector 150, Noida', 'Ready to Move', 'Complete Home Interiors, Modular Kitchen', 'Signature Home Interiors: ₹6–12 lakh', 'Within 30 Days', '2026-11-24', '10:30 AM – 12:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'New Lead', 1050000, 0, '2026-11-21', 'Unassigned', 'Requested Signature Home package breakdown.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-LD-2611-1025', '2026-11-20T09:05:00Z', '2026-11', 'Pranav Sethi [Demo]', '+91 98*** **125', 'pranav.demo25@example.invalid', '3 BHK Apartment', 'Sector 152, Noida Expressway', 'Under Construction (Possession Soon)', 'Complete Home Interiors, Custom Furniture & Wardrobes, Living & Dining Design', 'Premium Home Interiors: ₹12–25 lakh', '1 – 3 Months', '2026-11-25', '03:30 PM – 05:00 PM', 'Studio Design Call / Video Meeting', '', 'Yes', 'New Lead', 1750000, 0, '2026-11-22', 'Unassigned', 'Submitted consultation request today.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
  ];
  leadsSheet.getRange(2, 1, sampleLeads.length, 26).setValues(sampleLeads);

  var queriesSheet = ss.getSheetByName(SHEET_NAMES.QUERIES);
  if (queriesSheet.getLastRow() > 1) {
    queriesSheet.getRange(2, 1, queriesSheet.getLastRow() - 1, 13).clearContent();
  }

  var sampleQueries = [
    ['DEMO-QR-2611-201', '2026-11-05T10:00:00Z', 'Suhani Mathur [Demo]', 'suhani.q1@example.invalid', 'Pricing & Packages', 'Does Signature Home Interiors include kitchen chimney and hob or only cabinetry and countertop?', 'Yes', 'Resolved', 'Kavya Nair', 'Clarified cabinetry scope vs appliance options.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-QR-2611-202', '2026-11-08T11:30:00Z', 'Rajat Bhardwaj [Demo]', '+91 98*** **202', 'Modular Kitchen & Wardrobes', 'What core board materials do you recommend for wet kitchen sink cabinets?', 'Yes', 'Resolved', 'Nikhil Rao', 'Shared BWR marine ply & HDHMR overview.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-QR-2611-203', '2026-11-10T14:20:00Z', 'Deepak Khandelwal [Demo]', 'deepak.q3@example.invalid', 'NRI / Remote Coordination', 'We live abroad and have an upcoming flat handover in Noida Extension. How are approvals handled?', 'Yes', 'Resolved', 'Raghav Menon', 'Explained remote video walkthrough & milestone updates.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-QR-2611-204', '2026-11-12T09:45:00Z', 'Nidhi Goswami [Demo]', '+91 99*** **204', 'Site Visit & Locations', 'Can a designer visit our Greater Noida West apartment on a Sunday for measurements?', 'Yes', 'Resolved', 'Kavya Nair', 'Coordinated Sunday morning visit request.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-QR-2611-205', '2026-11-14T16:10:00Z', 'Vivek Nambiar [Demo]', 'vivek.q5@example.invalid', 'Design Timeline & Process', 'How early before apartment possession should we begin design planning?', 'Yes', 'In Review', 'Nikhil Rao', 'Drafting planning timeline note.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-QR-2611-206', '2026-11-16T12:00:00Z', 'Shalini Chopra [Demo]', '+91 97*** **206', 'Pricing & Packages', 'Can we start with Essential Home Interiors and add custom study furniture later?', 'Yes', 'In Review', 'Kavya Nair', 'Preparing phased scope note.', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-QR-2611-207', '2026-11-17T15:10:00Z', 'Alok Chatterjee [Demo]', 'alok.q7@example.invalid', 'Modular Kitchen & Wardrobes', 'Do you take up standalone modular kitchen and wardrobe projects without civil work?', 'Yes', 'Pending', 'Unassigned', '', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-QR-2611-208', '2026-11-18T11:25:00Z', 'Reema Vohra [Demo]', '+91 98*** **208', 'Site Visit & Locations', 'Do your design teams handle builder floor projects in South Delhi?', 'Yes', 'Pending', 'Unassigned', '', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-QR-2611-209', '2026-11-19T17:40:00Z', 'Mohit Rawat [Demo]', 'mohit.q9@example.invalid', 'Design Timeline & Process', 'Are society permission letters and work-hour rules coordinated during execution?', 'Yes', 'Pending', 'Unassigned', '', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
    ['DEMO-QR-2611-210', '2026-11-20T08:55:00Z', 'Zoya Siddiqui [Demo]', '+91 96*** **210', 'Other', 'Can we view physical stone, veneer, and fabric samples before confirming our package?', 'Yes', 'Pending', 'Unassigned', '', 'Disabled (Demo)', 'Disabled (Demo)', 'DEMO'],
  ];
  queriesSheet.getRange(2, 1, sampleQueries.length, 13).setValues(sampleQueries);
}

/* ============================================================================
 * UTILITY HELPERS
 * ========================================================================== */

function styleHeaderRow(sheet, row, numCols) {
  sheet.getRange(row, 1, 1, numCols)
    .setBackground('#252824')
    .setFontColor('#F8F5EF')
    .setFontWeight('bold')
    .setFontSize(10)
    .setVerticalAlignment('middle');
  sheet.setRowHeight(row, 32);
}

function sanitizeCell(value) {
  if (value === null || value === undefined) return '';
  var str = String(value).trim();
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

function readSettingsMap(ss) {
  var sheet = ss.getSheetByName(SHEET_NAMES.SETTINGS);
  var map = {};
  if (!sheet || sheet.getLastRow() < 2) return map;
  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
  for (var i = 0; i < values.length; i++) {
    if (values[i][0]) {
      map[String(values[i][0]).trim()] = String(values[i][1] || '').trim();
    }
  }
  return map;
}

function idExistsInColumn(sheet, colIndex, targetId) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var vals = sheet.getRange(2, colIndex, lastRow - 1, 1).getValues();
  for (var i = 0; i < vals.length; i++) {
    if (String(vals[i][0]).trim() === targetId) return true;
  }
  return false;
}

function notificationAlreadySent(ss, dedupKey) {
  var logSheet = ss.getSheetByName(SHEET_NAMES.LOG);
  if (!logSheet || logSheet.getLastRow() < 2) return false;
  var rows = logSheet.getRange(2, 5, logSheet.getLastRow() - 1, 2).getValues();
  for (var i = 0; i < rows.length; i++) {
    if (String(rows[i][1]) === dedupKey && String(rows[i][0]) === 'SENT') {
      return true;
    }
  }
  return false;
}

function logNotification(ss, eventType, refId, recipient, status, dedupKey, details) {
  var logSheet = ss.getSheetByName(SHEET_NAMES.LOG);
  if (!logSheet) return;
  logSheet.appendRow([
    new Date().toISOString(),
    eventType,
    refId,
    recipient,
    status,
    dedupKey,
    details,
  ]);
}

function addDaysIso(days) {
  var d = new Date();
  d.setDate(d.getDate() + days);
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
