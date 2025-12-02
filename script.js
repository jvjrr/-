const questions = [
  { q: "كيف حال راسك اليوم؟", opt: ["كويس", "مش كويس"] },
  { q: "تعبتي اليوم؟", opt: ["اي", "لا"] },
  { q: "كم تقيمك لليوم كله؟", opt: ["حلو", "مش حلو"] },
  { q: "جوك كويس من الكلية؟", opt: ["لا", "اي"] },
  { q: "شربتي ميا؟", opt: ["اي", "لا"] },
  { q: "كم تقيمك للطقس؟", opt: ["صقع هلبا", "حلو"] },
  { q: "ندمتي انه كنتي تبي الصقع؟", opt: ["اي", "لا"] },
  { q: "لو قالولك اختاري بين الكلية وفراشك شن تختاري؟", opt: ["فراشك", "الكلية"] },
  { q: "خديتي الحديد؟", opt: ["اي", "لا", "منبيش نجاوب"] },
  { q: "شن افضل عطر عندك؟", opt: ["YSL libre"] },
  { q: "جاتك دوخة اليوم؟", opt: ["لا", "اي"] },
  { q: "ايديك فيهم وجع؟", opt: ["لا", "اي", "مش هلبا"] },
  { q: "كويس المسلسل؟", opt: ["اي", "لا"] },
  { q: "معاش عرفت شن نسأل", opt: ["عندك حق"] },
  { q: "تغديتي كويس؟", opt: ["اي", "لا"] },
  { q: "قلتي متبيش تجاوبي.. علاش؟", opt: ["حنجاوب توا"] },
  { q: "شن عندك غدوة؟", opt: ["حنرقد", "كلية مش ماشية"] },
  { q: "توا المفروض تجاوبي.. خديتي الحديد ولالا؟", opt: ["اي", "اكيدة اي حنوض ناخده"] }
].map((q, index) => ({ ...q, id: index })); // Add id to each question

const messages = {
  0: { "كويس": "الحمدالله", "مش كويس": "شربتي ميا؟" },
  1: { "اي": "اكيدة بتتعبي اي وحدة شاطرة زيك وتبي تولي حاجة كبيرة ضروري تتعب😍", "لا": "اكيدة مش حتتعبي انتي تديري في شي تحبيه" },
  2: { "حلو": "اكيدة حيكون زيك", "مش حلو": "اكيدة لانك غطيتي على الحلو كله" },
  3: { "لا": "اكيدة حتضايقي منهم الفاشلين", "اي": "اكيدة حيكون كويس لانك فيه" },
  4: { "اي": "بالعافيه صحتين", "لا": "علاش تحرمي الميا من شوفتك؟" },
  5: { "صقع هلبا": "باش خدودك يولو حمر ويبان الجمال", "حلو": "غصباً عليه حيكون حلو" },
  6: { "اي": "😦", "لا": "🙂‍↕️" },
  7: { "فراشك": "ياحظه😔", "الكلية": "اكيدة دافية بس توا" },
  8: { "اي": "بالعافيه يالمستشارة", "لا": "حاولي خوديه توا", "منبيش نجاوب": "😠😠" },
  9: { "YSL libre": "تي شن الذوق هذا😍" },
  10: { "لا": "الحمدالله", "اي": "قاعده لتوا؟" },
  11: { "لا": "الحمدالله", "اي": "هلبا وقاعد لتوا؟", "مش هلبا": "خلاص حاولي غطيهم من الصقع" },
  12: { "اي": "اكيدة حيكون حلو لانه قدامك", "لا": "عندك حق" },
  13: { "عندك حق": "عندك حق" }, // This was missing a message for its only option
  14: { "اي": "صحتين 🤩", "لا": "علاش😠" },
  15: { "حنجاوب توا": "تمام" }, // This was missing a message for its only option
  16: { "حنرقد": "نوم العوافي", "كلية مش ماشية": "افضل حل صح" },
  17: { "اي": "شاطرة😠", "اكيدة اي حنوض ناخده": "صحتين بالعافيه" }
};

let current = 0;
let refusing = false;
let userAnswers = [];
let isAudioUnlocked = false;

function showMessage(msg) {
  let box = document.querySelector('.msg-box');
  if (!box) {
    box = document.createElement('div');
    box.className = 'msg-box';
    document.getElementById('content').appendChild(box);
  }
  box.innerText = msg;
  box.style.display = 'block';
}

function toggleMusic() {
  const music = document.getElementById('backgroundMusic');
  const musicBtn = document.getElementById('musicControl');
  
  if (music.paused) {
    // محاولة التشغيل، والتعامل مع أي خطأ محتمل
    music.play().then(() => {
      musicBtn.textContent = '🎵';
    }).catch(error => {
      console.error("Music play failed:", error);
    });
  } else {
    music.pause();
    musicBtn.textContent = '🔇';
  }
}

function startQuiz() {
  const music = document.getElementById('backgroundMusic');
  const musicBtn = document.getElementById('musicControl');

  // محاولة تشغيل الموسيقى عند بدء الاستبيان.
  // بما أن هذه الدالة تُستدعى عبر نقرة زر، فالمتصفح سيسمح بتشغيل الصوت.
  if (music && music.paused) {
    music.play().then(() => {
      musicBtn.textContent = '🎵'; // تحديث أيقونة الزر عند النجاح
    }).catch(error => {
      console.error("Music play failed on start:", error);
      musicBtn.textContent = '🔇';
    });
  }

  const startScreen = document.getElementById('startScreen');
  if (startScreen) {
    startScreen.style.opacity = '0';
    setTimeout(() => {
      startScreen.style.display = 'none';
    }, 300);
  }
  document.getElementById('introScreen').style.display = 'none';
  document.getElementById('quizContent').style.display = 'block';
  showQuestion();
}

