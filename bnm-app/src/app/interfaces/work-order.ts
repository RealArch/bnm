
export interface WorkOrder {
  id: string; // El ID del documento de Firestore
  controlNo: number;
  billTo: string;
  startDate: { seconds: number; nanoseconds: number; }; // O puedes convertirlo a Date
  closeDate?: { seconds: number; nanoseconds: number; }; // Opcional
  status: 'open' | 'closed' | 'in-progress';
  type: 'work' | 'pickup';
  createdBy: string;
  createdAt: { seconds: number; nanoseconds: number; };
  // Agrega aquí los demás campos como servicesPerformed, materialsUsed, etc.
}
export interface PaginatedWorkOrderResult {
  hits: WorkOrder[];
  page: number;
  totalPages: number;
  nbHits: number;
  hitsPerPage: number;
}