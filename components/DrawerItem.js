import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Icon from './Icon';
import nowTheme from '../constants/Theme';
import firebase from '../database/firebase'

class DrawerItem extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      type : '',
    }
  }

  UNSAFE_componentWillMount = async () =>{
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref(`users/`+firebase.auth().currentUser.uid).on('value', snapshot => {
          this.setState({
              type : snapshot.val().type,
          });
        });
      } else {
        // No user is signed in.
      }
      
    })
  }
  
  renderIcon = () => {
    const { title, focused } = this.props;

    switch (title) {
      case 'Accueil':
        return (
          <Icon
            name="home"
            family="AntDesign"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
            style={{ opacity: 0.5 }}
            />
        );
      case 'Paramètres':
        return (
          <Icon
            name="settings"
            family="Feather"
            size={18} color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
            style={{ opacity: 0.5 }}
            />
        );
      case 'Rapports':
        return (
          <Icon
            name="folderopen"
            family="AntDesign"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
            style={{ opacity: 0.5 }}
            />
        );
      case 'Profile':
        return (
          <Icon
            name="user"
            family="EvilIcons"
            size={28}
            color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
            style={{ opacity: 0.5 }}
            />
        );
      case 'Ajouter utilisateur':
        return (
          <Icon
            name="adduser"
            family="AntDesign"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
            style={{ opacity: 0.5 }}
            />
        );
      case 'Mes projets':
        return (
          <Icon
            name="addfolder"
            family="AntDesign"
            size={18}
            color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
            style={{ borderColor: 'rgba(0,0,0,0.5)', opacity: 0.5 }}
          />
        );
      case 'Surveillance':
        return (
          <Icon
            name="videocamera"
            family="AntDesign"
            size={18}
            style={{ borderColor: 'rgba(0,0,0,0.5)', opacity: 0.5 }}
            color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
          />
        );
      case 'Calendrier business':
        return (
          <Icon
            name="calendar"
            family="AntDesign"
            size={18}
            style={{ borderColor: 'rgba(0,0,0,0.5)', opacity: 0.5 }}
            color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
          />
        );
      case 'Feedback':
        return (
          <Icon
            name="feedback"
            family="MaterialIcons"
            size={18}
            style={{ borderColor: 'rgba(0,0,0,0.5)', opacity: 0.5 }}
            color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
          />
        );
      case 'Se déconnecter':
        return (
          <Icon
            name="logout"
            family="AntDesign"
            size={18}
            style={{ borderColor: 'rgba(0,0,0,0.5)', opacity: 0.5 }}
            color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { focused, title } = this.props;

    const containerStyles = [
      styles.defaultStyle,
      focused ? [styles.activeStyle, styles.shadow] : null
    ];
    if(this.state.type === "admin"){
      return (
        <Block flex row style={containerStyles}>
          <Block middle flex={0.1} style={{ marginRight: 5 }}>
            {this.renderIcon()}
          </Block>
          <Block row center flex={0.9}>
            <Text
              style={{ fontFamily: 'montserrat-regular', textTransform: 'uppercase', fontWeight: '300' }}
              size={12}
              bold={focused ? true : false}
              color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
            >
              {title}
            </Text>
          </Block>
        </Block>
      );
    }else{
      if(title != "Calendrier business" && title != "Mes projets" && title != "Ajouter utilisateur"){
        return(
          <Block flex row style={containerStyles}>
            <Block middle flex={0.1} style={{ marginRight: 5 }}>
              {this.renderIcon()}
            </Block>
            <Block row center flex={0.9}>
              <Text
                style={{ fontFamily: 'montserrat-regular', textTransform: 'uppercase', fontWeight: '300' }}
                size={12}
                bold={focused ? true : false}
                color={focused ? nowTheme.COLORS.PRIMARY : 'black'}
              >
                {title}
              </Text>
            </Block>
          </Block>
        );
      }else{
        return(
          <View disable>
           
          </View>
        );
       }
      }
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 15,
    paddingHorizontal: 14,
    color: 'black'
  },
  activeStyle: {
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 30,
    color: 'black'
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
