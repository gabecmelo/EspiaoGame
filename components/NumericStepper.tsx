import { StyleSheet, TouchableOpacity, View } from "react-native"

import { ThemedText } from "@/components/ThemedText"
import { IconSymbol } from "@/components/ui/IconSymbol"
import { Colors } from "@/constants/Colors"
import { useColorScheme } from "@/hooks/useColorScheme"

interface NumericStepperProps {
  value: number
  onValueChange: (value: number) => void
  minValue?: number
  maxValue?: number
  step?: number
}

export function NumericStepper({ value, onValueChange, minValue = 1, maxValue = 100, step = 1 }: NumericStepperProps) {
  const colorScheme = useColorScheme() ?? "light"

  const handleDecrement = () => {
    if (value > minValue) {
      onValueChange(value - step)
    }
  }

  const handleIncrement = () => {
    if (value < maxValue) {
      onValueChange(value + step)
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { borderColor: Colors[colorScheme].tint }, value <= minValue && styles.disabledButton]}
        onPress={handleDecrement}
        disabled={value <= minValue}
      >
        <IconSymbol
          name="chevron.right"
          size={20}
          color={value <= minValue ? "#ccc" : Colors[colorScheme].tint}
          style={{ transform: [{ rotate: "180deg" }] }}
        />
      </TouchableOpacity>

      <ThemedText style={styles.valueText}>{value}</ThemedText>

      <TouchableOpacity
        style={[styles.button, { borderColor: Colors[colorScheme].tint }, value >= maxValue && styles.disabledButton]}
        onPress={handleIncrement}
        disabled={value >= maxValue}
      >
        <IconSymbol name="chevron.right" size={20} color={value >= maxValue ? "#ccc" : Colors[colorScheme].tint} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    borderColor: "#ccc",
  },
  valueText: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: "center",
  },
})

