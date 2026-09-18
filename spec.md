# AI SPEC — Xác thực Intent & Trả lời Logistics có Căn cứ từ Nguồn Chính thức (Track B1)
**Nhóm:** 06 · **Lớp:** 3B · **Phòng:** E402/E403  
**Hướng:** [ ] A — VLearn  [x] B — Trợ lý Học viên  [ ] C — Làn mở  
**Loại:** [x] Tối ưu tính năng có sẵn  [ ] Tính năng mới  

---

## §1. User & Job
- **Job executor + workflow:** Học viên Khóa 4 đang ở các kênh thảo luận/hỏi-đáp công khai trên Discord, bối rối trước lịch trình, deadline nộp bài lab hoặc quy chế điểm danh. Workflow: Nhận thấy sắp đến hạn nộp $\rightarrow$ Lên Discord tìm thông tin $\rightarrow$ Gõ tin nhắn tag bot hỏi $\rightarrow$ Nhận câu trả lời và hành động nộp bài.
 ```mermaid
flowchart TD
    Start([Học viên gõ tin nhắn tag @Trợ lý]) --> Step1[Nhận diện Ý định - Intent Classification]
    
    Step1 --> CheckIntent{Ý định là gì?}
    
    CheckIntent -- "Không liên quan / Chào hỏi" --> ChatGen[Trả lời thân thiện + Gợi ý phạm vi hỗ trợ\nHAX G1]
    CheckIntent -- "Thủ tục / Deadline / Quy chế" --> Step2[Truy xuất cơ sở tri thức - Retrieval]
    
    Step2 --> CheckGrounding{Độ tin cậy & Căn cứ\nGrounding & Confidence}
    
    %% Đường 1: Happy Path
    CheckGrounding -- "Cao (Khớp 100% tài liệu BTC)" --> Path1["ĐƯỜNG 1: HAPPY PATH\n- Trả lời ngắn gọn mốc giờ/quy định\n- Kèm link trích dẫn nguồn sự thật [HAX G11]\n- Hiện nút 'Đúng ý' / 'Hỏi thêm' [HAX G8]"]
    
    %% Đường 2: Low Confidence Path
    CheckGrounding -- "Trung bình (Mơ hồ / Thiếu bối cảnh)" --> Path2["ĐƯỜNG 2: LOW-CONFIDENCE (Lớp ②)\n- HAX G10: Thu hẹp phạm vi khi nghi ngờ\n- Không đoán mò!\n- Hiện 2-3 nút lựa chọn ngữ cảnh làm rõ\n(VD: Lab offline hay Workshop online)"]
    
    Path2 --> UserChoice{Học viên chọn nút?}
    UserChoice -- "Chọn nút cụ thể" --> Step2
    UserChoice -- "Bỏ qua / Hủy" --> CloseThread[Đóng gợi ý / Thoát luồng\nHAX G8]
    
    %% Đường 3: No-Grounding / Out of Scope
    CheckGrounding -- "Thấp / Không có văn bản / Cá nhân" --> Path3["ĐƯỜNG 3: FAILURE / NO-GROUNDING (Lớp ① & ③)\n- Báo rõ 'Chưa có thông báo chính thức'\n- Tuyệt đối không phỏng đoán hạn nộp\n- Đưa nút 'Tạo Ticket hỗ trợ' hoặc tự tag @TA"]
    
    %% Đường 4: Correction Path
    Path1 --> UserFeedback{Người dùng phản hồi}
    Path3 --> UserFeedback
    
    UserFeedback -- "Bấm 'Chưa đúng ý tôi' / Sửa câu hỏi" --> Path4["ĐƯỜNG 4: CORRECTION PATH (HAX G9)\n- Cho phép sửa câu hỏi hoặc chọn lại Intent\n- Cung cấp nút chuyển tiếp thẳng cho TA người thật\n- Ghi nhận failure log để cải thiện model"]
    
    UserFeedback -- "Hài lòng" --> EndOk([Kết thúc tương tác thành công])
    Path4 --> EndEscalate([TA người thật vào thread hỗ trợ])
```

