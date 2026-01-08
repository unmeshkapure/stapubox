import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colorScheme === 'dark' ? '#000' : '#F2F2F7' },
          animation: 'slide_from_right', // Smooth Native Slide Transition
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Login' }} />
        <Stack.Screen
          name="verify"
          options={{
            title: 'Verify OTP',
            headerShown: true,
            headerBackTitle: 'Change',
            presentation: 'card',
          }}
        />
        <Stack.Screen name="details" options={{ title: 'Details', animation: 'fade' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
