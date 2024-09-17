import prompts from '@/assets/prompts'
//import wildcards from '@/assets/prompts/wildcards'
//import elaborate from '@/assets/prompts/elaborate'

export default {
  id: 'futures-of-design',
  prompts,
  name: {
    en: 'Futures of Design 🌐🔮',
    de: 'Zukünfte des Designs 🌐🔮'
  },
  description: {
    en: 'What will the design of conversational interfaces look like in 100 years?',
    de: 'Wie wird das Design von dialog-orientierten Interfaces in 100 Jahren aussehen?'
  },
  start: {
    mode: 'append',
    actions: [
      {
        type: 'generate',
        template: {
          en: 'Kim is a discursive designer living in the year 2124. Write the first paragraph of a story. In it, a friend asks Kim what they does all day. What does they respond? Respond in the third person. Use a narrative tone and use at most two sentences.',
          de: 'Kim ist eine diskursive Designerin, die im Jahr 2124 lebt. Schreiben Sie den ersten Absatz einer Geschichte. Darin fragt ein Freund Kim, was sie den ganzen Tag macht. Was antwortet sie? Antworten Sie in der dritten Person. Verwenden Sie einen erzählenden Ton und benutzen Sie höchstens zwei Sätze. Generieren Sie den Text nur auf Deutsch.'
        }
      }
    ]
  }
}