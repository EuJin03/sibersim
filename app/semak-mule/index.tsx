import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Image,
} from 'react-native';
import { useForm, Controller, FieldError } from 'react-hook-form';
import { SegmentedButtons } from 'react-native-paper';
import axios from 'axios';
import { Colors } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import Avatar from '@/components/user/Avatar';

interface FormData {
  searchValue: string;
}

const ScammerDetails = () => {
  const [information, setInformation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchType, setSearchType] = useState('bank');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    setInformation('');

    try {
      const response = await axios.post(
        'https://semakmule.rmp.gov.my/index1.cfm',
        `KeywordCARIAN=${data.searchValue}&kategoriCARIAN=${
          searchType === 'bank' ? '1' : '2'
        }&KodKeselanatanCCIS=B3D9&KODKeselamatanASal=B3D9&CariMAklumatJSM=Check+Information`,
        {
          headers: {
            Accept:
              'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'max-age=0',
            Connection: 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded',
            Cookie: 'JSESSIONID=586666B46EC2E436C1D805C5F969089D.cfusion',
            Origin: 'https://semakmule.rmp.gov.my',
            Referer: 'https://semakmule.rmp.gov.my/index1.cfm',
            'Sec-Fetch-Dest': 'iframe',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Sec-Fetch-User': '?1',
            'Upgrade-Insecure-Requests': '1',
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 Edg/126.0.0.0',
          },
        }
      );

      const htmlResponse = response.data;
      const startTag = '<span class="style15">';
      const endTag = '</span>';
      const startIndex = htmlResponse.indexOf(startTag);
      const endIndex = htmlResponse.indexOf(endTag, startIndex);

      if (startIndex !== -1 && endIndex !== -1) {
        let extractedInformation = htmlResponse
          .slice(startIndex + startTag.length, endIndex)
          .trim();
        extractedInformation = extractedInformation.replace(
          /<br\s*\/?>/gi,
          '\n'
        );
        extractedInformation = extractedInformation.replace(/<\/?em>/g, '');
        setInformation(extractedInformation);
      } else {
        setInformation('Information not found');
      }
    } catch (error) {
      console.error('Error fetching scammer details:', error);
      setError('An error occurred. Please try again.');
    }

    setLoading(false);
  };

  const renderInformation = () => {
    const lines = information.split('\n');
    const title = lines[0].trim();
    const subtext = lines.slice(1).join('\n').trim();

    console.log(lines);

    return (
      <>
        <Text
          style={{
            fontSize: 20,
            color: Colors.light.secondary,
            marginBottom: 8,
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 12, color: '#909090' }}>{subtext}</Text>
        <View
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={{
              uri: 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/blogs%2Fsafe.jpg?alt=media&token=9778221d-09d2-4b86-9dcd-a602f2d46ac4',
            }}
            height={300}
            width={300}
            style={{ marginTop: 10 }}
          />
        </View>
      </>
    );
  };

  const handlePress = () => {
    Linking.openURL('https://semakmule.rmp.gov.my/');
  };

  return (
    <>
      <Stack.Screen
        options={{ title: 'Check Mule', headerRight: () => <Avatar /> }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Scammer Details</Text>

        <SegmentedButtons
          value={searchType}
          onValueChange={setSearchType}
          buttons={[
            {
              value: 'bank',
              label: 'Bank Account',
              style: {},
              checkedColor: Colors.light.secondary,
              icon: 'bank',
              labelStyle: { fontSize: 12 },
            },
            {
              value: 'phone',
              label: 'Phone Number',
              style: {},
              icon: 'phone',
              checkedColor: Colors.light.secondary,
              labelStyle: { fontSize: 12 },
            },
          ]}
          style={styles.segmentedButtons}
          density="small"
          theme={{ roundness: 1 }}
        />

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={styles.input}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder={
                searchType === 'bank'
                  ? 'Enter bank account number'
                  : 'Enter phone number'
              }
              keyboardType="numeric"
            />
          )}
          name="searchValue"
          rules={{
            required: 'This is required',
            pattern: {
              value: /^[0-9]+$/,
              message: 'Please enter only digits',
            },
          }}
          defaultValue=""
        />
        {errors.searchValue && (
          <Text style={styles.errorText}>
            {errors.searchValue.message as string}
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(onSubmit)}
        >
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>

        {loading ? (
          <View style={{ flex: 1 }}>
            <ActivityIndicator size="large" color={Colors.light.secondary} />
            <Text>Please wait while contacting a CCIS Server</Text>
          </View>
        ) : (
          <>
            {error ? (
              <Text style={styles.errorText}>
                Error querying scammer details. Please check directly on{' '}
                <Text style={styles.link} onPress={handlePress}>
                  https://semakmule.rmp.gov.my/
                </Text>
                .
              </Text>
            ) : (
              <View>{renderInformation()}</View>
            )}
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 12,
    paddingHorizontal: 10,
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.light.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default ScammerDetails;
