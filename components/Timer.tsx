"use client"

import { StyleSheet, View } from "react-native"
import { useEffect, useState } from "react"
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated"

import { ThemedText } from "@/components/ThemedText"
import { useColorScheme } from "@/hooks/useColorScheme"

interface TimerProps {
  time: number // em segundos
  isPaused: boolean
  maxTime: number
}

export function Timer({ time, isPaused, maxTime }: TimerProps) {
  const colorScheme = useColorScheme() ?? "light"
  const [progress, setProgress] = useState(1) // 1 = 100%, 0 = 0%

  useEffect(() => {
    setProgress(time / maxTime)
  }, [time, maxTime])

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: withTiming(`${progress * 100}%`, { duration: 300 }),
      backgroundColor: progress > 0.5 ? "#2ecc71" : progress > 0.25 ? "#f39c12" : "#e74c3c",
    }
  })

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <View style={styles.container}>
      <ThemedText style={[styles.timeText, isPaused && styles.pausedText]}>{formatTime(time)}</ThemedText>

      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    width: 200,
  },
  timeText: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    paddingTop: 15,
  },
  pausedText: {
    opacity: 0.5,
  },
  progressContainer: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
})

