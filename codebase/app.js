// K4 Discord Assistant (Track B1) - CP2 Interactive Prototype Script

const messagesFeed = document.getElementById('messages-feed');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const btnClearChat = document.getElementById('btn-clear-chat');

// Nút bên sidebar
const btnPath1 = document.getElementById('btn-path-1');
const btnPath2 = document.getElementById('btn-path-2');
const btnPath3 = document.getElementById('btn-path-3');
const btnPath4 = document.getElementById('btn-path-4');

function getCurrentTime() {
  const now = new Date();
  return `Hôm nay lúc ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function appendUserMessage(text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message user-msg';
  msgDiv.innerHTML = `
    <div class="user-avatar">HV</div>
    <div class="msg-content">
      <div class="msg-meta">
        <span class="author-name">Học Viên K4</span>
        <span class="msg-time">${getCurrentTime()}</span>
      </div>
      <div class="msg-body">${text}</div>
    </div>
  `;
  messagesFeed.appendChild(msgDiv);
  messagesFeed.scrollTop = messagesFeed.scrollHeight;
}

function appendBotMessage(htmlContent) {
  const msgDiv = document.createElement('div');
  msgDiv.className = 'message bot-msg';
  msgDiv.innerHTML = `
    <div class="bot-avatar">🤖</div>
    <div class="msg-content">
      <div class="msg-meta">
        <span class="author-name bot-name">Trợ lý AI K4</span>
        <span class="bot-badge">APP</span>
        <span class="msg-time">${getCurrentTime()}</span>
      </div>
      <div class="msg-body">${htmlContent}</div>
    </div>
  `;
  messagesFeed.appendChild(msgDiv);
  messagesFeed.scrollTop = messagesFeed.scrollHeight;
}

// 1. PATH 1: HAPPY PATH (ĐỘ TỰ TIN CAO · HAX G11)
function triggerPath1() {
  appendUserMessage('[@Trợ lý] Hạn nộp bài Lab02 là mấy giờ vậy ạ?');
  setTimeout(() => {
    appendBotMessage(`
      <div class="bot-response-card card-happy">
        <p>Chào bạn! Hạn nộp bài <strong>Lab02 (Codelab & Repo)</strong> chính thức là:</p>
        <p style="font-size: 1.05rem; font-weight: 700; color: #23a55a; margin: 6px 0;">
          🕒 23:59 — Thứ Sáu, ngày 18/09/2026
        </p>
        <p>Vui lòng commit mã nguồn lên GitHub Org lớp và submit đường dẫn trên hệ thống VLearn trước thời điểm này.</p>
        
        <div class="citation-box">
          📌 <strong>Nguồn căn cứ [HAX G11]:</strong> 
          <a href="#" class="citation-link" onclick="alert('Đang mở thông báo chính thức của BTC...')">#📢-thông-báo-lớp-học (Mã tin BTC_ANN_042)</a>
        </div>

        <div class="action-buttons-group">
          <button class="bot-btn-option" onclick="alert('Cảm ơn bạn đã phản hồi! Ghi nhận đánh giá tốt.')">👍 Đúng ý tôi</button>
          <button class="bot-btn-option" onclick="triggerPath4()">✏️ Chưa đúng ý tôi (Sửa)</button>
        </div>
      </div>
    `);
  }, 400);
}

// 2. PATH 2: LOW CONFIDENCE (MƠ HỒ · THU HẸP PHẠM VI · HAX G10)
function triggerPath2() {
  appendUserMessage('[@Trợ lý] Điểm danh thế nào ạ?');
  setTimeout(() => {
    appendBotMessage(`
      <div class="bot-response-card card-ambiguous">
        <p>⚠️ <strong>Nhận diện mơ hồ [HAX G10 - Thu hẹp phạm vi]:</strong></p>
        <p>Chương trình AI20K có 2 hình thức điểm danh khác nhau. Bạn đang cần hỏi về quy chế nào?</p>
        
        <div class="action-buttons-group">
          <button class="bot-btn-option" onclick="selectAttendanceType('lab')">🏢 1. Buổi Lab offline trên lớp</button>
          <button class="bot-btn-option" onclick="selectAttendanceType('zoom')">💻 2. Buổi Workshop Zoom buổi tối</button>
          <button class="bot-btn-option bot-btn-danger" onclick="this.parentElement.parentElement.remove()">❌ Bỏ qua [HAX G8]</button>
        </div>
      </div>
    `);
  }, 400);
}

function selectAttendanceType(type) {
  if (type === 'lab') {
    appendUserMessage('Tôi hỏi về điểm danh Buổi Lab offline trên lớp');
    setTimeout(() => {
      appendBotMessage(`
        <div class="bot-response-card card-happy">
          <p><strong>Quy chế điểm danh Lab Offline:</strong></p>
          <p>Bạn cần quét mã QR tại cửa phòng lab (E402/E403) trong 15 phút đầu giờ. Trợ giảng sẽ duyệt và đồng bộ danh sách lên hệ thống sau buổi học.</p>
          <div class="citation-box">
            📌 Nguồn: <a href="#" class="citation-link">Sổ tay học viên AI20K §3.1 (Điểm danh Offline)</a>
          </div>
        </div>
      `);
    }, 300);
  } else {
    appendUserMessage('Tôi hỏi về điểm danh Buổi Workshop Zoom buổi tối');
    setTimeout(() => {
      appendBotMessage(`
        <div class="bot-response-card card-happy">
          <p><strong>Quy chế điểm danh Workshop Zoom:</strong></p>
          <p>Hệ thống điểm danh tự động dựa trên Email đăng ký và Cú pháp tên Zoom: <code>[Mã Lớp] - [Họ Tên]</code>. Thời lượng tham gia tối thiểu ≥ 80% thời lượng buổi học.</p>
          <div class="citation-box">
            📌 Nguồn: <a href="#" class="citation-link">Quy định tham gia Workshop Online v2.4</a>
          </div>
        </div>
      `);
    }, 300);
  }
}

// 3. PATH 3: NO GROUNDING / NGOÀI THẨM QUYỀN (BIẾT-MÌNH-KHÔNG-BIẾT · HAX G8)
function triggerPath3() {
  appendUserMessage('[@Trợ lý] Check giúp tớ xem tớ đã nộp bài codelab lab02 chưa? Và nếu chưa thì cho tớ xin gia hạn nộp trễ với.');
  setTimeout(() => {
    appendBotMessage(`
      <div class="bot-response-card card-noground">
        <p>🛑 <strong>Ngoài phạm vi & Thẩm quyền của Trợ lý AI:</strong></p>
        <p>1. Mình <strong>không có quyền truy cập dữ liệu nộp bài cá nhân</strong> của bạn trên hệ thống VLearn.</p>
        <p>2. Mình <strong>không có thẩm quyền phê duyệt gia hạn deadline</strong> (Quyết định thuộc về BTC và Lab Coach).</p>
        
        <p style="margin-top: 8px;">👉 <em>Để tránh cung cấp thông tin sai lệch, bạn vui lòng chọn hướng giải quyết:</em></p>
        
        <div class="action-buttons-group">
          <button class="bot-btn-option" onclick="alert('Đã chuyển tiếp tin nhắn và tag @TA_Trực_Ban vào hỗ trợ bạn!')">🏷️ Tag @TA vào giải quyết</button>
          <button class="bot-btn-option" onclick="alert('Đang mở form tạo ticket hỗ trợ kỹ thuật...')">🎫 Tạo Ticket hỗ trợ (/ticket create)</button>
          <button class="bot-btn-option bot-btn-danger" onclick="this.parentElement.parentElement.remove()">❌ Đóng [HAX G8]</button>
        </div>
      </div>
    `);
  }, 400);
}

// 4. PATH 4: CORRECTION PATH (NGƯỜI DÙNG SỬA Ý ĐỊNH · HAX G9)
function triggerPath4() {
  appendUserMessage('[@Trợ lý] Ý tôi muốn hỏi về quy định xử lý khi máy bị lỗi commit lúc sát giờ deadline cơ!');
  setTimeout(() => {
    appendBotMessage(`
      <div class="bot-response-card" style="border-left-color: #5865f2;">
        <p>🔄 <strong>Ghi nhận điều chỉnh ý định [HAX G9 - Sửa dễ dàng]:</strong></p>
        <p>Theo quy chế hỗ trợ sự cố kỹ thuật:</p>
        <p>Nếu bạn gặp lỗi commit GitHub sát giờ nộp (trước 23:59), bạn cần:</p>
        <ol style="margin-left: 20px; margin-top: 6px; line-height: 1.6;">
          <li>Chụp ảnh màn hình có hiển thị đồng hồ hệ thống và thông báo lỗi commit.</li>
          <li>Gửi ticket ngay qua kênh <code>#ticket-hỗ-trợ</code> trong vòng 30 phút kể từ deadline.</li>
        </ol>
        <div class="citation-box">
          📌 Nguồn căn cứ: <a href="#" class="citation-link">Quy chế giải quyết sự cố nộp bài (Mục 4.2)</a>
        </div>
      </div>
    `);
  }, 400);
}

// XỬ LÝ NHẬP TỰ DO TỪ USER
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text) return;

  appendUserMessage(text);
  chatInput.value = '';

  const lower = text.toLowerCase();
  setTimeout(() => {
    if (lower.includes('standup') || lower.includes('daily') || lower.includes('báo cáo ngày')) {
      appendBotMessage(`
        <div class="bot-response-card card-happy">
          <p><strong>Daily Standup</strong> nộp trong khung giờ <strong>00:00 – 10:00 sáng hàng ngày</strong> tại channel_10 bằng lệnh <code>/standup submit</code>.</p>
          <div class="citation-box">📌 Nguồn: <a href="#" class="citation-link">Sổ tay học viên AI20K</a></div>
        </div>
      `);
    } else if (lower.includes('xp') || lower.includes('điểm xp') || lower.includes('leaderboard')) {
      appendBotMessage(`
        <div class="bot-response-card card-happy">
          <p>Xem điểm XP tại kênh <strong>#xp-board</strong> hoặc dùng lệnh <code>/leaderboard</code> (hoặc <code>/xp</code>).</p>
          <div class="citation-box">📌 Nguồn: <a href="#" class="citation-link">Quy chế XP AI20K</a></div>
        </div>
      `);
    } else if (lower.includes('hạn') || lower.includes('deadline') || lower.includes('mấy giờ') || lower.includes('lab02')) {
      triggerPath1Response();
    } else if (lower.includes('điểm danh')) {
      triggerPath2Response();
    } else if (lower.includes('check') || lower.includes('kiểm tra bài') || lower.includes('nộp trễ') || lower.includes('gia hạn')) {
      triggerPath3Response();
    } else {
      appendBotMessage(`
        <div class="bot-response-card">
          <p>Mình đã nhận được câu hỏi: <em>"${text}"</em>.</p>
          <p>Hiện tại mình hỗ trợ tra cứu: <strong>Deadline Lab02</strong>, <strong>Daily Standup</strong>, <strong>Điểm danh</strong>, <strong>Bảng điểm XP</strong> và <strong>Quy chế nộp bài</strong>.</p>
        </div>
      `);
    }
  }, 400);
});

function triggerPath1Response() {
  appendBotMessage(`
    <div class="bot-response-card card-happy">
      <p>Hạn nộp bài <strong>Lab02</strong> là <strong>23:59 — Thứ Sáu (18/09/2026)</strong>.</p>
      <div class="citation-box">
        📌 Trích dẫn: <a href="#" class="citation-link">#📢-thông-báo-lớp-học</a>
      </div>
    </div>
  `);
}

function triggerPath2Response() {
  appendBotMessage(`
    <div class="bot-response-card card-ambiguous">
      <p>⚠️ Bạn đang hỏi về điểm danh <strong>Lab Offline</strong> hay <strong>Workshop Zoom</strong>? Hãy bấm chọn bên dưới:</p>
      <div class="action-buttons-group">
        <button class="bot-btn-option" onclick="selectAttendanceType('lab')">Lab offline</button>
        <button class="bot-btn-option" onclick="selectAttendanceType('zoom')">Workshop Zoom</button>
      </div>
    </div>
  `);
}

function triggerPath3Response() {
  appendBotMessage(`
    <div class="bot-response-card card-noground">
      <p>🛑 Câu hỏi này thuộc thông tin cá nhân hoặc thẩm quyền của TA. Mình không được tự suy đoán!</p>
      <div class="action-buttons-group">
        <button class="bot-btn-option" onclick="alert('Đã thông báo cho TA hỗ trợ.')">Tag @TA hỗ trợ</button>
      </div>
    </div>
  `);
}

// QUICK CHIPS
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    chatInput.value = chip.getAttribute('data-query');
    chatForm.dispatchEvent(new Event('submit'));
  });
});

// SIDEBAR BUTTONS
btnPath1.addEventListener('click', triggerPath1);
btnPath2.addEventListener('click', triggerPath2);
btnPath3.addEventListener('click', triggerPath3);
btnPath4.addEventListener('click', triggerPath4);

btnClearChat.addEventListener('click', () => {
  messagesFeed.innerHTML = `
    <div class="message system-msg">
      <div class="system-avatar">🤖</div>
      <div class="msg-content">
        <div class="msg-meta">
          <span class="author-name bot-name">Trợ lý AI K4</span>
          <span class="bot-badge">APP</span>
          <span class="msg-time">${getCurrentTime()}</span>
        </div>
        <div class="msg-body">
          Lịch sử chat đã được làm mới! Hãy bấm chọn các đường trải nghiệm hoặc gõ câu hỏi để tiếp tục tương tác.
        </div>
      </div>
    </div>
  `;
});
