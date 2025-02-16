import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getMaterialDetails } from '../api/sharedMaterialsApi';
import { AuthContext } from '../context/AuthContext';

const MaterialDetailsScreen = ({ route, navigation }) => {
  const { id } = route.params; // resource ID
  const { user } = useContext(AuthContext);
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!user) {return;}
      console.log(`[MaterialDetailsScreen] GET /materials/${id}/details`);
      try {
        const data = await getMaterialDetails(user.token, id);
        console.log('[MaterialDetailsScreen] Materiał pobrany:', data);
        setMaterial(data);
      } catch (error) {
        console.error(
          '[MaterialDetailsScreen] Error fetching material details:',
          error
        );
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, user]);

  const handleOpenLink = () => {
    if (material && material.url) {
      Linking.openURL(material.url);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#07435D" />
        <Text style={styles.loaderText}>Ładowanie szczegółów materiału...</Text>
      </View>
    );
  }

  if (!material) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Nie znaleziono materiału</Text>
      </View>
    );
  }

  const { title, description, content, contentType, url } = material;
  const therapist = material.Therapist;

  return (
    <>
      {/* Nagłówek z niebieskim tłem */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.headerContainer}>
          {/* Ikona powrotu */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#07435D" />
          </TouchableOpacity>

          {/* Tytuł + terapeuta (opcjonalnie) */}
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{title}</Text>
            {/* Wyświetlamy terapeutę jako mały tekst, jeśli dostępny */}
            {therapist && therapist.name ? (
              <View style={styles.therapistHeaderContainer}>
                <Ionicons
                  name="person-circle-outline"
                  size={16}
                  color="#07435D"
                  style={{ marginRight: 5 }}
                />
                <Text style={styles.therapistHeaderLabel}>Terapeuta: </Text>
                <Text style={styles.therapistHeaderText}>
                  {therapist.name}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </SafeAreaView>

      {/* Treść z białym tłem */}
      <SafeAreaView style={styles.contentSafeArea}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Sekcja: OPIS (tytuł poza kartą) */}
          <Text style={styles.sectionTitle}>Opis</Text>
          <View style={styles.card}>
            <Text style={styles.cardBody}>{description}</Text>
          </View>

          {/* Sekcja: TREŚĆ (tylko jeśli contentType === 'text') */}
          {contentType === 'text' && content && (
            <>
              <Text style={styles.sectionTitle}>Treść</Text>
              <View style={styles.card}>
                <Text style={styles.cardBody}>{content}</Text>
              </View>
            </>
          )}

          {/* Sekcja: LINK (dla contentType === 'link') */}
          {contentType === 'link' && url && (
            <>
              <Text style={styles.sectionTitle}>Link</Text>
              <View style={styles.odleglosc}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={handleOpenLink}
                >
                  <Ionicons name="open-outline" size={24} color="#07435D" />
                  <Text style={styles.actionText}>Otwórz link</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Sekcja: placeholder dla VIDEO / PDF / AUDIO */}
          {(contentType === 'video' ||
            contentType === 'pdf' ||
            contentType === 'audio') &&
            url && (
              <>
                <Text style={styles.sectionTitle}>
                  {contentType === 'video'
                    ? 'Wideo'
                    : contentType === 'pdf'
                    ? 'PDF'
                    : 'Audio'}
                </Text>
                <View style={styles.odleglosc}>
                  <Text style={styles.noticeText}>
                    {contentType === 'video'
                      ? 'Odtwarzanie wideo – implementacja w przyszłości'
                      : contentType === 'pdf'
                      ? 'Wyświetlanie PDF – implementacja w przyszłości'
                      : 'Odtwarzanie audio – implementacja w przyszłości'}
                  </Text>
                </View>
              </>
            )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: '#C8EDFF',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  contentSafeArea: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  headerContainer: {
    backgroundColor: '#C8EDFF',
    paddingTop: 20,
    paddingBottom: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#07435D',
    flexShrink: 1,
  },
  /* Nowe elementy w nagłówku */
  therapistHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    flexWrap: 'wrap',
  },
  therapistHeaderLabel: {
    fontSize: 14,
    color: '#07435D',
    fontWeight: 'bold',
  },
  therapistHeaderText: {
    fontSize: 14,
    color: '#07435D',
  },
  contentContainer: {
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#07435D',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#F0F8FF',
    borderRadius: 15,
    padding: 30,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardBody: {
    fontSize: 14,
    color: '#07435D',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
  },
  actionText: {
    fontSize: 18,
    color: '#07435D',
    marginLeft: 10,
  },
  noticeText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
  odleglosc: {
    marginBottom: 20,
  },
  // Ekran ładowania / błąd
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#07435D',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});

export default MaterialDetailsScreen;