- **Core JTBD:** *"Khi đứng trước các mốc thời hạn và thủ tục học tập quan trọng, giúp tôi nắm bắt thông tin chính xác và kịp thời để không bị lỡ hạn nộp bài hay vi phạm quy chế lớp học."* (Không chứa từ khóa AI).
- **Problem statement:** *"Học viên cần biết hạn nộp bài và thủ tục lớp học nhưng thông tin bị phân tán trên nhiều kênh, câu trả lời từ công cụ hỗ trợ hiện tại còn phỏng đoán, thiếu nguồn kiểm chứng hoặc trả lời sai bối cảnh, khiến học viên hoang mang và tốn thời gian xác minh lại."* (Không chứa từ khóa AI).
- **Evidence:**
  - **Số liệu mining (`data/discord-pack/k4_messages.csv`):**
    - Tổng $1.092$ tin ($779$ tin từ học viên, $313$ tin bot).
    - Có $307/779$ tin học viên tag bot trực tiếp.
    - Có **$110/779$ tin (14.1%)** tập trung vào câu hỏi logistics (hạn nộp bài, điểm danh, nộp bài, xem record, mở ticket).
    - Bot hiện tại có $8$ trường hợp trả lời bằng từ ngữ phỏng đoán ("thường là...", "mình đoán..."), $7$ trường hợp tag sai role Mod.
  - **≥5 ví dụ nguyên văn trích từ dữ liệu:**
    1. `M84993` (Học viên hỏi tra cứu cá nhân): *"[@BOT] check xem t đã nộp bài codelab chưa"* $\rightarrow$ Bot `M57630` trả lời phỏng đoán quy định chung: *"Bài Lab trên lớp sẽ được chấm sau khi hết deadline thường là 23:59 cùng ngày nhé"*.
    2. `M67840` (Học viên hỏi điểm danh lab offline): *"[@BOT] kiểm tra điểm danh trên lớp"* $\rightarrow$ Bot `M14476` trả lời nhầm sang hướng dẫn *"Zoom workshop buổi tối"* (nhầm lẫn tai hại về bối cảnh).
    3. `M07416` (Học viên hỏi deadline Lab02): *"Hạn nộp Lab02 [@BOT]"* $\rightarrow$ Bot `M28485` trả lời dài dòng, không có giờ cụ thể và đẩy học viên tự đi tìm ở 3 nền tảng khác nhau.
    4. `M24585` (Học viên test tin nhắn): *"[@BOT] 1"* $\rightarrow$ Bot `M06644` tưởng nguy cấp nên tag loạn `@role Mod`.
    5. `M40677` (Học viên hỏi quy định sự cố nộp bài): *"[@BOT] tôi nộp codelab trên vlearn đúng giờ deadline như thông báo (23:59) nhưng commit trên máy bị lỗi..."* $\rightarrow$ Bot `M00595` trả lời chung chung không khẳng định được quy chế.
  - **Khảo sát tại lớp:** 15/20 học viên (75%) xác nhận từng nhận câu trả lời không đúng trọng tâm từ bot Discord và phải đợi TA hỗ trợ lại.

---

## §2. Impact & quyết định chọn
- **Bảng impact 3 ứng viên:**

| Ứng viên bài toán | Số người gặp | Tần suất | Tổn thất mỗi lần | Khả thi trong 39h | Đánh giá |
|---|---|---|---|---|---|
| **1. Trả lời logistics/deadline có trích dẫn nguồn** | 1.000+ học viên | Hàng ngày (trước mỗi deadline Lab/WS) | Rất đắt (nộp muộn bị 0 điểm; TA tốn hàng giờ giải thích lặp lại) | Rất cao (dữ liệu sạch, lát cắt rõ) | **CHỌN** |
| **2. Tự động gom nhóm tạo team làm Lab** | ~200 học viên | 1 lần đầu kỳ | Trung bình (chậm ghép nhóm 1-2 ngày) | Trung bình (logic ghép team phức tạp) | LOẠI |
| **3. Giải đáp thắc mắc code lỗi bài Lab (CVAT/Git)** | ~400 học viên | Khi làm Lab | Cao (bị tắc code) | Khó (phạm vi quá rộng, dễ bị hallucinate) | LOẠI |

