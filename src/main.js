// ===== FIREBASE DATABASE INTEGRATION =====
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, push } from 'firebase/database';
import { firebaseConfig } from './firebase-config.js';
import { isStudentAuthorized, getSimilarNames, authorizedStudents } from './authorized-students.js';

// Initialize Firebase
let db = null;
try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log('Firebase connected successfully');
} catch (e) {
  console.warn('Firebase not configured yet. Results will not be saved to database.');
}

// ===== SEND RESULTS TO FIREBASE =====
function sendToFirebase(data) {
  if (!db) return;
  try {
    const resultsRef = ref(db, 'exam_results');
    push(resultsRef, {
      ...data,
      timestamp: new Date().toISOString()
    });
  } catch (e) {
    console.warn('Failed to save to Firebase:', e);
  }
}

// ===== ALL 100 QUESTIONS DATABASE =====
const allQuestions = [
{id:1,ch:"Network Security",q:"What is malware?",opts:["A type of hardware component","Software intentionally designed to cause damage to computer systems","A network protocol","An operating system"],ans:1},
{id:2,ch:"Network Security",q:"Which type of malware requires user action to spread?",opts:["Worm","Virus","Ransomware","Adware"],ans:1},
{id:3,ch:"Network Security",q:"What is the key characteristic of a Worm?",opts:["Requires user action to spread","Encrypts victim's files","Self-replicating across networks without user action","Displays unwanted advertisements"],ans:2},
{id:4,ch:"Network Security",q:"What does ransomware do?",opts:["Monitors user activity secretly","Displays unwanted advertisements","Encrypts victim's files and demands payment","Opens backdoors for attackers"],ans:2},
{id:5,ch:"Network Security",q:"WannaCry is an example of which type of malware?",opts:["Virus","Worm","Ransomware","Trojan Horse"],ans:2},
{id:6,ch:"Network Security",q:"What is the main characteristic of a Trojan Horse?",opts:["Self-replicates across networks","Disguises as legitimate software and opens backdoors","Encrypts files for ransom","Tracks browsing habits"],ans:1},
{id:7,ch:"Network Security",q:"Which malware type includes keyloggers?",opts:["Adware","Ransomware","Spyware","Virus"],ans:2},
{id:8,ch:"Network Security",q:"What is a DDoS attack?",opts:["Single source floods target with requests","Multiple sources (botnet) attack simultaneously","Inserts malicious SQL queries","Exploits TCP handshake"],ans:1},
{id:9,ch:"Network Security",q:"SQL Injection attacks target:",opts:["Network protocols","Input fields in web applications","Email systems","Hardware devices"],ans:1},
{id:10,ch:"Network Security",q:"What is Phishing?",opts:["Fraudulent voice calls","Fake emails pretending to be from legitimate sources","Malicious text messages","Infected USB drives"],ans:1},
{id:11,ch:"Network Security",q:"Vishing attacks are conducted through:",opts:["Email","Phone calls","SMS","USB drives"],ans:1},
{id:12,ch:"Network Security",q:"What is Smishing?",opts:["Email phishing","Voice phishing","SMS-based phishing with malicious links","Physical baiting"],ans:2},
{id:13,ch:"Network Security",q:"Whaling targets:",opts:["Regular employees","C-level executives (CEO, CFO)","IT administrators only","External vendors"],ans:1},
{id:14,ch:"Network Security",q:"Which firewall type provides the most comprehensive protection?",opts:["Packet Filter","Stateful Inspection","Application Layer","Next-Gen Firewall (NGFW)"],ans:3},
{id:15,ch:"Network Security",q:"AES encryption is:",opts:["Symmetric encryption (same key for encrypt/decrypt)","Asymmetric encryption","A hashing algorithm","A network protocol"],ans:0},
{id:16,ch:"Network Security",q:"RSA encryption uses:",opts:["Same key for encryption and decryption","Public key encrypts, private key decrypts","No keys at all","Only private keys"],ans:1},
{id:17,ch:"Network Security",q:"What does a VPN do?",opts:["Speeds up internet connection","Creates an encrypted tunnel for secure communication","Blocks all incoming traffic","Removes malware automatically"],ans:1},
{id:18,ch:"Network Security",q:'"Something you ARE" in MFA refers to:',opts:["Password and PIN","Phone and smart card","Biometrics (fingerprint, Face ID)","Security questions"],ans:2},
{id:19,ch:"Network Security",q:"WPA3 is used for:",opts:["Email encryption","Wi-Fi security protocol","VPN tunnels","Web browsing"],ans:1},
{id:20,ch:"Network Security",q:"What is the recommended minimum password length?",opts:["6 characters","8 characters","12+ characters","4 characters"],ans:2},
{id:21,ch:"Intro to AI",q:"What is Artificial Intelligence?",opts:["A new programming language","Simulation of human intelligence by computer systems","A type of hardware","An operating system"],ans:1},
{id:22,ch:"Intro to AI",q:'When was the term "Artificial Intelligence" officially coined?',opts:["1950","1956","1966","1997"],ans:1},
{id:23,ch:"Intro to AI",q:'Who coined the term "Artificial Intelligence"?',opts:["Alan Turing","John McCarthy","Garry Kasparov","Geoffrey Hinton"],ans:1},
{id:24,ch:"Intro to AI",q:"The Dartmouth Conference took place in:",opts:["1950","1956","1974","1997"],ans:1},
{id:25,ch:"Intro to AI",q:"Who proposed the Turing Test?",opts:["John McCarthy","Alan Turing","Marvin Minsky","Herbert Simon"],ans:1},
{id:26,ch:"Intro to AI",q:"The Turing Test was proposed in:",opts:["1950","1956","1966","1974"],ans:0},
{id:27,ch:"Intro to AI",q:"What does ANI stand for?",opts:["Advanced Neural Intelligence","Artificial Narrow Intelligence","Automated Network Interface","Artificial Natural Intelligence"],ans:1},
{id:28,ch:"Intro to AI",q:"All current AI systems are classified as:",opts:["AGI (General AI)","ANI (Narrow AI)","ASI (Super AI)","Human-level AI"],ans:1},
{id:29,ch:"Intro to AI",q:"ChatGPT and GPT-4 are examples of:",opts:["General AI (AGI)","Narrow AI (ANI)","Super AI (ASI)","Biological AI"],ans:1},
{id:30,ch:"Intro to AI",q:"What type of AI is currently hypothetical and would surpass all human intelligence?",opts:["ANI","AGI","ASI (Super AI)","Narrow AI"],ans:2},
{id:31,ch:"Intro to AI",q:"ELIZA was:",opts:["The first chatbot developed at MIT in 1966","A chess-playing computer","An image recognition system","A self-driving car"],ans:0},
{id:32,ch:"Intro to AI",q:"IBM Deep Blue defeated Garry Kasparov in:",opts:["1990","1995","1997","2000"],ans:2},
{id:33,ch:"Intro to AI",q:"The first AI Winter occurred during:",opts:["1950-1956","1974-1980","1990-1995","2000-2005"],ans:1},
{id:34,ch:"Intro to AI",q:"The Deep Learning revolution began around:",opts:["1997","2005","2012","2018"],ans:2},
{id:35,ch:"Intro to AI",q:"Supervised Learning uses:",opts:["Unlabeled data only","Labeled training data with known outputs","Trial-and-error with rewards","No training data at all"],ans:1},
{id:36,ch:"Intro to AI",q:"Which learning type is used for customer segmentation?",opts:["Supervised Learning","Unsupervised Learning","Reinforcement Learning","Transfer Learning"],ans:1},
{id:37,ch:"Intro to AI",q:"Self-driving cars primarily use which type of learning?",opts:["Supervised Learning only","Unsupervised Learning only","Reinforcement Learning","No machine learning"],ans:2},
{id:38,ch:"Intro to AI",q:"Compared to humans, AI is:",opts:["More creative and original","Extremely fast at computation but limited in creativity","Better at learning from few examples","Has full emotional intelligence"],ans:1},
{id:39,ch:"Intro to AI",q:"NLP stands for:",opts:["Neural Logic Processing","Natural Language Processing","Network Layer Protocol","New Learning Paradigm"],ans:1},
{id:40,ch:"Intro to AI",q:"AlexNet winning ImageNet in 2012 marked the start of:",opts:["AI Winter","Deep Learning revolution","Expert systems era","First AI chatbot"],ans:1},
{id:41,ch:"AI Techniques",q:"Neural networks are inspired by:",opts:["Computer circuits","Biological neurons in the brain","Chemical reactions","Mathematical equations only"],ans:1},
{id:42,ch:"AI Techniques",q:"What is Deep Learning?",opts:["Learning without data","Neural networks with multiple hidden layers","A type of supervised learning only","Learning that takes a long time"],ans:1},
{id:43,ch:"AI Techniques",q:"The Input Layer in a neural network:",opts:["Generates predictions","Learns internal patterns","Receives raw features/data","Applies activation functions"],ans:2},
{id:44,ch:"AI Techniques",q:"CNN stands for:",opts:["Computer Neural Network","Convolutional Neural Network","Connected Node Network","Central Neuron Network"],ans:1},
{id:45,ch:"AI Techniques",q:"CNN is primarily used for:",opts:["Text generation","Image recognition and spatial data","Time series prediction","Audio synthesis"],ans:1},
{id:46,ch:"AI Techniques",q:"RNN is best suited for:",opts:["Image classification","Sequential/temporal data like language and time series","Static data only","Database queries"],ans:1},
{id:47,ch:"AI Techniques",q:"ChatGPT and GPT-4 are based on which architecture?",opts:["CNN","RNN","Transformer","GAN"],ans:2},
{id:48,ch:"AI Techniques",q:"GAN stands for:",opts:["General Automated Network","Generative Adversarial Network","Guided Attention Network","Global Analysis Network"],ans:1},
{id:49,ch:"AI Techniques",q:"GANs are commonly used for:",opts:["Spam detection","Image synthesis and deepfakes","Database management","Network security"],ans:1},
{id:50,ch:"AI Techniques",q:"MYCIN was an expert system in which domain?",opts:["Chemical analysis","Medical diagnosis","Computer configuration","Geology"],ans:1},
{id:51,ch:"AI Techniques",q:"Expert systems consist of which three components?",opts:["CPU, RAM, Storage","User Interface, Inference Engine, Knowledge Base","Input, Process, Output","Hardware, Software, Network"],ans:1},
{id:52,ch:"AI Techniques",q:"Genetic Algorithms are inspired by:",opts:["Human brain structure","Darwin's theory of natural selection","Chemical reactions","Quantum physics"],ans:1},
{id:53,ch:"AI Techniques",q:'In Genetic Algorithms, "Crossover" means:',opts:["Eliminating weak solutions","Combining pairs of solutions to create offspring","Introducing random changes","Evaluating fitness scores"],ans:1},
{id:54,ch:"AI Techniques",q:'"Mutation" in Genetic Algorithms:',opts:["Combines solutions together","Introduces random variations to maintain diversity","Selects the fittest individuals","Creates initial population"],ans:1},
{id:55,ch:"AI Techniques",q:"Which approach is best for images and language prediction?",opts:["Expert Systems","Neural Networks","Genetic Algorithms","Rule-based systems"],ans:1},
{id:56,ch:"AI Techniques",q:"A weakness of neural networks is:",opts:["Low accuracy",'Needs big data and acts as a "black box"',"Cannot process images","Too slow for computation"],ans:1},
{id:57,ch:"AI Techniques",q:"The Transformer architecture relies on:",opts:["Convolution operations","Recurrent connections","Attention mechanism","Genetic operations"],ans:2},
{id:58,ch:"AI Techniques",q:"XCON expert system saved DEC approximately:",opts:["$10M/year","$40M/year","$100M/year","$1M/year"],ans:1},
{id:59,ch:"AI Techniques",q:"Hidden layers in neural networks are responsible for:",opts:["Receiving input data","Producing final output","Learning internal representations and patterns","Storing data permanently"],ans:2},
{id:60,ch:"AI Techniques",q:"Face recognition applications primarily use:",opts:["RNN","CNN","GAN","Expert Systems"],ans:1},
{id:61,ch:"AI Daily Life",q:"Which virtual assistant was launched first?",opts:["Google Assistant (2016)","Siri (2011)","Alexa (2014)","Cortana (2014)"],ans:1},
{id:62,ch:"AI Daily Life",q:"Alexa is developed by:",opts:["Apple","Google","Amazon","Microsoft"],ans:2},
{id:63,ch:"AI Daily Life",q:"The first step in virtual assistant pipeline is:",opts:["NLP","Speech Recognition (ASR)","Intent Recognition","Task Execution"],ans:1},
{id:64,ch:"AI Daily Life",q:"ASR in virtual assistants stands for:",opts:["Artificial Speech Recognition","Automatic Speech Recognition","Advanced Sound Recording","Audio Signal Response"],ans:1},
{id:65,ch:"AI Daily Life",q:"TTS converts:",opts:["Speech to text","Text to speech","Images to text","Video to audio"],ans:1},
{id:66,ch:"AI Daily Life",q:"AI in smartphone cameras includes:",opts:["Only basic photo capture","Scene recognition, portrait mode, and night mode","Manual focus only","Film development"],ans:1},
{id:67,ch:"AI Daily Life",q:"Face ID on smartphones is an example of:",opts:["Something you KNOW (knowledge)","Something you HAVE (possession)","Something you ARE (biometrics)","Something you DO"],ans:2},
{id:68,ch:"AI Daily Life",q:"Netflix uses AI for:",opts:["Creating new movies","Personalized content recommendations","Recording shows","Broadcast transmission"],ans:1},
{id:69,ch:"AI Daily Life",q:"Gmail's spam filtering achieves approximately what accuracy?",opts:["90%","95%","99.9%","80%"],ans:2},
{id:70,ch:"AI Daily Life",q:"Google Maps uses AI for:",opts:["Taking photos of roads","Real-time traffic prediction and route optimization","Building physical maps","Satellite launching"],ans:1},
{id:71,ch:"AI Daily Life",q:"A limitation of consumer AI is:",opts:["Too fast processing","Privacy and data concerns","Too much creativity","Never needs updates"],ans:1},
{id:72,ch:"AI Daily Life",q:"Predictive text on keyboards uses:",opts:["Random word generation","AI-based pattern recognition and NLP","Manual dictionary lookup","No technology at all"],ans:1},
{id:73,ch:"AI Daily Life",q:"Cortana is developed by:",opts:["Apple","Google","Amazon","Microsoft"],ans:3},
{id:74,ch:"AI Daily Life",q:"After Speech Recognition, the next step in virtual assistant pipeline is:",opts:["Task Execution","Natural Language Processing (NLP)","Speech Synthesis","Data Storage"],ans:1},
{id:75,ch:"AI Daily Life",q:"AI in smartphones helps with battery management by:",opts:["Increasing battery size","Learning usage patterns and adaptive power management","Turning off the phone","Adding more batteries"],ans:1},
{id:76,ch:"AI Daily Life",q:"Amazon E-commerce uses AI for:",opts:["Manufacturing products","Product recommendations and review sentiment analysis","Shipping delivery only","Building warehouses"],ans:1},
{id:77,ch:"AI Daily Life",q:"Social Media uses AI for:",opts:["Creating user accounts","Feed ranking algorithms and friend suggestions","Physical server management","Internet connectivity"],ans:1},
{id:78,ch:"AI Daily Life",q:"Google Photos uses AI to:",opts:["Take photos","Automatically organize and face cluster photos","Print photos","Delete all photos"],ans:1},
{id:79,ch:"AI Daily Life",q:"Google Assistant was launched in:",opts:["2011","2014","2016","2018"],ans:2},
{id:80,ch:"AI Daily Life",q:"Intent Recognition in virtual assistants:",opts:["Converts speech to text","Generates voice output","Identifies what the user wants to accomplish","Stores user data"],ans:2},
{id:81,ch:"AI Applications",q:"AI in medical imaging can achieve cancer detection accuracy of:",opts:["70%","85%","95%+","50%"],ans:2},
{id:82,ch:"AI Applications",q:"AlphaFold is used for:",opts:["Playing chess","Protein structure prediction in drug discovery","Self-driving cars","Language translation"],ans:1},
{id:83,ch:"AI Applications",q:"Da Vinci System is used for:",opts:["Fraud detection","Robotic surgery","Traffic management","Financial trading"],ans:1},
{id:84,ch:"AI Applications",q:"AI can reduce drug discovery timelines from 10+ years to:",opts:["5 years","Months","20 years","No change"],ans:1},
{id:85,ch:"AI Applications",q:"AI-powered fraud detection can reduce losses by:",opts:["10-20%","40-70%","5-10%","90-100%"],ans:1},
{id:86,ch:"AI Applications",q:"Algorithmic trading accounts for what percentage of market volume?",opts:["20%","50%","70%+","10%"],ans:2},
{id:87,ch:"AI Applications",q:"Wealthfront and Betterment are examples of:",opts:["Self-driving car companies","Robo-Advisors (automated portfolio management)","Medical imaging systems","Social media platforms"],ans:1},
{id:88,ch:"AI Applications",q:"Tesla Autopilot represents which SAE level of autonomy?",opts:["Level 0","Level 1","Level 2 (Partial Automation)","Level 5"],ans:2},
{id:89,ch:"AI Applications",q:"At SAE Level 5:",opts:["Human performs all driving tasks","System assists with steering only","Human must monitor at all times","Fully autonomous in all conditions, no human needed"],ans:3},
{id:90,ch:"AI Applications",q:"What percentage of road accidents are attributed to human error?",opts:["50%","75%","94%","30%"],ans:2},
{id:91,ch:"AI Applications",q:"Smart traffic systems can reduce congestion by:",opts:["5%","10%","25%","50%"],ans:2},
{id:92,ch:"AI Applications",q:"AI in aviation can achieve fuel savings of:",opts:["5%","15%","30%","50%"],ans:1},
{id:93,ch:"AI Applications",q:"The projected healthcare AI market size by 2030 is:",opts:["$50 Billion","$100 Billion","$150 Billion","$200 Billion"],ans:2},
{id:94,ch:"AI Applications",q:"AI can speed up diagnosis time by:",opts:["10% reduction","25% reduction","40% reduction","60% reduction"],ans:2},
{id:95,ch:"AI Applications",q:"SAE Level 3 requires:",opts:["Human always drives","Human intervenes when requested by system","No human in vehicle","System only assists steering"],ans:1},
{id:96,ch:"AI Applications",q:"Waymo is an example of:",opts:["Medical imaging AI","Robo-advisor","Self-driving car technology","Fraud detection system"],ans:2},
{id:97,ch:"AI Applications",q:"The primary challenge in healthcare AI is:",opts:["Slow processing","Patient privacy and trust","Low accuracy","High cost of hardware"],ans:1},
{id:98,ch:"AI Applications",q:"The primary challenge in finance AI is:",opts:["Patient privacy","Algorithmic bias and job displacement","Regulation liability","Low accuracy"],ans:1},
{id:99,ch:"AI Applications",q:"Level 4 autonomy means:",opts:["No automation","Partial automation","Fully autonomous within defined conditions (geo-fenced)","Driver assistance only"],ans:2},
{id:100,ch:"AI Applications",q:"AI could potentially prevent how many traffic deaths annually worldwide?",opts:["500,000","1 million","1.35 million+","100,000"],ans:2}
];

