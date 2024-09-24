export class CreateReservationRequest {
  reserved_time: string;
  id_table: number;
  status: number;
  username: string;
  email: string;
}

export class ReservationResponse {
  receipt: number;
  reserved_time: string;
  id_table: number;
  status: number;
  username: string;
  email: string;
}

export class ReservationRequest {
  receipt?: number;
  reserved_time?: string;
  id_table?: number;
  status: number;
  username?: string;
  email?: string;
}
