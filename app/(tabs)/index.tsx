import { Image, StyleSheet, TouchableOpacity } from "react-native"
import { Link } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? "light"

  return (
    <ThemedView style={styles.container}>
      <Image
        source={require("@/assets/images/spy-icon.png")}
        style={styles.logo}
        defaultSource={require("@/assets/images/spy-icon.png")}
      />

      <ThemedText type="title" style={styles.title}>
        Jogo do Espião
      </ThemedText>

      <ThemedView style={styles.buttonContainer}>
        <Link href="/novo-jogo" asChild>
          <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} activeOpacity={0.8}>
            <ThemedText style={styles.buttonText}>Novo Jogo</ThemedText>
          </TouchableOpacity>
        </Link>

        <Link href="/como-jogar" asChild>
          <TouchableOpacity style={[styles.button, styles.secondaryButton]} activeOpacity={0.8}>
            <ThemedText style={[styles.buttonText, { color: Colors[colorScheme].tint }]}>Como Jogar</ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    marginBottom: 40,
    paddingTop: 10,
    fontSize: 36,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    maxWidth: 300,
    gap: 16,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#0a7ea4",
  },
  buttonText: {
    color: "#c72432",
    fontSize: 18,
    fontWeight: "bold",
  },
})

