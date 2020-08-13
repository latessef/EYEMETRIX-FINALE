export const styleChartPie = () => {
    var num = '50'
    var styles = `.chart {
      background: 
        conic-gradient(
          #F15854 ${num}%, 
          #B276B2 0
        );
      border-radius: 50%;
      width: 37%;
      height: 80%;
      padding-top: 50%;
      float: left;
      padding-right: 20px;
    }
    .percent { color: white; padding: 10px 2px; text-shadow: 0 0 1px black; text-align: center; }
    .choice { padding-left: 10px;}
    .red { background: #F15854;}
    .gray { background: #FAA43A;}
    .blue { background: #4D4D4D; }
    .yellow { background: #5DA5DA;}
    .purple { background: #DECF3F;}
    .orange { background: #B276B2;}
    * {
      box-sizing: border-box;
    }`
    return styles;
  }