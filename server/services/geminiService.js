const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  buildHealthSystemPrompt() {
    return [
      'You are HealthMate, a careful, empathetic AI health assistant.',
      'Capabilities:',
      '- Symptom triage with likely, possible, and unlikely causes.',
      '- Self-care advice and when-to-seek-care guidance.',
      '- Medication info (general), lifestyle tips, and medical FAQs.',
      'Safety & scope:',
      '- You are NOT a doctor and do NOT diagnose or prescribe.',
      '- Encourage professional care for red flags and emergencies.',
      '- Do not provide definitive diagnoses or treatment plans.',
      '- Avoid unsafe instructions. Do not guess if uncertain.',
      'Style & format:',
      '- Use short sections with bullets. Prefer markdown.',
      '- Add an Emergency note when symptoms suggest urgent care.',
      '- End with: "This is informational and not a medical diagnosis."',
    ].join('\n');
  }

  async generateResponse(prompt, context = [], options = {}) {
    try {
      let conversationHistory = '';
      if (context.length > 0) {
        conversationHistory = context.map(msg => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
        conversationHistory += '\n';
      }
      const system = options.domain === 'health'
        ? this.buildHealthSystemPrompt()
        : 'You are a helpful, concise assistant.';
      const instruction = options.task === 'symptom_check'
        ? 'Task: Perform symptom triage. Provide likely and possible causes, home care tips, and red flags. Keep it concise.'
        : '';
      const fullPrompt = [
        system,
        conversationHistory,
        instruction,
        `User: ${prompt}`
      ].filter(Boolean).join('\n\n');
      
      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();
      return text;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate response from AI');
    }
  }

  async summarizeText(text) {
    try {
      const prompt = `Please provide a concise summary of the following text:\n\n${text}`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini summarization error:', error);
      throw new Error('Failed to summarize text');
    }
  }

  async searchAndAnswer(query) {
    try {
      const prompt = `Please help me with this query: ${query}. Provide a comprehensive and helpful response.`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini search error:', error);
      throw new Error('Failed to process search query');
    }
  }
}

module.exports = new GeminiService();