function showQuestion() {
  if (current >= questions.length) return finish();

  const data = questions[current];
  const container = document.getElementById("content");
  document.getElementById("progressBar").style.width = ((current) / questions.length) * 100 + "%";

  // Reset animation to allow the new question to fade in
  container.style.animation = '';

  container.innerHTML = `
    <div class="question">${data.q}</div>
    <div class="options">
      ${data.opt.map(o => `<button class='option-btn' data-value="${o}">${o}</button>`).join("")}
    </div>
    <div class='msg-box' style='display:none'></div>
  `;

  document.querySelectorAll('.option-btn').forEach(btn => {
    btn.addEventListener('click', () => handleClick(btn, btn.dataset.value));
  });
}

function handleClick(btn, value) {
  const questionId = questions[current].id;
  const questionText = questions[current].q;

  userAnswers.push({ question: questionText, answer: value });

  if (value === "منبيش نجاوب") {
    if (!refusing) {
      refusing = true;
      btn.classList.add('wiggle'); 
      showMessage(messages[questionId][value] || 'خوديه توا 😠');
      setTimeout(() => btn.classList.remove('wiggle'), 500);
      return;
    }
  }

  refusing = false;

  const responseMessage = (messages[questionId] && messages[questionId][value]) || null;
  if (responseMessage) {
    showMessage(responseMessage);
  }

  // Disable buttons and wait before going to the next question
  const contentContainer = document.getElementById("content");
  document.querySelectorAll('.option-btn').forEach(b => {
    b.disabled = true;
    b.style.cursor = 'default';
  });

  // Wait for message to be seen, then start fade out
  setTimeout(() => {
    contentContainer.style.animation = 'fadeOut 0.3s ease forwards';
    // After fade out animation, show next question
    setTimeout(() => {
      current++;
      showQuestion();
    }, 300);
  }, responseMessage ? 1000 : 150); // Adjust timing
}

function finish() {
  const quizCard = document.getElementById("quizCard");
  document.getElementById("progressBarContainer").style.display = 'none';

  // 1. عرض شاشة الوردة البيضاء
  quizCard.innerHTML = `
    <div class="rose-container">
      <div id="rose" class="rose-white">🌷</div>
      <p id="rose-message">اعتبريها وردة بيضاءلانه محصلتش والله</p>
    </div>
  `;

  // 2. بعد ثانيتين، تحويل الوردة إلى حمراء
  setTimeout(() => {
    const rose = document.getElementById('rose');
    const roseMessage = document.getElementById('rose-message');
    if (rose) {
      rose.textContent = '🌹';
      rose.className = 'rose-red';
    }
    if (roseMessage) {
      roseMessage.textContent = " ولت حمراء تحشمت من جمالك🙂‍↔️  ";
    }
  }, 2000);

  // 3. بعد 4.5 ثواني، عرض النموذج النهائي
  setTimeout(() => {
    quizCard.style.animation = 'fadeOut 0.4s ease forwards';
    setTimeout(() => {
      showFinalForm();
      quizCard.style.animation = 'fadeIn 0.4s ease forwards';
    }, 400);
  }, 4500);
}

function showFinalForm() {
    const answersHtml = userAnswers.map((item, index) => 
      `<input type="hidden" name="السؤال ${index + 1}: ${item.question}" value="${item.answer}">`
    ).join('');
    const quizCard = document.getElementById("quizCard");
    quizCard.innerHTML = `
      <h2>تمام ❤️</h2>
      <p style="margin-bottom: 25px;">الموقع هذا كله اندار باش نطمن عليك ونغيرلك جوك وباش تعرفي كم انتي مهمة.</p>      
      <form id="feedbackForm" action="https://formspree.io/f/xzzngakb" method="POST">
        <label>اسمك:</label>
        <input type="text" name="name" required />
        <label>الإيميل. اكتبي اي شي نهايته @gmail.com:</label>
        <input type="email" name="email" required />
        <label>اي شي في خاطرك👀:</label>
        <textarea name="message" rows="3"></textarea>
        ${answersHtml}
        <button type="submit">إرسال</button>
      </form>
    `;

    const form = document.getElementById('feedbackForm');
    form.addEventListener("submit", async function(event) {
      event.preventDefault();
      const button = form.querySelector("button");
      button.disabled = true;
      button.textContent = 'جاري الإرسال...';
      const data = new FormData(form);
      const response = await fetch(form.action, { method: form.method, body: data, headers: { 'Accept': 'application/json' } });
      if (response.ok) {
        quizCard.innerHTML = '<h2>تم الإرسال بنجاح!</h2><p>شكرًا لكِ على وقتك ❤️</p><div class="flower">🌹</div>';
      } else {
        quizCard.innerHTML = '<h2>حدث خطأ!</h2><p>عذرًا، لم نتمكن من إرسال إجاباتك. الرجاء المحاولة مرة أخرى.</p>';
      }
    });
}