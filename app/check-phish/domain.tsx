import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import axios from 'axios';
import { Stack } from 'expo-router';
import Avatar from '@/components/user/Avatar';
import { actuatedNormalize } from '@/constants/DynamicSize';
import { Colors } from '@/hooks/useThemeColor';
import FlashMessage, { showMessage } from 'react-native-flash-message';

interface FormData {
  url: string;
}

interface ScanResult {
  status: string;
  disposition: string;
  brand: string;
  insights: string;
  screenshot_path: string;
  url_sha256: string;
  // Add other relevant fields from the scan result
}

const ScanUrlPage = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      url: '',
    },
  });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      timeout = setTimeout(() => {
        setIsLoading(false);
        showMessage({
          message: 'Requested timed out.',
          description: 'The URL is invalid. Please check and try again.',
          type: 'danger',
        });
        reset();
      }, 60000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, reset]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post<ScanResult>(
        'https://sibersim-store.onrender.com/scan-url',
        {
          url: data.url,
        }
      );
      setScanResult(response.data);
    } catch (error) {
      setError('Failed to check this request');
    }

    setIsLoading(false);
  };

  console.log(scanResult);

  return (
    <>
      <Stack.Screen options={{ title: '', headerRight: () => <Avatar /> }} />
      <FlashMessage position="top" />
      <View style={styles.container}>
        <View
          style={{
            padding: 20,
            width: Dimensions.get('screen').width,
          }}
        >
          <Text style={styles.title}>Scan a phishing site</Text>
          <Text style={{ fontSize: 10, marginVertical: 1, fontWeight: 'bold' }}>
            Steps to extract a website from the email to scan for phishing
          </Text>
          <Text style={{ fontSize: 10, marginVertical: 1, color: '#909090' }}>
            1. Open the email containing thes suspicious website.
          </Text>
          <Text style={{ fontSize: 10, marginVertical: 1, color: '#909090' }}>
            2. Hold on the link until a tooltip appear.
          </Text>
          <Text style={{ fontSize: 10, marginVertical: 1, color: '#909090' }}>
            3. Copy the URL of the website from the email.
          </Text>
          <Text
            style={{
              fontSize: 10,
              color: '#909090',
              marginBottom: actuatedNormalize(16),
            }}
          >
            4. Paste the URL in the input field below and click Scan.
          </Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="https://example.com"
              />
            )}
            name="url"
            rules={{
              required: 'URL is required',
              pattern: {
                value:
                  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
                message: 'Invalid URL format',
              },
            }}
            defaultValue=""
          />
        </View>

        {errors.url && (
          <Text style={styles.errorText}>{errors.url.message}</Text>
        )}

        <TouchableOpacity
          style={[styles.button, !isValid && styles.disabledButton]}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading || !isValid}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.buttonText}>Scan</Text>
          )}
        </TouchableOpacity>

        {scanResult && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultText}>Scan Result:</Text>
            <Text>Status: {scanResult.status}</Text>
            <Text
              style={{
                color: scanResult.disposition === 'clean' ? 'green' : 'yellow',
              }}
            >
              Result: {scanResult.disposition}
            </Text>
            <Text style={{ fontSize: 11 }}>Hash: {scanResult.url_sha256}</Text>
            <Image
              source={{ uri: scanResult.screenshot_path }}
              style={{
                width: actuatedNormalize(340),
                height: actuatedNormalize(220),
                alignSelf: 'center',
                borderWidth: 2,
                borderColor: Colors.light.secondary,
                marginTop: actuatedNormalize(10),
              }}
              resizeMode="cover"
            />
          </View>
        )}

        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <FlashMessage position="top" />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: actuatedNormalize(10),
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: actuatedNormalize(120),
    paddingVertical: 7,
    borderRadius: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
    width: Dimensions.get('screen').width,
    paddingHorizontal: actuatedNormalize(24),
    display: 'flex',
    flexDirection: 'column',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: actuatedNormalize(8),
  },
  errorText: {
    color: 'red',
    marginBottom: actuatedNormalize(6),
    marginTop: actuatedNormalize(-14),
  },
});

export default ScanUrlPage;
