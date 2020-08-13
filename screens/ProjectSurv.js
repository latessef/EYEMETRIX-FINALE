import React from "react";
import { StyleSheet,
   Dimensions, 
   ScrollView,
   TouchableOpacity,
   View,
} from "react-native";
import { Block, Text } from "galio-framework";
import { nowTheme } from '../constants';
import { CardProj } from "../components";
import SurveillanceUser from './SurveillanceUser';
import firebase from "../database/firebase";
const { width } = Dimensions.get("screen");
import Loading from 'react-native-whc-loading';
import {NavigationActions } from 'react-navigation';
import { CommonActions } from '@react-navigation/native';






class ProjectSurv extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      type : '',
    };
  }

  UNSAFE_componentWillMount (){
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      firebase.database().ref(`users/`+firebase.auth().currentUser.uid).on('value', snapshot => {
          this.setState({
              type : snapshot.val().type,
          });
      });
      const newArray = [];
      var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid).orderByKey();
      query.once("value")
        .then((snapshot) => {
          snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var childData = childSnapshot.val().nom;
            var image = require("../assets/imgs/cafe.jpg");

             switch(childSnapshot.val().category){
               case 'cafe': image = require("../assets/imgs/cafe.jpg"); break;
               case 'resturant':  image = require("../assets/imgs/ia2.jpg"); break;
               default : image = require("../assets/imgs/4.jpg");
             }
           

            const obj = {'key' : key, 'nom': childData, 'cta': "Voir surveillance",'image': image}
            newArray.push(obj);
            this.setState({
              list: newArray,
            });
        });
      });
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
  goToSurveillance = (key) =>{
    this.refs.loading.show(true);
    setTimeout(() => {
      this.refs.loading.close();
      this.props.navigation.push('Surveillance', {id : key});
      // this.props.navigation.navigate('Surveillance');
      // const setParamsAction = NavigationActions.setParams({
      //   params: {id: key},
      //   key: 'Surveillance',
      // });
      // this.props.navigation.replace({routeName:'Surveillance', params :{id : key}});
    },50); 
  }
  renderArticles = () => {     
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block flex>
          {this.state.list.map((item) => (
            <TouchableOpacity key={item.key} onPress={() => this.goToSurveillance(item.key)}>
               <CardProj key={item.key} item={item} horizontal/>
            </TouchableOpacity>
          ))}
        </Block>
        <Loading 
          ref="loading"
          backgroundColor='transparent'
          borderRadius={5}
          size={70}
          imageSize={40}
          indicatorColor={nowTheme.COLORS.PRIMARY}
          easing={Loading.EasingType.ease}
        />
      </ScrollView>
    )
  };
 
  render() {
    if(this.state.type === "admin"){
      return (
        <Block flex center style={styles.home}>
            {this.renderArticles()}
        </Block>
        
      );
    }else{
        return (
          <SurveillanceUser/>

        );
    } 
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  articles: {
    width: width - nowTheme.SIZES.BASE * 2,
    paddingVertical: nowTheme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'

  }
});

export default ProjectSurv;
