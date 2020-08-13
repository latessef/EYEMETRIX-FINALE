import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Dimensions, Modal
} from 'react-native';
import {CalendarList, LocaleConfig} from 'react-native-calendars';
import { Block, Text} from 'galio-framework';
import { nowTheme } from '../constants';
import firebase from "../database/firebase";
import Moment from 'moment';
import Icon from '../components/Icon';
import 'moment/locale/fr';



LocaleConfig.locales['fr'] = {
    monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin','Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
    dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
    dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
    today: 'Aujourd\'hui'
  };
LocaleConfig.defaultLocale = 'fr';

const { width, height } = Dimensions.get('screen');


export default class calendar extends Component {

  
  constructor(){
    super();
    Moment.locale('fr');
    this.state = { 
      date:'',
      name:'',
      type:'',
      janvier_1 : '', 
      janvier_11 : '', 
      mai_1 : '', 
      juillet_30 : '', 
      aout_14 : '', 
      aout_20 : '', 
      aout_21 : '', 
      novembre_6 : '', 
      novembre_18 : '',
      modalVisible: false,
      repos: [],
      selecteddate: '',
      markedDates: {},
      dayPressed: new Date(),
     }
    }
    
    UNSAFE_componentWillMount = async () =>
    {
      const {navigation} = this.props;
      const id_1 = navigation.getParam('id');
      console.log('id: ',id_1)
     
     if(id_1 != undefined){
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+Moment('2020-01-01').format('DD-MM-YYYY')).once('value', snapshot => {
        if(snapshot.val().check === true){
          this.setState({janvier_1 : '#a30a85'});  
          
        }
        else{
          this.setState({janvier_1 : '#069294'}); 
        }
      });
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+Moment('2020-05-01').format('DD-MM-YYYY')).once('value', snapshot => {
        if(snapshot.val().check === true){
            this.setState({mai_1 : '#a30a85'});  
          }
          else{
            this.setState({mai_1 : '#069294'}); 
        }
      });
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+Moment('2020-01-11').format('DD-MM-YYYY')).once('value', snapshot => {
        if(snapshot.val().check === true){
            this.setState({janvier_11 : '#a30a85'});  
          }
          else{
            this.setState({janvier_11 : '#069294'}); 
          } 
    });
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+Moment('2020-07-30').format('DD-MM-YYYY')).once('value', snapshot => {
        if(snapshot.val().check === true){
          this.setState({juillet_30 : '#a30a85'});  
        }
        else{
          this.setState({juillet_30 : '#069294'}); 
        } 
      });
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+Moment('2020-08-14').format('DD-MM-YYYY')).once('value', snapshot => {
        if(snapshot.val().check === true){
          this.setState({aout_14 : '#a30a85'});  
        }
        else{
          this.setState({aout_14 : '#069294'}); 
        } 
      });
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+Moment('2020-08-20').format('DD-MM-YYYY')).once('value', snapshot => {
        if(snapshot.val().check === true){
          this.setState({aout_20 : '#a30a85'});  
        }
        else{
          this.setState({aout_20 : '#069294'}); 
        } 
      });
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+Moment('2020-08-21').format('DD-MM-YYYY')).once('value', snapshot => {
        if(snapshot.val().check === true){
          this.setState({aout_21 : '#a30a85'});  
        }
        else{
          this.setState({aout_21 : '#069294'}); 
        } 
      });
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+Moment('2020-11-06').format('DD-MM-YYYY')).once('value', snapshot => {
        if(snapshot.val().check === true){
          this.setState({novembre_6 : '#a30a85'});  
        }
        else{
          this.setState({novembre_6 : '#069294'}); 
        } 
      });
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+Moment('2020-11-18').format('DD-MM-YYYY')).once('value', snapshot => {
        if(snapshot.val().check === true){
          this.setState({novembre_18 : '#a30a85'});  
        }
        else{
          this.setState({novembre_18 : '#069294'}); 
        } 
      });
      //this.getJoursFeriers();
      this.getJoursRepos(id_1);  
    }       
    }

    // recuperer les noms des jours de repos
    getJoursRepos = async (id) => {
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursRopos/Lundi`).once('value', snapshot => {
          if(snapshot.val() === true){
            this.setState({
              repos: [...this.state.repos,'lundi'],
            })
          }   
      });
      await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursRopos/Mardi`).once('value', snapshot => {
        if(snapshot.val() === true){
          this.setState({
            repos: [...this.state.repos,'mardi'],
          })
        }   
    });
    await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursRopos/Mercredi`).once('value', snapshot => {
      if(snapshot.val() === true){
        this.setState({
          repos: [...this.state.repos,'mercredi'],
        })
      }   
    });
    await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursRopos/Jeudi`).once('value', snapshot => {
      if(snapshot.val() === true){
        this.setState({
          repos: [...this.state.repos,'jeudi'],
        })
      }   
    });
    await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursRopos/Vendredi`).once('value', snapshot => {
      if(snapshot.val() === true){
        this.setState({
          repos: [...this.state.repos,'vendredi'],
        })
      }   
    });
    await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursRopos/Samedi`).once('value', snapshot => {
      if(snapshot.val() === true){
        this.setState({
          repos: [...this.state.repos,'samedi'],
        })
      }   
    });
    await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursRopos/Dimanche`).once('value', snapshot => {
      if(snapshot.val() === true){
        this.setState({
          repos: [...this.state.repos,'dimanche'],
        })
      }   
    });
    //this.setState( {markedDates : this.getMarkedDate()})
   
   }

    // recuperer les jours feriers
    getJoursFeriers = () => {
      var year = new Date().getFullYear();
      var feriers = [];
      feriers = feriers.concat(year+"-01-01");
      feriers = feriers.concat(year+"-01-11");
      feriers = feriers.concat(year+"-05-01");
      feriers = feriers.concat(year+"-07-30");
      feriers = feriers.concat(year+"-08-14");
      feriers = feriers.concat(year+"-08-20");
      feriers = feriers.concat(year+"-08-21");
      feriers = feriers.concat(year+"-11-06");
      feriers = feriers.concat(year+"-11-18");
      return feriers;
    }

  
    getDateJoursRepos = (repos) => {

      var year = new Date().getFullYear();
      var table= [];
    //pour les mois 1 a 9
      for (let j = 1; j <= 9; j++){
          var NbjoursM = new Date(year, j, 0).getDate();
          // pour les jours de 1 a 9
          for (let i = 1; i <= 9; i++){
              var jour = Moment(year+'-0'+j+'-'+'0'+i).locale("fr").format('dddd');
              if(repos.includes(jour)){
                table = table.concat(Moment(year+'-0'+j+'-'+'0'+i).format('YYYY-MM-DD'))
              } 
          }
          // pour les jours de 10 a 31
          for (let i = 10; i <= NbjoursM; i++){
              var jour = Moment(year+'-0'+j+'-'+i).locale("fr").format('dddd');
              if(repos.includes(jour)){
                  table = table.concat(Moment(year+'-0'+j+'-'+i).format('YYYY-MM-DD'))
              }
          }
        }  
        // pour les mois de 10 a 12 
        for (let j = 10; j <= 12; j++){
          var NbjoursM = new Date(year, j, 0).getDate();
          for (let i = 1; i <= 9; i++){
              var jour = Moment(year+'-'+j+'-'+'0'+i).locale("fr").format('dddd');
              if(repos.includes(jour)){
                  table = table.concat(Moment(year+'-'+j+'-'+'0'+i).format('YYYY-MM-DD'))
               } 
          }
          for (let i = 10; i <= NbjoursM; i++){
            var jour = Moment(year+'-'+j+'-'+i).locale("fr").format('dddd');
            if(repos.includes(jour)){
                table = table.concat(Moment(year+'-'+j+'-'+i).format('YYYY-MM-DD'))
            }
          }
        }
        // // Ajout des jours feriers
        // var feriers = this.getJoursFeriers();
        // feriers.forEach((day) => {
        //   table = table.concat(day);
        // })
        return table; 
    }

   getMarkedDate = () => {

      var year = new Date().getFullYear();
      var repos = this.state.repos;
      var table= this.getDateJoursRepos(repos);
      let newDaysObject = {};

      // jours feriers
      var feriers = this.getJoursFeriers();
      feriers.forEach((day) => {
        if(day === (year+'-01-01') && !table.includes(day)){
          newDaysObject[day] = {
            customStyles: {
              container: { backgroundColor: 'white', borderColor: this.state.janvier_1, borderWidth: 1 },   
            },
          };
        }
        if(day === (year+'-01-11') && !table.includes(day)){
          newDaysObject[day] = {
            customStyles: {
              container: { backgroundColor: 'white', borderColor: this.state.janvier_11, borderWidth: 1 },   
            },
          };
        }
        if(day === (year+'-05-01') && !table.includes(day)){
          newDaysObject[day] = {
            customStyles: {
              container: { backgroundColor: 'white', borderColor: this.state.mai_1, borderWidth: 1 },   
            },
          };
        }
        if(day === (year+'-07-30') && !table.includes(day)){
          newDaysObject[day] = {
            customStyles: {
              container: { backgroundColor: 'white', borderColor: this.state.juillet_30, borderWidth: 1 },   
            },
          };
        }
        if(day === (year+'-08-14') && !table.includes(day)){
          newDaysObject[day] = {
            customStyles: {
              container: { backgroundColor: 'white', borderColor: this.state.aout_14, borderWidth: 1 },   
            },
          };
        }
        if(day === (year+'-08-20') && !table.includes(day)){
          newDaysObject[day] = {
            customStyles: {
              container: { backgroundColor: 'white', borderColor: this.state.aout_20, borderWidth: 1 },   
            },
          };
        }
        if(day === (year+'-08-21') && !table.includes(day)){
          newDaysObject[day] = {
            customStyles: {
              container: { backgroundColor: 'white', borderColor: this.state.aout_21, borderWidth: 1 },   
            },
          };
        }
        if(day === (year+'-11-06') && !table.includes(day)){
          newDaysObject[day] = {
            customStyles: {
              container: { backgroundColor: 'white', borderColor: this.state.novembre_6, borderWidth: 1 },   
            },
          };
        }
        if(day === (year+'-11-18') && !table.includes(day)){
          newDaysObject[day] = {
            customStyles: {
              container: { backgroundColor: 'white', borderColor: this.state.novembre_18, borderWidth: 1 },   
            },
          };
        }
      })
  // Jours de repos
      table.forEach((day) => {
            newDaysObject[day] = {
                        customStyles: {
                          container: { backgroundColor: 'white'},
                          text: { color: '#2d8fb3'}
                        }
                      };
      });
      return newDaysObject;
   }

    // Max Date
    getMaxDate = () => {
      var year = new Date().getFullYear();
      return (year+3)+"-12-31"
    }

    // Min Date
    getMinDate = () => {
      var year = new Date().getFullYear();
      return (year-3)+"-01-01"
    }

    setModalVisible = (visible) => {
      this.setState({ modalVisible: visible });
    }


    ShowDay= (day) =>{

      const { navigation } = this.props;
      const id_1 = navigation.getParam('id');


      firebase.database().ref(`projects/` +firebase.auth().currentUser.uid+`/`+id_1+`/calendrierBusiness/JoursFeriers/`+day).
      once('value').then((snapshot) => {
        if(snapshot.child('name').val() != null){
          this.setState({
            date: day,
            name: snapshot.child('name').val(),
            modalVisible: true,
          }) 
        if(snapshot.child('check').val() === true){
          this.setState({
            type: ' jour de travail',
            modalVisible: true,
          })
        } 
        else{
          this.setState({
            type: ' jour de repos',
            modalVisible: true,
          })
        }
          setTimeout(() => {
            this.setState({
              modalVisible: false
            })}, 5000);
            }  
      });
    }

    allMarkedDates = (day) => {

      let list = this.state.markedDates;
      list [day] = {
      selected: true,
      };
     this.setState({markedDates : list }) 
    }

    render() {
        return (
            <View>
               <Modal 
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible} 
                  >                           
                <View style={styles.centeredView}>
                  <View style={styles.modalView}> 
                   <Block row >
                     <View style={{justifyContent:'center'}}>
                      <Icon size={28} color="white" name="info" family="Feather" /> 
                     </View>
                    <Block style={{marginLeft: 10}}> 
                      <Text style={{ color: 'white', fontFamily: 'montserrat-bold'}} muted size={14} >
                        {this.state.date}
                      </Text> 
                      <Block style={{marginLeft: 4}}>
                        <Text style={{color: 'white'}} muted  size={16} >
                          {this.state.name} :{this.state.type} 
                        </Text>
                      </Block>
                    </Block>   
                   </Block>
                  </View>
                </View>              
                </Modal>
                <CalendarList ref='button'
                    pastScrollRange={45}
                    futureScrollRange={45}
                    scrollEnabled={true}
                    showScrollIndicator={true}
                    minDate={this.getMinDate()}
                    maxDate={this.getMaxDate()}
                    markingType={'custom'}
                    markedDates={this.getMarkedDate()}
                    onDayPress={(day)=>{
                      //this.setState({markedDates: this.allMarkedDates(day.dateString)})
                      this.ShowDay(Moment(day.dateString).format('DD-MM-YYYY'));
                    }}
                    theme={{
                        todayTextColor: nowTheme.COLORS.PRIMARY,
                        monthTextColor: nowTheme.COLORS.PRIMARY,
                        dayTextColor: nowTheme.COLORS.DEFAULT,
                        indicatorColor: nowTheme.COLORS.PRIMARY,
                        DayHeaderTextColor: nowTheme.COLORS.PRIMARY,
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayHeaderFontWeight: '300',
                        textDayFontSize: 16,
                        textMonthFontSize: 16,
                        textDayHeaderFontSize: 16,
                        selectedDayTextColor: 'red'
                    }}        
                />
         </View>
        );
    }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: "center",
  },
  modalView: {
    backgroundColor: nowTheme.COLORS.PRIMARY,
    padding: height < 812 ? 15 : 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    elevation: 5,
    width: width ,
    height: height < 812 ? 80 : 100,
  },
});