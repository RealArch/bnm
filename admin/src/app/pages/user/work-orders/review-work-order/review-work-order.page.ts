import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { WorkOrdersService } from 'src/app/services/work-orders.service';
import { WorkOrder } from 'src/app/interfaces/work-orders';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-review-work-order',
  templateUrl: './review-work-order.page.html',
  styleUrls: ['./review-work-order.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ReviewWorkOrderPage implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();
  route = inject(ActivatedRoute);
  workOrdersService = inject(WorkOrdersService);
  workOrder: WorkOrder | null = null;
  loading = false;
  id: string = this.route.snapshot.paramMap.get('id') as string;

  ngOnInit() {
    this.fetchWorkOrder();
  }

  fetchWorkOrder() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.workOrdersService.getWorkOrderByControlNo(parseInt(id))
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (order: WorkOrder | null) => {
            this.workOrder = order;
            this.loading = false;
            console.log(this.workOrder);
          },
          error: () => {
            this.loading = false;
          }
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
