// ===== ADMIN PANEL - COMPREHENSIVE DASHBOARD =====
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, update } from 'firebase/database';
import { firebaseConfig } from './firebase-config.js';
import { authorizedStudents } from './authorized-students.js';

// ===== CHECK ADMIN LOGIN =====
if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
    window.location.href = 'admin-login.html';
}

// ===== INITIALIZE FIREBASE =====
let db = null;
try {
    const app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log('Firebase connected');
} catch (e) {
    console.warn('Firebase not configured');
}

// ===== QUESTIONS DATABASE (Same as main.js) =====
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

const letters = ['A', 'B', 'C', 'D'];

// ===== STATE =====
let allResults = [];
let filteredResults = [];

// ===== TAB SWITCHING =====
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
    });
});

// ===== LOGOUT =====
window.logout = function() {
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminLoginTime');
    window.location.href = 'admin-login.html';
};

// ===== CLOSE MODAL =====
window.closeModal = function() {
    document.getElementById('detailModal').classList.remove('active');
};

// ===== LOAD RESULTS =====
window.loadResults = function() {
    if (!db) {
        document.getElementById('resultsTable').innerHTML = '<div class="no-data">❌ Firebase غير متصل</div>';
        return;
    }

    const resultsRef = ref(db, 'exam_results');
    onValue(resultsRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) {
            allResults = [];
            updateStats();
            renderResultsTable();
            renderRecentResults();
            renderAttemptsReport();
            return;
        }

        allResults = Object.entries(data).map(([key, val]) => ({
            id: key,
            ...val
        })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        updateStats();
        applyFilters();
        renderRecentResults();
        renderAttemptsReport();
    });
};

// ===== UPDATE STATS =====
function updateStats() {
    const total = allResults.length;
    const passed = allResults.filter(r => r.score >= 50).length;
    const failed = total - passed;
    const avg = total > 0 ? Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / total) : 0;

    document.getElementById('totalSubmissions').textContent = total;
    document.getElementById('passCount').textContent = passed;
    document.getElementById('failCount').textContent = failed;
    document.getElementById('avgScore').textContent = avg;
    document.getElementById('totalAuthorized').textContent = authorizedStudents.length;

    // Count currently examining (last 5 minutes activity)
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const online = allResults.filter(r => new Date(r.timestamp) > fiveMinAgo).length;
    document.getElementById('onlineNow').textContent = online;
}

