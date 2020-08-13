import React from 'react';
import { withNavigation,NavigationActions } from 'react-navigation';
import { TouchableOpacity, TouchableWithoutFeedback, StyleSheet, Platform, Dimensions } from 'react-native';
import { Button, Block, NavBar, Text, theme, Button as GaButton } from 'galio-framework';

import Icon from './Icon';
import Tabs from './Tabs';
import nowTheme from '../constants/Theme';

const { height, width } = Dimensions.get('window');
const iPhoneX = () =>
  Platform.OS === 'ios' && (height === 812 || width === 812 || height === 896 || width === 896);

const BellButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate('Notification')}
  >
    <Icon
      family="AntDesign"
      size={20}
      name="bells"
      color={nowTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={[styles.notify, { backgroundColor: nowTheme.COLORS[isWhite ? 'WHITE' : 'PRIMARY'] }]} />
  </TouchableOpacity>
);

const CalendarButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate('BusinessCalendar')}
  >
    <Icon
      family="AntDesign"
      size={22}
      name="calendar"
      color={nowTheme.COLORS[isWhite ? 'WHITE' : 'ICON']}
    />
    <Block middle style={{ backgroundColor: nowTheme.COLORS[isWhite ? 'WHITE' : 'PRIMARY'] }} />
  </TouchableOpacity>
);

const HomeButton = ({ isWhite, style, navigation }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={() => navigation.navigate('Home')}
  >
    <Icon
      family="AntDesign"
      size={24}
      name="home"
      color={nowTheme.COLORS[isWhite ? 'WHITE' : 'black']}
    />
    <Block middle style={{ backgroundColor: nowTheme.COLORS[isWhite ? 'WHITE' : 'PRIMARY']}} />
  </TouchableOpacity>
);

// const PlusButton = ({ isWhite, style, navigation }) => (
//   <TouchableOpacity
//     style={[styles.button, style]}
//     onPress={() => navigation.navigate('AddProject')}
//   >
//     <Icon
//       family="AntDesign"
//       size={24}
//       name="plus"
//       color={nowTheme.COLORS[isWhite ? 'WHITE' : 'black']}
//     />
//     <Block middle style={{ backgroundColor: nowTheme.COLORS[isWhite ? 'WHITE' : 'PRIMARY']}} />
//   </TouchableOpacity>
// );


class Header extends React.Component {
  handleLeftPress = () => {
    const { back, navigation, screen } = this.props;
    const id_1 = this.props.navigation.getParam('id');
    if(screen !== "CalendarBusiness"){
      return back ? this.props.navigation.navigate(screen) : navigation.openDrawer();
    }
    else if (screen === "CalendarBusiness"){
      console.log(id_1)
      return back ? this.props.navigation.push('Calendar', {id: id_1}) : navigation.openDrawer();
    }
  };
  renderRight = () => {
    const { white, title, navigation } = this.props;
    const { routeName } = navigation.state;

    if (title === 'Title') {
      return [
        <BellButton key="chat-title" navigation={navigation} isWhite={white} />,
      ];
    }

    switch (routeName) {
      case 'Home':
        return [
          <BellButton key="home" navigation={navigation} isWhite={white} />,
        ];
      // case 'Calendar':
      //   return [
      //     <HomeButton key="calendar" navigation={navigation} isWhite={white} />,
      //   ];
      case 'Profile':
        return [
          <HomeButton key="profile" navigation={navigation} isWhite={white} />,
        ];
      case 'Projects':
        return [
          <HomeButton key="projects" navigation={navigation} isWhite={white} />,
        ];
      case 'Account':
        return [
          <HomeButton key="register" navigation={navigation} isWhite={white} />,
        ];
      case 'Settings':
        return [
          <BellButton key="settings" navigation={navigation} isWhite={white} />,
        ];
      default:
        break;
    }
  };

 
  renderTabs = () => {
    const { tabs, tabIndex, navigation } = this.props;
    const defaultTab = tabs && tabs[0] && tabs[0].id;

    if (!tabs) return null;

    return (
      <Tabs
        data={tabs || []}
        initialIndex={tabIndex || defaultTab}
        onChange={id => navigation.setParams({ tabId: id })}
      />
    );
  };
  renderHeader = () => {
    const { search, options, tabs } = this.props;
    if (search || tabs || options) {
      return (
        <Block center>
          {tabs ? this.renderTabs() : null}
        </Block>
      );
    }
  };
  render() {
    const {
      back,
      title,
      white,
      transparent,
      bgColor,
      iconColor,
      titleColor,
      navigation,
      screen,
      ...props
    } = this.props;
    const { routeName } = navigation.state;
    const noShadow = ['Search', 'Categories', 'CalendarBusiness', 'Pro', 'Profile'].includes(routeName);
    const headerStyles = [
      !noShadow ? styles.shadow : null,
      transparent ? { backgroundColor: 'rgba(0,0,0,0)' } : null
    ];

    const navbarStyles = [styles.navbar, bgColor && { backgroundColor: bgColor }];

    return (
      <Block style={headerStyles}>
        <NavBar
          title={title}
          style={navbarStyles}
          transparent={transparent}
          right={this.renderRight()}
          rightStyle={{ alignItems: 'center'}}
          left={
            <TouchableOpacity activeOpacity={0.5} onPress={() => {this.handleLeftPress()}} >
              <Icon
                name={back ? 'arrowleft' : 'align-left-22x'}
                family={back ? "AntDesign": "NowExtra"}
                size={back ? 25: 16} 
                color={iconColor || nowTheme.COLORS.ICON}
              />
            </TouchableOpacity>
          }
          leftStyle={{ paddingVertical: 12, flex: 0.2 }}
          titleStyle={[
            styles.title,
            { color: nowTheme.COLORS[white ? 'WHITE' : 'HEADER'] },
            titleColor && { color: titleColor }
          ]}
          {...props}
        />
        {this.renderHeader()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    position: 'relative'
  },
  title: {
    width: '100%',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'montserrat-regular',
    marginLeft: 20
  },
  navbar: {
    paddingVertical: 0,
    paddingBottom: theme.SIZES.BASE * 1.5,
    paddingTop: iPhoneX ? theme.SIZES.BASE * 2: theme.SIZES.BASE,
    zIndex: 5,

  },
  shadow: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.2,
    elevation: 3
  },
  notify: {
    backgroundColor: nowTheme.COLORS.SUCCESS,
    borderRadius: 4,
    height: theme.SIZES.BASE / 2,
    width: theme.SIZES.BASE / 2,
    position: 'absolute',
    top: 9,
    right: 12
  },
  header: {
    backgroundColor: theme.COLORS.WHITE
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.ICON
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: nowTheme.COLORS.BORDER
  },
  options: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.35,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '400',
    color: nowTheme.COLORS.HEADER,
  },
  social: {
    width: theme.SIZES.BASE * 3.5,
    height: theme.SIZES.BASE * 3.5,
    borderRadius: theme.SIZES.BASE * 1.75,
    justifyContent: 'center'
  },
});

export default withNavigation(Header);
