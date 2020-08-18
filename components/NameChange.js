import React from "react";
import { StyleSheet, View, Dimensions,TouchableOpacity, Alert,Modal } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Block, Text, Button } from 'galio-framework';
import  Input  from './Input';

import Icon from './Icon';
import { nowTheme } from "../constants";
import firebase from '../database/firebase';
import Loading from 'react-native-whc-loading';



const { width, height } = Dimensions.get('screen');



class NameChange extends React.Component {

  
  constructor(props) {
    super(props);
    this.changeModal = this.changeModal.bind(this);
    this.state = { 
      uid: '',
      updateName:'',
      modalVisible: true,
    }
  }

  changeModal(visible){
    this.props.referenceCallback(visible);
  }

// recupere la valeur de l input
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  userUpdate = () => {
    const name = this.state.updateName;
    this.refs.loading.show();
    if(name === '')  {
      this.refs.loading.close();
      Alert.alert("Echec !",'Veuilez remplir les champs')
    } 
    else {
      firebase.auth().currentUser.updateProfile({
        displayName: name,
      }).then(()=> {
        Alert.alert("Succés !","Nom et prénom changé avec succés ");
      });
      firebase.database().ref('users/'+firebase.auth().currentUser.uid).update({
        username: name,
      });
      this.refs.loading.close();
      this.changeModal(false);
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
                Modifier votre nom et prénom
              </Text> 
            </View>
            <Block style={{marginTop:20}} >   
              <Input  
                placeholder='Nouveau nom'
                style={styles.inputs}
                iconContent={
                  <Icon
                      size={16}
                      color="#ADB5BD"
                      name="user"
                      family="Entypo"
                      style={styles.inputIcons}
                  />
                }
                value={this.state.updateName}
                onChangeText={(val) => this.updateInputVal(val, 'updateName')}
              />
            </Block>
            <View style={{  justifyContent: "center", alignItems: "center", marginTop:20}}>
            <Button style={styles.ButtonStyle}  
                    onPress={() => {this.userUpdate();}} > 
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
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT
  },
  ButtonStyle:{
    marginTop:5,
    alignSelf:'center',
    height: nowTheme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderRadius: 5,
    width: width* 0.5
   },
});

export default NameChange;
