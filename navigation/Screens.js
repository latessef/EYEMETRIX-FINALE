import React, { useState } from 'react';
import { Block } from "galio-framework";
import { Easing, Animated } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';


// screens
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Register from '../screens/Register';
import Articles from '../screens/Articles';
import Inscription from '../screens/Inscription';
import Login from '../screens/Login';
import Surveillance from '../screens/Surveillance';
import SurveillanceUser from '../screens/SurveillanceUser'
import Notification from '../screens/Notification';
import CalendarBusiness from '../screens/CalendarBusiness';
import Calendar from '../screens/Calendar';
import ForgotPassword from '../screens/ForgotPassword';
import Projects from '../screens/Projects';
import ProjectSurv from '../screens/ProjectSurv';
import ProjectCal from '../screens/ProjectCal';
import ProjectRap from '../screens/ProjectRap';
import Rapports from '../screens/Rapports';
import Feedback from '../screens/Feedback';


// settings
import SettingsScreen from '../screens/Settings';

// drawer
import Menu from './Menu';
import DrawerItem from '../components/DrawerItem';

// header for screens
import Header from '../components/Header';


const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = 'Search';

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});


const SettingsStack = createStackNavigator(
  {
    Settings: {
      screen: SettingsScreen,
      navigationOptions: ({ navigation }) => ({
        header: () => <Header title="Paramètres" navigation={navigation} screen="Home" back={true}/>
      })
    }
    
  },
  {
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFFFFF' },
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
    },
  }
);

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: Profile,
      navigationOptions: ({ navigation }) => ({
        header: () =>  (
          <Header transparent title="Profile" titleColor= {'#000000'} iconColor={'white'} navigation={navigation} screen="Home" back={true} titleColor={'white'}/>
        ),
        headerTransparent: true
      })
    }
  },
  {
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFFFFF' },
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
    },
  },
);

const AccountStack = createStackNavigator(
  {
    Account: {
      screen: Register,
      navigationOptions: ({ navigation }) => ({
        header: () =>  (
          <Header transparent title="Ajout d'un compte" iconColor={'white'} navigation={navigation} screen="Home" back={true} titleColor={'white'}/>
        ),
        headerTransparent: true
      })
    }
  },
  {
    
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFFFFF' },
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
    },
  }
);

const SurveillanceStack = createStackNavigator(
  {
    Surveillance: {
      screen: Surveillance,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Surveillance" navigation={navigation} screen="ProjectSurv" back={true}/>
      })
    }
  },
  {
    
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
    },
  }
);
const SurveillanceUsereStack = createStackNavigator(
  {
    Surveillance: {
      screen: SurveillanceUser,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Surveillance" navigation={navigation} screen="Home" back={true}/>
      })
    }
  },
  {
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
    },
  }
);

const RapportStack = createStackNavigator(
  {
    Rapports: {
      screen: Rapports,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Rapports" navigation={navigation} screen="ProjectRap" back={true}/>
      })
    }
  },
  {
    
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
    },
  }
);

const ProjectsRapStack = createStackNavigator(
  {
    ProjectRap: {
      screen: ProjectRap,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Rapports" navigation={navigation} screen="Home" back={true}/>
      }),
    }
  },
  {
    defaultNavigationOptions: {
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
    },
  }
);

const ProjectsSurvStack = createStackNavigator(
  {
    ProjectSurv: {
      screen: ProjectSurv,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Surveillance" navigation={navigation} screen="Home" back={true}/>
      }),
    }
  },
  {
    defaultNavigationOptions: {
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
    },
  }
);


const CalendarStack = createStackNavigator(
  {
    Calendar: {
      screen: CalendarBusiness,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Calendrier business" navigation={navigation} screen="ProjectCal" back={true}/>
      })
    }
  },
  {
    
    defaultNavigationOptions: {
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
    },
  }
);


const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home,
      index : 1,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Accueil" navigation={navigation} />
      }),
    },
  },
  
  {
    defaultNavigationOptions: {
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
    },
  },
);

const ProjectsStack = createStackNavigator(
  {
    Projects: {
      screen: Projects,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Mes projets" navigation={navigation} screen="Home" back={true}/>
      }),
    }
  },
  {
    defaultNavigationOptions: {
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
    },
  }
);

const ProjectsCalendarStack = createStackNavigator(
  {
    ProjectCal: {
      screen: ProjectCal,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Calendrier business" navigation={navigation} screen="Home" back={true}/>
      }),
    }
  },
  {
    defaultNavigationOptions: {
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
    },
  }
);

