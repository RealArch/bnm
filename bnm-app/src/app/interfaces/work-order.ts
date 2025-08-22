import { Timestamp } from "@angular/fire/firestore";

export interface WorkOrder {
  id: string; // El ID del documento de Firestore
  controlNo: number;

  customer: {
    id:string,
    companyName:string,
    companyPhone:string,
    companyAddress:object,
    contactName:string,
    contactPhone:string,
  };
  startDate: Timestamp; // O puedes convertirlo a Date
  closeDate?: Timestamp; // Opcional
  status: 'pending' | 'closed' | 'in-progress' | 'draft';
  type: 'work' | 'pickup';
  createdBy: string;
  createdAt: { seconds: number; nanoseconds: number; };
  servicesPerformed: [{
    title: string,
    description: string,
    quantity: number
  }],
  materialsUsed: [{
    description: string,
    partNumber: string,
    quantity: number,
    ts: number
  }],
  notedEquipments: [{
    make: string,
    model: string,
    serialNumber: string,
    equipmentNumber: string

  }],
  workSign: {
    img: string | null,
    dateSigned: string | null,
    requestedBy: string | null
  },
  pickupSign: {
    img: string | null,
    dateSigned: string | null,
    requestedBy: string | null
  },
  // Agrega aquí los demás campos como servicesPerformed, materialsUsed, etc.
}
export interface PaginatedWorkOrderResult {
  hits: WorkOrder[];
  page: number;
  totalPages: number;
  nbHits: number;
  hitsPerPage: number;
}