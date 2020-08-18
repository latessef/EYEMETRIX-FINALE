import React from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,Modal,View,Dimensions, Alert
} from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";
import { Switch , Icon as CIcon, PasswordChange, NameChange, PhoneChange } from "../components";


import nowTheme from "../constants/Theme";

const { width, height } = Dimensions.get('screen');

export default class Settings extends React.Component {
  constructor(props){
    super(props);
    this.setModalVisible = this.setModalVisible.bind(this)
     this.state = {
        id: '',
        modalVisible: false,
      };
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible : visible}) ;
  }

  setItem = (itemID) => {
    this.setState({ id: itemID });
  }

  
  toggleSwitch = switchNumber =>
    this.setState({ [switchNumber]: !this.state[switchNumber] });

  renderItem = ({ item }) => {
    
    switch (item.type) {
      case "switch":
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text style={{ fontFamily: 'montserrat-regular' }} size={14} color="black">{item.title}</Text>
            <Switch
              onValueChange={() => this.toggleSwitch(item.id)}
              value={this.state[item.id]}
            />
          </Block>
        );
      case "button":
        return (
          <Block style={styles.rows}>
            
            <TouchableOpacity onPress={() => {
              this.setModalVisible(true);
              this.setItem(item.id);
          }}>
              <Block row middle space="between" style={{ paddingTop: 7 }}>
                <Text style={{ fontFamily: 'montserrat-regular' }} size={14} color="black">{item.title}</Text>
                <Icon
                  name="angle-right"
                  family="font-awesome"
                  style={{ paddingRight: 5 }}
                />
              </Block>
            </TouchableOpacity>
          </Block>
        );
      default:
        break;
    }
  };

  itemId  = (id) => {
    
    switch (id) {
      case "NameChange":
        return(
          <NameChange ref={ref => (this.child = ref)} referenceCallback = {this.setModalVisible.bind(this)} />
        );
      case "PasswordChange":
        return(
          <PasswordChange ref={ref => (this.child = ref)} referenceCallback = {this.setModalVisible.bind(this)} />
        );
        case "PhoneChange":
        return(
          <PhoneChange ref={ref => (this.child = ref)} referenceCallback = {this.setModalVisible.bind(this)}/>
        );
  }
 
};

  render() {
    const { id } = this.state;
    const notification = [
      { title: "Compte", id: "Compte", type: "switch" },
      { title: "Rapport", id: "Rapport", type: "switch" },
      { title: "Surveillance", id: "Surveillance", type: "switch" },    
    ];

    const Compte = [
      { title: "Nom et Prénom", id: "NameChange", type: "button" },
      { title: "Numéro de téléphone", id: "PhoneChange", type: "button" }
    ];

    const Securite = [
      { title: "Changer mot de passe", id: "PasswordChange", type: "button" },
    ];

    

    return (
      <View>  
        <View style={styles.centeredView}>
          <Modal 
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible} 
        >                           
          <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TouchableOpacity color="transparent" round style={{alignItems: "flex-end"}}
                                      onPress={() =>{
                                        this.setModalVisible(false)}
                                      }>
                            <Icon 
                                size={20}
                                color="black"
                                name="close"
                                family="EvilIcons"
                                        />
                  </TouchableOpacity>
               {this.itemId(id)} 
                  </View>
              </View>           
        </Modal>       
      </View>

        <FlatList
          data={notification}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
          ListHeaderComponent={
            <Block center style={styles.title}>
              <Text style={{ fontFamily: 'montserrat-bold', paddingBottom: 5 }} size={theme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>
                Paramètres de notifications
              </Text>
              <Text style={{ fontFamily: 'montserrat-regular' }} size={12} color={nowTheme.COLORS.CAPTION} color={nowTheme.COLORS.BLACK}>
                Activer/désactiver les notifications.
              </Text>
            </Block>
          }
        />

        <Block center style={styles.title}>
          <Text style={{ fontFamily: 'montserrat-bold', paddingBottom: 5 }} size={theme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>
            Paramètres du Compte
          </Text>
          <Text style={{ fontFamily: 'montserrat-regular' }} size={12} color={nowTheme.COLORS.CAPTION} color={nowTheme.COLORS.BLACK}>
            Modifier vos informations personnelles
          </Text>
        </Block>
        <FlatList
          data={Compte}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        />
        <Block center style={styles.title}>
          <Text style={{ fontFamily: 'montserrat-bold', paddingBottom: 5 }} size={theme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>
            Sécurité
          </Text>
          <Text style={{ fontFamily: 'montserrat-regular' }} size={12} color={nowTheme.COLORS.CAPTION} color={nowTheme.COLORS.BLACK}>
            
          </Text>
        </Block>
        <FlatList
          data={Securite}
          keyExtractor={(item, index) => item.id}
          renderItem={this.renderItem}
        />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  settings: {
    paddingVertical: theme.SIZES.BASE / 3
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2
  },
  rows: {
    height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2
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
    borderRadius: 20,
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
