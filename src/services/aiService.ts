import { Question, Answer, ResumeData, InterviewSession } from '../types';

class AIService {
  private apiKey: string;
  private baseUrl: string;
  private isApiKeyValid: boolean = false;

  constructor() {
    this.apiKey = import.meta.env.GEMINI_API_KEY || '';
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
    this.validateApiKey();
  }

  private validateApiKey(): void {
    if (!this.apiKey) {
      console.error('❌ Gemini API key not found! Please set GEMINI_API_KEY in your environment variables.');
      this.isApiKeyValid = false;
      return;
    }

    if (this.apiKey.length < 20) {
      console.error('❌ Invalid Gemini API key format! The key appears to be too short.');
      this.isApiKeyValid = false;
      return;
    }

    if (!this.apiKey.startsWith('AI')) {
      console.warn('⚠️ Gemini API key format warning. Keys typically start with "AI".');
    }

    this.isApiKeyValid = true;
    console.log('✅ Gemini API key validated successfully!');
  }

  private ensureApiKey(): void {
    if (!this.isApiKeyValid) {
      throw new Error('Gemini API key is not configured or invalid. Please check your environment variables and ensure GEMINI_API_KEY is set correctly.');
    }
  }
  private async callGeminiAPI(prompt: string, temperature: number = 0.7): Promise<string> {
    this.ensureApiKey();

    const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;
  }

  async generateQuestions(resumeData: ResumeData): Promise<Question[]> {
    try {
      // Enhanced resume analysis
      const resumeAnalysis = await this.analyzeResume(resumeData);
      
      const prompt = `
        Based on the following detailed resume analysis, generate 6 personalized interview questions for a software developer position.

        CANDIDATE PROFILE:
        - Name: ${resumeData.name || 'Not provided'}
        - Email: ${resumeData.email || 'Not provided'}
        - Phone: ${resumeData.phone || 'Not provided'}
        
        RESUME ANALYSIS:
        ${resumeAnalysis}
        
        FULL RESUME TEXT:
        ${resumeData.rawText}
        
        INSTRUCTIONS:
        1. Generate questions that are SPECIFIC to this candidate's experience and skills
        2. Ask about technologies they've mentioned in their resume
        3. Create questions that test both theoretical knowledge and practical experience
        4. Ensure questions are relevant to their career level and background
        
        Generate exactly 6 questions with this distribution:
        - 2 Easy questions (30-60 seconds): Basic concepts related to their tech stack
        - 2 Medium questions (90-120 seconds): Intermediate concepts and best practices
        - 2 Hard questions (150-180 seconds): Advanced scenarios and problem-solving
        
        Return ONLY valid JSON format (no markdown, no explanations):
        [
          {
            "id": "q1",
            "text": "Specific question based on their resume",
            "difficulty": "easy",
            "timeLimit": 45,
            "category": "Technology from their resume"
          },
          {
            "id": "q2", 
            "text": "Another specific question",
            "difficulty": "easy",
            "timeLimit": 60,
            "category": "Another relevant technology"
          },
          {
            "id": "q3",
            "text": "Medium difficulty question",
            "difficulty": "medium", 
            "timeLimit": 90,
            "category": "Best practices"
          },
          {
            "id": "q4",
            "text": "Another medium question",
            "difficulty": "medium",
            "timeLimit": 120,
            "category": "Architecture"
          },
          {
            "id": "q5",
            "text": "Hard scenario-based question",
            "difficulty": "hard",
            "timeLimit": 150,
            "category": "Advanced concepts"
          },
          {
            "id": "q6",
            "text": "Another hard question",
            "difficulty": "hard", 
            "timeLimit": 180,
            "category": "Problem solving"
          }
        ]
      `;

      const response = await this.callGeminiAPI(prompt, 0.7);
      
      // Clean and parse JSON response
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const questions = JSON.parse(cleanedResponse);
      
      // Validate and enhance questions
      return questions.map((q: any, index: number) => ({
        id: q.id || `q_${index + 1}`,
        text: q.text || 'Question not available',
        difficulty: q.difficulty || 'medium',
        timeLimit: q.timeLimit || 90,
        category: q.category || 'General',
      }));
    } catch (error) {
      console.error('Error generating questions:', error);
      console.log('🔄 Falling back to default questions...');
      return this.getFallbackQuestions();
    }
  }

