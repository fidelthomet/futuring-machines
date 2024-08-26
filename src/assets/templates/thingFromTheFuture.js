import prompts from '@/assets/prompts'
import wildcards from '@/assets/prompts/wildcards'
import extrapolate from '@/assets/prompts/extrapolate'

export default {
  id: 'thing-from-the-future',
  prompts: [...prompts, wildcards, extrapolate],
  name: {
    en: 'Thing from the Future',
    de: 'Das Ding aus der Zukunft'
  },
  description: {
    en: "Let's explore experiential futures! What will things from the future be? How will we co-habit and collaborate with them in our daily lives?",
    de: 'Las uns eine erfahrbare Zukunft explorieren! Was werden die Dinge der Zukunft sein? Wie werden wir in unserem Alltag mit ihnen zusammenleben?'
  },
  template: {
    en: 'In a <placeholder length=4></placeholder> future there is a <placeholder length=4></placeholder> related to <placeholder length=4></placeholder>. <start/>',
    de: 'In einer <placeholder length=4></placeholder> Zukunft gibt es ein <placeholder length=4></placeholder> in Verbindung mit <placeholder length=4></placeholder>. <start/>'
  },
  start: {
    actions: [
      {
        type: 'generate',
        template:
          'You are a world-famous science fiction author and Hugo Award winner. You specialize in fast narratives with short sentences. Write the first paragraph of a short speculative fiction that addresses the following prompt delimited by three backticks. Include some characters to the story based on the prompt. The paragraph should be no more than two sentences long. Make the sentences as short as possible. Leave the last sentence incomplete. Use a simple and narrative language. \n\nPrompt: ```::full:: What is it?```'
      }
    ]
  }
}
