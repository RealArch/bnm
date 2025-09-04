import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Algoliasearch, algoliasearch } from 'algoliasearch';

@Injectable({
  providedIn: 'root'
})
export class WorkOrdersService {
  private client: any = algoliasearch(environment.algolia.appID, environment.algolia.searchKey);

  /**
   * Obtiene Work Orders desde Algolia con paginación, búsqueda y filtros avanzados
   */
  getWorkOrdersAlgolia(params: {
    page?: number,
    hitsPerPage?: number,
    query?: string,
    createdByUid?: string,
    customerId?: string,
    status?: string,
    type?: string,
    startDate?: string,
    closeDate?: string
  }) {
    const {
      page = 0,
      hitsPerPage = 20,
      query = '',
      createdByUid,
      customerId,
      status,
      type,
      startDate,
      closeDate
    } = params;
    console.log(params)
    const filters: string[] = [];
    if (createdByUid) filters.push(`createdBy.uid:"${createdByUid}"`);
    if (customerId) filters.push(`customer.id:"${customerId}"`);
    if (status) filters.push(`status:"${status}"`);
    if (type) filters.push(`type:"${type}"`);
    if (startDate && closeDate) {
      filters.push(`startDate:[${startDate} TO ${closeDate}]`);
    } else if (startDate) {
      filters.push(`startDate >= ${startDate}`);
    } else if (closeDate) {
      filters.push(`closeDate <= ${closeDate}`);
    }
    const filterString = filters.join(' AND ');
    console.log(filterString)
    this.client.clearCache();
    return this.client.searchSingleIndex({
      indexName: environment.algolia.indexes.workOrders,
      searchParams: {
        page,
        hitsPerPage,
        query,
        filters: filterString || undefined
      }
    });
  }
}