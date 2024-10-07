import prompts from '@/assets/prompts'
import system from '@/assets/prompts/system'
import setupStory from '@/assets/prompts/setupStory'

export default {
  id: 'setup-story-example',
  prompts,
  name: {
    en: 'Setup Story Example 🏘️🌱',
    de: 'Setup Story Example 🏘️🌱'
  },
  description: {
    en: 'How to setup my story?',
    de: 'How to setup my story?'
  },
  template: {
    en: "<br><code>////////////////////////////////////////////////<br><br>Let's setup the story first:<br><br>🧑🏽‍🎤 The protagonist <br>- Ursula lives in a community with other people.<br>- Ursula wants that people in town, of all ages, live together, all contributing to what they can. <br>- Ursula is though scared that all technology and co-living with young people will put his independence in danger and exclude elderly people like her. <br><br>🦄 The others<br>- Her best friend is a smart carrier bag called Carrie. Carrie is important to Ursula because it helps her to carry heavy stuff during harvest.<br><br>🌐 The smart city where they live<br>- The story is placed in 2050 in a small city in Brandenburg, Germany, called Herzberg (Elster).<br>- People live together in local self-managed communities of individuals of all genders and ages.<br><br>🌟 The topic<br>- The story theme is mobility. In particular specifically the use of energy-generating bikes.<br><br>////////////////////////////////////////////////</code><br><br><br><start>→ Let AI start! 🔮✍️</start>",
    de: 'Die Geschichte spielt im Jahr 2050 in einer kleinen Stadt in Brandenburg, Deutschland, namens Herzberg (Elster). \nDie Protagonistin ist eine 84-jährige Frau namens Ursula. \nDas Thema der Geschichte ist Mobilität und insbesondere die Nutzung von energieerzeugenden Fahrrädern. \nUrsula lebt in einer Gemeinschaft mit anderen Menschen. Ihre beste Freundin ist eine intelligente Tragetasche namens Carrie. \nCarrie ist wichtig für Ursula, weil sie ihr bei der Ernte hilft, schwere Sachen zu tragen. \nUrsula möchte, dass die Menschen in der Stadt, egal welchen Alters, zusammenleben und jeder zu dem beiträgt, was er kann. \nUrsula hat jedoch Angst, dass die ganze Technologie und das Zusammenleben mit jungen Menschen ihre Unabhängigkeit gefährdet und ältere Menschen wie sie ausschließt.<br><br><start>Lass die KI starten! ✍️🔮</start>'
  },
  start: setupStory,
  system: system
}
