import { Injectable } from '@angular/core';
import { algoliasearch } from 'algoliasearch';
import { environment } from './../../environments/environment';

const client = algoliasearch(environment.algolia.appID, environment.algolia.searchKey)

@Injectable({
  providedIn: 'root'
})
export class PaychecksService {

  constructor() { }

  async getPaycheckPeriodAlgolia(uid: any) {
    try {
      const response = await client.getObject({
        indexName: environment.algolia.indexes.paycheckHistory,
        objectID: uid
      })
      return response


    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }
  addDataToUsersData(usersData: any, paycheck: any) {
  var data = JSON.parse(JSON.stringify(usersData))
    //Reset all usersData.currentPaycheck
    for (let i = 0; i < data.length; i++) {
      data[i].currentPaycheck = []
    }
    //update currentPaycheck with each user:any
    paycheck.forEach((userPaycheck: any) => {
      //sustituir el currentPaycheck y el hourlyRate
      const index = data.findIndex((item: { uid: any; }) => item.uid === userPaycheck.userId);
      if (index == -1) {
        //anadir info de que no se encontro el user
      } else {
        data[index].currentPaycheck = userPaycheck.days
      }

    })
    return data
  }
  calculateEndOfPaycheck(paymentSchedule: string, paycheckStartingDate: number) {
    let endDate: Date;
    if (paymentSchedule === 'biweekly') {
      // Restar 14 días (2 semanas) para obtener el día de inicio 
      endDate = new Date(paycheckStartingDate + 13 * 24 * 60 * 60 * 1000);
    } else if (paymentSchedule === 'weekly') {
      // Restar 7 días (1 semana) para obtener el día de inicio 
      endDate = new Date(paycheckStartingDate + 6 * 24 * 60 * 60 * 1000);
    } else {
      throw new Error('Invalid payment schedule. Use "biweekly" or "weekly".');
    }
    return endDate;
  }
}
