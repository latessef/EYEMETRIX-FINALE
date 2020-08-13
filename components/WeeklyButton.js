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
import {BarchartPerDay, BarchartPerDayStyles} from '../RapportStyles/BarChartDays';
import {WeeklyReport} from '../RapportStyles/WeeklyReport';
import { GlobalTableWeek } from '../RapportStyles/GlobalTableWeek';
import  {EmployesWeek} from '../RapportStyles/EmployesWeek';
import Icon from './Icon';

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 72) / 3;
import * as Print from 'expo-print';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import { element } from "prop-types";




var maxPeople = 10;

class WeeklyButton extends React.Component {

  constructor(props){
    super(props);
     Moment.suppressDeprecationWarnings = true;
    this.state={
      Nom : '', // nom du projet 
      Employes: [], // noms des employes
      OutBisEntry: [], // tableau des entrants out of business
      TotalEntryClient: 0, // nombre total des clients
      token:'',
      JoursFeries: [], // jours feries de la semaine courante
      Joursrepos: [], // jours de repos de la semaine courante
      WorksDay: [], // les jours de travail 
      EmployesNames: [], // les noms des employes
      EmpNumbWeek : [], 
      weekDays: [], // les jours de la semaine
    }
  }

  uploadPDF = async (uri, PDFName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = firebase.storage().ref().child("Rapports/"+firebase.auth().currentUser.uid+"/" + PDFName+".pdf");
    return ref.put(blob);
  }

  createPDF = async (html) => {
    try {
        const { uri } = await Print.printToFileAsync({ html });
        this.uploadPDF(uri,'test')
        console.log(uri)
        alert('Succés')
        return uri;
    } catch (err) {
        console.error(err);
    }
  };
  

  createAndSavePDF = async (html) => {
    try {
      const { uri } = await Print.printToFileAsync({ html });
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
      } else {
        const permission = await MediaLibrary.requestPermissionsAsync();
  
        if (permission.granted) {
          await MediaLibrary.createAssetAsync(uri);
          await sendPushNotification(this.state.token);
          console.log(uri)
        }
      }
  
    } catch (error) {
      console.error(error);
    }
  };


  UNSAFE_componentWillMount = async () =>{
        const { projet } = this.props;
        await firebase.database().ref(`users/`+firebase.auth().currentUser.uid+`/token`).on('value', snapshot => {
              this.setState({
                token : snapshot.val(),
              });
            });
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+projet+`/`).on('value', snapshot => {
          this.setState({
            Nom : snapshot.child('nom').val(),
          });
        });
        this.getWeekDays();
        this.getWeek();
        this.getJourFeries();
        this.getJoursRepos();
        this.getTableEmployes();
        this.getTotalEntry();
        this.getNumbOfEmp();
        this.getOutBisEntry();
  }
 
// les jours feries
  getJourFeries = async () => {
      const { date, projet } = this.props;
      const newArray = [];     
      var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/calendrierBusiness/JoursFeriers').orderByKey();
      query.once("value")
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            var mois = childSnapshot.key.slice(3,5)
            if(mois === date.slice(0,2)){
              if(childSnapshot.child('check').val() === true){
                var key = childSnapshot.key;
                newArray.push(key);
                this.setState({
                  JoursFeries: newArray,
                });
              }
            }
          });
        });
      
  }
// les jours de repos
  getJoursRepos = async () => {
    const { date, projet } = this.props;
    const newArray = [];     
    var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/calendrierBusiness/JoursRopos').orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if(childSnapshot.val() === true){
            var key = childSnapshot.key
            newArray.push(key);
            this.setState({
              Joursrepos: newArray,
             });
            }  
          });    
      });
    
  }
