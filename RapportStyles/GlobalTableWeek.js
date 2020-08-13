

export const GlobalTableWeek = (employes,entry,OutBis,weekDays) => {
    var values = ` <section>
                <h4 style="color: #595959; text-align: center;"> Tableau de flux global </h4>
                <table id="customers">
                
                <tr class="tr-employes">
                    <th class="th-employes"style="text-align:center; font-size:12px; width:10px">Jour</th>`

    weekDays.forEach(element => {
        values = values+ `<th style="text-align:center; font-size:10px; width:40px"> ${element.day} </th>`
    })
    values = values + `</tr>
                       <tr>
                        <th style="text-align:center; font-size:10px; width:10px">Employés Entrants</th>
                       `;
    employes.forEach(element => {
        values = values+ `<td class="td-employes" style="font-size:10px;"> ${element.employes} </td>`
    })

    values = values + `</tr>
                       <tr>
                        <th style="text-align:center; font-size:10px; width:10px">Clients</th>
                       `;
    for(let i = 0 ; i < 7 ; i++){
        var num = entry[i].client === 0 ? 0 : entry[i].client-employes[i].employes
        values = values+ `<td class="td-employes" style="font-size:10px;"> ${num} </td>`
    }
   
    
  var values = values + `<tr>
                            <th style="text-align:center; font-size:10px; width:10px">Accés hors horaires du tarvail</th>`

   weekDays.forEach( day => {
        //var trouve = false;
        values = values + `<td>
                            `
        OutBis.forEach(element => {
            if(element.day === day.day){
                values = values + ` 
                                    <p style="font-size:8px; text-align: left">${element.name+element.Entry}</p>
                                    
                                `
            }
        });
        values = values + `
                            </td>`
    }) 
    values = values + ` 
                        </tr>
                        </table>
                        </section>`
    return values;
}