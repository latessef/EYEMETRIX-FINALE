import React from 'react';
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView, Alert, Platform, View, TextInput
} from 'react-native';
import { Block, Text} from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, Input } from '../components';
import { Images, nowTheme } from '../constants';
import PhoneInput from 'react-native-phone-input';
import RNPickerSelect from 'react-native-picker-select';
import firebase from '../database/firebase';
import Loading from 'react-native-whc-loading';


const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
);

class Register extends React.Component {
  
  constructor() {
    super();
    this.state = { 
      displayName: '',
      email: '', 
      password: '',
      confirmPass : '',
      valide : '',
      signedIn: false,
      name: "", 
      isLoading: false,
      idAdmin:"",
      nameProject:"",
      idProject:"",
      list:[],
      iconPass: "eye-with-line",
      iconConf: "eye-with-line",
      passwordShow: true,
      passwordConfShow: true,
      loginSucces: true,
      PasswordSucces: true,
      PasswordConfSucces: true,
      PhoneSucces: true,
      SelectSucces: true,
      
      
    }
  }

  UNSAFE_componentWillMount = async () => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({
        idAdmin : firebase.auth().currentUser.uid,
        iconPass: "eye-with-line",
        iconConf: "eye-with-line",
        passwordShow: true,
        passwordConfShow: true,
        loginSucces: true,
        PasswordSucces: true,
        PasswordConfSucces: true,
        PhoneSucces: true,
        SelectSucces: true,

    });   
    this.getProjects(); 
    })
    
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }
  

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
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
  
  getProjects = () => {
    const newArray = [];
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid).orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var key = childSnapshot.key;
          var childData = childSnapshot.val().nom;
          const obj = {'label': childData,'value': key, 'key': key}
          newArray.push(obj);
          this.setState({
            list: newArray,
          });
        });
      });
  }

  writeUserData = (userId, name, phone,idProject,idAdmin) => {
    firebase.database().ref('users/' + userId).set({
      username: name,
      phone: phone,
      type : 'user',
      idAdmin: idAdmin,
      idProject: idProject
    });
    firebase.database().ref('projects/' + this.state.idAdmin+'/'+idProject+'/ListEmployés/'+userId).update({
      username: name,
    });
  }
  
  
  registerUser = () => {
    this.refs.loading.show();
    if(this.state.email === '' || this.state.password === '' || this.state.displayName === '') {
      this.refs.loading.close();
      Alert.alert("Echec !","Veuillez remplir tous les champs")
      return
    }else if( (this.state.password != '') && (this.state.password != this.state.confirmPass) ){
      this.refs.loading.close();
      this.setState({
        loginSucces: true,
        PasswordSucces: false,
        PasswordConfSucces: false,
        PhoneSucces: true,
        SelectSucces: true,
      })
      Alert.alert("Echec !",'Veuillez confirmer le mot de passe');
      return
    }else if(!this.refs.phone.isValidNumber()){
      this.refs.loading.close();
      this.setState({
        loginSucces: true,
        PasswordSucces: true,
        PasswordConfSucces: true,
        PhoneSucces: false,
        SelectSucces: true,
      })
      Alert.alert("Echec !","Entrez un numéro de téléphone valide, exemple : 645xxxxxx ou 745xxxxxx ou 545xxxxxx")
      return
    }
    else if (this.state.idProject === '' || this.state.idProject === 'Sélectioner un projet...'){
      this.refs.loading.close();
      this.setState({
        loginSucces: true,
        PasswordSucces: true,
        PasswordConfSucces: true,
        PhoneSucces: true,
        SelectSucces: false,
      })
      Alert.alert("Echec !","Veuillez sélectionner un projet.")
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
        SelectSucces: true,
      })
      firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: this.state.displayName,
        })
        this.writeUserData(res.user.uid,this.state.displayName, this.state.phone,this.state.idProject,this.state.idAdmin);
        res.user.sendEmailVerification().then(() =>{
          this.refs.loading.close();
          Alert.alert("Succés !",'Veuillez informer votre employé de valider son email');
        }).catch((error) => {
          this.refs.loading.close();
          this.setState({
            loginSucces: false,
            PasswordSucces: true,
            PasswordConfSucces: true,
            PhoneSucces: true,
            SelectSucces: true
          })
          Alert.alert("Echec !","L'email n'est pas valide ou n'existe pas");
        });
        this.setState({
          isLoading: false,
          displayName: '',
          email: '', 
          password: '',
          confirmPass: '',
          valide: '',
          phone:'',
          loginSucces: true,
          PasswordSucces: true,
          PasswordConfSucces: true,
          PhoneSucces: true,
          SelectSucces: true,
      })
        this.refs.loading.close();
        this.props.navigation.navigate('Home')
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
            SelectSucces: true,
          })
          Alert.alert("Echec !","Le mot de passe doit contenir au moins 6 caractères");
        }  
        else if(errorCode === 'auth/email-already-in-use'){
          this.setState({
            loginSucces: false,
            PasswordSucces: true,
            PasswordConfSucces: true,
            PhoneSucces: true,
            SelectSucces: true,
          })
          Alert.alert("Echec !","Cet email est déja utilisé");
        }
        else{
          this.setState({
            loginSucces: false,
            PasswordSucces: true,
            PasswordConfSucces: true,
            PhoneSucces: true,
            SelectSucces: true,
          })
          Alert.alert("Echec !","Email non valide");
        }
      })      
    }
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
      <KeyboardAvoidingView  style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Block flex middle>
          <ImageBackground
            source={Images.RegisterBackground}
            style={styles.imageBackgroundContainer}
            imageStyle={styles.imageBackground}
          >
            <Block flex middle>
              <Block style={styles.registerContainer}>
                <Block flex>
                  <Block flex space="between">
                        <Block middle style={{ marginTop: height < 812 ? 50 : 80 }}>
                          <Block width={width * 0.8}>
                              <Input
                                placeholder= "Nom & Prénom"
                                style={{
                                       borderWidth: 1,
                                       borderColor: '#E3E3E3',
                                       borderRadius: 30
                                }}
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
                                       borderRadius: 30,
                                       marginTop : -8 }}
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
                                            borderRadius: 30, 
                                            backgroundColor: 'white'
                                          }}
                            >
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
                            <View style={{  
                                            flexDirection: 'row',
                                            borderWidth: 1,
                                            paddingBottom: 10,
                                            borderColor: this.state.PasswordConfSucces ? '#E3E3E3' : nowTheme.COLORS.ERROR,
                                            borderRadius: 30, 
                                            backgroundColor: 'white'
                                        }}
                            >
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
                                    style={{
                                      paddingTop: 7}}
                                      autoCorrect={false}
                                      secureTextEntry={this.state.passwordConfShow}
                                      placeholder="Confirmer le mot de passe"
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
                          
                          <Block width={width * 0.8} style={{marginTop: 7}}>
                            <PhoneInput
                                ref='phone'
                                style={{
                                  borderRadius: 30,
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
                          <Block width={width * 0.79} 
                                  style={{borderRadius: 30,
                                    borderColor: nowTheme.COLORS.BORDER,
                                    height: 44,
                                    backgroundColor: '#FFFFFF',
                                    borderWidth: 1,
                                    borderColor: this.state.SelectSucces ? '#E3E3E3' : nowTheme.COLORS.ERROR,
                                    marginTop: 10
                                  }}>
                            <RNPickerSelect
                                onValueChange={(value) => {this.updateInputVal(value, 'idProject');}}
                                Icon={
                                  () => {
                                    return (
                                      <Icon
                                        size={12}
                                        color="black"
                                        name="caretdown"
                                        family="antdesign"
                                        style={{ marginTop: 13, 
                                                 marginRight: 18,
                                                 borderWidth: 1,
                                                 borderColor:"transparent",
                                                 borderRadius: 21.5}}
                                      />
                                    )
                                  }
                                }
                                placeholder={{
                                  label: 'Sélectioner un projet...',
                                  value: null,
                                  color: '#8898AA',
                                }}
                                doneText= {'choisir'}
                                style={{     
                                        placeholder: {
                                          color:'#8898AA',
                                          marginLeft: Platform.OS === 'android' ? 25 : 40, 
                                          fontSize: Platform.OS === 'android' ? 5 : 16, 
                                          marginTop: Platform.OS === 'android' ? -2 : 12
                                        },
                                        inputAndroid: {
                                          color: 'black',
                                          fontFamily: 'montserrat-regular',
                                          fontSize: 5,
                                          marginTop: -3,
                                          fontWeight: '100',
                                          marginLeft: 28,       
                                        },
                                        inputIOS:{
                                          color: 'black',
                                          //fontFamily: 'montserrat-regular',
                                          marginTop: 15,
                                          fontSize: 15,
                                          marginLeft: 40,
                                        }  
                                }}
                                items={this.state.list}
                                
                              />
                          </Block>
                          <Block center style={{marginTop:height < 812 ? 20 : 45}}>
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
                                Ajouter
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
          </ImageBackground>
        </Block>
      </KeyboardAvoidingView>
      </TouchableWithoutFeedback>

     
    );
  }
}

const styles = StyleSheet.create({
  imageBackgroundContainer: {
    width: width,
    height: height,
    zIndex: 1
  },
  imageBackground: {
    width: width,
    height: height
  },
  registerContainer: {
    marginTop: height < 812 ? 10 : 40,
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
    backgroundColor: 'transparent'
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
});

export default Register;
