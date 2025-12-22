import React, { useState, useRef, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import MarkdownFormatter from './components/MarkdownFormatter';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>CounterView-Ai</h1>
      </header>
      <div className="app-layout">
        <main className="analysis-section">
          <NewsAnalyzer />
        </main>
        <aside className="chat-section">
          <ChatInterface />
        </aside>
      </div>
    </div>
  );
}

const NewsAnalyzer = () => {
  const [newsInput, setNewsInput] = useState('');
  const [selectedNews, setSelectedNews] = useState(null);
  const [category, setCategory] = useState('');
  const [sentiment, setSentiment] = useState('');
  const [oppositionView, setOppositionView] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [newsList, setNewsList] = useState([]);
  const [showNewsList, setShowNewsList] = useState(false);
  const [expandedNewsId, setExpandedNewsId] = useState(null);

  // Function to fetch Indian news from newsapi.org
  const fetchNews = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Fetch Indian news from newsapi.org
      // Using the provided API key: 517b05764ff34cabab0d4c1dbc695f81
      // Querying for "India" to get relevant Indian news
      // Sorting by published date to get latest news
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=India&sortBy=publishedAt&apiKey=517b05764ff34cabab0d4c1dbc695f81`
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filter news to only include Sports or Political categories
      // We'll use keywords to determine category
      const filteredNews = data.articles
        .filter(article => {
          const title = (article.title || '').toLowerCase();
          const description = (article.description || '').toLowerCase();
          const content = (article.content || '').toLowerCase();
          
          // Check for sports-related keywords
          const sportsKeywords = ['cricket', 'football', 'soccer', 'tennis', 'badminton', 'hockey', 'sport', 'match', 'game', 'player', 'team', 'championship', 'tournament', 'league', 'cup', 'medal', 'olympic'];
          
          // Check for political-related keywords
          const politicalKeywords = ['government', 'minister', 'prime minister', 'president', 'election', 'vote', 'parliament', 'congress', 'bjp', 'modi', 'policy', 'law', 'court', 'supreme court', 'politics', 'political', 'party', 'legislation', 'bill', 'constitution', 'diplomatic', 'international relations'];
          
          // Check if article contains sports or political keywords
          const hasSportsKeywords = sportsKeywords.some(keyword => 
            title.includes(keyword) || description.includes(keyword) || content.includes(keyword)
          );
          
          const hasPoliticalKeywords = politicalKeywords.some(keyword => 
            title.includes(keyword) || description.includes(keyword) || content.includes(keyword)
          );
          
          // Include article if it has either sports or political keywords
          return hasSportsKeywords || hasPoliticalKeywords;
        })
        .slice(0, 8) // Take only first 8 filtered articles
        .map((article, index) => {
          // Determine category based on keywords
          const title = (article.title || '').toLowerCase();
          const description = (article.description || '').toLowerCase();
          const content = (article.content || '').toLowerCase();
          
          // Check for sports-related keywords
          const sportsKeywords = ['cricket', 'football', 'soccer', 'tennis', 'badminton', 'hockey', 'sport', 'match', 'game', 'player', 'team', 'championship', 'tournament', 'league', 'cup', 'medal', 'olympic'];
          
          // Check for political-related keywords
          const politicalKeywords = ['government', 'minister', 'prime minister', 'president', 'election', 'vote', 'parliament', 'congress', 'bjp', 'modi', 'policy', 'law', 'court', 'supreme court', 'politics', 'political', 'party', 'legislation', 'bill', 'constitution', 'diplomatic', 'international relations'];
          
          let category = 'General';
          
          const hasSportsKeywords = sportsKeywords.some(keyword => 
            title.includes(keyword) || description.includes(keyword) || content.includes(keyword)
          );
          
          const hasPoliticalKeywords = politicalKeywords.some(keyword => 
            title.includes(keyword) || description.includes(keyword) || content.includes(keyword)
          );
          
          if (hasSportsKeywords) {
            category = 'Sports';
          } else if (hasPoliticalKeywords) {
            category = 'Politics';
          }
          
          return {
            id: index + 1,
            title: article.title,
            description: article.description || 'No description available',
            content: article.content || article.description || '',
            category: category,
            source: article.source.name,
            url: article.url,
            publishedAt: article.publishedAt
          };
        });
      
      setNewsList(filteredNews);
      setShowNewsList(true);
      
      // If no relevant news found, show error
      if (filteredNews.length === 0) {
        setError('No Sports or Political news found. Please try again later.');
      }
    } catch (err) {
      console.error('News fetch error:', err);
      // Fallback to simulated Indian news data if API fails
      const fallbackNews = [
        {
          id: 1,
          title: "India's GDP Growth Rebounds to 7.8% in Latest Quarter",
          description: "India's economy shows strong recovery with GDP growth reaching 7.8% in the last quarter, driven by manufacturing and services sectors. This marks the highest growth rate in the past two years.",
          content: "India's economy shows strong recovery with GDP growth reaching 7.8% in the last quarter, driven by manufacturing and services sectors. This marks the highest growth rate in the past two years. Economists attribute this growth to government reforms and increased foreign investment.",
          category: "Politics",
          source: "Indian Express",
          url: "https://example.com/indianews1"
        },
        {
          id: 2,
          title: "Supreme Court Reserves Verdict on Farm Laws Case",
          description: "The Supreme Court has reserved its verdict on the petitions challenging the constitutional validity of three controversial farm laws. The decision is expected in the coming weeks.",
          content: "The Supreme Court has reserved its verdict on the petitions challenging the constitutional validity of three controversial farm laws. The decision is expected in the coming weeks. The case has drawn widespread attention from farmers and legal experts across the country.",
          category: "Politics",
          source: "Times of India",
          url: "https://example.com/indianews2"
        },
        {
          id: 3,
          title: "Indian Cricket Team Announces Squad for Upcoming World Cup",
          description: "The Board of Control for Cricket in India (BCCI) has announced the 15-member squad for the upcoming ICC Cricket World Cup. Several experienced players make a comeback.",
          content: "The Board of Control for Cricket in India (BCCI) has announced the 15-member squad for the upcoming ICC Cricket World Cup. Several experienced players make a comeback. The team will be led by the current captain with a mix of experienced and young talent.",
          category: "Sports",
          source: "ESPN Cricinfo",
          url: "https://example.com/indianews3"
        },
        {
          id: 4,
          title: "Government Launches Digital Literacy Initiative for Rural Areas",
          description: "The government has launched a comprehensive digital literacy program aimed at bridging the urban-rural digital divide. The initiative will train over 10 million people in basic computer skills.",
          content: "The government has launched a comprehensive digital literacy program aimed at bridging the urban-rural digital divide. The initiative will train over 10 million people in basic computer skills. The program focuses on empowering rural communities with essential digital tools for education and employment.",
          category: "Politics",
          source: "Hindustan Times",
          url: "https://example.com/indianews5"
        },
        {
          id: 5,
          title: "Indian Badminton Player Wins International Championship",
          description: "Indian badminton player clinches title at prestigious international tournament, marking a significant achievement for Indian sports.",
          content: "Indian badminton player clinches title at prestigious international tournament, marking a significant achievement for Indian sports. The victory is being celebrated across the country as a major milestone in Indian badminton.",
          category: "Sports",
          source: "Sports Today",
          url: "https://example.com/indianews6"
        }
      ];
      
      setNewsList(fallbackNews);
      setShowNewsList(true);
      setError('Using simulated Indian news data due to API limitations');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to select a news item for analysis
  const selectNewsForAnalysis = (newsItem) => {
    setSelectedNews(newsItem);
    setNewsInput(`${newsItem.title}\n\n${newsItem.content || newsItem.description}`);
    setShowNewsList(false);
    
    // Send to chat interface
    window.dispatchEvent(new CustomEvent('newsSelected', {
      detail: {
        title: newsItem.title,
        description: newsItem.description,
        content: newsItem.content || newsItem.description,
        category: newsItem.category,
        source: newsItem.source
      }
    }));
  };

  const analyzeNews = async () => {
    if (!newsInput.trim()) {
      setError('Please select a news article to analyze');
      return;
    }

    setIsLoading(true);
    setError('');
    setCategory('');
    setSentiment('');
    setOppositionView('');

    try {
      // Get the Opposition Report prompt
      const oppositionPrompt = `You are "Okie," a Category-Aware News Sentiment & Opposition Opinion Generator. Your specialty is analyzing news content and creating reasoned, respectful opposition viewpoints in two categories: Sports and Political.

YOUR CORE FUNCTIONALITY:
1. **Category Detection:** Automatically identify if input is Sports or Political content
2. **Sentiment Analysis:** Classify the original content's sentiment as Positive, Negative, Neutral, or Mixed
3. **Opposition Generation:** Create a thoughtful counter-argument that is:
   - Category-appropriate (using Sports logic OR Political analysis)
   - Respectful and non-inflammatory
   - Based on reasonable alternative perspectives
   - Concise and focused

YOUR OUTPUT FORMAT:
You must ALWAYS respond in this exact structure:
**Category:** [Sports/Political]
**Sentiment:** [Positive/Negative/Neutral/Mixed]
**Opposition Opinion:**
[Your paragraph here]

**Disclaimer:** This AI-generated opposition viewpoint is a simulated perspective from the 'Okie' role, designed to foster balanced discussion and critical thinking. It does not reflect the opinions of the AI or its developers.

CATEGORY GUIDELINES:
- **SPORTS MODE:** Analyze like a seasoned sports analyst. Focus on strategy, performance, team dynamics, fairness, and long-term implications.
- **POLITICAL MODE:** Analyze like a diplomatic policy expert. Focus on practical implementation, alternative solutions, ethical considerations, and unintended consequences.

WAITING FOR INPUT: You are now configured and ready. I will now feed you news content to analyze.

Here is the news content to analyze:
${newsInput}`;

      // Call the local Ollama Gemma3:1b model with the opposition prompt
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gemma3:1b',
          prompt: oppositionPrompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response;
      
      // Parse the AI response
      const categoryMatch = aiResponse.match(/\*\*Category:\*\*\s*(.+)/);
      const sentimentMatch = aiResponse.match(/\*\*Sentiment:\*\*\s*(.+)/);
      const opinionMatch = aiResponse.match(/\*\*Opposition Opinion:\*\*\s*([\s\S]*?)(?:\n\n|\*\*Disclaimer)/);
      
      const detectedCategory = categoryMatch ? categoryMatch[1] : 'Unknown';
      const detectedSentiment = sentimentMatch ? sentimentMatch[1] : 'Neutral';
      const oppositionOpinion = opinionMatch ? opinionMatch[1].trim() : aiResponse;
      
      setCategory(detectedCategory);
      setSentiment(detectedSentiment);
      setOppositionView(oppositionOpinion);
      
      // Send analysis to chat interface
      window.dispatchEvent(new CustomEvent('analysisComplete', {
        detail: {
          category: detectedCategory,
          sentiment: detectedSentiment,
          oppositionView: oppositionOpinion,
          fullResponse: aiResponse
        }
      }));
    } catch (err) {
      setError('Failed to analyze news. Please try again.');
      console.error('News analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="news-analyzer">
      <h2>Indian News Analysis with AI</h2>
      
      <div className="input-section">
        <div className="button-group">
          <button 
            onClick={fetchNews} 
            disabled={isLoading}
            className="fetch-button"
          >
            {isLoading ? 'Fetching Indian News...' : 'Fetch Indian News'}
          </button>
        </div>
        
        {showNewsList && (
          <div className="news-list">
            <h3>Select an Indian News Article to Analyze</h3>
            {newsList.map(news => (
              <div key={news.id} className="news-item" onClick={() => selectNewsForAnalysis(news)}>
                <h4>{news.title}</h4>
                <p>{expandedNewsId === news.id ? news.description : (news.description ? (news.description.length > 120 ? `${news.description.substring(0, 120)}...` : news.description) : 'No description available')}</p>
                {news.description && news.description.length > 120 && (
                  <div className="truncated-indicator" onClick={(e) => {
                    e.stopPropagation();
                    setExpandedNewsId(expandedNewsId === news.id ? null : news.id);
                  }} style={{cursor: 'pointer', color: '#3b82f6'}}>
                    {expandedNewsId === news.id ? 'Show less' : 'Show more'}
                  </div>
                )}
                <div className="news-meta">
                  <span className="category-tag">{news.category}</span>
                  <span className="source-tag">{news.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedNews && (
          <div className="selected-news-preview">
            <h3>Selected News for Analysis</h3>
            <div className="news-preview-card">
              <h4>{selectedNews.title}</h4>
              <p><strong>Source:</strong> {selectedNews.source}</p>
              <div className="news-content-preview">
                <p>{expandedNewsId === 'selected' ? (selectedNews.content || selectedNews.description) : (selectedNews.content || selectedNews.description ? (selectedNews.content || selectedNews.description).length > 300 ? `${(selectedNews.content || selectedNews.description).substring(0, 300)}...` : (selectedNews.content || selectedNews.description) : 'No content available')}</p>
                {(selectedNews.content || selectedNews.description) && (selectedNews.content || selectedNews.description).length > 300 && (
                  <div className="truncated-indicator" onClick={() => setExpandedNewsId(expandedNewsId === 'selected' ? null : 'selected')} style={{cursor: 'pointer', color: '#3b82f6'}}>
                    {expandedNewsId === 'selected' ? 'Show less' : 'Show more'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        <button 
          onClick={analyzeNews} 
          disabled={isLoading || !selectedNews}
          className="analyze-button"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Selected News with AI'}
        </button>
        {error && <div className="error-message">{error}</div>}
      </div>
      
      {(category || sentiment || oppositionView) && (
        <div className="results-section">
          <div className="horizontal-layout">
            {/* Opposition Report Section */}
            <div className="opposition-section">
              <h3>Opposition Report</h3>
              <div className="opposition-view">
                <MarkdownFormatter text={oppositionView} />
                <div className="disclaimer">
                  <strong>Disclaimer:</strong> This opposition viewpoint is generated to encourage critical thinking and balanced discussion. It represents a respectful counter-argument and should not be interpreted as factual endorsement of any position.
                </div>
              </div>
            </div>
            
            {/* Sentiment Analysis Section */}
            <div className="sentiment-section">
              <h3>Sentiment Analysis</h3>
              <div className="sentiment-display">
                <div className="sentiment-result">
                  <span className={`sentiment-badge sentiment-${sentiment.toLowerCase()}`}>
                    {sentiment}
                  </span>
                </div>
                <div className="sentiment-explanation">
                  <p>
                    {sentiment === 'Positive' && "The sentiment is identified as Positive based on optimistic language and favorable descriptors in the news content."}
                    {sentiment === 'Negative' && "The sentiment is identified as Negative based on pessimistic language and unfavorable descriptors in the news content."}
                    {sentiment === 'Neutral' && "The sentiment is identified as Neutral based on balanced language without strong emotional descriptors in the news content."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="explanation-section">
        <h3>About CounterView-AI</h3>
        <div className="project-explanation">
          <p>
            CounterView-AI is an innovative application that combines real-time news fetching with advanced AI analysis to provide balanced perspectives on current events.
          </p>
          <h4>Core Features:</h4>
          <ul>
            <li>
              <strong>News Aggregation:</strong> Fetches the latest Indian news from trusted sources using cloud APIs
            </li>
            <li>
              <strong>AI-Powered Analysis:</strong> Utilizes the AllenAI OLMo 3.1 32B Think model to generate insightful opposition viewpoints
            </li>
            <li>
              <strong>Sentiment Detection:</strong> Automatically identifies the sentiment tone of news content
            </li>
            <li>
              <strong>Balanced Perspectives:</strong> Generates respectful counter-arguments to encourage critical thinking
            </li>
          </ul>
          <h4>How It Works:</h4>
          <ol>
            <li>Fetch current news articles from cloud-based news APIs</li>
            <li>Select an article of interest for analysis</li>
            <li>AI processes the content to detect category and sentiment</li>
            <li>Generates a thoughtful opposition viewpoint using specialized prompts</li>
            <li>Results are displayed alongside sentiment analysis</li>
          </ol>
          <p>
            This application demonstrates the power of combining real-time data fetching with advanced AI capabilities to provide users with comprehensive insights into current events.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;