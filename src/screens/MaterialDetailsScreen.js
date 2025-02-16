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
        console.error('[MaterialDetailsScreen] Error fetching material details:', error);
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
  const comments = material.CommentMaterials;

  return (
    <>
      {/* Nagłówek z niebieskim tłem */}
      <SafeAreaView style={styles.headerSafeArea} edges={['top']}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#07435D" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </SafeAreaView>

      {/* Treść z białym tłem */}
      <SafeAreaView style={styles.contentSafeArea}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Sekcja: Opis */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Opis</Text>
            <Text style={styles.cardBody}>{description}</Text>
          </View>

          {/* Sekcja: Treść (dla typu 'text') */}
          {contentType === 'text' && content && (
            <View style={styles.card}>
              <Text style={styles.cardHeader}>Treść</Text>
              <Text style={styles.cardBody}>{content}</Text>
            </View>
          )}

          {/* Sekcja: Terapeuta */}
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Terapeuta</Text>
            <View style={styles.therapistContainer}>
              <Ionicons name="person-circle-outline" size={24} color="#07435D" />
              <Text style={styles.cardBody}>
                {therapist ? therapist.name : 'Brak informacji o terapeucie'}
              </Text>
            </View>
          </View>

          {/* Sekcja: Link (dla typu 'link') */}
          {contentType === 'link' && url && (
            <View style={styles.odleglosc}>
              <TouchableOpacity style={styles.actionButton} onPress={handleOpenLink}>
                <Ionicons name="open-outline" size={24} color="#07435D" />
                <Text style={styles.actionText}>Otwórz link</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Sekcja: Placeholder dla innych typów */}
          {(contentType === 'video' || contentType === 'pdf' || contentType === 'audio') && url && (
            <View style={styles.odleglosc}>
              <Text style={styles.cardHeader}>
                {contentType === 'video'
                  ? 'Wideo'
                  : contentType === 'pdf'
                  ? 'PDF'
                  : 'Audio'}
              </Text>
              <Text style={styles.noticeText}>
                {contentType === 'video'
                  ? 'Odtwarzanie wideo – implementacja w przyszłości'
                  : contentType === 'pdf'
                  ? 'Wyświetlanie PDF – implementacja w przyszłości'
                  : 'Odtwarzanie audio – implementacja w przyszłości'}
              </Text>
            </View>
          )}

          {/* Sekcja: Komentarze */}
            <Text style={styles.cardHeader}>Komentarze</Text>
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <Text style={styles.commentAuthor}>
                    {comment.User ? comment.User.email : 'Anonim'}
                  </Text>
                  <Text style={styles.commentBody}>{comment.content}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noComments}>Brak komentarzy</Text>
            )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  headerSafeArea: {
    backgroundColor: '#C8EDFF',
  },
  contentSafeArea: {
    backgroundColor: '#ffffff',
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
  contentContainer: {
    paddingLeft: 30,
    paddingRight: 30,
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
  cardHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#07435D',
    borderRadius: 8,
    marginBottom: 20,

    alignSelf: 'flex-start',
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
  therapistContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
  commentAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#07435D',
  },
  commentBody: {
    fontSize: 16,
    color: '#333',
  },
  noComments: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
  },
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
  odleglosc: {
    marginBottom: 20,
  },
});

export default MaterialDetailsScreen;
