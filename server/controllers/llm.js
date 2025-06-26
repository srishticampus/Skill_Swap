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

    let prompt = `Summarize the following skill swap request. Focus on the skills offered and requested, the service description, and the overall progress based on the updates. Do not mention fields that are not provided or are "N/A". Keep the summary concise and informative.

Swap Request Details:
`;

    if (swapRequestData.serviceTitle) {
      prompt += `- Service Title: ${swapRequestData.serviceTitle}\n`;
    }
    if (swapRequestData.createdBy?.name) {
      prompt += `- Created By: ${swapRequestData.createdBy.name}\n`;
    }
    if (swapRequestData.interactionUser?.name) {
      prompt += `- Interaction User: ${swapRequestData.interactionUser.name}\n`;
    }
    if (swapRequestData.serviceCategory && swapRequestData.serviceCategory.length > 0) {
      prompt += `- Category Offered: ${swapRequestData.serviceCategory[0].name}\n`;
    }
    if (swapRequestData.serviceCategory && swapRequestData.serviceCategory.length > 1) {
      prompt += `- Category Requested: ${swapRequestData.serviceCategory[1].name}\n`;
    }
    if (swapRequestData.serviceRequired) {
      prompt += `- Skill Requested: ${swapRequestData.serviceRequired}\n`;
    }
    if (swapRequestData.serviceDescription) {
      prompt += `- Service Description: "${swapRequestData.serviceDescription}"\n`;
    }
    if (swapRequestData.yearsOfExperience !== undefined && swapRequestData.yearsOfExperience !== null) {
      prompt += `- Years of Experience: ${swapRequestData.yearsOfExperience}\n`;
    }
    if (swapRequestData.preferredLocation) {
      prompt += `- Preferred Location: ${swapRequestData.preferredLocation}\n`;
    }
    if (swapRequestData.deadline) {
      prompt += `- Deadline: ${new Date(swapRequestData.deadline).toLocaleDateString()}\n`;
    }
    if (swapRequestData.requestStatus) {
      prompt += `- Request Status: ${swapRequestData.requestStatus}\n`;
    }
    if (swapRequestData.interactionStatus) {
      prompt += `- Interaction Status: ${swapRequestData.interactionStatus}\n`;
    }

    if (swapRequestData.updates && swapRequestData.updates.length > 0) {
      prompt += `\nPerformance Updates:\n`;
      swapRequestData.updates.forEach(update => {
        const userName = update.user?.name || 'Unknown User';
        const updateDate = new Date(update.createdAt).toLocaleDateString();
        const updateTitle = update.title || 'No Title';
        const updatePercentage = update.percentage !== undefined && update.percentage !== null ? `${update.percentage}%` : 'N/A';
        const updateMessage = update.message || 'No message provided.';
        prompt += `- On ${updateDate}, ${userName} updated: "${updateTitle}" (${updatePercentage} completed). Details: "${updateMessage}"\n`;
      });
    }

    prompt += `\nProvide a summary in a paragraph or two. It should be informative and concise, but not too long.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ summary: text });

  } catch (error) {
    console.error('Error summarizing swap request with Gemini:', error);
    res.status(500).json({ message: 'Failed to summarize swap request.', error: error.message });
  }
};
