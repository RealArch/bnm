import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonItem, IonLabel, IonFooter, 
    IonToolbar, IonButtons, IonButton, IonDatetime, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-work-orders-filters-popover',
  templateUrl: './work-orders-filters.popover.html',
  standalone: true,
  imports: [IonDatetime, IonButton, IonButtons, IonToolbar, 
    IonFooter, IonLabel, IonItem, IonList, IonContent, IonSelect,
    IonSelectOption, CommonModule, FormsModule
    
]
})
export class WorkOrdersFiltersPopover {
  @Input() filters: any = {
    status: '',
    type: '',
    customerId: '',
    createdBy: '',
    startDate: '',
    closeDate: ''
  };
  @Input() customers: any[] = [];

  applyFilters() {
    // Cierra el popover y pasa los filtros seleccionados
    (window as any).applyWorkOrdersFilters(this.filters);
  }
}