  private async analyzeResume(resumeData: ResumeData): Promise<string> {
    try {
      const prompt = `
        Analyze this resume and extract key information for generating personalized interview questions.
        
        Resume Text: ${resumeData.rawText}
        
        Please provide a structured analysis including:
        1. TECHNICAL SKILLS: List all programming languages, frameworks, tools mentioned
        2. EXPERIENCE LEVEL: Estimate years of experience and seniority level
        3. PROJECTS: Key projects or achievements mentioned
        4. EDUCATION: Degree and relevant coursework
        5. SPECIALIZATIONS: Areas of focus (frontend, backend, full-stack, etc.)
        6. CERTIFICATIONS: Any certifications or training mentioned
        
        Format as a concise summary for question generation.
      `;

      const response = await this.callGeminiAPI(prompt, 0.3);
      return response;
    } catch (error) {
      console.error('Error analyzing resume:', error);
      return `Basic resume analysis: ${resumeData.name || 'Unknown candidate'} with experience in software development.`;
    }
  }

  async evaluateAnswer(question: Question, answer: Answer): Promise<{ score: number; feedback: string }> {
    try {
      const prompt = `
        You are an expert technical interviewer evaluating a candidate's response. Provide a thorough and accurate assessment.

        QUESTION DETAILS:
        - Question: ${question.text}
        - Difficulty: ${question.difficulty}
        - Category: ${question.category}
        - Time Limit: ${question.timeLimit} seconds
        - Time Taken: ${answer.timeSpent} seconds
        
        CANDIDATE'S ANSWER:
        "${answer.text}"
        
        EVALUATION CRITERIA:
        For ${question.difficulty} difficulty questions, use these scoring standards:
        
        EASY QUESTIONS (1-10 scale):
        - 9-10: Excellent understanding, clear explanation, mentions best practices
        - 7-8: Good understanding, mostly correct, some minor gaps
        - 5-6: Basic understanding, partially correct, some confusion
        - 3-4: Limited understanding, significant errors
        - 1-2: Poor understanding, mostly incorrect
        
        MEDIUM QUESTIONS (1-10 scale):
        - 9-10: Advanced understanding, excellent explanation, considers edge cases
        - 7-8: Good understanding, solid explanation, minor gaps
        - 5-6: Adequate understanding, some good points, some errors
        - 3-4: Basic understanding, significant gaps or errors
        - 1-2: Poor understanding, major errors
        
        HARD QUESTIONS (1-10 scale):
        - 9-10: Expert level, comprehensive answer, shows deep knowledge
        - 7-8: Advanced level, good understanding, minor gaps
        - 5-6: Intermediate level, adequate but incomplete
        - 3-4: Basic level, significant gaps for this difficulty
        - 1-2: Inadequate for this difficulty level
        
        SCORING FACTORS:
        - Technical Accuracy (40%): Is the technical content correct?
        - Completeness (25%): Does it address all parts of the question?
        - Clarity (20%): Is the explanation clear and well-structured?
        - Relevance (15%): Does it directly answer the question asked?
        
        SPECIAL CONSIDERATIONS:
        - If answer is too short (< 20 words), deduct 2-3 points
        - If answer is completely off-topic, score 1-2
        - If answer shows no understanding, score 1-3
        - If answer is partially correct but incomplete, score 4-6
        - If answer is correct but lacks depth for the difficulty, score 6-7
        
        Provide detailed feedback explaining:
        1. What the candidate got right
        2. What they missed or got wrong
        3. Specific suggestions for improvement
        4. Overall assessment of their technical knowledge level
        
        Return ONLY valid JSON (no markdown, no explanations):
        {
          "score": [number between 1-10],
          "feedback": "[detailed feedback explaining the score and providing constructive criticism]"
        }
      `;

      const response = await this.callGeminiAPI(prompt, 0.2);
      
      // Clean and parse JSON response
      const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      const evaluation = JSON.parse(cleanedResponse);
      
      // Validate score is within range
      const score = Math.max(1, Math.min(10, Math.round(evaluation.score || 5)));
      
      return {
        score,
        feedback: evaluation.feedback || 'Evaluation completed. Consider reviewing the question and providing a more detailed answer.'
      };
    } catch (error) {
      console.error('Error evaluating answer:', error);
      
      // Enhanced fallback evaluation based on answer characteristics
      const score = this.getFallbackScore(answer.text, question.difficulty);
      const feedback = this.getFallbackFeedback(score, question.difficulty);
      
      return { score, feedback };
    }
  }

  private getFallbackScore(answer: string, difficulty: string): number {
  const answerText = answer.trim();
  const answerLength = answerText.length;
  // Detect absurd/random answers: only letters, no spaces, or gibberish
  const isAbsurd = /^[a-zA-Z]{4,}$/.test(answerText) && !/\s/.test(answerText) && answerLength < 12;
  // Detect if answer is just random letters or keyboard mashing
  const isGibberish = /^(?:[a-zA-Z]{3,}\s?){2,}$/.test(answerText) && !/[.,;:!?]/.test(answerText) && answerLength < 20;
  const hasTechnicalTerms = /\b(react|javascript|node|api|database|component|function|variable|async|await|promise|hook|state|props)\b/i.test(answerText);

  if (isAbsurd || isGibberish) return 0;

  let baseScore = 5;
  // Adjust based on answer length
  if (answerLength < 10) baseScore = 2;
  else if (answerLength < 30) baseScore = 3;
  else if (answerLength < 100) baseScore = 4;
  else if (answerLength > 200) baseScore = 6;

  // Adjust based on technical content
  if (hasTechnicalTerms) baseScore += 1;

  // Adjust based on difficulty
  if (difficulty === 'easy') baseScore += 1;
  else if (difficulty === 'hard') baseScore -= 1;

  return Math.max(1, Math.min(10, baseScore));
  }