// ===== CONSTANTS =====
const TOTAL_Q = 25;
const POINTS_PER_Q = 4;
const MAX_ATTEMPTS = 5;
const Q_TIME_LIMIT = 120;
const letters = ['A','B','C','D'];
const STORAGE_KEY = 'it_exam_attempts';

// ===== EXAM STATE =====
let examQuestions = [];
let currentQ = 0;
let answers = [];
let qTimerInterval = null;
let qTimeLeft = Q_TIME_LIMIT;

// ===== ATTEMPTS =====
function getAttempts() {
    try { return parseInt(localStorage.getItem(STORAGE_KEY)) || 0; } catch(e) { return 0; }
}
function setAttempts(n) {
    try { localStorage.setItem(STORAGE_KEY, n); } catch(e) {}
}
function checkAttempts() {
    const used = getAttempts();
    const remaining = MAX_ATTEMPTS - used;
    if (remaining <= 0) {
        document.getElementById('attemptsExhausted').style.display = 'block';
        document.getElementById('btnStart').disabled = true;
        document.getElementById('btnStart').style.display = 'none';
        return false;
    }
    if (used > 0) {
        const warn = document.getElementById('attemptsWarning');
        warn.style.display = 'block';
        warn.innerHTML = '\u26A0 \u0644\u0642\u062F \u0627\u0633\u062A\u062E\u062F\u0645\u062A <strong>' + used + '</strong> \u0645\u0646 <strong>' + MAX_ATTEMPTS + '</strong> \u0645\u062D\u0627\u0648\u0644\u0627\u062A. \u0627\u0644\u0645\u062A\u0628\u0642\u064A: <strong>' + remaining + '</strong> \u0645\u062D\u0627\u0648\u0644\u0629.';
    }
    return true;
}

