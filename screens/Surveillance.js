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
      query.on('value', snapshot => {
          newArray = [];
          snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var sortants = childSnapshot.val().sortants;
            var entrants = childSnapshot.val().entrants;
            var date = childSnapshot.val().date;
            var personnes = childSnapshot.val().personnes;
            const obj = {'key' : key, 'Entrants': entrants, 'Sortants': sortants, 'date': date,'cta': "Detail sur les personnes", 'personnes' : personnes}
            newArray.push(obj);
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
