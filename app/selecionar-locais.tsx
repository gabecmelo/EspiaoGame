"use client"

import { useState } from "react"
import { StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Stack, router, useLocalSearchParams } from "expo-router"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"
import { LocationPackage } from "@/components/LocationPackage"
import { naturezaLocais, terrorLocais } from "@/constants/Locations"

export default function SelecionarLocaisScreen() {
  const params = useLocalSearchParams()
  const colorScheme = useColorScheme() ?? "light"

  const [selectedPackages, setSelectedPackages] = useState<string[]>([])

  const togglePackage = (packageId: string) => {
    if (selectedPackages.includes(packageId)) {
      setSelectedPackages(selectedPackages.filter((id) => id !== packageId))
    } else {
      setSelectedPackages([...selectedPackages, packageId])
    }
  }

  const handleStartGame = () => {
    if (selectedPackages.length === 0) {
      // Alerta: nenhum pacote selecionado
      return
    }

    // Coletar todos os locais dos pacotes selecionados
    let allLocations: string[] = []
    if (selectedPackages.includes("natureza")) {
      allLocations = [...allLocations, ...naturezaLocais]
    }
    if (selectedPackages.includes("terror")) {
      allLocations = [...allLocations, ...terrorLocais]
    }

    // Iniciar o jogo com as configurações e locais
    router.push({
      pathname: "/iniciar-jogo",
      params: {
        ...params,
        locations: JSON.stringify(allLocations),
      },
    })
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Selecionar Locais",
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
          Selecione os Pacotes de Locais
        </ThemedText>

        <ThemedText style={styles.subtitle}>Escolha pelo menos um pacote de locais para o jogo</ThemedText>

        <ThemedView style={styles.packagesContainer}>
          <LocationPackage
            id="natureza"
            title="Natureza"
            description="Locais naturais como praias, florestas, desertos e mais"
            image={require("@/assets/images/nature-pack.png")}
            isSelected={selectedPackages.includes("natureza")}
            onToggle={() => togglePackage("natureza")}
          />

          <LocationPackage
            id="terror"
            title="Terror"
            description="Locais assustadores como cemitérios, casas mal-assombradas e mais"
            image={require("@/assets/images/horror-pack.png")}
            isSelected={selectedPackages.includes("terror")}
            onToggle={() => togglePackage("terror")}
          />
        </ThemedView>

        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: selectedPackages.length > 0 ? Colors[colorScheme].tint : "#ccc",
            },
          ]}
          onPress={handleStartGame}
          disabled={selectedPackages.length === 0}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>Iniciar Jogo</ThemedText>
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
    marginTop: 100,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    marginBottom: 30,
    textAlign: "center",
    opacity: 0.8,
  },
  packagesContainer: {
    width: "100%",
    gap: 20,
    marginBottom: 30,
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

