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
const { width } = Dimensions.get("screen");
import nowTheme from "../constants/Theme"
import Loading from 'react-native-whc-loading';



class ProjectCal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      type : '',
      loading: false,
    };
  }

  UNSAFE_componentWillMount = async () =>{
    this.focusListener = this.props.navigation.addListener('didFocus', async () => {
      firebase.database().ref(`users/`+firebase.auth().currentUser.uid+`/type`).on('value', snapshot => {
        this.setState({
          type : snapshot.val(),
        });
      });
      var newArray = [];
      var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid).orderByKey();
      query.on('value', snapshot => {
          newArray = [];
          snapshot.forEach((childSnapshot) => {
            var key = childSnapshot.key;
            var childData = childSnapshot.val().nom;
            const obj = {'key' : key, 'nom': childData, 'cta': "Ajouter l'horaire",'image': require("../assets/imgs/cafe.jpg")}
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
  
  goToCalendar = async (key) =>{
    this.refs.loading.show();
    setTimeout(() => {
      this.refs.loading.close();
      this.props.navigation.push('Calendar',{id : key});
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
            <TouchableOpacity key={item.key} activeOpacity = {0.6} onPress={() => this.goToCalendar(item.key) }>
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
    if(this.state.type === "admin"){
      return (
        <Block flex center style={styles.home}>
            {
              this.renderArticles()
            }
        </Block>
      );
    }else{
      return(
        <Block>
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
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
    fontFamily: 'montserrat-regular'

  }
});

export default ProjectCal;
