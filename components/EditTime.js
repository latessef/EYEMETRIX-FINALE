import React from 'react';
import {
  View,
  StyleSheet, 
  Dimensions,
} from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {Horaires} from '.'
import {nowTheme } from '../constants';

const { width, height } = Dimensions.get('screen');

export default class  EditTime extends React.Component {
    state = {
      selectedIndex: 0,
      selectedIndices: [0],
      customStyleIndex: 0,
    };

  handleSingleIndexSelect = (index) => {
    this.setState(prevState => ({ ...prevState, selectedIndex: index }));
  };

  handleMultipleIndexSelect = (index) => {
    const { selectedIndices } = this.state;
    if (selectedIndices.includes(index)) {
      this.setState(prevState => ({
        ...prevState,
        selectedIndices: selectedIndices.filter(i => i !== index),
      }));
    } else {
      this.setState(prevState => ({
        ...prevState,
        selectedIndices: [...selectedIndices, index],
      }));
    }
  };

  handleCustomIndexSelect = (index) => {
    this.setState(prevState => ({ ...prevState, customStyleIndex: index }));
  };

  render(){  
    const {selectedIndex , selectedIndices, customStyleIndex} = this.state;
    const {_id}= this.props
    return (
      <View style = {{marginTop : 20}}>
        <SegmentedControlTab
          values={['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.']}
          selectedIndex={customStyleIndex}
          onTabPress={this.handleCustomIndexSelect}
          borderRadius={0}
          tabsContainerStyle={{ height: 50, backgroundColor: '#F2F2F2' }}
          tabStyle={{
            backgroundColor: '#F2F2F2',
            borderWidth: 0,
            borderColor: 'transparent',
          }}
          activeTabStyle={{ backgroundColor: 'white', marginTop: 2 }}
          tabTextStyle={{ color: '#444444', fontWeight: 'bold' }}
          activeTabTextStyle={{ color: nowTheme.COLORS.PRIMARY }}
        />
        {customStyleIndex === 0 && (
          <View>
            <Horaires jour = 'Dimanche' _id= {_id}/>
          </View>
        )}
        {customStyleIndex === 1 && (
          <View>
            <Horaires jour = 'Lundi'  _id={_id}/>
          </View>
        )}
        {customStyleIndex === 2 && (
          <View>
            <Horaires jour = 'Mardi'  _id={_id}/>
          </View>
        )}
        {customStyleIndex === 3 && (
          <View>
            <Horaires jour = 'Mercredi' _id={_id}/>
          </View>
        )}
        {customStyleIndex === 4 && (
          <View>
            <Horaires jour = 'Jeudi'  _id={_id}/>
          </View>
        )}
        {customStyleIndex === 5 && (
          <View>
            <Horaires jour = 'Vendredi' _id={_id}/>
          </View>
        )}
        {customStyleIndex === 6 && (
          <View>
            <Horaires jour = 'Samedi' _id={_id}/>
          </View>
        )}
      </View>
    );
  };
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  headerText: {
    padding: 8,
    fontSize: 14,
    color: '#444444',
    textAlign: 'center',
  },
  tabContent: {
    color: '#444444',
    fontSize: 18,
    margin: 24,
  },
  Seperator: {
    marginHorizontal: -10,
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderTopColor: '#888888',
    marginTop: 24,
  },
  tabStyle: {
    borderColor: '#D52C43',
  },
  activeTabStyle: {
    backgroundColor: '#D52C43',
  },

});

