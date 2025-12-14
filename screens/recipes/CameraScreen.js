import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { firebaseConfig } from '../../Secrets';
import { initializeApp } from 'firebase/app';
import { getStorage, uploadBytes, ref, getDownloadURL } from 'firebase/storage';

const app = initializeApp(firebaseConfig); 

// Storage Part
const storage = getStorage(app);
const storageRef = ref(storage);

const saveImage = async (imageUri, existingImageRef = null) => {
    try {
      const response = await fetch(imageUri);
      const imageBlob = await response.blob(); 
      
      let fileName;
      
      if (existingImageRef) {
        // Mystery AI
        const urlParts = existingImageRef.split('/o/')[1];
        const pathWithToken = urlParts ? urlParts.split('?')[0] : null;
        fileName = pathWithToken ? decodeURIComponent(pathWithToken) : `recipe-images/${Date.now()}.jpg`;
      } else {
        // Generate unique filename using timestamp for new images
        const timestamp = Date.now();
        fileName = `recipe-images/${timestamp}.jpg`;
      }
      // End Mystery AI
      
      const imageRef = ref(storage, fileName);
      
      await uploadBytes(imageRef, imageBlob);
      
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch(e) {
      console.log(e);
      return null;
    } 
}

const loadImage = async (imageRef) => {
  if (!imageRef) return null;
  try {
    const photoRef = ref(storage, imageRef);
    const imageUri = await getDownloadURL(photoRef);
    return imageUri;
  } catch(e) {
    console.log(e);
    return null;
  }
}

function CameraScreen({navigation, route}) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.permissionContainer}>
        <MaterialCommunityIcons name="camera-off" size={64} color="#ccc" />
        <Text style={styles.permissionText}>We need your permission to use the camera</Text>
        <TouchableOpacity 
          style={styles.grantButton}
          onPress={requestPermission}
        >
          <Text style={styles.grantButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  let theCamera = undefined;
  return (
    <View style={styles.cameraContainer}>
      <CameraView
        style={styles.camera}
        ratio='4:3'
        pictureSize='Medium'
        ref={ref => theCamera = ref}
      />
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={styles.captureButton}
          onPress={async ()=>{
            let picData = await theCamera.takePictureAsync();
            
            // Call the callback function if provided
            if (route.params?.onImageCaptured) {
              route.params.onImageCaptured(picData.uri);
            }
            
            navigation.goBack();
          }}
        >
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 20,
    gap: 20,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    maxWidth: 300,
  },
  grantButton: {
    backgroundColor: '#E56442',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 100,
    marginTop: 10,
  },
  grantButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#E56442',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E56442',
  },
});

export default CameraScreen;
export { saveImage, loadImage };