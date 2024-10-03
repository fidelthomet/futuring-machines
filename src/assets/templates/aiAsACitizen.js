import prompts from '@/assets/prompts'
import system from '@/assets/prompts/system'
import setupStory from '@/assets/prompts/setupStory'

export default {
  id: 'ai-as-a-citizen',
  prompts,
  name: {
    en: 'AI as a Citizen 🤖🌆',
    de: 'KI als Bürger*in 🤖🌆'
  },
  description: {
    en: 'In which Smart City futures would you like to live?',
    de: 'In welchen Smart-City-Zukünften würdest du gerne leben?'
  },
  template: {
    en: 'The story is placed in 2050 in a small city in Brandengurg, Germany, called Herzberg (Elster). The progagonist is... <br><br><start/>',
    de: 'Die Geschichte spielt im Jahr 2050 in einer kleinen Stadt in Brandengurg, Deutschland, namens Herzberg (Elster). Hauptcharakter ist...  <br><br><start/>'
  },
  start: setupStory,
  system: system
}
