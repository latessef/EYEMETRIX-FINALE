import React from 'react';
import {
    StyleSheet,
    TextInput,
    Dimensions,
    PixelRatio, 
    View,
    Alert,
    PanResponder, 
    Animated, 
    TouchableOpacity 
} from 'react-native';

import nowTheme from "../constants/Theme"
import RadioButtonRN from 'radio-buttons-react-native';
import { Block,Text, Button } from 'galio-framework';
import InputScrollView from 'react-native-input-scroll-view';
import firebase from "../database/firebase";
  
const { width, height } = Dimensions.get('screen');

const REACTIONS = [
    { label: "Mauvais", src: require('../assets/imgs/smileyworried-gris.png'), bigSrc: require('../assets/imgs/smileyworried.png') },
    { label: "Moyen", src: require('../assets/imgs/smileysad-gris.png'), bigSrc: require('../assets/imgs/smileysad.png') },
    { label: "Bien", src: require('../assets/imgs/smileyhappy-gris.png'), bigSrc: require('../assets/imgs/smileyhappy.png') },
    { label: "Excelent", src: require('../assets/imgs/smileyExcited-gris.png'), bigSrc: require('../assets/imgs/smileyExcited.png') },
];
const WIDTH = 320;
const DISTANCE =  WIDTH / REACTIONS.length;
const END = WIDTH - DISTANCE;
  


var valeur = "bien";

class Smile extends React.Component {
    constructor(props) {
      super(props);
      this._pan = new Animated.Value(2 * DISTANCE);
      this.state = {
        val : ''
      }
    }
    
    UNSAFE_componentWillMount() {
        this._panResponder = PanResponder.create({
        onMoveShouldSetResponderCapture: () => true,
          onMoveShouldSetPanResponderCapture: () => true,
          onPanResponderGrant: (e, gestureState) => {
            this._pan.setOffset(this._pan._value);
            this._pan.setValue(0);
        },
        onPanResponderMove: Animated.event([null, {dx: this._pan}]),
        onPanResponderRelease: () => {
          this._pan.flattenOffset();
  
          let offset = Math.max(0, this._pan._value + 0);
          if (offset < 0) return this._pan.setValue(0);
          if (offset > END) return this._pan.setValue(END);
  
          const modulo = offset % DISTANCE;
          offset = (modulo >= DISTANCE/2) ? (offset+(DISTANCE-modulo)) : (offset-modulo);
  
          this.updatePan(offset);
        }
      });
    }
  
    updatePan = async (toValue) =>{
      var val
      Animated.spring(this._pan, { toValue, friction: 7 }).start();
      if(toValue === 240){
        val = 'excelent';
      }else if(toValue === 160){
        val = 'bien';
      }
      else if(toValue === 80){
        val = 'moyen';
      }
      else if(toValue === 0){
        val = 'mauvais';
  
      }
      valeur = val;
      console.log("valeur est :"+valeur)
    }
  
