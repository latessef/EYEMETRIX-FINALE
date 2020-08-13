import Moment from 'moment';
import 'moment/locale/fr';


export const WeeklyReport = (start,End,Nom,
                            BarchartPerDay,
                            BarchartPerWeekStyles,
                            tableEmployes, GlobalTable) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rapport</title>
        <style>
         @page { margin: 30px; } 
         section {
          break-inside: avoid;
        }  
         body {
                font-size: 16px;
                color: 'black';
            }
            h2 {
                text-align: center;
                color: #1F3864;
            }
            h3 {
              text-align: center;
              color: #595959;
          }
          
            .bodyLineChart {
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              font-family: "fira-sans-2", Verdana, sans-serif;
              padding-Top: 100px
              
            }
            
            ${BarchartPerWeekStyles}
            #ticks {
              position: relative; 
              top: -360px;  /* Background */
              left: 2px;
              width: 596px; 
              height: 300px; 
              z-index: 1;
              margin-bottom: -300px;
              font-size: 10px;
              font-family: "fira-sans-2", Verdana, sans-serif;
            }
            
            #ticks .tick {
              position: relative; 
              border-bottom: 1px dotted #C4C4C4; 
              width: 600px; /* width of line */
            }
            
            #ticks .tick p {
              position: absolute; 
              left: -5em; 
              top: -0.8em; 
              margin: 0 0 0 0.5em;
            }
            
            .employes {
              border-collapse: collapse;
              width: 90%;
              margin-left: 50px;
              
            }
            
            .th-employes, .td-employes {
              padding: 8px;
              text-align: center;
            }
            
            .tr-employes:nth-child(even){background-color: #f2f2f2}
            
            .th-employes {
              background-color: #9CC2E5;
              color: black;
            }

            #customers {
              font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
              border-collapse: collapse;
              width: 90%;
              margin-left:auto; 
              margin-right:auto;
            }
            
            #customers td, #customers th {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: center;
            }
            
            #customers tr:nth-child(even){background-color: #f2f2f2;}
            
            #customers tr:hover {background-color: #ddd;}
            
            #customers th {
              padding-top: 12px;
              padding-bottom: 12px;
              text-align: center;
              background-color: #9CC2E5;
              color: black;
              width: 50%;
            }
            .key {
              width: 50%;
              float: center;
              list-style: none;
              display: table;
              border-collapse: separate;
              > li {
                display: table-row;
                > * {
                  display: table-cell;
                  border-bottom: 12px solid white;
                }
              }
            }
            .choice {
              padding-left: 10px;
            }
            .chartColor {
              margin-left: auto;
              margin-right: auto;
              font-size: 10px;
              font-family: "fira-sans-2", Verdana, sans-serif;
            }
        </style>
    </head>
    <body>
        <h2>Rapport de la semaine du  ${start+' au '+ End}</h2>
         <h3> ${Nom} </h3>
         </br>
       ${BarchartPerDay}
       </br></br>
       <table class="chartColor">
        <tr >
        <th style = "background-color : #305982; border-color: transparent; width: 20px; height: 10px"></th>
        <th></th>
        <th>  Jours de travail</th>
        <th style = ""width: 20px></th>
        
        <th style = "background-color : #ed7d31; border-color: transparent; width: 20px; height: 10px"></th>
        <th></th>
        <th>  Jours Repos</th>
        <th style = "background-color : #823059; border-color: transparent; width: 20px; height: 10px"></th>
        <th></th>
        <th>  Jours Feriers</th>
        </tr>
       </table>
       </br> </br></br>
       ${GlobalTable}
       </br> </br></br>
       ${tableEmployes}
    </body>
    </html>`;
