import { StyleSheet, TouchableOpacity, Image, type ImageSourcePropType } from "react-native"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

interface LocationPackageProps {
  id: string
  title: string
  description: string
  image: ImageSourcePropType
  isSelected: boolean
  onToggle: () => void
}

export function LocationPackage({ id, title, description, image, isSelected, onToggle }: LocationPackageProps) {
  const colorScheme = useColorScheme() ?? "light"

  return (
    <TouchableOpacity
      style={[styles.container, isSelected && { borderColor: Colors[colorScheme].tint, borderWidth: 2 }]}
      onPress={onToggle}
      activeOpacity={0.8}
    >
      <Image source={image} style={styles.image} />

      <ThemedView style={styles.content}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
      </ThemedView>

      <ThemedView style={[styles.checkbox, isSelected && { backgroundColor: Colors[colorScheme].tint }]}>
        {isSelected && <ThemedText style={styles.checkmark}>✓</ThemedText>}
      </ThemedView>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    opacity: 0.7,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
  },
})

