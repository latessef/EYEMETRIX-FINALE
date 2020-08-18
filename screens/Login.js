import React from 'react';
import { 
  ImageBackground, 
  Image, 
  StyleSheet, 
  StatusBar, 
  Dimensions, 
  View,
  Platform,
  TouchableWithoutFeedback, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Alert, 
  TextInput 
} from 'react-native';
import { Block, Checkbox, Text, Button as GaButton, theme, Input as GaInput } from 'galio-framework';
import { Button, Icon, Input} from '../components';
import { LinearGradient } from 'expo-linear-gradient';
const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';
import Loading from 'react-native-whc-loading';
import firebase from '../database/firebase';



export default class Login extends React.Component {
  constructor() {
    super();
    this.state = { 
      email: '', 
      password: '',
      isLoading: false,
      errorLogin:'',
      icon: "eye-with-line",
      passwordShow: true,
      loginSucces: true,
      PasswordSucces: true,
    }
  }

  

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }


  userLogin = () => {
    this.refs.loading.show();
    if(this.state.email === '' && this.state.password === '')  {
      this.refs.loading.close();
      Alert.alert("Echec !",'Veuilez remplir les champs')
    } 
    else {
      this.setState({
        errorLogin:''
      })
      firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        if(res.user.emailVerified=== true){
        console.log(res)
        console.log('User logged-in successfully!')
        this.setState({
          email: '', 
          password: '',
          errorLogin:'',
          loginSucces: true,
          PasswordSucces: true,
        })
        this.refs.loading.close();
        this.props.navigation.navigate('Home')
      }
      else {
        this.refs.loading.close();
        this.setState({
          loginSucces: false,
          PasswordSucces: true
        })
        Alert.alert("Echec !","Verifier votre email")
      }
      })
      .catch((error) =>
      {
            this.refs.loading.close();
            var errorCode = error.code;
            var errorMessage = 'Cet utilisateur n\'existe pas';
            if (errorCode === 'auth/wrong-password') {
              this.setState({
                loginSucces: true,
                PasswordSucces: false,
              })
              Alert.alert("Echec !",'Mot de passe incorrect.');
            } 
            else {
              this.setState({
                loginSucces: false,
                PasswordSucces: true
              })
              Alert.alert(errorMessage);
            }
      })
      
    }
  }

  ChangeIcon () {
    this.setState(prevState => ({
      icon: prevState.icon === 'eye' ? 'eye-with-line': 'eye',
      passwordShow: ! prevState.passwordShow
    }))
  }

  render() {
    const { navigation } = this.props;
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}  behavior={Platform.OS === 'ios' ? 'padding' : undefined}> 
        <Block flex style={styles.container}>
          <StatusBar barStyle="light-content" />
          <Block flex middle>
            <ImageBackground
              source={Images.Onboarding}
              style={styles.imageBackgroundContainer}
              imageStyle={styles.imageBackground}
            >
              <Block flex >
            <Block style={styles.registerContainer} >
            <Block flex={1}  space="between">
                      <Block center flex={1}>
                        <Block flex space="between"  style={{ marginTop: 130}}>
                        <Block center>
                          <Block>
                            <Image source={Images.Logo} style={styles.logo}></Image>
                          </Block>
                          <Block width={width * 0.8} style={{marginTop: height < 812 ? 0 : 50}}>
                          <Text
                                style={{
                                    fontFamily: 'montserrat-regular',
                                    textAlign: 'center',
                                    marginBottom: 20,
                                    color: 'black'
                                    }}
                                muted
                                size={25}
                            >
                                      SIGN IN
                            </Text>
                              <Input
                                placeholder="Email"
                                type='email-address'
                                style= {{ borderWidth: 1,
                                          borderColor: this.state.loginSucces ? '#E3E3E3' : nowTheme.COLORS.ERROR,
                                          borderRadius: 5}}
                                iconContent={
                                  <Icon
                                    size={16}
                                    color="#ADB5BD"
                                    name="user"
                                    family="Entypo"
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
                                              borderRadius: 5, backgroundColor: 'white'}}>
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
                                      placeholder=" Password"
                                      placeholderTextColor = '#8898AA'
                                      value={this.state.password}
                                      onChangeText={(val) => this.updateInputVal(val, 'password')}
                                    />
                                  </View>
                                <TouchableWithoutFeedback onPress= {() => this.ChangeIcon()}>
                                  <Icon
                                      size={20}
                                      color="#ADB5BD"
                                      name={this.state.icon}
                                      family="Entypo"
                                      style={{marginTop: 10, marginRight: 20,color: nowTheme.COLORS.ICON_INPUT}}
                                      
                                    />
                                </TouchableWithoutFeedback>
                              </View>
                            </Block>
                            <Block center style={{marginTop:height < 812 ? 20 : 30}}>
                      
                              <Button style={styles.ButtonStyle}  
                                onPress={() => {this.userLogin()}} > 
                                    <Text
                                    style={{ fontFamily: 'montserrat-bold' }}
                                    size={14}
                                    color={nowTheme.COLORS.WHITE}
                                  >
                                  Se Connecter
                                  </Text> 
                              </Button>
                            </Block>
                            <TouchableOpacity center style={{marginTop:height < 812 ? 15 : 20}}
                                  onPress={()=>  navigation.navigate('ForgotPassword')}>
                                    <Text
                                        style={{
                                            fontFamily: 'montserrat-regular',
                                            textAlign: 'center',
                                            color: '#363636'
                                            }}
                                        muted
                                        size={14}
                                    >
                                        Mot de passe oublié ?
                                  </Text>
                              </TouchableOpacity>
                              <Loading 
                                ref="loading"
                                backgroundColor='transparent'
                                borderRadius={5}
                                size={70}
                                imageSize={40}
                                indicatorColor={nowTheme.COLORS.PRIMARY}
                                easing={Loading.EasingType.ease}
                              />
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
    backgroundColor: nowTheme.COLORS.BLACK,
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0
  },
  logo: {
    height: 70,
    width: 130
  },
  imageBackgroundContainer: {
    width: width,
    height: height * 0.8,
    //padding: 0,
    zIndex: 1
  },
  ButtonStyle:{
    marginTop:5,
    alignSelf:'center',
    //width: width - nowTheme.SIZES.BASE * 4,
    height: nowTheme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
    borderRadius: 5,
    width: width* 0.8 
   },
  imageBackground: {
    width: width,
    height: height
  },
  padded: {
    paddingHorizontal: nowTheme.SIZES.BASE * 2,
    zIndex: 3,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? nowTheme.SIZES.BASE * 2 : nowTheme.SIZES.BASE * 3
  },
  button: {
    width: width - nowTheme.SIZES.BASE * 4,
    height: nowTheme.SIZES.BASE * 3,
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
    marginTop: height < 812 ? 140 : 120,
    marginBottom: 20,
    marginTop: 150,
    width: width,
    height: height < 812 ? height * 0.75 : height * 0.8 ,
    backgroundColor: 'white',
    borderRadius: 40,
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
  },
});
