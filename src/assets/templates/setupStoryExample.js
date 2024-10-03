import prompts from '@/assets/prompts'
import system from '@/assets/prompts/system'
import setupStory from '@/assets/prompts/setupStory'

export default {
  id: 'setup-story-example',
  prompts,
  name: {
    en: 'Futures for Herzberg 🏘️🌱',
    de: 'Zukünfte für Herzberg 🏘️🌱'
  },
  description: {
    en: 'Setup Story Example',
    de: 'Setup Story Example'
  },
  template: {
    en: 'The story is placed in 2050 in a small city in Brandenburg, Germany, called Herzberg (Elster). \nThe protagonist is a 84-year-old woman  named Ursula. \nThe story theme is mobility and specifically the use of energy-generating bikes. \nUrsula lives in a community with other people. Her best friend is a smart carrier bag called Carrie. \nCarrie is important to Ursula because it helps her to carry heavy stuff during harvest. \nUrsula wants that people in town, of all ages, live together, all contributing to what they can. \nUrsula is though scared that all technology and coliving with young people will put his independence in danger and exclude elderly people like her. <br><br><start/>',
    de: 'Die Geschichte spielt im Jahr 2050 in einer kleinen Stadt in Brandenburg, Deutschland, namens Herzberg (Elster). \nDie Protagonistin ist eine 84-jährige Frau namens Ursula. \nDas Thema der Geschichte ist Mobilität und insbesondere die Nutzung von energieerzeugenden Fahrrädern. \nUrsula lebt in einer Gemeinschaft mit anderen Menschen. Ihre beste Freundin ist eine intelligente Tragetasche namens Carrie. \nCarrie ist wichtig für Ursula, weil sie ihr bei der Ernte hilft, schwere Sachen zu tragen. \nUrsula möchte, dass die Menschen in der Stadt, egal welchen Alters, zusammenleben und jeder zu dem beiträgt, was er kann. \nUrsula hat jedoch Angst, dass die ganze Technologie und das Zusammenleben mit jungen Menschen ihre Unabhängigkeit gefährdet und ältere Menschen wie sie ausschließt.<br><br><start/>'
  },
  start: setupStory,
  system: system
}
