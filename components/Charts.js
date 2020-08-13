import React from "react";
import { StyleSheet, Dimensions,TouchableOpacity, Text, View} from "react-native";
import { Block} from "galio-framework";
import { nowTheme } from '../constants';
import {Icon} from '../components'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from "../database/firebase"
import {
  LineChart,
} from "react-native-chart-kit";
import Loading from 'react-native-whc-loading';
// import MonthPicker from 'react-native-month-year-picker';
import WeekSelector from 'react-native-week-selector';
import 'moment/locale/fr';
import Moment from 'moment';
import {NumbersCard} from '../components';

const { width } = Dimensions.get("screen");
var moyenneJr = 0;
var total = 0;
export class LineChartB extends React.Component{
    constructor (props){
        super(props);
        //changemen de la langue pour les dates 
        Moment.locale('fr');

        //initialisation des variables
        this.state = {
            show : false,
            timeStart : Moment(new Date()).subtract(1, "d").format("DD-MM-YYYY"),
            time : Moment(new Date()).subtract(1, "d").format("DD-MM-YYYY"), // yesterday
            label: [],
            list : [0],
            used : true,
            totalJr : 0,
            moyenneJr : 0, 
            hrPick : '--',
            jrPick : '--',
        }
    }

    UNSAFE_componentWillMount = async () =>{
      this.getInformation();
    }

    // recuperer les infos a chaque mis a jour du date
    componentDidUpdate = async () => {
      if (this.state.used  === false){
        this.refs.loading.show();
        await this.getInformation();
        this.setState({
          used : true
        })
        setTimeout(() => {
          this.refs.loading.close();
        },500);    
      }
    }

