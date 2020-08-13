
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
} from 'react-native';
import ListView from 'deprecated-react-native-listview';
import Images from '../constants/Images';
import nowTheme from '../constants/Theme';
export default class NotificationsView extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        {description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"}, 
        {description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"},
        {description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"},
        {description: "Lorem ipsum dolor sit amet, indu consectetur adipiscing elit"},
      ]),
    };
  }
  
  render() {
    return (
      <View style={styles.container}>
        <ListView style={styles.notificationList} enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={(notification) => {
            return (
              <View style={styles.notificationBox}>
                <Image style={styles.icon}
                  source={Images.Notif}/>
                
                <Text style={styles.description}>{notification.description}</Text>
              </View>
            )}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#DCDCDC'
  },
  notificationList:{
    marginTop:20,
    padding:10,
  },
  notificationBox: {
    padding:20,
    marginTop:5,
    marginBottom:5,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    borderRadius:10,
  },
  icon:{
    width:45,
    height:45,
  },
  description:{
    fontSize:18,
    color: nowTheme.COLORS.BLUE,
    marginLeft:10,
  },
});
 