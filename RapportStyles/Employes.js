export const tableEmployes = (table) => {
    var values = ` <section>
                <h4 style="color: #595959; text-align: center;"> Tableau des entrées/sorties des employés </h4>
                <table class= "employes">
                
                <tr class="tr-employes">
                <th class="th-employes" style="font-size:10px;">Employés</th>
                <th class="th-employes" style="font-size:10px;">Première entrée</th>
                <th class="th-employes" style="font-size:10px;">dernière sortie</th>
                </tr>`
    table.forEach(element => {
        values = values + `<tr class="tr-employes">
                    <td class="td-employes" style="font-size:10px;">${element.name}</td>
                    <td class="td-employes" style="font-size:10px;">${element.FirstEntry}</td>
                    <td class="td-employes" style="font-size:10px;">${element.LastExit}</td>
                  </tr>`;
    });
    values = values+`</table>
                    </section>`
    
    return values;
}