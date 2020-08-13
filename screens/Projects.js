import React, { useCallback } from "react";
import { 
   StyleSheet,
   Dimensions, 
   ScrollView,
   View,
   Modal,
   TouchableOpacity,
   RefreshControl
} from "react-native";
import { Block, theme} from "galio-framework";
import { CardProj, Icon, AddProject } from "../components";
import firebase from "../database/firebase";
import { Button } from 'react-native-elements';
import { nowTheme } from "../constants";
import Moment from 'moment';

const { width } = Dimensions.get("screen");

class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.setModalVisible = this.setModalVisible.bind(this)
    this.state = {
      modalVisible: false,
      list: [],
      refreshing : false     
    };
  }
  wait(timeout) {
    return new Promise(resolve => {
      setTimeout(resolve, timeout);
    });
  }
  
  
  onRefresh = () =>  {
    this.setState({refreshing : true})
  
    this.wait(2000).then(() => this.setState({refreshing : false}));
  }
  
  

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  UNSAFE_componentWillMount (){
    const newArray = [];
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid).orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var key = childSnapshot.key;
          var childData = childSnapshot.val().nom;
          const obj = {'key' : key, 'nom': childData,'image': require("../assets/imgs/bg40.jpg")}
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
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }
        
      >
        <View style={styles.centeredView}>
          <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
          >                           
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TouchableOpacity 
                  color="transparent" 
                  round style={{alignItems: "flex-end"}}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                  }}
                >
                  <Icon 
                      size={20}
                      color="black"
                      name="close"
                      family="EvilIcons"
                  />
                </TouchableOpacity>
                    <AddProject ref={ref => (this.child = ref)} referenceCallback = {this.setModalVisible.bind(this)}/> 
              </View>
            </View>              
          </Modal>
        </View>
        <Block flex>
          {this.state.list.map((item) => (
               <CardProj key={item.key} item={item} horizontal/>
          ))}
        </Block>
      </ScrollView>
    )
  };
 
  render() {
    return (
      <Block flex center style={styles.home}>
        <Button
           icon={<Icon
            name="plus"
            family="AntDesign"
            size={25}
            color= {nowTheme.COLORS.PRIMARY}
          />}
          type="clear"
          title="Ajouter ton Projet"
          titleStyle = {{color : nowTheme.COLORS.PRIMARY, fontSize: 18, paddingLeft : 10}}
          containerStyle  = {{width: width - 36, paddingVertical : 20, paddingTop : 30 }}
          onPress =  {() => {this.setModalVisible(true)}}
        />
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
    paddingTop : 0,
    fontFamily: 'montserrat-regular'

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
    borderRadius: 35,
    padding: 15,
    
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: width * 0.9,
  },
  
});

export default Projects;
