import { StyleSheet, ScrollView } from "react-native"

import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Collapsible } from "@/components/Collapsible"

export default function ComoJogarScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedText  type="title" style={styles.title}>
          Como Jogar
        </ThemedText>

        <ThemedText style={styles.paragraph}>
          O Jogo do Espião é um jogo de dedução social onde um ou mais jogadores são espiões infiltrados entre os
          moradores de um local.
        </ThemedText>

        <Collapsible title="Objetivo do Jogo">
          <ThemedText style={styles.paragraph}>
            <ThemedText style={styles.paragraphTitle} type="defaultSemiBold">Para os Moradores:</ThemedText> Descobrir quem é o espião antes que o
            tempo acabe ou antes de usar todos os kicks disponíveis.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            <ThemedText style={styles.paragraphTitle} type="defaultSemiBold">Para o Espião:</ThemedText> Descobrir qual é o local sem ser identificado
            pelos outros jogadores, ou sobreviver até o tempo acabar.
          </ThemedText>
        </Collapsible>

        <Collapsible title="Preparação">
          <ThemedText style={styles.paragraph}>1. Escolha o número de jogadores, espiões e o tempo de jogo.</ThemedText>
          <ThemedText style={styles.paragraph}>
            2. Selecione os pacotes de locais que deseja incluir no jogo.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            3. Inicie o jogo e cada jogador deve ver seu papel individualmente.
          </ThemedText>
        </Collapsible>

        <Collapsible title="Dinâmica do Jogo">
          <ThemedText style={styles.paragraph}>
            1. Cada jogador, na sua vez, verá seu papel (morador ou espião) e o local (apenas os moradores).
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            2. Um jogador aleatório começa fazendo uma pergunta a outro jogador sobre o local.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            3. As perguntas e respostas continuam até que os jogadores decidam fazer um "kick" (votação para eliminar um
            suspeito).
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            4. Se o número de kicks atingir o limite definido na configuração, os moradores perdem.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            5. Se o tempo acabar antes dos moradores descobrirem o espião, o espião vence.
          </ThemedText>
        </Collapsible>

        <Collapsible title="Dicas">
          <ThemedText style={styles.paragraph}>
            • Moradores: Façam perguntas específicas que apenas quem conhece o local saberia responder.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            • Espião: Tente dar respostas vagas ou observar as respostas dos outros para deduzir o local.
          </ThemedText>
          <ThemedText style={styles.paragraph}>
            • Todos: Preste atenção nas respostas dos outros jogadores para identificar comportamentos suspeitos.
          </ThemedText>
        </Collapsible>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3b508f",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    color: "#f2e377"
  },
  paragraph: {
    marginBottom: 10,
    lineHeight: 24,
    color: "white",
  },
  paragraphTitle: {
    color: "#f2e377"
  }
})

