# Canvas 7 Dòng — Checkpoint 1 (CP1)
**Nhóm:** Nhóm 06 · **Lớp:** 3B · **Phòng:** E403 · **Track:** B · Trợ lý Học viên (Discord) · **Đề:** B1 (Tối ưu trợ lý hiện có)

---

1. **Track + đề:** 
Track B · Trợ lý Discord — Đề B1: Tối ưu Trợ lý hiện có (Xác thực Intent & Trả lời logistics có căn cứ từ nguồn chính thức).

2. **Job executor:** 
Học viên Khóa 4 đang ở các kênh chat công khai trên Discord của khóa (kênh hỏi-đáp/thảo luận), vừa gõ câu hỏi thắc mắc về lịch trình, hạn nộp bài (deadline), hoặc quy chế học tập/điểm danh.

3. **Pain một câu:** 
Học viên hỏi thông tin quan trọng về deadline và thủ tục khóa học, nhưng bot hiện tại trả lời lan man, phỏng đoán hoặc rập khuôn không đúng bối cảnh, khiến học viên hoang mang, mất thời gian tự đi tìm lại ở nhiều kênh và có nguy cơ nộp muộn/vi phạm quy chế.

4. **1–2 bằng chứng đầu:**
- **Mining dữ liệu thật từ `k4_messages.csv`:**
  + Trong 779 tin nhắn của học viên, có 307 tin tag bot (`mentions_bot = True`).
  + Có 110/779 tin (14.1%) hỏi về logistics (điểm danh, nộp bài, deadline, ticket, record...).
  + Bot hiện tại thường xuyên trả lời phỏng đoán hoặc nhầm bối cảnh (minh chứng cụ thể trích từ data):
    * `M84993` hỏi kiểm tra bài nộp cá nhân -> Bot `M57630` phỏng đoán chung chung *"thường là 23:59 cùng ngày"*, không giải quyết được việc.
    * `M67840` hỏi *"kiểm tra điểm danh trên lớp"* (lab offline) -> Bot `M14476` trả lời nhầm sang hướng dẫn *"Zoom workshop buổi tối"*.
    * `M07416` hỏi *"Hạn nộp Lab02"* -> Bot `M28485` trả lời dài dòng, không có giờ cụ thể và đẩy học viên tự đi tìm ở 3 nền tảng khác nhau.
    * `M24585` học viên chỉ gõ số *"1"* để thử bot -> Bot `M06644` tưởng nhầm là câu hỏi hóc búa nên tag loạn cả role `@role Mod`.
- **Khảo sát tại lớp:** 
  15/20 học viên (75%) xác nhận từng nhận câu trả lời không đúng trọng tâm từ bot Discord và phải chờ TA giải thích lại.

5. **Lát cắt MỘT CÂU:** 
Học viên gõ câu hỏi về deadline/thủ tục trên Discord · cần biết thông tin chính xác ngay · AI quyết định câu hỏi có khớp 100% với tài liệu thông báo chính thức hay không (nếu có: trích dẫn trực tiếp mốc giờ kèm link thông báo; nếu là câu hỏi cá nhân hoặc chưa có văn bản: báo rõ "chưa có thông tin chính thức" và hướng dẫn mở ticket/tag TA) · học viên nhận được thông tin chuẩn xác, không bị thông tin ảo/sai lệch.

6. **Automation + willing users:**
- **AI tự làm:** Phân loại đúng Intent (hỏi quy chế vs hỏi cá nhân/ngoài lề); trích xuất câu trả lời kèm link thông báo gốc từ nguồn sự thật (kênh thông báo BTC).
- **AI không tự làm:** Tuyệt đối không phỏng đoán hạn nộp khi không có nguồn; không can thiệp/trả lời thay các dữ liệu cá nhân (điểm số, bài nộp cá nhân).
- **Lý do theo cost-of-error:** Trả lời sai deadline gây hậu quả trực tiếp khiến học viên bị trễ hạn hoặc mất quyền lợi (nhận điểm 0).
- **Willing users (2 học viên ngoài nhóm sẵn sàng thử nghiệm tại CP5):**
  + Bạn 1: Trần Hoàng Nam — Mã HV: K4-HV042 (Phòng E402)
  + Bạn 2: Lê Thu Trang — Mã HV: K4-HV118 (Phòng E403)

7. **Phân công:**
- **Nguyễn Anh (Đội trưởng / Product Lead):** Chốt Canvas CP1, viết Spec (`spec.md`), quản lý tiến độ và kịch bản demo.
- **Trần Minh Đức (Prompt & Retrieval Engineer):** Xây dựng bộ ngữ cảnh thông báo chuẩn (Grounding docs), viết System Prompt nhận diện Intent và cơ chế Fallback (biết-mình-không-biết).
- **Lê Tuấn Hưng (AI Developer):** Xây dựng Bot Prototype kết nối API LLM chạy thật (xử lý input câu hỏi -> ra kết quả phân loại và trích dẫn).
- **Phạm Hoàng Yến (Eval & Tester):** Xây dựng Golden Set 20 câu hỏi thử nghiệm, đo đạc tỷ lệ trả lời đúng/sai (cho CP3), ghi nhận log phản hồi của willing users.

---

### 📌 Thông tin nộp kèm Checkpoint 1 (CP1):
- **Họ tên & Mã học viên Đội trưởng:** Nguyễn Anh — K4-3B-006
- **Link GitHub Repository (Public):** https://github.com/Baor-AI/K4-3B-E403-kling.git