  private getFallbackFeedback(score: number, difficulty: string): string {
    if (score === 0) {
      return `Your answer was not relevant or was detected as random/absurd input. Please provide a meaningful, technical response to the question. Review the question carefully and avoid typing random letters or gibberish.`;
    } else if (score >= 8) {
      return `Excellent answer! You demonstrated strong understanding of the ${difficulty} level concept. Keep up the great work! For further improvement, try to relate your answer to real-world scenarios or recent technologies you have used.`;
    } else if (score >= 6) {
      return `Good answer with solid understanding. To improve, provide more specific examples from your experience and elaborate on best practices relevant to the question.`;
    } else if (score >= 4) {
      return `Your answer shows some understanding but could be improved. Focus on being more specific, use technical terminology, and provide concrete examples from your work or studies.`;
    } else {
      return `Your answer needs improvement. Review the fundamentals for this topic and try to structure your response more clearly. Consider breaking down your answer into steps or key points for better clarity.`;
    }
  }

  async generateFinalEvaluation(session: InterviewSession): Promise<{
    totalScore: number;
    summary: string;
    strengths: string[];
    weaknesses: string[];
  }> {
    try {
      const qaPairs = session.questions.map((q, index) => {
        const answer = session.answers[index];
        return `Q${index + 1} (${q.difficulty}): ${q.text}\nA${index + 1}: ${answer?.text || 'No answer'}\nScore: ${answer?.score || 'N/A'}/10\n`;
      }).join('\n');

      const prompt = `
        You are an expert technical interviewer. Review the following interview Q&A and scores, and provide a tailored evaluation for the candidate:

        ${qaPairs}

        Please provide:
        1. Overall score (0-100)
        2. Brief summary (2-3 sentences) that highlights specific strengths and weaknesses based on the answers
        3. Top 3 strengths (tailored to what the candidate did well)
        4. Top 3 areas for improvement (tailored to what the candidate struggled with or missed)
        5. If any answer scored 0, mention that the candidate gave irrelevant or random input and recommend focusing on meaningful, technical responses in future interviews

        Return in JSON format:
        {
          "totalScore": number,
          "summary": "string",
          "strengths": ["string", "string", "string"],
          "weaknesses": ["string", "string", "string"]
        }
      `;

      const response = await this.callGeminiAPI(prompt, 0.3);

      return JSON.parse(response);
    } catch (error) {
      console.error('Error generating final evaluation:', error);
      // Fallback evaluation
      const totalScore = session.answers.reduce((sum, answer) => sum + (answer.score || 0), 0) / session.answers.length * 10;
      
      return {
        totalScore: Math.round(totalScore),
        summary: 'Interview completed successfully. Good technical knowledge demonstrated.',
        strengths: ['Good communication', 'Solid foundation', 'Problem-solving approach'],
        weaknesses: ['Could improve on advanced concepts', 'More practice needed', 'Time management'],
      };
    }
  }

  public getFallbackQuestions(): Question[] {
    return [
      {
        id: 'q1',
        text: 'What is the difference between props and state in React?',
        difficulty: 'easy',
        timeLimit: 30,
        category: 'React',
      },
      {
        id: 'q2',
        text: 'Explain the concept of closures in JavaScript.',
        difficulty: 'easy',
        timeLimit: 30,
        category: 'JavaScript',
      },
      {
        id: 'q3',
        text: 'How would you optimize a React component that re-renders frequently?',
        difficulty: 'medium',
        timeLimit: 90,
        category: 'React',
      },
      {
        id: 'q4',
        text: 'What are the differences between callbacks, promises, and async/await?',
        difficulty: 'medium',
        timeLimit: 90,
        category: 'JavaScript',
      },
      {
        id: 'q5',
        text: 'Design a scalable architecture for a real-time chat application using Node.js and React.',
        difficulty: 'hard',
        timeLimit: 180,
        category: 'Architecture',
      },
      {
        id: 'q6',
        text: 'How would you implement server-side rendering (SSR) in a React application and what are the trade-offs?',
        difficulty: 'hard',
        timeLimit: 180,
        category: 'React',
      },
    ];
  }
}

export const aiService = new AIService();