- **Ứng viên ĐÃ LOẠI + vì sao:** Loại bài toán số 2 vì tần suất thấp (chỉ diễn ra tuần đầu onboarding); loại bài toán số 3 vì chi phí sai sót về mặt kỹ thuật/mô hình quá rộng để hoàn thiện trong 39 giờ.
- **Ứng viên CHỌN + vì sao:** Chọn bài toán số 1 vì có bằng chứng mạnh nhất ($110$ tin trong pack), tần suất diễn ra mỗi ngày và chi phí sai sót ảnh hưởng trực tiếp đến kết quả học tập của học viên.

---

## §3. Giải pháp tương tự đã nghiên cứu
- **Perplexity AI:**
  - *Flow:* Nhận câu hỏi $\rightarrow$ Tìm nguồn chính xác $\rightarrow$ Trả lời súc tích kèm số cước chú `[1]`, `[2]` trỏ đến link gốc.
  - *Đáng học:* Luôn có trích dẫn nguồn (grounding) rõ ràng cạnh câu trả lời.
  - *Đáng né:* Trả lời dạng văn bản dài, thiếu các nút hành động nhanh (Action Buttons).
  - *Mình khác gì:* Thu hẹp câu trả lời thành mốc thời gian rõ ràng, gắn kèm nút "Tag TA" và "Mở Ticket" khi ngoài thẩm quyền.
- **Bot Discord MEE6 / Carl-bot:**
  - *Flow:* Gõ lệnh `/faq` hoặc bắt từ khóa cứng để nhả tin nhắn mẫu.
  - *Đáng học:* Phản hồi nhanh, tin cậy tuyệt đối vì là tin nhắn cứng do con người soạn.
  - *Đáng né:* Rập khuôn, không hiểu được câu hỏi tự nhiên hoặc các cách diễn đạt phong phú của học viên.
  - *Mình khác gì:* Dùng LLM nhận diện Intent linh hoạt nhưng ràng buộc câu trả lời chỉ được trích xuất từ dữ liệu BTC.

---

## §4. Thiết kế (Trọng tâm CP2)
- **Lát cắt MỘT CÂU:** *Học viên gõ câu hỏi deadline/thủ tục trên Discord · cần biết thông tin chính xác ngay · AI quyết định câu hỏi có khớp nguồn thông báo chính thức hay không (nếu có: trích dẫn mốc giờ kèm link thông báo gốc; nếu không: báo rõ "chưa có thông tin chính thức" và tag TA/mở ticket) · học viên nhận thông tin chuẩn xác, không bị thông tin ảo/sai lệch.*
- **Non-goals (3 thứ KHÔNG build):**
  1. Không build tính năng tự tra cứu điểm số / bài nộp trong cơ sở dữ liệu riêng tư của từng cá nhân.
  2. Không tự động cấp quyền gia hạn nộp bài thay cho giảng viên/BTC.
  3. Không cố gắng trả lời các câu hỏi kỹ thuật chuyên sâu về debug code bài tập (thuộc phạm vi của Lab Coach).
- **Mức prototype nhắm tới:**
  - **Mức:** [x] Mock tương tác (Clickable HTML/CSS/JS mô phỏng Discord) tại CP2 $\rightarrow$ [x] Working Prototype (có kết nối LLM API thật) tại CP3.
  - **Phần chạy giả lập (Mock):** Dữ liệu thông báo chính thức (Announcement database) và danh sách link thông báo.
  - **Phần chạy thật:** Luồng giao diện tương tác bấm thử được 4 đường trải nghiệm và bộ phân loại Intent.
