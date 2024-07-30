import React, { useEffect } from 'react';
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
import { useForm, Controller } from 'react-hook-form';
import { SegmentedButtons } from 'react-native-paper';
import axios from 'axios';
import { Colors } from '@/hooks/useThemeColor';
import { Stack } from 'expo-router';
import Avatar from '@/components/user/Avatar';
import { actuatedNormalize } from '@/constants/DynamicSize';
import { create } from 'zustand';

interface FormData {
  searchValue: string;
}

interface SearchState {
  searchValue: string;
  searchType: '1' | '2';
  information: string;
  loading: boolean;
  error: string;
  countdown: number;
  setSearchValue: (value: string) => void;
  setSearchType: (type: '1' | '2') => void;
  setInformation: (info: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string) => void;
  setCountdown: (countdown: number) => void;
  resetState: () => void;
}

const useSearchStore = create<SearchState>(set => ({
  searchValue: '',
  searchType: '1',
  information: '',
  loading: false,
  error: '',
  countdown: 180,
  setSearchValue: value => set({ searchValue: value }),
  setSearchType: type => set({ searchType: type }),
  setInformation: info => set({ information: info }),
  setLoading: isLoading => set({ loading: isLoading }),
  setError: error => set({ error: error }),
  setCountdown: countdown => set({ countdown: countdown }),
  resetState: () =>
    set({
      searchValue: '',
      searchType: '1',
      information: '',
      loading: false,
      error: '',
      countdown: 180,
    }),
}));

const ScammerDetails = () => {
  const {
    searchValue,
    searchType,
    information,
    loading,
    error,
    countdown,
    setSearchValue,
    setSearchType,
    setInformation,
    setLoading,
    setError,
    setCountdown,
  } = useSearchStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      searchValue: searchValue,
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading, countdown, setCountdown]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError('');
    setInformation('');
    setCountdown(180);
    setSearchValue(data.searchValue);

    const fetchData = async () => {
      try {
        const response = await axios.post(
          'https://semakmule.rmp.gov.my/index1.cfm',
          `KeywordCARIAN=${data.searchValue}&kategoriCARIAN=${searchType}&KodKeselanatanCCIS=B3D9&KODKeselamatanASal=B3D9&CariMAklumatJSM=Check+Information`,
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

    fetchData();
  };

  const renderInformation = () => {
    const lines = information.split('\n');
    const title = lines[0].trim();
    const subtext = lines.slice(1).join('\n').trim();

    return (
      <>
        <Text
          style={{
            fontSize: 20,
            color: title.toLowerCase().includes('no report earned')
              ? Colors.light.secondary
              : 'red',
            marginBottom: 8,
          }}
        >
          {title.toLowerCase().includes('no report earned')
            ? title
            : title.length !== 0 && 'Scammer Detected!'}
        </Text>
        <Text style={{ fontSize: 12, color: '#909090' }}>
          {title.toLowerCase().includes('no report earned')
            ? subtext
            : title.length !== 0 &&
              searchValue +
                ' has been reported as a scammer several times. Please do not engage with this person/account.'}
        </Text>
        <View
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: actuatedNormalize(14),
          }}
        >
          {subtext && subtext.length !== 0 && (
            <Image
              source={{
                uri: title.toLowerCase().includes('no report earned')
                  ? 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/blogs%2Fsafe.jpg?alt=media&token=9778221d-09d2-4b86-9dcd-a602f2d46ac4'
                  : 'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/blogs%2Fdanger.jpg?alt=media&token=8500578e-db0d-422a-ba1f-717bb3627c81',
              }}
              height={260}
              width={260}
              style={{
                borderRadius: 999,
                borderWidth: 1,
                borderColor: Colors.light.secondary,
              }}
              resizeMode="contain"
            />
          )}
        </View>
      </>
    );
  };

  const handlePress = () => {
    Linking.openURL('https://semakmule.rmp.gov.my/');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <>
      <Stack.Screen options={{ title: '', headerRight: () => <Avatar /> }} />
      <View style={styles.container}>
        <Text style={styles.title}>Semak Mule</Text>
        <Text style={styles.description}>
          All data are sourced from the official PDRM site known as{' '}
          <Text style={styles.link} onPress={handlePress}>
            CCID Portal
          </Text>
          .
        </Text>

        <SegmentedButtons
          value={searchType}
          onValueChange={value => setSearchType(value as '1' | '2')}
          buttons={[
            {
              value: '1',
              label: 'Bank Account',
              style: {},
              checkedColor: Colors.light.secondary,
              icon: 'bank',
              labelStyle: { fontSize: 12 },
            },
            {
              value: '2',
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
                searchType === '1'
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
          <View
            style={{
              flex: 1,
              marginTop: 60,
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <ActivityIndicator size="large" color={Colors.light.secondary} />
            <Text>Please wait while contacting a CCIS...</Text>
            {countdown > 0 ? (
              <Text
                style={{
                  color: Colors.light.secondary,
                }}
              >
                Time Estimated: {formatTime(countdown)}
              </Text>
            ) : (
              <Text>
                Please try to search again later, or visit the site directly at{' '}
                <Text style={styles.link} onPress={handlePress}>
                  https://semakmule.rmp.gov.my/
                </Text>
              </Text>
            )}
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
    marginBottom: 2,
  },
  description: {
    color: '#909090',
    marginBottom: 16,
    fontSize: 12,
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
    color: '#0000ff',
    textDecorationLine: 'underline',
  },
});

export default ScammerDetails;
