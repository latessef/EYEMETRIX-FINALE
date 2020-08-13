import React, { useState } from 'react';
import { ImageBackground,YellowBox, Image, StyleSheet, StatusBar, Dimensions, Platform,TouchableOpacity, KeyboardAvoidingView,
   Alert, ActivityIndicator, View, TextInput, TouchableWithoutFeedback } from 'react-native';
import { Block, Checkbox, Text, Button as GaButton, theme } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Icon, Input } from '../components';
const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';
import PhoneInput from 'react-native-phone-input';
import Loading from 'react-native-whc-loading';
import firebase from '../database/firebase';

export default class Inscription extends React.Component {
  constructor() {
    super();
    YellowBox.ignoreWarnings(['Setting a timer']);
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      confirmPass : '',
      valide : '',
      signedIn: false,
      name: "", 
      photoUrl: "",
      isLoading: false,
      iconPass: "eye-with-line",
      iconConf: "eye-with-line",
      passwordShow: true,
      passwordConfShow: true,
      loginSucces: true,
      PasswordSucces: true,
      PasswordConfSucces: true,
      PhoneSucces: true,
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  writeUserData = (userId, name, phone) => {
    firebase.database().ref('users/' + userId).set({
      username: name,
      phone: phone,
      type : 'admin'
    });
  }

  ChangeIconPass () {
    this.setState(prevState => ({
      iconPass: prevState.iconPass === 'eye' ? 'eye-with-line': 'eye',
      passwordShow: ! prevState.passwordShow
    }))
  }

  ChangeIconConf () {
    this.setState(prevState => ({
      iconConf: prevState.iconConf === 'eye' ? 'eye-with-line': 'eye',
      passwordConfShow: ! prevState.passwordConfShow
    }))
  }
  
  
  registerUser = () => {
    this.refs.loading.show();
    if(this.state.email === '' || this.state.password === '' || this.state.displayName === '') {
      this.refs.loading.close();
      Alert.alert("Echec !","Entrer les détails pour s'inscrire")
      return
    }else if( (this.state.password != '') && (this.state.password != this.state.confirmPass) ){
      this.refs.loading.close();
      this.setState({
        loginSucces: true,
        PasswordSucces: false,
        PasswordConfSucces: false,
        PhoneSucces: true,
      })
      Alert.alert("Echec !",'Veuillez confirmer votre mot de passe');
      return
    }else if(!this.refs.phone.isValidNumber()){
      this.refs.loading.close();
      this.setState({
        loginSucces: true,
        PasswordSucces: true,
        PasswordConfSucces: true,
        PhoneSucces: false,
      })
      Alert.alert("Echec !","Entrer un numéro de téléphone valide, exemple : 645xxxxxx ou 745xxxxxx ou 545xxxxxx")
      return
    }
    else {
      this.setState({
        isLoading: true,
        phone : this.refs.phone.getValue(),
        loginSucces: true,
        PasswordSucces: true,
        PasswordConfSucces: true,
        PhoneSucces: true,
      })
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: this.state.displayName,
        })
        this.writeUserData(res.user.uid,this.state.displayName, this.state.phone);
        res.user.sendEmailVerification().then(() =>{
          this.refs.loading.close();
          Alert.alert("Succés !",'Veuillez valider votre email');
        }).catch((error) => {
          this.refs.loading.close();
          this.setState({
            loginSucces: false,
            PasswordSucces: true,
            PasswordConfSucces: true,
            PhoneSucces: true,
            SelectSucces: true
          })
          Alert.alert("Echec !","Votre email n'est pas valide ou n'existe pas");
        });
        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: '',
          confirmPass: '',
          valide: '',
      })
        this.refs.loading.close();
        this.props.navigation.navigate('Login')
      })
      .catch((error) =>{
        this.refs.loading.close();
        var errorCode = error.code;
        if(errorCode === 'auth/weak-password'){
          this.setState({
            loginSucces: true,
            PasswordSucces: false,
            PasswordConfSucces: false,
            PhoneSucces: true,
          })
          Alert.alert("Echec !","Le mot de passe doit contenir au moins 6 caractères");
        }  
        else if(errorCode === 'auth/email-already-in-use'){
          this.setState({
            loginSucces: false,
            PasswordSucces: true,
            PasswordConfSucces: true,
            PhoneSucces: true,
          })
          Alert.alert("Echec !","Cet email est déja utilisé");
        }
        else if(errorCode === 'auth/invalid-email'){
          this.setState({
            loginSucces: false,
            PasswordSucces: true,
            PasswordConfSucces: true,
            PhoneSucces: true,
            SelectSucces: true,
          })
          Alert.alert("Echec !","Email non valide");
        }
        else{
          Alert.alert("Echec !",errorCode);
        }
      })      
    }
  }


  render() {
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView  style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Block flex style={styles.container}>
        <Block flex middle>
          <ImageBackground
            source={Images.RegisterBackground}
            style={styles.imageBackgroundContainer}
            imageStyle={styles.imageBackground}
          >
          <Block flex middle>
            <Block style={styles.registerContainer}>
              <Block flex space="evenly">
                <Block flex={1}  space="between">
                  <Block center flex={0.8}>
                    <Block flex space="between">
                      <Block>
                        <Block middle style={{marginTop: 100}}>    
                          <Block width={width * 0.8} style={{ marginBottom: 5 }}>
                              <Input
                              placeholder="Nom & Prénom"
                              style={styles.inputs}
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="user"
                                  family="antdesign"
                                  style={styles.inputIcons}
                                />
                              }
                              value={this.state.displayName}
                              onChangeText={(val) => this.updateInputVal(val, 'displayName')}
                            />
                          </Block>
                          <Block width={width * 0.8}>
                            <Input
                              placeholder="Email"
                              type='email-address'
                              style={{ borderWidth: 1,
                                       borderColor: this.state.loginSucces ? '#E3E3E3' : nowTheme.COLORS.ERROR,
                                       borderRadius: 21.5 }}
                              iconContent={
                                <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="mail"
                                  family="antdesign"
                                  style={styles.inputIcons}
                                />
                              }
                              value={this.state.email}
                              onChangeText={(val) => this.updateInputVal(val, 'email')}
                            />
                          </Block>
                          <Block width={width * 0.8}>
                          <View style={{  flexDirection: 'row',
                                            borderWidth: 1,
                                            paddingBottom: 10,
                                            borderColor: this.state.PasswordSucces ? '#E3E3E3' : nowTheme.COLORS.ERROR,
                                            borderRadius: 21.5, backgroundColor: 'white'}}>
                               <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="lock"
                                  family="antdesign"
                                  style={{marginTop: 12, marginLeft: 15,
                                    color: nowTheme.COLORS.ICON_INPUT}}
                                />
                              <View style= {{marginLeft: 10, flex: 1}}>
                                <TextInput
                                    style={{paddingTop: 7}}
                                    autoCorrect={false}
                                    secureTextEntry={this.state.passwordShow}
                                    placeholder=" Password"
                                    placeholderTextColor = '#8898AA'
                                    value={this.state.password}
                                    onChangeText={(val) => this.updateInputVal(val, 'password')}
                                  />
                                </View>
                              <TouchableWithoutFeedback onPress= {() => this.ChangeIconPass()}>
                                <Icon
                                    size={20}
                                    color="#ADB5BD"
                                    name={this.state.iconPass}
                                    family="Entypo"
                                    style={{marginTop: 10, marginRight: 20,color: nowTheme.COLORS.ICON_INPUT}}
                                    
                                  />
                               </TouchableWithoutFeedback>
                            </View>
                          </Block>
                          <Block width={width * 0.8} style={{marginTop:7}}>
                          <View style={{  flexDirection: 'row',
                                            borderWidth: 1,
                                            paddingBottom: 10,
                                            borderColor: this.state.PasswordConfSucces ? '#E3E3E3' : nowTheme.COLORS.ERROR,
                                            borderRadius: 21.5, backgroundColor: 'white'}}>
                               <Icon
                                  size={16}
                                  color="#ADB5BD"
                                  name="lock"
                                  family="antdesign"
                                  style={{marginTop: 12, marginLeft: 15,
                                    color: nowTheme.COLORS.ICON_INPUT}}
                                />
                              <View style= {{marginLeft: 10, flex: 1}}>
                                <TextInput
                                    style={{paddingTop: 7}}
                                    autoCorrect={false}
                                    secureTextEntry={this.state.passwordConfShow}
                                    placeholder="Confirmer votre mot de passe"
                                    placeholderTextColor = '#8898AA'
                                    value={this.state.confirmPass}
                                    onChangeText={(val) => this.updateInputVal(val, 'confirmPass')}
                                  />
                                </View>
                              <TouchableWithoutFeedback onPress= {() => this.ChangeIconConf()}>
                                <Icon
                                    size={20}
                                    color="#ADB5BD"
                                    name={this.state.iconConf}
                                    family="Entypo"
                                    style={{marginTop: 10, marginRight: 20,color: nowTheme.COLORS.ICON_INPUT}}
                                    
                                  />
                               </TouchableWithoutFeedback>
                            </View>
                          </Block>
                          <Block width={width * 0.8} style={{marginTop: 10}}>
                            <PhoneInput
                                ref='phone'
                                style={{borderRadius: 30,
                                  borderColor: nowTheme.COLORS.BORDER,
                                  height: 44,
                                  backgroundColor: '#FFFFFF',
                                  borderWidth: 1,
                                  borderColor: this.state.PhoneSucces ? '#E3E3E3' : nowTheme.COLORS.ERROR,
                                  
                                }}
                                textStyle=  {{textDecorationColor: '#ADB5BD'}}
                                initialCountry = 'ma' 
                                textProps = {{placeholder: 'Numéro de téléphone', placeholderTextColor: '#8898AA'}}
                                cancelText = 'Annuler'
                                confirmText = 'Confirmer'
                                flagStyle={{ marginLeft: 15}}
                              />
                          </Block>
                          <Block center style={{marginTop:height < 812 ? 30 : 45}}>
                            <TouchableOpacity color="transparent" round style={{alignItems: "center"}} activeOpacity={0.8}
                                onPress={() => this.registerUser()}>
                              <LinearGradient
                                colors={[nowTheme.COLORS.PRIMARY, nowTheme.COLORS.TEXT]}
                                style={{ padding: 15, alignItems: 'center', borderRadius: 25,width:200 }}>
                                  <Text
                                    style={{ fontFamily: 'montserrat-bold' }}
                                    size={14}
                                    color={nowTheme.COLORS.WHITE}
                                  >
                                   S'inscrire
                                  </Text>
                                  <Loading 
                                    ref="loading"
                                    backgroundColor='transparent'
                                    borderRadius={5}
                                    size={70}
                                    imageSize={40}
                                    indicatorColor= {nowTheme.COLORS.PRIMARY}
                                    easing={Loading.EasingType.ease}
                                  />
                              </LinearGradient>
                            </TouchableOpacity>
                        </Block>  
                        </Block>   
                        </Block>
                      </Block>
                    </Block>
                  </Block>
               </Block>
              </Block>
            </Block>
           </ImageBackground>
        </Block>
       </Block>
     </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0
  },
  imageBackgroundContainer: {
    width: width,
    height: height,
    //padding: 0,
    zIndex: 1
  },
  imageBackground: {
    width: width,
    height: height
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    zIndex: 3,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0
  },

  gradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66
  },

  registerContainer: {
    marginTop: height < 812 ? 0 : 130,
    marginBottom: 20,
    width: width * 0.9,
    height: height < 812 ? height * 0.75 : height * 0.67 ,
    backgroundColor: 'transparent',
    borderRadius: 4,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden'
  },
  socialConnect: {
    backgroundColor: nowTheme.COLORS.WHITE
    // borderBottomWidth: StyleSheet.hairlineWidth,
    // borderColor: "rgba(136, 152, 170, 0.3)"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: '#fff',
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    }, 
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: nowTheme.COLORS.PRIMARY,
    fontWeight: '800',
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12,
    color: nowTheme.COLORS.ICON_INPUT
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center',
    marginHorizontal: 10
  }
});
