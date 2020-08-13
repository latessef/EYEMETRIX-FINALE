import React from "react";
import { StyleSheet, Dimensions} from "react-native";
import { Block} from "galio-framework";
import { CheckBox } from 'react-native-elements'
import { nowTheme } from '../constants';
import firebase from "../database/firebase"
import Moment from 'moment';

const { height, width } = Dimensions.get('screen');


export default class JoursFeriers extends React.Component {
    
    _isMounted = false;
    constructor() {
        super();
        Moment.locale('fr');
        this.state = {
            janvier_1 : new Date("2020-01-01"), 
            janvier_11 : new Date("2020-01-11"), 
            mai_1 : new Date("2020-05-01"), 
            juillet_30 : new Date("2020-07-30"), 
            aout_14 : new Date("2020-08-14"), 
            aout_20 : new Date("2020-08-20"), 
            aout_21 : new Date("2020-08-21"), 
            novembre_6 : new Date("2020-11-06"), 
            novembre_18 : new Date("2020-11-18"),
            check_1 : false,
            check_2 : false,
            check_3 : false,
            check_4 : false,
            check_5 : false,
            check_6 : false,
            check_7 : false,
            check_8 : false,
            check_9 : false,
        }
    }
    
    UNSAFE_componentWillMount = async () =>
    {
        this._isMounted = true;
        const {_id} = this.props;
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.janvier_1).format('DD-MM-YYYY')).once('value', snapshot => {
            if(snapshot.val() != null){
               this.setState({check_1 : snapshot.val().check});
            }
        });
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.janvier_11).format('DD-MM-YYYY')).once('value', snapshot => {
            if(snapshot.val() != null){
                this.setState({check_2 : snapshot.val().check});
            }
        });
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.mai_1).format('DD-MM-YYYY')).once('value', snapshot => {
            if(snapshot.val() != null){
                this.setState({check_3 : snapshot.val().check});  
            }
        });
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.juillet_30).format('DD-MM-YYYY')).once('value', snapshot => {
            if(snapshot.val() != null){
                this.setState({check_4 : snapshot.val().check});
            } 
        });
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.aout_14).format('DD-MM-YYYY')).once('value', snapshot => {
            if(snapshot.val() != null){
                this.setState({check_5 : snapshot.val().check});
            }  
        });
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.aout_20).format('DD-MM-YYYY')).once('value', snapshot => {
            if(snapshot.val() != null){
                this.setState({check_6 : snapshot.val().check});
            } 
        });
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.aout_21).format('DD-MM-YYYY')).once('value', snapshot => {
            if(snapshot.val() != null){
                this.setState({check_7 : snapshot.val().check});
            } 
        });
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.novembre_6).format('DD-MM-YYYY')).once('value', snapshot => {
            if(snapshot.val() != null){
                this.setState({check_8 : snapshot.val().check});
            }  
        });
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.novembre_18).format('DD-MM-YYYY')).once('value', snapshot => {
            if(snapshot.val() != null){
                this.setState({check_9 : snapshot.val().check});
            }
        });
    }
    

    Janvier_1 = async () => {
        const {_id} = this.props;
        this.setState({check_1 : !this.state.check_1})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.janvier_1).format('DD-MM-YYYY')).update({
            name: 'Nouvel An',
            check: !this.state.check_1
        });
    } 
    Janvier_11 = async () => {
        const {_id} = this.props;
        this.setState({check_2 : !this.state.check_2})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.janvier_11).format('DD-MM-YYYY')).update({
            name: "Manifeste de l'indépendance",
            check: !this.state.check_2
        });
    }
    Mai_1 = async () => {
        const {_id} = this.props;
        this.setState({check_3 : !this.state.check_3})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.mai_1).format('DD-MM-YYYY')).update({
            name: "Fête du Travail",
            check: !this.state.check_3
        });

    }
    Juillet_30 = async () => {
        const {_id} = this.props;
        this.setState({check_4 : !this.state.check_4})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.juillet_30).format('DD-MM-YYYY')).update({
            name: "Fête du Trône",
            check: !this.state.check_4
        });
    }
    Aout_14 = async () => {
        const {_id} = this.props;
        this.setState({check_5 : !this.state.check_5})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.aout_14).format('DD-MM-YYYY')).update({
            name: "Allégeance Oued Eddahab",
            check: !this.state.check_5
        });
    }
    Aout_20 = async () => {
        const {_id} = this.props;
        this.setState({check_6 : !this.state.check_6})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.aout_20).format('DD-MM-YYYY')).update({
            name: "La révolution du roi et du peuple",
            check: !this.state.check_6
        });
    }
    Aout_21 = async () => {
        const {_id} = this.props;
        this.setState({check_7 : !this.state.check_7})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.aout_21).format('DD-MM-YYYY')).update({
            name: "Fête de la Jeunesse",
            check: !this.state.check_7
        });
    }
    Novembre_6 = async () => {
        const {_id} = this.props;
        this.setState({check_8 : !this.state.check_8})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.novembre_6).format('DD-MM-YYYY')).update({
            name: "La marche verte",
            check: !this.state.check_8
        });

    }
    Novembre_18 = async () => {
        const {_id} = this.props;
        this.setState({check_9 : !this.state.check_9})
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/JoursFeriers/`+Moment(this.state.novembre_18).format('DD-MM-YYYY')).update({
            name: "Fête de l'indépendance",
            check: !this.state.check_9
        });
    }

    render() {
        return (
            <Block >
                <CheckBox 
                    title='Nouvel An' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={{backgroundColor : 'transparent', borderColor: 'transparent'}}
                    checked={this.state.check_1}
                    onPress= {() => this.Janvier_1()}
                /> 
                <CheckBox 
                    title='Manifeste de l’Indépendance : le 11 janvier' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    checked={this.state.check_2}
                    onPress= {() => this.Janvier_11()}
                /> 
                <CheckBox 
                    title= 'Fête du travail : le 1er mai' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    checked={this.state.check_3}
                    onPress= {() => this.Mai_1()}
                /> 
                <CheckBox 
                    title= 'Fête du Trône : le 30 juillet' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    checked={this.state.check_4}
                    onPress= {() => this.Juillet_30()}
                /> 
                <CheckBox 
                    title= 'Allégeance Oued Eddahab : le 14 août' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    checked={this.state.check_5}
                    onPress= {() => this.Aout_14()}
                /> 
                <CheckBox 
                    title= 'La révolution du Roi et du peuple : le 20 août' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    checked={this.state.check_6}
                    onPress= {() => this.Aout_20()}
                /> 
                <CheckBox 
                    title= 'Fête de la Jeunesse : le 21 août' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    checked={this.state.check_7}
                    onPress= {() => this.Aout_21()}
                /> 
                <CheckBox 
                    title= 'Marche verte : le 6 novembre' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    checked={this.state.check_8}
                    onPress= {() => this.Novembre_6()}
                /> 
                <CheckBox 
                    title= 'Fête de l’indépendance : le 18 novembre' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    checked={this.state.check_9}
                    onPress= {() => this.Novembre_18()}
                /> 
                 <CheckBox 
                    title= 'Aïd Al Fitr : du 28 Ramadan au 2 Chaoual' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    // checked={this.state.lun}
                    // onPress= {() => this.Lundi()}
                /> 
                 <CheckBox 
                    title= 'Aid al Adha : le 30 et le 31 juillet' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    // checked={this.state.lun}
                    // onPress= {() => this.Lundi()}
                /> 
                <CheckBox 
                    title= 'Aid al Mawlid Annabawi : le 29 octobre' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    // checked={this.state.lun}
                    // onPress= {() => this.Lundi()}
                /> 
                <CheckBox 
                    title= 'Premier Moharram : le 20 août' 
                    fontFamily = 'montserrat-regular'
                    textStyle = {styles.text}
                    checkedColor = {nowTheme.COLORS.PRIMARY}
                    uncheckedColor = {nowTheme.COLORS.PRIMARY}
                    containerStyle={styles.Checkbox}
                    // checked={this.state.lun}
                    // onPress= {() => this.Lundi()}
                /> 
            </Block>
        );
    
    }
}

const styles = StyleSheet.create({
    Checkbox: {
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