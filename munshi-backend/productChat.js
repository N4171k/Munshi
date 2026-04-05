import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { Tool } from 'langchain/tools';
import dotenv from "dotenv";
dotenv.config();

// Instantiate Gemini model for product recommendations
const llmProductRecommendation = new ChatGoogleGenerativeAI({
    model: "gemini-1.5-flash",
    temperature: 0.7,
    maxOutputTokens: 2048,
    apiKey: process.env.GEM_API,
});

// Product search tool using DuckDuckGo
const productSearchTool = new DuckDuckGoSearch({
    maxResults: 5,
});

const generateProductPrompt = (userInput) => {
    return `You are a product expert specializing in providing the latest insights on consumer products in the Indian market. Your response must be strictly based on the most recent data obtained via the DuckDuckGo search tool. Do not include any assumptions, simulations, hypothetical scenarios, or opinions beyond what is verifiable from the search results.

**User Query:**  
${userInput}

**Instructions:**
- **Data Source:** Use the DuckDuckGo search tool exclusively to fetch the latest and most relevant product data.
- **Accuracy:** Do not assume or infer any information. Only provide details that are directly supported by the web search results.
- **Detailing:** Present all available details and actionable recommendations without omitting any critical data.
- **Clarity:** Organize your response using headings, bullet points, or numbered lists to ensure clarity and readability.
- **Limitations:** If certain information is unavailable, clearly state that no verified data was found.
- **Focus:** Only provide the data extracted by web search. Do not include any additional commentary or extraneous text.

`;
};

// Main function to run the stock market agent
export const runProductAgent = async (userInput) => {
    try {
        const systemPrompt = generateProductPrompt(userInput);

        const agentExecutor = await initializeAgentExecutorWithOptions(
            [productSearchTool],
            llmProductRecommendation,
            {
                agentType: 'zero-shot-react-description',
                verbose: true,
                maxIterations: 2
            }
        );

        console.log("Stock Market System Prompt: " + systemPrompt);

        const result = await agentExecutor.invoke({
            input: systemPrompt
        });

        console.log("Stock Market Agent Output: " + result.output);
        return result.output;
    } catch (error) {
        console.error("Error running stock market agent:", error);
        throw error;
    }
};

class ProductAgentToolClass extends Tool {
    name = "StockMarketAgentTool";
    description = "Fetches up-to-date stock market insights for the Indian market using web search.";

    async _call(input) {
        try {
            // Call the stock market agent with the user's query
            const result = await runProductAgent(input);
            return result;
        } catch (error) {
            throw new Error("StockMarketAgentTool encountered an error: " + error.message);
        }
    }
}

export const ProductAgentTool = new ProductAgentToolClass()
