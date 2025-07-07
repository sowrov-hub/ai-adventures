
import React, { useState, useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ModuleKey, Message, ChatState, LessonData, QuizData } from './types';
import { WelcomeIcon, PromptIcon, ImageIcon, StoryIcon, ArtIcon, CodeIcon, SchoolIcon, SparklesIcon, BrainIcon, DownloadIcon, RobotIcon, CarIcon, DollIcon, BikeIcon, BooksIcon, PenIcon, MenuIcon, CloseIcon, LockIcon, ChatBubbleIcon, CopyIcon, CheckIcon } from './components/icons';
import Typewriter from './components/Typewriter';
import Spinner from './components/Spinner';
import * as geminiService from './services/geminiService';
import type { Chat } from '@google/genai';


// --- MODULE COMPONENTS (defined in the same file for simplicity) ---

const Welcome: React.FC = () => (
    <div className="relative w-full h-full flex flex-col justify-center items-center text-center p-4 sm:p-8 overflow-hidden">
        {/* Decorations */}
        <div className="absolute top-5 left-2 sm:left-10 opacity-70">
            <div className="transform -rotate-12">
                <div className="animate-float" style={{animationDelay: '0s'}}>
                    <RobotIcon className="w-16 h-16 sm:w-20 sm:h-20 text-blue-400" />
                </div>
            </div>
        </div>
        <div className="absolute top-1/4 right-2 sm:right-8 opacity-70">
            <div className="transform rotate-[20deg]">
                <div className="animate-float" style={{animationDelay: '0.5s'}}>
                    <CarIcon className="w-20 h-20 sm:w-24 sm:h-24 text-red-400" />
                </div>
            </div>
        </div>
         <div className="absolute bottom-1/4 left-1 sm:left-5 opacity-70">
            <div className="transform rotate-12">
                <div className="animate-float" style={{animationDelay: '1s'}}>
                     <DollIcon className="w-16 h-16 sm:w-20 sm:h-20 text-pink-400" />
                </div>
            </div>
        </div>
        <div className="absolute bottom-10 right-1/4 opacity-70">
            <div className="transform -rotate-6">
                 <div className="animate-float" style={{animationDelay: '1.5s'}}>
                    <BikeIcon className="w-20 h-20 sm:w-28 sm:h-28 text-green-400" />
                </div>
            </div>
        </div>
        <div className="absolute bottom-5 left-1/3 opacity-70">
            <div className="transform rotate-3">
                 <div className="animate-float" style={{animationDelay: '0.2s'}}>
                    <BooksIcon className="w-16 h-16 sm:w-20 sm:h-20 text-orange-400" />
                 </div>
            </div>
        </div>
        <div className="absolute top-10 right-1/3 opacity-70">
            <div className="transform -rotate-45">
                 <div className="animate-float" style={{animationDelay: '0.8s'}}>
                    <PenIcon className="w-12 h-12 sm:w-16 sm:h-16 text-indigo-400" />
                </div>
            </div>
        </div>

        <div className="z-10 bg-gray-900/60 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-purple-500/30">
            <h1 className="text-3xl sm:text-5xl font-bold text-yellow-300 mb-4">Welcome to AI Adventure Land!</h1>
            <p className="text-lg sm:text-xl text-gray-200 max-w-2xl mx-auto">
                Hi there, future AI explorer! I'm Gemi, your friendly guide. Ready to go on an amazing adventure and learn about Artificial Intelligence? Pick a fun activity from the menu to get started!
            </p>
        </div>
    </div>
);

const PromptExample: React.FC<{children: ReactNode}> = ({children}) => (
    <div className="bg-gray-900/70 border border-purple-400/50 rounded-lg p-3 my-4">
        <p className="text-sm text-purple-300 font-semibold mb-2">Example Prompt:</p>
        <code className="text-gray-200 text-sm sm:text-base">{children}</code>
    </div>
);

