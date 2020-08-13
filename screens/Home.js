import React from "react";
import { StyleSheet, Dimensions, View, ScrollView,ActivityIndicator, Alert,TouchableOpacity,Linking} from "react-native";
import { Block, theme,Button as GaButton} from "galio-framework";
import { nowTheme } from '../constants';
import firebase from "../database/firebase"
import {
  PieChart,
} from "react-native-chart-kit";
import Loading from 'react-native-whc-loading';
import WeekSelector from 'react-native-week-selector';
import 'moment/locale/fr';
import Moment from 'moment';
import {Text} from "galio-framework";
import { array, element } from "prop-types";
import { BorderlessButton } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("screen");


var list = [{name : "cvv", population: 33, color: "red"},{name : "cvv", population: 100}];

export class PieChartB extends React.Component{
  constructor (props){
    super(props);
    Moment.locale('fr');
    this.state = {
        list : [{name : "", population: 0, legendFontColor: "transparent", color:"transparent"}],
        top5 : [],
        colors : ["#25bfdf","#247fdf","#2500df","#243fdf","#247fdf","#B69E3E","#","#3D9970"],
        weekDate : new Date(),
    }
  }

  UNSAFE_componentWillMount = async () =>{
    this.week();
  }

  topFive = (array) =>{
    var i=0;
    var listName = [];
    array.forEach((element) =>{
      if(i<5){
        i++;
        listName.push(element.name);
      }
    })
    this.setState({
      top5 : listName,
    })
  }