// ===== FORM VALIDATION =====
function validateForm() {
    const name = document.getElementById('studentName').value.trim();
    const dept = document.getElementById('studentDept').value;
    const stage = document.getElementById('studentStage').value;
    const nameParts = name.split(/\s+/).filter(p => p.length > 1);
    const nameValid = nameParts.length >= 3;
    
    // Check if student is authorized
    const isAuthorized = isStudentAuthorized(name);
    const nameErrorEl = document.getElementById('nameError');
    const authErrorEl = document.getElementById('authError');
    
    // Show name format error
    if (name.length > 0 && !nameValid) {
        nameErrorEl.style.display = 'block';
        nameErrorEl.textContent = '⚠ يرجى إدخال الاسم الثلاثي كاملاً (3 أجزاء على الأقل)';
    } else {
        nameErrorEl.style.display = 'none';
    }
    
    // Show authorization error
    if (nameValid && !isAuthorized) {
        if (!authErrorEl) {
            const errorDiv = document.createElement('div');
            errorDiv.id = 'authError';
            errorDiv.className = 'auth-error';
            errorDiv.style.cssText = 'background:#ffeef0;border:1px solid #f5c6cb;color:#d63031;padding:15px;border-radius:10px;margin:15px auto;max-width:420px;text-align:center;';
            document.getElementById('nameError').parentNode.appendChild(errorDiv);
        }
        const authErr = document.getElementById('authError');
        
        // Check for similar names
        const similar = getSimilarNames(name);
        let suggestion = '';
        if (similar.length > 0) {
            suggestion = '<br><small style="color:#666">هل تقصد: <strong>' + similar[0] + '</strong>؟</small>';
        }
        
        authErr.innerHTML = '⛔ هذا الاسم غير مسجل في قائمة الطلاب المصرح لهم بالامتحان' + suggestion;
        authErr.style.display = 'block';
    } else if (document.getElementById('authError')) {
        document.getElementById('authError').style.display = 'none';
    }
    
    const canStart = nameValid && isAuthorized && dept !== '' && stage !== '' && (MAX_ATTEMPTS - getAttempts()) > 0;
    document.getElementById('btnStart').disabled = !canStart;
}

