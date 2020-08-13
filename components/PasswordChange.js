import React from 'react';
import {
  StyleSheet,
  Dimensions,
  View, TouchableOpacity, Alert,TextInput, TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Block,Text} from 'galio-framework';

import Icon from './Icon';
import Input from './Input';
import { nowTheme } from '../constants';
import Loading from 'react-native-whc-loading';


const { width, height } = Dimensions.get('screen');
import firebase from '../database/firebase';


class PasswordChange extends React.Component {
  constructor(props) {
    super(props);
    this.changeModal = this.changeModal.bind(this);
    this.state = {
      confirmPass:'',
      newPassword:'',
      currentPassword: "", 
      icon: "eye-with-line",
      passwordShow: true,
      PasswordSucces: true,
      colorBorder: '#E3E3E3',
    };
  }

  changeModal(visible){
    this.props.referenceCallback(visible);
  }

  ChangeIcon () {
    this.setState(prevState => ({
      icon: prevState.icon === 'eye' ? 'eye-with-line': 'eye',
      passwordShow: ! prevState.passwordShow
    }))
  }

  passwordCheckFunction = () => {
    const {newPassword,confirmPass} = this.state;
    
     if ((confirmPass != '') && (newPassword != confirmPass) ){
      this.setState({ PasswordSucces: false,
                      colorBorder: nowTheme.COLORS.ERROR,});
      Alert.alert("Echec !",'Veuillez confirmer votre mot de passe');
     
    }
    else if((confirmPass != '') && (newPassword == confirmPass) ){
      this.setState({ PasswordSucces: false,
                      colorBorder: nowTheme.COLORS.SUCCESS,});
    }
    
  };