- **Automation:** [x] Conditional (Có điều kiện)
  - *Lý do theo cost-of-error:* Nếu AI tự động trả lời sai deadline, học viên bị nộp trễ và nhận điểm 0 — chi phí sai sót cực kỳ đắt. Vì vậy, chỉ cho phép AI tự động trả lời với các case tự tin cao (có văn bản chính thức khớp 100%). Các case mơ hồ hoặc không có nguồn, AI bắt buộc phải hạ cấp (fallback) chuyển người thật (TA) xử lý.
- **§4b. Nguyên tắc HAX & PAIR đã áp dụng:**

| Nguyên tắc | Áp cụ thể vào đâu trong prototype |
|---|---|
| **HAX G10 · Thu hẹp phạm vi khi nghi ngờ** *(Bắt buộc)* | Khi học viên hỏi câu mơ hồ (ví dụ: *"Điểm danh thế nào?"*), bot **không đoán mò** mà đưa ra 2 nút bấm cụ thể để thu hẹp phạm vi: `[1. Lab offline trên lớp]` và `[2. Workshop Zoom buổi tối]`. |
| **HAX G11 · Giải thích vì sao / Dẫn nguồn sự thật** | Mọi câu trả lời về deadline đều có hộp trích dẫn nguồn `📌 Nguồn căn cứ:` dẫn link cụ thể tới bài đăng chính thức của BTC trong kênh `#📢-thông-báo-lớp-học`. |
| **HAX G8 · Gạt bỏ dễ dàng / Thoát luồng nhanh** | Trong thẻ trả lời và gợi ý của bot luôn có nút `❌ Đóng / Bỏ qua` để người dùng ẩn thẻ phản hồi mà không làm nghẽn luồng đọc tin nhắn trong kênh. |
| **HAX G9 · Sửa dễ dàng (Support Correction)** | Cung cấp sẵn thanh gợi ý nhanh (Quick Chips) và nút `✏️ Chưa đúng ý tôi (Sửa)` dưới câu trả lời để học viên điều chỉnh câu hỏi chỉ bằng 1 thao tác bấm. |

---

## §5. Kiểu lỗi — 4 lớp chỗ khó & Kịch bản xử lý

| Lớp chỗ khó | Kịch bản rủi ro cụ thể | Cách hệ thống xử lý trong thiết kế |
|---|---|---|
| **① Nguồn sự thật** | Học viên hỏi hạn nộp bài Lab03 khi BTC chưa công bố. | Bot không bịa: *"Chưa có thông báo chính thức về hạn nộp Lab03"* và đưa link theo dõi kênh `#thông-báo`. |
| **② Mơ hồ / Thiếu thông tin** | Học viên chỉ hỏi 1 chữ *"Deadline?"* hoặc *"Điểm danh"*. | Bot kích hoạt **HAX G10**, hiện menu các sự kiện sắp tới để người dùng bấm chọn. |
| **③ Ngoài phạm vi / Thẩm quyền** | Học viên nhờ *"Cho em xin nộp muộn bài lab vì bị sốt"*. | Bot từ chối lịch sự: *"Bot không có quyền gia hạn"* $\rightarrow$ Đưa nút mở `/ticket create` gửi BTC. |
| **④ Đặc thù domain** | Có 2 deadline khác nhau (hạn nộp trên VLearn 23:59 vs hạn chấm điểm lab trên lớp 12:00). | Bot làm rõ sự khác biệt giữa "Hạn nộp bài tập" và "Hạn hoàn thành bài trên lớp" kèm trích dẫn văn bản. |

---

## §6. Bốn đường đi của trải nghiệm (Trọng tâm CP2)

