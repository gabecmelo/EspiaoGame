import { StyleSheet, View } from "react-native"
import { ThemedText } from "../components/ThemedText.tsx"

export default function Page() {
  return (
    <View style={styles.container}>
      <ThemedText type="title">EspiaoGame</ThemedText>
      <ThemedText>Welcome to the EspiaoGame!</ThemedText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

