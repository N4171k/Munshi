import { puter } from "@heyputer/puter.js";

const buildPrompt = (user, input, messages, language, task) => {
    const userData = user?.userData ?? {};
    const transactions = user?.transactions ?? [];

    const chatHistory = messages
        .map((message) => `- ${message.sender}: ${message.content}`)
        .join("\n");

    const transactionSummary = transactions.length
        ? transactions
            .slice(-10)
            .map((transaction, index) => `- Transaction ${index + 1}: ${JSON.stringify(transaction)}`)
            .join("\n")
        : "No recent transactions available.";

    return `You are MunshiG, a friendly personal finance assistant for Indian users.

Task: ${task}
Reply in ${language} only.
Keep the answer concise and practical.
Use rupees for currency.
Only respond to finance, budgeting, saving, spending, investment, and related money questions.
If the message is not understandable or not finance-related, reply exactly: "Sorry, I can't do this now, please try something else"

User profile:
- Date of Birth: ${userData.dob ?? "N/A"}
- Monthly Income: ${userData.monthlyIncome ?? "N/A"}
- Monthly Budget: ${userData.monthlyBudget ?? "N/A"}
- User Type: ${userData.type ?? "N/A"}
- Current Available Money: ${userData.moneyInPocket ?? "N/A"}
- Additional Information: ${userData.additionalInfo ?? "N/A"}

Recent transactions:
${transactionSummary}

Recent chat history:
${chatHistory || "No prior chat history."}

User message:
${input}`;
};

const executePrompt = async (prompt, language, task) => {
    const response = await puter.ai.chat(prompt, { model: "gpt-5.4-nano" });

    if (typeof response === "string") {
        return { answer: response };
    }

    return {
        answer:
            response?.text ??
            response?.message?.content ??
            response?.content ??
            String(response),
    };
};

export const getChatResponse = async (user, input, messages, language) => {
    try {
        return await executePrompt(buildPrompt(user, input, messages, language, "Answer the user's finance question."), language, "chat");
    } catch (error) {
        console.error("Error fetching chat response:", error);
        throw error;
    }
};

export const getAnalysis = async (user) => {
    try {
        return await executePrompt(
            buildPrompt(user, "Provide a concise financial summary based on the user's profile and transaction patterns.", [], user?.ui?.language || "English", "Financial summary"),
            user?.ui?.language || "English",
            "analysis"
        );
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export const getAdvice = async (user) => {
    try {
        return await executePrompt(
            buildPrompt(user, "Provide actionable financial advice to improve budgeting, savings, and spending decisions.", [], user?.ui?.language || "English", "Financial advice"),
            user?.ui?.language || "English",
            "advice"
        );
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};

export const getSavingAdvice = async (user) => {
    try {
        return await executePrompt(
            buildPrompt(user, "Create a practical monthly savings plan with clear steps.", [], user?.ui?.language || "English", "Savings plan"),
            user?.ui?.language || "English",
            "saving"
        );
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};
