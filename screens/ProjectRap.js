import React from "react";
import { StyleSheet,
   Dimensions, 
   ScrollView,
   TouchableOpacity,
   View
} from "react-native";
import { Block, theme, Text } from "galio-framework";
import { CardProj } from "../components";
import firebase from "../database/firebase";
import nowTheme from "../constants/Theme"
import Loading from 'react-native-whc-loading';
const { width } = Dimensions.get("screen");

class ProjectRap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  UNSAFE_componentWillMount (){
    this.focusListener = this.props.navigation.addListener('didFocus', async () => {
      var newArray = [];
      var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid).orderByKey();
      query.on('value', snapshot => {
          newArray = [];
          snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var childData = childSnapshot.val().nom;
            const obj = {'key' : key, 'nom': childData, 'cta': "Voir rapports",'image': require("../assets/imgs/cafe.jpg")}
            newArray.push(obj);
            this.setState({
              list: newArray,
            });
          });
        });
    })
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  goToRapport = async (key) =>{
    this.refs.loading.show();
    setTimeout(() => {
      this.refs.loading.close();
      this.props.navigation.push('Rapports',{id : key});
    }, 100); 
  }

  renderArticles = () => {     
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        <Block flex>
          {this.state.list.map((item) => (
            <TouchableOpacity key={item.key} onPress={() => this.goToRapport(item.key)}>
               <CardProj key={item.key} item={item} horizontal/>
            </TouchableOpacity>
          ))}
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

export default ProjectRap;
