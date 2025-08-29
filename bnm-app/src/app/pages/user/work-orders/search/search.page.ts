import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import {
    IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
    IonBackButton, IonSearchbar, IonRow, IonCol, IonItem, IonLabel,
    IonSpinner, IonRefresher, IonRefresherContent, IonInfiniteScroll,
    IonInfiniteScrollContent, IonGrid, IonTitle, IonPopover, IonList, IonFab, IonFabButton
} from '@ionic/angular/standalone';
import { debounceTime, Subject, finalize, switchMap, catchError, of, tap, from } from 'rxjs';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { addIcons } from 'ionicons';
import { optionsOutline, close } from 'ionicons/icons';
import { NoItemsFoundComponent } from 'src/app/components/no-items-found/no-items-found.component';

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
        IonInfiniteScrollContent, IonGrid, IonTitle, IonPopover, IonList, IonFab, IonFabButton,
        CdkVirtualScrollViewport, NoItemsFoundComponent
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
    workOrders: any[] = [];
    private searchSubject = new Subject<string>();

    // --- Filters ---
    filters = {
        status: '',
        type: '',
        customerId: ''
    };

    constructor(
        private workOrdersService: WorkOrdersService,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ optionsOutline, close });
    }

    ngOnInit() {
        this.loadInitialData();

        this.searchSubject.pipe(
            debounceTime(300),
            tap(query => {
                this.query = query;
                this.resetAndLoad();
            })
        ).subscribe();
    }

    onSearchChange(event: any) {
        this.searchSubject.next(event.detail.value);
    }
    
    private loadInitialData() {
        this.isLoading = true;
        this.workOrders = [];
        this.fetchWorkOrders().pipe(
            finalize(() => this.isLoading = false)
        ).subscribe((data:any) => this.handleApiResponse(data));
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
        ).subscribe((data:any) => this.handleApiResponse(data));
    }

    loadMore(event: any) {
        if (this.currentPage >= this.totalPages) {
            event.target.complete();
            event.target.disabled = true;
            return;
        }

        this.fetchWorkOrders().subscribe((data:any) => {
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
        ).subscribe((data:any) => {
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

    openFilters() {
        console.log('Open filter modal');
    }

    openRequestSignModal(workOrder: any) {
        console.log('Request sign for:', workOrder);
    }

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
}