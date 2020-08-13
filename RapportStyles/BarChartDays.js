export const BarchartPerDay = (table,maxPeople,DateJoursRepos,JoursFeries) => {
    var values = `<section><div class="bodyLineChart">
       <table id="q-graph1">
       <caption>Entrants pendant la semaine du ${table[0].date+' au '+table[6].date} </caption>
       <tbody>`;
    if(maxPeople < 10) {maxPeople = 10}
    var max = Math.trunc(maxPeople);
    var pas = Math.trunc(maxPeople/10);
    //var i = 0;
    //table = table.reverse();
    for(let i= 0 ; i < 7 ; i++){
         var height = Math.trunc((table[i].entry*35)/pas);
         height = height === 0 ? 0 : height+6;
         var p = table[i].entry === 0 ? ' ' : table[i].entry ;
         var color = '#305982';
         if(DateJoursRepos.includes(table[i].day)){ color = '#ed7d31'}
         else if(JoursFeries.includes(table[i].date)){ color = '#823059'}
         values = values+`<tr class="qtr" id="q${i}">
                          <th scope="row">${table[i].day}</th>
                          <td class="sent bar" style="height: ${height}px; background-color: ${color};"><p style="font-size:70%;">${p}</p></td>
                          </tr>`
       // i = i+1;
    }
     
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

export const BarchartPerDayStyles = (length) => {
    var values = `#q-graph1 {
        display: block; /* fixes layout wonkiness in FF1.5 */
        position: relative; 
        width: 600px; 
        height: 300px;
        margin: 1.1em 0 0; 
        padding: 0;
        background: transparent;
        font-size: 11px;
    }
    
    #q-graph1 caption {
        caption-side: top; 
        width: 600px;
        color: #595959;
        letter-spacing: .5px;
        top: -90px;
        position: relative; 
        z-index: 10;
        font-weight: bold;
    }
    
    #q-graph1 tr, #q-graph1 th, #q-graph1 td { 
        position: absolute;
        bottom: 0; 
        width: 90px;  /* 150  with items*/
        z-index: 2;
        margin: 0; 
        padding: 0;
        text-align: center;
    }
    
        
    #q-graph1 thead tr {
        left: 100%; 
        top: 50%; 
        bottom: auto;
        margin: -2.5em 0 0 5em;}
    #q-graph1 thead th {
        width: 7.5em; 
        height: auto; 
        padding: 0.5em 1em;
    }
    #q-graph1 thead th.sent {
        top: 0; 
        left: 0; 
        line-height: 2;
    }
    #q-graph1 thead th.paid {
        top: 2.75em; 
        line-height: 2;
        left: 0; 
    }
    
    #q-graph1 tbody tr {
        height: 360px;
        padding-top: 2px;
        /* border-right: 1px dotted #C4C4C4; */
        color: #AAA;
    }
    #q-graph1 #q0 {
        left: 0;
    }
    
   
    `;
    var j=0;
    var left = 0;
    for (let i = 1; i <= length; i++){
    j= i;
    left = left+80;
    values = values+`#q-graph1 #q${i} {left: ${left}px;}`+"\n"

    }

    values = values+`   #q-graph1 #q${j+1} {left: ${left+80}px; border-right: none;}
                        #q-graph1 tbody th {bottom: -1.75em; vertical-align: top;
                            font-weight: normal; color: #333;}
                            #q-graph1 .bar {
                                width: 50px;  /* bar legth */
                                border: 1px solid; 
                                border-bottom: none; 
                                color: #000;
                            }
                            #q-graph1 .bar p {
                                margin: 5px 0 0; 
                                padding: 0;
                                opacity: .4;
                                color: white;
                                font-weight: bold;
                            }
                            #q-graph1 .sent {
                                left: 13px; 
                                background-color: #305982;
                                border-color: #ffffff;
                                border-width: 1
                            }`;
    // console.log(values)
    return values;
    }
