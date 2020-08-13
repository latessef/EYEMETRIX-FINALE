import React from 'react';
import { Image, BackHandler, Alert } from 'react-native';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import Screens from './navigation/Screens';
import { Images, articles, nowTheme } from './constants';
import Login from './screens/Login';

// cache app images
const assetImages = [
  Images.Onboarding,
  Images.Logo,
  Images.Pro,
  Images.NowLogo,
  Images.iOSLogo,
  Images.androidLogo,
  Images.ProfilePicture,
  Images.CreativeTimLogo,
  Images.InvisionLogo,
  Images.RegisterBackground,
  Images.ProfileBackground
];



// cache product images
articles.map(article => assetImages.push(article.image));

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    fontLoaded: false
  };


  componentDidMount = async () => { 
    await Font.loadAsync({ 
      'montserrat-regular': require('./assets/font/Montserrat-Regular.ttf'), 
      'montserrat-bold': require('./assets/font/Montserrat-Bold.ttf')
     }); 
     this.setState({fontLoaded: true, isLoadingComplete: true});
     this.backHandler = BackHandler.addEventListener( "hardwareBackPress",this.backAction);
  }

  backAction = () => {
    Alert.alert("Attention !", "Voulez-vous vraiment quitter l'application ?", [
      {
        text: "NON",
        onPress: () => null,
        style: "cancel"
      },
      { text: "OUI", onPress: () => BackHandler.exitApp() }
    ]);
    return true;
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <GalioProvider theme={nowTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(assetImages)]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    if (this.state.fontLoaded) {
      this.setState({ isLoadingComplete: true });
    }
  };
}
