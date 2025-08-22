import React, { useState } from 'react';
import { Copy, Download, Play, Square, BarChart3, Code, Clock, Target } from 'lucide-react';

function App() {
  const [copied, setCopied] = useState(false);

  const bookmarkletCode = `javascript:(function(){if(window.zetamacTracker){window.zetamacTracker.toggle();return;}const tracker={isTracking:false,currentGame:null,games:JSON.parse(localStorage.getItem('zetamacGames')||'[]'),ui:null,observers:[],questionStartTime:null,init(){this.createUI();this.setupObservers();this.checkCurrentPage();},createUI(){const existing=document.getElementById('zetamac-tracker');if(existing)existing.remove();this.ui=document.createElement('div');this.ui.id='zetamac-tracker';this.ui.innerHTML=\`<div style="position:fixed;top:10px;right:10px;z-index:10000;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:15px;border-radius:12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;font-size:14px;box-shadow:0 8px 32px rgba(0,0,0,0.3);min-width:280px;backdrop-filter:blur(10px);"><div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;"><div style="width:8px;height:8px;border-radius:50%;background:\${this.isTracking?'#10b981':'#ef4444'};"></div><h3 style="margin:0;font-weight:600;">Zetamac Tracker</h3><button id="tracker-minimize" style="margin-left:auto;background:none;border:none;color:white;cursor:pointer;padding:4px;">−</button></div><div id="tracker-content"><div style="margin-bottom:12px;font-size:12px;"><div style="opacity:0.9;margin-bottom:4px;">Status: \${this.isTracking?'🟢 Tracking':'🔴 Stopped'}</div><div style="opacity:0.9;">Games: \${this.games.length} | Total Questions: \${this.getTotalQuestions()}</div></div><div style="display:flex;gap:8px;margin-bottom:12px;"><button id="tracker-toggle" style="flex:1;padding:8px;border:none;border-radius:6px;background:\${this.isTracking?'#ef4444':'#10b981'};color:white;font-size:12px;cursor:pointer;font-weight:500;">\${this.isTracking?'Stop':'Start'}</button><button id="tracker-clear" style="padding:8px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;font-size:12px;cursor:pointer;">Clear</button></div><div style="display:flex;gap:8px;margin-bottom:12px;"><button id="tracker-csv" style="flex:1;padding:8px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;font-size:12px;cursor:pointer;">📄 CSV</button><button id="tracker-copy" style="flex:1;padding:8px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;font-size:12px;cursor:pointer;">📋 Copy</button><button id="tracker-stats" style="padding:8px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;font-size:12px;cursor:pointer;">📊</button></div><div id="current-game-info" style="padding:8px;background:rgba(255,255,255,0.1);border-radius:6px;font-size:12px;display:\${this.currentGame?'block':'none'};"><div>Current Game Questions: <span id="current-questions">\${this.currentGame?this.currentGame.questions.length:0}</span></div><div>Average Time: <span id="current-avg-time">\${this.currentGame?this.getAverageTime(this.currentGame):'--'}</span>s</div></div></div></div>\`;document.body.appendChild(this.ui);this.bindEvents();},bindEvents(){document.getElementById('tracker-toggle').onclick=()=>this.toggle();document.getElementById('tracker-clear').onclick=()=>this.clear();document.getElementById('tracker-csv').onclick=()=>this.exportCSV();document.getElementById('tracker-copy').onclick=()=>this.copyToClipboard();document.getElementById('tracker-stats').onclick=()=>this.showStats();document.getElementById('tracker-minimize').onclick=()=>this.toggleMinimize();},toggleMinimize(){const content=document.getElementById('tracker-content');content.style.display=content.style.display==='none'?'block':'none';},setupObservers(){let lastUrl=location.href;const urlObserver=new MutationObserver(()=>{if(location.href!==lastUrl){lastUrl=location.href;this.handleUrlChange();}});urlObserver.observe(document,{subtree:true,childList:true});this.observers.push(urlObserver);const gameObserver=new MutationObserver((mutations)=>{if(!this.isTracking)return;this.checkForGameStart();this.checkForNewQuestion();this.checkForScore();});gameObserver.observe(document.body,{childList:true,subtree:true,characterData:true});this.observers.push(gameObserver);},checkCurrentPage(){if(location.href.includes('/game?key=')){this.startNewGame();}},handleUrlChange(){if(location.href.includes('/game?key=')&&this.isTracking){this.startNewGame();}else if(!location.href.includes('/game?key=')&&this.currentGame){this.endCurrentGame();}},startNewGame(){if(!this.isTracking)return;this.currentGame={id:Date.now(),startTime:new Date(),questions:[],finalScore:null,gameUrl:location.href,endTime:null};console.log('Zetamac Tracker: New game started');this.updateUI();},endCurrentGame(){if(!this.currentGame)return;this.currentGame.endTime=new Date();this.games.push(this.currentGame);localStorage.setItem('zetamacGames',JSON.stringify(this.games));console.log('Zetamac Tracker: Game ended with',this.currentGame.questions.length,'questions');this.currentGame=null;this.updateUI();},checkForGameStart(){const startButton=document.querySelector('button, input[type="button"], input[type="submit"]');if(startButton&&(startButton.textContent.toLowerCase().includes('start')||startButton.value.toLowerCase().includes('start'))){if(!startButton.dataset.trackerBound){startButton.addEventListener('click',()=>{if(this.isTracking){setTimeout(()=>{if(location.href.includes('/game?key=')){this.startNewGame();}},500);}});startButton.dataset.trackerBound='true';}}},checkForNewQuestion(){if(!this.currentGame)return;const mathElements=document.querySelectorAll('span, div, p, td');let questionFound=false;for(let el of mathElements){const text=el.textContent.trim();if(text.match(/^\d+[\+\-\×\*\/÷]\d+$/)&&!el.dataset.tracked){el.dataset.tracked='true';const questionData={question:text,startTime:Date.now(),endTime:null,answer:null,responseTime:null};this.currentGame.questions.push(questionData);this.questionStartTime=Date.now();console.log('Question found:',text);questionFound=true;break;}}if(questionFound){this.updateUI();}const inputs=document.querySelectorAll('input[type="text"], input[type="number"]');inputs.forEach(input=>{if(!input.dataset.trackerBound){input.addEventListener('keydown',(e)=>{if(e.key==='Enter'&&this.currentGame&&this.currentGame.questions.length>0){const currentQuestion=this.currentGame.questions[this.currentGame.questions.length-1];if(!currentQuestion.endTime){currentQuestion.endTime=Date.now();currentQuestion.answer=input.value;currentQuestion.responseTime=(currentQuestion.endTime-currentQuestion.startTime)/1000;console.log('Answer submitted:',input.value,'Time:',(currentQuestion.responseTime)+'s');this.updateUI();}}});input.dataset.trackerBound='true';}});},checkForScore(){if(!this.currentGame)return;const elements=document.querySelectorAll('*');for(let el of elements){const text=el.textContent;if(text.includes('Score')&&text.match(/\d+/)){const scoreMatch=text.match(/(\d+)/);if(scoreMatch&&!this.currentGame.finalScore){const score=parseInt(scoreMatch[1]);if(score>0){this.currentGame.finalScore=score;console.log('Final score found:',score);this.updateUI();break;}}}}},toggle(){this.isTracking=!this.isTracking;if(this.isTracking){console.log('Zetamac Tracker: Started tracking');}else{console.log('Zetamac Tracker: Stopped tracking');if(this.currentGame){this.endCurrentGame();}}this.updateUI();},clear(){if(confirm('Clear all tracked games?')){this.games=[];this.currentGame=null;localStorage.removeItem('zetamacGames');this.updateUI();}},exportCSV(){const csvData=this.generateCSV();const blob=new Blob([csvData],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='zetamac-performance-'+new Date().toISOString().split('T')[0]+'.csv';a.click();},copyToClipboard(){const csvData=this.generateCSV();navigator.clipboard.writeText(csvData).then(()=>{alert('Data copied to clipboard!');}).catch(()=>{const textarea=document.createElement('textarea');textarea.value=csvData;document.body.appendChild(textarea);textarea.select();document.execCommand('copy');document.body.removeChild(textarea);alert('Data copied to clipboard!');});},generateCSV(){let csv='Game ID,Game Start,Game End,Game URL,Final Score,Question Number,Question,Answer,Response Time (s),Question Start,Question End\\n';this.games.forEach(game=>{game.questions.forEach((q,index)=>{csv+=\`"\${game.id}","\${game.startTime}","\${game.endTime||''}","\${game.gameUrl}","\${game.finalScore||''}","\${index+1}","\${q.question}","\${q.answer||''}","\${q.responseTime||''}","\${new Date(q.startTime)}","\${q.endTime?new Date(q.endTime):''}"\n\`;});});if(this.currentGame){this.currentGame.questions.forEach((q,index)=>{csv+=\`"\${this.currentGame.id}","\${this.currentGame.startTime}","","\${this.currentGame.gameUrl}","\${this.currentGame.finalScore||''}","\${index+1}","\${q.question}","\${q.answer||''}","\${q.responseTime||''}","\${new Date(q.startTime)}","\${q.endTime?new Date(q.endTime):''}"\n\`;});}return csv;},showStats(){const totalGames=this.games.length+(this.currentGame?1:0);const totalQuestions=this.getTotalQuestions();const avgQuestionsPerGame=totalGames>0?Math.round(totalQuestions/totalGames):0;const avgResponseTime=this.getAverageResponseTime();alert(\`Game Statistics:\\nTotal Games: \${totalGames}\\nTotal Questions: \${totalQuestions}\\nAvg Questions/Game: \${avgQuestionsPerGame}\\nAvg Response Time: \${avgResponseTime}s\`);},getTotalQuestions(){return this.games.reduce((total,game)=>total+game.questions.length,0)+(this.currentGame?this.currentGame.questions.length:0);},getAverageTime(game){const answeredQuestions=game.questions.filter(q=>q.responseTime);if(answeredQuestions.length===0)return'--';const total=answeredQuestions.reduce((sum,q)=>sum+q.responseTime,0);return(total/answeredQuestions.length).toFixed(2);},getAverageResponseTime(){let totalTime=0;let totalQuestions=0;this.games.forEach(game=>{game.questions.forEach(q=>{if(q.responseTime){totalTime+=q.responseTime;totalQuestions++;}});});if(this.currentGame){this.currentGame.questions.forEach(q=>{if(q.responseTime){totalTime+=q.responseTime;totalQuestions++;}});}return totalQuestions>0?(totalTime/totalQuestions).toFixed(2):'--';},updateUI(){if(!this.ui)return;const content=document.getElementById('tracker-content');if(content){content.innerHTML=\`<div style="margin-bottom:12px;font-size:12px;"><div style="opacity:0.9;margin-bottom:4px;">Status: \${this.isTracking?'🟢 Tracking':'🔴 Stopped'}</div><div style="opacity:0.9;">Games: \${this.games.length} | Total Questions: \${this.getTotalQuestions()}</div></div><div style="display:flex;gap:8px;margin-bottom:12px;"><button id="tracker-toggle" style="flex:1;padding:8px;border:none;border-radius:6px;background:\${this.isTracking?'#ef4444':'#10b981'};color:white;font-size:12px;cursor:pointer;font-weight:500;">\${this.isTracking?'Stop':'Start'}</button><button id="tracker-clear" style="padding:8px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;font-size:12px;cursor:pointer;">Clear</button></div><div style="display:flex;gap:8px;margin-bottom:12px;"><button id="tracker-csv" style="flex:1;padding:8px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;font-size:12px;cursor:pointer;">📄 CSV</button><button id="tracker-copy" style="flex:1;padding:8px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;font-size:12px;cursor:pointer;">📋 Copy</button><button id="tracker-stats" style="padding:8px;border:none;border-radius:6px;background:rgba(255,255,255,0.2);color:white;font-size:12px;cursor:pointer;">📊</button></div><div id="current-game-info" style="padding:8px;background:rgba(255,255,255,0.1);border-radius:6px;font-size:12px;display:\${this.currentGame?'block':'none'};"><div>Current Game Questions: <span id="current-questions">\${this.currentGame?this.currentGame.questions.length:0}</span></div><div>Average Time: <span id="current-avg-time">\${this.currentGame?this.getAverageTime(this.currentGame):'--'}</span>s</div></div>\`;this.bindEvents();}}};tracker.init();window.zetamacTracker=tracker;})();`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookmarkletCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadAsFile = () => {
    const blob = new Blob([bookmarkletCode], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'zetamac-tracker-bookmarklet.js';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">
              Zetamac Game Performance Tracker
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A powerful bookmarklet to track your arithmetic game performance, 
            timing, and scores with detailed analytics and export capabilities.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Clock className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Real-time Tracking</h3>
            <p className="text-gray-600 text-sm">
              Automatically tracks every question, response time, and answer as you play
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Target className="w-8 h-8 text-green-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Multi-Game Sessions</h3>
            <p className="text-gray-600 text-sm">
              Track multiple games in a session with persistent local storage
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <Download className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Export Options</h3>
            <p className="text-gray-600 text-sm">
              Export data as CSV or copy to clipboard for further analysis
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Use</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">1</div>
              <div>
                <h3 className="font-semibold text-gray-900">Copy the Bookmarklet Code</h3>
                <p className="text-gray-600">Use the copy button below to copy the complete bookmarklet code</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">2</div>
              <div>
                <h3 className="font-semibold text-gray-900">Create a Bookmark</h3>
                <p className="text-gray-600">Create a new bookmark in your browser and paste the code as the URL</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">3</div>
              <div>
                <h3 className="font-semibold text-gray-900">Navigate to Zetamac</h3>
                <p className="text-gray-600">Go to <code className="bg-gray-100 px-2 py-1 rounded">https://arithmetic.zetamac.com/</code></p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-semibold text-sm">4</div>
              <div>
                <h3 className="font-semibold text-gray-900">Activate Tracker</h3>
                <p className="text-gray-600">Click your bookmarklet to open the tracker, then click "Start" to begin tracking</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookmarklet Code */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Code className="w-6 h-6" />
              Bookmarklet Code
            </h2>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={downloadAsFile}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
            <code className="text-sm text-gray-800 break-all">
              {bookmarkletCode}
            </code>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Quick Setup Tip</h3>
            <p className="text-blue-800 text-sm">
              Copy this entire code, then create a new bookmark in your browser. 
              Name it "Zetamac Tracker" and paste this code as the URL. 
              The tracker will appear as a floating panel when activated!
            </p>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tracker Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Question-by-question timing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Answer accuracy tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Final score capture</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Multi-game session support</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">CSV export functionality</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Clipboard copy feature</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Performance statistics</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Persistent local storage</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;