// ===== SHUFFLE =====
function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function selectQuestions() {
    const ch1 = shuffle(allQuestions.filter(q => q.id <= 20)).slice(0, 5);
    const ch2 = shuffle(allQuestions.filter(q => q.id >= 21 && q.id <= 40)).slice(0, 5);
    const ch3 = shuffle(allQuestions.filter(q => q.id >= 41 && q.id <= 60)).slice(0, 5);
    const ch4 = shuffle(allQuestions.filter(q => q.id >= 61 && q.id <= 80)).slice(0, 5);
    const ch5 = shuffle(allQuestions.filter(q => q.id >= 81 && q.id <= 100)).slice(0, 5);
    let selected = shuffle([...ch1, ...ch2, ...ch3, ...ch4, ...ch5]);
    selected = selected.map(q => {
        const indices = [0,1,2,3];
        const shuffled = shuffle(indices);
        const newOpts = shuffled.map(i => q.opts[i]);
        const newAns = shuffled.indexOf(q.ans);
        return { ...q, opts: newOpts, ans: newAns };
    });
    return selected;
}

// ===== START EXAM =====
window.startExam = function() {
    const name = document.getElementById('studentName').value.trim();
    const dept = document.getElementById('studentDept').value;
    const stage = document.getElementById('studentStage').value;
    const nameParts = name.split(/\s+/).filter(p => p.length > 1);
    if (nameParts.length < 3 || !dept || !stage) return;
    
    // Double-check authorization
    if (!isStudentAuthorized(name)) {
        alert('⛔ عذراً، اسمك غير مسجل في قائمة الطلاب المصرح لهم بالامتحان.\nSorry, your name is not in the authorized students list.');
        return;
    }
    
    setAttempts(getAttempts() + 1);
    examQuestions = selectQuestions();
    answers = new Array(TOTAL_Q).fill(-1);
    currentQ = 0;
    document.getElementById('displayInfo').innerHTML = '\uD83D\uDC64 <strong>' + escapeHtml(name) + '</strong><br>\uD83C\uDFDB ' + escapeHtml(dept) + ' | \uD83D\uDCDA ' + escapeHtml(stage);
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';
    buildDots();
    showQuestion();
    startQuestionTimer();
}

