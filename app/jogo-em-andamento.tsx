"use client"

import { useState, useEffect, useRef } from "react"
import { StyleSheet, TouchableOpacity, Alert, Dimensions, View, Text } from "react-native"
import { Stack, router, useLocalSearchParams } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { Timer } from "@/components/Timer"
import { QuestionHint } from "@/components/QuestionHint"

export default function JogoEmAndamentoScreen() {
  const params = useLocalSearchParams()
  const colorScheme = useColorScheme() ?? "light"

  const playersParam = (params.players as string) || "[]"
  const players = JSON.parse(playersParam)
  const selectedLocation = params.location as string
  const gameTime = Number(params.time || 5)
  const maxKicks = Number(params.kicks || 2)
  const startingPlayerIndex = Number(params.startingPlayer || 0)

  const [timeRemaining, setTimeRemaining] = useState(gameTime * 60) // in seconds
  const [isPaused, setIsPaused] = useState(false)
  const [kickCount, setKickCount] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [gameResult, setGameResult] = useState<"spy" | "villagers" | null>(null)
  const [showEndGameModal, setShowEndGameModal] = useState(false)
  const [showQuestionHint, setShowQuestionHint] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    startTimer()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPaused]) // restart the timer when pause state changes

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Time is up, spy wins
            endGame("spy")
            return 0
          }
          return prev - 1
        })
      }
    }, 1000)
  }

  const togglePause = () => {
    setIsPaused((prev) => !prev)
  }

  // Modified handleKick:
  const handleKick = () => {
    const isLastKick = kickCount >= maxKicks - 1
    const title = isLastKick ? "Último Chute" : "Chute"
    const message = isLastKick
      ? "Este é o último chute disponível. Se não acertarem o espião, os moradores perdem. \n O espião foi descoberto?"
      : "O espião foi descoberto?"

    Alert.alert(title, message, [
      {text: "Cancelar"},
      {
        text: "Sim",
        onPress: () => {
          // Spy discovered: villagers win.
          endGame("villagers")
        },
      },
      {
        text: "Não",
        onPress: () => {
          if (isLastKick) {
            // On the last kick, if spy is not discovered, spy wins.
            endGame("spy")
          } else {
            // Not the last kick: increment kick count for another attempt.
            setKickCount((prev) => prev + 1)
          }
        },
        style: "cancel",
      },
      
    ])
  }

  const endGame = (winner: "spy" | "villagers") => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setIsGameOver(true)
    setGameResult(winner)
  }

  const handleEndGame = () => {
    setShowEndGameModal(true)
  }

  const handleConfirmEndGame = (winner: "spy" | "villagers") => {
    endGame(winner)
    setShowEndGameModal(false)

    // Navigate to results screen
    router.push({
      pathname: "/fim-de-jogo",
      params: {
        winner,
        location: selectedLocation,
        spyCount: players.filter((p: any) => p.role === "spy").length,
      },
    })
  }

  const handleCancelEndGame = () => {
    setShowEndGameModal(false)
  }

  if (isGameOver) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <ThemedText type="title" style={styles.title}>
          Jogo Finalizado!
        </ThemedText>

        <ThemedText style={styles.resultText}>
          {gameResult === "spy" ? "O Espião venceu!" : "Os Moradores venceram!"}
        </ThemedText>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
          onPress={() =>
            router.push({
              pathname: "/fim-de-jogo",
              params: {
                winner: gameResult,
                location: selectedLocation,
                spyCount: players.filter((p: any) => p.role === "spy").length,
              },
            })
          }
        >
          <ThemedText style={styles.buttonText}>Ver Resultados</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedView style={styles.timerContainer}>
        <Timer time={timeRemaining} isPaused={isPaused} maxTime={gameTime * 60} />

        <TouchableOpacity style={styles.pauseButton} onPress={togglePause}>
          <ThemedText style={styles.pauseButtonText}>
            {isPaused ? "Continuar" : "Pausar"}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoText}>
          Chutes: {kickCount}/{maxKicks}
        </ThemedText>

        <TouchableOpacity
          style={[styles.kickButton, { borderColor: Colors[colorScheme].tint }]}
          onPress={handleKick}
          disabled={kickCount >= maxKicks}
        >
          <ThemedText style={[styles.kickButtonText, { color: Colors[colorScheme].tint }]}>
            Usar Chute
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.hintContainer}>
        <TouchableOpacity style={styles.hintButton} onPress={() => setShowQuestionHint(!showQuestionHint)}>
          <ThemedText style={styles.hintButtonText}>
            {showQuestionHint ? "Esconder Dica" : "Mostrar Dica de Pergunta"}
          </ThemedText>
        </TouchableOpacity>

        {showQuestionHint && <QuestionHint />}
      </ThemedView>

      <TouchableOpacity style={[styles.endGameButton, { backgroundColor: "#e74c3c" }]} onPress={handleEndGame}>
        <ThemedText style={styles.buttonText}>Finalizar Jogo</ThemedText>
      </TouchableOpacity>

      {showEndGameModal && (
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <ThemedText type="subtitle" style={styles.modalTitle}>
              Finalizar Jogo
            </ThemedText>

            <ThemedText style={styles.modalText}>
              Quem venceu o jogo?
            </ThemedText>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#2ecc71" }]}
              onPress={() => handleConfirmEndGame("villagers")}
            >
              <Text style={styles.modalButtonText}>Moradores Venceram</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#e74c3c" }]}
              onPress={() => handleConfirmEndGame("spy")}
            >
              <Text style={styles.modalButtonText}>Espião Venceu</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#7f8c8d" }]}
              onPress={handleCancelEndGame}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 30,
    paddingTop: 15,
    flexDirection: "row",
  },
  pauseButton: {
    marginLeft: 15,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  pauseButtonText: {
    fontWeight: "bold",
    color: "#3b508f",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30,
  },
  infoText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  kickButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 2,
  },
  kickButtonText: {
    fontWeight: "bold",
  },
  hintContainer: {
    width: "100%",
    marginBottom: 30,
  },
  hintButton: {
    alignSelf: "center",
    marginBottom: 10,
  },
  hintButtonText: {
    color: "#0a7ea4",
    fontWeight: "bold",
  },
  endGameButton: {
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
  resultText: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: "center",
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
  // Overlay styles replacing Modal
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  modalContent: {
    width: "80%",
    maxWidth: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    marginBottom: 20,
    color: "#3b508f",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    fontSize: 16,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
