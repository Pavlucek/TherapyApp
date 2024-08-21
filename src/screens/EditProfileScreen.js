import React, {useContext, useState} from 'react';
import {
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import {AuthContext} from '../context/AuthContext';
import {updateUserDetails} from '../services/authService'; // Import the update function

const EditProfileScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const [updatedUser, setUpdatedUser] = useState({
    name: user?.name || '',
    contact: '',
    address: '',
    date_of_birth: '',
    gender: '',
    emergency_contact: '',
  });

  // Validation functions
  const validateName = name => name.length >= 3 && name.length <= 30;
  const validateContact = contact => contact.length > 0;
  const validateAddress = address => address.length > 0;
  const validateDateOfBirth = date => /^\d{4}-\d{2}-\d{2}$/.test(date);
  const validateGender = gender =>
    ['male', 'female', 'other'].includes(gender.toLowerCase());
  const validateEmergencyContact = emergency_contact =>
    emergency_contact.length > 0;

  const handleSaveChanges = async () => {
    if (!validateName(updatedUser.name)) {
      Alert.alert('Invalid name', 'Name should be between 3 and 30 characters');
      return;
    }
    if (updatedUser.contact && !validateContact(updatedUser.contact)) {
      Alert.alert('Invalid contact', 'Please enter a valid contact');
      return;
    }
    if (updatedUser.address && !validateAddress(updatedUser.address)) {
      Alert.alert('Invalid address', 'Please enter a valid address');
      return;
    }
    if (
      updatedUser.date_of_birth &&
      !validateDateOfBirth(updatedUser.date_of_birth)
    ) {
      Alert.alert(
        'Invalid date of birth',
        'Please enter a valid date in the format YYYY-MM-DD',
      );
      return;
    }
    if (updatedUser.gender && !validateGender(updatedUser.gender)) {
      Alert.alert(
        'Invalid gender',
        'Please select a valid gender (male, female, or other)',
      );
      return;
    }
    if (
      updatedUser.emergency_contact &&
      !validateEmergencyContact(updatedUser.emergency_contact)
    ) {
      Alert.alert(
        'Invalid emergency contact',
        'Please enter a valid emergency contact',
      );
      return;
    }

    try {
      await updateUserDetails(user.token, updatedUser); // No need to store the response
      Alert.alert('Success', 'User details updated successfully');
      navigation.goBack(); // Go back to the previous screen
    } catch (error) {
      Alert.alert('Error', 'Failed to update user details');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={updatedUser.name}
        onChangeText={text => setUpdatedUser({...updatedUser, name: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact"
        value={updatedUser.contact}
        onChangeText={text => setUpdatedUser({...updatedUser, contact: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        value={updatedUser.address}
        onChangeText={text => setUpdatedUser({...updatedUser, address: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        value={updatedUser.date_of_birth}
        onChangeText={text =>
          setUpdatedUser({...updatedUser, date_of_birth: text})
        }
      />
      <TextInput
        style={styles.input}
        placeholder="Gender (male, female, other)"
        value={updatedUser.gender}
        onChangeText={text => setUpdatedUser({...updatedUser, gender: text})}
      />
      <TextInput
        style={styles.input}
        placeholder="Emergency Contact"
        value={updatedUser.emergency_contact}
        onChangeText={text =>
          setUpdatedUser({...updatedUser, emergency_contact: text})
        }
      />
      <Button title="Save Changes" onPress={handleSaveChanges} />
      <Button title="Cancel" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
  },
});

export default EditProfileScreen;
