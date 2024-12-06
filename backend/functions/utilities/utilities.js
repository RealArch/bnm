
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
    
    addEmployeeDataToDay: function () {

    }


}

module.exports = utilities