import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View, TouchableOpacity,Modal,Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Block, Text } from 'galio-framework';
import PhoneInput from 'react-native-phone-input';

import Icon from './Icon';
import Input from './Input';
import { nowTheme } from '../constants';
import firebase from '../database/firebase';
import Loading from 'react-native-whc-loading';


const { width, height } = Dimensions.get('screen');


class PhoneChange extends React.Component {
  constructor(props) {
    super(props);
    this.changeModal = this.changeModal.bind(this);
    this.state = { 
      uid: '',
      updatePhone:'',
    }
  }

  changeModal(visible){
    this.props.referenceCallback(visible);
  }
   
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }


  UpdatePhone = (phone) => {
    this.refs.loading.show();
    if(this.refs.phone.getValue()=== ''){
        this.refs.loading.close();
        Alert.alert("Echec !","Veuillez remplir les champs");
        return;
    }
    else if(!this.refs.phone.isValidNumber()){
      this.refs.loading.close();
      Alert.alert("Echec !",'Entrer un numéro de téléphone valide ! exemple : 645xxxxxx ou 745xxxxxx ou 545xxxxxx')
      return
    }
    else{
    firebase.database().ref('users/' + firebase.auth().currentUser.uid).update({
      phone: phone,
    });
    this.refs.loading.close();
    Alert.alert("Succés !","Numéro de téléphone modifié avec succés");
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
                      //fontFamily: 'montserrat-regular',
                        textAlign: 'center',
                      
                    }}
                    muted
                    size={16}
                   >
                      Modifier votre numéro de téléphone
                  </Text> 
              </View>
              <Block style={{marginTop:20}} >      
                  <PhoneInput
                            ref='phone'
                            style={{
                                  borderRadius: 30,
                                  borderColor: nowTheme.COLORS.BORDER,
                                  height: 44,
                                  backgroundColor: '#FFFFFF',
                                  borderWidth: 1,
                                  borderColor: '#E3E3E3',    
                                }}
                            textStyle=  {{textDecorationColor: '#ADB5BD'}}
                            initialCountry = 'ma' 
                            textProps = {{placeholder: 'Numéro de téléphone', placeholderTextColor: '#8898AA'}}
                            cancelText = 'Annuler'
                            confirmText = 'Confirmer'
                            flagStyle={{ marginLeft: 15}}
                   />
              </Block>
              <View style={{  justifyContent: "center", alignItems: "center", marginTop:20}}>
                  <TouchableOpacity color="transparent" round style={{alignItems: "center"}}
                             onPress={() => {
                               this.UpdatePhone(this.refs.phone.getValue());
                               }}>
                      <LinearGradient
                            colors={[nowTheme.COLORS.PRIMARY, nowTheme.COLORS.TEXT]}
                            style={{ padding: 15, alignItems: 'center', borderRadius: 25,width:150,  }}>
                            <Text
                              style={{ fontFamily: 'montserrat-bold' }}
                              size={12}
                              color={nowTheme.COLORS.WHITE}
                            >
                             Modifier
                            </Text>
                          <Loading 
                              ref="loading"
                              backgroundColor='transparent'
                              borderRadius={5}
                              size={70}
                              imageSize={40}
                              indicatorColor={nowTheme.COLORS.PRIMARY}
                              easing={Loading.EasingType.ease}
                          />
                      </LinearGradient>
                  </TouchableOpacity>
              </View>
              
          </View>
            
    );
  }
}

const styles = StyleSheet.create({
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
});

export default PhoneChange;


