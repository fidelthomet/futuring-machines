import prompts from '@/assets/prompts'
import system from '@/assets/prompts/system'
import setupStory from '@/assets/prompts/setupStory'

export default {
  id: 'herzberg',
  prompts,
  name: {
    en: 'New story for Herzberg 🏘️💫',
    de: 'Neue Geschichte für Herzberg 🏘️💫'
  },
  description: {
    en: 'Which Herzberg would you like to live in in the future?',
    de: 'In welchem Herzberg würdet ihr gerne zukünftig leben?'
  },
  template: {
    en: "<br><code>/////////////////////////////////<br><br>Let's setup the story first:<br><br>The protagonist<br><br>The others<br><br>Your Herzberg. The future city where they live<br><br>The topic of the story<br><br>/////////////////////////////////</code><br><br><br><start>→ Let AI start! 🔮✍️</start>",
    de: "<br><code>/////////////////////////////////<br><br>Planen wir zuerst die Geschichte:<br><br>Protagonist*in<br><br>Die Anderen<br><br>Ihr zukünftiges Herzberg<br><br>Thema der Geschichte<br><br>/////////////////////////////////</code><br><br><br><start>→ Lasst die KI beginnen! 🔮✍️</start>"
  },
  start: setupStory,
  system: system
}
