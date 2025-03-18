"use client"

import { useState, useEffect } from "react"
import { StyleSheet, TouchableOpacity, Image } from "react-native"
import { Stack, router, useLocalSearchParams } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

export default function IniciarJogoScreen() {
  const params = useLocalSearchParams()
  const colorScheme = useColorScheme() ?? "light"

  const numPlayers = Number(params.players || 4)
  const numSpies = Number(params.spies || 1)
  const gameTime = Number(params.time || 5)
  const numKicks = Number(params.kicks || 2)
  const locationsParam = (params.locations as string) || "[]"
  const locations = JSON.parse(locationsParam)

  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0)
  const [players, setPlayers] = useState<Array<{ role: string; hasSeenRole: boolean }>>([])
  const [selectedLocation, setSelectedLocation] = useState("")
  const [roleRevealed, setRoleRevealed] = useState(false)
  const [allPlayersReady, setAllPlayersReady] = useState(false)
  const [startingPlayerIndex, setStartingPlayerIndex] = useState(0)

  // Inicializar o jogo
  useEffect(() => {
    if (locations.length === 0) {
      router.replace("/selecionar-locais")
      return
    }

    // Selecionar um local aleatório
    const randomLocationIndex = Math.floor(Math.random() * locations.length)
    setSelectedLocation(locations[randomLocationIndex])

    // Criar array de jogadores e atribuir espiões aleatoriamente
    const playerArray = Array(numPlayers)
      .fill(null)
      .map(() => ({
        role: "villager",
        hasSeenRole: false,
      }))

    // Atribuir espiões
    const spyIndices = new Set<number>()
    while (spyIndices.size < numSpies) {
      const randomIndex = Math.floor(Math.random() * numPlayers)
      spyIndices.add(randomIndex)
    }

    spyIndices.forEach((index) => {
      playerArray[index].role = "spy"
    })

    setPlayers(playerArray)

    // Selecionar jogador inicial aleatório para fazer a primeira pergunta
    setStartingPlayerIndex(Math.floor(Math.random() * numPlayers))
  }, [])

  const handleRevealRole = () => {
    setRoleRevealed(true)
  }

  const handleNextPlayer = () => {
    // Marcar o jogador atual como tendo visto seu papel
    const updatedPlayers = [...players]
    updatedPlayers[currentPlayerIndex].hasSeenRole = true
    setPlayers(updatedPlayers)

    // Resetar o estado de revelação para o próximo jogador
    setRoleRevealed(false)

    // Verificar se todos os jogadores viram seus papéis
    if (currentPlayerIndex === numPlayers - 1) {
      setAllPlayersReady(true)
    } else {
      // Avançar para o próximo jogador
      setCurrentPlayerIndex(currentPlayerIndex + 1)
    }
  }

  const handleStartGame = () => {
    // Iniciar o jogo com o timer
    router.push({
      pathname: "/jogo-em-andamento",
      params: {
        players: JSON.stringify(players),
        location: selectedLocation,
        time: gameTime,
        kicks: numKicks,
        startingPlayer: startingPlayerIndex,
      },
    })
  }

  if (allPlayersReady) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />

        <ThemedText type="title" style={styles.title}>
          Todos Prontos!
        </ThemedText>

        <ThemedView style={styles.readyContainer}>
          <ThemedText style={styles.readyText}>
            O jogador {startingPlayerIndex + 1} começa fazendo a primeira pergunta.
          </ThemedText>

          <Image
            source={require("@/assets/images/ready-icon.png")}
            style={styles.readyImage}
            defaultSource={require("@/assets/images/ready-icon.png")}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={handleStartGame}
          >
            <ThemedText style={styles.buttonText}>Iniciar Partida</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <ThemedText type="title" style={styles.title}>
        Jogador {currentPlayerIndex + 1}
      </ThemedText>

      {!roleRevealed ? (
        <ThemedView style={styles.revealContainer}>
          <ThemedText style={styles.instructionText}>Clique no botão abaixo para descobrir seu papel</ThemedText>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={handleRevealRole}
          >
            <ThemedText style={styles.buttonText}>Revelar Papel</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <ThemedView style={styles.roleContainer}>
          <ThemedText type="subtitle" style={styles.roleTitle}>
            Seu papel é:
          </ThemedText>

          <ThemedText
            type="title"
            style={[styles.roleText, { color: players[currentPlayerIndex].role === "spy" ? "#e74c3c" : "#2ecc71" }]}
          >
            {players[currentPlayerIndex].role === "spy" ? "ESPIÃO" : "MORADOR"}
          </ThemedText>

          {players[currentPlayerIndex].role === "spy" && (
            <ThemedView style={styles.locationContainer}>
              <ThemedText type="subtitle">Não deixe os aldeões descobrir que você é o Espião!</ThemedText>
            </ThemedView>
          )}

          {players[currentPlayerIndex].role !== "spy" && (
            <ThemedView style={styles.locationContainer}>
              <ThemedText type="subtitle">Local:</ThemedText>
              <ThemedText type="defaultSemiBold" style={styles.locationText}>
                {selectedLocation}
              </ThemedText>
            </ThemedView>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
            onPress={handleNextPlayer}
          >
            <ThemedText style={styles.buttonText}>
              {currentPlayerIndex === numPlayers - 1 ? "Finalizar" : "Próximo Jogador"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
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
  title: {
    marginBottom: 40,
    textAlign: "center",
  },
  revealContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  instructionText: {
    marginBottom: 30,
    textAlign: "center",
    fontSize: 18,
  },
  roleContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  roleTitle: {
    marginBottom: 10,
  },
  roleText: {
    marginBottom: 25,
    paddingTop: 15,
    fontSize: 40,
  },
  locationContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  locationText: {
    fontSize: 24,
    marginTop: 10,
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
  readyContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  readyText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 18,
  },
  readyImage: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
})

