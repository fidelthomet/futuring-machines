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
    en: "<br><code>/////////////////////////////////<br><br>Let's setup the story first:<br><br>🧑🏽‍🎤 The protagonist<br>🦄 The others<br>🌐 The place where they live<br>🌟 The topic<br><br>/////////////////////////////////</code><br><br><br><start>→ Let AI start! 🔮✍️</start>",
    de: "<br><code>/////////////////////////////////<br><br>Let's setup the story first:<br><br>🧑🏽‍🎤 The protagonist<br>🦄 The others<br>🌐 The place where they live<br>🌟 The topic<br><br>/////////////////////////////////</code><br><br><br><start>Lass die KI starten! ✍️🔮</start>"
  },
  start: setupStory,
  system: system
}
