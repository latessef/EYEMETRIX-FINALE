import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, View } from "react-native";
import { Block, Text } from "galio-framework";
import  {CardSurv}  from "../components";
import { nowTheme } from '../constants';
import firebase from "../database/firebase"
const { width } = Dimensions.get("screen");

export default class SurveillanceUser extends React.Component {
  constructor (){
    super();
    this.state = {
      list : [],
      type : '',
      admin : '',
      project : '',
      isLoading : true,
    }
  }
  _isMounted = false;
  UNSAFE_componentWillMount = async () => {
   this._isMounted = true;
        await firebase.database().ref(`users/`+firebase.auth().currentUser.uid).on('value', snapshot => {
          if (this._isMounted) { 
             this.setState({
                type : snapshot.val().type,
            });}
        });
        await firebase.database().ref(`users/`+firebase.auth().currentUser.uid+`/idAdmin/`).once('value', snapshot => {
          if (this._isMounted) { 
             this.setState({
                admin : snapshot.val(),
            });}
        });
        await firebase.database().ref(`users/`+firebase.auth().currentUser.uid+`/idProject/`).once('value', snapshot => {
          if (this._isMounted) {
            this.setState({
                project : snapshot.val(),
            });}
        });
        const newArray = [];
        var query = firebase.database().ref(`projects/`+this.state.admin+`/`+this.state.project+`/flux/`).orderByKey();
        query.once("value")
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
              var key = childSnapshot.key;
              var sortants = childSnapshot.val().sortants;
              var entrants = childSnapshot.val().entrants;
              var date = childSnapshot.val().date;
              var personnes = childSnapshot.val().personnes;
              const obj = {'key' : key, 'Entrants': entrants, 'Sortants': sortants, 'date': date,'cta': "Detail sur les personnes", 'personnes' : personnes}
              newArray.navigate(obj);
            });
            if (this._isMounted) {  this.setState({
              list: newArray,
              isLoading : false
          });}
        });
      
  }
 componentWillUnmount() {
  this._isMounted = false;
//     this.focusListener.remove();
  }
  renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block flex>
          {this.state.list.map((item) => (
               <CardSurv key={item.key} item={item} horizontal/>
          ))}
        </Block>
      </ScrollView>
    );
  };

  render() {
    const { navigation } = this.props;
    if(this.state.isLoading)
    {
      return(
        <View>
          <ActivityIndicator
            color = {nowTheme.COLORS.PRIMARY}
            sizec = "large"
            animating = {true}
          />
        </View>
      )
    }else{
      return (
        <Block flex center style={styles.home}>
          {this.renderArticles()}
        </Block>
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

