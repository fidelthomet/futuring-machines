import prompts from '@/assets/prompts'

export default {
  id: 'local-community',
  name: 'Local Community 🏘️🌱',
  prompts,
  description: 'What will living in a local community mean in 50 years?',
  start: {
    mode: 'append',
    actions: [
      {
        type: 'generate',
        template:
          'You are a world-famous science fiction author and Hugo Award winner. You specialize in fast narratives with short sentences. Write the first paragraph of a short speculative fiction about ::topics:: in the year ::year::. The main character is named ::mainCharacter::. Their everyday companion is a ::companionType::. The paragraph should be no more than two sentences long. Make the sentences as short as possible. Leave the last sentence incomplete. Use a simple and narrative language.'
      }
    ],
    env: {
      year: '2074',
      mainCharacter: 'Ursula',
      topics: 'autonomy, self-supporter, community, shared living',
      companionType: 'a high-tech bag named Carrie',
    }
  }
}