function startQuestionTimer() {
    clearInterval(qTimerInterval);
    qTimeLeft = Q_TIME_LIMIT;
    updateQTimerDisplay();
    document.getElementById('qTimer').classList.remove('warning');
    qTimerInterval = setInterval(function() {
        qTimeLeft--;
        updateQTimerDisplay();
        if (qTimeLeft <= 30) document.getElementById('qTimer').classList.add('warning');
        if (qTimeLeft <= 0) {
            clearInterval(qTimerInterval);
            if (currentQ < TOTAL_Q - 1) { currentQ++; showQuestion(); startQuestionTimer(); }
            else { window.submitExam(true); }
        }
    }, 1000);
}
function updateQTimerDisplay() {
    var m = Math.floor(qTimeLeft / 60), s = qTimeLeft % 60;
    document.getElementById('qTimer').textContent = '\u23F1 ' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
}

function buildDots() {
    var c = document.getElementById('questionDots'); c.innerHTML = '';
    for (var i = 0; i < TOTAL_Q; i++) {
        var d = document.createElement('div');
        d.className = 'dot' + (i === 0 ? ' current' : '');
        d.textContent = i + 1;
        (function(idx) { d.onclick = function() { if (idx <= currentQ || answers[idx] !== -1) { currentQ = idx; showQuestion(); startQuestionTimer(); } }; })(i);
        c.appendChild(d);
    }
}
function updateDots() {
    document.querySelectorAll('.dot').forEach(function(d, i) {
        d.className = 'dot';
        if (answers[i] !== -1) d.classList.add('answered');
        if (i === currentQ) d.classList.add('current');
        if (i > currentQ && answers[i] === -1) d.classList.add('locked');
    });
}

