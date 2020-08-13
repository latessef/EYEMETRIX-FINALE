import { element } from "prop-types";

export const EmployesMonth = (employes,Monthday,names,works) => {
    console.log(names.length )
    var values;
    if(names.length <= 10){
            values = ` <section>
                        <h4 style="color: #595959; text-align: center;"> Tableau des entrées/sorties des employés </h4>
                        <table id="customers">
                        
                        <tr class="tr-employes">
                            <th class="th-employes" style="font-size:12px">Jour</th>`

            names.forEach(element => {
                values = values+ `<th style="text-align:center; font-size:12px;width: 18px"> ${element} </th>`
            })
            values = values + `</tr>`;
            
            Monthday.forEach(day => {
                var trouve = false;
                values = values+ `
                                <tr>
                                <td class="td-employes"style="font-size:10px; width: 10px">${day}</td>`
                
                names.forEach( el => {
                    
                    employes.forEach( element => {
                        if(element.date === day && element.name === el){
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
        }    
    else {
        values = ` <section>
                    <h4 style="color: #595959; text-align: center;"> Tableau des employés </h4>
                    <table id="customers">
                    
                    <tr class="tr-employes">
                        <th class="th-employes" style="font-size:12px; width: 10px">Employés</th>
                        <th class="th-employes" style="font-size:12px; width: 10px;">Jours travaillés</th>
                        <th class="th-employes" style="font-size:12px; width: 10px;">Jours non travaillés</th>
                    </tr>`
        works.forEach(element => {
            values = values+ ` <tr>
                                <td style="text-align:center; font-size:12px;"> ${element.name} </td>
                                <td class="td-employes" style="font-size:8px;">${element.work}</td>
                                <td class="td-employes" style="font-size:8px;">${element.Nowork}</td>
                                </tr>`
                                
        })
        values = values + `
                            </table>
                            </section>`  
    }       
    return values;
}