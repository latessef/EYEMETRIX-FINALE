import React from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, ImageBackground, Platform, View, Alert,RefreshControl} from 'react-native';
import { Block, Text, Button as GaButton } from 'galio-framework';
import { Images, nowTheme } from '../constants';
import Icon from '../components/Icon';
import { Avatar } from 'react-native-elements';
import firebase from '../database/firebase';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Loading from 'react-native-whc-loading';

const { width, height } = Dimensions.get('screen');

const thumbMeasure = (width - 72) / 3;


export default class Profile extends React.Component {
  constructor(){
    super();
    this.state = {
      userId : '', 
      displayName: '',
      email : '',
      phoneNumber: '',
      avatar: null,
      photoURL:'hello word',
    }
  }
  
  UNSAFE_componentWillMount = async () => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getUserInfo();
      this.getPermissionAsync();
    })
  }

  componentDidMount = async () => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', () => {
      this.getUserInfo();
      this.getPermissionAsync();
    })
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }
  
  _onRefresh() {
    this.setState({refreshing: true});
    fetchData().then(() => {
      this.setState({refreshing: false});
    });
  }

  getUserInfo = async () => {
    this.refs.loading.show();
    await firebase.storage().ref().child("ProfilePictures/"+firebase.auth().currentUser.uid).getDownloadURL().then((url) => {
        this.setState({photoURL: url});
    }).catch((error) => {
       firebase.storage().ref().child("ProfilePictures/userLogo.png").getDownloadURL().then((url) => {
        this.setState({photoURL: url});
    })
    });
    this.setState({
        userId : firebase.auth().currentUser.uid,
        displayName: firebase.auth().currentUser.displayName,
        email : firebase.auth().currentUser.email,
    }); 
    await firebase.database().ref(`users/`+firebase.auth().currentUser.uid+`/phone`).on('value', snapshot => {
      this.setState({
        phoneNumber : snapshot.val(),
      });
    });
    this.refs.loading.close();
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        Alert.alert("Echec !",'Désolé, nous avons besoin de votre permission pour que cela fonctionne!');
      }
    }
  };

  _pickImage = async () => {
    try {
      this.refs.loading.show();
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
       if (!result.cancelled) {
        this.setState({ avatar: result.uri });
        this.uploadImage(result.uri, this.state.userId)
        .then(() => {
          this.refs.loading.close();
          Alert.alert("Succés !","Photo de profile modifié ");
        })
        .catch((error) => {
          this.refs.loading.close();
          Alert.alert(error);
        });
          console.log(result.uri);
      }
      this.refs.loading.close();
     } catch (E) {
        console.log(E);
    }
  };

  uploadImage = async (uri, imageName) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    var ref = await firebase.storage().ref().child("ProfilePictures/" + imageName);
    return ref.put(blob);
  }

  showImage = () => {
    if(this.state.avatar === null){
      return this.state.photoURL;
    }
    else{
      return this.state.avatar;
    }
  }

  render() {
    return (
      <Block style={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
      }} >
        <Block flex={0.6} >
          <ImageBackground
            source={Images.ProfileBackground}
            style={styles.profileContainer}
            imageStyle={styles.profileBackground}
          >
            <Block flex style={styles.profileCard}>
              {/* image d'utilisateur */}
              <Block style={{ position: 'absolute', width: width, paddingHorizontal: 20 }}>
                <Block middle style={{ top: height * 0.15}}>
                  <Avatar 
                    source={{uri : this.showImage()}}
                    style={styles.avatar} 
                    rounded
                    size={110}
                    showEditButton
                    onPress={() => this._pickImage()}
                  />
                </Block>
              </Block>
            </Block>
            <Block flex={1.5} style={{ padding: nowTheme.SIZES.BASE, marginTop: 1}}>
          <ScrollView showsVerticalScrollIndicator={false} >
          <Block flex style={{ marginTop: 1 }}>
          <View style={styles.view}>
                <Icon
                  size={20}
                  color={nowTheme.COLORS.PRIMARY}
                  name="user"
                  family="Entypo"
                  style={{ opacity: 0.5 }} />
                  <Text style={styles.text}>{this.state.displayName}</Text>
            </View>
            <Block
              style={{ borderColor: nowTheme.COLORS.WHITE, width: '93%', borderWidth: StyleSheet.hairlineWidth, marginHorizontal: 10}}
          />
            <View style={styles.view}>
                <Icon
                  size={20}
                  color={nowTheme.COLORS.PRIMARY}
                  name="mail"
                  family="Entypo"
                  style={{ opacity: 0.5 }} />
                  <Text style={styles.text}>{this.state.email}</Text>
            </View>
            <Block
              style={{ borderColor: nowTheme.COLORS.WHITE, width: '93%', borderWidth: StyleSheet.hairlineWidth, marginHorizontal: 10}}
            />
            <View style={styles.view}>
                <Icon
                  size={20}
                  color={nowTheme.COLORS.PRIMARY}
                  name="phone"
                  family="Entypo"
                  style={{ opacity: 0.5 }}
                  />
                  <Text style={styles.text} >{this.state.phoneNumber}</Text>
            </View>
            <Loading 
              ref="loading"
              backgroundColor='transparent'
              borderRadius={5}
              size={70}
              imageSize={40}
              indicatorColor={nowTheme.COLORS.PRIMARY}
              easing={Loading.EasingType.ease}
            />
            <Block
              style={{ borderColor: nowTheme.COLORS.WHITE, width: '93%', borderWidth: StyleSheet.hairlineWidth, marginHorizontal: 10}}
            />
          </Block>           
          </ScrollView>
        </Block>
          </ImageBackground>
        </Block>
        
      </Block>

  );
  }
}




const styles = StyleSheet.create({

  profileContainer: {
    width,
    height,
    padding: 0,
  },
  profileBackground: {
    width: width,
    height: height * 0.82
  },

  info: {
    marginTop: 30,
    paddingHorizontal: 10,
    height: height * 0.8
  },
  avatarContainer: {
    position: 'relative',
    marginTop: -80
    
  },
  avatar: {
    width: thumbMeasure,
    height: thumbMeasure,
    borderRadius: 50,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  social: {
    width: nowTheme.SIZES.BASE * 3,
    height: nowTheme.SIZES.BASE * 3,
    borderRadius: nowTheme.SIZES.BASE * 1.5,
    justifyContent: 'center',
    zIndex: 99,
    marginHorizontal: 5
  },
  text : {
    fontFamily: 'montserrat-regular',
    fontWeight: "200",
    color: nowTheme.COLORS.BLACK,
    fontSize: 15,
    marginLeft : 20
  },
  view :{
    margin : 20,
    flexDirection : 'row'
  }
});

