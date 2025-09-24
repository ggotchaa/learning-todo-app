import { ReportData, AwardData, TableData, SecretTableData } from './interfaces';

export const mockReportsData: ReportData[] = [
  {
    id: 1,
    name: "_ Tender Awards Analysis January 2020",
    vl: 10380,
    vl2: 520,
    vibt: 85.2,
    avg: 487.5,
    avgB: 512.3,
    month: "January",
    year: 2024,
    historyFiles: ["history_001.pdf", "log_001.txt"],
    reportFile: "report_001.pdf",
    status: "Active",
    locked: false,
    exception: false,
  },
  {
    id: 2,
    name: "_ Tender Awards Analysis January 2020",
    vl: 10380,
    vl2: 425,
    vibt: 78.9,
    avg: 402.5,
    avgB: 445.1,
    month: "January",
    year: 2024,
    historyFiles: ["history_002.pdf"],
    reportFile: "report_002.pdf",
    status: "Pending",
    locked: true,
    exception: true,
  },
  {
    id: 3,
    name: "_ Tender Awards Analysis October 2022",
    vl: 620,
    vl2: 680,
    vibt: 92.1,
    avg: 650.0,
    avgB: 695.5,
    month: "October",
    year: 2024,
    historyFiles: [
      "history_003.pdf",
      "audit_003.doc",
      "notes_003.txt",
    ],
    reportFile: "report_003.pdf",
    status: "Complete",
    locked: false,
    exception: false,
  },
  {
    id: 4,
    name: "_ Tender Awards Analysis November 2022",
    vl: 295,
    vl2: 310,
    vibt: 72.4,
    avg: 302.5,
    avgB: 318.7,
    month: "November",
    year: 2024,
    historyFiles: ["history_004.pdf"],
    reportFile: "report_004.pdf",
    status: "Active",
    locked: false,
    exception: true,
  },
  {
    id: 5,
    name: "_ Tender Awards Analysis December 2022",
    vl: 540,
    vl2: 575,
    vibt: 88.7,
    avg: 557.5,
    avgB: 582.9,
    month: "December",
    year: 2024,
    historyFiles: ["history_005.pdf", "review_005.xlsx"],
    reportFile: "report_005.pdf",
    status: "Complete",
    locked: true,
    exception: false,
  },
];

export const mockAwardsData: AwardData[] = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  col1: Math.floor(Math.random() * 100),
  col2: Math.floor(Math.random() * 100),
  col3: Math.floor(Math.random() * 100),
  col4: Math.floor(Math.random() * 100),
  col5: Math.floor(Math.random() * 100),
  col6: Math.floor(Math.random() * 100),
  col7: Math.floor(Math.random() * 100),
  col8: Math.floor(Math.random() * 100),
  col9: Math.floor(Math.random() * 100),
  col10: Math.floor(Math.random() * 100),
  col11: Math.floor(Math.random() * 100),
  comments: `Comment ${i + 1}`,
}));

export const mockSecondTableData: TableData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  ...Array.from({ length: 12 }, (_, j) => [`col${j + 1}`, Math.floor(Math.random() * 1000)]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
}));

export const mockHistoryTableData: TableData[] = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  ...Array.from({ length: 12 }, (_, j) => [`col${j + 1}`, Math.floor(Math.random() * 500)]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
}));

export const mockListTableData: TableData[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  ...Array.from({ length: 12 }, (_, j) => [`col${j + 1}`, Math.floor(Math.random() * 1000)]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
}));

export const mockSecretTableData: SecretTableData[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  column1: `Data ${i + 1}`,
  column2: Math.floor(Math.random() * 100),
  column3: `Value ${String.fromCharCode(65 + i)}`,
}));