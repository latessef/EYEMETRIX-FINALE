import React from "react";
import { StyleSheet,
   Dimensions, 
   ScrollView,
   TouchableOpacity,
   View
} from "react-native";
import { Block, theme, Text } from "galio-framework";
import { Card, Button } from "../components";
import articles from "../constants/articles";
import firebase from "../database/firebase";
const { width } = Dimensions.get("screen");

class Articles extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  UNSAFE_componentWillMount (){
    const newArray = [];
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid).orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var key = childSnapshot.key;
          var childData = childSnapshot.val().nom;
          const obj = {'key' : key, 'nom': childData, 'cta': 'Voir les rapports','image': require("../assets/imgs/bg40.jpg")}
          newArray.push(obj);
          this.setState({
            list: newArray,
          });
        });
      });
  }

  renderArticles = () => {     
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block flex>
          {this.state.list.map((item) => (
            <TouchableOpacity key={item.key} onPress={() => this.props.navigation.push('Surveillance',{id : item.key})}>
               <Card key={item.key} item={item} horizontal/>
            </TouchableOpacity>
          ))}
        </Block>
      </ScrollView>
    )
  };
 
  render() {
    return (
      <Block flex center style={styles.home}>
          {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'

  }
});

export default Articles;
