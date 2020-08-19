import React from 'react';
import { withNavigation } from 'react-navigation';
import PropTypes from 'prop-types';
import { StyleSheet, TouchableWithoutFeedback, Image, TouchableOpacity,ScrollView, FlatList, Modal, View, Dimensions} from 'react-native';
import Icon from './Icon';
import { Block, Text} from 'galio-framework';
import Images from '../constants/Images';
import { nowTheme } from '../constants';
const { width } = Dimensions.get("screen");


class CardSurv extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      modalVisible: false,
     
    };
  }

  setModalVisible = (visible) =>{
    this.setState({modalVisible : visible})
  }
 
  Personne = () => {
   const {item} = this.props;
   return (
    <ScrollView>
        <Text style = {styles.Titre}> L(es) entrant(es) / sortant(es) :</Text>
        {item.personnes.map((item,key) => (
          <Text key = {item.key} style = {styles.Per}>{item.key}/ {item.name} : {item.action}</Text>
        ))}
    </ScrollView>

   );}
 
  render() {
    const {
      item,
      horizontal,
      style,
      ctaRight,
    } = this.props;

    const titleStyles = [styles.cardTitle];
    const cardContainer = [styles.card, styles.shadow, style];
   

    return (
    <View>
      <Block row={horizontal} card style={cardContainer} >
        <TouchableWithoutFeedback>
          <Block style={styles.headerIcon}>
            <Image style={styles.icon}
                    source={Images.Chart}/>
          </Block>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback>
          <Block space="between">
            <Block style={styles.cardInfo}>
              <Text
                style={{ fontFamily: 'montserrat-regular' }}
                size={14}
                style={titleStyles}
                color={nowTheme.COLORS.SECONDARY}
              >
                Sortants :{item.Sortants}
              </Text>
              <Text
                style={{ fontFamily: 'montserrat-regular' }}
                size={14}
                style={titleStyles}
                color={nowTheme.COLORS.SECONDARY}
              >
                Entrants : {item.Entrants}
              </Text>
            </Block>
            <Block row right={ctaRight ? true : false}>
              <Text
                style={styles.articleButton}
                size={12}
                color={nowTheme.COLORS.DEFAULT}
                bold
              >
                {item.date}
              </Text>
              <TouchableOpacity onPress = {() => {this.setModalVisible(true)}}>
                <Text
                  style={styles.articleButton}
                  size={12}
                  color={nowTheme.COLORS.PRIMARY}
                  bold
                >
                  {item.cta}
                </Text>
              </TouchableOpacity>
              </Block>
            </Block>
        </TouchableWithoutFeedback>
      </Block>
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
                <this.Personne/>
            </View>
          </View>              
        </Modal>
      </View>
    </View>
    );
  }
}

CardSurv.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  ctaRight: PropTypes.bool,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: nowTheme.COLORS.WHITE,
    marginVertical: nowTheme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 50,
    marginBottom: -25
  },
  cardTitle: {
    paddingHorizontal: 10,
    marginLeft: 0
  },
  cardInfo: {
    flex : 1,
    flexDirection: 'row',
    fontFamily: 'montserrat-regular',
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  articleButton: {
    fontFamily: 'montserrat-bold',
    paddingHorizontal: 9,
    paddingVertical: 7,
    
  },
  headerIcon: {
    marginTop: 3
  },
  shadow: {
    shadowColor: '#8898AA',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2
  },
  icon:{
    width:45,
    height:45,
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
  Titre : {
    fontSize : 16,
    fontFamily : 'montserrat-regular',
    color : nowTheme.COLORS.PRIMARY

  },
  Per : {
    padding : 10,
    paddingLeft : 25,
    fontFamily : 'montserrat-regular',
    // justifyContent : "space-between",
  }
  
});

export default CardSurv;
