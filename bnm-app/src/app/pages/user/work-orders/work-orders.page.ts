import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonIcon, IonButtons, IonButton, IonSearchbar,
  IonFab, IonFabButton, ModalController,
  IonList, IonLabel, IonSpinner, IonInfiniteScroll, IonInfiniteScrollContent,
  IonItem, IonGrid, IonCol, IonRow, IonText, IonCard, IonCardContent, IonPopover } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, close, search, ellipsisVertical } from 'ionicons/icons';
import { RouterLink } from '@angular/router';
// Importante: Añadir el módulo de Scrolling del CDK de Angular
import { ScrollingModule } from '@angular/cdk/scrolling';
import { SelectWorkTypePage } from './select-work-type/select-work-type.page';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { WorkOrder } from 'src/app/interfaces/work-order';

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

  workOrders: any[] = [];
  private offset = 0;
  private readonly pageSize = 20;

  isSearching = false;
  searchText = '';

  constructor() {
    addIcons({ ellipsisVertical, add, close, search });
  }

  ngOnInit() {
    this.loadWorkOrders(); 

  }

  async loadWorkOrders(event?: any) {
    try {
      const data = await this.workOrdersService.getWorkOrders_A(this.offset, this.pageSize);
      if (data && data.hits) {
        // Usar un nuevo array para mejorar la detección de cambios
        this.workOrders = [...this.workOrders, ...data.hits];

        this.offset += this.pageSize;
        if (event) {
          event.target.complete();
          if (data.hits.length < this.pageSize) {
            event.target.disabled = true;
          }
        }
      } else {
        if (event) {
          event.target.disabled = true;
        }
      }

    } catch (error) {
      console.error('Error al cargar las órdenes de trabajo:', error);
      if (event) {
        event.target.complete();
      }
    }
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
    this.isSearching = !this.isSearching;
    if (!this.isSearching) {
      this.searchText = '';
    }
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
}