const lessons: LessonData[] = [
    {
        title: "What is a Prompt?",
        content: () => (
            <>
                <p>Welcome to your first lesson! 🎉 A "prompt" is just a fancy word for the instructions you give to an AI. Think of the AI as a super-smart robot helper. It can draw, write, and code, but it needs you to tell it what to do!</p>
                <p className="mt-4">Being good at prompting is like learning how to give the best, clearest instructions so your robot helper understands you perfectly every time. The better your instructions, the better the AI's creation will be!</p>
                <PromptExample>Tell me a fun fact about space.</PromptExample>
            </>
        ),
        quiz: {
            question: "What is a 'prompt'?",
            options: ["A special robot dance", "A type of computer bug", "Instructions you give to an AI", "A new video game"],
            correctAnswerIndex: 2,
            explanation: "That's right! A prompt is simply a command or question you give to an AI to tell it what to do."
        }
    },
    {
        title: "The Magic Words for Images",
        content: () => (
            <>
                <p>Want an AI to draw something? You need to be a super good describer! 👩‍🎨 The best image prompts include:</p>
                <ul className="list-disc list-inside mt-2 text-gray-300 space-y-2">
                    <li><b>Subject:</b> What is the main thing in the picture? (e.g., a dragon, a robot)</li>
                    <li><b>Adjectives:</b> Describe your subject! (e.g., a <span className="text-pink-400">happy, sparkly</span> dragon)</li>
                    <li><b>Action:</b> What is the subject doing? (e.g., eating a taco)</li>
                    <li><b>Style:</b> How should it look? (e.g., cartoon style, watercolor painting)</li>
                </ul>
                <PromptExample>A happy, sparkly dragon eating a giant taco, cartoon style.</PromptExample>
            </>
        ),
        quiz: {
            question: "Which of these is the MOST descriptive prompt for generating an image?",
            options: ["A cat", "A drawing of a cat", "A fluffy orange cat sleeping on a pile of books, digital art", "Cat picture"],
            correctAnswerIndex: 2,
            explanation: "Exactly! The best prompts are super descriptive, telling the AI the subject, what it's doing, and the style."
        }
    },
    {
        title: "Let's Write a Story",
        content: () => (
            <>
                <p>You can start an amazing story with just one prompt. To get the best story, tell the AI the key ingredients:</p>
                 <ul className="list-disc list-inside mt-2 text-gray-300 space-y-2">
                    <li><b>Character:</b> Who is the story about? (e.g., a brave little squirrel)</li>
                    <li><b>Setting:</b> Where does it happen? (e.g., in a magical forest)</li>
                    <li><b>Plot:</b> What is the adventure? (e.g., who is looking for a legendary giant acorn)</li>
                </ul>
                <p className="mt-4">Try giving the AI these pieces and see what adventure it creates for you! Then you can continue the story together in the Story Time module.</p>
                <PromptExample>Write a short story about a brave little squirrel named Squeaky who lives in a magical forest and is looking for the legendary Giant Acorn of Wisdom.</PromptExample>
            </>
        ),
        quiz: {
            question: "What are the three key ingredients for a good story prompt?",
            options: ["Character, Setting, and Plot", "Beginning, Middle, and End", "Action, Comedy, and Drama", "Pictures, Sounds, and Words"],
            correctAnswerIndex: 0,
            explanation: "You got it! Giving the AI a Character, Setting, and Plot is the secret to starting an awesome story."
        }
    },
    {
        title: "AI, the Math Whiz",
        content: () => (
            <>
                <p>Stuck on a math problem? 🧠 An AI can be a great helper, but it needs the *exact* problem. Don't just say "help me with math."</p>
                <p className="mt-4">Always give it the full problem, just like it's written in your book. You can even ask it to explain the steps to solve it!</p>
                <PromptExample>If a pizza has 8 slices and I eat 3, what fraction of the pizza is left? Explain how you got the answer.</PromptExample>
            </>
        ),
        quiz: {
            question: "What's the best way to ask an AI for help with a math problem?",
            options: ["'I'm bad at math'", "'Help me with homework'", "'Can you do math?'", "'What is 58 + 93? Explain the steps.'"],
            correctAnswerIndex: 3,
            explanation: "Perfect! Giving the AI the exact problem and asking for an explanation is the most helpful way to learn."
        }
    },
    {
        title: "Chatting with AI",
        content: () => (
            <>
                <p>Sometimes you just want to talk or ask questions. You can chat with an AI like Gemini or ChatGPT. The secret is to ask clear questions. 💬</p>
                <p className="mt-4">If you don't get the answer you want, try asking in a different way. You can also ask follow-up questions to learn more!</p>
                <p className="mt-4 font-bold">First Question:</p>
                <PromptExample>Why is the sky blue?</PromptExample>
                <p className="mt-4 font-bold">Follow-up Question:</p>
                <PromptExample>Okay, but why is the sky red or orange during a sunset?</PromptExample>
            </>
        )
    },
    {
        title: "Supercharged Prompts",
        content: () => (
            <>
                <p>Ready for a power-up? 🚀 You can make your prompts even better by telling the AI to act like someone or something. This is called setting a "persona."</p>
                <p className="mt-4">When you do this, the AI will answer in the style of that character. It's a fun way to get creative answers!</p>
                <PromptExample>Act like a pirate and explain why volcanoes erupt.</PromptExample>
                <PromptExample>You are a grumpy cat. Write a poem about why rain is annoying.</PromptExample>
            </>
        )
    },
     {
        title: "Making Movies with Words",
        content: () => (
            <>
                <p>Did you know some AIs, like Veo, can create videos from words? 🎬 It's like image generation but for movies! You describe a scene and what's happening in it.</p>
                <p className="mt-4">For video, you need to describe the movement. What is the camera doing? What are the characters doing?</p>
                <PromptExample>A baby elephant playfully chasing a butterfly through a field of tall grass, sunny day, cinematic shot.</PromptExample>
                <PromptExample>A futuristic car flying through a city with glowing buildings at night, camera follows the car from behind.</PromptExample>
            </>
        )
    },
    {
        title: "From Idea to Movie!",
        content: () => (
            <>
                <p>Let's put it all together to plan a mini-movie! 🍿 Here’s a simple way to do it:</p>
                <ol className="list-decimal list-inside mt-2 text-gray-300 space-y-2">
                    <li><b>Step 1: Get a Story.</b> Use the story prompt skill to get a short story from an AI.</li>
                    <li><b>Step 2: Break it Down.</b> Read the story and break it into 2-3 main "scenes."</li>
                    <li><b>Step 3: Write Video Prompts.</b> For each scene, write a video prompt describing what happens, just like in the last lesson!</li>
                </ol>
                <p className="mt-4">Now you have a "storyboard" made of prompts that could be used to create an AI-generated video!</p>
            </>
        )
    },
    {
        title: "Your School Superhero",
        content: () => (
            <>
                <p>The AI can be an amazing helper for school projects. It's great at brainstorming ideas, explaining tricky topics, and even summarizing long articles.</p>
                <p className="mt-4">The trick is to be specific about what you need. Instead of just "help me with my project," tell it the subject and what you need help with.</p>
                <PromptExample>I'm doing a school project on the Amazon rainforest. Can you give me 5 interesting ideas for what to focus on?</PromptExample>
                <PromptExample>Explain how photosynthesis works like you're talking to a 10-year-old.</PromptExample>
            </>
        )
    },
     {
        title: "The Prompt Playground",
        content: () => (
            <>
                <p>You've learned so much! 🏆 You now know the secrets to writing amazing prompts for all kinds of tasks. The only thing left to do is practice!</p>
                <p className="mt-4">Go to the other modules like the <b className="text-blue-400">Prompt Sandbox</b> or <b className="text-teal-400">Image Magic</b>. Try out your new skills! See what amazing things you can create.</p>
                <p className="mt-4">The world of AI is your playground. Have fun exploring! ✨</p>
            </>
        )
    },
];

