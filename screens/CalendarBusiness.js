import React from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  VirtualizedList,
  Dimensions, TouchableOpacity
} from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";
import EditTime from "../components/EditTime";
import nowTheme from "../constants/Theme";
import {Collapse,CollapseHeader, CollapseBody} from 'accordion-collapse-react-native';
import JoursRepos from "../components/JoursRepos";
import JoursFeriers from "../components/JoursFeriers";
import HorairesSemaine from "../components/HorairesSemaine";
import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get('screen');

export default class CalendarBusiness extends React.Component {

  state = {
    
  };
 
  renderItem = ({ item }) => {
    const id_1 = this.props.navigation.getParam('id');
    switch (item.type) {
        case "repos":
            return (
              <JoursRepos _id = {id_1}/>
            );
        case "feriers":
            return (
              <JoursFeriers _id = {id_1}/>
            );
        case "jours":
            return (
              <EditTime _id = {id_1}/>
            );
        case "semaine":
          return (
              <HorairesSemaine _id = {id_1}/>
          );
        default:
            break;
    }
  };
  

  render() {
    const { navigation } = this.props;
    const id_1 = this.props.navigation.getParam('id');
    const Calendrier = [
      { title: "Calendrier", id: "Calendrier", type: "Calendrier" },
    ];
    const joursRepos = [
      { title: "jours de repos", id: "joursRepos", type: "repos" },
    ];
    const joursFériers = [
      { title: "jours fériers", id: "joursFériers", type: "feriers" },
    ];

    const horaires = [
      { title: "Horaires de travail par jour", id: "horairesTravail", type: "jours" },
    ];
    const horairesSemaine = [
      { title: "Horaires de travail par Semaine", id: "horairesTravail", type: "semaine" },
    ];    
    return (
      <ScrollView
        style={styles.settings}
      >
        <TouchableOpacity onPress={() => {this.props.navigation.push('BusinessCalendar', {id : id_1});}}>
          <Block style={styles.title}>
            <Text style={{fontFamily: 'montserrat-bold', paddingBottom: 5}} size={theme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>
                Calendrier
            </Text>
            <Block row middle space="between">
               <Text style={{fontFamily: 'montserrat-regular'}} size={12} color={nowTheme.COLORS.CAPTION} color={nowTheme.COLORS.BLACK}>
                   Consultez le calendrier de travail de ce projet.
               </Text>
               <Icon
                  name="calendar"
                  family="font-awesome"
                  style={{ paddingRight: 5 }}
                  size={20}
                />
            </Block>  
          </Block>
        </TouchableOpacity>
        <Collapse isCollapsed>
          <CollapseHeader>
              <Block style={styles.title}>
                <Text style={{fontFamily: 'montserrat-bold', paddingBottom: 5}} size={theme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>
                  Horaires de travail par jour
                </Text>
                <Text style={{fontFamily: 'montserrat-regular'}} size={12} color={nowTheme.COLORS.CAPTION} color={nowTheme.COLORS.BLACK}>
                Veuillez saisir le début et la fin des horaires de travail.
                </Text>
              </Block>
          </CollapseHeader>
          <CollapseBody>
            <FlatList
              horizontal
              data={horaires}
              keyExtractor={(item, index) => item.id}
              renderItem={this.renderItem}
            />
          </CollapseBody>
        </Collapse>
        <Collapse isCollapsed>
          <CollapseHeader>
              <Block style={styles.title}>
                <Text style={{fontFamily: 'montserrat-bold', paddingBottom: 5}} size={theme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>
                  Horaires de travail par semaine
                </Text>
                <Text style={{fontFamily: 'montserrat-regular'}} size={12} color={nowTheme.COLORS.CAPTION} color={nowTheme.COLORS.BLACK}>
                  Veuillez saisir le début et la fin des horaires de travail.
                </Text>
              </Block>
          </CollapseHeader>
          <CollapseBody>
            <FlatList
              horizontal
              data={horairesSemaine}
              keyExtractor={(item, index) => item.id}
              renderItem={this.renderItem}
            />
          </CollapseBody>
        </Collapse>
        <Collapse  isCollapsed>
          <CollapseHeader>
            <Block  style={styles.title}>
              <Text style={{ fontFamily: 'montserrat-bold', paddingBottom: 5 }} size={theme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>
                Jours de repos
              </Text>
              <Text style={{ fontFamily: 'montserrat-regular' }} size={12} color={nowTheme.COLORS.CAPTION} color={nowTheme.COLORS.BLACK}>
                Choisissez les jours de repos.
              </Text>
            </Block>
          </CollapseHeader>
          <CollapseBody>
            <FlatList
              horizontal
              data={joursRepos}
              keyExtractor={(item, index) => item.id}
              renderItem={this.renderItem}
            />
          </CollapseBody>
        </Collapse>
        <Collapse isCollapsed>
          <CollapseHeader>
            <Block style={styles.title}>
              <Text style={{ fontFamily: 'montserrat-bold', paddingBottom: 5 }} size={theme.SIZES.BASE} color={nowTheme.COLORS.BLACK}>
                Jours fériés
              </Text>
              <Text style={{ fontFamily: 'montserrat-regular' }} size={12} color={nowTheme.COLORS.CAPTION} color={nowTheme.COLORS.BLACK}>
                Choisissez les jours fériés ou vous ne travaillez pas.
              </Text>
            </Block>
            </CollapseHeader>
            <CollapseBody>
              <FlatList
                horizontal
                data={joursFériers}
                keyExtractor={(item, index) => item.id}
                renderItem={this.renderItem}
              /> 
            </CollapseBody>
        </Collapse>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  settings: {
    padding : 15,
    paddingVertical: theme.SIZES.BASE / 3
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2
  },
  rows: {
    height: theme.SIZES.BASE * 2,
    paddingHorizontal: theme.SIZES.BASE,
    marginBottom: theme.SIZES.BASE / 2
  },

});
