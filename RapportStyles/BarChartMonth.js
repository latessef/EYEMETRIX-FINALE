export const BarchartPerMonth = (table,maxPeople,DateJoursRepos,JoursFeries,date) => {
    var values = `<section><div class="bodyLineChart">
       <table id="q-graph2">
       <caption>Entrants dans le mois ${date}</caption>
       <tbody>`;
    if(maxPeople < 10) {maxPeople = 10}
    var max = Math.trunc(maxPeople);
    var pas = Math.trunc(maxPeople/10);
    table.forEach((val)=>{
         var height = (val.entry*35)/pas;
         height = height === 0 ? 0 : height;
         var p = val.entry === 0 ? ' ' : val.entry ;
         var color = '#305982';
         if(DateJoursRepos.includes(val.date)){ color = '#ed7d31'}
         else if(JoursFeries.includes(val.date)){ color = '#823059'}
         values = values+`<tr class="qtr" id="q${val.date}">
                          <th scope="row">${val.date}</th>
                          <td class="sent bar" style="height: ${height}px; background-color: ${color};"><p style="font-size:30%;">${p}</p></td>
                          </tr>`
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


  export const BarchartPerMonthStyles = (length) => {
                    var values = `
                    #q-graph2 {
                        display: block; /* fixes layout wonkiness in FF1.5 */
                        position: relative; 
                        width: 600px; 
                        height: 300px;
                        margin: 1.1em 0 0; 
                        padding: 0;
                        background: transparent;
                        font-size: 11px;
                        
                    }
                    
                    #q-graph2 caption {
                        caption-side: top; 
                        width: 600px;
                        color: #595959;
                        letter-spacing: .5px;
                        top: -90px;
                        position: relative; 
                        z-index: 10;
                        font-weight: bold;
                    }
                    
                    #q-graph2 tr, #q-graph2 th, #q-graph2 td { 
                        position: absolute;
                        bottom: 0; 
                        width: 35px;  /* 150 Left days*/
                        z-index: 2;
                        margin: 0; 
                        padding: 0;
                        text-align: center;
                    }
                    
                        
                    #q-graph2 thead tr {
                        left: 100%; 
                        top: 50%; 
                        bottom: auto;
                        margin: -2.5em 0 0 5em;}
                    #q-graph2 thead th {
                        width: 7.5em; 
                        height: auto; 
                        padding: 0.5em 1em;
                    }
                    #q-graph2 thead th.sent {
                        top: 0; 
                        left: 0; 
                        line-height: 2;
                    }
                    #q-graph2 thead th.paid {
                        top: 2.75em; 
                        line-height: 2;
                        left: 0; 
                    }
                    
                    #q-graph2 tbody tr {
                        height: 360px;
                        padding-top: 2px;
                        /* border-right: 1px dotted #C4C4C4; */
                        color: #AAA;
                    }
                    #q-graph2 #q0 {
                        left: 0;
                    }
                    #q-graph2 #q1 {
                        left: 10;
                    }
                    
                   
                    `;
    var j=0;
    var left = 0;
    for (let i = 2; i <= length; i++){
         j= i;
         left = left+21;
         values = values+`#q-graph2 #q${i} {left: ${left}px;}`+"\n"
    
  }
     
    values = values+`   #q-graph2 #q${j+1} {left: ${left+21}px; border-right: none;}
                        #q-graph2 tbody th {bottom: -1.75em; vertical-align: top;
                            font-weight: normal; color: #333;}
                            #q-graph2 .bar {
                                width: 20px;  /* bar legth */
                                border: 1px solid; 
                                border-bottom: none; 
                                color: #000;
                            }
                            #q-graph2 .bar p {
                                margin: 2px 0 0; 
                                padding: 0;
                                opacity: .4;
                                color: white;
                                font-weight: bold;
                                
                            }
                            #q-graph2 .sent {
                                left: 8px; 
                                background-color: #305982;
                                border-color: #ffffff;
                                border-width: 1
                            }`;
    // console.log(values)
    return values;
  }
