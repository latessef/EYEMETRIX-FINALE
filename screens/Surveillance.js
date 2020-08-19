import React from "react";
import { StyleSheet, Dimensions, ScrollView, ActivityIndicator, View } from "react-native";
import { Block, Text } from "galio-framework";
import  {CardSurv}  from "../components";
import { nowTheme } from '../constants';
import firebase from "../database/firebase"
const { width } = Dimensions.get("screen");

class Surveillance extends React.Component {
  constructor (){
    super();
    this.state = {
      list : [],
      isLoading : true,
    }
  }
  UNSAFE_componentWillMount = async () => {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('didFocus', async () => {
      // const { params } = this.props.navigation.state;
      // const id = params ? params.id : null;
      const id = navigation.getParam('id');
      // console.log(JSON.stringify(this.props.navigation.state.params))
      // console.log(id)
      var query = await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+id+`/flux/`).orderByKey();
      var newArray = [];
      var counter ;
      query.on('value', snapshot => {
          newArray = [];
          counter = 0;
          snapshot.forEach((childSnapshot) => {
            var date = childSnapshot.key;
          if(date !== 'entrants' && date !== 'sortants'){
              var sortants = childSnapshot.child('personnes').child('sortants').numChildren();
              var entrants = childSnapshot.child('personnes').child('entrants').numChildren();
              var personnes = [];
              childSnapshot.child('personnes').child('sortants').forEach( per => {
                personnes.push({'key': per.key, 'name': per.val(), 'action': 'Sortie'});
              })
              childSnapshot.child('personnes').child('entrants').forEach( per => {
                personnes.push({'key': per.key, 'name': per.val(), 'action': 'Entrée'});
              })
              personnes.sort((a,b) => (a.key > b.key) ? 1 : -1)
              const obj = {'key' : counter++, 'Entrants': entrants, 'Sortants': sortants, 'date': date,'cta': "Detail sur les personnes", 'personnes' : personnes}
              newArray.push(obj);
          }
              });
          this.setState({
            list: newArray,
            isLoading : false,
          });
        });
    });
  }
  
  componentWillUnmount() {
    this.focusListener.remove();
  }

  renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block flex>
          {this.state.list.map((item,index) => (
               <CardSurv key={index} item={item} horizontal/>
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
           <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.articles}
          >
            <Block flex>
              {this.state.list.map((item,index) => (
                  <CardSurv key={index} item={item} horizontal/>
              ))}
            </Block>
          </ScrollView>
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

export default Surveillance;