  week = async () => {
    var toDay = Moment("07-07-2020","DD-MM-YYYY",true).local("fr").startOf("week");
    // var toDay = Moment(new Date()).local("fr").startOf("week");
    var selected = Moment(toDay).subtract(1,"d").local("fr")
    var compt = "";
    var ArrayFlux = [];
    var cmt = 0;
    var i = 0;
    var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid).orderByKey();
      query.once("value")
      .then((snapshot) => {
        if(snapshot.val() != null){
          snapshot.forEach((childSnapshot) => {
              var projectName = childSnapshot.val().nom;
              if(childSnapshot != null){
                childSnapshot.child("daily").forEach((grindChildSnapshot) => {
                  for(let i = 1; i <= 7; i++){
                    compt = Moment(selected).add(i, "d").local().format("DD-MM-YYYY");
                    if(grindChildSnapshot != null && grindChildSnapshot.key === compt){
                      var flux = grindChildSnapshot.child("total").val();
                        cmt = cmt + flux
                    }
                  }
        
                });
              }
              var obj = {name : projectName, population : cmt, legendFontColor: "#7F7F7F", color : this.state.colors[i]}
              ArrayFlux.push(obj);
              ArrayFlux.sort((a, b) => (a.population < b.population) ? 1 : -1)
              
              if(cmt != 0){
                this.topFive(ArrayFlux);
                this.setState({
                  list : ArrayFlux,
                })
              }else{
                this.setState({
                  top5 : []
                })
              }
              i++;
          });
          
        }
      });
   }

  renderElement(){
      return (
        <View style = {styles.Picker}>
          <WeekSelector
            dayFormat="DD"
            monthFormat= "/MM"
            onWeekChanged ={this.week}
          />
        </View>
      );
  }

  render(){
    var data =this.state.list
    // if(list != null ){
    //    data = [{name : "cvv", population: "vvv", legendFontColor: "#7F7F7F"},{name : "cvv", population: "vvv", legendFontColor: "#7F7F7F"}];
    // }
    
    // const data = [
    //   {
    //     name: "Seoul",
    //     population: 21500000,
    //     color: nowTheme.COLORS.PRIMARY,
    //     legendFontColor: "#7F7F7F",
    //     // legendFontSize: 15
    //   },
    //   {
    //     name: "Toronto",
    //     population: 3000000,
    //     color: "#de7194",
    //     legendFontColor: "#7F7F7F",
    //     // legendFontSize: 15
    //   },
    //   {
    //     name: "Beijing",
    //     population: 7000000,
    //     color: "#71c1de",
    //     legendFontColor: "#7F7F7F",
    //     // legendFontSize: 15
    //   },
    // ];
    return(
      <Block >
        <Block>
          <View>
            <Text  style={styles.TopfiveTitle} color={nowTheme.COLORS.BLACK}>top 5  </Text>
            <TouchableOpacity onPress={() => Linking.openURL('maps://app?saddr=Cupertino&S100.123+101.222')}>
             <Text>Navigate</Text>
          </TouchableOpacity>
          
  
          </View>
          {this.state.top5.map((item, index) => (
            <View  key={index} >
               <Text style={styles.Topfive}>
               <Text style={styles.RankItem}>#{index+1}</Text>
               <Text style={styles.TextItem}> {item}</Text> 
              </Text> 
            </View>  
          ))}
        </Block>
        <Loading 
          ref="loading"
          backgroundColor='transparent'
          borderRadius={5}
          size={70}
          imageSize={40}
          indicatorColor={nowTheme.COLORS.PRIMARY}
          easing={Loading.EasingType.ease}
        />
        <Block flex style={styles.View}>
          <PieChart
              data={data}
              width={width * 0.96}
              height={220}
              chartConfig={{
                  backgroundColor: "white",
                  backgroundGradientFrom: "white",
                  backgroundGradientTo: "white",
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => nowTheme.COLORS.PRIMARY,
                  labelColor: (opacity = 1) => nowTheme.COLORS.DEFAULT,
                  style: {
                      borderRadius: 20,
                  },
                  propsForDots: {
                      r: "6",
                      strokeWidth: "2",
                  }
              }}
          style={{
            borderRadius: 16,
          //   padding : 1
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="10"
          // absolute
        />
      </Block>
    </Block>
    );
  }
}

class Admin extends React.Component {
  render() {
    return (
      <Block>
       <Text>Admin</Text>
      </Block>
    );
  }
}

class User extends React.Component {
  render() {
    return (
      <Block>
       <Text>User</Text>
      </Block>
    );
  }
}
export default class Home extends React.Component {
  constructor() {
    super();
    this.state={
      type : '',
      list : [],
    }
  }
  
  UNSAFE_componentWillMount(){
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      firebase.database().ref(`users/`+firebase.auth().currentUser.uid+`/type`).on('value', snapshot => {
        this.setState({
          type : snapshot.val(),
        });
      });
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
  render() {
    const { navigation } = this.props;
    // if(this.state.type === "admin" ){
      return (
        
        <Block flex style = {{height: height * 0.82, flexDirection:'column'}}>
        <ScrollView>
          <Block center>
              <PieChartB />
              {/* <Block>
                  <PieChartB/>
              </Block>
              <Block row style = {{ justifyContent : "space-between",flex: 1,flexDirection:"row",justifyContent:'space-between'}} >
                
              </Block>   */}
              {/* <Admin/> */}
              </Block>
          </ScrollView>
        </Block> 
      );
    // }else{
    //   return(
    //     <Block flex center style={styles.home}>
    //       <User/>
    //    </Block>
    //   );
    // }
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
    justifyContent:'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight:30
  },
  View: {
    width: width * 0.98,
    justifyContent:'center',
    alignItems: 'center',
    marginTop : 30,
  },
  Picker : {
    alignItems : "flex-end",
    marginLeft : 20,
    marginTop : 10,
    marginRight : 45
  },
  TopfiveTitle:{
   fontFamily: 'montserrat-bold',
   fontSize:18,
   textTransform: 'uppercase',
   paddingBottom: 5, 
   marginTop:15, 
   marginLeft : 10
  },
  Topfive:{
    marginHorizontal: 30,
    marginTop:10,
    padding:10,
    borderColor:nowTheme.COLORS.PRIMARY,
    borderWidth:1,
    borderRadius:10,
   },
   TextItem:{
     color:nowTheme.COLORS.PRIMARY,
     fontFamily: 'montserrat-regular',
     backgroundColor:'#fff',
     padding:10,
     fontSize:16,
   },
   RankItem:{
     fontWeight: 'bold',
     fontSize: 18,
     backgroundColor:'transparent',
     backgroundColor:'#fff',
     color: '#2da7b352',
     fontFamily: 'montserrat-regular',
   }
});

