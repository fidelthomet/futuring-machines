import prompts from '@/assets/prompts'
import continueWriting from '@/assets/prompts/continueWriting'
//import wildcards from '@/assets/prompts/wildcards'
//import extrapolate from '@/assets/prompts/extrapolate'
//import question from '@/assets/prompts/question'

export default {
  id: 'thing-from-the-future',
  prompts,
  //prompts: [...prompts, wildcards, extrapolate, question],
  name: {
    en: 'Thing from the Future 🍶🚀',
    de: 'Das Ding aus der Zukunft 🍶🚀'
  },
  description: {
    en: "Let's explore experiential futures! What will things from the future be? How will we co-habit and collaborate with them in our daily lives?",
    de: 'Las uns eine erfahrbare Zukunft explorieren! Was werden die Dinge der Zukunft sein? Wie werden wir in unserem Alltag mit ihnen zusammenleben?'
  },
  template: {
    en: 'In a <placeholder length=4></placeholder> future there is a <placeholder length=4></placeholder> related to <placeholder length=4></placeholder>. <start/>',
    de: 'In einer <placeholder length=4></placeholder> Zukunft gibt es ein <placeholder length=4></placeholder> in Verbindung mit <placeholder length=4></placeholder>. <start/>'
  },
  start: continueWriting
}
