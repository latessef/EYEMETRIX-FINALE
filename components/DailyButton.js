import React from "react";
import { StyleSheet, Dimensions,View,Alert,TouchableOpacity,Vibration, Platform,PermissionsAndroid} from "react-native";
import { Block} from "galio-framework";
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import { Images, nowTheme } from '../constants';
import firebase from '../database/firebase';
import { Notifications } from 'expo';
import { Button } from 'react-native-elements';
import Moment from 'moment';
import 'moment/locale/fr';
import {sendPushNotification} from '../screens/Notifunction';
import {BarchartPerHourStyles,BarchartPerHour} from '../RapportStyles/BarChartHours';
import {DailyReport} from '../RapportStyles/DailyReport';
import { tableEmployes } from '../RapportStyles/Employes';
import { GlobalTable } from '../RapportStyles/GlobalTable';
import Icon from './Icon';

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 72) / 3;
import * as Print from 'expo-print';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";



// max des entrants
var maxPeople = 10;

class DailyButton extends React.Component {

  constructor(props){
    super(props);
    this.state={
      Nom : '', // nom du projet
      chosen: 1, // pour les horaires de travail (par jour ou par semaine)
      BarchartPerHour: [], // tableau des entrants par heure
      Employes: [], // tableau des employés
      OutBisEntry: [], // tableau des entrants out of business
      BarchartPerHourStyles: '', // style chart
      HoursTable: [], //
      TotalEntryClient: 0, // entrants
      token:'', // token pour l'envoi des notifs
    }
  }

