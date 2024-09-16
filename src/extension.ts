import * as vscode from 'vscode';
import axios from 'axios';

// Removed the timeout variable as it's no longer needed
// let timeout: NodeJS.Timeout | undefined;
const modelName = "stable-code"
// const modelName = "codegemma:2b-code-fp16"
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "HomeLlama" is now active!');

  // Register command for chat-like interaction
  let disposable = vscode.commands.registerCommand('homellama.askLlama', async () => {
    const prompt = await vscode.window.showInputBox({
      placeHolder: "Ask HomeLlama something...",
    });

    if (prompt) {
      try {
        console.log('Sending POST request to Ollama with prompt:', prompt);
        const response = await axios.post('http://127.0.0.1:11434/api/generate', {
          model: modelName,
          prompt: prompt
        });
        vscode.window.showInformationMessage(`Ollama says: ${response.data.response}`);
      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  });

  // Register inline completion provider for JavaScript and TypeScript
  const inlineProvider = vscode.languages.registerInlineCompletionItemProvider(
    ['javascript', 'typescript'],
    {
      async provideInlineCompletionItems(document, position, context, token) {
        const currentLine = document.lineAt(position).text.substring(0, position.character).trim();
        console.log('Inline completion provider triggered. Current line:', currentLine);

        // Removed timeout clearing since timeout is no longer used
        /*
        if (timeout) {
          clearTimeout(timeout);
        }
        */

        try {
          const prompt = `Provide a concise JavaScript code snippet to complete the following line:\n${currentLine}`;
          console.log('Sending POST request to Ollama with prompt:', prompt);
          
          const response = await axios.post('http://127.0.0.1:11434/api/generate', {
            model: modelName,
            prompt: prompt,
            stream: false // We'll handle streaming differently below
          });

          console.log('Response from Ollama:', response.data);

          const rawResponse = response.data.response.trim();

          // Extract code between ```javascript and ```
          const codeMatch = rawResponse.match(/```javascript\s*([\s\S]*?)```/i) ||
                            rawResponse.match(/```js\s*([\s\S]*?)```/i) ||
                            [null, rawResponse];
          const codeSnippet = codeMatch[1] ? codeMatch[1].trim() : rawResponse;

          if (codeSnippet) {
            // **Change 1:** Adding a newline before the codeSnippet
            const inlineItem = new vscode.InlineCompletionItem(new vscode.SnippetString(`\n${codeSnippet}`));
            return new vscode.InlineCompletionList([inlineItem]);
          } else {
            return undefined;
          }

        } catch (error: any) {
          console.error('Error fetching completion:', error.message);
          return undefined;
        }

        /*
        // Removed the timeout-based Promise
        return new Promise<vscode.InlineCompletionList | undefined>((resolve, reject) => {
          timeout = setTimeout(async () => {
            // ... existing API call logic
          }, 300); // Debounce delay
        });
        */
      }
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(inlineProvider);
}

export function deactivate() {}
