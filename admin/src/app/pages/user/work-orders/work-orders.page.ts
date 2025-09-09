import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonInfiniteScroll,
  IonInfiniteScrollContent, IonSearchbar, IonButtons, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent,
  IonSpinner, IonPopover, PopoverController, IonSelect, IonSelectOption,IonMenuButton, IonText } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { TimeService } from 'src/app/services/time.service';
import { WorkOrdersFiltersPopover } from './work-orders-filters/work-orders-filters.popover';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { refresh, closeCircleOutline } from 'ionicons/icons';
import { CustomersService } from 'src/app/services/customers.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-work-orders',
  templateUrl: './work-orders.page.html',
  styleUrls: ['./work-orders.page.scss'],
  standalone: true,
  imports: [IonText, 
    CommonModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar,
    IonButtons, IonIcon, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonSpinner,
    IonSelect, FormsModule, IonSelectOption, IonMenuButton

  ]
})
export class WorkOrdersPage implements OnInit {
  workOrdersService = inject(WorkOrdersService);
  router = inject(Router);
  timeService = inject(TimeService);
  popoverController = inject(PopoverController);
  customersService = inject(CustomersService);
  usersService = inject(UsersService);
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
  users: any[] = [];

  constructor() {
    addIcons({ refresh, closeCircleOutline });
  }
  ngOnInit() {
    // Leer los parámetros de la URL y sincronizar los filtros
    const params = new URLSearchParams(window.location.search);
    this.filters.status = params.get('status') || '';
    this.filters.type = params.get('type') || '';
    this.filters.customerId = params.get('customerId') || '';
    this.filters.createdBy = params.get('createdBy') || '';
    this.filters.startDate = params.get('startDate') || '';
    this.filters.closeDate = params.get('closeDate') || '';
    this.query = params.get('query') || '';
    this.loadCustomers();
    this.loadUsers();
    this.loadWorkOrders();
  }

  async loadCustomers() {
    try {
      this.customers = await this.customersService.getAllCustomersFromAlgolia();
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  }

  async loadUsers() {
    try {
      const allUsers = await this.usersService.getAllUsersOnce();
      // Ordenar por nombre de A a Z
      this.users = allUsers.sort((a: any, b: any) => {
        const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim().toLowerCase();
        const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim().toLowerCase();
        return nameA.localeCompare(nameB);
      });
    } catch (error) {
      console.error('Error loading users:', error);
    }
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
  resetFilters() {
    this.filters = {
      status: '',
      type: '',
      customerId: '',
      createdBy: '',
      startDate: '',
      closeDate: ''
    };
    this.query = '';
    this.router.navigate([], {
      queryParams: {},
      replaceUrl: true
    });
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
  openWorkOrderDetail(workOrderId: string) {
    this.router.navigate(['/user/work-orders', workOrderId]);
  }

  // goToSearch() {
  //   this.router.navigate(['/admin/user/work-orders/search']);
  // }
}
