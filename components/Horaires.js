import React, {useState} from 'react';
import {
  View,
  TouchableOpacity, 
  StyleSheet,
  Dimensions
} from 'react-native';
import {Block, Button, Text} from 'galio-framework';
import {nowTheme } from '../constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from '../database/firebase';
const { width, height } = Dimensions.get('screen');

export default class Horaires extends React.Component {
    constructor (){
        super();
        this.state = {
            show_1 : false,
            show_2 : false,
            show_3 : false,
            show_4 : false,
            show_5 : false,
            show_6 : false,
            timeStart_1 : new Date(),
            timeStart_2 : new Date(),
            timeStart_3 : new Date(),
            timeStart_4 : new Date(),
            timeStart_5 : new Date(),
            timeStart_6 : new Date(),
            time_1 : '',
            time_2 : '',
            time_3 : '',
            time_4 : '',
            time_5 : '',
            time_6 : '',
        }
    }
    UNSAFE_componentWillMount = async () =>{
        const {jour} = this.props;
        const {_id} = this.props;
        await firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/Horaires/`+jour+`/`).on('value', snapshot => {
            if(snapshot.val() != null && snapshot.val() != undefined){
                this.setState({
                    time_1 : snapshot.val().Matin.debut,
                    time_4 : snapshot.val().Matin.fin,
                    time_2 : snapshot.val().ApresMidi.debut,
                    time_5 : snapshot.val().ApresMidi.fin,
                    time_3 : snapshot.val().Soir.debut,
                    time_6 : snapshot.val().Soir.fin,
                });
            }
        });
    }



    showMode_1 = () => {
        this.setState({show_1 : true});
    };
    showMode_2 = () => {
        this.setState({show_2 : true});
    };
    showMode_3 = () => {
        this.setState({show_3 : true});
    };
    showMode_4 = () => {
        this.setState({show_4 : true});
    };
    showMode_5 = () => {
        this.setState({show_5 : true});
    };
    showMode_6 = () => {
        this.setState({show_6 : true});
    };

    
    hideDatePicker_1 = () =>{
        this.setState({show_1 : false});
    };
    hideDatePicker_2 = () =>{
        this.setState({show_2 : false});
    };
    hideDatePicker_3 = () =>{
        this.setState({show_3 : false});
    };
    hideDatePicker_4 = () =>{
        this.setState({show_4 : false});
    };
    hideDatePicker_5 = () =>{
        this.setState({show_5 : false});
    };
    hideDatePicker_6 = () =>{
        this.setState({show_6 : false});
    };


    handleConfirm_1 = (date) => {
        const {jour} = this.props;
        const {_id} = this.props;
        const currentTime = date || this.state.timeStart_1
        this.setState({show_1 : Platform.OS === 'ios'});
        this.setState({timeStart_1 : currentTime});
        this.setState({time_1 : currentTime.getHours()+':'+currentTime.getMinutes()});
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/Horaires/`+jour+`/Matin/`).update({
            debut : currentTime.getHours()+':'+currentTime.getMinutes()
        });
        this.setState({show_1 : false});
    };

    handleConfirm_2 = (date) => {
        const {jour} = this.props;
        const {_id} = this.props;
        const currentTime = date || this.state.timeStart_2
        this.setState({show_2 : Platform.OS === 'ios'});;
        this.setState({timeStart_2 : currentTime});
        this.setState({time_2 : currentTime.getHours()+':'+currentTime.getMinutes()});
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/Horaires/`+jour+`/ApresMidi/`).update({
            debut : currentTime.getHours()+':'+currentTime.getMinutes()
        });
        this.setState({show_2 : false});
    };

    handleConfirm_3 = (date) => {
        const {jour} = this.props;
        const {_id} = this.props;
        const currentTime = date || this.state.timeStart_3
        this.setState({show_3 : Platform.OS === 'ios'});
        this.setState({timeStart_3 : currentTime});
        this.setState({time_3 : currentTime.getHours()+':'+currentTime.getMinutes()});
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/Horaires/`+jour+`/Soir/`).update({
            debut : currentTime.getHours()+':'+currentTime.getMinutes()
        });
        this.setState({show_3 : false});
    };
    handleConfirm_4 = (date) => {
        const {jour} = this.props;
        const {_id} = this.props;
        const currentTime = date || this.state.timeStart_4
        this.setState({show_4 : Platform.OS === 'ios'});
        this.setState({timeStart_4 : currentTime});
        this.setState({time_4 : currentTime.getHours()+':'+currentTime.getMinutes()});
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/Horaires/`+jour+`/Matin/`).update({
            fin :  currentTime.getHours()+':'+currentTime.getMinutes()
        });
        this.setState({show_4 : false});
    };
    handleConfirm_5 = (date) => {
        const {jour} = this.props;
        const {_id} = this.props;
        const currentTime = date || this.state.timeStart_5
        this.setState({show_5 : Platform.OS === 'ios'});
        this.setState({timeStart_5 : currentTime});
        this.setState({time_5 : currentTime.getHours()+':'+currentTime.getMinutes()});
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/Horaires/`+jour+`/ApresMidi/`).update({
            fin : currentTime.getHours()+':'+currentTime.getMinutes()
        });
        this.setState({show_5 : false});
    };
    handleConfirm_6 = (date) => {
        const {jour} = this.props;
        const {_id} = this.props;
        const currentTime = date || this.state.timeStart_6
        this.setState({show_6 : Platform.OS === 'ios'});
        this.setState({timeStart_6 : currentTime});
        this.setState({time_6 : currentTime.getHours()+':'+currentTime.getMinutes()});
        firebase.database().ref(`projects/`+firebase.auth().currentUser.uid+`/`+_id+`/calendrierBusiness/Horaires/`+jour+`/Soir/`).update({
            fin : currentTime.getHours()+':'+currentTime.getMinutes()
        });
        this.setState({show_6 : false});
    };

    render (){
        return (
            <Block>
                <Block row >
                    <Block style={styles.block}>
                        <View  style = {styles.View}>
                            <Text>Matin</Text>
                        </View>
                        <View  style = {styles.View}>
                            <Text>Aprés Midi</Text>
                        </View>
                        <View  style = {styles.View}>
                            <Text>Soir</Text>
                        </View>
                    </Block>
                    <Block style={styles.block}>
                        <View style = {styles.View}>
                            <TouchableOpacity onPress={this.showMode_1} style={styles.Input}>
                                <Text>{this.state.time_1}</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={this.state.show_1}
                            headerTextIOS = "Choisisssez l'heure"
                            mode="time"
                            date = {this.state.timeStart_1}
                            is24Hour={true}
                            display="spinner"
                            onConfirm={this.handleConfirm_1}
                            onCancel={this.hideDatePicker_1}
                        />
                        <View style = {styles.View}>
                            <TouchableOpacity onPress={this.showMode_2} style={styles.Input}>
                                <Text>{this.state.time_2}</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={this.state.show_2}
                            mode="time"
                            date = {this.state.timeStart_2}
                            is24Hour={true}
                            display="spinner"
                            onConfirm={this.handleConfirm_2}
                            onCancel={this.hideDatePicker_2}
                        />
                        <View style = {styles.View}>
                            <TouchableOpacity onPress={this.showMode_3} style={styles.Input}>
                                <Text>{this.state.time_3}</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={this.state.show_3}
                            mode="time"
                            date = {this.state.timeStart_3}
                            is24Hour={true}
                            display="spinner"
                            onConfirm={this.handleConfirm_3}
                            onCancel={this.hideDatePicker_3}
                        />
                    </Block>
                    <Block style={styles.block}>
                        <View style = {styles.View}>
                            <TouchableOpacity onPress={this.showMode_4} style={styles.Input}>
                                <Text>{this.state.time_4}</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={this.state.show_4}
                            mode="time"
                            date = {this.state.timeStart_4}
                            is24Hour={true}
                            display="spinner"
                            onConfirm={this.handleConfirm_4}
                            onCancel={this.hideDatePicker_4}
                        />
                        <View style = {styles.View}>
                            <TouchableOpacity onPress={this.showMode_5} style={styles.Input}>
                                <Text>{this.state.time_5}</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={this.state.show_5}
                            mode="time"
                            date = {this.state.timeStart_5}
                            is24Hour={true}
                            display="spinner"
                            onConfirm={this.handleConfirm_5}
                            onCancel={this.hideDatePicker_5}
                        />
                        <View style = {styles.View}>
                            <TouchableOpacity onPress={this.showMode_6} style={styles.Input}>
                                <Text>{this.state.time_6}</Text>
                            </TouchableOpacity>
                        </View>
                        <DateTimePickerModal
                            isVisible={this.state.show_6}
                            mode="time"
                            date = {this.state.timeStart_6}
                            is24Hour={true}
                            display="spinner"
                            onConfirm={this.handleConfirm_6}
                            onCancel={this.hideDatePicker_6}
                        />
                    </Block>
                </Block>
                {/* <Block style = {{flexDirection : 'row-reverse', padding : 5}}>
                    <Button round uppercase color="transparent" style={{ width: 150, height: 40 }}>
                        <Text color={nowTheme.COLORS.PRIMARY} size={15}>Voir mon horaire</Text>
                    </Button>
                </Block> */}
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    Input : { 
      borderColor: 'black',
      borderWidth : 1,
      width : 70,
      height: 30, 
      alignItems : 'center', 
      justifyContent: 'center', 
      borderRadius : 4 
    },
    block : {
      alignContent : 'space-between',
      justifyContent : 'space-between',
      padding : height < 812 ? 8 : 15,
    },
    View : {
      alignContent : 'space-between',
      justifyContent : 'space-between',
      padding : 4,
      margin : 8
    }
});

