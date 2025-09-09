import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import {
    IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
    IonBackButton, IonSearchbar, IonRow, IonCol, IonItem, IonLabel,
    IonSpinner, IonRefresher, IonRefresherContent, IonInfiniteScroll,
    IonInfiniteScrollContent, IonGrid, IonTitle, IonPopover, IonList, IonFab,
    IonFabButton, ModalController, IonChip
} from '@ionic/angular/standalone';
import { debounceTime, Subject, finalize, switchMap, catchError, of, tap, from } from 'rxjs';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { addIcons } from 'ionicons';
import { optionsOutline, close, caretDown } from 'ionicons/icons';
import { NoItemsFoundComponent } from 'src/app/components/no-items-found/no-items-found.component';
import { WorkOrder } from 'src/app/interfaces/work-order';
import { RequestSignPage } from '../request-sign/request-sign.page';
import { SearchFiltersPage } from './search-filters/search-filters.page';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-search',
    templateUrl: './search.page.html',
    styleUrls: ['./search.page.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ScrollingModule,
        IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
        IonBackButton, IonSearchbar, IonRow, IonCol, IonItem, IonLabel,
        IonSpinner, IonRefresher, IonRefresherContent, IonInfiniteScroll,
        IonInfiniteScrollContent, IonGrid,
        CdkVirtualScrollViewport, NoItemsFoundComponent,
    ]
})
export class SearchPage implements OnInit {

    @ViewChild(CdkVirtualScrollViewport) viewport?: CdkVirtualScrollViewport;
    @ViewChild(IonInfiniteScroll) infiniteScroll?: IonInfiniteScroll;

    // --- State Management ---
    isLoading = true;
    isRefreshing = false;

    // --- Pagination & Search ---
    private currentPage = 0;
    private hitsPerPage = 20;
    private totalPages = 1;
    private query = '';
    workOrders: WorkOrder[] = [];
    private searchSubject = new Subject<string>();

    // --- Filters ---
    filters = {
        status: '',
        type: '',
        customerId: ''
    };

    constructor(
        private workOrdersService: WorkOrdersService,
        private cdr: ChangeDetectorRef,
        private modalCtrl: ModalController,
        private route: ActivatedRoute,
        private router: Router
    ) {
        addIcons({ optionsOutline, caretDown, close });
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.filters.status = params['status'] || '';
            this.filters.type = params['type'] || '';
            this.filters.customerId = params['customerId'] || '';
            this.query = params['query'] || '';
            this.loadInitialData();
        });

        this.searchSubject.pipe(
            debounceTime(300),
            tap(query => {
                this.query = query;
                this.updateUrl();
                this.resetAndLoad();
            })
        ).subscribe();
    }

    private updateUrl() {
        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
                query: this.query || null,
                status: this.filters.status || null,
                type: this.filters.type || null,
                customerId: this.filters.customerId || null
            },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    onSearchChange(event: any) {
        this.searchSubject.next(event.detail.value);
    }

    private loadInitialData() {
        this.isLoading = true;
        this.workOrders = [];
        this.fetchWorkOrders().pipe(
            finalize(() => this.isLoading = false)
        ).subscribe((data: any) => this.handleApiResponse(data));
    }

    private resetAndLoad() {
        this.currentPage = 0;
        this.totalPages = 1;
        this.workOrders = [];
        this.isLoading = true;
        if (this.infiniteScroll) {
            this.infiniteScroll.disabled = false;
        }

        this.fetchWorkOrders().pipe(
            finalize(() => this.isLoading = false)
        ).subscribe((data: any) => this.handleApiResponse(data));
    }

    loadMore(event: any) {
        if (this.currentPage >= this.totalPages) {
            event.target.complete();
            event.target.disabled = true;
            return;
        }

        this.fetchWorkOrders().subscribe((data: any) => {
            this.handleApiResponse(data, true);
            event.target.complete();
            if (this.currentPage >= this.totalPages) {
                event.target.disabled = true;
            }
        });
    }

    async doRefresh(event: any) {
        this.isRefreshing = true;
        this.currentPage = 0;
        this.totalPages = 1;
        if (this.infiniteScroll) {
            this.infiniteScroll.disabled = false;
        }

        this.fetchWorkOrders().pipe(
            finalize(() => {
                this.isRefreshing = false;
                event.target.complete();
                setTimeout(() => this.viewport?.scrollToIndex(0), 100);
            })
        ).subscribe((data: any) => {
            this.workOrders = data.hits || [];
            this.totalPages = data.nbPages || 1;
            this.currentPage = 1;
        });
    }

    private fetchWorkOrders() {
        // Convert Promise to Observable using from()
        return from(this.workOrdersService.getWorkOrdersFiltered({
            page: this.currentPage,
            hitsPerPage: this.hitsPerPage,
            query: this.query,
            status: this.filters.status || undefined,
            type: this.filters.type || undefined,
            customerId: this.filters.customerId || undefined
        })).pipe(
            catchError(err => {
                console.error('Error fetching work orders:', err);
                return of({ hits: [], nbPages: 0 });
            })
        );
    }

    private handleApiResponse(data: any, isAppending = false) {
        const newHits = data.hits || [];
        this.workOrders = isAppending ? [...this.workOrders, ...newHits] : newHits;
        this.totalPages = data.nbPages || 1;
        this.currentPage++;

        this.cdr.detectChanges();
        setTimeout(() => this.viewport?.checkViewportSize(), 0);
    }


    ////////// MODALS //////////
    async openModalWorkOrder(workOrder: WorkOrder) {
        const modal = await this.modalCtrl.create({
            component: RequestSignPage,
            componentProps: {
                workOrderId: workOrder.id
            }
        });
        await modal.present();
    }
    async openFiltersModal() {
        const modal = await this.modalCtrl.create({
            component: SearchFiltersPage,
            componentProps: {
                filters: { ...this.filters } // Pass a copy of the current filters
            }
        });
        modal.present();

        const { data, role } = await modal.onWillDismiss();

        if (role === 'confirm') {
            this.filters = data;
            this.updateUrl();
            this.resetAndLoad();
        }
    }
    ////////////////////////////
    // **** ADD THIS FUNCTION ****
    /**
     * A trackBy function for the virtual scroll to improve performance.
     * It helps Angular identify unique items in the list to avoid re-rendering them.
     * @param index The index of the item.
     * @param item The work order object.
     * @returns A unique identifier for the work order, in this case, the control number.
     */
    trackById(index: number, item: any): any {
        return item.controlNo;
    }
    createDate(dateValue: any): string {
        if (!dateValue) return '';
        // Firestore Timestamp serializado
        if (typeof dateValue === 'object' && dateValue._seconds !== undefined) {
            const date = new Date(dateValue._seconds * 1000);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }
        // Si es Firestore Timestamp con método toDate
        if (dateValue.toDate && typeof dateValue.toDate === 'function') {
            const d = dateValue.toDate();
            return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
        }
        // Si es string o número
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
}