import { GoogleGenerativeAI } from "@google/generative-ai"


const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
    },
    systemInstruction: `You are an expert in MERN and Development. You have an experience of 10 years in the development. You always write code in modular and break the code in the possible way and follow best practices, You use understandable comments in the code, you create files as needed, you write code while maintaining the working of previous code. You always follow the best practices of the development You never miss the edge cases and always write code that is scalable and maintainable, In your code you always handle the errors and exceptions.
    
    Examples: 

    <example>
 
    response: {

    "text": "this is you fileTree structure of the express server",
    "fileTree": {
        "app.js": {
            file: {
                contents: "
                const express = require('express');

                const app = express();


                app.get('/', (req, res) => {
                    res.send('Hello World!');
                });


                app.listen(3000, () => {
                    console.log('Server is running on port 3000');
                })
                "
            
        },
    },

        "package.json": {
            file: {
                contents: "

                {
                    "name": "temp-server",
                    "version": "1.0.0",
                    "main": "index.js",
                    "scripts": {
                        "test": "echo \"Error: no test specified\" && exit 1"
                    },
                    "keywords": [],
                    "author": "",
                    "license": "ISC",
                    "description": "",
                    "dependencies": {
                        "express": "^4.21.2"
                    }
}

                
                "
                
                

            },

        },

    },
    "buildCommand": {
        mainItem: "npm",
            commands: [ "install" ]
    },

    "startCommand": {
        mainItem: "node",
            commands: [ "app.js" ]
    }
}

    user:Create an express application 
   
    </example>


    
       <example>

       user:Hello 
       response:{
       "text":"Hello, How can I help you today?"
       }
       
       </example>
    
 IMPORTANT : don't use file name like routes/index.js
       
       
    `
});

const getMockResponse = (prompt) => {
    const p = prompt.toLowerCase();
    
    if (p.includes("express") || p.includes("server") || p.includes("node") || p.includes("backend")) {
        return JSON.stringify({
            text: "Here is a simple Express server file tree. I have populated the code in the explorer panel. Click **run** on the right side of the editor to install express and start the server in the WebContainer!",
            fileTree: {
                "app.js": {
                    file: {
                        contents: "import express from 'express';\nconst app = express();\n\napp.get('/', (req, res) => {\n  res.send('Hello from the interactive AI WebContainer!');\n});\n\napp.listen(3000, () => {\n  console.log('Server is running on port 3000');\n});"
                    }
                },
                "package.json": {
                    file: {
                        contents: "{\n  \"name\": \"temp-server\",\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"main\": \"app.js\",\n  \"scripts\": {\n    \"start\": \"node app.js\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.21.2\"\n  }\n}"
                    }
                }
            },
            buildCommand: {
                mainItem: "npm",
                commands: ["install"]
            },
            startCommand: {
                mainItem: "npm",
                commands: ["start"]
            }
        });
    }

    if (p.includes("html") || p.includes("website") || p.includes("page") || p.includes("frontend")) {
        return JSON.stringify({
            text: "Here is a basic HTML boilerplate file tree. I have loaded it into the explorer. Click **run** on the editor to preview it inside the WebContainer.",
            fileTree: {
                "index.html": {
                    file: {
                        contents: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Hello World</title>\n  <style>\n    body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #e0f2fe; }\n    h1 { color: #0369a1; }\n  </style>\n</head>\n<body>\n  <h1>Hello from CHATNCOLLAB AI!</h1>\n</body>\n</html>"
                    }
                },
                "package.json": {
                    file: {
                        contents: "{\n  \"name\": \"html-preview\",\n  \"version\": \"1.0.0\",\n  \"scripts\": {\n    \"start\": \"npx -y serve -l 3000\"\n  }\n}"
                    }
                }
            },
            buildCommand: {
                mainItem: "echo",
                commands: ["building..."]
            },
            startCommand: {
                mainItem: "npm",
                commands: ["start"]
            }
        });
    }

    return JSON.stringify({
        text: `Hello! I am your AI assistant. You can ask me to create code files, for example:\n- "@ai create an express app"\n- "@ai generate a basic html website"`
    });
};

export const generateResult = async (prompt) => {
    if (!process.env.GOOGLE_AI_KEY || process.env.GOOGLE_AI_KEY.includes("Dummy") || process.env.GOOGLE_AI_KEY.includes("your_")) {
        console.log("Using local mock response for prompt:", prompt);
        return getMockResponse(prompt);
    }

    try {
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("AI Generation Error:", error);
        return JSON.stringify({
            text: `⚠️ **AI Service Error:** Failed to generate response.\n\n*Reason: ${error.message}*`
        });
    }
}