    render() {
      return (
        <View style={styles.container}>
          <View style={styles.wrap}>
            <View style={styles.reactions}>
              {REACTIONS.map((reaction, idx) => {
                const u = idx * DISTANCE;
                let inputRange = [u-20, u, u+20];
                let scaleOutputRange = [1, 0.25, 1];
                let topOutputRange = [0, 10, 0];
                let colorOutputRange = ['#999', '#222', '#999'];
                if (u-20 < 0) {
                  inputRange = [u, u+20];
                  scaleOutputRange = [0.25, 1];
                  topOutputRange = [10, 0];
                  colorOutputRange = ['#222', '#999'];
                }
  
                if (u+20 > END) {
                  inputRange = [u-20, u];
                  scaleOutputRange = [1, 0.25];
                  topOutputRange = [0, 10];
                  colorOutputRange = ['#999', '#222'];
                }
  
  
                return (
                  <TouchableOpacity onPress={() => this.updatePan(u)} activeOpacity={0.9} key={idx}>
                    <View style={styles.smileyWrap}>
                      <Animated.Image
                        source={reaction.src}
                        style={[styles.smiley, {
                          transform: [{
                            scale: this._pan.interpolate({
                              inputRange,
                              outputRange: scaleOutputRange,
                              extrapolate: 'clamp',
                            })
                          }]
                        }]}
                      />
                    </View>
  
                    <Animated.Text style={[styles.reactionText, {
                      top: this._pan.interpolate({
                        inputRange,
                        outputRange: topOutputRange,
                        extrapolate: 'clamp',
                      }),
                      color: this._pan.interpolate({
                        inputRange,
                        outputRange: colorOutputRange,
                        extrapolate: 'clamp',
                      })
                    }]}>
                      {reaction.label}
                    </Animated.Text>
                  </TouchableOpacity>
                );
              })}
              <Animated.View {...this._panResponder.panHandlers} style={[styles.bigSmiley, {
                transform: [{
                  translateX: this._pan.interpolate({
                    inputRange: [0, END],
                    outputRange: [0, END],
                    extrapolate: 'clamp',
                  })
                }]
              }]}>
                {REACTIONS.map((reaction, idx) => {
                  let inputRange = [(idx-1)*DISTANCE, idx*DISTANCE, (idx+1)*DISTANCE];
                  let outputRange = [0, 1, 0];
  
                  if (idx == 0) {
                    inputRange = [idx*DISTANCE, (idx+1)*DISTANCE];
                    outputRange = [1, 0];
                  }
  
                  if (idx == REACTIONS.length - 1) {
                    inputRange = [(idx-1)*DISTANCE, idx*DISTANCE];
                    outputRange = [0, 1];
                  }
                  return (
                    <Animated.Image
                      key={idx}
                      source={reaction.bigSrc}
                      style={[styles.bigSmileyImage, {
                        opacity: this._pan.interpolate({
                          inputRange,
                          outputRange,
                          extrapolate: 'clamp',
                        })
                      }]}
                    />
                  );
                })}
              </Animated.View>
            </View>
          </View>
        </View>
      );
    }
  }
  

 class Feedback extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            checked: '',
            val : '',
            newMessage : '',
        }
    }
 
    updateMessageState = (text) => {
        this.setState({newMessage: text});
    }
      
    sendMessage = () => {
        console.log("le message est "+this.state.newMessage)
        if(this.state.newMessage === '' && valeur === "mauvais" || this.state.newMessage === '' &&  valeur === "moyen"){
            Alert.alert("Svp !","Laissez un commentaire pour exprimer votre point de vue, et surtout ce que vous n'aimez pas dans notre application")
        }else{
            firebase.database().ref(`feedback/`+valeur+`/`+firebase.auth().currentUser.uid+`/`).update({
                Commentaire: this.state.newMessage,
                Name : firebase.auth().currentUser.displayName,
            });
            Alert.alert('','Merci pour votre feedback !')
        }
    }
    
    render(){
        return(
        <Block column>
            <Block style={styles.title}>
                <Text style={{ fontFamily: 'montserrat-bold', paddingBottom: 5 }} size={nowTheme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>Merci de choisir :</Text>
                <Text style={{ fontFamily: 'montserrat-regular', paddingLeft : 6}} size={12} color={nowTheme.COLORS.CAPTION}>
                    Votre feedback nous permet d'améliorer nos services 
                </Text>
            </Block>
                <Smile/>
            <Block style={styles.title}>
                <Text style={{ fontFamily: 'montserrat-bold', paddingBottom: 5 }} size={nowTheme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>Commentaire</Text>
                <Text style={{ fontFamily: 'montserrat-regular', paddingLeft : 6}} size={12} color={nowTheme.COLORS.CAPTION}>
                    Cliquez sur le button pour envoyer votre commentaire
                </Text>
            </Block>
            <Block center>
                <InputScrollView>
                    <TextInput
                        multiline
                        style={styles.newInput}
                        value={this.state.newMessage}
                        onSubmitEditing={this.sendMessage}
                        placeholder="Commentaire..."
                        returnKeyType="send"
                        ref="newMessage"
                        onChangeText={this.updateMessageState} 
                    />
                    <Button style={styles.ButtonStyle}  
                      onPress={() => this.sendMessage()} > Envoyer </Button>
                </InputScrollView>
            </Block>
            
        </Block>
        );
    }
}

const size = 42;

const styles = StyleSheet.create({
    View: {
        flexDirection :"row",
        padding : 4,
    },
    Text: {
        marginTop : 7, 
    },
    title: {
        paddingTop: nowTheme.SIZES.BASE,
        paddingLeft : 10,
        paddingVertical : 30
        // paddingBottom: nowTheme.SIZES.BASE / 2
    },
    newInput: {
        borderColor: '#ccc',
        borderTopWidth:1,
        fontSize: 16,
        padding:10,
        maxHeight : 120,
        width : width * 0.96,
    },
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      },
      wrap: {
        width: WIDTH,
        marginBottom: 50,
      },
      reactions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
      },
      smileyWrap: {
        width: DISTANCE,
        height: DISTANCE,
        justifyContent: 'center',
        alignItems: 'center',
      },
      smiley: {
        width: size,
        height: size,
        borderRadius: size/2,
        backgroundColor: 'transparent',
      },
      bigSmiley: {
        width: DISTANCE,
        height: DISTANCE,
        borderRadius: DISTANCE/2,
        backgroundColor: 'transparent',
        position: 'absolute',
        top: 0,
        left: 0,
      },
      bigSmileyImage: {
        width: DISTANCE,
        height: DISTANCE,
        position: 'absolute',
        top: 0,
        left: 0,
      },
      ButtonStyle:{
       marginTop:10,
       alignSelf:'center',
      },
      reactionText: {
        fontSize: 12,
        textAlign: 'center',
        color: '#999',
        fontWeight: '400',
        fontFamily: 'montserrat-regular',
        marginTop: 5,
      },
      line: {
        height: 4 / PixelRatio.get(),
        backgroundColor: '#eee',
        width: WIDTH - (DISTANCE-size),
        left: (DISTANCE-size) / 2,
        top: DISTANCE/2 + (2 / PixelRatio.get()),
      }
    
});

export default Feedback;