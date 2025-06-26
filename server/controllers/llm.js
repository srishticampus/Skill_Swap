import { GoogleGenerativeAI } from '@google/generative-ai';

// Access your API key as an environment variable (recommended)
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const summarizeSwapRequest = async (req, res) => {
  try {
    const { swapRequestData } = req.body;

    if (!swapRequestData) {
      return res.status(400).json({ message: 'Swap request data is required.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Summarize the following skill swap request. Focus on the skills offered and requested, the service description, and the overall progress based on the updates. Keep the summary concise and informative.

Swap Request Details:
- Created By: ${swapRequestData.createdBy?.name || 'N/A'}
- Interaction User: ${swapRequestData.interactionUser?.name || 'N/A'}
- Category 1: ${swapRequestData.serviceCategory && swapRequestData.serviceCategory.length > 0 ? swapRequestData.serviceCategory[0].name : 'N/A'}
- Category 2: ${swapRequestData.serviceCategory && swapRequestData.serviceCategory.length > 1 ? swapRequestData.serviceCategory[1].name : 'N/A'}
- Service Description: ${swapRequestData.serviceDescription || 'N/A'}
- Updates: ${swapRequestData.updates.map(update => `(${new Date(update.createdAt).toLocaleDateString()}) ${update.title} (${update.percentage}%): ${update.message}`).join('\n- ')}

Provide a summary in a paragraph or two.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ summary: text });

  } catch (error) {
    console.error('Error summarizing swap request with Gemini:', error);
    res.status(500).json({ message: 'Failed to summarize swap request.', error: error.message });
  }
};