// ===== APPLY FILTERS =====
function applyFilters() {
    const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const dept = document.getElementById('deptFilter')?.value || '';
    const stage = document.getElementById('stageFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';

    filteredResults = allResults.filter(r => {
        const matchSearch = !search || 
            r.name?.toLowerCase().includes(search) || 
            r.department?.toLowerCase().includes(search);
        const matchDept = !dept || r.department === dept;
        const matchStage = !stage || r.stage === stage;
        const matchStatus = !status || 
            (status === 'pass' && r.score >= 50) ||
            (status === 'fail' && r.score < 50);
        return matchSearch && matchDept && matchStage && matchStatus;
    });

    renderResultsTable();
}

// Add event listeners for filters
document.getElementById('searchInput')?.addEventListener('input', applyFilters);
document.getElementById('deptFilter')?.addEventListener('change', applyFilters);
document.getElementById('stageFilter')?.addEventListener('change', applyFilters);
document.getElementById('statusFilter')?.addEventListener('change', applyFilters);

// ===== RENDER RESULTS TABLE =====
function renderResultsTable() {
    const container = document.getElementById('resultsTable');
    
    if (filteredResults.length === 0) {
        container.innerHTML = '<div class="no-data">لا توجد نتائج مطابقة</div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>الاسم</th>
                    <th>القسم</th>
                    <th>المرحلة</th>
                    <th>الدرجة</th>
                    <th>صحيح/خطأ</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>إجراءات</th>
                </tr>
            </thead>
            <tbody>
    `;

    filteredResults.forEach((r, i) => {
        const scoreClass = r.score >= 90 ? 'badge-success' : 
                          r.score >= 70 ? 'badge-info' : 
                          r.score >= 50 ? 'badge-warning' : 'badge-danger';
        const statusBadge = r.score >= 50 ? 
            '<span class="badge badge-success">ناجح ✓</span>' : 
            '<span class="badge badge-danger">راسب ✗</span>';
        const date = new Date(r.timestamp).toLocaleString('ar-IQ');

        html += `
            <tr>
                <td>${i + 1}</td>
                <td><strong>${escapeHtml(r.name || '-')}</strong></td>
                <td>${escapeHtml(r.department || '-')}</td>
                <td>${escapeHtml(r.stage || '-')}</td>
                <td><span class="badge ${scoreClass}">${r.score}/100</span></td>
                <td>${r.correct || 0}/${r.wrong || 0}</td>
                <td>${statusBadge}</td>
                <td style="font-size:0.85em">${date}</td>
                <td>
                    <button class="btn btn-primary" style="padding:5px 10px;font-size:0.8em" onclick="viewDetails('${r.id}')">📋 تفاصيل</button>
                </td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ===== VIEW DETAILS =====
window.viewDetails = function(id) {
    const result = allResults.find(r => r.id === id);
    if (!result) return;

    document.getElementById('modalTitle').textContent = `تفاصيل اختبار: ${result.name}`;
    
    let html = `
        <div style="margin-bottom:20px">
            <p><strong>📝 الاسم:</strong> ${escapeHtml(result.name)}</p>
            <p><strong>🏛 القسم:</strong> ${escapeHtml(result.department)}</p>
            <p><strong>📚 المرحلة:</strong> ${escapeHtml(result.stage)}</p>
            <p><strong>📊 الدرجة:</strong> ${result.score}/100</p>
            <p><strong>✅ الصحيح:</strong> ${result.correct} | <strong>❌ الخطأ:</strong> ${result.wrong}</p>
            <p><strong>📅 التاريخ:</strong> ${new Date(result.timestamp).toLocaleString('ar-IQ')}</p>
        </div>
    `;

    document.getElementById('modalBody').innerHTML = html;
    document.getElementById('detailModal').classList.add('active');
};

// ===== RENDER RECENT RESULTS =====
function renderRecentResults() {
    const container = document.getElementById('recentResults');
    const recent = allResults.slice(0, 10);

    if (recent.length === 0) {
        container.innerHTML = '<div class="no-data">لا توجد نتائج بعد</div>';
        return;
    }

    let html = '<table><thead><tr><th>الاسم</th><th>القسم</th><th>الدرجة</th><th>الوقت</th></tr></thead><tbody>';
    
    recent.forEach(r => {
        const scoreClass = r.score >= 50 ? 'badge-success' : 'badge-danger';
        const time = new Date(r.timestamp).toLocaleTimeString('ar-IQ');
        html += `
            <tr>
                <td><strong>${escapeHtml(r.name || '-')}</strong></td>
                <td>${escapeHtml(r.department || '-')}</td>
                <td><span class="badge ${scoreClass}">${r.score}</span></td>
                <td>${time}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ===== RENDER ATTEMPTS REPORT =====
function renderAttemptsReport() {
    const container = document.getElementById('attemptsReport');
    
    // Group by student name
    const studentAttempts = {};
    allResults.forEach(r => {
        const name = r.name || 'غير معروف';
        if (!studentAttempts[name]) {
            studentAttempts[name] = {
                attempts: [],
                department: r.department,
                stage: r.stage
            };
        }
        studentAttempts[name].attempts.push({
            score: r.score,
            timestamp: r.timestamp
        });
    });

    if (Object.keys(studentAttempts).length === 0) {
        container.innerHTML = '<div class="no-data">لا توجد محاولات مسجلة</div>';
        return;
    }

    let html = `
        <table>
            <thead>
                <tr>
                    <th>الاسم</th>
                    <th>القسم</th>
                    <th>المرحلة</th>
                    <th>عدد المحاولات</th>
                    <th>أعلى درجة</th>
                    <th>أقل درجة</th>
                    <th>آخر محاولة</th>
                </tr>
            </thead>
            <tbody>
    `;

    Object.entries(studentAttempts)
        .sort((a, b) => b[1].attempts.length - a[1].attempts.length)
        .forEach(([name, data]) => {
            const attempts = data.attempts;
            const maxScore = Math.max(...attempts.map(a => a.score));
            const minScore = Math.min(...attempts.map(a => a.score));
            const lastAttempt = new Date(Math.max(...attempts.map(a => new Date(a.timestamp)))).toLocaleString('ar-IQ');
            const attemptsColor = attempts.length >= 5 ? 'badge-danger' : 
                                 attempts.length >= 3 ? 'badge-warning' : 'badge-info';

            html += `
                <tr>
                    <td><strong>${escapeHtml(name)}</strong></td>
                    <td>${escapeHtml(data.department || '-')}</td>
                    <td>${escapeHtml(data.stage || '-')}</td>
                    <td><span class="badge ${attemptsColor}">${attempts.length}/5</span></td>
                    <td><span class="badge badge-success">${maxScore}</span></td>
                    <td><span class="badge badge-danger">${minScore}</span></td>
                    <td style="font-size:0.85em">${lastAttempt}</td>
                </tr>
            `;
        });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ===== RENDER QUESTIONS =====
function renderQuestions(questions) {
    const container = document.getElementById('questionsList');
    
    if (questions.length === 0) {
        container.innerHTML = '<div class="no-data">لا توجد أسئلة مطابقة</div>';
        return;
    }

    let html = '';
    questions.forEach(q => {
        html += `
            <div class="question-item">
                <div class="q-header">
                    <span class="q-id">Q${q.id}</span>
                    <span class="q-chapter">${q.ch}</span>
                </div>
                <div class="q-text">${escapeHtml(q.q)}</div>
                <div class="q-options">
                    ${q.opts.map((opt, i) => `
                        <div class="q-option ${i === q.ans ? 'correct' : ''}">
                            ${letters[i]}. ${escapeHtml(opt)} ${i === q.ans ? '✓' : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// ===== FILTER QUESTIONS =====
window.filterQuestions = function() {
    const chapter = document.getElementById('chapterFilter')?.value || '';
    const search = document.getElementById('questionSearch')?.value.toLowerCase() || '';

    let filtered = allQuestions;
    
    if (chapter) {
        filtered = filtered.filter(q => q.ch === chapter);
    }
    
    if (search) {
        filtered = filtered.filter(q => 
            q.q.toLowerCase().includes(search) ||
            q.opts.some(o => o.toLowerCase().includes(search))
        );
    }

    renderQuestions(filtered);
};

// ===== RENDER AUTHORIZED STUDENTS =====
function renderAuthorizedStudents() {
    const container = document.getElementById('authorizedStudentsList');
    const search = document.getElementById('studentSearch')?.value.toLowerCase() || '';

    let students = authorizedStudents;
    if (search) {
        students = students.filter(s => s.toLowerCase().includes(search));
    }

    // Check which students have taken exam
    const examTakers = new Set(allResults.map(r => r.name?.trim()));

    let html = '';
    students.forEach((name, i) => {
        const hasTaken = examTakers.has(name.trim());
        const statusClass = hasTaken ? 'badge-success' : 'badge-warning';
        const statusText = hasTaken ? 'أدى الامتحان ✓' : 'لم يمتحن بعد';

        html += `
            <div class="student-item">
                <div class="student-name">${i + 1}. ${escapeHtml(name)}</div>
                <div class="student-status">
                    <span class="badge ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html || '<div class="no-data">لا يوجد طلاب مطابقين</div>';
}

document.getElementById('studentSearch')?.addEventListener('input', renderAuthorizedStudents);

// ===== EXPORT CSV =====
window.exportCSV = function() {
    if (filteredResults.length === 0) {
        alert('لا توجد نتائج للتصدير');
        return;
    }

    const headers = ['#', 'الاسم', 'القسم', 'المرحلة', 'الدرجة', 'صحيح', 'خطأ', 'الحالة', 'التاريخ'];
    const rows = filteredResults.map((r, i) => [
        i + 1,
        r.name,
        r.department,
        r.stage,
        r.score,
        r.correct,
        r.wrong,
        r.score >= 50 ? 'ناجح' : 'راسب',
        new Date(r.timestamp).toLocaleString('ar-IQ')
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `exam_results_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};

// ===== EXPORT PDF =====
window.exportPDF = function() {
    alert('سيتم إضافة خاصية تصدير PDF قريباً');
};

// ===== EXPORT ATTEMPTS REPORT =====
window.exportAttemptsReport = function() {
    const studentAttempts = {};
    allResults.forEach(r => {
        const name = r.name || 'غير معروف';
        if (!studentAttempts[name]) {
            studentAttempts[name] = { attempts: [], department: r.department, stage: r.stage };
        }
        studentAttempts[name].attempts.push({ score: r.score, timestamp: r.timestamp });
    });

    const headers = ['الاسم', 'القسم', 'المرحلة', 'عدد المحاولات', 'أعلى درجة', 'أقل درجة'];
    const rows = Object.entries(studentAttempts).map(([name, data]) => [
        name,
        data.department,
        data.stage,
        data.attempts.length,
        Math.max(...data.attempts.map(a => a.score)),
        Math.min(...data.attempts.map(a => a.score))
    ]);

    const csvContent = '\uFEFF' + [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `attempts_report_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
};

// ===== ESCAPE HTML =====
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    loadResults();
    renderQuestions(allQuestions);
    renderAuthorizedStudents();

    // Auto-refresh every 30 seconds
    setInterval(() => {
        if (document.getElementById('tab-dashboard').classList.contains('active')) {
            loadResults();
        }
    }, 30000);
});
