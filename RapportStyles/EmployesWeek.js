
export const EmployesWeek = (employes,WeekDays,names) => {
    //console.log(employes)
    var values = ` <section>
                <h4 style="color: #595959; text-align: center;"> Tableau des entrées/sorties des employés </h4>
                <table id="customers">
                
                <tr class="tr-employes">
                    <th class="th-employes"style="text-align:center; font-size:12px;">Employés/Jour</th>`

    WeekDays.forEach(element => {
        values = values+ `<th style="text-align:center; font-size:12px;width: 18px"> ${element.day} </th>`
    })
    values = values + `</tr>`;
    
    names.forEach(name => {
        var trouve = false;
        values = values+ `
                        <tr>
                        <td class="td-employes"style="font-size:10px; width: 10px">${name}</td>`
        
        WeekDays.forEach( day => {
            
            employes.forEach( element => {
                if(element.date === day.day && element.name === name){
                    trouve = true
                    values = values+ `<td>
                                        <table>
                                            <tr class="tr-employes">
                                            <td class="td-employes" style="font-size:8px; width: 10px; border: none;">${element.Entry}</td>
                                            <td class="td-employes" style="font-size:8px; width: 10px; border: none;">${element.Exit}</td>
                                            </tr>
                                        </table>
                                      </td>`
                }
            })
            if(!trouve){
                values = values+ `<td>
                                    <table>
                                    <tr class="tr-employes">
                                        <td class="td-employes" style="font-size:8px; width: 10px; border: none;">--</td>
                                        <td class="td-employes" style="font-size:8px; width: 10px; border: none;">--</td>
                                    </tr>
                                    </table>
                                </td>`
                                
                    
            } 
            trouve = false;
        })
        
                        
        values = values +`</tr>`;
                        
    })
    values = values + `
                        </table>
                        </section>`             
    return values;
}