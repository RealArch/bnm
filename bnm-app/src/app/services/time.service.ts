import { Injectable } from '@angular/core';
import moment from 'moment-timezone';
@Injectable({
  providedIn: 'root'
})
export class TimeService {

  constructor() { }

  getClientTimezone(): string {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
  dateNowToIso8601Timezone() {

    // Fecha actual en UTC 
    const date = new Date();
    date.setSeconds(0, 0);
    const clientTimeZone = this.getClientTimezone()
    // Convertir la fecha a la zona horaria deseada (por ejemplo, America/New_York) 
    const dateInTimeZone = moment(date).tz(clientTimeZone);
    // Formatear la fecha en ISO 8601 con el huso horario 
    const isoStringWithTimeZone = dateInTimeZone.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    console.log(isoStringWithTimeZone);
    return isoStringWithTimeZone;
  }

  convertDateToIso8601Timezone(iso8601: string) {
    const clientTimeZone = this.getClientTimezone()
    // Convertir la fecha a la zona horaria deseada (por ejemplo, America/New_York) 
    const dateInTimeZone = moment(iso8601).tz(clientTimeZone);
    // Formatear la fecha en ISO 8601 con el huso horario 
    const isoStringWithTimeZone = dateInTimeZone.format('YYYY-MM-DDTHH:mm:ss.SSSZ');
    return isoStringWithTimeZone;
  }
  timeStringToMilliseconds(timeString: string) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const milliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);
    return milliseconds;
  }
  formatToIso8601(iso8601: string) {
    return moment(iso8601).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
  }
  isSameDay(isoDateString: string) {
    const inputDate = moment(isoDateString);
    const currentDate = moment();
    return inputDate.isSame(currentDate, 'day');
  }
  setSecondsToZeroFromMillis(milliseconds: number) {
    const date = new Date(milliseconds); // Convierte los milisegundos a un objeto Date
    date.setSeconds(0, 0); // Establece los segundos y milisegundos a cero
    return date.getTime(); // Devuelve el tiempo en milisegundos con los segundos en cero
  }

  setMinMaxTime(value?: any) {
    var now 
    if(value) {
      now = moment(value); // Hora actual
    }else{
      now = moment(); // Hora actual
    }
    
    const minDatePicker = now.clone().subtract(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // 5 minutos antes
    const maxDatePicker = now.clone().format('YYYY-MM-DDTHH:mm:ss.SSSZ'); // 5 minutos después
    return {
      minDatePicker,
      maxDatePicker
    };
  }
}
