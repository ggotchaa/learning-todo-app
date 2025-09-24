import { Injectable } from '@angular/core';
import { ReportData, AwardData, TableData, SecretTableData } from '../shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // Reports data with proper dates
  private reportsData: ReportData[] = [
    {
      id: 1,
      name: "Tender Awards Analysis January 2024",
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
      name: "Tender Awards Analysis February 2024",
      vl: 10380,
      vl2: 425,
      vibt: 78.9,
      avg: 402.5,
      avgB: 445.1,
      month: "February",
      year: 2024,
      historyFiles: ["history_002.pdf"],
      reportFile: "report_002.pdf",
      status: "Pending",
      locked: true,
      exception: true,
    },
    {
      id: 3,
      name: "Tender Awards Analysis October 2024",
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
      name: "Tender Awards Analysis November 2024",
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
      name: "Tender Awards Analysis December 2024",
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
    {
      id: 6,
      name: "Tender Awards Analysis September 2024",
      vl: 890,
      vl2: 765,
      vibt: 95.3,
      avg: 827.5,
      avgB: 845.2,
      month: "September",
      year: 2024,
      historyFiles: ["history_006.pdf"],
      reportFile: "report_006.pdf",
      status: "Active",
      locked: false,
      exception: false,
    }
  ];

  // Awards data
  private awardsData: AwardData[] = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    col1: Math.floor(Math.random() * 1000) + 100,
    col2: Math.floor(Math.random() * 1000) + 100,
    col3: Math.floor(Math.random() * 1000) + 100,
    col4: Math.floor(Math.random() * 1000) + 100,
    col5: Math.floor(Math.random() * 1000) + 100,
    col6: Math.floor(Math.random() * 1000) + 100,
    col7: Math.floor(Math.random() * 1000) + 100,
    col8: Math.floor(Math.random() * 1000) + 100,
    col9: Math.floor(Math.random() * 1000) + 100,
    col10: Math.floor(Math.random() * 1000) + 100,
    col11: Math.floor(Math.random() * 1000) + 100,
    comments: `Tender analysis ${i + 1}`,
  }));

  // Second table data
  private secondTableData: TableData[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    ...Array.from({ length: 12 }, (_, j) => [`col${j + 1}`, Math.floor(Math.random() * 2000) + 500]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  }));

  // History table data
  private historyTableData: TableData[] = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    ...Array.from({ length: 12 }, (_, j) => [`col${j + 1}`, Math.floor(Math.random() * 1500) + 200]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  }));

  // Customer list data
  private listTableData: TableData[] = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    ...Array.from({ length: 12 }, (_, j) => [`col${j + 1}`, Math.floor(Math.random() * 1800) + 300]).reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
  }));

  // Secret table data
  private secretTableData: SecretTableData[] = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    column1: `Customer ${i + 1}`,
    column2: Math.floor(Math.random() * 500) + 100,
    column3: `Region ${String.fromCharCode(65 + i)}`,
  }));

  constructor() { }

  // Get reports data with optional filtering
  getReportsData(filters?: { month?: string; year?: string; status?: string }): ReportData[] {
    let filteredData = [...this.reportsData];

    if (filters) {
      if (filters.month && filters.month !== 'None') {
        filteredData = filteredData.filter(item =>
          item.month.toLowerCase() === filters.month!.toLowerCase()
        );
      }
      if (filters.year) {
        filteredData = filteredData.filter(item =>
          item.year.toString() === filters.year
        );
      }
      if (filters.status) {
        filteredData = filteredData.filter(item =>
          item.status.toLowerCase() === filters.status!.toLowerCase()
        );
      }
    }

    return filteredData;
  }

  // Get awards data
  getAwardsData(): AwardData[] {
    return [...this.awardsData];
  }

  // Get second table data
  getSecondTableData(): TableData[] {
    return [...this.secondTableData];
  }

  // Get history table data
  getHistoryTableData(): TableData[] {
    return [...this.historyTableData];
  }

  // Get customer list data with filtering
  getListTableData(filters?: {
    customer?: string;
    status?: string;
    month?: string;
    year?: string;
    rangeFrom?: string;
    rangeTo?: string;
  }): TableData[] {
    let filteredData = [...this.listTableData];

    if (filters) {
      // Add filtering logic here when connecting to real database
      // For now, return all data
    }

    return filteredData;
  }

  // Get secret table data
  getSecretTableData(): SecretTableData[] {
    return [...this.secretTableData];
  }

  // Method to add new report (for future database integration)
  addReport(report: Omit<ReportData, 'id'>): ReportData {
    const newId = Math.max(...this.reportsData.map(r => r.id)) + 1;
    const newReport = { ...report, id: newId };
    this.reportsData.push(newReport);
    return newReport;
  }

  // Method to update report (for future database integration)
  updateReport(id: number, updates: Partial<ReportData>): ReportData | null {
    const index = this.reportsData.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reportsData[index] = { ...this.reportsData[index], ...updates };
      return this.reportsData[index];
    }
    return null;
  }

  // Method to delete report (for future database integration)
  deleteReport(id: number): boolean {
    const index = this.reportsData.findIndex(r => r.id === id);
    if (index !== -1) {
      this.reportsData.splice(index, 1);
      return true;
    }
    return false;
  }
}