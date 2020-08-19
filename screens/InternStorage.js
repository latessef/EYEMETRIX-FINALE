import AsyncStorage from '@react-native-community/async-storage'; 

export  const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@UID_Key', value)
    } catch (e) {
      // saving error
    }
  }
 
export const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@UID_Key')
      if(value !== null) {
          return value;
        // value previously stored
      }
    } catch(e) {
      // error reading value
    }
  }

  export const removeValue = async () => {
    try {
      await AsyncStorage.removeItem('@UID_Key')
    } catch(e) {
      // remove error
    }
 }