// recuperer les dates de la semaine courante
  getWeek = async () => {
    const { projet } = this.props;
    const week = [];
    var startofweek = Moment('07-07-2020','DD-MM-YYYY',true).local("fr").startOf('week');
    var dateOfday = Moment(startofweek).subtract(1,"d").local("fr")
    var compt = "";
    for (let i = 1; i< 8; i++) {
      var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/daily/').orderByKey();
            query.once("value")
              .then((snapshot) => {
                compt = Moment(dateOfday).add(i,"d").local().format('DD-MM-YYYY');    
                var dateday = Moment(compt,'DD-MM-YYYY',true).format();
                var nameday = Moment(dateday).locale("fr").format('dddd');
                nameday = nameday.charAt(0).toUpperCase() + nameday.slice(1);
                var obj;
                if (snapshot.hasChild(compt)){
                    var total = snapshot.child(compt).child('total').val()
                    obj = {'day': nameday, 'date': compt, 'entry': total}
                    week.push(obj)
                    if(total > maxPeople){
                      maxPeople = total;
                    }
                }
                else{
                      obj = {'day': nameday, 'date': compt, 'entry': 0}
                      week.push(obj)
                      
                }
               week.sort((a,b) => (a.date > b.date) ? 1 : -1)
                this.setState({
                  WorksDay: week,
                });
              })
    }
  }
  // 
      getStartOfweek = (date) => {
        var day = Moment(date,'DD-MM-YYYY',true).format();
        var startofweek = Moment(day).startOf('week');
        var dateOfday = Moment(startofweek).format('DD-MM-YYYY');
        //dateOfday = Moment(startofweek).add(1,"d").format('DD-MM-YYYY');    
        return dateOfday;   
    }

      getEndOfweek = (date) => {
        var day = Moment(date,'DD-MM-YYYY',true).format();
        var startofweek = Moment(day).startOf('week');
        var dateOfday = Moment(startofweek).format('DD-MM-YYYY');
        dateOfday = Moment(startofweek).add(6,"d").format('DD-MM-YYYY');    
        return dateOfday;   
      }

      getWeekDays = () => {
        const weekdate = [];
        var startofweek = Moment('07-07-2020','DD-MM-YYYY',true).local("fr").startOf('week');
        var dateOfday = Moment(startofweek).subtract(1,"d").local("fr")
        var compt = "";
        for (let i = 1; i< 8; i++) {
          compt = Moment(dateOfday).add(i,"d").local().format('DD-MM-YYYY');  
          var dateday = Moment(compt,'DD-MM-YYYY',true).format();
          var nameday = Moment(dateday).locale("fr").format('dddd');  
          nameday = nameday.charAt(0).toUpperCase() + nameday.slice(1);
          weekdate.push({'date': compt , 'day': nameday})
          this.setState({
            weekDays : weekdate,
          });
        }
        //console.log(weekdate)
      }


      getTableEmployes = () => {
        const { date, projet } = this.props;
        const newArray = [];
        const weekDays = this.state.weekDays;
        const names = [];
        var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/Employes/').orderByKey();
        // var num = 0;
        for( let i = 0; i<7 ; i++){
          query.once("value")
            .then((snapshot) => {
              if(snapshot.hasChild(weekDays[i].date)){
                snapshot.child(weekDays[i].date).forEach((childSnapshot) => {
                        var name = childSnapshot.key;
                        var FirstEntry = childSnapshot.child('FirstEntry').val();
                        var LastExit = childSnapshot.child('LastExit').val();
                        const obj = {'name' : name, 'date': weekDays[i].day, 'Entry': FirstEntry,'Exit': LastExit, 'day': weekDays[i].date}
                        newArray.push(obj);
                        if(!(names.includes(name))) {names.push(name)}
                        // num = num + 1;
                        this.setState({
                          Employes: newArray,
                          EmployesNames : names,
                          // EmpNumbWeek : num,
                        });
                //console.log(this.state.EmpNumbWeek);
                });
              }
          });
        }
      }

  getTotalEntry = async () => {
    const { date, projet } = this.props;
    const weekDays = this.state.weekDays;
    const newArray = [];
    var total = 0;
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/daily/').orderByKey();
    for( let i = 0; i<7 ; i++){
      query.once("value")
        .then((snapshot) => {
          if(snapshot.hasChild(weekDays[i].date)){
            total = snapshot.child(weekDays[i].date).val().total;
            newArray.push({'client': total , 'day': weekDays[i].day, 'date': weekDays[i].date})
          } 
          else{
            newArray.push({'client': 0 , 'day': weekDays[i].day, 'date': weekDays[i].date})
          }
          newArray.sort((a,b) => (a.date > b.date) ? 1 : -1)
          this.setState({
            TotalEntryClient: newArray,
          })
         // console.log(this.state.TotalEntryClient);
        })  
      }
  }

  getNumbOfEmp = () => {
    const { date, projet } = this.props;
    const weekDays = this.state.weekDays;
    const newArray = [];
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/Employes/').orderByKey();
    for( let i = 0; i<7 ; i++){
      query.once("value")
        .then((snapshot) => {
          if(snapshot.hasChild(weekDays[i].date)){
            var num = snapshot.child(weekDays[i].date).numChildren();
            newArray.push({'employes': num , 'day': weekDays[i].day, 'date': weekDays[i].date})
          }
          else{
            newArray.push({'employes': 0 , 'day': weekDays[i].day, 'date': weekDays[i].date})
          }
          newArray.sort((a,b) => (a.date > b.date) ? 1 : -1)
          this.setState({
            EmpNumbWeek : newArray,
          })
         // console.log(this.state.EmpNumbWeek)
        })
      }
  }


  getOutBisEntry = () => {
    const { date, projet } = this.props;
    const weekDays = this.state.weekDays;
    const newArray = [];
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/AccesOutOfBis/').orderByKey();
    for( let i = 0; i<7 ; i++){
      query.once("value")
        .then((snapshot) => {
          if(snapshot.hasChild(weekDays[i].date)){
            var day = weekDays[i].date;
            var dateday = Moment(day,'DD-MM-YYYY',true).format();
            var nameday = Moment(dateday).locale("fr").format('dddd');  
            nameday = nameday.charAt(0).toUpperCase() + nameday.slice(1);
            snapshot.child(weekDays[i].date).forEach((childSnapshot) => {
                var name = childSnapshot.key;
                var Entry = ' à '+childSnapshot.val();
                const obj = {'name' : name, 'Entry': Entry , 'day': nameday, 'date': day}
                newArray.push(obj);
                this.setState({
                  OutBisEntry: newArray,
            })
          });
         // console.log(this.state.OutBisEntry)
        }
        });
      }
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
            title="Weekly report"
            titleStyle = {{color : 'black', fontSize: 13, paddingLeft : 10}}
            containerStyle  = {{width: width - 36, paddingVertical : 20, paddingTop : 30 }}
            onPress =  {() => 
                this.createAndSavePDF(
                    WeeklyReport (this.getStartOfweek(date),this.getEndOfweek(date), this.state.Nom,
                    BarchartPerDay(this.state.WorksDay,maxPeople,this.state.Joursrepos,this.state.JoursFeries),
                    BarchartPerDayStyles(this.state.WorksDay.length),
                    EmployesWeek(this.state.Employes,this.state.weekDays,this.state.EmployesNames),
                    GlobalTableWeek(this.state.EmpNumbWeek,
                                this.state.TotalEntryClient,
                                this.state.OutBisEntry,this.state.weekDays))
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

export default  WeeklyButton;
