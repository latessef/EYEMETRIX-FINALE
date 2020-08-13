import React from "react";
import { StyleSheet, Dimensions,Text, View, ScrollView, Alert} from "react-native";
import { Block, theme,Button as GaButton, Button} from "galio-framework";
import { nowTheme } from '../constants';
import firebase from "../database/firebase"
import DailyButton from '../components/DailyButton';
import MonthlyButton from '../components/MonthlyButton';
import WeeklyButton from '../components/WeeklyButton';

import {LineChartB, PieChartB, StackedBarChartB, ProgressChartB, BarchartB} from "../components/Charts";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  StackedBarChart,
} from "react-native-chart-kit";
import { Icon, Input, NumbersCard } from '../components';
import { FAB, Portal, Provider } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import SegmentedControlTab from 'react-native-segmented-control-tab';
const { width, height } = Dimensions.get("screen");

class Rapports extends React.Component {
  constructor() {
    super();
    this.state={
      type : '',
      idChart : '',
      list : [],
      selectedIndex: 0,
      selectedIndices: [0],
      customStyleIndex: 0,
    }
  }
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

  // ButtonCharts = () => {
  //   const [state, setState] = React.useState({ open: false });
  //   const onStateChange = ({ open }) => setState({ open });
  //   const { open } = state;
  //   return (
  //     <Provider>
  //       <Portal>
  //         <FAB.Group
  //           open={open}
  //           icon={open ? require('../assets/imgs/pieChart.png') : require('../assets/imgs/chartReport.png')}
  //           color = "white"
  //           fabStyle={{ backgroundColor  : nowTheme.COLORS.PRIMARY }}
  //           style = {{ elevation : 3}}
  //           actions={[
  //             {
  //               icon: require('../assets/imgs/chart3.png'),
  //               label: 'Barchart',
  //               color : nowTheme.COLORS.DEFAULT,
  //               onPress: () => this.setState({idChart : 2}),
  //             },
  //             {
  //               icon: require('../assets/imgs/lineChart.png'),
  //               label: 'LineChart', 
  //               color : nowTheme.COLORS.DEFAULT,
  //               onPress: () => this.setState({idChart : 1}),
  //             },
  //           ]}
  //           onStateChange={onStateChange}
  //           onPress={() => {
  //             // if (open) {
  //             //   // do something if the speed dial is open
  //             // }
  //           }}  
  //         />
  //       </Portal>
  //     </Provider>
  //   );
  // };

  UNSAFE_componentWillMount(){
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      firebase.database().ref(`users/`+firebase.auth().currentUser.uid+`/type`).on('value', snapshot => {
        this.setState({
          type : snapshot.val(),
        });
      });
      this.setState({
        idChart : '',
        });
      this.getProjects();
    });
  }
  componentWillUnmount() {
    this.focusListener.remove();
  }
  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }
  getProjects = () => {
    const newArray = [];
    var query = firebase.database().ref(`projects/`+firebase.auth().currentUser.uid).orderByKey();
    query.once("value")
      .then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
          var key = childSnapshot.key;
          var childData = childSnapshot.val().nom;
          const obj = {'label': childData,'value': key, 'key': key}
          newArray.push(obj);
          this.setState({
            list: newArray,
          });
        });
      });
  }
  switchChart = () =>{
    const {selectedIndex , selectedIndices, customStyleIndex} = this.state;
    const _id = this.props.navigation.getParam('id');
        return(
          <View style = {{marginTop : 20}}>
            <SegmentedControlTab
              values={['Quotidien','Hebdomadaire', 'Mensuel']}
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
                <LineChartB  abscisse  = 'Quotidien' _id= {_id}/>
                <Block>
                  <DailyButton/>
                </Block>
              </View>
            )}
            {customStyleIndex === 1 && (
              <View>
                <LineChartB abscisse  = 'Hebdomadaire'  _id={_id}/>
                <Block>
                  <WeeklyButton/>
                </Block>
              </View>
            )}
            {customStyleIndex === 2 && (
              <View>
                <LineChartB abscisse  = 'Mensuel'  _id={_id}/>
                <Block>
                  <MonthlyButton/>
               </Block>
              </View>
            )}
             
          </View>
        );
   
  }

  render() {  
    return (
    <Block flex style = {{height: height * 0.82, flexDirection:'column'}}>
      <ScrollView>
        <Block center>
          <Block>
              {this.switchChart()}
          </Block>
          
        </Block>
      </ScrollView>
      
    {/* <this.ButtonCharts/>   */}
  </Block> 
  );
 }
}

const styles = StyleSheet.create({
  home: {
    width: width,
    justifyContent:'flex-end',
    alignItems: 'flex-end',
    marginBottom: 20,
    marginRight:30
  },
  View: {
    width: width * 0.98,
    justifyContent:'center',
    alignItems: 'center',
    marginTop : 30,
  },
});

export default Rapports;