      // Reauthenticates the current user and returns a promise...
      reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
      }

      // Changes user's password...
      onChangePasswordPress = () => {
        this.refs.loading.show();
        if((this.state.confirmPass === '') && (this.state.newPassword === '') && (this.state.currentPassword === '')){
          this.refs.loading.close();
          Alert.alert("Echec !",'Veuillez remplir tous les champs');
        }
        else if ((this.state.confirmPass != '') && (this.state.newPassword != this.state.confirmPass) ){
          this.setState({ PasswordSucces: false,
                          colorBorder: nowTheme.COLORS.ERROR,});
          this.refs.loading.close();
          Alert.alert("Echec !",'Veuillez confirmer votre mot de passe');
         
        }
         else{
          this.reauthenticate(this.state.currentPassword).then(() => {
            var user = firebase.auth().currentUser;
            user.updatePassword(this.state.newPassword).then(() => {
              this.refs.loading.close();
              Alert.alert("Succés !","Mot de passe changé avec succé");
              this.changeModal(false);
            }).catch((error) => { 
              this.refs.loading.close();
              console.log("Le mot de passe doit contenir au moins 6 caractères");
              Alert.alert("Echec !","Le mot de passe doit contenir au moins 6 caractères") });
          }).catch((error) => { 
              this.refs.loading.close();
              console.log("Ancien mot de passe non valide");
              Alert.alert("Echec !","Ancien mot de passe non valide")
            });
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
                         Changer votre mot de passe
                      </Text> 
              </View>
              
              <Block center width={width * 0.8} style={{ marginTop: 20}}  >
                  <View style={{  flexDirection: 'row',
                                  borderWidth: 1,
                                  paddingBottom: 10,
                                  borderColor: '#E3E3E3',
                                  borderRadius: 30, 
                                  backgroundColor: 'white',
                                  }}>
                    <Icon
                      size={16}
                      color="#ADB5BD"
                      name="key"
                      family="Entypo"
                      style={{marginTop: 12, marginLeft: 15,
                        color: nowTheme.COLORS.ICON_INPUT}}
                    />
                    <View style= {{marginLeft: 10, flex: 1}}>
                      <TextInput
                          style={{paddingTop: 7}}
                          autoCorrect={false}
                          secureTextEntry={this.state.passwordShow}
                          placeholder="Ancien mot de passe"
                          placeholderTextColor = '#8898AA'
                          value={this.state.currentPassword}
                          onChangeText={(val) => { this.setState({currentPassword: val})}}
                        />
                      </View>
                    <TouchableWithoutFeedback onPress= {() => this.ChangeIcon()}>
                      <Icon
                          size={18}
                          color="#ADB5BD"
                          name={this.state.icon}
                          family="Entypo"
                          style={{marginTop: 12, marginRight: 20,color: nowTheme.COLORS.ICON_INPUT}}
                          
                        />
                    </TouchableWithoutFeedback>
                  </View>
              </Block>
              <Block center width={width * 0.8}>
                <View style={{  flexDirection: 'row',
                              borderWidth: 1,
                              paddingBottom: 10,
                              borderColor: this.state.PasswordSucces ? '#E3E3E3' : this.state.colorBorder,
                              borderRadius: 21.5, 
                              backgroundColor: 'white',
                              marginTop: 10}}>
                      <Icon
                        size={16}
                        color="#ADB5BD"
                        name="lock"
                        family="Entypo"
                        style={{marginTop: 12, marginLeft: 15,
                          color: nowTheme.COLORS.ICON_INPUT}}
                      />
                    <View style= {{marginLeft: 10, flex: 1}}>
                      <TextInput
                          style={{paddingTop: 7}}
                          autoCorrect={false}
                          secureTextEntry={this.state.passwordShow}
                          placeholder="Nouveau mot de passe"
                          placeholderTextColor = '#8898AA'
                          value={this.state.newPassword}
                          onChangeText={(text) => { this.setState({newPassword: text}) }}
                          onBlur={this.passwordCheckFunction}
                        />
                      </View>
                    <TouchableWithoutFeedback onPress= {() => this.ChangeIcon()}>
                      <Icon
                          size={18}
                          color="#ADB5BD"
                          name={this.state.icon}
                          family="Entypo"
                          style={{marginTop: 12, marginRight: 20,color: nowTheme.COLORS.ICON_INPUT}}
                          
                        />
                      </TouchableWithoutFeedback>
                    </View>
                </Block>
          
                <Block center width={width * 0.8}>
                  <View style={{  flexDirection: 'row',
                                borderWidth: 1,
                                paddingBottom: 10,
                                borderColor: this.state.PasswordSucces ? '#E3E3E3' : this.state.colorBorder,
                                borderRadius: 21.5, 
                                backgroundColor: 'white',
                                marginTop: 10}}>
                      <Icon
                        size={16}
                        color="#ADB5BD"
                        name="lock"
                        family="Entypo"
                        style={{marginTop: 12, marginLeft: 15,
                          color: nowTheme.COLORS.ICON_INPUT}}
                      />
                      <View style= {{marginLeft: 10, flex: 1}}>
                        <TextInput
                            style={{paddingTop: 7}}
                            autoCorrect={false}
                            secureTextEntry={this.state.passwordShow}
                            placeholder="Confirmer mot de passe"
                            placeholderTextColor = '#8898AA'
                            value={this.state.confirmPass}
                            onChangeText={(text) => { this.setState({confirmPass: text}) }}   
                            onBlur={this.passwordCheckFunction}
                          />
                        </View>
                      <TouchableWithoutFeedback onPress= {() => this.ChangeIcon()}>
                        <Icon
                            size={18}
                            color="#ADB5BD"
                            name={this.state.icon}
                            family="Entypo"
                            style={{marginTop: 12, marginRight: 20,color: nowTheme.COLORS.ICON_INPUT}}
                            
                          />
                        </TouchableWithoutFeedback>
                    </View> 
                 </Block>    
                 <View style={{  justifyContent: "center", alignItems: "center", marginTop:20}}>
                    <TouchableOpacity color="transparent" round style={{alignItems: "center"}}
                               onPress={()=> {this.onChangePasswordPress();}} >
                        <LinearGradient
                            colors={[nowTheme.COLORS.PRIMARY, nowTheme.COLORS.TEXT]}
                            style={{ padding: 15, alignItems: 'center', borderRadius: 25, width:150}}>
                              <Text
                                style={{ fontFamily: 'montserrat-bold' }}
                                size={12}
                                color={nowTheme.COLORS.WHITE}
                              >
                                  Valider
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

export default PasswordChange;