    //calcule des statistiques de l'hebdomadaire
    calculeWeekly = async (compt) =>{
      total = 0;
      const {_id} = this.props;
      var cmt = 0;
      //calcule de la moyenne des jours de toute la semaine du lundi a dimanche
      if(compt != undefined){
        var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+'/daily/'+compt+'/total/').orderByKey();
        query.on("value", snapshot => {
          if(snapshot.val() != null){
              total = total + parseInt(snapshot.val(), 10);
              moyenneJr = Math.trunc(total / 7);
          }
        });
        //recuperation l'heure et le jour de pick de la semaine
        query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+'/daily/'+compt+'/').orderByKey();
        query.once("value")
          .then((snapshot) => {
            if(snapshot.val() != null){
              snapshot.forEach((childSnapshot) => {
                var time = childSnapshot.key;
                if(time != "total"){
                  if(childSnapshot.val() > cmt){
                    cmt = childSnapshot.val();
                    var tmp = Moment(compt,'DD-MM-YYYY',true).format();
                    this.setState({
                      hrPick : time,
                      jrPick : Moment(tmp).format("dddd")
                    })
                  }
                }
              });
            }else{
              this.setState({
                hrPick : "--",
                jrPick : "--"
              })
            }
        });
      }
    }

    //calcule des statistiques du quotidien et mensuel
    calcule = () =>{
      const {abscisse, _id} = this.props;
      var cmt = 0;
      total = 0;
      moyenneJr = 0;
      var som = 0;
      //verifier s'il est le quotidien
      if(abscisse === "Quotidien"){
        //recuperation d'heure de pick du jour courant
        var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+'/daily/'+this.state.time+'/').orderByKey();
        query.once("value")
          .then((snapshot) => {
            if(snapshot.val() != null){
              snapshot.forEach((childSnapshot) => {
                var time = childSnapshot.key;
                if(time != "total"){
                  if(childSnapshot.val() >= cmt){
                    cmt = childSnapshot.val();
                    this.setState({
                      hrPick : time,
                    })
                  }
                }
              });
            }else{
              this.setState({
                hrPick : "--",
              })
            }
        });
        //calcule de la moyenne des jours de tout le mois
        query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+'/daily/'+this.state.time+'/total').orderByKey();
        query.once("value")
          .then((snapshot) => {
            this.setState({
              totalJr : snapshot.val(),
            })
          });
      }else if (abscisse === "Mensuel"){
        total = 0;
        var month = Moment(this.state.timeStart,'DD-MM-YYYY',true).format();
        //calcule de la moyenne des 
        var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+_id+'/daily/').orderByKey();
        query.once("value")
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            var date_ = Moment(childSnapshot.key,'DD-MM-YYYY',true).format();
            if(Moment(date_).format('MM-YYYY') === Moment(month).format('MM-YYYY')){
                som = som + parseInt(childSnapshot.child("total").val(), 10);
                total = som;
                var value = Moment(childSnapshot.key,"DD-MM-YYYY").daysInMonth();
                moyenneJr = Math.trunc(total / value);
            }
          })
        });
        //recuperation d'heure et jour de pick du mois courant
        var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+_id+'/daily/').orderByKey();
        query.once("value")
          .then((snapshot) => {
            if(snapshot.val() != null){
              var cmt = 0;
              snapshot.forEach((childSnapshot) => {
                var date_ = Moment(childSnapshot.key,'DD-MM-YYYY',true).format();
                if(Moment(date_).format('MM-YYYY') === Moment(month).format('MM-YYYY')){ 
                  childSnapshot.forEach((grindChildSnapshot) => {
                    var time = grindChildSnapshot.key;
                    if(time != "total"){
                      if(grindChildSnapshot.val() > cmt){
                        cmt = grindChildSnapshot.val();
                        this.setState({
                          hrPick : time,
                          jrPick : Moment(date_).format("dddd DD MMM")
                        })
                      }
                    }
                  });
                }
                else{  //sachant que le traitelent se fait en ordre des dates sinn il faut changer ce teste
                  this.setState({
                    hrPick : "--",
                    jrPick : "--",
                  })
                }
              });
            }else{
              this.setState({
                hrPick : "--",
                jrPick : "--",
              })
            }
        });
       }
       
    }

    //recuperation des données du l'hebdomadaire depuis firebase
    week = async (selected) => {
      const {_id} = this.props
      var ArrayTime = [];
      var ArrayFlux = [];
      var compt = "";
      total = 0;
      moyenneJr = 0;
      for(let i = 1; i <= 7; i++){
        compt = Moment(selected).add(i, "d").local().format("DD-MM-YYYY");
        this.calculeWeekly(compt);
        ArrayTime.push(compt);
        //recuperation de flux de chaque jour de la semaine courante
        var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+'/daily/'+compt+'/total/').orderByKey();
        query.once("value")
        .then((snapshot) => {
          if(snapshot.val() != null){
              var flux = snapshot.val();
              ArrayFlux.push(flux);
              this.setState({
                label: ArrayTime,
                list : ArrayFlux,
              });
          }
        }).catch(() => {
            this.setState({
              label: [],
              list : [0],
            })
        });
      }
    }

    //la fonction des cartes statistiques selon chaque périodicité
    cards = () =>{
      const {abscisse} = this.props;
       return(
        <View >
          {abscisse === "Quotidien" && (
            <Block row style = {{ justifyContent :"space-around" ,flex: 1, flexDirection:"row"}}>
              <Block style = {{padding : 5}}>
                <NumbersCard titre="Total du jour" valeur = {this.state.totalJr}/>
              </Block>
              <Block style = {{padding : 5}}>
                <NumbersCard titre="Heure pick" valeur = {this.state.hrPick}/>
              </Block>
            </Block>
          )}
          {abscisse === "Hebdomadaire" && (
            <Block row  center style = {{ justifyContent : "space-around",flex: 1,flexDirection:"row"}}>
              <Block style = {{padding : 5}}>
                <NumbersCard titre="Moyenne jour" valeur = {moyenneJr}/>
              </Block>
              <Block style = {{padding : 5}}>
                <NumbersCard titre="Heures de pick" valeur = {this.state.hrPick}/>
              </Block>
              <Block style = {{padding : 5}}>
                <NumbersCard titre="Jour de pick" valeur = {this.state.jrPick}/>
              </Block>
            </Block>
          )}
          {abscisse === "Mensuel" && (
            <Block row center style = {{ justifyContent : "space-around",flex: 1,flexDirection:"row"}}>
              <Block style = {{padding : 5}}>
                <NumbersCard titre="Moyenne/jours" valeur = {moyenneJr}/>
              </Block>
              <Block style = {{padding : 5}}>
                <NumbersCard titre="Heures de pick" valeur =  {this.state.hrPick}/>
              </Block>
              <Block style = {{padding : 5}}>
                <NumbersCard titre="Jour de pick" valeur = {this.state.jrPick}/>
              </Block>
            </Block>
          )}
        </View>
      );
    }

    //recuperation de flux de chaque jour pour le quotidien et le mensuel
    getInformation = async () =>{
      const {abscisse, _id} = this.props;
      var ArrayTime = [];
      var ArrayFlux = [];
      if(abscisse === "Quotidien"){
        var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+'/daily/'+this.state.time+'/').orderByKey();
        query.once("value")
          .then((snapshot) => {
              snapshot.forEach((childSnapshot) => {
                var time = childSnapshot.key;
                var flux = childSnapshot.val();
                if(time != 'total'){
                  ArrayTime.push(time);
                  ArrayFlux.push(flux);
                }
              });
              if(ArrayTime.length != 0){
                this.setState({
                  label: ArrayTime,
                  list : ArrayFlux
                });
              }
        }).catch(() => {
            this.setState({
              label: [],
              list : [0],
            })
        });
      }else if(abscisse === "Mensuel"){
        var month = Moment(this.state.timeStart,'DD-MM-YYYY',true).format();
        var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+_id+'/daily/').orderByKey();
        query.once("value")
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var date_ = Moment(childSnapshot.key,'DD-MM-YYYY',true).format();
              if(Moment(date_).format('MM-YYYY') === Moment(month).format('MM-YYYY')){
                var time = Moment(date_).format('DD');
                var flux = childSnapshot.child("total").val();
                ArrayTime.push(time);
                ArrayFlux.push(flux);
              }
            })
            if(ArrayTime.length != 0){
              this.setState({
                label: ArrayTime,
                list : ArrayFlux
              });
            }
        }).catch(() => {
          this.setState({
            label: [],
            list : [0],
          })
        });
      }
      this.calcule();
    }
    
    //l'affichage de date picker
    showMode = () => {
        this.setState({show : true});
    };

    //fermeture de date picker
    hideDatePicker = () =>{
        this.setState({show : false});
    };
    
    handleConfirm = (date) => {
        const currentTime = date || this.state.timeStart
        this.setState({show : Platform.OS === 'ios'});
        this.setState({
          timeStart : Moment(currentTime).format('DD-MM-YYYY'),
          time : Moment(currentTime).format('DD-MM-YYYY'),
          show : false,
          used : false,
          label: [""],
          list : [0],
        });
    };
    showTime = () =>{
      const {abscisse} = this.props;
      var tmp = Moment(this.state.time,'DD-MM-YYYY',true).format();
      if(abscisse === "Quotidien"){
        return Moment(tmp).format('DD-MM-YYYY');
      }else if(abscisse === "Mensuel"){
        return Moment(tmp).format('MM-YYYY');
      }else{
        return this.state.time
      }
    }
    renderElement(){
      const {abscisse} = this.props;
      if(abscisse === "Quotidien" || abscisse === "Mensuel"){
        return(
            <View>
              <View style = {styles.Picker}>
                <TouchableOpacity onPress={this.showMode} style={styles.Input}>
                    <Text>{this.showTime()}</Text>
                    <Icon
                      size={12}
                      color="black"
                      name="caretdown"
                      family="antdesign"
                      style={{  
                        borderWidth: 1,
                        borderColor:"transparent",
                        borderRadius: 30
                      }}
                    />
                </TouchableOpacity>
              </View>
              <DateTimePickerModal
                isVisible={this.state.show}
                mode="date"
                is24Hour={true}
                display="spinner"
                onConfirm={this.handleConfirm}
                onCancel={this.hideDatePicker}
              />
          </View>
        );
      }else if(abscisse === "Hebdomadaire"){
        return (
          <View style = {styles.Picker}>
            <WeekSelector
              dayFormat="DD"
              monthFormat= "/MM"
              onWeekChanged ={this.week}
            />
          </View>
        );
      }else{
        return this.state.time
      }
   }
    render(){
      if(this.state.label != null && this.state.list){
        var data = {
          labels: this.state.label,
          datasets: [
            {
              data: this.state.list
            }
          ]
        }
      }else{
        var data = {
          labels: [""],
          datasets: [
            {
              data: [0]
            }
          ]
        }
      }
      return(
        <Block >
            <Loading 
              ref="loading"
              backgroundColor='transparent'
              borderRadius={5}
              size={70}
              imageSize={40}
              indicatorColor={nowTheme.COLORS.PRIMARY}
              easing={Loading.EasingType.ease}
            />
            {this.cards()}
            {this.renderElement()}
            <Block center  style={styles.View}>
              <LineChart
                data={data}
                width={width * 0.96} // from react-native
                height={250}
                // yAxisLabel="$"
                // yAxisSuffix="k"
                yAxisInterval={1} // optional, defaults to 1
                chartConfig={{
                  backgroundColor: "white",
                  backgroundGradientFrom: "white",
                  backgroundGradientTo: "white",
                  decimalPlaces: 0, // optional, defaults to 2dp
                  color: () => nowTheme.COLORS.PRIMARY,
                  labelColor: () => nowTheme.COLORS.DEFAULT,
                  style: {
                    borderRadius: 20,
                    borderColor : 'black'
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                  }
                }}
                style={{
                  borderRadius: 16,
                  fontSize:2,
                }}
                verticalLabelRotation={60}
                showValuesOnTopOfBars
                withVerticalLabels = {10}
            />
          </Block>
        </Block>
  
      );
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
    marginTop : 20,
    marginRight : 45
  },
  Input : { 
      borderColor: 'black',
      borderWidth : 0.2,
      width : width * 0.32,
      height: 35, 
      alignItems : 'center', 
      justifyContent: 'space-around', 
      borderRadius : 5,
      flexDirection : "row",
  },
  Picker : {
    alignItems : "flex-end",
    marginRight : 20,
    marginTop : 10,
    marginRight : 45
  }
  });
  