  // Creation du pdf et sa sauvegarde
  createAndSavePDF = async (html) => {
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
      } 
      else {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
          await MediaLibrary.createAssetAsync(uri);
          // send notification
          await sendPushNotification(this.state.token);
          //console.log(uri)
        }
      }
  
    } catch (error) {
     // console.error(error);
    }
  };


  UNSAFE_componentWillMount = async () =>{
        const { date, projet } = this.props;
        //  recuperation du token device from firebase
        await firebase.database().ref(`users/`+firebase.auth().currentUser.uid+`/token`).on('value', snapshot => {
              this.setState({
                token : snapshot.val(),
              });
            });
        // recuperation du nom du projet
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+projet+`/`).on('value', snapshot => {
          this.setState({
            Nom : snapshot.child('nom').val(),
          });
        });
        this.getNumberEntry();
        this.getWorkHours();
        this.getTableEmployes();
        this.getTotalEntry();
        this.getOutBisEntry();
  }
 // le nombre d'entrants par heure
  getNumberEntry = async() =>{
      const { date, projet } = this.props;
      var ArrayFlux = [];
      var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+projet+'/daily/'+date+`/`).orderByKey();
            query.on("value", snapshot => {
                ArrayFlux = [];
                snapshot.forEach((childSnapshot) => {
                  var time = childSnapshot.key; // heure de travail
                  var flux = childSnapshot.val();
                  if(time != 'total'){
                    ArrayFlux.push(flux);
                    // maximum des personnes entrantes
                    if(flux > maxPeople)
                    {
                      maxPeople = flux;
                    }
                  }
                  this.setState({
                    BarchartPerHour : ArrayFlux
                  });
                });
          })
  }
 // recuperer les heures de tarvail
  getWorkHours = async () => {
      const { date, projet } = this.props;
      var chosen ;
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+projet+'/calendrierBusiness/Horaires/').on('value', snapshot => {
        if(snapshot.child('chosen').val()=== true){
          chosen = 1; // pour les horaires par jour
        }
        else {
          chosen = 2; // pour les horaires par semaine
        }
        this.setState({
          chosen : chosen,
        })
      });
      // Horaires
      if(this.state.chosen === 1){
          //** recupere les noms des jours */
          var dateSd = Moment(date,'DD-MM-YYYY',true).format();
          var name = Moment(dateSd).locale("fr").format('dddd');
          var jour = name.charAt(0).toUpperCase() + name.slice(1);
          //** */ 
          var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+projet+'/calendrierBusiness/Horaires/').orderByKey();
            query.once("value")
            .then((snapshot) => {
              snapshot.forEach((childSnapshot) => {
                if(childSnapshot.key === jour){
                  // recuperer les horaires de travail pour chaque jour (debut et fin)
                  var temp = childSnapshot.child("Matin").child("debut").val();
                  var hdm = parseInt(temp.charAt(1) == ':'? temp.charAt(0): temp.slice(0,2))
                  temp = childSnapshot.child("Matin").child("fin").val();
                  var hfm = parseInt(temp.charAt(1) == ':'? temp.charAt(0): temp.slice(0,2))
                  temp = childSnapshot.child("ApresMidi").child("debut").val();
                  var hda = parseInt(temp.charAt(1) == ':'? temp.charAt(0): temp.slice(0,2))
                  temp = childSnapshot.child("ApresMidi").child("fin").val();
                  var hfa = parseInt(temp.charAt(1) == ':'? temp.charAt(0): temp.slice(0,2))
                  temp = childSnapshot.child("Soir").child("debut").val();
                  var hds = parseInt(temp.charAt(1) == ':'? temp.charAt(0): temp.slice(0,2))
                  temp = childSnapshot.child("Soir").child("fin").val();
                  var hfs = parseInt(temp.charAt(1) == ':'? temp.charAt(0): temp.slice(0,2))
                  for (let i = hdm; i <= hfm; i++){
                    this.setState({
                      HoursTable : [...this.state.HoursTable,i]
                    });
                  }
                  for (let i = hda; i <= hfa; i++){
                    this.setState({
                      HoursTable : [...this.state.HoursTable,i]
                    });
                  }
                  for (let i = hds; i <= hfs; i++){
                    this.setState({
                      HoursTable : [...this.state.HoursTable,i]
                    });
                  }
                }
              })
          })
      }
  }

  // Recuperer  les employés avec leurs premieres entrees et dernieres sorties
  getTableEmployes = () => {
    const { date, projet } = this.props;
    const newArray = [];
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/Employes/'+date+'/').orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var key = childSnapshot.key;
          var FirstEntry = childSnapshot.child('FirstEntry').val();
          var LastExit = childSnapshot.child('LastExit').val();
          const obj = {'name' : key, 'FirstEntry': FirstEntry,'LastExit': LastExit}
          newArray.push(obj);
          this.setState({
            Employes: newArray,
          });
        });
        //console.log(this.state.Employes)
      });
  }
 // Recupere le nombre total des entrants
  getTotalEntry = async () => {
    const { date, projet } = this.props;
    await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+projet+'/daily/'+date+'/').on('value', snapshot => {
       this.setState({
         TotalEntryClient: snapshot.child('total').val(),
       })
    })
  }
 // les entrants hors horaires de travail
  getOutBisEntry = () => {
    const { date, projet } = this.props;
    const newArray = [];
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/AccesOutOfBis/'+date+'/').orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var key = childSnapshot.key;
          var Entry = 'à '+childSnapshot.val();
          const obj = {'name' : key, 'Entry': Entry}
          newArray.push(obj);
          this.setState({
            OutBisEntry: newArray,
          });
        });
      });
  }
 
  render() {
    
    const { date, projet } = this.props;
   
    return (
      
      <Block style={styles.home}>
           <Button
              icon={
              <Icon
                name="download"
                family="Entypo"
                size={23}
                color= 'black'
                />}
              type="clear"
              title="Daily report"
              titleStyle = {{color : 'black', fontSize: 13, paddingLeft : 10}}
              containerStyle  = {{width: width - 36, paddingVertical : 20, paddingTop : 30 }}
              onPress =  {() => 
                  this.createAndSavePDF(
                      DailyReport (date, this.state.Nom,
                      BarchartPerHour(this.state.BarchartPerHour,maxPeople,date,this.state.HoursTable),
                      BarchartPerHourStyles(this.state.BarchartPerHour.length),
                      tableEmployes(this.state.Employes),
                      GlobalTable(this.state.Employes.length,this.state.TotalEntryClient,this.state.OutBisEntry))
                    )
              }
            />
      </Block>
      
    );
  }
}

const styles = StyleSheet.create({
    home: {
        width: width
      },
});

export default DailyButton;
