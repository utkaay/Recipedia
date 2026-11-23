import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import { AppButton } from '../components/AppButton';
import { AppScreen } from '../components/AppScreen';
import { colors, spacing } from '../theme/tokens';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <AppScreen centered>
      <View style={styles.content}>
        <Text style={styles.brand}>Recipedia</Text>
        <View style={styles.accent} />
        <Text style={styles.tagline}>Your recipes.{ '\n' }Beautifully{ '\n' }organized.</Text>
        <Image
          accessibilityLabel="A basket of fresh vegetables, herbs, and lemon"
          source={require('../../assets/images/recipedia/produce-basket.png')}
          resizeMode="contain"
          style={styles.illustration}
        />
        <AppButton label="Get Started" onPress={() => router.replace('/login')} style={styles.button} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  content: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  brand: { color: colors.greenDark, fontSize: 44, fontWeight: '900', letterSpacing: -1.4, textAlign: 'center' },
  accent: { width: 82, height: 4, backgroundColor: colors.terracotta, borderRadius: 4, marginTop: spacing.sm },
  tagline: { marginTop: spacing.lg, color: colors.greenDark, fontSize: 25, lineHeight: 30, fontWeight: '700', textAlign: 'center' },
  illustration: { width: '100%', height: 250, marginTop: spacing.md, marginBottom: spacing.md },
  button: { width: '100%', minHeight: 54, borderRadius: 28 },
});
