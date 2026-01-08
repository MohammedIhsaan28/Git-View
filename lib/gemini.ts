import { GoogleGenAI } from "@google/genai";
import { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export const aiSummariseCommit = async (diff: string) => {
  //https://github.com/owner/repo/commit/commitHash.diff
  const contents = `Summarize the following git diff in a concise manner, focusing on the key changes made:\n\n${diff}`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents,
      });
      return { summary: response.text ?? "No summary available" };
    } catch (error) {
        console.error("Error summarising commit diff:", error);
    }
  
};

export async function summariseCode(docs: Document) {
    try {
      const code = docs.pageContent.slice(0, 10000);
      const contents = `You are senior software enginerr who onboarding a junior software engineer and explaining to them the purpose of the ${docs.metadata.source} file contents.
        Here is the code:
        ----
        ${code}
        ----
        Give a summary no more than 100 words of the code above
        `;
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents,
      });
      return response.text ?? "No summary available";
    } catch (error) {
        console.error("Error summarising code document:", error);
      }
}

export async function generateEmbedding(summary: string) {
    try {
      const embedding = await ai.models.embedContent({
        model: "text-embedding-004",
        contents: summary,
      });
      return embedding?.embeddings?.[0]?.values || [];
    } catch (error) {
        console.error("Error generating embedding:", error);
    }
  
}
