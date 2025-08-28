import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButtons, IonButton, IonSearchbar,
  IonFab, IonFabButton, ModalController,
  IonList, IonLabel, IonSpinner, IonInfiniteScroll, IonInfiniteScrollContent,
  IonItem, IonGrid, IonCol, IonRow, IonText, IonCard, IonCardContent, IonPopover
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, search, ellipsisVertical, pencilOutline } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
// Importante: Añadir el módulo de Scrolling del CDK de Angular
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SelectWorkTypePage } from './select-work-type/select-work-type.page';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { WorkOrder } from 'src/app/interfaces/work-order';
import { RequestSignPage } from './request-sign/request-sign.page';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { PopupsService } from 'src/app/services/popups.service';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.page.html',
  styleUrls: ['./work-orders.page.scss'],
  standalone: true,
  imports: [IonPopover, IonCardContent, IonCard, IonText, IonRow, IonCol, IonGrid,
    IonSpinner, IonLabel, IonList, IonItem, IonSearchbar,
    IonButtons, IonIcon, IonContent, IonHeader, IonTitle,
    IonButton, IonToolbar, CommonModule, FormsModule,
    ReactiveFormsModule, IonFab, IonFabButton, RouterLink,
    IonInfiniteScroll, IonInfiniteScrollContent,
    ScrollingModule // <-- Módulo añadido
  ]
})
export class WorkOrdersPage implements OnInit {
  modalCtrl = inject(ModalController);
  workOrdersService = inject(WorkOrdersService);
  popupService = inject(PopupsService);

  pendingSignWorkOrders: any[] = [];
  inProgressWorkOrders: any[] = [];
  closedWorkOrders: any[] = []
  private offset = 0;
  private readonly pageSize = 20;
  private destroy$ = new Subject<void>();

  isSearching = [];
  searchText = '';

  constructor() {
    addIcons({ ellipsisVertical, add, close, search, pencilOutline });
  }

  ngOnInit() {
    console.log('hola2')
    this.loadWorkOrders();

  }

  loadWorkOrders() {
    combineLatest([
      this.workOrdersService.getUserWorkOrders('pending'),
      this.workOrdersService.getUserWorkOrders('in-progress'),
      this.workOrdersService.getUserWorkOrders('closed')
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([signWorkOrders, inProgressWorkOrders, closedWorkOrders]) => {
          this.pendingSignWorkOrders = signWorkOrders;
          this.inProgressWorkOrders = inProgressWorkOrders;
          this.closedWorkOrders = closedWorkOrders;
        },
        error: (err) => {
          this.popupService.presentToast("bottom", "", "")
          console.error('Error loading work orders', err);
        }
      });


  }

  /**
   * Función de seguimiento para el scroll virtual.
   * Ayuda a Angular a identificar de forma única cada elemento de la lista,
   * mejorando drásticamente el rendimiento al evitar volver a renderizar elementos que no han cambiado.
   * @param index El índice del elemento.
   * @param item El objeto WorkOrder.
   * @returns El ID único de la orden de trabajo.
   */
  trackById(index: number, item: any): number {
    return item.id;
  }

  toggleSearch() {
    // this.isSearching = !this.isSearching;
    // if (!this.isSearching) {
    //   this.searchText = '';
    // }
  }

  onSearchChange(event: any) {
    const query = event.detail.value;
    console.log('Buscando:', query);
  }

  async openWorkTypeModal() {
    const modal = await this.modalCtrl.create({
      component: SelectWorkTypePage
    });
    await modal.present();
  }
  async openRequestSignModal(workOrder: WorkOrder) {
    const modal = await this.modalCtrl.create({
      component: RequestSignPage,
      componentProps: {
        workOrder
      }
    });
    await modal.present();
  }
  ngOnDestroy(): void {
    console.log('destroy 1')
    this.destroy$.next();
    this.destroy$.complete();
  }
}
