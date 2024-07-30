import {
  Pressable,
  StyleSheet,
  TextInput,
  Image,
  View,
  FlatList,
  Dimensions,
  TouchableHighlight,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/contexts/userContext';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { ActivityIndicator, Button, Icon, Text } from 'react-native-paper';
import { Colors } from '@/hooks/useThemeColor';
import usePosts from '@/hooks/usePosts';
import { Post } from '@/constants/Types';
import { Controller, useForm } from 'react-hook-form';
import Avatar from '@/components/user/Avatar';

interface FormData {
  content: string;
}

export default function NewPostScreen() {
  const [images, setImages] = useState<string[]>(['']);
  const [disableTouch, setDisableTouch] = useState<boolean>(false);
  const [isUpload, setIsUpload] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contentLength, setContentLength] = useState<number>(0);
  const { dbUser } = useAuth();
  const { addPost } = usePosts();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = useCallback(
    async (data: FormData) => {
      if (!dbUser) {
        console.error('User not authenticated');
        return;
      }

      const trimmedContent = data.content.replace(/^\s+|\s+$/g, '');
      if (trimmedContent.length === 0) {
        console.error('Content cannot be empty');
        return;
      }

      try {
        setIsLoading(true);
        const postData: Omit<Post, 'id' | 'createdAt' | 'updatedAt'> = {
          content: trimmedContent,
          image: images.filter(img => img !== ''),
          upvote: [],
          postedBy: dbUser.displayName,
          authorId: dbUser?.id ?? '',
          comments: [],
          authorJob: dbUser.jobPosition,
          authorImage: dbUser.profilePicture,
        };

        await addPost(postData);

        // Reset the form fields
        reset();
        setImages(['']);
        setIsUpload(false);
        redirectToTabs();
      } catch (error) {
        console.error('Error adding post: ', error);
      } finally {
        setIsLoading(false);
        if (images.length === 1 && images[0] === '') {
          redirectToTabs();
        }
      }
    },
    [dbUser, images, addPost, reset]
  );

  const redirectToTabs = () => {
    router.replace('/(tabs)');
  };

  const pickImages = async () => {
    try {
      setDisableTouch(true);
      setIsUpload(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsMultipleSelection: true,
        orderedSelection: true,
        selectionLimit: 5,
      });

      if (!result.canceled) {
        const imageUris = result.assets.map(asset => asset.uri);
        uploadImagesToFirebase(imageUris);
      }
    } catch (error) {
      console.error(error);
      setIsUpload(false);
    } finally {
      setDisableTouch(false);
      setIsUpload(false);
    }
  };

  const uploadImagesToFirebase = async (imageUris: string[]) => {
    try {
      const promises = imageUris.map(async (uri, index) => {
        const filename = `post/${Date.now()}-${index}.jpg`;
        const imageRef = ref(storage, filename);
        const file = await fetch(uri);
        const blob = await file.blob();
        const snapshot = await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(snapshot.ref);
        setImages(prevImages => {
          const newImages = [...prevImages];
          if (newImages.length === 6) {
            newImages.pop(); // Remove the empty string '' from the end
          }
          newImages.splice(1, 0, downloadURL); // Add the new image after the first element
          return newImages;
        });
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const removeImage = (index: number) => {
    setImages(prevImages => {
      const newImages = [...prevImages];
      newImages.splice(index, 1);
      if (newImages.length === 0) {
        newImages.push(''); // Add an empty string '' if the array becomes empty
      }
      return newImages;
    });
  };

  const handleContentChange = (value: string) => {
    setContentLength(value.replace(/\s+/g, '').length);
  };

  return (
    <>
      <Stack.Screen options={{ title: '', headerRight: () => <Avatar /> }} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.buttonContainer}>
          <Pressable onPress={() => console.log('pressed')}>
            <Text style={styles.postButton}>Post</Text>
          </Pressable>
        </View>

        {images.length > 1 ? (
          <View
            style={{
              height: actuatedNormalize(180),
              marginTop: actuatedNormalize(14),
            }}
          >
            <FlatList
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={images}
              keyExtractor={(item, index) => item + index.toString()}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ marginRight: actuatedNormalize(3) }}>
                    {item === '' ? (
                      <TouchableHighlight onPress={pickImages}>
                        <View
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: actuatedNormalize(180),
                            height: actuatedNormalize(180),
                            backgroundColor: '#f9f9f9',
                          }}
                        >
                          <Icon
                            source="image"
                            size={28}
                            color={Colors.light.secondary}
                          />

                          <Text>Add Image</Text>
                        </View>
                      </TouchableHighlight>
                    ) : (
                      <TouchableHighlight onPress={() => console.log('image')}>
                        <View>
                          <Image
                            source={{ uri: item }}
                            style={{
                              width: actuatedNormalize(180),
                              height: actuatedNormalize(180),
                            }}
                            resizeMode="cover"
                          />
                          <TouchableHighlight
                            onPress={() => removeImage(index)}
                            style={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                              backgroundColor: 'rgba(0, 0, 0, 0.5)',
                              borderRadius: 15,
                              padding: 5,
                            }}
                          >
                            <Icon source="close" size={20} color="#ffffff" />
                          </TouchableHighlight>
                        </View>
                      </TouchableHighlight>
                    )}
                  </View>
                );
              }}
            />
          </View>
        ) : (
          <TouchableHighlight
            onPress={pickImages}
            style={styles.mediaContainer}
            disabled={disableTouch}
          >
            <View style={styles.mediaContent}>
              <View style={styles.mediaInfo}>
                <View style={styles.mediaIcon}>
                  <Icon
                    source="file-image"
                    size={28}
                    color={Colors.light.secondary}
                  />
                </View>
                <Text style={styles.mediaText}>Add media</Text>
              </View>
              {isUpload ? (
                <ActivityIndicator />
              ) : (
                <Icon source="plus" size={28} color={Colors.light.secondary} />
              )}
            </View>
          </TouchableHighlight>
        )}

        <View
          style={{
            backgroundColor: '#ffffff',
            width: '100%',
            paddingHorizontal: actuatedNormalize(16),
            paddingVertical: actuatedNormalizeVertical(14),
            marginTop: actuatedNormalizeVertical(14),
            borderRadius: 20,
            minHeight: actuatedNormalizeVertical(300),
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Controller
            control={control}
            name="content"
            rules={{
              required: 'Content is required',
              maxLength: {
                value: 1000,
                message: 'Content cannot exceed 1000 characters',
              },
              validate: value =>
                value.replace(/\s+/g, '').length > 0 ||
                'Content cannot be empty',
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                editable
                value={value}
                onChangeText={text => {
                  onChange(text);
                  handleContentChange(text);
                }}
                onBlur={() => {
                  const trimmedValue = value.replace(/^\s+|\s+$/g, '');
                  onChange(trimmedValue);
                  handleContentChange(trimmedValue);
                }}
                inlineImageLeft="search_icon"
                placeholder="Share with us your thoughts..."
                multiline
                style={{ lineHeight: actuatedNormalize(20) }}
                maxLength={1000}
              />
            )}
          />

          <View>
            <Text>{contentLength}/1000 characters</Text>
            {errors.content && (
              <Text style={{ color: 'red' }}>{errors.content.message}</Text>
            )}
          </View>
        </View>

        <Button
          mode="contained"
          style={{ marginTop: actuatedNormalizeVertical(20) }}
          theme={{
            colors: {
              primary: Colors.light.secondary,
            },
          }}
          labelStyle={{
            color: isLoading ? '#000000' : '#ffffff',
          }}
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
        >
          <Text>{isLoading ? 'Posting' : 'Post'}</Text>
        </Button>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: Dimensions.get('screen').width,
    padding: actuatedNormalize(16),
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: actuatedNormalize(14),
  },
  postButton: {
    paddingHorizontal: actuatedNormalize(18),
    paddingVertical: actuatedNormalize(6),
    backgroundColor: Colors.light.secondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
    color: '#ffffff',
  },
  blogButton: {
    paddingHorizontal: actuatedNormalize(12),
    paddingVertical: actuatedNormalize(6),
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
    color: Colors.light.secondary,
  },
  mediaContainer: {
    marginTop: actuatedNormalize(14),
    zIndex: 1,
    borderRadius: 20,
  },
  mediaContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: actuatedNormalizeVertical(20),
    paddingHorizontal: actuatedNormalize(16),
    backgroundColor: '#ffffff',
    justifyContent: 'space-between',
    borderRadius: 20,
  },
  mediaInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: actuatedNormalize(14),
  },
  mediaIcon: {
    backgroundColor: '#f1f1f1',
    padding: actuatedNormalize(6),
    borderRadius: 60,
  },
  mediaText: {
    fontSize: actuatedNormalize(15),
    color: '#909090',
  },
});
