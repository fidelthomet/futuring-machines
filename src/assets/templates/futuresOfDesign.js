import prompts from '@/assets/prompts'
//import wildcards from '@/assets/prompts/wildcards'
//import elaborate from '@/assets/prompts/elaborate'

export default {
  id: 'futures-of-design',
  name: 'Futures of Design 🌐🔮',
  prompts,
  //prompts: [...prompts, wildcards, elaborate], // Custom Prompts here
  description: 'What will the design of conversational interfaces look like in 100 years?',
  start: {
    mode: 'append',
    actions: [
      {
        type: 'generate',
        template:
          'Kim is a discursive designer living in the year 2124. Write the first paragraph of a story. In it, a friend asks Kim what they does all day. What does they respond? Respond in the third person. Use a narrative tone and use at most two sentences.'
      }
    ]
  }
}
