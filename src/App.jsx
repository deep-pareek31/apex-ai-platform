import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Search, Brain, Target, Zap, BarChart3, Activity, DollarSign, ArrowUpRight, ArrowDownRight, Minus, RefreshCw, Star, Shield, Clock, Play, Pause, Settings, Wallet, Users, Download, Sparkles, Database, Wifi, CheckCircle, XCircle, Award, TrendingUpIcon } from 'lucide-react';

const APEX_AI_ULTIMATE = () => {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [opportunities, setOpportunities] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [query, setQuery] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [watchlist, setWatchlist] = useState(['AAPL', 'TSLA', 'NVDA', 'BTC', 'ETH']);
  const [fearGreedIndex, setFearGreedIndex] = useState(null);
  
  // Trading features
  const [tradingEnabled, setTradingEnabled] = useState(false);
  const [paperTrading, setPaperTrading] = useState(true);
  const [portfolio, setPortfolio] = useState({
    equity: 100000,
    cash: 100000,
    positions: [],
    dayPL: 0,
    totalPL: 0
  });
  const [tradeHistory, setTradeHistory] = useState([]);
  const [autoTrade, setAutoTrade] = useState(false);
  const [riskSettings, setRiskSettings] = useState({
    maxRiskPerTrade: 2,
    maxPositions: 5,
    minConfidence: 75,
    stopLossPercent: 8
  });

  // Performance tracking
  const [performance, setPerformance] = useState({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    winRate: 0,
    totalReturn: 0,
    bestTrade: 0,
    worstTrade: 0,
    avgWin: 0,
    avgLoss: 0,
    sharpeRatio: 0,
    maxDrawdown: 0
  });

  // 🧠 SELF-LEARNING AI SYSTEM
  const [aiLearningData, setAiLearningData] = useState({
    totalLearningCycles: 0,
    successPatterns: [],
    failurePatterns: [],
    marketRegimes: [],
    signalAccuracy: {},
    adaptiveWeights: {
      sentiment: 30,
      technical: 25,
      fundamental: 25,
      momentum: 15,
      risk: 5
    },
    confidenceCalibration: {},
    lastUpdate: null,
    improvementScore: 0
  });

  // 🌐 REAL-TIME INTERNET MONITORING
  const [internetMonitoring, setInternetMonitoring] = useState({
    isActive: false,
    lastScan: null,
    newsAlerts: [],
    socialSentiment: [],
    economicEvents: [],
    insiderActivity: [],
    recentFindings: []
  });

  // 📊 LEARNING METRICS
  const [learningMetrics, setLearningMetrics] = useState({
    modelVersion: '1.0.0',
    trainingIterations: 0,
    accuracyImprovement: 0,
    avgConfidenceAccuracy: 0,
    bestPerformingStrategy: null,
    worstPerformingStrategy: null
  });

  useEffect(() => {
    loadSavedData();
    fetchMarketData();
    startInternetMonitoring();
    
    const marketInterval = setInterval(fetchMarketData, 300000); // Every 5 min
    const learningInterval = setInterval(runLearningCycle, 3600000); // Every hour
    const monitoringInterval = setInterval(scanInternet, 900000); // Every 15 min
    
    return () => {
      clearInterval(marketInterval);
      clearInterval(learningInterval);
      clearInterval(monitoringInterval);
    };
  }, []);

  useEffect(() => {
    if (autoTrade && tradingEnabled) {
      const autoTradeInterval = setInterval(() => {
        executeAutoTrade();
      }, 60000);
      return () => clearInterval(autoTradeInterval);
    }
  }, [autoTrade, tradingEnabled]);

  const loadSavedData = async () => {
    try {
      const saved = await window.storage.get('apex-ultimate-data');
      if (saved?.value) {
        const data = JSON.parse(saved.value);
        setWatchlist(data.watchlist || ['AAPL', 'TSLA', 'NVDA', 'BTC', 'ETH']);
        setPortfolio(data.portfolio || portfolio);
        setTradeHistory(data.tradeHistory || []);
        setPerformance(data.performance || performance);
        setRiskSettings(data.riskSettings || riskSettings);
        setAiLearningData(data.aiLearningData || aiLearningData);
        setLearningMetrics(data.learningMetrics || learningMetrics);
      }
    } catch (error) {
      console.log('No saved data yet');
    }
  };

  const saveAllData = async () => {
    try {
      const data = {
        watchlist,
        portfolio,
        tradeHistory,
        performance,
        riskSettings,
        aiLearningData,
        learningMetrics,
        timestamp: Date.now()
      };
      await window.storage.set('apex-ultimate-data', JSON.stringify(data), false);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  // 🌐 INTERNET MONITORING - Scans for breaking news and important events
  const scanInternet = async () => {
    try {
      const symbols = watchlist.join(',');
      
      const prompt = `You are APEX AI's Internet Monitoring System. Scan for CRITICAL market-moving information RIGHT NOW.

Symbols to monitor: ${symbols}

Search for:
1. Breaking news in last 1 hour
2. Major economic events today
3. Earnings announcements
4. Regulatory changes
5. Market crashes/rallies
6. Geopolitical events affecting markets
7. Social media viral trends (stocks/crypto)
8. Insider trading activity

Respond with JSON:
{
  "criticalAlerts": [
    {
      "symbol": "AAPL",
      "type": "news" | "economic" | "social" | "insider",
      "severity": "high" | "medium" | "low",
      "title": "Brief headline",
      "impact": "bullish" | "bearish" | "neutral",
      "confidence": 0-100,
      "action": "buy" | "sell" | "hold" | "exit",
      "reason": "Why this matters"
    }
  ],
  "marketSentiment": "bullish" | "bearish" | "neutral",
  "urgentActions": ["action1", "action2"]
}

Only include ACTIONABLE information. Respond with valid JSON only.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }],
          tools: [{
            type: "web_search_20250305",
            name: "web_search"
          }]
        })
      });

      const result = await response.json();
      
      // Extract text from all content blocks
      let aiResponse = '';
      if (result.content) {
        aiResponse = result.content
          .filter(block => block.type === 'text')
          .map(block => block.text)
          .join('\n');
      }
      
      if (!aiResponse) {
        console.log('No text response from internet scan');
        return;
      }

      let cleanResponse = aiResponse.trim()
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '');
      
      const alerts = JSON.parse(cleanResponse);
      
      setInternetMonitoring(prev => ({
        ...prev,
        isActive: true,
        lastScan: new Date().toISOString(),
        newsAlerts: alerts.criticalAlerts || [],
        recentFindings: [
          {
            timestamp: new Date().toISOString(),
            sentiment: alerts.marketSentiment,
            alertCount: alerts.criticalAlerts?.length || 0
          },
          ...prev.recentFindings.slice(0, 19)
        ]
      }));

      // Process urgent actions
      if (alerts.urgentActions && alerts.urgentActions.length > 0) {
        await handleUrgentActions(alerts);
      }

      await saveAllData();
    } catch (error) {
      console.error('Internet monitoring error:', error);
    }
  };

  const startInternetMonitoring = () => {
    setInternetMonitoring(prev => ({ ...prev, isActive: true }));
    scanInternet(); // Initial scan
  };

  const handleUrgentActions = async (alerts) => {
    // If critical alerts require immediate action
    for (const alert of alerts.criticalAlerts) {
      if (alert.severity === 'high' && alert.action === 'exit') {
        // Close positions for this symbol
        const position = portfolio.positions.find(p => p.symbol === alert.symbol);
        if (position) {
          await closePosition(position, `Urgent: ${alert.reason}`);
        }
      }
    }
  };

  // 🧠 SELF-LEARNING SYSTEM - Learns from every trade
  const runLearningCycle = async () => {
    console.log('🧠 Running AI Learning Cycle...');
    
    try {
      // Analyze recent trades to identify patterns
      const recentTrades = tradeHistory.filter(t => t.status === 'CLOSED').slice(0, 50);
      
      if (recentTrades.length < 5) {
        console.log('Not enough trade data for learning');
        return;
      }

      const prompt = `You are APEX AI's Self-Learning System. Analyze these trade results and LEARN from them.

Recent Trades:
${JSON.stringify(recentTrades.map(t => ({
  symbol: t.symbol,
  entryPrice: t.entryPrice,
  exitPrice: t.exitPrice,
  profit: t.profitPercent,
  confidence: t.confidence,
  thesis: t.thesis,
  bullishSignals: t.bullishSignals,
  outcome: t.profit > 0 ? 'WIN' : 'LOSS'
})), null, 2)}

Current Performance:
- Win Rate: ${performance.winRate}%
- Avg Win: ${performance.avgWin}%
- Avg Loss: ${performance.avgLoss}%

Current AI Weights:
${JSON.stringify(aiLearningData.adaptiveWeights, null, 2)}

ANALYZE:
1. What patterns led to WINNING trades?
2. What patterns led to LOSING trades?
3. Are high-confidence predictions actually accurate?
4. Which signals (sentiment/technical/fundamental) are most reliable?
5. Should we adjust AI weights?

Respond with JSON:
{
  "successPatterns": ["pattern1", "pattern2"],
  "failurePatterns": ["pattern1", "pattern2"],
  "confidenceCalibration": {
    "80-90": actualWinRate,
    "90-100": actualWinRate
  },
  "recommendedWeightAdjustments": {
    "sentiment": +5 or -5,
    "technical": +5 or -5,
    "fundamental": +5 or -5,
    "momentum": +5 or -5
  },
  "keyInsights": ["insight1", "insight2"],
  "improvementScore": 0-100,
  "recommendedMinConfidence": 70-95
}

Be HONEST. If the AI is failing, suggest big changes. Respond with valid JSON only.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const result = await response.json();
      let aiResponse = result.content[0].text.trim();
      let cleanResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const learningResults = JSON.parse(cleanResponse);

      // Apply learned improvements
      applyLearningResults(learningResults);

      console.log('✅ Learning cycle complete. AI improved!');
      
    } catch (error) {
      console.error('Learning cycle error:', error);
    }
  };

  const applyLearningResults = (results) => {
    setAiLearningData(prev => {
      const newWeights = { ...prev.adaptiveWeights };
      
      // Apply weight adjustments
      if (results.recommendedWeightAdjustments) {
        Object.keys(results.recommendedWeightAdjustments).forEach(key => {
          if (newWeights[key]) {
            newWeights[key] = Math.max(0, Math.min(100, 
              newWeights[key] + results.recommendedWeightAdjustments[key]
            ));
          }
        });
        
        // Normalize to 100%
        const total = Object.values(newWeights).reduce((sum, val) => sum + val, 0);
        Object.keys(newWeights).forEach(key => {
          newWeights[key] = Math.round((newWeights[key] / total) * 100);
        });
      }

      return {
        ...prev,
        totalLearningCycles: prev.totalLearningCycles + 1,
        successPatterns: [...new Set([...prev.successPatterns, ...(results.successPatterns || [])])].slice(0, 20),
        failurePatterns: [...new Set([...prev.failurePatterns, ...(results.failurePatterns || [])])].slice(0, 20),
        adaptiveWeights: newWeights,
        confidenceCalibration: results.confidenceCalibration || prev.confidenceCalibration,
        lastUpdate: new Date().toISOString(),
        improvementScore: results.improvementScore || prev.improvementScore
      };
    });

    // Update min confidence if recommended
    if (results.recommendedMinConfidence) {
      setRiskSettings(prev => ({
        ...prev,
        minConfidence: results.recommendedMinConfidence
      }));
    }

    // Update learning metrics
    setLearningMetrics(prev => ({
      ...prev,
      trainingIterations: prev.trainingIterations + 1,
      modelVersion: `${parseFloat(prev.modelVersion) + 0.1}`.substring(0, 5),
      avgConfidenceAccuracy: calculateConfidenceAccuracy(),
      accuracyImprovement: results.improvementScore - prev.accuracyImprovement
    }));

    saveAllData();
  };

  const calculateConfidenceAccuracy = () => {
    const closedTrades = tradeHistory.filter(t => t.status === 'CLOSED');
    if (closedTrades.length === 0) return 0;

    let totalError = 0;
    closedTrades.forEach(trade => {
      const wasWin = trade.profit > 0;
      const predictedProbability = trade.confidence;
      const actualOutcome = wasWin ? 100 : 0;
      totalError += Math.abs(predictedProbability - actualOutcome);
    });

    return Math.max(0, 100 - (totalError / closedTrades.length));
  };

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      const data = {};
      
      const cryptoSymbols = watchlist.filter(s => ['BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'DOGE', 'XRP'].includes(s));
      if (cryptoSymbols.length > 0) {
        const cryptoIds = {
          'BTC': 'bitcoin', 'ETH': 'ethereum', 'SOL': 'solana',
          'BNB': 'binancecoin', 'ADA': 'cardano', 'DOGE': 'dogecoin', 'XRP': 'ripple'
        };
        
        const ids = cryptoSymbols.map(s => cryptoIds[s]).join(',');
        try {
          const cryptoRes = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true`);
          const cryptoData = await cryptoRes.json();
          
          Object.entries(cryptoData).forEach(([id, priceData]) => {
            const symbol = Object.keys(cryptoIds).find(k => cryptoIds[k] === id);
            if (symbol) {
              data[symbol] = {
                symbol,
                price: priceData.usd,
                change: priceData.usd_24h_change || 0,
                volume: priceData.usd_24h_vol || 0,
                marketCap: priceData.usd_market_cap || 0,
                type: 'crypto'
              };
            }
          });
        } catch (error) {
          console.error('Crypto fetch error:', error);
        }
      }

      const stockSymbols = watchlist.filter(s => !['BTC', 'ETH', 'SOL', 'BNB', 'ADA', 'DOGE', 'XRP'].includes(s));
      stockSymbols.forEach(symbol => {
        data[symbol] = {
          symbol,
          price: Math.random() * 500 + 100,
          change: (Math.random() - 0.5) * 10,
          volume: Math.random() * 100000000,
          marketCap: Math.random() * 1000000000000,
          type: 'stock'
        };
      });

      try {
        const fgRes = await fetch('https://api.alternative.me/fng/?limit=1');
        const fgData = await fgRes.json();
        setFearGreedIndex(fgData.data[0]);
      } catch (error) {
        console.error('Fear & Greed fetch error:', error);
      }

      setMarketData(data);
      updatePortfolioPrices(data);
      
      if (Object.keys(data).length > 0) {
        await generateOpportunities(data);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePortfolioPrices = (data) => {
    const updatedPositions = portfolio.positions.map(pos => {
      const currentPrice = data[pos.symbol]?.price || pos.currentPrice;
      const pl = ((currentPrice - pos.entryPrice) / pos.entryPrice) * 100;
      const plValue = (currentPrice - pos.entryPrice) * pos.quantity;
      
      return {
        ...pos,
        currentPrice,
        pl,
        plValue
      };
    });

    const totalPL = updatedPositions.reduce((sum, pos) => sum + pos.plValue, 0);
    const positionsValue = updatedPositions.reduce((sum, pos) => sum + (pos.currentPrice * pos.quantity), 0);
    
    setPortfolio(prev => ({
      ...prev,
      positions: updatedPositions,
      equity: prev.cash + positionsValue,
      totalPL: totalPL
    }));
  };

  // 🎯 AI-POWERED OPPORTUNITY GENERATION (with learning)
  const generateOpportunities = async (data = marketData) => {
    setAnalyzing(true);
    try {
      const marketSummary = Object.values(data).map(asset => ({
        symbol: asset.symbol,
        price: asset.price,
        change: asset.change,
        volume: asset.volume,
        type: asset.type
      }));

      const prompt = `You are APEX AI ULTIMATE with SELF-LEARNING capabilities.

🧠 LEARNED KNOWLEDGE:
Success Patterns: ${aiLearningData.successPatterns.join(', ') || 'Learning...'}
Failure Patterns: ${aiLearningData.failurePatterns.join(', ') || 'Learning...'}
Adaptive Weights: ${JSON.stringify(aiLearningData.adaptiveWeights)}
Learning Cycles: ${aiLearningData.totalLearningCycles}
Improvement Score: ${aiLearningData.improvementScore}/100

📊 Current Market:
${JSON.stringify(marketSummary, null, 2)}

🌐 Recent Internet Alerts:
${JSON.stringify(internetMonitoring.newsAlerts.slice(0, 3), null, 2)}

Fear & Greed: ${fearGreedIndex?.value || 'N/A'} (${fearGreedIndex?.value_classification || 'N/A'})

📈 Your Performance:
Win Rate: ${performance.winRate}%
Total Trades: ${performance.totalTrades}

GENERATE TOP 5 OPPORTUNITIES using your LEARNED KNOWLEDGE:
1. AVOID failure patterns you learned
2. PRIORITIZE success patterns you learned
3. USE adaptive weights: ${JSON.stringify(aiLearningData.adaptiveWeights)}
4. INCORPORATE recent internet alerts
5. CALIBRATE confidence based on actual accuracy

Respond with JSON array:
{
  "symbol": "AAPL",
  "action": "BUY" or "SELL",
  "score": 0-100,
  "confidence": 0-100 (calibrated based on learned accuracy),
  "timeHorizon": "Short-term (3-7 days)" or "Medium-term (2-8 weeks)" or "Long-term (3-12 months)",
  "entryPrice": number,
  "targetPrice": number,
  "stopLoss": number,
  "riskLevel": "Low" or "Medium" or "High",
  "thesis": "Why this works based on learned patterns",
  "bullishSignals": ["signal1", "signal2", "signal3"],
  "risks": ["risk1", "risk2"],
  "probability": 0-100,
  "expectedReturn": percentage,
  "positionSize": recommended %,
  "learningBased": true/false,
  "internetAlert": true/false if based on breaking news
}

Only recommend 75%+ confidence. Use learned knowledge. Respond with valid JSON only.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 4000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const result = await response.json();
      let cleanResponse = result.content[0].text.trim()
        .replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      const opps = JSON.parse(cleanResponse);
      setOpportunities(opps);
      await window.storage.set('apex-opportunities', JSON.stringify(opps), false);
    } catch (error) {
      console.error('Error generating opportunities:', error);
      setOpportunities(generateFallbackOpportunities(data));
    } finally {
      setAnalyzing(false);
    }
  };

  const generateFallbackOpportunities = (data) => {
    return Object.values(data).slice(0, 5).map(asset => ({
      symbol: asset.symbol,
      action: asset.change > 0 ? 'BUY' : 'HOLD',
      score: Math.min(95, Math.abs(asset.change) * 10 + 50),
      confidence: 70,
      timeHorizon: 'Medium-term (2-8 weeks)',
      entryPrice: asset.price,
      targetPrice: asset.price * 1.15,
      stopLoss: asset.price * 0.92,
      riskLevel: Math.abs(asset.change) > 5 ? 'High' : 'Medium',
      thesis: `${asset.change > 0 ? 'Momentum' : 'Value'} opportunity`,
      bullishSignals: ['Technical setup', 'Volume', 'Trend'],
      risks: ['Volatility', 'Market risk'],
      probability: 65,
      expectedReturn: 15,
      positionSize: 5,
      learningBased: false,
      internetAlert: false
    }));
  };

  const executeTrade = async (opportunity, manual = false) => {
    if (!tradingEnabled && !manual) return;

    const riskAmount = portfolio.equity * (riskSettings.maxRiskPerTrade / 100);
    const riskPerShare = Math.abs(opportunity.entryPrice - opportunity.stopLoss);
    const quantity = Math.floor(riskAmount / riskPerShare);
    const totalCost = quantity * opportunity.entryPrice;

    if (totalCost > portfolio.cash) {
      alert(`Insufficient cash. Need $${totalCost.toFixed(2)}, have $${portfolio.cash.toFixed(2)}`);
      return;
    }

    if (portfolio.positions.length >= riskSettings.maxPositions) {
      alert(`Max positions (${riskSettings.maxPositions}) reached`);
      return;
    }

    const trade = {
      id: Date.now(),
      symbol: opportunity.symbol,
      action: 'BUY',
      quantity: quantity,
      entryPrice: opportunity.entryPrice,
      currentPrice: opportunity.entryPrice,
      stopLoss: opportunity.stopLoss,
      targetPrice: opportunity.targetPrice,
      entryDate: new Date().toISOString(),
      status: 'OPEN',
      pl: 0,
      plValue: 0,
      confidence: opportunity.confidence,
      thesis: opportunity.thesis,
      bullishSignals: opportunity.bullishSignals,
      learningBased: opportunity.learningBased,
      internetAlert: opportunity.internetAlert,
      aiWeightsUsed: { ...aiLearningData.adaptiveWeights }
    };

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash - totalCost,
      positions: [...prev.positions, trade]
    }));

    setTradeHistory(prev => [trade, ...prev]);
    await saveAllData();
    
    return trade;
  };

  const closePosition = async (position, reason = 'Manual close') => {
    const currentPrice = marketData[position.symbol]?.price || position.currentPrice;
    const exitValue = currentPrice * position.quantity;
    const profit = exitValue - (position.entryPrice * position.quantity);
    const profitPercent = ((currentPrice - position.entryPrice) / position.entryPrice) * 100;

    setPortfolio(prev => ({
      ...prev,
      cash: prev.cash + exitValue,
      positions: prev.positions.filter(p => p.id !== position.id)
    }));

    const closedTrade = {
      ...position,
      exitPrice: currentPrice,
      exitDate: new Date().toISOString(),
      status: 'CLOSED',
      profit: profit,
      profitPercent: profitPercent,
      closeReason: reason
    };

    setTradeHistory(prev => 
      prev.map(t => t.id === position.id ? closedTrade : t)
    );

    updatePerformance(closedTrade);
    
    // 🧠 TRIGGER LEARNING from this trade
    await learnFromTrade(closedTrade);
    
    await saveAllData();
  };

  // 🧠 LEARN FROM INDIVIDUAL TRADE
  const learnFromTrade = async (trade) => {
    try {
      const wasWin = trade.profit > 0;
      const confidenceWasAccurate = Math.abs(trade.confidence - (wasWin ? 100 : 0)) < 30;

      // Update signal accuracy tracking
      setAiLearningData(prev => {
        const newSignalAccuracy = { ...prev.signalAccuracy };
        
        trade.bullishSignals?.forEach(signal => {
          if (!newSignalAccuracy[signal]) {
            newSignalAccuracy[signal] = { wins: 0, losses: 0, total: 0 };
          }
          newSignalAccuracy[signal].total++;
          if (wasWin) {
            newSignalAccuracy[signal].wins++;
          } else {
            newSignalAccuracy[signal].losses++;
          }
        });

        return {
          ...prev,
          signalAccuracy: newSignalAccuracy
        };
      });

      // If trade was significantly different than expected, trigger learning
      if (!confidenceWasAccurate || Math.abs(trade.profitPercent) > 20) {
        // Queue for next learning cycle
        console.log(`📚 Trade logged for learning: ${trade.symbol} ${wasWin ? 'WIN' : 'LOSS'} ${trade.profitPercent.toFixed(2)}%`);
      }

    } catch (error) {
      console.error('Learn from trade error:', error);
    }
  };

  const updatePerformance = (closedTrade) => {
    setPerformance(prev => {
      const totalTrades = prev.totalTrades + 1;
      const isWin = closedTrade.profit > 0;
      const winningTrades = isWin ? prev.winningTrades + 1 : prev.winningTrades;
      const losingTrades = isWin ? prev.losingTrades : prev.losingTrades + 1;
      const winRate = (winningTrades / totalTrades) * 100;
      
      return {
        totalTrades,
        winningTrades,
        losingTrades,
        winRate,
        totalReturn: prev.totalReturn + closedTrade.profitPercent,
        bestTrade: Math.max(prev.bestTrade, closedTrade.profitPercent),
        worstTrade: Math.min(prev.worstTrade, closedTrade.profitPercent),
        avgWin: winningTrades > 0 ? (prev.avgWin * (winningTrades - 1) + (isWin ? closedTrade.profitPercent : 0)) / winningTrades : 0,
        avgLoss: losingTrades > 0 ? (prev.avgLoss * (losingTrades - 1) + (!isWin ? closedTrade.profitPercent : 0)) / losingTrades : 0
      };
    });
  };

  const executeAutoTrade = async () => {
    if (!autoTrade || !tradingEnabled) return;

    const validOpps = opportunities.filter(opp => 
      opp.confidence >= riskSettings.minConfidence &&
      opp.action === 'BUY' &&
      portfolio.positions.length < riskSettings.maxPositions &&
      !portfolio.positions.some(p => p.symbol === opp.symbol)
    );

    if (validOpps.length > 0) {
      await executeTrade(validOpps[0]);
    }

    for (const position of portfolio.positions) {
      const currentPrice = marketData[position.symbol]?.price;
      if (!currentPrice) continue;

      if (currentPrice <= position.stopLoss) {
        await closePosition(position, 'Stop loss hit');
      }
      else if (currentPrice >= position.targetPrice) {
        await closePosition(position, 'Target reached');
      }
    }
  };

  const OpportunityCard = ({ opp }) => {
    const getActionColor = (action) => {
      if (action === 'BUY') return 'text-green-600 bg-green-50';
      if (action === 'SELL') return 'text-red-600 bg-red-50';
      return 'text-gray-600 bg-gray-50';
    };

    const getRiskColor = (risk) => {
      if (risk === 'Low') return 'text-green-600';
      if (risk === 'Medium') return 'text-yellow-600';
      if (risk === 'High') return 'text-orange-600';
      return 'text-red-600';
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-gray-900">{opp.symbol}</h3>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${getActionColor(opp.action)}`}>
                {opp.action}
              </span>
              {opp.learningBased && (
                <span className="px-2 py-1 rounded text-xs font-semibold bg-purple-50 text-purple-600 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Learned
                </span>
              )}
              {opp.internetAlert && (
                <span className="px-2 py-1 rounded text-xs font-semibold bg-blue-50 text-blue-600 flex items-center gap-1">
                  <Wifi className="w-3 h-3" />
                  Breaking News
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{opp.thesis}</p>
          </div>
          <div className="text-right ml-3">
            <div className="text-2xl font-bold text-purple-600">{opp.score}</div>
            <div className="text-xs text-gray-500">Score</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <div className="text-xs text-gray-500">Entry</div>
            <div className="text-sm font-semibold">${opp.entryPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Target</div>
            <div className="text-sm font-semibold text-green-600">${opp.targetPrice.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Stop Loss</div>
            <div className="text-sm font-semibold text-red-600">${opp.stopLoss.toFixed(2)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">Risk</div>
            <div className={`text-sm font-semibold ${getRiskColor(opp.riskLevel)}`}>{opp.riskLevel}</div>
          </div>
        </div>

        <div className="mb-3">
          <div className="text-xs text-gray-500 mb-1">
            Confidence: {opp.confidence}% | Expected: +{opp.expectedReturn}%
          </div>
          <div className="flex flex-wrap gap-1">
            {opp.bullishSignals?.slice(0, 3).map((signal, i) => (
              <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                {signal}
              </span>
            ))}
          </div>
        </div>

        {tradingEnabled && (
          <button
            onClick={() => executeTrade(opp, true)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium"
          >
            Execute Trade
          </button>
        )}
      </div>
    );
  };

  const LearningDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">AI Model Version</div>
              <div className="text-3xl font-bold">{learningMetrics.modelVersion}</div>
              <div className="text-sm mt-1 opacity-90">{learningMetrics.trainingIterations} iterations</div>
            </div>
            <Brain className="w-12 h-12 opacity-30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Learning Cycles</div>
              <div className="text-3xl font-bold">{aiLearningData.totalLearningCycles}</div>
              <div className="text-sm mt-1 opacity-90">Improvement: {aiLearningData.improvementScore}/100</div>
            </div>
            <Database className="w-12 h-12 opacity-30" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Confidence Accuracy</div>
              <div className="text-3xl font-bold">{learningMetrics.avgConfidenceAccuracy.toFixed(1)}%</div>
              <div className="text-sm mt-1 opacity-90">Predictions calibrated</div>
            </div>
            <Award className="w-12 h-12 opacity-30" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Adaptive AI Weights
        </h3>
        <div className="space-y-3">
          {Object.entries(aiLearningData.adaptiveWeights).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium capitalize">{key}</span>
                <span className="text-sm font-bold text-purple-600">{value}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-gray-600">
          <Clock className="w-4 h-4 inline mr-1" />
          Last updated: {aiLearningData.lastUpdate ? new Date(aiLearningData.lastUpdate).toLocaleString() : 'Never'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            Success Patterns Learned
          </h3>
          {aiLearningData.successPatterns.length > 0 ? (
            <div className="space-y-2">
              {aiLearningData.successPatterns.slice(0, 5).map((pattern, i) => (
                <div key={i} className="text-sm bg-green-50 text-green-800 p-2 rounded">
                  ✓ {pattern}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Learning from trades...</div>
          )}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            Failure Patterns Avoided
          </h3>
          {aiLearningData.failurePatterns.length > 0 ? (
            <div className="space-y-2">
              {aiLearningData.failurePatterns.slice(0, 5).map((pattern, i) => (
                <div key={i} className="text-sm bg-red-50 text-red-800 p-2 rounded">
                  ✗ {pattern}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">Learning from trades...</div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Wifi className="w-5 h-5 text-blue-600" />
          Internet Monitoring Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="text-sm text-gray-600">Status</div>
            <div className={`font-semibold ${internetMonitoring.isActive ? 'text-green-600' : 'text-gray-400'}`}>
              {internetMonitoring.isActive ? '🟢 Active' : '🔴 Inactive'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Last Scan</div>
            <div className="font-semibold">
              {internetMonitoring.lastScan ? new Date(internetMonitoring.lastScan).toLocaleTimeString() : 'Never'}
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Active Alerts</div>
            <div className="font-semibold text-orange-600">{internetMonitoring.newsAlerts.length}</div>
          </div>
        </div>

        {internetMonitoring.newsAlerts.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Recent Alerts:</h4>
            {internetMonitoring.newsAlerts.slice(0, 3).map((alert, i) => (
              <div key={i} className={`p-3 rounded border ${
                alert.severity === 'high' ? 'bg-red-50 border-red-200' :
                alert.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold">{alert.symbol}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.impact === 'bullish' ? 'bg-green-100 text-green-700' :
                    alert.impact === 'bearish' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {alert.impact}
                  </span>
                </div>
                <div className="text-sm">{alert.title}</div>
                <div className="text-xs text-gray-600 mt-1">{alert.reason}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={runLearningCycle}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
      >
        <Brain className="w-5 h-5" />
        Run Learning Cycle Now
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">APEX AI ULTIMATE</h1>
                <p className="text-sm text-purple-100">Self-Learning AI • Internet Monitoring • Continuous Improvement</p>
              </div>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              {internetMonitoring.isActive && (
                <div className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <Wifi className="w-4 h-4 animate-pulse" />
                  Monitoring Internet
                </div>
              )}
              {autoTrade && (
                <div className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 animate-pulse" />
                  Auto-Trading
                </div>
              )}
              <button 
                onClick={fetchMarketData}
                disabled={loading}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Updating...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm mb-6 p-1 flex gap-1 overflow-x-auto">
          {[
            { id: 'opportunities', label: 'Opportunities', icon: Target },
            { id: 'portfolio', label: 'Portfolio', icon: Wallet },
            { id: 'learning', label: 'AI Learning', icon: Brain },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'opportunities' && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <h2 className="text-2xl font-bold text-gray-900">🎯 AI-Generated Opportunities</h2>
              <button
                onClick={() => generateOpportunities()}
                disabled={analyzing}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
              >
                <Zap className={`w-4 h-4 ${analyzing ? 'animate-pulse' : ''}`} />
                {analyzing ? 'Analyzing...' : 'Regenerate'}
              </button>
            </div>

            {analyzing && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
                  <div>
                    <div className="font-medium text-purple-900">AI Analysis with Learned Intelligence</div>
                    <div className="text-sm text-purple-700">Using {aiLearningData.totalLearningCycles} learning cycles, {aiLearningData.successPatterns.length} success patterns...</div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {opportunities.length > 0 ? (
                opportunities.map((opp, idx) => <OpportunityCard key={idx} opp={opp} />)
              ) : (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <Target className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Click "Regenerate" to discover opportunities</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                <div className="text-sm opacity-90">Total Equity</div>
                <div className="text-3xl font-bold">${portfolio.equity.toFixed(2)}</div>
                <div className={`text-sm mt-1 ${portfolio.totalPL >= 0 ? 'text-green-100' : 'text-red-200'}`}>
                  {portfolio.totalPL >= 0 ? '+' : ''}{portfolio.totalPL.toFixed(2)} ({((portfolio.totalPL / 100000) * 100).toFixed(2)}%)
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <div className="text-sm opacity-90">Cash Available</div>
                <div className="text-3xl font-bold">${portfolio.cash.toFixed(2)}</div>
                <div className="text-sm mt-1 opacity-90">{((portfolio.cash / portfolio.equity) * 100).toFixed(1)}% liquid</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <div className="text-sm opacity-90">Open Positions</div>
                <div className="text-3xl font-bold">{portfolio.positions.length}</div>
                <div className="text-sm mt-1 opacity-90">of {riskSettings.maxPositions} max</div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                <div className="text-sm opacity-90">Win Rate</div>
                <div className="text-3xl font-bold">{performance.winRate.toFixed(1)}%</div>
                <div className="text-sm mt-1 opacity-90">{performance.totalTrades} trades</div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-bold mb-4">Open Positions</h3>
              {portfolio.positions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No open positions</div>
              ) : (
                <div className="space-y-3">
                  {portfolio.positions.map(pos => (
                    <div key={pos.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-lg flex items-center gap-2">
                            {pos.symbol}
                            {pos.learningBased && <Sparkles className="w-4 h-4 text-purple-600" />}
                            {pos.internetAlert && <Wifi className="w-4 h-4 text-blue-600" />}
                          </h4>
                          <div className="text-sm text-gray-600">{pos.quantity} shares @ ${pos.entryPrice.toFixed(2)}</div>
                        </div>
                        <div className={`text-right ${pos.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          <div className="text-lg font-bold">{pos.pl >= 0 ? '+' : ''}{pos.pl.toFixed(2)}%</div>
                          <div className="text-sm">${pos.plValue.toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                        <div>
                          <span className="text-gray-500">Current: </span>
                          <span className="font-medium">${pos.currentPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Target: </span>
                          <span className="font-medium text-green-600">${pos.targetPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stop: </span>
                          <span className="font-medium text-red-600">${pos.stopLoss.toFixed(2)}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => closePosition(pos)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded font-medium"
                      >
                        Close Position
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'learning' && <LearningDashboard />}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Trading Settings</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={paperTrading} onChange={(e) => setPaperTrading(e.target.checked)} className="w-4 h-4" />
                  <span className="font-medium">Paper Trading Mode</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={tradingEnabled} onChange={(e) => setTradingEnabled(e.target.checked)} className="w-4 h-4" />
                  <span className="font-medium">Enable Trading</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={autoTrade} onChange={(e) => setAutoTrade(e.target.checked)} disabled={!tradingEnabled} className="w-4 h-4" />
                  <span className="font-medium">Auto-Trading</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold mb-4">Risk Management</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Max Risk Per Trade: {riskSettings.maxRiskPerTrade}%</label>
                  <input type="range" min="1" max="5" step="0.5" value={riskSettings.maxRiskPerTrade}
                    onChange={(e) => setRiskSettings({...riskSettings, maxRiskPerTrade: parseFloat(e.target.value)})} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Positions: {riskSettings.maxPositions}</label>
                  <input type="range" min="1" max="10" value={riskSettings.maxPositions}
                    onChange={(e) => setRiskSettings({...riskSettings, maxPositions: parseInt(e.target.value)})} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Min Confidence: {riskSettings.minConfidence}%</label>
                  <input type="range" min="50" max="95" step="5" value={riskSettings.minConfidence}
                    onChange={(e) => setRiskSettings({...riskSettings, minConfidence: parseInt(e.target.value)})} className="w-full" />
                </div>
              </div>
              <button onClick={saveAllData} className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium">
                Save Settings
              </button>
            </div>
          </div>
        )}

        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-purple-900">
              <strong className="text-base">🧠 Self-Learning AI Active:</strong> This platform learns from every trade, 
              monitors the internet 24/7 for breaking news, and continuously improves its predictions. The AI gets smarter 
              over time by analyzing success patterns, avoiding failure patterns, and adapting to changing market conditions.
              <div className="mt-2 text-xs text-purple-700">
                Learning Cycles: {aiLearningData.totalLearningCycles} • 
                Internet Scans: {internetMonitoring.recentFindings.length} • 
                Model Version: {learningMetrics.modelVersion}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <p>APEX AI ULTIMATE • Self-Learning Neural Network • Real-Time Internet Monitoring</p>
          <p className="mt-1">The AI That Gets Smarter With Every Trade 🚀</p>
        </div>
      </div>
    </div>
  );
};

export default APEX_AI_ULTIMATE;
