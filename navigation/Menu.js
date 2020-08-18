import React, { useState }from 'react';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import {NativeModules, navigation, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, Alert,ActivityIndicator, Modal, View} from 'react-native';
import { Block, theme } from 'galio-framework';
import Icon from '../components/Icon';
import { DrawerItem } from '../components/index';
import firebase from '../database/firebase';
import nowTheme from '../constants/Theme';
import { Images } from '../constants';
// import Loading from 'react-native-whc-loading';

const { width } = Dimensions.get('screen');


//fonction de déconnexion
const signOut = (props) => {
  firebase.auth().signOut().then(() => {
    props.navigation.navigate('Login')
  })
  .catch((error) => {
    errorMessage = error.message
    Alert.alert("Erreur !",errorMessage);
  })
} 

//fonction de naviguation au feedback
const feedback = (props) => {
    props.navigation.navigate('Feedback')
} 


const Drawer = props => (
  <Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
    <Block style={styles.header}>
      <Image source={Images.LogoText} style={styles.logo}  />
      <Block right style={styles.headerIcon}>
        <Icon name="align-left-22x" family="NowExtra" size={15} color={'black'} />
      </Block>
    </Block>
    <Block flex>
      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <DrawerNavigatorItems {...props} />
        <TouchableOpacity  onPress={() => {signOut(props);props.navigation.closeDrawer();}}
          style={{ marginLeft: 10, fontFamily: 'montserrat-regular' }}
        >
          {/* <Loading 
            // ref="loading"
            backgroundColor='transparent'
            borderRadius={5}
            size={70}
            imageSize={40}
            indicatorColor={nowTheme.COLORS.PRIMARY}
            easing={Loading.EasingType.ease}
            show={true}
          /> */}
          <DrawerItem {...props} title="Se déconnecter" />
        </TouchableOpacity>
        <TouchableOpacity  
          style={{ marginLeft: 10, fontFamily: 'montserrat-regular' }}
          onPress = {() => feedback(props)}
           
        >
          <DrawerItem {...props} title="Feedback" />
        </TouchableOpacity>
      </ScrollView>
    </Block>
  </Block>
);

const Menu = {
  contentComponent: props => <Drawer {...props} />,
  drawerBackgroundColor: nowTheme.COLORS.WHITE,
  drawerWidth: width * 0.8,
  contentOptions: {
    activeTintColor: nowTheme.COLORS.GRIS,
    inactiveTintColor: nowTheme.COLORS.GRIS,
    activeBackgroundColor: 'transparent',
    itemStyle: {
      width: width * 0.75,
      backgroundColor: 'transparent'
    },
    labelStyle: {
      fontSize: 18,
      marginLeft: 12,
      fontWeight: 'normal'
    },
    itemsContainerStyle: {
      paddingVertical: 16,
      paddingHorizonal: 12,
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      overflow: 'hidden'
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 28,
    paddingBottom: theme.SIZES.BASE,
    paddingTop: theme.SIZES.BASE,
    justifyContent: 'center'
  },
  headerIcon: {
    marginTop: -20
  },
  logo: {
    height: 24,
    width: 143
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 4,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: width * 0.9,
  },
});

export default Menu;
