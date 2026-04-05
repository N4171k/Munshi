import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
// Import the DuckDuckGo search tool from LangChain
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";
import { StockMarketAgentTool } from './stockMarketAgent.js';
import { Tool } from 'langchain/tools';
import { ProductAgentTool } from './productChat.js';

import dotenv from "dotenv";
dotenv.config();

// Instantiate the Gemini model
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash",
  temperature: 0.7,
  maxOutputTokens: 2048,
  apiKey: process.env.GEM_API,
});

// Instantiate the DuckDuckGo search tool
// This tool will help with stock market and product-
// Product search tool using DuckDuckGo
const webSearchTool = new DuckDuckGoSearch({
  maxResults: 5,
});


// Function to generate the system prompt dynamically with user context
const generateSystemPrompt = (userData, userInput, transactions, chat_history, language) => {

  const chatMarkDown = chat_history.map((tx, index) =>
    `
  - **content:** ${tx.content}
  - **sender:** ₹${tx.sender}
  - **date:** ${tx.date}
  `
  ).join("\n\n");

  return `You are **MunshiG**, a friendly, human-like personal finance advisor dedicated to helping youth manage their finances effectively. Do not assume or infer any details that are not directly supported by the provided information.

  If You need user's transaction and spending details use  **TransactionTool**

  What You can do:
   - Give Financial Advice.
   - Give stock market data and recommendations
   - Give product related financial data and advice.
   - Access user transactions, bill, payments and financial history.
   - Analyze user transactions and advice them
  

  You have access to the following user details:

- **Date of Birth:** ${userData.dob}
- **Monthly Income:** ${userData.monthlyIncome}
- **Monthly Budget:** ${userData.monthlyBudget}
- **User Type:** ${userData.type}
- **Current Available Money:** ${userData.moneyInPocket}
- **Additional Information:** ${userData.additionalInfo || "N/A"}

**Tool Usage:** 
- **TransactionTool:** use this tool to get transaction data of the user, of their bills, spends, income, transfer,etc.
 - **StockMarketAgentTool:** use this If the query involves stock market recommendations, utilize the with only the necessary context.
 - **ProductAgentTool:** use this If the query involves any product and services related data such as (TV, car, AC, Bus) any kind of stuff which can be bought recommendations or related data, utilize the with only the necessary context.
 - **webSearchTool:** use this If you need any details to search from web, like tax rates, FD rates and any other information, use it with a search query.

**User Query:**  
${userInput}

No matter in what language the user asks the question, Give the answer in proper ${language} only

If the user question is not relevant to finance or not or user gives any kind of phrase that is not understandable directly - return "Sorry, I can't do this now, please try something else"

Use the chat history to get the previous conversation, answer on the basis of that also, use it as context for past data
- **Chat History:**  
  ${chatMarkDown}  

If you have greeted once then don't do it again and again, for smaller messages like Hi/Hello, greet the user and just ask them **how can I help you**?

  
**Instructions:**
- **Keep It Concise:** Respond in no more than 200 words unless a detailed analysis is requested.
- **Tone & Language:** Use proper Indian English in a friendly, conversational tone—like a trusted friend.
- **Relevance:** Answer strictly what the user asks; avoid irrelevant or extra details.
- **Currency & Context:** Always use rupees and provide advice pertinent to the Indian context.
- **Engagement:** If further clarification is needed, conclude with follow-up questions listed as bullet points.

Deliver clear, meaningful, and friendly financial advice while deducing the user's age from their DOB.

`;
};

// Main function to run the agent with user input and context
export const runAgent = async (userInput, userData, transactions, chat_history, language) => {
  try {

    class TransactionToolsClass extends Tool {
      name = "TransactionTool";
      description = "Gets user Transactions";

      async _call(input) {
        try {
          const transactionsMarkdown = transactions.map((tx, index) =>
            `**Transaction ${index + 1}:**
              - **Title:** ${tx.title}
              - **Amount:** ₹${tx.amount}
              - **Category:** ${tx.category}
              - **Payment Method:** ${tx.paymentMethod}
              - **Type:** ${tx.type}
              - **Description:** ${tx.description}
              - **Date:** ${tx.date}`
          ).join("\n\n");
          // Call the stock market agent with the user's query

          return transactionMarkdown;
        } catch (error) {
          throw new Error("StockMarketAgentTool encountered an error: " + error.message);
        }
      }
    }

    const TransactionTool = new TransactionToolsClass()

    // Generate the system prompt with the user context
    const systemPrompt = generateSystemPrompt(userData, userInput, transactions, chat_history, language);

    // Initialize the agent with the dynamic system prompt and tools.
    // The DuckDuckGo search tool is available for product recommendations or stock market queries.
    const agentExecutor = await initializeAgentExecutorWithOptions(
      [StockMarketAgentTool, ProductAgentTool, webSearchTool, TransactionTool],
      llm,
      {
        agentType: 'zero-shot-react-description',
        verbose: true,
        maxIterations: 2
      }
    );

    console.log("SystemPrompt: " + systemPrompt);

    const result = await agentExecutor.invoke({
      input: systemPrompt
    });

    console.log("LLM OUTPUT: " + result.output);
    return result.output;
  } catch (error) {
    console.error("Error running agent:", error);
    throw error;
  }
};