const BusinessCalendarStack = createStackNavigator(
  {
    BusinessCalendar: {
      screen: Calendar,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Calendrier business" navigation={navigation} screen="CalendarBusiness" back={true}/>
      })
    }
  },
  {
    defaultNavigationOptions: {
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
    },
  }
);
const NotificationStack = createStackNavigator(
  {
    Notification: {
      screen: Notification,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Notification" navigation={navigation} screen="Home" back={true}/>
      })
    }
  },
  {
    defaultNavigationOptions: {
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
    },
  }
);
const FeedbackStack = createStackNavigator(
  {
    BusinessCalendar: {
      screen: Feedback,
      navigationOptions: ({ navigation }) => ({
        header: () =>  <Header title="Feedback" navigation={navigation} screen="Home" back={true}/>
      })
    }
  },
  {
    defaultNavigationOptions: {
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
      cardStyle: {
        backgroundColor: '#FFFFFF'
      },
    },
  }
);
const ForgotPasswordStack = createStackNavigator(
  {
    ForgotPassword: {
      screen: ForgotPassword,
      navigationOptions: ({ navigation }) => ({
        header: () =>  (
          <Header transparent iconColor={'#FFFFFF'} navigation={navigation} screen="Login" back={true} title=""/>
        ),
        headerTransparent: true
      })
    }
  },
  {
    defaultNavigationOptions: {
      cardStyle: { backgroundColor: '#FFFFFF' },
      transitionConfig: () => fromRight().TransitionPresets.SlideFromRightIOS,
    },
  }
);



const AppStack = createDrawerNavigator(     
  {
    // Inscription: {
    //   screen: Inscription,
    //   navigationOptions: ( { navigation } ) => ( {
    //     drawerLabel: ( ) => { },
    //     drawerLockMode: 'locked-closed',
    //   }),
    // },
    Login: {
      screen: Login,
      navigationOptions: ( { navigation } ) => ( {
        drawerLabel: ( ) => { },
        drawerLockMode: 'locked-closed',
        
      }),
    },
    ForgotPassword: {
      screen: ForgotPasswordStack,
      navigationOptions: ( { navigation } ) => ( {
        drawerLabel: () => { },
        drawerLockMode: 'locked-closed',
      }),
    },
    Home: {
      screen: HomeStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => <DrawerItem focused={focused} title="Accueil" />
      })
    },
    Surveillance: {
      screen: SurveillanceStack,
      navigationOptions: ( { navigation } ) => ( {
        drawerLabel: ( ) => { },
      }),
    },
    SurveillanceUser: {
      screen: SurveillanceUsereStack,
      navigationOptions: ( { navigation } ) => ( {
        drawerLabel: ( ) => { },
      }),
    },
    ProjectSurv: {
      screen: ProjectsSurvStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Surveillance" title="Surveillance" />
        )
      })
    },
    Rapports: {
      screen: RapportStack,
      navigationOptions: ( { navigation } ) => ( {
        drawerLabel: ( ) => { },
      }),
    },
  
    ProjectRap: {
      screen: ProjectsRapStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Rapports" title="Rapports" />
        )
      })
    },
    Calendar: {
      screen: CalendarStack,
      navigationOptions: ( { navigation } ) => ( {
        drawerLabel: ( ) => { },
      }),
    },
    ProjectCalendar: {
      screen: ProjectsCalendarStack,
      navigationOptions: navOpt => ({ 
        drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} screen=" " title="Calendrier business" />
        )
      })
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Profile" title="Profile" />
        )
      })
    },
    Projects: {
      screen: ProjectsStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Projects" title="Mes projets" />
        )
      })
    },
    Account: {
      screen: AccountStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Register" title="Ajouter utilisateur" />
        )
      })
    },
    Components: {
      screen: SettingsStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Settings" title="Paramètres" />
        )
      })
    },
    Notification:{
      screen: NotificationStack,
      navigationOptions: {
        drawerLabel: () => { }
      },
    },
    CaleBusinessCalendarndar: {
      screen: BusinessCalendarStack,
      navigationOptions: navOpt => ({
        drawerLabel: () => { },
      })
    },
    Feedback: {
      screen: FeedbackStack,
      navigationOptions: navOpt => ({
        drawerLabel: () => { },
      })
    },
  },
  Menu
);

const AppContainer = createAppContainer(AppStack);


export default AppContainer;
