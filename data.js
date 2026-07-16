window.CATEGORIES = [
      {
        id: "ai",
        label: "AI ფოტო და ვიდეო",
        priority: 10,
        type: "tool",
        items: [
          { id: "removebg", name: "Remove.bg", desc: "ფონის სწრაფი AI მოშორება ფოტოებიდან.", url: "https://www.remove.bg", alt: "ალტერნატივები: Photoroom, Clipdrop, Pixian.ai" },
          { id: "cleanup", name: "Cleanup.pictures", desc: "ობიექტების, ტექსტისა და watermark-ის მოშორება სურათიდან.", url: "https://cleanup.pictures", alt: "ალტერნატივები: Pixlr, WatermarkRemover.io, Photoshop" },
          { id: "upscayl", name: "Upscayl", desc: "სურათის ხარისხისა და გარჩევადობის გაზრდა AI upscaling-ით.", url: "https://www.upscayl.org", alt: "ალტერნატივები: Topaz Gigapixel, Let's Enhance, chaiNNer" },
          { id: "krea", name: "Krea", desc: "AI image, video და 3D გენერაცია ვიზუალური workflow-ებით.", url: "https://www.krea.ai" },
          { id: "runway", name: "Runway", desc: "AI ვიდეო გენერაცია და რედაქტირება კრეატიული კონტროლით.", url: "https://runwayml.com" },
          { id: "luma", name: "Luma Dream Machine", desc: "ფოტოდან ან ტექსტიდან ბუნებრივი მოძრაობის მქონე AI ვიდეოები.", url: "https://lumalabs.ai/dream-machine" },
          { id: "firefly", name: "Adobe Firefly", desc: "Adobe-ის AI გენერაცია ფოტო, ვიდეო და დიზაინ სამუშაოებისთვის.", url: "https://firefly.adobe.com" },
          { id: "photopea", name: "Photopea", desc: "Photoshop-ის მსგავსი სრული ფოტო რედაქტორი ბრაუზერში.", url: "https://www.photopea.com" }
        ]
      },
      {
        id: "productivity",
        label: "პროდუქტიულობა, PDF და კონვერტაცია",
        priority: 9,
        type: "tool",
        items: [
          { id: "letsview", name: "LetsView", desc: "ეკრანის უსადენო გაზიარება და პრეზენტაცია Wi-Fi-ით.", url: "https://www.letsview.com", alt: "ალტერნატივები: ApowerMirror, Reflector 4, Mirroring360" },
          { id: "ilovepdf", name: "iLovePDF", desc: "PDF merge, split, compress, convert და სხვა ყოველდღიური მოქმედებები.", url: "https://www.ilovepdf.com" },
          { id: "smallpdf", name: "Smallpdf", desc: "სუფთა ინტერფეისი PDF ფაილების დასამუშავებლად.", url: "https://smallpdf.com" },
          { id: "pdf24", name: "PDF24", desc: "უფასო PDF ხელსაწყოების დიდი ნაკრები.", url: "https://tools.pdf24.org" },
          { id: "sejda", name: "Sejda", desc: "PDF-ის რედაქტირება, ხელმოწერა და კონვერტაცია ერთ ადგილას.", url: "https://www.sejda.com" },
          { id: "zamzar", name: "Zamzar", desc: "ფაილების მრავალფორმატიანი კონვერტაცია.", url: "https://www.zamzar.com" },
          { id: "cloudconvert", name: "CloudConvert", desc: "ხარისხიანი ფაილ კონვერტაცია API მხარდაჭერით.", url: "https://cloudconvert.com" }
        ]
      },
      {
        id: "design",
        label: "დიზაინი და UI",
        priority: 8,
        type: "tool",
        items: [
          { id: "figma", name: "Figma", desc: "UI დიზაინი, პროტოტიპები და გუნდური მუშაობა რეალურ დროში.", url: "https://www.figma.com" },
          { id: "penpot", name: "Penpot", desc: "ღია კოდის დიზაინის პლატფორმა გუნდებისთვის.", url: "https://penpot.app" },
          { id: "dribbble", name: "Dribbble", desc: "დიზაინის ინსპირაციისა და რეფერენსების გალერეა.", url: "https://dribbble.com" },
          { id: "mobbin", name: "Mobbin", desc: "რეალური აპების UI პატერნების ბიბლიოთეკა.", url: "https://mobbin.com" },
          { id: "coolors", name: "Coolors", desc: "ფერთა პალიტრების სწრაფი გენერატორი.", url: "https://coolors.co" },
          { id: "webflow", name: "Webflow", desc: "No-code საიტების აწყობა დიზაინერული კონტროლით.", url: "https://webflow.com" }
        ]
      },
      {
        id: "dev",
        label: "დეველოპერული ხელსაწყოები",
        priority: 7,
        type: "tool",
        items: [
          { id: "jsonlint", name: "JSONLint", desc: "JSON-ის ვალიდაცია და ფორმატირება.", url: "https://jsonlint.com" },
          { id: "regex101", name: "Regex101", desc: "რეგულარული გამოსახულებების ტესტირება ცოცხალი ახსნით.", url: "https://regex101.com" },
          { id: "codepen", name: "CodePen", desc: "HTML, CSS და JavaScript ექსპერიმენტები ბრაუზერში.", url: "https://codepen.io" },
          { id: "caniuse", name: "Can I Use", desc: "ბრაუზერის მხარდაჭერის სწრაფი შემოწმება.", url: "https://caniuse.com" },
          { id: "devdocs", name: "DevDocs", desc: "API დოკუმენტაცია ერთ სწრაფ საძიებო ინტერფეისში.", url: "https://devdocs.io" },
          { id: "excalidraw", name: "Excalidraw", desc: "ხელნაწერი სტილის დიაგრამები და wireframe-ები.", url: "https://excalidraw.com" },
          { id: "tinypng", name: "TinyPNG", desc: "სურათების შეკუმშვა ხარისხის დიდი დაკარგვის გარეშე.", url: "https://tinypng.com" }
        ]
      },
      {
        id: "games",
        label: "თამაშები და გამოცნობები",
        priority: 6,
        type: "game",
        items: [
          { id: "globle", name: "Globle", desc: "გამოიცანი ქვეყანა გლობუსზე ფერადი მინიშნებებით.", url: "https://globle-game.com" },
          { id: "worldle", name: "Worldle", desc: "ქვეყნის გამოცნობა სილუეტით, მანძილით და მიმართულებით.", url: "https://worldle.teuteuf.fr" },
          { id: "flagle", name: "Flagle", desc: "ქვეყნის გამოცნობა დროშის ფრაგმენტებით.", url: "https://www.flagle.io" },
          { id: "statele", name: "Statele", desc: "Globle-ის მსგავსი თამაში აშშ-ის შტატებზე.", url: "https://statele.io" },
          { id: "travle", name: "Travle", desc: "იპოვე გზა ორ ქვეყანას შორის მხოლოდ მოსაზღვრე ქვეყნებით.", url: "https://travle.earth" },
          { id: "seterra", name: "Seterra", desc: "გეოგრაფიის drill თამაშები ქვეყნებზე, დედაქალაქებზე და დროშებზე.", url: "https://www.geoguessr.com/seterra" },
          { id: "sporcle-geo", name: "Sporcle: Geography", desc: "გეოგრაფიის trivia quiz-ების დიდი ბიბლიოთეკა.", url: "https://www.sporcle.com/games/category/geography" },
          { id: "earthguessr", name: "EarthGuessr", desc: "ლოკაციის გამოცნობა სატელიტური ხედით 3D გლობუსზე.", url: "https://earthguessr.com" },
          { id: "musicquizly", name: "Music Quizly", desc: "სიმღერის გამოცნობა solo ან multiplayer რეჟიმში.", url: "https://www.musicquizly.com" },
          { id: "nealfun", name: "Neal.fun", desc: "უცნაური და ჭკვიანი ინტერაქტიული ვებ-ექსპერიმენტები.", url: "https://neal.fun" }
        ]
      }
    ];
