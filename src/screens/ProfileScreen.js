import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../context/AuthContext';

const ProfileScreen = ({navigation}) => {
  const {user, logout} = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Ionicons name="log-out-outline" size={35} color="#07435D" />
          </TouchableOpacity>
        </View>
        <View style={styles.headerContent}>
          <View style={styles.headerProfileIcon}>
            <Ionicons name="person-circle" size={80} color="#07435D" />
          </View>
          <View style={styles.headerWelcomeText}>
            <Text style={styles.welcomeText}>Welcome,</Text>
            <Text style={styles.userNameStyle}>
              {user ? user.userName : 'User'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('EditProfile')}
        style={styles.editButton}>
        <Ionicons name="create-outline" size={25} color="#07435D" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    width: '100%',
    backgroundColor: '#C8EDFF',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  title: {
    color: '#07435D',
    fontSize: 36,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 5,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  headerProfileIcon: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 10,
  },
  headerWelcomeText: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 10,
  },
  welcomeText: {
    color: '#07435D',
    fontSize: 18,
  },
  userNameStyle: {
    fontWeight: 'bold',
    color: '#42BCBA',
    fontSize: 20,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#C8EDFF',
    margin: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#07435D',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default ProfileScreen;
