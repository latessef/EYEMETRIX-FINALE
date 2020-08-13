import React from "react";
import { StyleSheet, Alert, Dimensions} from "react-native";
import { Block} from "galio-framework";
import firebase from "../database/firebase"
import { nowTheme } from '../constants';
import { CheckBox } from 'react-native-elements'

const { height, width } = Dimensions.get('screen');

export default class JoursRepos extends React.Component {
    _isMounted = false;
    constructor() {
        super();
        this.state = {lun: false, mar: false, mer: false, jeu: false, ven: false, sam: false, dim: false}
        
    }

    UNSAFE_componentWillMount = async () =>
    {
        this._isMounted = true;
        const {_id} = this.props;
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursRopos/`).on('value', snapshot => {
            if(snapshot.val() != null){
                this.setState({
                    lun : snapshot.val().Lundi,
                    mar : snapshot.val().Mardi,
                    mer : snapshot.val().Mercredi,
                    jeu : snapshot.val().Jeudi,
                    ven : snapshot.val().Vendredi,
                    sam : snapshot.val().Samedi,
                    dim : snapshot.val().Dimanche
                });
            }
        });
    }

    Lundi = async () => {
        const {_id} = this.props;
        this.setState({lun : !this.state.lun})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id.toString()+`/calendrierBusiness/JoursRopos/`).update({
            Lundi: !this.state.lun,
        });
    } 

    Mardi = () => {
        const {_id} = this.props;
        this.setState({mar : !this.state.mar}) 
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursRopos/`).update({
            Mardi: !this.state.mar,
        }); 
    } 

    Mercredi = () => {
        const {_id} = this.props;
        this.setState({mer : !this.state.mer})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursRopos/`).update({
            Mercredi: !this.state.mer,
        });
    } 

    Jeudi = () => {
        const {_id} = this.props;
        this.setState({jeu : !this.state.jeu})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursRopos/`).update({
            Jeudi: !this.state.jeu,
        });
    } 

    Vendredi = () => {
        const {_id} = this.props;
        this.setState({ven : !this.state.ven})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursRopos/`).update({
            Vendredi: !this.state.ven,
        });
    } 

    Samedi = () => {
        const {_id} = this.props;
        this.setState({sam : !this.state.sam})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursRopos/`).update({
            Samedi: !this.state.sam,
        });
        
    } 

    Dimanche = () => {
        const {_id} = this.props;
        this.setState({dim : !this.state.dim})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursRopos/`).update({
            Dimanche: !this.state.dim,
        });
    } 

    render() {
        return (
            <Block>
                <CheckBox
                  title='Lundi'
                  fontFamily = 'montserrat-regular'
                  textStyle = {styles.text}
                  checkedColor = {nowTheme.COLORS.PRIMARY}
                  uncheckedColor = {nowTheme.COLORS.PRIMARY}
                  containerStyle={{backgroundColor : 'transparent', borderColor: 'transparent'}}
                  checked={this.state.lun}
                  onPress= {() => this.Lundi()}
                /> 
                <CheckBox
                  title='Mardi'
                  fontFamily= 'montserrat-regular'
                  textStyle = {styles.text}
                  checkedColor = {nowTheme.COLORS.PRIMARY}
                  uncheckedColor = {nowTheme.COLORS.PRIMARY}
                  checked={this.state.mar}
                  containerStyle={styles.CheckBox}
                  onPress= {() => this.Mardi()}
                />
                <CheckBox
                  title='Mercredi'
                  fontFamily= 'montserrat-regular'
                  textStyle = {styles.text}
                  checkedColor = {nowTheme.COLORS.PRIMARY}
                  uncheckedColor = {nowTheme.COLORS.PRIMARY}
                  containerStyle={styles.CheckBox}
                  checked={this.state.mer}
                  onPress= {() => this.Mercredi()}
                />
                <CheckBox
                  title='Jeudi'
                  fontFamily= 'montserrat-regular'
                  textStyle = {styles.text}
                  checkedColor = {nowTheme.COLORS.PRIMARY}
                  uncheckedColor = {nowTheme.COLORS.PRIMARY}
                  containerStyle={styles.CheckBox}
                  checked={this.state.jeu}
                  onPress= {() => this.Jeudi()}
                />
                <CheckBox
                  title='Vendredi'
                  fontFamily= 'montserrat-regular'
                  textStyle = {styles.text}
                  checkedColor = {nowTheme.COLORS.PRIMARY}
                  uncheckedColor = {nowTheme.COLORS.PRIMARY}
                  containerStyle={styles.CheckBox}
                  checked={this.state.ven}
                  onPress= {() => this.Vendredi()}
                />
                <CheckBox
                  title='Samedi'
                  fontFamily= 'montserrat-regular'
                  textStyle = {styles.text}
                  checkedColor = {nowTheme.COLORS.PRIMARY}
                  uncheckedColor = {nowTheme.COLORS.PRIMARY}
                  containerStyle={styles.CheckBox}
                  checked={this.state.sam}
                  onPress= {() => this.Samedi()}
                />
                <CheckBox
                  title='Dimanche'
                  fontFamily= 'montserrat-regular'
                  textStyle = {styles.text}
                  checkedColor = {nowTheme.COLORS.PRIMARY}
                  uncheckedColor = {nowTheme.COLORS.PRIMARY}
                  containerStyle={styles.CheckBox}
                  checked={this.state.dim}
                  onPress= {() => this.Dimanche()}
                />
            </Block>
        );
    
    }
}

const styles = StyleSheet.create({
    CheckBox: {
        backgroundColor : 'transparent', 
        borderColor: 'transparent', 
        marginTop : -20,
    },
    text: {
        fontStyle: 'normal', 
        fontWeight : 'normal', 
        fontSize: height < 812 ? 12 : 13,
        color : 'black'
    }
    
});