import React from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, Dimensions, View,
        Platform,TouchableHighlight, TouchableOpacity, KeyboardAvoidingView, 
        Alert,ActivityIndicator } from 'react-native';
import { Block, Checkbox, Text, Button as GaButton, theme, Input as GaInput } from 'galio-framework';
import { Button, Icon, Input } from '../components';
import { LinearGradient } from 'expo-linear-gradient';
const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants';
import { HeaderHeight } from '../constants/utils';
import Loading from 'react-native-whc-loading';
import firebase from '../database/firebase';



export default class ForgotPassword extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email:'',
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  handlePasswordReset = (email) => {
    this.refs.loading.show();
    if(email === ''){
      this.refs.loading.close();
      Alert.alert("Echec !",'Veuilez remplir le champ par votre email');
    }
    else{
      firebase.auth().sendPasswordResetEmail(email, null)
      .then(() => {
        // Password reset email sent.
        this.refs.loading.close();
        Alert.alert("Succés !",'Consultez votre boite email pour réintialiser votre mot de passe.');
        this.setState({
          email: '', 
        })
        this.props.navigation.navigate('Login')
      })
      .catch((error) => {
        this.refs.loading.close();
        Alert.alert("Echec !",'Email non valide ou n\'existe pas.');
        // Error occurred. Inspect error.code.
      });
    } 
  }

  render() {
    const { navigation } = this.props;
    if(this.state.isLoading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }    

    return (
      // <KeyboardAvoidingView  style={{ flex: 1 }} behavior={"padding"}>
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Loading show={false}/>
        <Block flex middle>
          <ImageBackground
            source={Images.Onboarding}
            style={styles.imageBackgroundContainer}
            imageStyle={styles.imageBackground}
          >
            <Block flex middle>
          <Block style={styles.registerContainer} >
          <Block flex={1} middle space="between">
                    <Block center flex={1}>
                      <Block flex space="between"  style={{ marginTop: 130}}>
                      <Block center>
                        <Block width={width * 0.8} style={{marginTop: 50}}>
                            
                            <Input
                              placeholder="Email"
                              type='email-address'
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
                              value={this.state.email}
                              onChangeText={(val) => this.updateInputVal(val, 'email')}
                            />
                          </Block>
                          <Block center style={{marginTop:height < 812 ? 20 : 30}}>
                          <LinearGradient
                            colors={[nowTheme.COLORS.PRIMARY, nowTheme.COLORS.TEXT]}
                            style={{ padding: 15, alignItems: 'center', borderRadius: 25,width:200 }}>
                            <TouchableOpacity color="transparent" round style={{alignItems: "center"}}
                              onPress={() => this.handlePasswordReset(this.state.email)}>
                              <Text
                                style={{ fontFamily: 'montserrat-bold' }}
                                size={14}
                                color={nowTheme.COLORS.WHITE}
                              >
                              Confirmer
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
                          </LinearGradient>
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
      // </KeyboardAvoidingView>
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
    height: height*0.90,
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
    marginTop: height < 812 ? 140 : 200,
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
