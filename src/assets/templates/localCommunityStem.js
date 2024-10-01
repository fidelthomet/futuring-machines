import prompts from '@/assets/prompts'

export default {
  id: 'local-community-stem',
  prompts,
  name: {
    en: 'Local Community 🏘️🌱',
    de: 'Lokale Gemeinschaft 🏘️🌱'
  },
  description: {
    en: 'What will living in a local community mean in 50 years?',
    de: 'Was wird das Leben in einer lokalen Gemeinschaft in 50 Jahren bedeuten?'
  },
  template: {
    en: 'Ursula tended her hydroponic garden. <placeholder length=4></placeholder>, her <placeholder length=5></placeholder> humming by her side. Ursula was happy that <placeholder length=7></placeholder>. <placeholder length=4></placeholder> helped her to <placeholder length=9></placeholder>. Self-sufficient domes bloomed around them, a vibrant community thrived within their shared living space. It was a warm winter day in 2074. Suddenly, an alarm blared, disrupting the peace. "It is <start/>',
    de: 'Ursula pflegte ihren hydroponischen Garten. <placeholder length=4></placeholder>, ihre <placeholder length=5></placeholder>, summte an ihrer Seite. Ursula war froh, dass sie <placeholder length=7></placeholder>. <placeholder length=4></placeholder> half ihr bei <placeholder length=9></placeholder>. Um sie herum blühten autarke Kuppeln und eine lebendige Gemeinschaft entstand in ihrem gemeinsamen Lebensraum. Es war ein warmer Wintertag im Jahr 2074. Plötzlich ertönte ein Alarm, der die Ruhe störte. "Es ist <start/>'
  }
}