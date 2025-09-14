# Verb Tense Explorer - Beta Release

**An interactive web application for studying English grammar and verb tenses**

> ⚠️ **Beta Software Notice**: This is a beta release of the Verb Tense Explorer. While fully functional, the software may contain bugs or incomplete features. Use at your own discretion and report any issues you encounter.

> 🤖 **AI-Generated Content**: This project was created with assistance from AI technology. While the code has been tested, users should verify functionality and accuracy for their specific use cases.

## Overview

Verb Tense Explorer is a comprehensive, interactive website designed to help students and English language learners master verb conjugations across all major English tenses. The application provides an intuitive interface for exploring verb forms and interactive practice exercises to reinforce learning.

## Features

### 🔍 **Verb Explorer** (index.html)
- **Comprehensive Verb Database**: Extensive collection of English verbs with complete conjugation sets
- **Smart Search**: Real-time search functionality with highlighting
- **Advanced Filtering**: 
  - Filter by first letter (A-Z)
  - Filter by tense types (Simple, Continuous, Perfect, Perfect Continuous)
- **Multiple View Modes**: Switch between grid and list views
- **Tense Organization**: Verbs organized by tense categories for easy learning
- **Random Verb Generator**: Discover new verbs with the random button
- **Keyboard Shortcuts**:
  - `Ctrl+F` or `/` to focus search
  - `Escape` to clear search
  - `R` for random verb

### 🎯 **Practice Mode** (practice.html)
- **Identify the Tense**: Given a sentence, identify which tense is being used
- **Match the Tense**: Given a tense name, select the correct sentence example
- **Real-time Scoring**: Track your progress with accuracy and streak counters
- **Interactive Feedback**: Immediate feedback with correct/incorrect indicators
- **Performance Statistics**: Monitor your learning progress

### 📱 **Responsive Design**
- Mobile-friendly interface
- Optimized for tablets and desktop
- Touch-friendly controls

## Installation

1. **Download or Clone** the repository
2. **No build process required** - this is a pure HTML/CSS/JavaScript application
3. **Open index.html** in any modern web browser
4. **Ensure all files are in the same directory**:
   - `index.html` (main explorer page)
   - `practice.html` (practice exercises)
   - `script.js` (application logic and verb data)

## Usage

### Getting Started
1. Open `index.html` in your web browser
2. Browse the complete verb database
3. Use search and filters to find specific verbs
4. Click on any verb card to expand and see all tense forms
5. Navigate to Practice Mode for interactive exercises

### Search and Filtering
- **Search Bar**: Type any verb or sentence fragment
- **Alphabet Filters**: Click any letter to filter verbs
- **Tense Filters**: Filter by specific tense categories
- **Clear Button**: Reset all filters and search

### Practice Exercises
1. Click "Practice Mode" from the main page
2. Choose between two practice modes:
   - **Identify the Tense**: Read a sentence and select the correct tense
   - **Match the Tense**: Given a tense name, pick the correct example
3. Track your progress with the scoring system
4. Use "Change Mode" to switch between exercise types

## Technical Details

### File Structure
```
verb-tense-explorer/
├── index.html          # Main explorer interface
├── practice.html       # Practice mode interface  
├── script.js          # Application logic + verb database
├── README.md          # This file
└── LICENSE            # MIT License
```

### Browser Compatibility
- **Recommended**: Chrome 70+, Firefox 65+, Safari 12+, Edge 79+
- **Minimum**: Any browser with ES6 support
- **Mobile**: iOS Safari 12+, Android Chrome 70+

### Key Technologies
- **Pure HTML5/CSS3/JavaScript** - No external dependencies
- **CSS Grid & Flexbox** - Modern responsive layouts
- **ES6+ Features** - Modern JavaScript functionality
- **Local Storage** - Session persistence (planned feature)

## Data Structure

The verb database in `script.js` contains verbs in the following format:

```javascript
{
  "verb": "example",
  "simple-past": "I exampled...",
  "simple-present": "I example...",
  "simple-future": "I will example...",
  "continuous-past": "I was exampling...",
  "continuous-present": "I am exampling...",
  "continuous-future": "I will be exampling...",
  "perfect-past": "I had exampled...",
  "perfect-present": "I have exampled...",
  "perfect-future": "I will have exampled...",
  "perfect-continuous-past": "I had been exampling...",
  "perfect-continuous-present": "I have been exampling...",
  "perfect-continuous-future": "I will have been exampling..."
}
```

## Known Limitations (Beta)

- Practice mode statistics don't persist between sessions yet
- Limited to English verbs only
- No audio pronunciations (planned feature)
- Some irregular verbs may have incomplete conjugations
- Performance not optimized for extremely large datasets

## Contributing

This is a beta release. If you encounter issues:

1. **Report bugs** by documenting the issue, browser version, and steps to reproduce
2. **Suggest features** for future releases
3. **Test thoroughly** before using in educational settings
4. **Verify accuracy** of verb conjugations for critical applications

## Educational Use

### Suitable For:
- English as a Second Language (ESL) students
- Grammar review and practice
- Self-paced learning
- Classroom demonstrations
- Homeschool curriculum supplement

### Recommended Age Groups:
- Middle school students and above
- Adult language learners
- Teacher reference tool

## Disclaimer

This software is provided "as is" without warranty of any kind. While efforts have been made to ensure accuracy of the verb conjugations and grammar rules, users should verify information against authoritative grammar sources for critical applications.

The AI-assisted development process has been reviewed, but users should report any errors or inconsistencies they discover.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Version History

- **v1.0-beta** (Current): Initial beta release with core explorer and practice features

---

**Copyright © 2025 JD Jones. This project was developed with AI assistance.**