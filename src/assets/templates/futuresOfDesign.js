import condense from '@/assets/prompts/condense'
import divergeTone from '@/assets/prompts/divergeTone'
import wildcards from '@/assets/prompts/wildcards'

export default {
  name: 'Futures of Design',
  prompts: [wildcards, divergeTone, condense],
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
