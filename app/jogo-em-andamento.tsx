"use client"

import { useState, useEffect, useRef } from "react"
import { StyleSheet, TouchableOpacity, Modal, Alert, Dimensions, View, Text } from "react-native"
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

  const [timeRemaining, setTimeRemaining] = useState(gameTime * 60) // em segundos
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
  }, [isPaused]) // Adicionar isPaused como dependência para reiniciar o timer quando mudar

  const startTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      if (!isPaused) {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Tempo acabou, espião vence
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

  const handleKick = () => {
    if (kickCount >= maxKicks - 1) {
      // Último kick disponível
      Alert.alert("Último Kick", "Este é o último kick disponível. Se não acertarem o espião, os moradores perdem.", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            const newKickCount = kickCount + 1
            setKickCount(newKickCount)

            if (newKickCount >= maxKicks) {
              // Moradores perderam por usar todos os kicks
              endGame("spy")
            }
          },
        },
      ])
    } else {
      setKickCount((prev) => prev + 1)
    }
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

    // Navegar para a tela de resultados
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
          <ThemedText style={styles.pauseButtonText}>{isPaused ? "Continuar" : "Pausar"}</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText style={styles.infoText}>
          Kicks: {kickCount}/{maxKicks}
        </ThemedText>

        <TouchableOpacity
          style={[styles.kickButton, { borderColor: Colors[colorScheme].tint }]}
          onPress={handleKick}
          disabled={kickCount >= maxKicks}
        >
          <ThemedText style={[styles.kickButtonText, { color: Colors[colorScheme].tint }]}>Usar Kick</ThemedText>
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

      <Modal visible={showEndGameModal} transparent={true} animationType="fade" onRequestClose={handleCancelEndGame}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "white",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
              maxWidth: 300,
            }}
          >
            <ThemedText
              type="subtitle"
              style={{
                marginBottom: 20,
                color: "#3b508f",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              Finalizar Jogo
            </ThemedText>

            <ThemedText
              style={{
                marginBottom: 20,
                textAlign: "center",
                color: "#333",
                fontSize: 16,
              }}
            >
              Quem venceu o jogo?
            </ThemedText>

            <TouchableOpacity
              style={{
                backgroundColor: "#2ecc71",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                marginBottom: 10,
              }}
              onPress={() => handleConfirmEndGame("villagers")}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Moradores Venceram
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#e74c3c",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                marginBottom: 10,
              }}
              onPress={() => handleConfirmEndGame("spy")}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Espião Venceu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#7f8c8d",
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
              onPress={handleCancelEndGame}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                }}
              >
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "#3b508f",
    maxWidth: Dimensions.get("window").width * 0.8,
  },
  modalTitle: {
    marginBottom: 20,
    color: "white",
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    color: "white",
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
})