export const providers = [
  { 
    id: 1, 
    name: "Dawit Bekele", 
    category: "Tour Guide", 
    languages: ["English", "Amharic"], 
    price: 50, 
    available: true, 
    photo: "/placeholder.jpg",
    description: "Experienced tour guide with deep knowledge of Ethiopian history and culture."
  },
  { 
    id: 2, 
    name: "Sara Tadesse", 
    category: "Translator", 
    languages: ["English", "Amharic", "French"], 
    price: 30, 
    available: true, 
    photo: "/placeholder.jpg",
    description: "Professional translator fluent in multiple languages."
  },
  { 
    id: 3, 
    name: "Yonas Haile", 
    category: "Driver", 
    languages: ["Amharic"], 
    price: 20, 
    available: false, 
    photo: "/placeholder.jpg",
    description: "Reliable driver with extensive knowledge of local routes."
  },
  { 
    id: 4, 
    name: "Meron Alemu", 
    category: "Resort Guide", 
    languages: ["English", "Amharic"], 
    price: 75, 
    available: true, 
    photo: "/placeholder.jpg",
    description: "Luxury resort guide specializing in premium experiences."
  },
];

export const mockResponses = [
  { 
    trigger: "tour", 
    reply: "I found some great tour guides available today!", 
    providers: [1, 4] 
  },
  { 
    trigger: "translator", 
    reply: "Here are available translators right now:", 
    providers: [2] 
  },
  { 
    trigger: "driver", 
    reply: "I can help you find a driver. Here are your options:", 
    providers: [3] 
  },
  { 
    trigger: "resort", 
    reply: "Here are some luxury resort guides available:", 
    providers: [4] 
  },
  { 
    reply: "Here are some services that might help you tonight:", 
    providers: [1, 2] 
  },
];

export const pastConversations = [
  {
    id: 1,
    title: "Tour Guide for Addis",
    lastMessage: "Thanks for the recommendations!",
    timestamp: "2 hours ago",
    messages: [
      { id: 1, sender: "user" as const, text: "I need a tour guide for Addis Ababa" },
      { id: 2, sender: "ai" as const, text: "I found some great tour guides available today!", providers: [1, 4] },
      { id: 3, sender: "user" as const, text: "Thanks for the recommendations!" }
    ]
  },
  {
    id: 2,
    title: "Airport Transfer",
    lastMessage: "See you tomorrow",
    timestamp: "Yesterday",
    messages: [
      { id: 1, sender: "user" as const, text: "Need a driver for airport pickup" },
      { id: 2, sender: "ai" as const, text: "I can help you find a driver. Here are your options:", providers: [3] },
      { id: 3, sender: "user" as const, text: "See you tomorrow" }
    ]
  },
  {
    id: 3,
    title: "Restaurant Translation",
    lastMessage: "Perfect, thank you!",
    timestamp: "2 days ago",
    messages: [
      { id: 1, sender: "user" as const, text: "Looking for a translator for dinner" },
      { id: 2, sender: "ai" as const, text: "Here are available translators right now:", providers: [2] },
      { id: 3, sender: "user" as const, text: "Perfect, thank you!" }
    ]
  }
];

export const suggestedPrompts = [
  "Find me a tour guide",
  "What can I do tonight?", 
  "I need a driver",
  "Translation services",
  "Best resorts nearby",
  "Local experiences"
];