### 1. Happy path (Tự tin cao):
- **Input:** Học viên hỏi: *"Hạn nộp Lab02 là mấy giờ?"*
- **Quyết định AI:** Intent `deadline_query`, khớp 100% tài liệu thông báo.
- **Output:** Trả lời trực tiếp mốc thời gian rõ ràng: `23:59 — Thứ Sáu, 18/09/2026` kèm trích dẫn link thông báo BTC [HAX G11].

### 2. Low-confidence (Mơ hồ — Lớp chỗ khó ②):
- **Input:** Học viên hỏi: *"Quy chế điểm danh thế nào?"*
- **Quyết định AI:** Phát hiện câu hỏi thiếu ngữ cảnh (chưa rõ offline hay online).
- **Output:** Áp dụng **HAX G10**, hiển thị 2 nút lựa chọn: `[1. Lab offline trên lớp]` và `[2. Workshop Zoom buổi tối]` để học viên chọn ngữ cảnh đúng.

### 3. Failure / Không căn cứ / Ngoài thẩm quyền (Lớp chỗ khó ① & ③):
- **Input:** Học viên hỏi: *"Check xem tớ đã nộp bài codelab chưa"* hoặc hỏi xin gia hạn.
- **Quyết định AI:** Dữ liệu thuộc quyền riêng tư hoặc quyết định ngoài thẩm quyền bot.
- **Output:** Báo rõ lý do không tự xử lý, cung cấp nút bấm: `[Tag @TA hỗ trợ]` hoặc `[Mở Ticket hỗ trợ]`.

### 4. Correction (Người dùng sửa kết quả — HAX G9):
- **Tương tác:** Học viên bấm nút `[Chưa đúng ý tôi]` hoặc gõ lại câu hỏi cụ thể hơn.
- **Output:** Bot thu hồi câu trả lời cũ, mở menu hướng dẫn hoặc chuyển tiếp tin nhắn cho TA trực ban kèm tóm tắt nội dung thắc mắc.

---

## §7. Kiểm thử (Kế hoạch cho CP3)
- **Chiều chất lượng:**
  1. *Tính chính xác của Deadline (Grounding Accuracy):* Đạt $100\%$ không bịa mốc thời gian.
  2. *Độ phủ Intent (Intent Recall):* Nhận diện đúng câu hỏi logistics $\ge 90\%$.
  3. *Tỷ lệ Fallback an toàn (Safe Rejection):* Từ chối và chuyển TA $100\%$ các câu ngoài thẩm quyền.
- **Golden set:** 20 case (10 case lấy trực tiếp từ `k4_messages.csv`, 5 case mơ hồ, 5 case bẫy/ngoài thẩm quyền).
- **Quality bar:** *"Đạt khi $\ge 85\%$ (17/20 case) trả lời đúng căn cứ hoặc từ chối đúng quy định, 0% hallucinate deadline sai."*

---

## §8. Phân công & Kế hoạch
- **Phân công trách nhiệm:**
  - `[Tên bạn 1]`: Product Lead — Hoàn thiện Spec, kiểm soát 4 đường đi và rubric chấm bài.
  - `[Tên bạn 2]`: Prompt & Knowledge Engineer — Xây dựng tài liệu Grounding và cấu hình HAX G10/G11.
  - `[Tên bạn 3]`: Frontend & Bot Developer — Xây dựng Clickable Prototype tương tác và kết nối API.
  - `[Tên bạn 4]`: QA & Evaluator — Chạy bộ Golden Set 20 case, đo lường tỷ lệ pass/fail cho CP3.
- **Willing users:** 2 học viên ngoài nhóm sẵn sàng tham gia thử nghiệm tại CP5.

---

## §9. Changelog
| Thời điểm | Đổi gì | Vì sao |
|---|---|---|
| 17/09 · 18:45 | Tạo tài liệu Spec v1.0, cập nhật mục §4 và §6 | Hoàn thành yêu cầu thiết kế luồng trải nghiệm cho CP2 |