function showQuestion() {
    var q = examQuestions[currentQ];
    document.getElementById('qNum').textContent = 'Question ' + (currentQ + 1) + ' / ' + TOTAL_Q;
    document.getElementById('qChapter').textContent = q.ch;
    document.getElementById('qText').textContent = q.q;
    document.getElementById('timer').textContent = '\uD83D\uDCCB ' + (currentQ + 1) + '/' + TOTAL_Q;
    document.getElementById('mustAnswerMsg').style.display = 'none';
    var list = document.getElementById('optionsList'); list.innerHTML = '';
    q.opts.forEach(function(opt, i) {
        var li = document.createElement('li');
        li.setAttribute('data-letter', letters[i]);
        li.textContent = opt;
        if (answers[currentQ] === i) li.classList.add('selected');
        li.onclick = function() { selectAnswer(i); };
        list.appendChild(li);
    });
    document.getElementById('progressFill').style.width = ((currentQ + 1) / TOTAL_Q * 100) + '%';
    document.getElementById('progressLabel').textContent = 'Question ' + (currentQ + 1) + ' of ' + TOTAL_Q;
    document.getElementById('answeredLabel').textContent = 'Answered: ' + answers.filter(a => a !== -1).length + '/' + TOTAL_Q;
    document.getElementById('btnPrev').disabled = currentQ === 0;
    if (currentQ === TOTAL_Q - 1) { document.getElementById('btnNext').style.display = 'none'; document.getElementById('btnSubmit').style.display = 'inline-block'; }
    else { document.getElementById('btnNext').style.display = 'inline-block'; document.getElementById('btnSubmit').style.display = 'none'; }
    updateDots();
}

