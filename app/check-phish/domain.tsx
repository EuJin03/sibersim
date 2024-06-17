import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useForm, Controller, FieldErrors } from 'react-hook-form';
import axios from 'axios';
import { Stack } from 'expo-router';
import Avatar from '@/components/user/Avatar';

interface FormData {
  url: string;
}

interface ScanResult {
  status: string;
  disposition: string;
  brand: string;
  // Add other relevant fields from the scan result
}

const ScanUrlPage = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

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

  return (
    <>
      <Stack.Screen options={{ title: '', headerRight: () => <Avatar /> }} />
      <View style={styles.container}>
        <Text style={styles.title}>Scan URL</Text>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Enter URL"
            />
          )}
          name="url"
          rules={{ required: 'URL is required' }}
          defaultValue=""
        />

        {errors.url && (
          <Text style={styles.errorText}>{errors.url.message}</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Scan</Text>
        </TouchableOpacity>

        {isLoading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {scanResult && (
              <View style={styles.resultContainer}>
                <Text style={styles.resultText}>Scan Result:</Text>
                <Text>Status: {scanResult.status}</Text>
                <Text>Disposition: {scanResult.disposition}</Text>
                <Text>Brand: {scanResult.brand}</Text>
                {/* Display other relevant fields from the scan result */}
              </View>
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 20,
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
  },
});

export default ScanUrlPage;
