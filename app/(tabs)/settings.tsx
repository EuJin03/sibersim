import { View, Text, Dimensions } from 'react-native';
import React from 'react';
import { Avatar, Button, IconButton, List } from 'react-native-paper';
import { useAuth } from '@/contexts/userContext';
import {
  actuatedNormalize,
  actuatedNormalizeVertical,
} from '@/constants/DynamicSize';
import { Colors } from '@/hooks/useThemeColor';

export default function settings() {
  const { dbUser, signOut } = useAuth();

  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);

  return (
    <View
      style={{
        height: '100%',
        width: Dimensions.get('screen').width,
        backgroundColor: '#f1f1f1',
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#c75030',
          paddingHorizontal: actuatedNormalize(20),
          padding: actuatedNormalize(20),
          minHeight: actuatedNormalize(120),
        }}
      >
        <View style={{ flexBasis: '70%' }}>
          <Text
            style={{
              color: '#ffffff',
              fontSize: actuatedNormalize(20),
              fontWeight: 'bold',
            }}
          >
            {dbUser?.displayName}
          </Text>

          <Text
            style={{
              color: '#ffffff',
              fontSize: actuatedNormalize(12),
              marginTop: actuatedNormalizeVertical(8),
            }}
            numberOfLines={4}
          >
            {dbUser?.bios || 'Just a normal person that prioritize security.'}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <Text
              style={{
                color: '#ffffff',
                fontSize: actuatedNormalize(11),
                marginTop: actuatedNormalizeVertical(8),
                paddingHorizontal: actuatedNormalize(8),
                paddingVertical: actuatedNormalize(3),
                borderRadius: 13,
                borderColor: '#f1f1f1',
                borderWidth: 1,
              }}
            >
              {dbUser?.jobPosition}
            </Text>
          </View>
        </View>
        <View
          style={{
            borderRadius: 60,
            borderColor: '#ffffff',
            borderWidth: 3,
          }}
        >
          <Avatar.Image
            size={actuatedNormalize(60)}
            source={{
              uri:
                dbUser?.profilePicture ||
                'https://firebasestorage.googleapis.com/v0/b/sibersim-2a3c3.appspot.com/o/10221134.jpg?alt=media&token=898ef675-72de-4b27-bb7c-342efb786b04',
            }}
          />
          <IconButton
            icon="pencil"
            iconColor={Colors.light.secondary}
            size={12}
            onPress={() => console.log('Pressed')}
            style={{
              position: 'absolute',
              bottom: actuatedNormalize(-8),
              right: actuatedNormalize(-8),
              backgroundColor: '#ffffff',
              width: actuatedNormalize(20),
              height: actuatedNormalize(20),
            }}
          />
        </View>
      </View>

      <List.Section title="Accordions">
        <List.Item title="First item" />
        <List.Item title="Second item" onPress={() => console.log('ress')} />

        <List.Accordion
          title="Controlled Accordion"
          left={props => <List.Icon {...props} icon="folder" />}
          expanded={expanded}
          onPress={handlePress}
        >
          <List.Item title="First item" />
          <List.Item title="Second item" />
        </List.Accordion>
      </List.Section>
    </View>
  );
}
