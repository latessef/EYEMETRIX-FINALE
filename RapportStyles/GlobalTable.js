import { element } from "prop-types"
import { Value } from "react-native-reanimated";

export const GlobalTable = (employes,entry,OutBis) => {
  var values = `<section>
                  <h4 style="color: #595959; text-align: center;"> Tableau de flux global </h4>
                  <table id="customers">
                  <tr>
                      <td style="border: none;"></td>
                      <td class="td-employes" style="font-size:10px;">Nombre</td>
                      <th font-size:10px;>Commentaires</th>
                  </tr>
                  <tr>
                      <th style="font-size:10px;">Employés Entrants</th>
                      <td style="font-size:10px;">${employes}</td>
                      <td></td>
                  </tr>
                  <tr>
                      <th style="font-size:10px;">Clients</th>
                      <td style="font-size:10px;">${entry-employes}</td>
                      <td></td>
                  </tr>
                  <tr>
                      <th style="font-size:10px;">Accés hors horaires de travail</th>
                      <td style="font-size:10px;">${OutBis.length}</td>
                      <td>
                      `
    OutBis.forEach(element => {
      values = values + `
                        <p style="font-size:8px; text-align: left">${element.name+' '+element.Entry}</p>`
    });
    values = values + ` 
                        </tr>
                        </table>
                        </section>`
    return values;
}