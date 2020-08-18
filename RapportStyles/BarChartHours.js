import firebase from '../database/firebase';


export const BarchartPerHour = (table,maxPeople,date,hoursTable) => {
    var values = `<section>
                  <div class="bodyLineChart">
                    <table id="q-graph">
                    <caption>Entrants pendant la journée de ${date}</caption>
                    <tbody>`;
    var i=0;
    if(maxPeople < 10) {maxPeople = 10}
    var max = Math.trunc(maxPeople);
    var pas = Math.trunc(maxPeople/10);
    //console.log('hoursTable: ',hoursTable)
    table.forEach((val)=>{
         var height = (val*35)/pas;
         height = height === 0 ? 0 : height+4;
         var p = val === 0 ? '' : val;
         var color = '#A9261C';
         if(hoursTable.includes(i)){ color = '#363636'}
         values = values+`<tr class="qtr" id="q${i}">
                          <th scope="row">`+(i === 0 ? '00': i)+`h</th>
                          <td class="sent bar" style="height: ${height}px; background-color: ${color};"><p style="font-size:50%;">${p}</p></td>
                          </tr>`
          i=i+1;
    })
    
    values = values+`</tbody>
                    </table>
                    <div id="ticks">
                    <div class="tick" style="height: 35px;"><p>${max} personnes</p></div>`
   
    for(let i = 0 ; i < 9 ;  i++){
        max = max-pas;
        values = values + `
                    <div class="tick" style="height: 35px;"><p>${max} </p></div>`
    }
    
    return values+`</div></div></section>`;
  }


  export const BarchartPerHourStyles = (length) => {
                    var values = `
                    #q-graph {
                        display: block; /* fixes layout wonkiness in FF1.5 */
                        position: relative; 
                        width: 600px; 
                        height: 300px;
                        margin: 1.1em 0 0; 
                        padding: 0;
                        background: transparent;
                        font-size: 11px;
                        
                    }
                    
                    #q-graph caption {
                        caption-side: top; 
                        width: 600px;
                        color: #595959;
                        letter-spacing: .5px;
                        top: -90px;
                        position: relative; 
                        z-index: 10;
                        font-weight: bold;
                    }
                    
                    #q-graph tr, #q-graph th, #q-graph td { 
                        position: absolute;
                        bottom: 0; 
                        width: 40px;  /* 150 */
                        z-index: 2;
                        margin: 0; 
                        padding: 0;
                        text-align: center;
                    }
                    
                        
                    #q-graph thead tr {
                        left: 100%; 
                        top: 50%; 
                        bottom: auto;
                        margin: -2.5em 0 0 5em;}
                    #q-graph thead th {
                        width: 7.5em; 
                        height: auto; 
                        padding: 0.5em 1em;
                    }
                    #q-graph thead th.sent {
                        top: 0; 
                        left: 0; 
                        line-height: 2;
                    }
                    #q-graph thead th.paid {
                        top: 2.75em; 
                        line-height: 2;
                        left: 0; 
                    }
                    
                    #q-graph tbody tr {
                        height: 360px; /* 296 */
                        padding-top: 2px;
                        /* border-right: 1px dotted #C4C4C4; */
                        color: #AAA;
                    }
                    #q-graph #q0 {
                        left: 0;
                    }
                    
                   
                    `;
    var j=0;
    var left = 0;
    for (let i = 1; i <= length; i++){
         j= i;
         left = left+26;
         values = values+`#q-graph #q${i} {left: ${left}px;}`+"\n"
    
  }
     
    values = values+`   #q-graph #q${j+1} {left: ${left+26}px; border-right: none;}
                        #q-graph tbody th {bottom: -1.75em; vertical-align: top;
                            font-weight: normal; color: #333;}
                            #q-graph .bar {
                                width: 25px;  /* bar legth */
                                border: 1px solid; 
                                border-bottom: none; 
                                color: #000;
                            }
                            #q-graph .bar p {
                                margin: -10px 0 0; 
                                padding: 0;
                                /*opacity: .4;*/
                                color: black;
                                font-weight: bold;
                            }
                            #q-graph .sent {
                                left: 8px; 
                               /* background-color: #305982; */
                                border-color: #ffffff;
                                border-width: 1
                            }`;
    // console.log(values)
    return values;
  }

  
  
