import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native-unistyles';

/**
 * Tab Bar Icon Component
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

/**
 * Tab Layout
 *
 * Main tab navigation with Home, Examples, and Profile tabs.
 */
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: styles.activeTab.color,
        tabBarInactiveTintColor: styles.inactiveTab.color,
        tabBarStyle: styles.tabBar,
        headerShown: true,
        headerStyle: styles.header,
        headerTintColor: styles.headerText.color,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="examples"
        options={{
          title: 'Examples',
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create((theme) => ({
  tabBar: {
    backgroundColor: theme.colors.card,
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
  },
  activeTab: {
    color: theme.colors.primary,
  },
  inactiveTab: {
    color: theme.colors.textMuted,
  },
  header: {
    backgroundColor: theme.colors.background,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  headerText: {
    color: theme.colors.text,
  },
}));
