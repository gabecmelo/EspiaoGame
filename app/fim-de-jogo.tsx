import { StyleSheet, TouchableOpacity, Image } from "react-native"
import { Stack, router, useLocalSearchParams } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

export default function FimDeJogoScreen() {
  const params = useLocalSearchParams()
  const colorScheme = useColorScheme() ?? "light"

  const winner = params.winner as "spy" | "villagers"
  const location = params.location as string
  const spyCount = Number(params.spyCount || 1)

  const handleNewGame = () => {
    router.replace("/")
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedText type="title" style={styles.title}>
        Fim de Jogo
      </ThemedText>

      <ThemedView style={styles.resultContainer}>
        <ThemedText type="subtitle" style={[styles.resultText, { color: winner === "spy" ? "#e74c3c" : "#2ecc71" }]}>
          {winner === "spy" ? (spyCount > 1 ? "Os Espiões Venceram!" : "O Espião Venceu!") : "Os Moradores Venceram!"}
        </ThemedText>

        <Image
          source={
            winner === "spy" ? require("@/assets/images/spy-win.png") : require("@/assets/images/villagers-win.png")
          }
          style={styles.resultImage}
          defaultSource={require("@/assets/images/spy-icon.png")}
        />
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.locationLabel}>O local era:</ThemedText>
        <ThemedText type="defaultSemiBold" style={styles.locationText}>
          {location}
        </ThemedText>
      </ThemedView>

      <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]} onPress={handleNewGame}>
        <ThemedText style={styles.buttonText}>Novo Jogo</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#3b508f",
  },
  title: {
    marginBottom: 30,
    textAlign: "center",
    color: "white",
  },
  resultContainer: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "transparent",
  },
  resultText: {
    fontSize: 28,
    marginBottom: 20,
    textAlign: "center",
  },
  resultImage: {
    width: 150,
    height: 150,
  },
  infoContainer: {
    alignItems: "center",
    marginBottom: 40,
    backgroundColor: "transparent",
  },
  locationLabel: {
    fontSize: 18,
    marginBottom: 10,
    color: "white",
  },
  locationText: {
    fontSize: 24,
    textAlign: "center",
    color: "white",
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 300,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

