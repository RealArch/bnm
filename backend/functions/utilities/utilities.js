
const utilities = {

    createFortnightArray: function (paymentSchedule, nextPayDay) {
        var paycheckDays;
        var fortnight;

        fortnight = {
            days: [],
            parameters: {
                paymentSchedule: paymentSchedule
            }
        }

        if (paymentSchedule == 'biweekly') paycheckDays = 14

        for (let i = 0; i < paycheckDays; i++) {
            //get the previous date on each iteration, then fill the array with all the days possible on the paycheck
            const previousDayMilliseconds = nextPayDay - (i * 24 * 60 * 60 * 1000);
            var dayData = {
                day: previousDayMilliseconds,
                employees: []
            }
            fortnight.days.unshift(dayData); // Añade los días en orden ascendente
        }
        return fortnight
    },
    calculateEndOfPaycheck(paymentSchedule, paycheckStartingDate) {
        let endDate;
        if (paymentSchedule === 'biweekly') {
            // Restar 14 días (2 semanas) para obtener el día de inicio 
            endDate = new Date(paycheckStartingDate + 13 * 24 * 60 * 60 * 1000);
        } else if (paymentSchedule === 'weekly') {
            // Restar 7 días (1 semana) para obtener el día de inicio 
            endDate = new Date(paycheckStartingDate + 6 * 24 * 60 * 60 * 1000);
        } else {
            throw new Error('Invalid payment schedule. Use "biweekly" or "weekly".');
        }
        return endDate.getTime();
    },
    calculateNextPaycheckStart(paycheckEndDate){
        let endDate;
        endDate = new Date(paycheckEndDate + 1 * 24 * 60 * 60 * 1000);

        return endDate.getTime();
    },
    calculateNextPaycheckEnd(paymentSchedule, paycheckStartingDate){
        let endDate;
        if (paymentSchedule === 'biweekly') {
            // sumar 14 días (2 semanas) para obtener el día de inicio 
            endDate = new Date(paycheckStartingDate + 14 * 24 * 60 * 60 * 1000);
        } else if (paymentSchedule === 'weekly') {
            // sumar 7 días (1 semana) para obtener el día de inicio 
            endDate = new Date(paycheckStartingDate + 7 * 24 * 60 * 60 * 1000);
        } else {
            throw new Error('Invalid payment schedule. Use "biweekly" or "weekly".');
        }
        return endDate.getTime();
    },
    addEmployeeDataToDay: function () {

    }


}

module.exports = utilities