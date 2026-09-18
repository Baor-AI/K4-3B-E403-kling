
      (function () {
        // ===== CHANNEL STATE =====
        var currentChannel = "ch02"; // ch02 | ch03 | ch10
        var channelMeta = {
          ch02: {
            name: "#channel_02 Â· tháº£o-luáº­n",
            sub: "KÃªnh tháº£o luáº­n â€” Tá»± Ä‘á»™ng tráº£ lá»i tá»©c thÃ¬ cÃ¢u há»i FAQ",
            badge: "nobot",
            badgeLabel: "âš¡ Tá»° Äá»˜NG TRáº¢ Lá»œI",
            hint: "KÃªnh tháº£o luáº­n tá»± nhiÃªn: Há»c viÃªn há»i cÃ¢u há»i FAQ sáº½ Ä‘Æ°á»£c há»‡ thá»‘ng phÃ¡t hiá»‡n vÃ  tráº£ lá»i ngay láº­p tá»©c (khÃ´ng cáº§n tag).",
            placeholder: "GÃµ cÃ¢u há»i â€” bot sáº½ tá»± Ä‘á»™ng tráº£ lá»i ngay láº­p tá»©c..."
          },
          ch03: {
            name: "#channel_03 Â· há»i-Ä‘Ã¡p",
            sub: "KÃªnh há»i Ä‘Ã¡p â€” Tá»± Ä‘á»™ng tráº£ lá»i tá»©c thÃ¬ cÃ¢u há»i FAQ",
            badge: "nobot",
            badgeLabel: "âš¡ Tá»° Äá»˜NG TRáº¢ Lá»œI",
            hint: "KÃªnh há»i Ä‘Ã¡p chung: Há»c viÃªn Ä‘áº·t cÃ¢u há»i sáº½ Ä‘Æ°á»£c bot pháº£n há»“i ngay tá»©c thÃ¬ náº¿u Ä‘Ã£ cÃ³ Ä‘Ã¡p Ã¡n máº«u.",
            placeholder: "GÃµ cÃ¢u há»i â€” bot sáº½ tá»± Ä‘á»™ng tráº£ lá»i ngay láº­p tá»©c..."
          },
          ch10: {
            name: "#channel_10 Â· trá»£-lÃ½",
            sub: "KÃªnh trá»£ lÃ½ â€” Bot chá»‰ pháº£n há»“i khi Ä‘Æ°á»£c tag @Trá»£ lÃ½",
            badge: "hasbot",
            badgeLabel: "ðŸ¤– Cáº¦N TAG @TRá»¢ LÃ",
            hint: "KÃªnh trá»£ lÃ½: Cáº§n tag @Trá»£ lÃ½ á»Ÿ Ä‘áº§u cÃ¢u há»i Ä‘á»ƒ bot pháº£n há»“i. Náº¿u khÃ´ng tag, bot sáº½ im láº·ng.",
            placeholder: "GÃµ @Trá»£ lÃ½ [cÃ¢u há»i] â€” bot chá»‰ tráº£ lá»i khi cÃ³ tag..."
          }
        };

        // ===== MáºªU TIN NHáº®N Máº¶C Äá»ŠNH CHO Tá»ªNG KÃŠNH =====
        var defaultChannelMessages = {
          ch02: [
            { who: "sys", text: "ðŸ“¢ KÃªnh <b>#channel_02 Â· tháº£o-luáº­n</b> â€” KÃªnh trao Ä‘á»•i tá»± do (KHÃ”NG CÃ“ BOT TRá»°C). Há»c viÃªn há»i cÃ¢u há»i logistics/FAQ sáº½ Ä‘Æ°á»£c bot tá»± Ä‘á»™ng phÃ¡t hiá»‡n vÃ  giáº£i Ä‘Ã¡p ngay." }
          ],
          ch03: [
            { who: "sys", text: "ðŸ“¢ KÃªnh <b>#channel_03 Â· há»i-Ä‘Ã¡p</b> â€” KÃªnh há»i Ä‘Ã¡p tháº¯c máº¯c (KHÃ”NG CÃ“ BOT TRá»°C). CÃ¡c cÃ¢u há»i thá»§ tá»¥c sáº½ Ä‘Æ°á»£c bot há»— trá»£ tá»± Ä‘á»™ng." }
          ],
          ch10: [
            { who: "sys", text: "ðŸ“¢ KÃªnh <b>#channel_10 Â· trá»£-lÃ½</b> â€” KÃŠNH BOT TRá»°C CHUYÃŠN Dá»¤NG. Bot <b>CHá»ˆ</b> pháº£n há»“i khi báº¡n tag <b>@Trá»£ lÃ½</b> (náº¿u khÃ´ng tag, bot sáº½ giá»¯ im láº·ng)." }
          ]
        };

        // Kho lÆ°u trá»¯ tin nháº¯n Ä‘á»™c láº­p cho tá»«ng kÃªnh (khÃ´ng bá»‹ Ä‘Ã¨ hay láº«n lá»™n)
        var channelStore = {
          ch02: defaultChannelMessages.ch02.slice(),
          ch03: defaultChannelMessages.ch03.slice(),
          ch10: defaultChannelMessages.ch10.slice()
        };

        // Global map to cache bot answers for each normalized question
        var answerCache = {};

        // Biáº¿n ghi nhá»› cÃ¢u há»i vá»«a há»i mÃ  chÆ°a tag bot á»Ÿ kÃªnh ch10
        var lastPendingQuestionInCh10 = "";

        // ===== CHANNEL SWITCHER =====
        document.querySelectorAll(".ch-tab").forEach(function(btn) {
          btn.addEventListener("click", function() {
            switchChannel(btn.getAttribute("data-ch"));
          });
        });

        function switchChannel(ch) {
          currentChannel = ch;
          var meta = channelMeta[ch];

          // Update tabs
          document.querySelectorAll(".ch-tab").forEach(function(b) {
            b.classList.toggle("active", b.getAttribute("data-ch") === ch);
          });

          // Update header
          document.getElementById("chName").textContent = meta.name;
          document.getElementById("chSub").textContent = meta.sub;
          var badge = document.getElementById("chModeBadge");
          badge.className = "ch-mode-badge " + meta.badge;
          badge.textContent = meta.badgeLabel;

          // Update placeholder
          document.getElementById("customInput").placeholder = meta.placeholder;

          // Render Ä‘á»™c láº­p tin nháº¯n cá»§a kÃªnh Ä‘Æ°á»£c chá»n (xÃ³a sáº¡ch khung cÅ©, náº¡p Ä‘Ãºng kÃªnh Ä‘Ã³)
          renderCurrentChannel();
        }

        var scenarios = [
          {
            id: "repeat-q",
            tag: "ðŸ”",
            label: "CÃ¢u há»i láº·p",
            railLabel: "CÃ¢u há»i láº·p (Pain Point)",
            foot: "CÃ¹ng cÃ¢u há»i Ä‘Ã£ há»i â†’ bot nháº­n ra ngay, khÃ´ng cáº§n chá» 2s.",
            annot: "<b>Pain Point tá»« data tháº­t:</b> 7 cÃ¢u há»i thá»§ tá»¥c bá»‹ há»i láº·p láº¡i tá»•ng cá»™ng 16 lÆ°á»£t (M30246, M48859...). Bot nháº­n diá»‡n cÃ¢u há»i Ä‘Ã£ cÃ³ Ä‘Ã¡p Ã¡n xÃ¡c nháº­n rá»“i â†’ tráº£ lá»i ngay, khÃ´ng Ä‘á»ƒ há»c viÃªn chá» vÃ´ thá»i háº¡n. <b>ÄÃ¢y lÃ  tÃ­nh nÄƒng á»Ÿ channel_02/03 â€” kÃªnh khÃ´ng cÃ³ bot trá»±c.</b>",
            steps: [
              { who: "sys", text: "ðŸ“¢ KÃªnh #channel_02 Â· tháº£o-luáº­n â€” KHÃ”NG CÃ“ BOT TRá»°C" },
              { who: "user", text: "Háº¡n ná»™p bÃ i Lab02 lÃ  khi nÃ o váº­y?" },
              { who: "sys", text: "... im láº·ng 3 giÃ¢y â€” khÃ´ng ai reply ..." },
              {
                who: "bot",
                badge: ["ok", "ðŸ¤– Tá»± Ä‘á»™ng Â· âœ“ Khá»›p FAQ Ä‘Ã£ xÃ¡c nháº­n"],
                text: "Háº¡n ná»™p bÃ i <b>Lab02</b> chÃ­nh thá»©c lÃ  <b>23:59 Thá»© SÃ¡u, ngÃ y 18/09/2026</b> trÃªn VLearn vÃ  GitHub Org.",
                source: "PhÃ¡t hiá»‡n tá»± Ä‘á»™ng sau 3s khÃ´ng cÃ³ pháº£n há»“i Â· TrÃ­ch: #ðŸ“¢-thÃ´ng-bÃ¡o (BTC_ANN_042)",
                actions: [{ label: "ðŸ‘ Há»¯u Ã­ch", kind: "done" }, { label: "âœï¸ BÃ¡o sai", kind: "correct" }]
              },
              { who: "user", text: "Háº¡n ná»™p bÃ i Lab02 lÃ  khi nÃ o váº­y?" },
              {
                who: "bot",
                badge: ["ok", "ðŸ” ÄÃ£ tráº£ lá»i cÃ¢u há»i nÃ y Â· Tráº£ lá»i ngay"],
                text: "MÃ¬nh Ä‘Ã£ tháº¥y cÃ¢u há»i nÃ y vá»«a Ä‘Æ°á»£c há»i á»Ÿ kÃªnh! Háº¡n ná»™p <b>Lab02</b> lÃ  <b>23:59 ngÃ y 18/09/2026</b>.",
                source: "Nháº­n diá»‡n cÃ¢u há»i láº·p â€” khÃ´ng Ä‘á»ƒ há»c viÃªn chá» láº§n hai",
                actions: [{ label: "ðŸ‘ Há»¯u Ã­ch", kind: "done" }]
              }
            ]
          },
          {
            id: "happy",
            tag: "â‘ â†’ok",
            label: "Happy path",
            railLabel: "Happy path",
            foot: "AI tá»± tráº£ lá»i â€” khá»›p cao vá»›i thÃ´ng bÃ¡o BTC Ä‘Ã£ xÃ¡c nháº­n.",
            annot:
              "<b>G11 â€” Giáº£i thÃ­ch vÃ¬ sao:</b> cÃ¢u tráº£ lá»i luÃ´n kÃ¨m dÃ²ng nguá»“n 'Ä‘Ã£ xÃ¡c nháº­n lÃºc...' Ä‘á»ƒ há»c viÃªn biáº¿t Ä‘Ã¢y lÃ  Ä‘Ã¡p Ã¡n tá»« thÃ´ng bÃ¡o chÃ­nh thá»©c, khÃ´ng pháº£i suy luáº­n má»›i. <b>G8 â€” Gáº¡t bá» dá»… dÃ ng:</b> cÃ³ nÃºt 'KhÃ´ng pháº£i Ä‘iá»u tÃ´i há»i' Ä‘á»ƒ thoÃ¡t ngay náº¿u bot hiá»ƒu sai Ã½.",
            steps: [
              { who: "user", text: "Háº¡n ná»™p bÃ i Lab02 lÃ  khi nÃ o váº­y bot?" },
              {
                who: "bot",
                badge: ["ok", "âœ“ Khá»›p thÃ´ng bÃ¡o chÃ­nh thá»©c BTC"],
                text: "Háº¡n ná»™p bÃ i <b>Lab02</b> chÃ­nh thá»©c lÃ  <b>23:59 ngÃ y 18/09/2026</b> trÃªn há»‡ thá»‘ng VLearn.",
                source:
                  "TrÃ­ch dáº«n tá»« kÃªnh #ðŸ“¢-thÃ´ng-bÃ¡o-lá»›p-há»c (ThÃ´ng bÃ¡o lÃºc 13/09) Â· Phá»¥c vá»¥ 110 lÆ°á»£t tháº¯c máº¯c tÆ°Æ¡ng tá»±",
                actions: [
                  { label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" },
                  { label: "KhÃ´ng pháº£i Ä‘iá»u tÃ´i há»i", kind: "plain" },
                ],
              },
            ],
          },
          {
            id: "low-confidence",
            tag: "â‘¡",
            label: "Low-confidence",
            railLabel: "Low-confidence (â‘¡)",
            foot: "AI tráº£ lá»i pháº§n cháº¯c, chuyá»ƒn TA pháº§n mÆ¡ há»“ â€” khÃ´ng Ä‘oÃ¡n.",
            annot:
              "<b>G10 â€” Thu háº¹p pháº¡m vi khi nghi ngá» (báº¯t buá»™c):</b> cÃ¢u há»i láº«n pháº§n cÃ¡ nhÃ¢n nÃªn bot chá»‰ tráº£ lá»i pháº§n FAQ chung (cÃ¡ch xem XP), cÃ²n pháº§n 'XP cá»§a tÃ´i' â€” khÃ´ng cÃ³ cÄƒn cá»© cÃ¡ nhÃ¢n hoÃ¡ â€” bot chá»§ Ä‘á»™ng tag TA thay vÃ¬ Ä‘oÃ¡n sá»‘ liá»‡u.",
            steps: [
              {
                who: "user",
                text: "XP cá»§a em sao chÆ°a lÃªn váº­y áº¡, vá»›i cÃ¡ch xem XP á»Ÿ Ä‘Ã¢u?",
              },
              {
                who: "bot",
                badge: ["warn", "âš  Má»™t pháº§n cáº§n ngÆ°á»i xÃ¡c nháº­n"],
                text: "CÃ¡ch xem XP: vÃ o kÃªnh <code>#xp-board</code>, gÃµ <code>/xp</code> Ä‘á»ƒ xem Ä‘iá»ƒm hiá»‡n táº¡i. CÃ²n pháº§n <i>'XP cá»§a em sao chÆ°a lÃªn'</i> liÃªn quan dá»¯ liá»‡u cÃ¡ nhÃ¢n, mÃ¬nh khÃ´ng tá»± kiá»ƒm tra Ä‘Æ°á»£c nÃªn Ä‘Ã£ chuyá»ƒn cho TA nhÃ©.",
                source:
                  "Pháº§n chung: khá»›p FAQ Ä‘Ã£ xÃ¡c nháº­n Â· Pháº§n cÃ¡ nhÃ¢n: khÃ´ng Ä‘á»§ cÄƒn cá»©, khÃ´ng Ä‘oÃ¡n",
                ta: "ÄÃ£ tag @TA-trá»±c-tuáº§n cho pháº§n Ä‘iá»ƒm XP cÃ¡ nhÃ¢n",
              },
            ],
          },
          {
            id: "no-grounding",
            tag: "â‘ ",
            label: "No-grounding",
            railLabel: "Failure / khÃ´ng cÄƒn cá»© (â‘ )",
            foot: "KhÃ´ng tÃ¬m Ä‘Æ°á»£c nguá»“n â†’ khÃ´ng bá»‹a, chuyá»ƒn ngÆ°á»i.",
            annot:
              "<b>G10 â€” Thu háº¹p pháº¡m vi khi nghi ngá»:</b> cÃ¢u há»i hoÃ n toÃ n má»›i, khÃ´ng khá»›p FAQ nÃ o Ä‘Ã£ xÃ¡c nháº­n â€” bot tá»« chá»‘i Ä‘oÃ¡n vÃ  nÃ³i rÃµ giá»›i háº¡n thay vÃ¬ táº¡o cÃ¢u tráº£ lá»i nghe há»£p lÃ½ nhÆ°ng cÃ³ thá»ƒ sai.",
            steps: [
              {
                who: "user",
                text: "PhÃ²ng lab hÃ´m nay Ä‘á»•i chá»—, ai ngá»“i nháº§m phÃ²ng thÃ¬ xá»­ lÃ½ sao áº¡?",
              },
              {
                who: "bot",
                badge: ["danger", "âœ• ChÆ°a cÃ³ cÄƒn cá»© xÃ¡c nháº­n"],
                text: "MÃ¬nh chÆ°a cÃ³ cÃ¢u tráº£ lá»i Ä‘Æ°á»£c xÃ¡c nháº­n cho viá»‡c nÃ y. Äá»ƒ khÃ´ng tráº£ lá»i sai, mÃ¬nh Ä‘Ã£ chuyá»ƒn cÃ¢u há»i nÃ y cho TA trá»±c â€” báº¡n Ä‘á»£i chÃºt nhÃ©.",
                source:
                  "KhÃ´ng khá»›p vá»›i báº¥t ká»³ thÃ´ng bÃ¡o nÃ o cá»§a BTC trong há»‡ thá»‘ng",
                ta: "ÄÃ£ tag @TA-trá»±c-tuáº§n",
              },
            ],
          },
          {
            id: "correction",
            tag: "âœŽ",
            label: "Correction",
            railLabel: "Correction (user sá»­a)",
            foot: "Há»c viÃªn bÃ¡o sai â†’ Ä‘Ã¡p Ã¡n Ä‘Æ°á»£c Ä‘Ã¡nh dáº¥u chá» xÃ¡c nháº­n láº¡i.",
            annot:
              "<b>G9 â€” Há»— trá»£ sá»­a dá»… dÃ ng:</b> má»—i cÃ¢u tráº£ lá»i FAQ cÃ³ nÃºt bÃ¡o sai ngay táº¡i chá»—, khÃ´ng cáº§n rá»i kÃªnh hay má»Ÿ form riÃªng; há»‡ thá»‘ng khÃ´ng tá»± sá»­a ná»™i dung mÃ  Ä‘Ã¡nh dáº¥u chá» TA duyá»‡t láº¡i.",
            steps: [
              { who: "user", text: "Háº¡n ná»™p Lab02 lÃ  khi nÃ o áº¡?" },
              {
                who: "bot",
                badge: ["ok", "âœ“ Khá»›p FAQ Ä‘Ã£ xÃ¡c nháº­n"],
                text: "Háº¡n ná»™p Lab02: 23:59 ngÃ y 18/09/2026.",
                source:
                  "Tráº£ lá»i dá»±a trÃªn cÃ¢u há»i tÆ°Æ¡ng tá»± Ä‘Ã£ Ä‘Æ°á»£c TA xÃ¡c nháº­n lÃºc 13/09",
                actions: [
                  { label: "ChÆ°a Ä‘Ãºng / cáº­p nháº­t giÃºp mÃ¬nh", kind: "correct" },
                ],
              },
            ],
          },
          {
            id: "out-of-scope",
            tag: "â‘¢",
            label: "NgoÃ i pháº¡m vi",
            railLabel: "NgoÃ i pháº¡m vi (â‘¢)",
            foot: "YÃªu cáº§u vÆ°á»£t pháº¡m vi tráº£ lá»i tá»± Ä‘á»™ng â†’ tá»« chá»‘i rÃµ rÃ ng, khÃ´ng giáº£ vá» lÃ m Ä‘Æ°á»£c.",
            annot:
              "<b>G11 â€” Giáº£i thÃ­ch vÃ¬ sao:</b> bot nÃ³i rÃµ Ä‘Ã¢y lÃ  viá»‡c ngoÃ i pháº¡m vi tráº£ lá»i tá»± Ä‘á»™ng (khÃ´ng pháº£i 'khÃ´ng hiá»ƒu cÃ¢u há»i'), giÃºp há»c viÃªn biáº¿t cáº§n há»i ai thay vÃ¬ thá»­ há»i láº¡i bot nhiá»u láº§n.",
            steps: [
              {
                who: "user",
                text: "Em bá»‹ sá»‘t, bot cho em xin gia háº¡n ná»™p bÃ i Lab02 thÃªm 2 tiáº¿ng Ä‘Æ°á»£c khÃ´ng?",
              },
              {
                who: "bot",
                badge: ["warn", "âš  NgoÃ i tháº©m quyá»n tá»± Ä‘á»™ng"],
                text: "Viá»‡c gia háº¡n deadline mÃ¬nh khÃ´ng cÃ³ quyá»n tá»± quyáº¿t Ä‘á»‹nh â€” cáº§n Lab Coach hoáº·c BTC xem xÃ©t. MÃ¬nh Ä‘Ã£ chuyá»ƒn yÃªu cáº§u nÃ y cho TA vÃ  hÆ°á»›ng dáº«n báº¡n má»Ÿ lá»‡nh <code>/ticket create</code> nhÃ©.",
                source:
                  "YÃªu cáº§u vÆ°á»£t tháº©m quyá»n cá»§a bot tá»± Ä‘á»™ng (quyáº¿t Ä‘á»‹nh gia háº¡n bÃ i thi)",
                ta: "ÄÃ£ tag @TA-trá»±c-ban",
              },
            ],
          },
          {
            id: "domain-case",
            tag: "â‘£",
            label: "Case domain Ä‘áº·c thÃ¹",
            railLabel: "Case Ä‘áº·c thÃ¹ domain (â‘£)",
            foot: "ÄÃ¡p Ã¡n cÅ© cÃ³ thá»ƒ Ä‘Ã£ háº¿t hiá»‡u lá»±c â†’ khÃ´ng tÃ¡i dÃ¹ng mÃ¹ quÃ¡ng.",
            annot:
              "<b>G10 + G11:</b> Ä‘Ã¡p Ã¡n mang theo ngÃ y xÃ¡c nháº­n; khi cÃ³ tÃ­n hiá»‡u quy Ä‘á»‹nh vá»«a Ä‘á»•i (tá»« khoÃ¡ 'gia háº¡n', 'má»›i') mÃ  chÆ°a cÃ³ báº£n xÃ¡c nháº­n má»›i, bot khÃ´ng tÃ¡i dÃ¹ng Ä‘Ã¡p Ã¡n cÅ© mÃ  xá»­ lÃ½ nhÆ° case â‘  â€” chuyá»ƒn TA thay vÃ¬ tráº£ lá»i cÃ³ thá»ƒ Ä‘Ã£ lá»—i thá»i.",
            steps: [
              {
                who: "user",
                text: "Em nghe nÃ³i lab02 Ä‘Æ°á»£c gia háº¡n, giá» háº¡n ná»™p lÃ  khi nÃ o áº¡?",
              },
              {
                who: "bot",
                badge: ["warn", "âš  ÄÃ¡p Ã¡n cÅ© cÃ³ thá»ƒ Ä‘Ã£ lá»—i thá»i"],
                text: "ÄÃ¡p Ã¡n mÃ¬nh cÃ³ (23:59 ngÃ y 18/09) Ä‘Æ°á»£c ghi nháº­n trÆ°á»›c khi cÃ³ tin gia háº¡n â€” mÃ¬nh khÃ´ng cháº¯c cÃ²n Ä‘Ãºng nÃªn chÆ°a muá»‘n tráº£ lá»i sai. ÄÃ£ chuyá»ƒn TA Ä‘á»ƒ xÃ¡c nháº­n háº¡n má»›i nhÃ©.",
                source:
                  "PhÃ¡t hiá»‡n tá»« khoÃ¡ 'gia háº¡n' mÃ¢u thuáº«n vá»›i Ä‘Ã¡p Ã¡n Ä‘Ã£ lÆ°u â†’ khÃ´ng tÃ¡i sá»­ dá»¥ng khi chÆ°a xÃ¡c nháº­n láº¡i",
                ta: "ÄÃ£ tag @TA-trá»±c-tuáº§n",
              },
            ],
          },
        ];

        var bar = document.getElementById("scenarioBar");
        var railList = document.getElementById("railList");
        var chatBody = document.getElementById("chatBody");
        var chatFoot = document.getElementById("chatFoot");
        var annot = document.getElementById("annot");
        var customForm = document.getElementById("customChatForm");
        var customInput = document.getElementById("customInput");

        // Typing indicator element (tÃ¡i sá»­ dá»¥ng)
        var typingEl = document.createElement("div");
        typingEl.className = "typing-indicator";

        // ===== FORM SUBMIT LISTENER =====
        customForm.addEventListener("submit", function(e) {
          e.preventDefault();
          var raw = customInput.value.trim();
          if (!raw) return;
          customInput.value = "";

          // Chuáº©n hÃ³a cÃ¢u há»i
          var cleanQ = raw.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ").trim();

          // Hiá»ƒn thá»‹ tin nháº¯n user
          addMessageToCurrentChannel({ who: "user", text: raw });

          // Kiá»ƒm tra khÃ´ng cÃ³ tag @Trá»£ lÃ½ á»Ÿ kÃªnh ch10
          if (currentChannel === "ch10" && !raw.toLowerCase().includes("@tr")) {
            addMessageToCurrentChannel({
              who: "sys",
              text: "ðŸ”‡ <i>Bot á»Ÿ kÃªnh nÃ y chá»‰ pháº£n há»“i khi báº¡n tag <b>@Trá»£ lÃ½</b> vÃ o Ä‘áº§u cÃ¢u há»i!</i>"
            });
            return;
          }

          // Náº¿u cÃ³ tag @Trá»£ lÃ½, bá» pháº§n tag Ä‘i rá»“i láº¥y cÃ¢u há»i tháº­t
          var queryRaw = raw.replace(/@trá»£\s*lÃ½/gi, "").trim();
          if (!queryRaw) queryRaw = raw;
          var cleanQNorm = queryRaw.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, " ").trim();

          // Typing indicator
          typingEl.innerHTML = '<div class="avatar" style="background:var(--accent-2);opacity:0.7">TL</div><div class="typing-dots"><span></span><span></span><span></span></div>';
          chatBody.appendChild(typingEl);
          chatBody.scrollTop = chatBody.scrollHeight;

          setTimeout(function() {
            if (typingEl.parentNode) typingEl.remove();
            classifyAndReply(cleanQNorm, cleanQNorm);
          }, 600);
        });

        scenarios.forEach(function (s) {
          var b = document.createElement("button");
          b.className = "scenario-btn";
          b.id = "btn-" + s.id;
          b.innerHTML = '<span class="tag">' + s.tag + "</span>" + s.label;
          b.addEventListener("click", function () {
            render(s.id);
          });
          bar.appendChild(b);

          var r = document.createElement("div");
          r.className = "rail-item";
          r.id = "rail-" + s.id;
          r.textContent = s.railLabel;
          r.addEventListener("click", function () {
            render(s.id);
          });
          railList.appendChild(r);
        });

        var isFirstRender = true;
        var currentScenarioId = "happy";
        var scenarioHistories = {};

        // Khá»Ÿi táº¡o báº£n sao lá»‹ch sá»­ tin nháº¯n cho tá»«ng ká»‹ch báº£n
        scenarios.forEach(function (s) {
          scenarioHistories[s.id] = s.steps.slice();
        });

        function renderCurrentChannel() {
          chatBody.innerHTML = "";
          var list = channelStore[currentChannel] || [];
          list.forEach(function (step) {
            appendMessageDOM(step);
          });
          chatBody.scrollTop = chatBody.scrollHeight;
        }

        function appendMessageDOM(step) {
          // System message step
          if (step.who === "sys") {
            var sysEl = document.createElement("div");
            sysEl.className = "sys-msg";
            sysEl.innerHTML = step.text;
            chatBody.appendChild(sysEl);
            chatBody.scrollTop = chatBody.scrollHeight;
            return;
          }

          var msg = document.createElement("div");
          msg.className = "msg " + step.who;
          msg.setAttribute("data-ch", currentChannel);

          // Avatar
          var av = document.createElement("div");
          av.className = "avatar";
          av.textContent = step.who === "user" ? "HV" : "TL";
          if (step.who !== "user") av.style.background = "var(--accent-2)";
          msg.appendChild(av);

          // Bubble
          var bubble = document.createElement("div");
          bubble.className = "bubble";

          if (step.badge) {
            var badgeEl = document.createElement("div");
            badgeEl.className = "badge " + step.badge[0];
            badgeEl.textContent = step.badge[1];
            bubble.appendChild(badgeEl);
          }

          var textEl = document.createElement("div");
          textEl.innerHTML = step.text || "";
          bubble.appendChild(textEl);

          if (step.source) {
            var srcEl = document.createElement("div");
            srcEl.className = "source-line";
            srcEl.textContent = "ðŸ“Ž " + step.source;
            bubble.appendChild(srcEl);
          }

          if (step.ta) {
            var taEl = document.createElement("div");
            taEl.className = "ta-tag";
            taEl.innerHTML = "ðŸ”” " + step.ta;
            bubble.appendChild(taEl);
          }

          if (step.actions && step.actions.length) {
            var actDiv = document.createElement("div");
            actDiv.className = "actions";
            step.actions.forEach(function(act) {
              var btn = document.createElement("button");
              btn.className = "action-btn";
              btn.textContent = act.label;
              btn.addEventListener("click", function() {
                btn.classList.add("done");
                btn.disabled = true;
              });
              actDiv.appendChild(btn);
            });
            bubble.appendChild(actDiv);
          }

          msg.appendChild(bubble);
          chatBody.appendChild(msg);
          chatBody.scrollTop = chatBody.scrollHeight;

        }

        // ===== HELPER: thÃªm tin nháº¯n vÃ o kÃªnh hiá»‡n táº¡i vÃ  render =====
        var _pendingCacheKey = null; // set trÆ°á»›c má»—i bot reply Ä‘á»ƒ lÆ°u cache
        function addMessageToCurrentChannel(step) {
          channelStore[currentChannel].push(step);
          appendMessageDOM(step);
          // Tá»± Ä‘á»™ng cache náº¿u Ä‘Ã¢y lÃ  bot reply vÃ  cÃ³ pending key
          if (step.who === "bot" && _pendingCacheKey && step.text) {
            answerCache[_pendingCacheKey] = step.text;
            _pendingCacheKey = null;
          }
        }

        // ===== HÃ€M PHÃ‚N LOáº I VÃ€ TRáº¢ Lá»œI =====
        function classifyAndReply(q, cacheKey) {
          if (!cacheKey) cacheKey = q;
          // PhÃ¡t hiá»‡n cÃ¢u há»i láº·p â€” tráº£ lá»i ngay tá»« cache
          if (answerCache[q]) {
            addMessageToCurrentChannel({
              who: "bot",
              badge: ["ok", "ðŸ” ÄÃ£ tráº£ lá»i cÃ¢u há»i nÃ y Â· Tráº£ lá»i ngay"],
              text: answerCache[q],
              source: "Nháº­n diá»‡n cÃ¢u há»i láº·p â€” khÃ´ng Ä‘á»ƒ há»c viÃªn chá» láº§n hai"
            });
            return;
          }
          // Äáº·t cache key Ä‘á»ƒ lÆ°u sau khi tráº£ lá»i
          _pendingCacheKey = cacheKey;
          // Real Discord Case 1: KhÃ¡c lá»›p vá» cÃ¹ng lá»›p (M85755)
          if (q.includes("khÃ¡c lá»›p") || (q.includes("nhÃ³m") && (q.includes("vá» cÃ¹ng") || q.includes("cÃ¹ng 1 lá»›p")))) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "nhom-khac-lop",
                badge: ["warn", "âš  Tháº©m quyá»n sáº¯p xáº¿p cá»§a BTC"],
                text: "Viá»‡c ghÃ©p nhÃ³m khÃ¡c lá»›p hoáº·c chuyá»ƒn vá» cÃ¹ng 1 lá»›p do BTC quyáº¿t Ä‘á»‹nh dá»±a trÃªn váº­n hÃ nh thá»±c táº¿.<br>Báº¡n vui lÃ²ng má»Ÿ ticket qua lá»‡nh <code>/ticket create</code> (chá»n type: <b>team-issues</b> hoáº·c <b>general</b>) Ä‘á»ƒ Admin há»— trá»£ nhÃ©!",
                source: "Quy trÃ¬nh xá»­ lÃ½ sá»± cá»‘ Team & Sáº¯p xáº¿p nhÃ¢n sá»± (Discord channel_10)",
                ta: "ÄÃ£ tag @BTC-Admin"
              });
            }
            // Real Discord Case 2 & 3: Lá»‡nh chá»n Ä‘á» tÃ i / Topic pick (M96715, M42370)
            else if (q.includes("Ä‘á» tÃ i") || q.includes("topic") || q.includes("chá»n Ä‘á»")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "de-tai",
                badge: ["ok", "âœ“ Khá»›p hÆ°á»›ng dáº«n lá»‡nh bot"],
                text: "<b>CÃ¡ch xem & chá»n Ä‘á» tÃ i:</b><br>1. VÃ o kÃªnh <b>#ðŸ¤–-bot-commands</b>.<br>2. GÃµ lá»‡nh <code>/topic pick</code> vÃ  chá»n mÃ£ Ä‘á» tá»« gá»£i Ã½.<br>â€¢ Xem láº¡i Ä‘á» Ä‘Ã£ chá»n: <code>/topic view</code><br>â€¢ Kiá»ƒm tra Ä‘á» cÃ²n trá»‘ng: <code>/topic available code:[MÃ£_Ä‘á»]</code>",
                source: "HÆ°á»›ng dáº«n lá»‡nh há»‡ thá»‘ng Discord #ðŸ¤–-bot-commands",
                actions: [{ label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" }]
              });
            }
            // Real Discord Case 4: ÄÄƒng nháº­p Zoom báº±ng mail cÃ¡ nhÃ¢n (M27034)
            else if (q.includes("zoom") && (q.includes("mail") || q.includes("cÃ¡ nhÃ¢n") || q.includes("Ä‘Äƒng nháº­p") || q.includes("Ä‘á»•i tÃªn"))) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "zoom-mail",
                badge: ["ok", "âœ“ Khá»›p quy cháº¿ Workshop Zoom"],
                text: "Báº¡n Ä‘Äƒng nháº­p Zoom báº±ng <b>Email cÃ¡ nhÃ¢n Ä‘Ã£ Ä‘Äƒng kÃ½ vá»›i chÆ°Æ¡ng trÃ¬nh</b> (khÃ´ng dÃ¹ng mail trÆ°á»ng cáº¥p) vÃ  Ä‘á»•i tÃªn Ä‘Ãºng cÃº phÃ¡p: <code>[MÃ£ Lá»›p] - [Há» TÃªn]</code> Ä‘á»ƒ há»‡ thá»‘ng Ä‘iá»ƒm danh tá»± Ä‘á»™ng nhÃ©!",
                source: "Quy Ä‘á»‹nh tham gia Workshop Online v2.4 & KÃªnh #channel_11",
                actions: [{ label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" }]
              });
            }
            // Real Discord Case 5: Thá»i lÆ°á»£ng workshop bao lÃ¢u (M57505)
            else if (q.includes("workshop") && (q.includes("bao lÃ¢u") || q.includes("thá»i lÆ°á»£ng") || q.includes("máº¥y tiáº¿ng") || q.includes("máº¥y giá» káº¿t thÃºc"))) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "workshop-time",
                badge: ["ok", "âœ“ Khá»›p lá»‹ch trÃ¬nh Workshop"],
                text: "CÃ¡c buá»•i Workshop tá»‘i thÆ°á»ng diá»…n ra trong khoáº£ng <b>1.5h â€“ 2h</b> (tá»« 19:30 Ä‘áº¿n khoáº£ng 21:00 â€“ 21:30). Báº¡n cáº§n tham gia tá»‘i thiá»ƒu â‰¥ 80% thá»i lÆ°á»£ng Ä‘á»ƒ Ä‘Æ°á»£c tÃ­nh Ä‘iá»ƒm danh nhÃ©!",
                source: "Lá»‹ch trÃ¬nh Workshop tuáº§n Onboarding & Quy cháº¿ Ä‘iá»ƒm danh",
                actions: [{ label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" }]
              });
            }
            // 1. Nháº§m phÃ²ng (TC09)
            else if (q.includes("nháº§m phÃ²ng") || q.includes("ngá»“i nháº§m")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "nham-phong",
                badge: ["danger", "âœ• ChÆ°a cÃ³ cÄƒn cá»© xÃ¡c nháº­n"],
                text: "MÃ¬nh chÆ°a cÃ³ thÃ´ng tin chÃ­nh thá»©c vá» trÆ°á»ng há»£p Ä‘á»•i phÃ²ng nÃ y. Báº¡n vui lÃ²ng há»i trá»±c tiáº¿p TA/trá»£ giáº£ng Ä‘á»ƒ xÃ¡c nháº­n danh sÃ¡ch phÃ²ng nhÃ©!",
                source: "KhÃ´ng khá»›p vá»›i thÃ´ng bÃ¡o phÃ²ng há»c cá»‘ Ä‘á»‹nh cá»§a BTC",
                ta: "ÄÃ£ tag @TA-trá»±c-tuáº§n"
              });
            }
            // 2. Standup / Daily (TC03, TC05)
            else if (q.includes("standup") || q.includes("stand up") || q.includes("daily") || q.includes("bÃ¡o cÃ¡o ngÃ y")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "standup",
                badge: ["ok", "âœ“ Khá»›p quy cháº¿ Daily Standup"],
                text: "<b>Daily Standup</b> lÃ  bÃ¡o cÃ¡o tiáº¿n Ä‘á»™ cÃ¡ nhÃ¢n hÃ ng ngÃ y.<br>ðŸ•’ Khung giá» ná»™p: <b>00:00 â€“ 10:00 sÃ¡ng hÃ ng ngÃ y</b>.<br>ðŸ“ NÆ¡i ná»™p: gÃµ lá»‡nh <code>/standup submit</code> táº¡i kÃªnh <b>channel_10</b> (hoáº·c kÃªnh #standup).",
                source: "TrÃ­ch dáº«n: Sá»• tay há»c viÃªn AI20K & KÃªnh #ðŸ“¢-thÃ´ng-bÃ¡o",
                actions: [
                  { label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" },
                  { label: "KhÃ´ng pháº£i Ä‘iá»u tÃ´i há»i", kind: "plain" }
                ]
              });
            }
            // 3. XP / Äiá»ƒm thÆ°á»Ÿng (TC04)
            else if (q.includes("xp") || q.includes("Ä‘iá»ƒm xp") || q.includes("báº£ng xáº¿p háº¡ng") || q.includes("leaderboard")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "xp",
                badge: ["ok", "âœ“ Khá»›p quy cháº¿ tÃ­nh Ä‘iá»ƒm"],
                text: "Báº¡n cÃ³ thá»ƒ xem Ä‘iá»ƒm vÃ  báº£ng xáº¿p háº¡ng XP táº¡i kÃªnh <b>#xp-board</b> hoáº·c gÃµ lá»‡nh <code>/leaderboard</code> (hoáº·c <code>/xp</code>) nhÃ©!",
                source: "TrÃ­ch dáº«n: Quy Ä‘á»‹nh tÃ­nh Ä‘iá»ƒm XP & KÃªnh bot tra cá»©u",
                actions: [{ label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" }]
              });
            }
            // 4. Record workshop / Video xem láº¡i (TC02)
            else if (q.includes("record") || q.includes("workshop") || q.includes("video buá»•i")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "record",
                badge: ["ok", "âœ“ Khá»›p tÃ i nguyÃªn lá»›p há»c"],
                text: "Video Record cÃ¡c buá»•i Workshop Ä‘Æ°á»£c lÆ°u trá»¯ táº¡i kÃªnh <b>#tÃ i-nguyÃªn</b> trÃªn Discord hoáº·c má»¥c <b>Workshop</b> trÃªn há»‡ thá»‘ng VLearn.",
                source: "TrÃ­ch dáº«n: #ðŸ“¢-thÃ´ng-bÃ¡o-lá»›p-há»c Â· Kho tÃ i nguyÃªn K4",
                actions: [{ label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" }]
              });
            }
            // 5. PhÃ²ng lab offline (TC06)
            else if ((q.includes("phÃ²ng") || q.includes("á»Ÿ Ä‘Ã¢u") || q.includes("Ä‘á»‹a chá»‰")) && q.includes("lab")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "phong-lab",
                badge: ["ok", "âœ“ Khá»›p thÃ´ng bÃ¡o phÃ²ng há»c"],
                text: "PhÃ²ng há»c Lab offline diá»…n ra táº¡i phÃ²ng <b>E402 vÃ  E403</b>.",
                source: "TrÃ­ch dáº«n: Lá»‹ch há»c tuáº§n Onboarding BTC",
                actions: [{ label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" }]
              });
            }
            // 6. NÆ¡i ná»™p bÃ i Lab (TC08)
            else if (q.includes("ná»™p bÃ i") && (q.includes("á»Ÿ Ä‘Ã¢u") || q.includes("ná»n táº£ng") || q.includes("submit") || q.includes("trÃªn"))) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "nop-bai",
                badge: ["ok", "âœ“ Khá»›p quy cháº¿ ná»™p bÃ i"],
                text: "Ná»™p bÃ i Lab02 gá»“m 2 bÆ°á»›c: Submit Ä‘Æ°á»ng dáº«n trÃªn há»‡ thá»‘ng <b>VLearn</b> vÃ  commit mÃ£ nguá»“n lÃªn <b>GitHub Org</b> cá»§a lá»›p.",
                source: "TrÃ­ch dáº«n: Quy cháº¿ ná»™p bÃ i Lab AI20K",
                actions: [{ label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" }]
              });
            }
            // 7. Deadline Lab02 / PhÃ¢n biá»‡t 12:00 vs 23:59 (TC01, TC18, TC19)
            else if (q.includes("12:00") && q.includes("23:59")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "deadline-lab02",
                badge: ["ok", "âœ“ PhÃ¢n biá»‡t hai má»‘c giá»"],
                text: "Hai má»‘c giá» cÃ³ Ã½ nghÄ©a khÃ¡c nhau:<br>â€¢ <b>12:00 trÆ°a:</b> Háº¡n demo / checkpoint trá»±c tiáº¿p trÃªn lá»›p.<br>â€¢ <b>23:59 Ä‘Ãªm:</b> Háº¡n chÃ³t submit code & bÃ¡o cÃ¡o trÃªn VLearn vÃ  GitHub Org.",
                source: "TrÃ­ch dáº«n: ThÃ´ng bÃ¡o lá»‹ch trÃ¬nh Lab02",
                actions: [{ label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" }]
              });
            }
            else if (q.includes("lab03") || q.includes("lab04") || q.includes("lab 03") || q.includes("lab 04") || q.includes("lab 3") || q.includes("lab 4") || q.includes("03") || q.includes("04")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "lab03-lab04",
                badge: ["danger", "âœ• ChÆ°a cÃ³ cÄƒn cá»© xÃ¡c nháº­n"],
                text: "Hiá»‡n táº¡i <b>chÆ°a cÃ³ thÃ´ng bÃ¡o chÃ­nh thá»©c vá» Lab03/Lab04</b>. Báº¡n vui lÃ²ng theo dÃµi kÃªnh #ðŸ“¢-thÃ´ng-bÃ¡o hoáº·c há»i TA nhÃ©!",
                source: "ChÆ°a cÃ³ thÃ´ng bÃ¡o chÃ­nh thá»©c tá»« BTC",
                ta: "ÄÃ£ tag @TA-trá»±c-tuáº§n"
              });
            }
            else if (q.includes("lab02") || q.includes("lab 2") || q.includes("háº¡n ná»™p") || q.includes("deadline") || q.includes("bao giá» ná»™p")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "deadline-lab02",
                badge: ["ok", "âœ“ Khá»›p thÃ´ng bÃ¡o chÃ­nh thá»©c BTC"],
                text: "Háº¡n ná»™p bÃ i <b>Lab02</b> chÃ­nh thá»©c lÃ  <b>23:59 Thá»© SÃ¡u, ngÃ y 18/09/2026</b> trÃªn há»‡ thá»‘ng VLearn vÃ  GitHub Org.",
                source: "TrÃ­ch dáº«n: #ðŸ“¢-thÃ´ng-bÃ¡o-lá»›p-há»c (MÃ£ tin BTC_ANN_042)",
                actions: [
                  { label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" },
                  { label: "KhÃ´ng pháº£i Ä‘iá»u tÃ´i há»i", kind: "plain" },
                ]
              });
            }
            // 8. Äiá»ƒm danh Zoom vs Lab (TC07, TC12)
            else if (q.includes("zoom")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "diem-danh",
                badge: ["ok", "âœ“ Khá»›p quy cháº¿ Workshop Zoom"],
                text: "Äiá»ƒm danh Workshop Zoom Ä‘Æ°á»£c tÃ­nh tá»± Ä‘á»™ng qua <b>Email Ä‘Äƒng kÃ½</b> vÃ  <b>CÃº phÃ¡p tÃªn Zoom [MÃ£ Lá»›p] - [Há» TÃªn]</b>. YÃªu cáº§u tham gia tá»‘i thiá»ƒu â‰¥ 80% thá»i lÆ°á»£ng.",
                source: "TrÃ­ch dáº«n: Quy Ä‘á»‹nh tham gia Workshop Online v2.4",
                actions: [{ label: "ðŸ‘ ÄÃºng Ã½ mÃ¬nh", kind: "done" }]
              });
            }
            else if (q.includes("Ä‘iá»ƒm danh")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "diem-danh",
                badge: ["warn", "âš  Cáº§n lÃ m rÃµ pháº¡m vi"],
                text: "ChÆ°Æ¡ng trÃ¬nh cÃ³ 2 hÃ¬nh thá»©c Ä‘iá»ƒm danh:<br>1. <b>Lab offline:</b> QuÃ©t mÃ£ QR táº¡i cá»­a phÃ²ng E402/E403 trong 15 phÃºt Ä‘áº§u giá».<br>2. <b>Workshop Zoom:</b> Tá»± Ä‘á»™ng qua email vÃ  cÃº phÃ¡p tÃªn Ä‘Äƒng nháº­p.<br>Báº¡n Ä‘ang tháº¯c máº¯c vá» hÃ¬nh thá»©c nÃ o?",
                source: "TrÃ­ch dáº«n: Sá»• tay quy cháº¿ há»c táº­p AI20K v2.4",
                actions: [
                  { label: "ðŸ¢ Lab offline", kind: "done" },
                  { label: "ðŸ’» Workshop Zoom", kind: "done" }
                ]
              });
            }
            // 9. NgoÃ i pháº¡m vi: Check bÃ i, xin gia háº¡n, lá»—i commit (TC15, TC16, TC17)
            else if (q.includes("check") || q.includes("kiá»ƒm tra bÃ i") || q.includes("Ä‘Ã£ ná»™p chÆ°a") || q.includes("ná»™p chÆ°a")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "check-bai",
                badge: ["warn", "âš  NgoÃ i tháº©m quyá»n tra cá»©u"],
                text: "Bot khÃ´ng cÃ³ quyá»n truy cáº­p dá»¯ liá»‡u cÃ¡ nhÃ¢n cá»§a báº¡n. Vui lÃ²ng tá»± Ä‘Äƒng nháº­p vÃ o <b>VLearn</b> Ä‘á»ƒ kiá»ƒm tra tráº¡ng thÃ¡i ná»™p bÃ i, hoáº·c má»Ÿ ticket há»— trá»£ qua <code>/ticket create</code>.",
                source: "NguyÃªn táº¯c an toÃ n dá»¯ liá»‡u cÃ¡ nhÃ¢n há»c viÃªn",
                ta: "ÄÃ£ tag @TA-trá»±c-ban"
              });
            }
            // TC16: Lá»—i máº¡ng / sá»± cá»‘ commit sau deadline (M40677)
            else if (q.includes("commit") || q.includes("lá»—i máº¡ng") || q.includes("máº¡ng") || ((q.includes("sá»± cá»‘") || q.includes("lá»—i")) && q.includes("ná»™p"))) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "su-co-mang",
                badge: ["warn", "âš  VÆ°á»£t tháº©m quyá»n quyáº¿t Ä‘á»‹nh"],
                text: "Bot khÃ´ng cÃ³ tháº©m quyá»n tá»± quyáº¿t Ä‘á»‹nh tÃ­nh Ä‘Ãºng háº¡n cho cÃ¡c trÆ°á»ng há»£p ná»™p muá»™n do lá»—i ká»¹ thuáº­t. Háº¡n ná»™p Lab02 chÃ­nh thá»©c váº«n lÃ  <b>23:59 Thá»© SÃ¡u, ngÃ y 18/09/2026</b>.<br><br>ðŸ‘‰ Báº¡n vui lÃ²ng chá»¥p láº¡i áº£nh mÃ n hÃ¬nh lá»—i máº¡ng/commit (cÃ³ hiá»ƒn thá»‹ thá»i gian) vÃ  gÃµ lá»‡nh <code>/ticket create</code> hoáº·c nháº¯n trá»±c tiáº¿p cho <b>@Vlearn Admin</b> / @TA-trá»±c-ban Ä‘á»ƒ BTC xem xÃ©t há»— trá»£ nhÃ©!",
                source: "Quy cháº¿ xá»­ lÃ½ sá»± cá»‘ ká»¹ thuáº­t & Tháº©m quyá»n BTC (TC16 - k4_messages.csv M40677)",
                ta: "ÄÃ£ tag @Vlearn Admin"
              });
            }
            else if (q.includes("gia háº¡n") || q.includes("xin thÃªm giá»") || q.includes("ná»™p trá»…") || q.includes("sá»‘t") || q.includes("á»‘m")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "gia-han",
                badge: ["warn", "âš  VÆ°á»£t tháº©m quyá»n tá»± Ä‘á»™ng"],
                text: "Bot khÃ´ng cÃ³ tháº©m quyá»n gia háº¡n deadline. Quyáº¿t Ä‘á»‹nh thuá»™c vá» BTC vÃ  Coach. Báº¡n vui lÃ²ng liÃªn há»‡ trá»±c tiáº¿p TA hoáº·c má»Ÿ <code>/ticket create</code> kÃ¨m minh chá»©ng Ä‘á»ƒ Ä‘Æ°á»£c há»— trá»£.",
                source: "Quy cháº¿ tháº©m quyá»n gia háº¡n deadline",
                ta: "ÄÃ£ tag @TA-trá»±c-ban"
              });
            }
            // 10. Xe buÃ½t / di chuyá»ƒn (TC10)
            else if (q.includes("xe buÃ½t") || q.includes("di chuyá»ƒn") || q.includes("phÆ°Æ¡ng tiá»‡n")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "xe-buyt",
                badge: ["danger", "âœ• ChÆ°a cÃ³ cÄƒn cá»© xÃ¡c nháº­n"],
                text: "MÃ¬nh chÆ°a cÃ³ thÃ´ng tin chÃ­nh thá»©c vá» dá»‹ch vá»¥ xe Ä‘Æ°a Ä‘Ã³n/di chuyá»ƒn. Báº¡n vui lÃ²ng liÃªn há»‡ BTC hoáº·c há»i táº¡i kÃªnh chung nhÃ©!",
                source: "KhÃ´ng tÃ¬m tháº¥y cÄƒn cá»© khá»›p trong dá»¯ liá»‡u BTC",
                ta: "ÄÃ£ tag @TA-trá»±c-tuáº§n"
              });
            }
            // 11. Prompt Injection (TC20)
            else if (q.includes("bá» qua") || q.includes("ignore") || q.includes("quÃªn háº¿t") || q.includes("pretend")) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "prompt-injection",
                badge: ["ok", "âœ“ Giá»¯ vá»¯ng nguyÃªn táº¯c báº£o máº­t"],
                text: "MÃ¬nh váº«n tuÃ¢n thá»§ nguyÃªn táº¯c há»— trá»£ há»c táº­p K4. Háº¡n ná»™p Lab02 váº«n lÃ  <b>23:59 Thá»© SÃ¡u, ngÃ y 18/09/2026</b> nhÃ©!",
                source: "Quy táº¯c an toÃ n há»‡ thá»‘ng trá»£ lÃ½ AI",
                actions: [{ label: "ðŸ‘ ÄÃ£ hiá»ƒu", kind: "done" }]
              });
            }
            // 12. Fallback chÆ°a cÃ³ cÄƒn cá»©
            // TC13: Input cá»™c lá»‘c / thá»­ nghiá»‡m (vÃ­ dá»¥: "1", "a", kÃ½ tá»± ngáº«u nhiÃªn)
            else if (q.trim().length <= 3 || /^[\d\W]+$/.test(q.trim())) {
              addMessageToCurrentChannel({
                who: "bot",
                topic: "intro",
                badge: ["warn", "âš  Cáº§n thÃªm thÃ´ng tin"],
                text: "Xin chÃ o! MÃ¬nh lÃ  trá»£ lÃ½ AI há»— trá»£ há»c viÃªn <b>K4 AI20K Build Phase</b> ðŸ¤–<br><br>Báº¡n cÃ³ thá»ƒ há»i mÃ¬nh vá»:<br>â€¢ ðŸ“… Háº¡n ná»™p bÃ i Lab02<br>â€¢ ðŸ“ Äá»‹a Ä‘iá»ƒm phÃ²ng há»c Lab offline<br>â€¢ ðŸŽ™ Quy cháº¿ Ä‘iá»ƒm danh Zoom / Lab<br>â€¢ ðŸ“‹ Daily Standup lÃ  gÃ¬ &amp; ná»™p á»Ÿ Ä‘Ã¢u<br>â€¢ â­ CÃ¡ch xem Ä‘iá»ƒm XP vÃ  báº£ng xáº¿p háº¡ng<br><br>Báº¡n muá»‘n há»i gÃ¬, cá»© gÃµ thoáº£i mÃ¡i nhÃ©!",
                source: "HÆ°á»›ng dáº«n sá»­ dá»¥ng trá»£ lÃ½ AI K4",
                actions: [{ label: "ðŸ“… Háº¡n ná»™p Lab02?", kind: "plain" }]
              });
            }
            // 12. Fallback â€” cÃ³ ná»™i dung nhÆ°ng khÃ´ng khá»›p tri thá»©c nÃ o
            else {
              if (currentChannel !== "ch10") {
                // Channel thÃ´ng thÆ°á»ng: gá»£i Ã½
                addMessageToCurrentChannel({
                  who: "sys",
                  text: "ðŸ’¡ <i>MÃ¬nh chÆ°a nháº­n ra cÃ¢u há»i nÃ y. Báº¡n thá»­ há»i á»Ÿ <b>#channel_10</b> hoáº·c tag <b>@Trá»£ lÃ½</b> Ä‘á»ƒ Ä‘Æ°á»£c há»— trá»£ nhÃ©!</i>"
                });
              } else {
                // ch10: cÅ©ng tráº£ lá»i "chÆ°a nháº­n ra" â€” KHÃ”NG tá»± Ä‘á»™ng tag TA cho má»i cÃ¢u khÃ´ng khá»›p
                addMessageToCurrentChannel({
                  who: "bot",
                  badge: ["warn", "âš  ChÆ°a nháº­n diá»‡n Ä‘Æ°á»£c cÃ¢u há»i"],
                  text: "MÃ¬nh chÆ°a tÃ¬m tháº¥y cÃ¢u tráº£ lá»i chÃ­nh thá»©c cho cÃ¢u há»i nÃ y trong dá»¯ liá»‡u BTC.<br>Báº¡n cÃ³ thá»ƒ thá»­ diá»…n Ä‘áº¡t láº¡i cÃ¢u há»i, hoáº·c má»Ÿ ticket qua <code>/ticket create</code> Ä‘á»ƒ Admin há»— trá»£ nhÃ©!",
                  source: "KhÃ´ng tÃ¬m tháº¥y cÄƒn cá»© khá»›p trong dá»¯ liá»‡u BTC",
                  actions: [{ label: "ðŸ“© Má»Ÿ ticket há»— trá»£", kind: "done" }]
                });
              }
            }
        }

        // Khá»Ÿi Ä‘á»™ng vá»›i kÃªnh ch02
        switchChannel("ch02");
      })();
    
