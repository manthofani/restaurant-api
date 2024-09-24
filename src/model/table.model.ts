export class CreateTableRequest {
  name: string;
  status: number;
  open_hr: string;
  closed_hr: string;
}

export class TableResponse {
  id: number;
  name: string;
  status: number;
  open_hr: string;
  closed_hr: string;
}

export class TableRequest {
  name?: string;
  status?: number;
  open_hr?: string;
  closed_hr?: string;
}
