import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonInfiniteScroll,
  IonInfiniteScrollContent, IonSearchbar, IonButtons, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent,
  IonSpinner, IonPopover, PopoverController, IonSelect, IonSelectOption
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { TimeService } from 'src/app/services/time.service';
import { WorkOrdersFiltersPopover } from './work-orders-filters/work-orders-filters.popover';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { refresh } from 'ionicons/icons';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.page.html',
  styleUrls: ['./work-orders.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar,
    IonButtons, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonSpinner,
    IonSelect, FormsModule, IonSelectOption

  ]
})
export class WorkOrdersPage implements OnInit {
  workOrdersService = inject(WorkOrdersService);
  router = inject(Router);
  timeService = inject(TimeService);
  popoverController = inject(PopoverController);
  workOrders: any[] = [];
  page = 0;
  hitsPerPage = 20;
  loading = false;
  query = '';
  hasMore = true;

  filtersPopoverOpen = false;
  popoverEvent: any = null;
  filters = {
    status: '',
    type: '',
    customerId: '',
    createdBy: '',
    startDate: '',
    closeDate: ''
  };
  customers: any[] = [];

  constructor(){
    addIcons({refresh});
  }
  ngOnInit() {
    this.loadWorkOrders();
  }

  async loadWorkOrders(event?: any) {
    if (this.loading || !this.hasMore) return;
    this.loading = true;
    try {
      const response = await this.workOrdersService.getWorkOrdersAlgolia({
        page: this.page,
        hitsPerPage: this.hitsPerPage,
        query: this.query,
        status: this.filters.status || undefined,
        type: this.filters.type || undefined,
        customerId: this.filters.customerId || undefined,
        createdByUid: this.filters.createdBy === 'me' ? /* tu lógica para UID */ undefined : this.filters.createdBy || undefined,
        startDate: this.filters.startDate || undefined,
        closeDate: this.filters.closeDate || undefined
      }) as any;
      const newOrders = response?.hits || [];
      this.workOrders = [...this.workOrders, ...newOrders];
      this.hasMore = newOrders.length === this.hitsPerPage;
      this.page++;
    } catch (error) {
      console.error('Error loading work orders:', error);
    }
    this.loading = false;
    if (event) event.target.complete();
  }

  async openFiltersPopover(e: Event) {
    const popover = await this.popoverController.create({
      component: WorkOrdersFiltersPopover,
      event: e,
      componentProps: {
        filters: this.filters
      }
    });

    await popover.present();

    const { role } = await popover.onDidDismiss();
    console.log(`Popover dismissed with role: ${role}`);
  }

  onFilterChange() {
    // Actualizar la URL con los filtros
    this.router.navigate([], {
      queryParams: {
        ...this.filters,
        query: this.query || null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    // Refrescar la búsqueda
    this.page = 0;
    this.workOrders = [];
    this.hasMore = true;
    this.loadWorkOrders();
  }
  async onApplyFilters(newFilters: any) {
    this.filters = { ...newFilters };
    this.filtersPopoverOpen = false;
    // Actualizar la URL con los filtros
    this.router.navigate([], {
      queryParams: {
        ...this.filters,
        query: this.query || null
      },
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
    // Refrescar la búsqueda
    this.page = 0;
    this.workOrders = [];
    this.hasMore = true;
    this.loadWorkOrders();
  }

  onSearchChange(event: any) {
    this.query = event.detail.value;
    this.page = 0;
    this.workOrders = [];
    this.hasMore = true;
    this.loadWorkOrders();
  }
  refreshWorkOrders() {
    this.page = 0;
    this.workOrders = [];
    this.hasMore = true;
    this.loadWorkOrders();
  }

  goToSearch() {
    this.router.navigate(['/admin/user/work-orders/search']);
  }
}
