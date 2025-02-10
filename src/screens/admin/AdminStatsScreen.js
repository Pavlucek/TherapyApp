import React, { useContext, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; // Importujemy kontekst autoryzacji

const HeaderLogoutButton = () => {
    const { logout } = useContext(AuthContext);
    return <Button title="Wyloguj" onPress={logout} color="#FF5733" />;
};

const AdminStatsScreen = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            headerRight: HeaderLogoutButton,
        });
    }, [navigation]);

    return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Statystyki</Text>
            <Button title="Pokaż logi" onPress={() => navigation.navigate('AdminLogs')} />
            <Button title="Eksportuj dane" onPress={() => navigation.navigate('ExportData')} />
        </View>
    );
};

export default AdminStatsScreen;