const Quiz: React.FC<{ quizData: QuizData, onPass: () => void }> = ({ quizData, onPass }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const isCorrect = selectedAnswer === quizData.correctAnswerIndex;

    const handleSubmit = () => {
        if (selectedAnswer === null) return;
        setIsSubmitted(true);
        if (selectedAnswer === quizData.correctAnswerIndex) {
            setTimeout(onPass, 1500); // Wait a bit before moving to next lesson
        }
    };

    return (
        <div className="mt-8 border-t-2 border-purple-400/30 pt-6">
            <h4 className="text-xl font-bold text-yellow-300 mb-4">Pop Quiz! 🧠</h4>
            <p className="text-gray-200 mb-4">{quizData.question}</p>
            <div className="space-y-3 mb-4">
                {quizData.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => !isSubmitted && setSelectedAnswer(index)}
                        className={`w-full text-left p-3 rounded-md transition-all border-2 ${
                            !isSubmitted
                                ? (selectedAnswer === index ? 'bg-purple-500 border-purple-400' : 'bg-gray-700 border-gray-600 hover:bg-gray-600')
                                : (index === quizData.correctAnswerIndex ? 'bg-green-500/80 border-green-400' : (selectedAnswer === index ? 'bg-red-500/80 border-red-400' : 'bg-gray-700 border-gray-600'))
                        }`}
                        disabled={isSubmitted}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {!isSubmitted ? (
                <button onClick={handleSubmit} disabled={selectedAnswer === null} className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-gray-900 font-bold py-2 px-4 rounded-lg">
                    Check Answer
                </button>
            ) : (
                <div className={`p-3 rounded-lg text-center font-semibold ${isCorrect ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                    {isCorrect ? 'Awesome! You got it right!' : 'Not quite, try the next lesson again! The correct answer is highlighted.'}
                    {isCorrect && <p className="text-sm font-normal mt-1">{quizData.explanation}</p>}
                </div>
            )}
        </div>
    );
};


const PromptEngineeringCourse: React.FC<{unlockedLessons: number, onLessonPass: () => void}> = ({ unlockedLessons, onLessonPass }) => {
    const [activeLessonIndex, setActiveLessonIndex] = useState(0);
    const ActiveLesson = lessons[activeLessonIndex];
    const isCurrentLessonPassed = activeLessonIndex < unlockedLessons - 1;

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">Prompt Engineering Course</h2>
            <p className="text-gray-300 mb-6">Learn how to talk to AI and unlock your creative superpowers! Pass the quiz to unlock the next lesson.</p>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Lesson List */}
                <aside className="w-full md:w-1/3 bg-gray-800/30 p-4 rounded-lg border border-gray-700">
                    <ul className="space-y-2">
                        {lessons.map((lesson, index) => {
                            const isLocked = index >= unlockedLessons;
                            return (
                                <li key={index}>
                                    <button
                                        onClick={() => !isLocked && setActiveLessonIndex(index)}
                                        disabled={isLocked}
                                        className={`w-full text-left p-3 rounded-md transition-colors text-sm flex justify-between items-center ${
                                            activeLessonIndex === index
                                                ? 'bg-purple-600 font-bold text-white'
                                                : isLocked ? 'bg-gray-700/50 text-gray-500 cursor-not-allowed' : 'hover:bg-gray-700/50 text-gray-300'
                                        }`}
                                    >
                                        <span>Lesson {index + 1}: {lesson.title}</span>
                                        {isLocked && <LockIcon className="w-4 h-4 text-gray-400" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                {/* Lesson Content */}
                <section className="w-full md:w-2/3">
                    <div className="bg-gray-800/50 p-6 rounded-lg h-full">
                        <h3 className="text-2xl font-bold text-yellow-300 mb-4">{ActiveLesson.title}</h3>
                        <div className="text-gray-200 space-y-4">
                            <ActiveLesson.content />
                        </div>
                        {ActiveLesson.quiz && !isCurrentLessonPassed && <Quiz quizData={ActiveLesson.quiz} onPass={onLessonPass} />}
                    </div>
                </section>
            </div>
        </div>
    );
};


const GenericTextModule: React.FC<{ moduleInfo: { title: string, description: string, systemInstruction?: string } }> = ({ moduleInfo }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleSubmit = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setResult('');
        const response = await geminiService.generateText(prompt, moduleInfo.systemInstruction);
        setResult(response);
        setIsLoading(false);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">{moduleInfo.title}</h2>
            <p className="text-gray-300 mb-6">{moduleInfo.description}</p>
            <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your idea here..."
                className="w-full h-32 p-4 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-purple-400 focus:outline-none transition"
                disabled={isLoading}
            />
            <button
                onClick={handleSubmit}
                disabled={isLoading || !prompt}
                className="mt-4 w-full flex justify-center items-center gap-2 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:transform-none"
            >
                {isLoading ? 'Thinking...' : 'Go!'} <SparklesIcon className="w-5 h-5" />
            </button>
            <div className="mt-6 p-6 bg-gray-800/50 rounded-lg min-h-[10rem]">
                {isLoading && <Spinner />}
                {result && <Typewriter text={result} className="text-lg text-gray-200" />}
            </div>
        </div>
    );
};


const ImageModule: React.FC<{ moduleInfo: { title: string, description: string, basePrompt: string } }> = ({ moduleInfo }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!prompt || isLoading) return;
        setIsLoading(true);
        setImageUrl('');
        setError('');
        const fullPrompt = `${moduleInfo.basePrompt}: ${prompt}`;
        const result = await geminiService.generateImage(fullPrompt);
        if (result) {
            setImageUrl(result);
        } else {
            setError('Oh no! My digital paintbrush slipped. Could you try a different idea?');
        }
        setIsLoading(false);
    };

    const handleDownload = () => {
        if (!imageUrl) return;
        const link = document.createElement('a');
        link.href = imageUrl;
        const filename = `ai-adventure-${Date.now()}.jpeg`;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-2">{moduleInfo.title}</h2>
            <p className="text-gray-300 mb-6">{moduleInfo.description}</p>
            <div className="flex flex-col sm:flex-row gap-4">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., a friendly robot reading a book"
                    className="w-full p-4 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-teal-400 focus:outline-none transition"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !prompt}
                    className="flex-shrink-0 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:transform-none"
                >
                    {isLoading ? 'Creating...' : 'Generate'}
                </button>
            </div>
            <div className="mt-6 flex justify-center items-center bg-gray-800/50 rounded-lg min-h-[16rem] sm:min-h-[20rem] p-4 relative group">
                {isLoading && <Spinner />}
                {!isLoading && error && <p className="text-red-400 text-center">{error}</p>}
                {!isLoading && imageUrl && <img src={imageUrl} alt="Generated art" className="rounded-lg max-w-full max-h-[20rem] sm:max-h-[24rem] shadow-lg" />}
                {!isLoading && imageUrl && (
                     <button
                        onClick={handleDownload}
                        className="absolute bottom-4 right-4 bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full transition-opacity opacity-0 group-hover:opacity-100 flex items-center gap-2 shadow-lg"
                        aria-label="Download Image"
                    >
                        <DownloadIcon className="w-6 h-6" />
                        <span className="hidden sm:inline">Download</span>
                    </button>
                )}
            </div>
        </div>
    );
};

const StoryTimeModule: React.FC = () => {
    const [state, setState] = useState<ChatState>({
        chat: null,
        history: [],
        isLoading: false,
    });
    const [prompt, setPrompt] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const storySystemInstruction = "You are a master storyteller for kids. Start a fun, adventurous, and slightly silly story based on the user's prompt. After each part you write, end with an engaging question like 'What should happen next?' or 'Who do they meet now?'. Keep your story parts to 2-3 paragraphs.";
        const chatInstance = geminiService.initiateChat(storySystemInstruction);
        setState({
            chat: chatInstance,
            history: [{ sender: 'ai', text: 'Tell me what our story should be about! How about a brave knight, a silly dragon, or a magical unicorn?' }],
            isLoading: false,
        });
    }, []);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [state.history]);

    const handleSendMessage = async () => {
        if (!prompt || state.isLoading || !state.chat) return;

        const userMessage: Message = { sender: 'user', text: prompt };
        const currentPrompt = prompt;
        
        setState(prev => ({ ...prev, isLoading: true, history: [...prev.history, userMessage] }));
        setPrompt('');
        
        const response = await state.chat.sendMessage({ message: currentPrompt });
        
        const newAiMessage: Message = { sender: 'ai', text: response.text };
        setState(prev => ({ ...prev, isLoading: false, history: [...prev.history, newAiMessage] }));
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-3xl font-bold text-white mb-2">Story Time!</h2>
            <p className="text-gray-300 mb-4">Let's write a story together! You start, then I'll add to it. We can create an amazing adventure one step at a time.</p>
            <div className="flex-grow bg-gray-800/50 rounded-t-lg p-4 overflow-y-auto">
                {state.history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xl p-3 rounded-2xl mb-2 ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-white'}`}>
                            {msg.sender === 'ai' && index === state.history.length -1 && !state.isLoading ? 
                                <Typewriter text={msg.text} speed={30} /> : 
                                <p>{msg.text}</p>
                            }
                        </div>
                    </div>
                ))}
                {state.isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-xl p-3 rounded-2xl mb-2 bg-gray-600 text-white">
                            <div className="flex items-center gap-2">
                                <Spinner/> <span>Thinking of what happens next...</span>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
             <div className="flex gap-4 p-4 bg-gray-700/80 rounded-b-lg">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="What happens next?"
                    className="w-full p-3 rounded-lg bg-gray-600 text-white border-2 border-gray-500 focus:border-purple-400 focus:outline-none transition"
                    disabled={state.isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={state.isLoading || !prompt}
                    className="flex-shrink-0 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 disabled:transform-none"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gray-900/80 rounded-lg my-4 relative group">
            <div className="flex justify-between items-center px-4 py-2 bg-gray-700/50 rounded-t-lg">
                <span className="text-xs font-semibold text-gray-400">Code Example</span>
                <button 
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-xs font-semibold text-gray-300 hover:text-white transition"
                >
                    {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <CopyIcon className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="p-4 text-sm text-white overflow-x-auto">
                <code>{code.trim()}</code>
            </pre>
        </div>
    );
};

const CodeWizardsModule: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'lesson' | 'practice'>('lesson');
    
    // States for the practice tab
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ReactNode[]>([]);
  
    const systemInstruction = 'You are a helpful coding assistant for kids. You provide very simple, easy-to-understand code examples in Python or JavaScript, with clear explanations of what each line does. Always wrap code in markdown code blocks using ```.';
  
    const parseResponse = (text: string) => {
        const parts = text.split(/(```[\s\S]*?```)/g).filter(Boolean); // Split and remove empty strings
        return parts.map((part, index) => {
          if (part.startsWith('```')) {
            const codeContent = part.replace(/```(\w*\n)?/g, '').replace(/```/g, '');
            return <CodeBlock key={index} code={codeContent} />;
          } else {
            return <p key={index} className="my-2 text-gray-200">{part}</p>;
          }
        });
      };

    const handleSubmit = async () => {
      if (!prompt || isLoading) return;
      setIsLoading(true);
      setResult([]);
      const responseText = await geminiService.generateText(prompt, systemInstruction);
      const parsedResult = parseResponse(responseText);
      setResult(parsedResult);
      setIsLoading(false);
    };
  
    return (
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Code Wizards</h2>
        <p className="text-gray-300 mb-6">Ever wanted to speak computer language? Start with our lesson, then practice your skills!</p>
        
        <div className="flex border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab('lesson')}
            className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'lesson' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
          >
            What is Code?
          </button>
          <button
            onClick={() => setActiveTab('practice')}
            className={`py-2 px-4 font-semibold transition-colors ${activeTab === 'practice' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-white'}`}
          >
            Practice Coding
          </button>
        </div>
  
        <div>
          {activeTab === 'lesson' && (
            <div className="bg-gray-800/50 p-6 rounded-lg text-gray-200 space-y-4 animate-fade-in">
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">Code is a Recipe for Computers! 🍳</h3>
              <p>Imagine you're telling a robot how to make a peanut butter sandwich. You can't just say "make a sandwich." You have to give it super clear, step-by-step instructions: </p>
              <ol className="list-decimal list-inside bg-gray-900/70 p-4 rounded-md text-gray-300">
                  <li>1. Pick up a slice of bread.</li>
                  <li>2. Open the peanut butter jar.</li>
                  <li>3. Scoop some peanut butter with a knife.</li>
                  <li>4. Spread it on the bread.</li>
              </ol>
              <p><b className="text-green-400">Code is just like that!</b> It's a special language we use to give computers and robots very specific instructions to follow.</p>
              
              <h3 className="text-2xl font-bold text-yellow-300 mt-6 mb-4">What's It For? 🎮</h3>
              <p>Code is the magic behind almost everything you use on a screen! It builds your favorite video games, fun apps, and awesome websites. It tells the computer exactly what to do, from making a character jump in a game to showing a funny video.</p>
  
              <h3 className="text-2xl font-bold text-yellow-300 mt-6 mb-4">How Do You Write It? 🤔</h3>
              <p>Writing code is like solving a puzzle. You break a big task into tiny, logical steps. When you ask the AI to help you write code in the 'Practice' tab, you need to be a great explainer! Tell it exactly what you want the code to do. The clearer you are, the better the code will be.</p>
              <PromptExample>Write Python code that asks for my name and then says hello to me.</PromptExample>
            </div>
          )}
  
          {activeTab === 'practice' && (
            <div className="animate-fade-in">
              <p className="text-gray-300 mb-6">Tell the AI what you want to create with code. It can help you write simple games, website parts, or fun little programs!</p>
              <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Write Python code for a number guessing game'"
                  className="w-full h-32 p-4 rounded-lg bg-gray-700 text-white border-2 border-gray-600 focus:border-green-400 focus:outline-none transition"
                  disabled={isLoading}
              />
              <button
                  onClick={handleSubmit}
                  disabled={isLoading || !prompt}
                  className="mt-4 w-full flex justify-center items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:transform-none"
              >
                  {isLoading ? 'Writing Code...' : 'Generate Code'} <SparklesIcon className="w-5 h-5" />
              </button>
              <div className="mt-6 p-6 bg-gray-800/50 rounded-lg min-h-[10rem]">
                  {isLoading && <Spinner />}
                  {!isLoading && result.length > 0 && <div className="space-y-4">{result}</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    );
};

const GemiChatWindow: React.FC<{
    isOpen: boolean,
    onClose: () => void,
    chatState: ChatState,
    setChatState: React.Dispatch<React.SetStateAction<ChatState>>
}> = ({ isOpen, onClose, chatState, setChatState }) => {
    const [prompt, setPrompt] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [chatState.history]);

    const handleSendMessage = async () => {
        if (!prompt || chatState.isLoading || !chatState.chat) return;

        const userMessage: Message = { sender: 'user', text: prompt };
        const currentPrompt = prompt;
        
        setChatState(prev => ({ ...prev, isLoading: true, history: [...prev.history, userMessage] }));
        setPrompt('');
        
        const response = await chatState.chat.sendMessage({ message: currentPrompt });
        
        const newAiMessage: Message = { sender: 'ai', text: response.text };
        setChatState(prev => ({ ...prev, isLoading: false, history: [...prev.history, newAiMessage] }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-20 right-4 sm:right-6 md:right-8 z-50 w-[calc(100vw-2rem)] sm:w-96 h-[70vh] sm:h-[60vh] flex flex-col bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-purple-500/30">
            <header className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="font-bold text-lg text-yellow-300">Chat with Gemi</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <CloseIcon className="w-6 h-6"/>
                </button>
            </header>
            <div className="flex-grow p-4 overflow-y-auto">
                {chatState.history.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs md:max-w-sm p-3 rounded-2xl mb-2 ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-600 text-white'}`}>
                            {msg.sender === 'ai' && index === chatState.history.length -1 && !chatState.isLoading ? 
                                <Typewriter text={msg.text} speed={30} /> : 
                                <p className="text-sm sm:text-base">{msg.text}</p>
                            }
                        </div>
                    </div>
                ))}
                 {chatState.isLoading && (
                    <div className="flex justify-start">
                         <div className="max-w-xs p-3 rounded-2xl mb-2 bg-gray-600 text-white">
                            <div className="flex items-center gap-2">
                                <Spinner/> <span>Gemi is thinking...</span>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2 p-3 border-t border-gray-700">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask a question..."
                    className="w-full p-2 rounded-lg bg-gray-600 text-white border-2 border-gray-500 focus:border-purple-400 focus:outline-none transition text-sm"
                    disabled={chatState.isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                 <button
                    onClick={handleSendMessage}
                    disabled={chatState.isLoading || !prompt}
                    className="flex-shrink-0 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white font-bold p-2 rounded-lg transition-transform transform hover:scale-105 disabled:transform-none"
                >
                    <SparklesIcon className="w-5 h-5"/>
                </button>
            </div>
        </div>
    )
}


// --- MODULE DEFINITIONS ---

const MODULES: { [key in ModuleKey]?: { title: string; description: string; icon: ReactNode; color: string; component: React.FC<any>; props?: any } } = {
    [ModuleKey.WELCOME]: {
        title: 'Welcome!',
        description: 'Get started on your AI Adventure.',
        icon: <WelcomeIcon className="w-8 h-8" />,
        color: 'text-yellow-300',
        component: Welcome,
    },
    [ModuleKey.PROMPT_ENGINEERING_COURSE]: {
        title: 'Prompt Course',
        description: 'Learn the secrets to talking with AI!',
        icon: <BrainIcon className="w-8 h-8" />,
        color: 'text-yellow-400',
        component: PromptEngineeringCourse,
    },
    [ModuleKey.PROMPTING_FUN]: {
        title: 'Prompt Sandbox',
        description: 'Practice talking to an AI. Ask it a question or give it a command.',
        icon: <PromptIcon className="w-8 h-8" />,
        color: 'text-blue-400',
        component: GenericTextModule,
        props: { moduleInfo: { title: 'Prompt Sandbox', description: 'Practice talking to an AI. Ask it a question or give it a command.' } }
    },
    [ModuleKey.IMAGE_MAGIC]: {
        title: 'Image Magic',
        description: 'Turn your words into pictures! Describe something you imagine, and the AI will draw it for you.',
        icon: <ImageIcon className="w-8 h-8" />,
        color: 'text-teal-400',
        component: ImageModule,
        props: { moduleInfo: { title: 'Image Magic', description: 'Turn your words into pictures! Describe something you imagine, and the AI will draw it for you.', basePrompt: 'A vibrant, kid-friendly, cartoon-style image of' } }
    },
    [ModuleKey.STORY_TIME]: {
        title: 'Story Time',
        description: "Let's write a story together. You start with an idea, and we'll take turns building an adventure!",
        icon: <StoryIcon className="w-8 h-8" />,
        color: 'text-purple-400',
        component: StoryTimeModule,
    },
    [ModuleKey.ART_STUDIO]: {
        title: 'Art Studio',
        description: 'Become a digital artist! Create art in different styles like cartoon, watercolor, or pixel art.',
        icon: <ArtIcon className="w-8 h-8" />,
        color: 'text-pink-400',
        component: ImageModule,
        props: { moduleInfo: { title: 'Art Studio', description: 'Become a digital artist! Create art in different styles like cartoon, watercolor, or pixel art.', basePrompt: 'An artistic, kid-friendly image in the style of' } }
    },
    [ModuleKey.CODE_WIZARDS]: {
        title: 'Code Wizards',
        description: "Ever wanted to speak computer language? Ask the AI to write simple code snippets for you!",
        icon: <CodeIcon className="w-8 h-8" />,
        color: 'text-green-400',
        component: CodeWizardsModule,
    },
    [ModuleKey.SCHOOL_HELPER]: {
        title: 'School Helper',
        description: 'Got a tricky school question? The AI can help explain topics, brainstorm for projects, or summarize text.',
        icon: <SchoolIcon className="w-8 h-8" />,
        color: 'text-orange-400',
        component: GenericTextModule,
        props: { moduleInfo: { title: 'School Helper', description: 'Got a tricky school question? The AI can help explain topics, brainstorm for projects, or summarize text.', systemInstruction: 'You are a helpful and patient school tutor for kids. Explain concepts clearly and simply, as if you were explaining to a 10-year-old. Be encouraging and break down complex ideas into small, easy-to-digest parts.' } }
    },
};


// --- MAIN APP COMPONENT ---

const App: React.FC = () => {
  const [activeModuleKey, setActiveModuleKey] = useState<ModuleKey>(ModuleKey.WELCOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unlockedLessons, setUnlockedLessons] = useState(1);
  const [isGemiChatOpen, setIsGemiChatOpen] = useState(false);
  const [gemiChatState, setGemiChatState] = useState<ChatState>({ chat: null, history: [], isLoading: false });

  useEffect(() => {
    const gemiSystemInstruction = "You are Gemi, a super friendly and curious AI robot friend for kids. Your goal is to be a supportive and fun companion. You love jokes, fun facts, and asking kids about their day. You are NOT a tutor, just a friend to chat with. Keep your responses short, cheerful, and use lots of emojis! 🤖✨";
    const chatInstance = geminiService.initiateChat(gemiSystemInstruction);
    setGemiChatState({
        chat: chatInstance,
        history: [{ sender: 'ai', text: 'Hi there! I\'m Gemi! What are you up to today? Wanna hear a joke? 😄' }],
        isLoading: false
    });
  }, []);

  const handleLessonPass = () => {
    if (unlockedLessons < lessons.length) {
        setUnlockedLessons(prev => prev + 1);
    }
  };

  const renderActiveModule = () => {
    const activeModule = MODULES[activeModuleKey];
    if (!activeModule) return <Welcome />;
    
    const props = {
        ...activeModule.props,
        ...(activeModuleKey === ModuleKey.PROMPT_ENGINEERING_COURSE && { unlockedLessons, onLessonPass: handleLessonPass }),
    };

    const ModuleComponent = activeModule.component;
    return <ModuleComponent {...props} />;
  };

  const handleModuleSelect = (key: ModuleKey) => {
    setActiveModuleKey(key);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex md:overflow-hidden" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav className={`fixed md:static top-0 left-0 h-full w-72 bg-gray-800/60 backdrop-blur-lg p-4 border-r border-gray-700 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="flex items-center justify-between mb-8">
            <div className="text-2xl font-bold text-yellow-300 text-center flex items-center justify-center gap-2">
                <SparklesIcon className="w-8 h-8"/> AI Adventures
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                <CloseIcon className="w-7 h-7" />
            </button>
        </div>
        <ul className="space-y-2">
            {Object.entries(MODULES).map(([key, module]) => module && (
                <li key={key}>
                    <button
                        onClick={() => handleModuleSelect(key as ModuleKey)}
                        className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                            activeModuleKey === key
                                ? 'bg-purple-600 text-white shadow-lg'
                                : 'hover:bg-gray-700/50'
                        }`}
                    >
                        <span className={`${module.color} mr-4`}>{module.icon}</span>
                        <span className="font-semibold">{module.title}</span>
                    </button>
                </li>
            ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto" style={{ height: '100vh' }}>
        <header className="md:hidden sticky top-0 bg-gray-900/80 backdrop-blur-sm z-20 flex items-center p-4 shadow-md">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-200">
                <MenuIcon className="w-7 h-7" />
            </button>
            <h1 className="text-xl font-bold text-yellow-300 mx-auto">
                {MODULES[activeModuleKey]?.title || 'AI Adventures'}
            </h1>
            <div className="w-7"></div>
        </header>
        <div className="flex-1 p-4 sm:p-8">
            <div className="max-w-4xl mx-auto h-full">
                {renderActiveModule()}
            </div>
        </div>

        {/* Floating Chat Button and Window */}
        <button 
            onClick={() => setIsGemiChatOpen(prev => !prev)}
            className="fixed bottom-4 right-4 sm:right-6 md:right-8 z-40 bg-purple-500 hover:bg-purple-600 text-white rounded-full p-4 shadow-2xl transition-transform transform hover:scale-110"
            aria-label="Chat with Gemi"
        >
            <ChatBubbleIcon className="w-8 h-8" />
        </button>
        <GemiChatWindow 
            isOpen={isGemiChatOpen} 
            onClose={() => setIsGemiChatOpen(false)}
            chatState={gemiChatState}
            setChatState={setGemiChatState}
        />
      </main>
    </div>
  );
};

export default App;
