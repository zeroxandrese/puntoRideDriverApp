import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Text, TextInput, Button, Card, Avatar, ActivityIndicator } from 'react-native-paper';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import useAuthStore from '../globalState/globalState';
import { RootStackParamList } from '../interface/interface';
import { useServiceBusinessStore } from '../store/business/useServiceBusiness';
import { globalStyle } from '../theme/global.style';
import ArrowBack from '../assets/arrowBack.svg';

type NavigationProps = StackNavigationProp<RootStackParamList, "HomeScreen">;

export const ProfileScreen: React.FC = () => {
  const { user, updateAvatar } = useAuthStore();
  const { tripCurrentVehicle, weeklyEarnings } = useServiceBusinessStore();
  const navigation = useNavigation();

  // Estado para el teléfono
  const [phone, setPhone] = useState<string>(user?.numberPhone || '');
  // Estado para la URI de la imagen (vista previa)
  const [photoUri, setPhotoUri] = useState<string | undefined>(user?.img);
  // Estado para el asset completo (para subirlo luego)
  const [photoFile, setPhotoFile] = useState<Asset | null>(null);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, response => {
      const asset = response.assets?.[0];
      if (asset) {
        setPhotoUri(asset.uri);
        setPhotoFile(asset);
      }
    });
  };

  const handleUploadPhoto = async () => {
    setIsLoadingPhoto(true);
    if (!photoFile) return;
    await updateAvatar(photoFile);
    setIsLoadingPhoto(false);
    setPhotoFile(null);
  };

  const handleSavePhone = () => {
    // Aquí guardas el teléfono en tu backend o state global
    // e.j. serviceDriver.updatePhone(user.uid, phone)
  };


  return (
    <View style={globalStyle.GlobalContainerCustom}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 60 }}
        >
          <ArrowBack width={60} height={60} />
        </TouchableOpacity>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={handleChoosePhoto}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatar} />
            ) : (
              <Avatar.Icon size={100} icon="account" />
            )}
          </TouchableOpacity>
          {photoFile && !isLoadingPhoto && (
            <Button
              mode="contained"
              onPress={handleUploadPhoto}
              style={{ marginTop: 12, alignSelf: 'center' }}
            >
              Subir foto
            </Button>
          )}

          {isLoadingPhoto && (
            <ActivityIndicator
              size="small"
              style={{ marginTop: 12, alignSelf: 'center' }}
            />
          )}

          <Text style={styles.name}>{user?.name || 'Nombre no disponible'}</Text>
        </View>

        <Card style={globalStyle.containerCard}>
          <Card.Title title="Vehículo" titleStyle={{ color: '#000000' }} />
          <Card.Content>
            <Text style={styles.label}>Modelo:</Text>
            <Text style={styles.value}>{tripCurrentVehicle?.model || 'No disponible'}</Text>
            <Text style={styles.label}>Placa:</Text>
            <Text style={styles.value}>{tripCurrentVehicle?.register || 'No disponible'}</Text>
          </Card.Content>
        </Card>

{/*         <Card style={globalStyle.containerCard}>
          <Card.Title title="Número de teléfono" titleStyle={{ color: '#000000' }} />
          <Card.Content>
            <TextInput
              label="Teléfono"
              value={phone}
              keyboardType="phone-pad"
              onChangeText={setPhone}
              style={styles.input}
            />
            <Button mode="contained" onPress={handleSavePhone} style={styles.button}>
              Guardar
            </Button>
          </Card.Content>
        </Card> */}

        <Card style={[globalStyle.containerCard, styles.balanceCard]}>
          <Card.Title title="Saldo semanal a favor" titleStyle={{ color: '#000000' }} />
          <Card.Content>
            <Text style={styles.balanceValue}>$ {weeklyEarnings ?? 0}</Text>
            <Text style={styles.balanceDesc}>
              Este monto corresponde a los cupones cubiertos por la app.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    marginTop: 12,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: '#000',
  },
  input: {
    marginTop: 8,
    backgroundColor: 'transparent',
  },
  button: {
    marginTop: 12,
  },
  balanceCard: {
    backgroundColor: '#e0f7fa',
  },
  balanceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00796b',
  },
  balanceDesc: {
    marginTop: 4,
    fontSize: 14,
    color: '#004d40',
  },
});
