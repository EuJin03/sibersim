import MUI from '@expo/vector-icons/MaterialCommunityIcons';

const MUIcon = (props: {
  name: React.ComponentProps<typeof MUI>['name'];
  color: string;
}) => {
  return <MUI size={22} style={{ marginBottom: -6 }} {...props} />;
};

export default MUIcon;
