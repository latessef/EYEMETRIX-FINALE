import React from "react";
import { StyleSheet, Dimensions,View,Alert,TouchableOpacity,Vibration, Platform,PermissionsAndroid} from "react-native";
import { Block} from "galio-framework";
import { Images, nowTheme } from '../constants';
import firebase from '../database/firebase';
import { Notifications } from 'expo';
import { Button } from 'react-native-elements';
import Moment from 'moment';
import 'moment/locale/fr';
import {sendPushNotification} from '../screens/Notifunction';
import {BarchartPerMonth, BarchartPerMonthStyles} from '../RapportStyles/BarChartMonth';
import {MonthlyReport} from '../RapportStyles/MonthlyReport';
import { GlobalTable } from '../RapportStyles/GlobalTable';
import  {EmployesMonth} from '../RapportStyles/EmployesMonth';
import Icon from './Icon';

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 72) / 3;
import * as Print from 'expo-print';
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";
import { Asset } from "expo-asset";

var maxPeople = 10;

class MonthlyButton extends React.Component {

  constructor(props){
    super(props);
     Moment.suppressDeprecationWarnings = true;
    this.state={
      Nom : '',
      Employes: [],
      OutBisEntry: [],
      BarchartPerHourStyles: '',
      HoursTable: [],
      TotalEntryClient: 0,
      token:'',
      JoursFeries: [],
      Joursrepos: [],
      DateJoursRepos: [],
      WorksDay: [],
      MonthDay: [],
      EmployesNames: [],
      EmpNumbMonth : 0,
      getDaysOfWorkEmps: [],
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

 copyFromAssets = async (asset) => {
    try {
      await Asset.loadAsync(asset);
      const { localUri } = Asset.fromModule(asset);
  
      return localUri;
    } catch (error) {
      console.log(error);
      throw err;
    }
  };
  
  
 processLocalImageIOS = async (imageUri) => {
    try {
      const uriParts = imageUri.split(".");
      const formatPart = uriParts[uriParts.length - 1];
      let format;
  
      if (formatPart.includes("png")) {
        format = "png";
      } else if (formatPart.includes("jpg") || formatPart.includes("jpeg")) {
        format = "jpeg";
      }
  
      const { base64 } = await ImageManipulator.manipulateAsync(
        imageUri,
        [],
        { format: format || "png", base64: true }
      );
      if(Platform.OS === 'ios') {
        return `data:image/${format};base64,${base64}`;
      }
      else{
        return `file://path-to-file/${format}`;
      }
    } catch (error) {
      console.log(error);
      throw error
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
        this.getJourFeries();
        this.getJoursRepos();
        this.getWorksDay();
        this.getTableEmployes();
        this.getTotalEntry();
        this.getOutBisEntry();
  }
 

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
                var key = childSnapshot.key.charAt(0) === '0' ? childSnapshot.key.slice(1,2) : childSnapshot.key.slice(0,2);
                newArray.push(key);
                this.setState({
                  JoursFeries: newArray,
                });
              }
            }
          });
        });
      
  }

  getJoursRepos = async () => {
    const { date, projet } = this.props;
    const newArray = [];     
    var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/calendrierBusiness/JoursRopos').orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          if(childSnapshot.val() === true){
            var key = childSnapshot.key.charAt(0).toLowerCase() + childSnapshot.key.slice(1);
            newArray.push(key);
            this.setState({
              Joursrepos: newArray,
            });
            }  
              });
              
              var mois = parseInt(date.charAt(0)=== 0 ? date.slice(1,2): date.slice(0,2));
              //console.log('mois',mois)
              var year = parseInt(date.slice(3));
              var table= [];
                  var NbjoursM = new Date(year, mois, 0).getDate();
                  // pour les jours de 1 a 9
                  for (let i = 1; i <= 9; i++){
                    if(mois <= 9){ var jour = Moment(year+'-0'+mois+'-'+'0'+i).local("fr").format('dddd');}
                    else {var jour = Moment(year+'-'+mois+'-'+'0'+i).local("fr").format('dddd');}
                      if(this.state.Joursrepos.includes(jour)){
                        table.push(i.toString())
                      } 
                  }
                  // pour les jours de 10 a 31
                  for (let i = 10; i <= NbjoursM; i++){
                      var jour = Moment(year+'-0'+mois+'-'+i).local("fr").format('dddd');
                      if(this.state.Joursrepos.includes(jour)){
                          table.push(i.toString())
                      }
                  }
                  this.setState({
                    DateJoursRepos: table,
                  });
      //console.log('Repos',this.state.DateJoursRepos)
      });
    
  }

  getWorksDay = async () => {
    const { date, projet } = this.props;
    const newArray = [];    
    var NbjoursM = new Date(date.slice(3), date.slice(0,2), 0).getDate();
    for(let i = 1 ; i<= NbjoursM; i++){
      newArray.push({'date' : i.toString(), 'entry': 0})
    }
    var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/daily/').orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
           var mois = childSnapshot.key.slice(3);
           if(mois === date){
              var key = childSnapshot.key.charAt(0) === '0' ? childSnapshot.key.slice(1,2) : childSnapshot.key.slice(0,2);
              var entry = childSnapshot.child('total').val();
              const obj = {'date' : key, 'entry': entry}
              newArray.splice(key-1, 0, obj);
              this.setState({
                WorksDay: newArray,
              });
              if(entry > maxPeople)
                    {
                      maxPeople = entry;
                    }
           }
        });
      });
    
}
  getTableEmployes = () => {
    const { date, projet } = this.props;
    const newArray = [];
    const MonthDay = [];
    const names = [];
    const newArray2 = [];
    var mois = date.charAt(0) === '0' ? date.slice(1,2) : date.slice(0,2);
    var NbjoursM = new Date(date.slice(3), date.slice(0,2), 0).getDate();
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/Employes/').orderByKey();
    query.once("value")
      .then((snapshot) => {
        var num = 0;
        snapshot.forEach((childSnapshot) => {
          var moisDB = childSnapshot.key.slice(3);
          var key = childSnapshot.key.charAt(0) === '0' ? childSnapshot.key.slice(1,2) : childSnapshot.key.slice(0,2)
          if(moisDB === date){
              MonthDay.push(key)
              childSnapshot.forEach((Gchildsnapshot) =>{
                var name = Gchildsnapshot.key;
                var FirstEntry = Gchildsnapshot.child('FirstEntry').val();
                var LastExit = Gchildsnapshot.child('LastExit').val();
                const obj = {'name' : name, 'date': key, 'Entry': FirstEntry,'Exit': LastExit}
                newArray.push(obj);
                if(!(names.includes(name))) {names.push(name)}
                num = num + 1;
              })
              this.setState({
                Employes: newArray,
                MonthDay : MonthDay,
                EmployesNames : names,
                EmpNumbMonth : num,
              });
             
         }
        });
        //console.log('****************************')
        names.forEach (name => {
       
         var compt = 0;
         query.once("value")
         .then((snapshot) => {
           snapshot.forEach((childSnapshot) => {
             var mois = childSnapshot.key.slice(3);
             if (mois === date){
               if(childSnapshot.hasChild(name)){
                 compt = compt + 1
               }
             }
           }) 
           newArray2.push({'name': name, 'work': compt, 'Nowork': NbjoursM-compt}) 
           this.setState({ getDaysOfWorkEmps : newArray2})
          //  console.log('emp: ',this.state.getDaysOfWorkEmps)
          //  console.log('****************************')
         })  
       })
      });
  }


  getTotalEntry = async () => {
    const { date, projet } = this.props;
    var total = 0;
    await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+projet+'/daily/').on('value', snapshot => {
      snapshot.forEach( (childSnapshot) => {
        var moisDB = childSnapshot.key.slice(3);
        if(moisDB === date){
          total = total + childSnapshot.child('total').val();
        }
        this.setState({
          TotalEntryClient: total,
        })
      })
      // console.log(this.state.TotalEntryClient);
    })
  }


  getOutBisEntry = () => {
    const { date, projet } = this.props;
    const newArray = [];
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+'/'+projet+'/AccesOutOfBis/').orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var moisDB = childSnapshot.key.slice(3);
          var day = childSnapshot.key
          if(moisDB === date){
            childSnapshot.forEach((Gchildsnapshot) =>{
            var name = Gchildsnapshot.key;
            var Entry = 'le '+ day+ ' à '+Gchildsnapshot.val();
            const obj = {'name' : name, 'Entry': Entry}
            newArray.push(obj);
            this.setState({
              OutBisEntry: newArray,
            });
         })
        }
        });
        //console.log(this.state.OutBisEntry)
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
            title="Monthly report"
            titleStyle = {{color : 'black', fontSize: 13, paddingLeft : 10}}
            containerStyle  = {{width: width - 36, paddingVertical : 20, paddingTop : 30 }}
            onPress =  {() => 
                this.createAndSavePDF(
                    MonthlyReport (date, this.state.Nom,
                    BarchartPerMonth(this.state.WorksDay,maxPeople,this.state.DateJoursRepos,this.state.JoursFeries,date),
                    BarchartPerMonthStyles(this.state.WorksDay.length),
                    EmployesMonth(this.state.Employes,this.state.MonthDay,this.state.EmployesNames,this.state.getDaysOfWorkEmps),
                    GlobalTable(this.state.EmpNumbMonth,this.state.TotalEntryClient,this.state.OutBisEntry)
                    )
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

export default  MonthlyButton;
