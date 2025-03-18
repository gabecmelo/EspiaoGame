"use client"

import { StyleSheet, TouchableOpacity } from "react-native"
import { useState, useEffect } from "react"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

// Lista de dicas de perguntas
const questionHints = [
  "O que você vestiria neste local?",
  "Qual é o cheiro deste lugar?",
  "Que sons você ouviria neste local?",
  "Quais cores predominam neste ambiente?",
  "Que tipo de pessoas frequentam este lugar?",
  "Qual a temperatura típica deste local?",
  "Você precisaria de algum equipamento especial para estar neste lugar?",
  "Este local é mais comum durante o dia ou à noite?",
  "Você iria a este lugar sozinho ou acompanhado?",
  "Qual seria o maior perigo neste local?",
  "Que tipo de comida você encontraria neste lugar?",
  "Este local é natural ou construído por humanos?",
  "Você já esteve em um lugar como este antes?",
  "Que tipo de atividades você faria neste local?",
  "Este lugar é silencioso ou barulhento?",
]

export function QuestionHint() {
  const colorScheme = useColorScheme() ?? "light"
  const [currentHintIndex, setCurrentHintIndex] = useState(0)

  useEffect(() => {
    // Iniciar com um índice aleatório
    const randomIndex = Math.floor(Math.random() * questionHints.length)
    setCurrentHintIndex(randomIndex)
  }, [])

  const nextHint = () => {
    setCurrentHintIndex((prevIndex) => (prevIndex + 1) % questionHints.length)
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.title}>
        Sugestão de Pergunta:
      </ThemedText>
      <ThemedText style={styles.hintText}>{questionHints[currentHintIndex]}</ThemedText>

      <TouchableOpacity style={[styles.nextButton, { backgroundColor: Colors[colorScheme].tint }]} onPress={nextHint}>
        <ThemedText style={styles.nextButtonText}>Próxima Dica</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginTop: 10,
  },
  title: {
    marginBottom: 8,
  },
  hintText: {
    fontStyle: "italic",
    marginBottom: 15,
    fontSize: 16,
  },
  nextButton: {
    alignSelf: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "white",
    fontWeight: "bold",
  },
})

