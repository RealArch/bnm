import { Timestamp } from "@angular/fire/firestore";

export interface WorkOrder {
  id: string; // El ID del documento de Firestore
  controlNo: number;

  customer: {
    id: string,
    companyName: string,
    companyPhone: string,
    companyAddress: {
      city: string,
      state: string,
      street: string,
      zip: string
    },
    contactName: string,
    contactPhone: string,
  };
  startDate: string;
  closeDate: string | null;
  status: 'pending' | 'closed' | 'in-progress' | 'draft';
  type: 'work' | 'pickup';
  createdBy: { uid: string, firstName: string, lastName: string };
  createdAt: Timestamp;
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
  openSign: {
    img: string | null,
    imgName: string | null,
    dateSigned: Timestamp | null,
    requestedBy: {
      id: string | null,
      firstName: string | null,
      lastName: string | null,
    }
  },
  closeSign: {
    img: string | null,
    imgName: string | null,
    dateSigned: Timestamp | null,
    requestedBy: {
      id: string | null,
      firstName: string | null,
      lastName: string | null,
    }
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
export type workOrderStatus = 'pending' | 'closed' | 'in-progress' | 'draft';
export type workOrderSignType = 'openSign' | 'closeSign';