function selectAnswer(idx) {
    answers[currentQ] = idx;
    document.querySelectorAll('.options-list li').forEach(function(li, i) { li.classList.toggle('selected', i === idx); });
    updateDots();
    document.getElementById('answeredLabel').textContent = 'Answered: ' + answers.filter(a => a !== -1).length + '/' + TOTAL_Q;
    document.getElementById('mustAnswerMsg').style.display = 'none';
}

window.nextQuestion = function() {
    if (answers[currentQ] === -1) { document.getElementById('mustAnswerMsg').style.display = 'block'; return; }
    if (currentQ < TOTAL_Q - 1) { currentQ++; showQuestion(); startQuestionTimer(); }
}
window.prevQuestion = function() {
    if (currentQ > 0) { currentQ--; showQuestion(); startQuestionTimer(); }
}

window.submitExam = function(timeUp) {
    if (!timeUp) {
        if (answers[currentQ] === -1) { document.getElementById('mustAnswerMsg').style.display = 'block'; return; }
        var unanswered = answers.filter(a => a === -1).length;
        if (unanswered > 0) { if (!confirm('You have ' + unanswered + ' unanswered question(s). Submit anyway?\n\u0644\u062F\u064A\u0643 ' + unanswered + ' \u0633\u0624\u0627\u0644 \u0628\u062F\u0648\u0646 \u0625\u062C\u0627\u0628\u0629. \u0647\u0644 \u062A\u0631\u064A\u062F \u0627\u0644\u062A\u0633\u0644\u064A\u0645\u061F')) return; }
    }
    clearInterval(qTimerInterval);
    var correct = 0, wrong = 0, skipped = 0;
    examQuestions.forEach(function(q, i) { if (answers[i] === -1) skipped++; else if (answers[i] === q.ans) correct++; else wrong++; });
    var score = correct * POINTS_PER_Q;
    var isPerfect = correct === TOTAL_Q;
    var name = document.getElementById('studentName').value.trim();
    var dept = document.getElementById('studentDept').value;
    var stage = document.getElementById('studentStage').value;
    var attemptsUsed = getAttempts();
    var attemptsLeft = MAX_ATTEMPTS - attemptsUsed;

    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';

    // Send to Firebase
    sendToFirebase({ name, department: dept, stage, score, correct, wrong, skipped, attempt: attemptsUsed, totalQuestions: TOTAL_Q });

    document.getElementById('resultName').textContent = name;
    document.getElementById('resultInfo').textContent = dept + ' | ' + stage;
    document.getElementById('resultScore').textContent = score;
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = wrong;
    document.getElementById('skippedCount').textContent = skipped;

    var circle = document.getElementById('resultCircle');
    var label = document.getElementById('resultLabel');
    var msg = document.getElementById('resultMsg');

    if (isPerfect) { circle.className='result-circle grade-perfect'; label.textContent='\uD83C\uDFC6 PERFECT! / \u062F\u0631\u062C\u0629 \u0643\u0627\u0645\u0644\u0629! \uD83C\uDFC6'; label.style.color='#f0932b'; msg.textContent=''; document.getElementById('perfectCelebration').style.display='block'; launchConfetti(); }
    else if (score >= 90) { circle.className='result-circle grade-excellent'; label.textContent='\uD83C\uDF1F Excellent! / \u0645\u0645\u062A\u0627\u0632!'; label.style.color='#00b894'; msg.textContent='Outstanding performance! Keep it up!'; }
    else if (score >= 75) { circle.className='result-circle grade-good'; label.textContent='\uD83D\uDC4F Very Good! / \u062C\u064A\u062F \u062C\u062F\u0627\u064B!'; label.style.color='#0984e3'; msg.textContent='Great work! You have a strong understanding.'; }
    else if (score >= 50) { circle.className='result-circle grade-pass'; label.textContent='\u2705 Pass / \u0646\u0627\u062C\u062D'; label.style.color='#e17055'; msg.textContent='You passed! Review the topics you missed.'; }
    else { circle.className='result-circle grade-fail'; label.textContent='\u274C Fail / \u0631\u0627\u0633\u0628'; label.style.color='#d63031'; msg.textContent='You need more study. Review all chapters carefully.'; }

    var retryBtn = document.getElementById('btnRetry');
    var attInfo = document.getElementById('attemptsInfoResult');
    if (attemptsLeft <= 0) { retryBtn.disabled = true; retryBtn.textContent = '\u26D4 No attempts left / \u0644\u0627 \u0645\u062D\u0627\u0648\u0644\u0627\u062A \u0645\u062A\u0628\u0642\u064A\u0629'; attInfo.textContent = '\u0644\u0642\u062F \u0627\u0633\u062A\u0646\u0641\u062F\u062A \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0627\u062A (' + MAX_ATTEMPTS + '/' + MAX_ATTEMPTS + ')'; }
    else { retryBtn.disabled = false; attInfo.textContent = '\u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0627\u062A \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645\u0629: ' + attemptsUsed + '/' + MAX_ATTEMPTS + ' | \u0627\u0644\u0645\u062A\u0628\u0642\u064A: ' + attemptsLeft; }

    // Build review
    var reviewDiv = document.getElementById('reviewContent'); reviewDiv.innerHTML = '';
    examQuestions.forEach(function(q, i) {
        var isCorrect = answers[i] === q.ans, isSkipped = answers[i] === -1;
        var div = document.createElement('div');
        div.className = 'review-q ' + (isSkipped ? '' : (isCorrect ? 'review-correct' : 'review-wrong'));
        var html = '<div class="rq-text">' + (i+1) + '. ' + escapeHtml(q.q) + '</div>';
        if (isSkipped) { html += '<div class="rq-answer rq-your">\u26A0 Skipped / \u0644\u0645 \u062A\u064F\u062C\u0628</div>'; html += '<div class="rq-answer rq-correct-ans">\u2713 Correct: ' + letters[q.ans] + '. ' + escapeHtml(q.opts[q.ans]) + '</div>'; }
        else if (isCorrect) { html += '<div class="rq-answer rq-your is-correct">\u2713 Your answer: ' + letters[answers[i]] + '. ' + escapeHtml(q.opts[answers[i]]) + '</div>'; }
        else { html += '<div class="rq-answer rq-your">\u2717 Your answer: ' + letters[answers[i]] + '. ' + escapeHtml(q.opts[answers[i]]) + '</div>'; html += '<div class="rq-answer rq-correct-ans">\u2713 Correct: ' + letters[q.ans] + '. ' + escapeHtml(q.opts[q.ans]) + '</div>'; }
        div.innerHTML = html;
        reviewDiv.appendChild(div);
    });
}

