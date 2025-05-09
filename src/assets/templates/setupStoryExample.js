import prompts from '@/assets/prompts'
import system from '@/assets/prompts/system'
import setupStory from '@/assets/prompts/setupStory'

export default {
  id: 'setup-story-example',
  prompts,
  name: {
    en: 'Example: Story Setup 🧑🏻‍🏫📝',
    de: 'Beispiel: Geschichte planen 🧑🏻‍🏫📝'
  },
  description: {
    en: 'How to plan a story?',
    de: 'Wie kann man eine Geschichte vorbereiten?'
  },
  template: {
    en: "<br><code>////////////////////////////////////////////////<br><br>Let's setup the story first:<br><br>🧑🏽‍🎤 The protagonist <br>- The protagonist is Ursula, an 84 year old woman.<br>- Ursula lives in a community with other people.<br>- Ursula wants that people in town, of all ages, live together, all contributing to what they can. <br>- Ursula is though scared that all technology and co-living with young people will put his independence in danger and exclude elderly people like her. <br><br>🦄 The others<br>- Her best friend is a smart carrier bag called Carrie. Carrie is important to Ursula because it helps her to carry heavy stuff during harvest.<br><br>🌐 The future city where they live<br>- The story is placed in 2050 in a small city in Brandenburg, Germany, called Herzberg (Elster).<br>- People live together in local self-managed communities of individuals of all genders and ages.<br><br>🌟 The topic & themes<br>- The story's theme is mobility. In particular specifically the use of energy-generating bikes.<br><br>////////////////////////////////////////////////</code><br><br><br><start>→ Let AI start! 🔮✍️</start>",
    de: "<br><code>////////////////////////////////////////////////<br><br>Planen wir zuerst die Geschichte:<br><br>🧑🏽‍🎤 Protagonist*in <br>- Die Protagonistin ist Ursula, eine 84 Jahre alte Frau.<br>- Ursula lebt in einer Gemeinschaft mit anderen Menschen.<br>- Ursula wünscht sich, dass die Menschen in der Stadt, egal welchen Alters, zusammenleben und jeder zu dem beiträgt, was er kann. <br>- Ursula hat jedoch Angst, dass die ganze Technologie und das Zusammenleben mit jungen Menschen ihre Unabhängigkeit gefährdet und ältere Menschen wie sie ausschließt. <br><br>🦄 Die Anderen<br>- Ihre beste Freundin ist eine schicke, intelligente Tragetasche namens Carrie. Carrie ist wichtig für Ursula, weil sie ihr hilft, schwere Sachen bei der Ernte zu tragen.<br><br>🌐 Ihre zukünftige Stadt<br>- Die Geschichte spielt im Jahr 2050 in einer kleinen Stadt in Brandenburg, Deutschland, namens Herzberg (Elster).<br>- Die Menschen leben in lokalen, selbstverwalteten Gemeinschaften von Menschen aller Geschlechter und jeden Alters zusammen.<br><br>🌟 Thema der Geschichte<br>- Thema der Geschichte ist Mobilität. Insbesondere die Nutzung von Fahrrädern, die Energie für die Stadt erzeugen.<br><br>////////////////////////////////////////////////</code><br><br><br><start>→ Lasst die KI beginnen! 🔮✍️</start>"
  },
  start: setupStory,
  system: system
}
