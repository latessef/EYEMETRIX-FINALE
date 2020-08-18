import React from "react";
import { StyleSheet, View, Dimensions,TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Block, Text, Button} from 'galio-framework';
import  Input  from './Input';
import Icon from './Icon';
import { nowTheme } from "../constants";
import firebase from '../database/firebase';
import Loading from 'react-native-whc-loading';
import Moment from 'moment';
import RNPickerSelect from 'react-native-picker-select';
const { width, height } = Dimensions.get('screen');
import SectionedMultiSelect from 'react-native-sectioned-multi-select';


class AddProject extends React.Component {
  constructor(props) {
    super(props);
    this.changeModal = this.changeModal.bind(this);
    Moment.locale('fr');
    this.state = { 
      uid: '',
      addId:'',
      nom: '',
      janvier_1 : new Date("2020-01-01"), 
      janvier_11 : new Date("2020-01-11"), 
      mai_1 : new Date("2020-05-01"), 
      juillet_30 : new Date("2020-07-30"), 
      aout_14 : new Date("2020-08-14"), 
      aout_20 : new Date("2020-08-20"), 
      aout_21 : new Date("2020-08-21"), 
      novembre_6 : new Date("2020-11-06"), 
      novembre_18 : new Date("2020-11-18"),
      exist : "",
      selectedItems: [],
      list: [
        {
          name: 'Services Hospitalier',
          id: 0,
          children: [
            { name: 'Hotel', id: 'Hotel' },
            { name: 'Motel', id: 'Motel' },
            { name: 'Auberge', id:'Loge' },
            { name: 'Café', id: 'Café' },
            { name: 'Restaurant', id: 'Restaurant' },
            { name: 'Fast Food ', id: 'Fast Food' },
          ],
        },
        {
          name: 'Entreprise',
          id: 1,
          children: [
            { name: 'Construction', id: 'Construction' },
            { name: 'Usine', id: 'Usine' },
            { name: 'Bureau', id:'Bureau' },
            { name: 'Agence', id: 'Agence' },
          ],

        },
        {
          name: 'Santé et Soins',
          id: 2,
          children: [
            { name: 'Clinique', id: 'Clinique' },
            { name: 'Hopitale', id: 'Hopitale' },
            { name: 'Gym', id:'Gym' },
            { name: 'SPA', id: 'SPA' },
            { name: 'Salon', id: 'Salon' },
            { name: 'Laboratoire ', id: 'Laboratoire' },
          ],

        },
        {
          name: 'Résidentielle et Immobilier',
          id: 3,
          children: [
            { name: 'Maison', id: 'Maison' },
            { name: 'Appartement', id: 'Appartement' },
            { name: 'Chalet', id:'Chalet' },
            { name: 'Ferme', id: 'Ferme' },
          ],
        },
        {
          name: 'Service de Vente',
          id: 4,
          children: [
            { name: 'Super Marché', id: 'Super Marché' },
            { name: 'Magasin Textile', id: 'Magasin Textile' },
            { name: 'Epicière', id:'Epicière' },
            { name: 'Pharmacie', id: 'Pharmacie' },
            { name: 'Animalerie', id: 'Animaleie' },
          ],
        },
        {
          name: 'Immobilier récréatif',
          id: 5,
          children: [
            { name: 'Rue', id: 'Rue' },
            { name: 'Jardin', id: 'Jardin' },
            { name: 'Parc', id:'Parc' },
            { name: 'Terrain de jeux', id: 'Terrain de jeux' },
            { name: 'Piscine', id: 'Piscine' },
            { name: 'Plage', id: 'Plage' },
            { name: 'Terrain de sport', id: 'Terrain de sport' },
          ],
        },

      ]
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  changeModal(visible){
    this.props.referenceCallback(visible);
  }

  onSelectedItemsChange = (selectedItems) => {
    this.setState({ selectedItems });
  };

  addProject = () => {
    this.refs.loading.show();
    const id = this.state.addId;
    const titre = this.state.nom;
    var ref = firebase.database().ref("projectsList");
    var ref_2 = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid);
    if(id === '' || titre === '')  {
      this.refs.loading.close();
      Alert.alert("Echec !",'Veuilez remplir les champs')
      return
    } 
    else{
      ref.once("value")
        .then( snapshot => {
          ref_2.once("value")
          .then( snapshot_2 => {
            if(!snapshot.hasChild(id)){
              Alert.alert("Echec !","Cet identifiant n'existe pas")
              return
            }
            else if(snapshot_2.hasChild(id)){
              Alert.alert("Echec !","Cet identifiant existe deja parmis vos projets")
              return
            }
            else {
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/`).set({
                counterFlux : 0,
                nom : titre,
                category: this.state.selectedItems[0]
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/flux`).set({
                entrants : 0,
                sortants : 0,
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/HorairesSemaine/Matin/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/HorairesSemaine/ApresMidi/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/HorairesSemaine/Soir/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Lundi/Matin/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Lundi/ApresMidi/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Lundi/Soir/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Mardi/Matin/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Mardi/ApresMidi/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Mardi/Soir/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Mercredi/Matin/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Mercredi/ApresMidi/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Mercredi/Soir/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Jeudi/Matin/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Jeudi/ApresMidi/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Jeudi/Soir/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Vendredi/Matin/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Vendredi/ApresMidi/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Vendredi/Soir/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Samedi/Matin/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Samedi/ApresMidi/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Samedi/Soir/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Dimanche/Matin/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Dimanche/ApresMidi/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/Horaires/Dimanche/Soir/`).set({
                debut : "",
                fin :""
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id.toString()+`/calendrierBusiness/JoursRopos/`).set({
                Lundi: false,
                Mardi: false,
                Mercredi: false,
                Jeudi: false,
                Vendredi: false,
                Samedi: false,
                Dimanche: false
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.janvier_1).format('DD-MM-YYYY')).set({
                name: 'Nouvel An',
                check: false
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.janvier_11).format('DD-MM-YYYY')).set({
                name: "Manifeste de l'indépendance",
                check: false
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.mai_1).format('DD-MM-YYYY')).set({
                name: "Fête du Travail",
                check: false
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.juillet_30).format('DD-MM-YYYY')).set({
                name: "Fête du Trône",
                check: false
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.aout_14).format('DD-MM-YYYY')).set({
                name: "Allégeance Oued Eddahab",
                check: false
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.aout_21).format('DD-MM-YYYY')).set({
                name: "Fête de la Jeunesse",
                check: false
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.aout_20).format('DD-MM-YYYY')).set({
                name: "La révolution du roi et du peuple",
                check: false
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.novembre_6).format('DD-MM-YYYY')).set({
                name: "La marche verte",
                check: false
              });
              firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.novembre_18).format('DD-MM-YYYY')).set({
                name: "Fête de l'indépendance",
                check: false
              });
              Alert.alert("Succes","votre projet a été ajouté avec succés")
            }
        });
      });
      this.changeModal(false);
      this.refs.loading.close();
    }
  }

  render() {
    return (
        <View>
          <View style={{marginTop:20}}>
            <Text
              style={{
                color: nowTheme.COLORS.ICON_INPUT,
                textAlign: 'center',     
              }}
              muted
              size={16}
            >
              Veuillez saisir l'id et le nom de votre projet
            </Text> 
          </View>
          <Block style={{marginTop:20}} >   
            <Input  
              placeholder='Yshyz5zefbOizubfKJQCDZNbdeuNBD'
              style={styles.inputs}
              iconContent={
                  <Icon
                    size={16}
                    color="#ADB5BD"
                    name="key"
                    family="AntDesign"
                    style={styles.inputIcons}
                  />
              }
              value={this.state.addId}
              onChangeText={(val) => this.updateInputVal(val, 'addId')}
            />
            <Input  
              placeholder='Cafe Vinizia'
              style={styles.inputs}
              iconContent={
                  <Icon
                    size={16}
                    color="#ADB5BD"
                    name="tag"
                    family="AntDesign"
                    style={styles.inputIcons}
                  />
              }
              value={this.state.nom}
              onChangeText={(val) => this.updateInputVal(val, 'nom')}
            />
          </Block>
          <Block width={width * 0.83} style={styles.container}>
            <SectionedMultiSelect
              items={this.state.list}
              uniqueKey="id"
              subKey="children"
              selectText="Choisir une catégorie..."
              showDropDowns={true}
              readOnlyHeadings={true}
              onSelectedItemsChange={(val) => this.updateInputVal(val, 'selectedItems')}
              selectedItems={this.state.selectedItems}
              single = {true}
              hideConfirm = {true}
              hideSearch = {false}
              itemFontFamily = "normal"
              
              // showChips = {false}
              styles = {{
                subItemText : {color : '#363636',marginLeft : 20},
                selectToggleText : {color : nowTheme.COLORS.MUTED ,marginLeft : 28,fontSize : 15},
                selectToggle : {color : nowTheme.COLORS.PRIMARY , fontSize : 15}, 
                selectedItem: {color: 'black'},
                separator : {color : 'red'}
              }}
            />
          </Block>
          <View style={{  justifyContent: "center", alignItems: "center", marginTop:20}}>
            <Button style={styles.ButtonStyle}  
                    onPress={() => {this.addProject();}} > 
                    <Text
                    style={{ fontFamily: 'montserrat-bold' }}
                    size={14}
                    color={nowTheme.COLORS.WHITE}
                   >
                      Ajouter
                   </Text> 
            </Button>
                  <Loading 
                    ref="loading"
                    backgroundColor='transparent'
                    borderRadius={5}
                    size={70}
                    imageSize={40}
                    indicatorColor={nowTheme.COLORS.PRIMARY}
                    easing={Loading.EasingType.ease}
                  />
          </View>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  ButtonStyle:{
    marginTop:5,
    alignSelf:'center',
    //width: width - nowTheme.SIZES.BASE * 4,
    height: nowTheme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderRadius: 5,
    width: width* 0.5
   },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT
  },
  container: {
    // flex: 1,
    // backgroundColor: 'white',
    marginRight: 8,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    height: 44,
    justifyContent : 'center',
    // alignItems : 'center',
    // backgroundColor: '#FFFFFF',
    borderWidth: 1,
    marginTop: 10   
  },
});

export default AddProject;
