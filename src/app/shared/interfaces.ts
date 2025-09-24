export interface ReportData {
  id: number;
  name: string;
  vl: number;
  vl2: number;
  vibt: number;
  avg: number;
  avgB: number;
  month: string;
  year: number;
  historyFiles: string[];
  reportFile: string;
  status: string;
  locked: boolean;
  exception: boolean;
}

export interface AwardData {
  id: number;
  col1: number;
  col2: number;
  col3: number;
  col4: number;
  col5: number;
  col6: number;
  col7: number;
  col8: number;
  col9: number;
  col10: number;
  col11: number;
  comments: string;
}

export interface TableData {
  id: number;
  [key: string]: any;
}

export interface ListFilters {
  multipleCustomers: string;
  customer: string;
  status: string;
  month: string;
  year: string;
  rangeFrom: string;
  rangeTo: string;
}

export interface SecretTableData {
  id: number;
  column1: string;
  column2: number;
  column3: string;
}