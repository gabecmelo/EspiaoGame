"use client"

import { useState } from "react"
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Stack, router } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { NumericStepper } from "@/components/NumericStepper"

export default function NovoJogoScreen() {
  const colorScheme = useColorScheme() ?? "light"
  const [numPlayers, setNumPlayers] = useState(4)
  const [numSpies, setNumSpies] = useState(1)
  const [gameTime, setGameTime] = useState(5) // em minutos
  const [numKicks, setNumKicks] = useState(2)

  const handleContinue = () => {
    // Salvar configurações e navegar para a próxima tela
    router.push({
      pathname: "/selecionar-locais",
      params: {
        players: numPlayers,
        spies: numSpies,
        time: gameTime,
        kicks: numKicks,
      },
    })
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Configuração do Jogo",
          headerShown: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol
                name="chevron.right"
                size={24}
                color={Colors[colorScheme].tint}
                style={{ transform: [{ rotate: "180deg" }] }}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedText type="title" style={styles.title}>
          Configuração do Jogo
        </ThemedText>

        <ThemedView style={styles.configItem}>
          <ThemedText type="subtitle">Número de Jogadores</ThemedText>
          <NumericStepper value={numPlayers} onValueChange={setNumPlayers} minValue={3} maxValue={20} />
        </ThemedView>

        <ThemedView style={styles.configItem}>
          <ThemedText type="subtitle">Número de Espiões</ThemedText>
          <NumericStepper
            value={numSpies}
            onValueChange={setNumSpies}
            minValue={1}
            maxValue={Math.max(1, Math.floor(numPlayers / 3))}
          />
          <ThemedText style={styles.helperText}>
            Máximo recomendado: {Math.max(1, Math.floor(numPlayers / 3))} espiões
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.configItem}>
          <ThemedText type="subtitle">Tempo de Jogo (minutos)</ThemedText>
          <NumericStepper value={gameTime} onValueChange={setGameTime} minValue={3} maxValue={15} step={1} />
        </ThemedView>

        <ThemedView style={styles.configItem}>
          <ThemedText type="subtitle">Número de Chutes Disponíveis</ThemedText>
          <NumericStepper value={numKicks} onValueChange={setNumKicks} minValue={1} maxValue={numPlayers - 1} />
          <ThemedText style={styles.helperText}>Chutes são tentativas de identificar o espião</ThemedText>
        </ThemedView>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>Escolher Locais</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
  },
  title: {
    marginTop: 75,
    marginBottom: 30,
    textAlign: "center",
  },
  configItem: {
    width: "100%",
    marginBottom: 25,
    alignItems: "center",
  },
  helperText: {
    fontSize: 14,
    marginTop: 5,
    opacity: 0.7,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 300,
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
})