window.retakeExam = function() {
    if (getAttempts() >= MAX_ATTEMPTS) { alert('\u0644\u0642\u062F \u0627\u0633\u062A\u0646\u0641\u062F\u062A \u062C\u0645\u064A\u0639 \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0627\u062A!\nYou have used all available attempts!'); return; }
    location.reload();
}

function launchConfetti() {
    var container = document.getElementById('confettiContainer');
    var colors = ['#667eea','#764ba2','#f9ca24','#00b894','#d63031','#0984e3','#fdcb6e','#e17055'];
    for (var i = 0; i < 120; i++) {
        var piece = document.createElement('div'); piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.width = (Math.random() * 8 + 5) + 'px'; piece.style.height = (Math.random() * 8 + 5) + 'px';
        piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
        piece.style.animationDelay = (Math.random() * 1.5) + 's';
        container.appendChild(piece);
    }
    setTimeout(function() { container.innerHTML = ''; }, 5000);
}

function escapeHtml(text) { var d = document.createElement('div'); d.textContent = text; return d.innerHTML; }

document.addEventListener('keydown', function(e) {
    if (document.getElementById('quizScreen').style.display !== 'block') return;
    if (e.key === 'ArrowRight') window.nextQuestion();
    if (e.key === 'ArrowLeft') window.prevQuestion();
    if (e.key >= '1' && e.key <= '4') selectAnswer(parseInt(e.key) - 1);
});

document.getElementById('studentName').addEventListener('input', validateForm);
document.getElementById('studentDept').addEventListener('change', validateForm);
document.getElementById('studentStage').addEventListener('change', validateForm);

checkAttempts();
validateForm();
