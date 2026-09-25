/**
 * Blog seed content: one document per language per post, linked per post by a
 * translation.metadata document. Coverage is deliberately uneven so the blog exercises
 * every case: seven English posts, five in French (with localised slugs and tags), four in
 * Arabic. Posts 6 and 7 are English-only, post 3 has no Arabic version, and so on: those
 * URLs use the translation fallback in the other languages.
 */
import type { IdentifiedSanityDocumentStub } from "@sanity/client";

import { block } from "./helpers.mts";

type Locale = "en" | "fr" | "ar";
type Variant = {
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  tags: string[];
  heading: string;
  paragraphs: [string, string, string];
  coverAlt: string;
};
type PostSpec = { key: string; cover: 1 | 2 | 3; date: string; versions: Partial<Record<Locale, Variant>> };

const MARA = { en: "Mara Okafor", fr: "Mara Okafor", ar: "مارة أوكافور" };
const YUSUF = { en: "Yusuf Haddad", fr: "Yusuf Haddad", ar: "يوسف حداد" };
const INES = { en: "Ines Albrecht", fr: "Ines Albrecht", ar: "إينيس ألبريشت" };

const specs: PostSpec[] = [
  {
    key: "preview-real-design",
    cover: 1,
    date: "2026-09-24T09:00:00Z",
    versions: {
      en: {
        slug: "preview-in-the-real-design",
        title: "Preview in the real design, not a grey form",
        excerpt: "A preview that looks nothing like the site teaches editors nothing. Here is what changes when the draft renders in the production components.",
        author: MARA.en,
        tags: ["preview", "design"],
        heading: "The draft should be the page",
        paragraphs: [
          "Most CMS previews show text in a neutral panel. Editors approve copy that later wraps badly, hides behind an image, or collides with a heading that is two words longer than expected.",
          "When the preview renders in the same components, fonts and image crops as production, those problems appear while the draft is still cheap to change. Review shrinks from a staging round trip to a glance.",
          "The rule we follow is simple: there is exactly one rendering path. Draft and published content go through the same code, and only the data source differs.",
        ],
        coverAlt: "A page proof with a red ellipse and a Draft stamp, drawn as an abstract illustration.",
      },
      fr: {
        slug: "apercu-dans-le-vrai-design",
        title: "Prévisualiser dans le vrai design, pas dans un formulaire gris",
        excerpt: "Un aperçu qui ne ressemble en rien au site n'apprend rien aux éditeurs. Voici ce qui change quand le brouillon s'affiche dans les composants de production.",
        author: MARA.fr,
        tags: ["aperçu", "design"],
        heading: "Le brouillon doit être la page",
        paragraphs: [
          "La plupart des aperçus de CMS affichent le texte dans un panneau neutre. Les éditeurs valident un texte qui, plus tard, passe mal à la ligne, se cache derrière une image ou heurte un titre plus long de deux mots que prévu.",
          "Quand l'aperçu utilise les mêmes composants, polices et recadrages d'image que la production, ces problèmes apparaissent alors que le brouillon est encore facile à modifier. La relecture passe d'un aller-retour en préproduction à un coup d'œil.",
          "Notre règle est simple : un seul chemin de rendu. Le brouillon et le contenu publié passent par le même code ; seule la source des données change.",
        ],
        coverAlt: "Une épreuve de page avec une ellipse rouge et un tampon « Brouillon », dessinée comme une illustration abstraite.",
      },
      ar: {
        slug: "المعاينة-بالتصميم-الحقيقي",
        title: "عاين بالتصميم الحقيقي، لا في نموذج رمادي",
        excerpt: "المعاينة التي لا تشبه الموقع لا تعلّم المحررين شيئًا. هذا ما يتغيّر حين تُعرض المسودة بمكوّنات الإنتاج نفسها.",
        author: MARA.ar,
        tags: ["معاينة", "تصميم"],
        heading: "يجب أن تكون المسودة هي الصفحة",
        paragraphs: [
          "تعرض معظم أنظمة إدارة المحتوى النص في لوحة محايدة. فيوافق المحررون على نص يلتف لاحقًا بشكل سيئ، أو يختبئ خلف صورة، أو يصطدم بعنوان أطول بكلمتين مما كان متوقعًا.",
          "وحين تُعرض المعاينة بالمكوّنات والخطوط وقصّات الصور نفسها المستخدمة في الإنتاج، تظهر هذه المشكلات والمسودة ما تزال رخيصة التعديل. وتتحول المراجعة من جولة على بيئة الاختبار إلى نظرة سريعة.",
          "قاعدتنا بسيطة: مسار عرض واحد فقط. المحتوى المنشور والمسودة يمران عبر الشيفرة نفسها، ولا يختلف سوى مصدر البيانات.",
        ],
        coverAlt: "صفحة مطبوعة عليها إهليلج أحمر وختم «مسودة»، مرسومة كرسم تجريدي.",
      },
    },
  },
  {
    key: "localize-without-duplicating",
    cover: 2,
    date: "2026-09-17T09:00:00Z",
    versions: {
      en: {
        slug: "localize-without-duplicating",
        title: "Localizing a site without duplicating it",
        excerpt: "One document per language keeps each translation independent, publishable on its own schedule, and free to differ where a market needs it.",
        author: YUSUF.en,
        tags: ["localization", "cms"],
        heading: "One document per language",
        paragraphs: [
          "Field-level translations look tidy until the first page needs a different layout in Arabic, or French is ready a week before German. A single document forces every language to publish together.",
          "With one document per language, each version has its own draft, its own slug and its own publish button. A small metadata document links them, which is all the site needs to build a language switcher and hreflang tags.",
          "The cost is more documents and manual structure changes. For most marketing sites that is a good trade.",
        ],
        coverAlt: "An abstract proof sheet with lines of text, a red ellipse and a Draft stamp.",
      },
      fr: {
        slug: "localiser-sans-dupliquer",
        title: "Localiser un site sans le dupliquer",
        excerpt: "Un document par langue garde chaque traduction indépendante, publiable à son rythme et libre de différer là où un marché l'exige.",
        author: YUSUF.fr,
        tags: ["localisation", "cms"],
        heading: "Un document par langue",
        paragraphs: [
          "Les traductions au niveau des champs paraissent propres jusqu'à ce qu'une page exige une mise en page différente en arabe, ou que le français soit prêt une semaine avant l'allemand. Un document unique force toutes les langues à publier ensemble.",
          "Avec un document par langue, chaque version a son brouillon, son slug et son bouton de publication. Un petit document de métadonnées les relie, ce qui suffit au site pour construire un sélecteur de langue et les balises hreflang.",
          "Le prix : plus de documents et des changements de structure à reporter à la main. Pour la plupart des sites marketing, c'est un bon compromis.",
        ],
        coverAlt: "Une épreuve abstraite avec des lignes de texte, une ellipse rouge et un tampon « Brouillon ».",
      },
      ar: {
        slug: "توطين-الموقع-دون-تكراره",
        title: "توطين الموقع دون تكراره",
        excerpt: "مستند لكل لغة يُبقي كل ترجمة مستقلة، قابلة للنشر في موعدها، وحرّة في الاختلاف حيث يتطلب السوق ذلك.",
        author: YUSUF.ar,
        tags: ["توطين", "إدارة المحتوى"],
        heading: "مستند لكل لغة",
        paragraphs: [
          "تبدو ترجمات مستوى الحقول مرتبة حتى تحتاج أول صفحة إلى تخطيط مختلف بالعربية، أو تجهز الفرنسية قبل الألمانية بأسبوع. فالمستند الواحد يجبر كل اللغات على النشر معًا.",
          "أما مع مستند لكل لغة فلكل نسخة مسودتها ومعرّفها وزر نشرها. ويربط بينها مستند بيانات وصفية صغير، وهذا كل ما يحتاجه الموقع لبناء مبدّل اللغة ووسوم hreflang.",
          "الثمن هو مستندات أكثر وتغييرات بنيوية تُنقل يدويًا. ولمعظم المواقع التسويقية هذه صفقة جيدة.",
        ],
        coverAlt: "صفحة تجريدية مطبوعة عليها أسطر نص وإهليلج أحمر وختم «مسودة».",
      },
    },
  },
  {
    key: "translation-fallback",
    cover: 3,
    date: "2026-09-10T09:00:00Z",
    versions: {
      en: {
        slug: "what-a-translation-fallback-should-do",
        title: "What a translation fallback should do",
        excerpt: "Showing the default language when a translation is missing is easy. Doing it honestly, for readers and for search engines, takes four decisions.",
        author: INES.en,
        tags: ["localization", "seo"],
        heading: "Four decisions",
        paragraphs: [
          "First, tell the reader. A visitor on a French page who suddenly gets English deserves a short notice, and a link to the page they are actually reading.",
          "Second, do not advertise the fallback as a translation: no hreflang for it, and keep it out of the index. Third, if a real translation appears under a new address, redirect the old fallback URL to it.",
          "Fourth, refresh the fallback the moment either the source or the translation changes, so the notice never outlives the missing translation.",
        ],
        coverAlt: "An abstract illustration of overlapping circles on a dark ground.",
      },
      fr: {
        slug: "ce-que-doit-faire-un-repli-de-traduction",
        title: "Ce que doit faire un repli de traduction",
        excerpt: "Afficher la langue par défaut quand une traduction manque est facile. Le faire honnêtement, pour les lecteurs comme pour les moteurs, demande quatre décisions.",
        author: INES.fr,
        tags: ["localisation", "seo"],
        heading: "Quatre décisions",
        paragraphs: [
          "D'abord, prévenir le lecteur. Un visiteur sur une page française qui reçoit soudain de l'anglais mérite un court avis et un lien vers la page qu'il lit réellement.",
          "Ensuite, ne pas présenter le repli comme une traduction : pas de hreflang, et hors de l'index. Puis, si une vraie traduction apparaît à une autre adresse, rediriger l'ancienne URL de repli vers elle.",
          "Enfin, actualiser le repli dès que la source ou la traduction change, pour que l'avis ne survive jamais à la traduction manquante.",
        ],
        coverAlt: "Une illustration abstraite de cercles superposés sur un fond sombre.",
      },
    },
  },
  {
    key: "rtl-is-layout",
    cover: 1,
    date: "2026-09-03T09:00:00Z",
    versions: {
      en: {
        slug: "right-to-left-is-a-layout",
        title: "Right-to-left is a layout, not a mirror",
        excerpt: "Flipping everything is the wrong instinct. Logical properties mirror what should mirror, and a few careful exceptions keep the rest intact.",
        author: YUSUF.en,
        tags: ["localization", "design"],
        heading: "Mirror the layout, not the world",
        paragraphs: [
          "Margins, padding, borders and alignment should be written in logical terms (start and end) so one stylesheet serves both directions.",
          "Arrows that mean onward flip. Logos, numbers, photographs and symmetrical marks do not. Arabic also needs its own typography: no letter-spacing, taller leading and no italics.",
          "Test with real Arabic text. Placeholder strings hide most of the problems.",
        ],
        coverAlt: "A blue grid panel with a dark circle, drawn as an abstract illustration.",
      },
      fr: {
        slug: "de-droite-a-gauche-est-une-mise-en-page",
        title: "De droite à gauche : une mise en page, pas un miroir",
        excerpt: "Tout inverser est le mauvais réflexe. Les propriétés logiques inversent ce qui doit l'être, et quelques exceptions soignées préservent le reste.",
        author: YUSUF.fr,
        tags: ["localisation", "design"],
        heading: "Inverser la mise en page, pas le monde",
        paragraphs: [
          "Marges, remplissages, bordures et alignements doivent s'écrire en termes logiques (début et fin) pour qu'une seule feuille de style serve les deux sens.",
          "Les flèches qui signifient « en avant » s'inversent. Les logos, les chiffres, les photographies et les marques symétriques, non. L'arabe demande aussi sa propre typographie : pas d'espacement des lettres, un interlignage plus haut et pas d'italique.",
          "Testez avec du vrai texte arabe. Les textes factices cachent la plupart des problèmes.",
        ],
        coverAlt: "Un panneau bleu quadrillé avec un cercle sombre, dessiné comme une illustration abstraite.",
      },
      ar: {
        slug: "من-اليمين-إلى-اليسار-تخطيط-لا-مرآة",
        title: "من اليمين إلى اليسار تخطيط، لا مرآة",
        excerpt: "قلب كل شيء غريزة خاطئة. الخصائص المنطقية تعكس ما يجب عكسه، وبعض الاستثناءات المدروسة تحفظ الباقي.",
        author: YUSUF.ar,
        tags: ["توطين", "تصميم"],
        heading: "اعكس التخطيط لا العالم",
        paragraphs: [
          "ينبغي كتابة الهوامش والحشو والحدود والمحاذاة بمصطلحات منطقية (البداية والنهاية) ليخدم ملف أنماط واحد الاتجاهين.",
          "الأسهم التي تعني «إلى الأمام» تنعكس. أما الشعارات والأرقام والصور والعلامات المتناظرة فلا. وتحتاج العربية طباعة خاصة بها: بلا تباعد بين الحروف، وبتباعد أسطر أكبر، وبلا خط مائل.",
          "اختبر بنص عربي حقيقي. فالنصوص الوهمية تخفي معظم المشكلات.",
        ],
        coverAlt: "لوحة زرقاء مربعة الخطوط فيها دائرة داكنة، مرسومة كرسم تجريدي.",
      },
    },
  },
  {
    key: "webhooks-fresh",
    cover: 2,
    date: "2026-08-27T09:00:00Z",
    versions: {
      en: {
        slug: "webhooks-tags-and-fresh-pages",
        title: "Webhooks, tags and the shortest path to fresh",
        excerpt: "Publishing should refresh exactly the pages that changed, and nothing else. Cache tags make that a one-line decision instead of a redeploy.",
        author: MARA.en,
        tags: ["cms", "performance"],
        heading: "Tag what you render",
        paragraphs: [
          "Every cached page carries tags naming the content it shows. When an editor publishes, a signed webhook tells the site which tags to expire.",
          "Because tags include the language, publishing the French version refreshes the French page and leaves the English one alone. Siblings are refreshed only when something they depend on, like a link between translations, changes.",
          "The result is pages that are static until the moment they are not.",
        ],
        coverAlt: "An abstract page proof with a red ellipse and stamp.",
      },
      fr: {
        slug: "webhooks-etiquettes-et-pages-fraiches",
        title: "Webhooks, étiquettes et le chemin le plus court vers le frais",
        excerpt: "Publier doit actualiser exactement les pages modifiées, et rien d'autre. Les étiquettes de cache en font une décision d'une ligne plutôt qu'un redéploiement.",
        author: MARA.fr,
        tags: ["cms", "performance"],
        heading: "Étiqueter ce que l'on affiche",
        paragraphs: [
          "Chaque page en cache porte des étiquettes qui nomment le contenu qu'elle montre. À la publication, un webhook signé indique au site quelles étiquettes expirer.",
          "Comme les étiquettes incluent la langue, publier la version française actualise la page française et laisse l'anglaise tranquille. Les versions sœurs ne sont actualisées que lorsque quelque chose dont elles dépendent, comme le lien entre traductions, change.",
          "Résultat : des pages statiques jusqu'au moment où elles ne le sont plus.",
        ],
        coverAlt: "Une épreuve de page abstraite avec une ellipse rouge et un tampon.",
      },
    },
  },
  {
    key: "draft-mode",
    cover: 3,
    date: "2026-08-20T09:00:00Z",
    versions: {
      en: {
        slug: "draft-mode-without-leaking-drafts",
        title: "Draft mode without leaking drafts",
        excerpt: "Preview links open the door to unpublished content. Signed secrets, a server-only read token and an uncached draft path keep that door shut to everyone else.",
        author: INES.en,
        tags: ["preview", "security"],
        heading: "Three rules",
        paragraphs: [
          "The preview link carries a short-lived secret minted from the editor's own session and validated on the server. A guessed or expired secret gets a 401.",
          "The token that can read drafts never reaches the browser, and the draft path is never cached, so a draft can not end up in the published cache.",
          "Finally, leaving preview must be a real navigation, so the stale draft cannot linger on screen.",
        ],
        coverAlt: "An abstract illustration of overlapping circles on a dark ground.",
      },
      ar: {
        slug: "وضع-المسودة-دون-تسريب",
        title: "وضع المسودة دون تسريب المسودات",
        excerpt: "روابط المعاينة تفتح الباب إلى المحتوى غير المنشور. الأسرار الموقّعة ورمز قراءة على الخادم فقط ومسار مسودات بلا ذاكرة مؤقتة تُبقي الباب مغلقًا أمام غيرك.",
        author: INES.ar,
        tags: ["معاينة", "أمان"],
        heading: "ثلاث قواعد",
        paragraphs: [
          "يحمل رابط المعاينة سرًا قصير العمر يُنشأ من جلسة المحرر نفسه ويُتحقق منه على الخادم. والسر المخمَّن أو المنتهي يحصل على الرد 401.",
          "الرمز القادر على قراءة المسودات لا يصل إلى المتصفح أبدًا، ومسار المسودات لا يُخزَّن مؤقتًا، فلا تدخل مسودة إلى ذاكرة المحتوى المنشور.",
          "وأخيرًا، يجب أن يكون الخروج من المعاينة تنقلًا حقيقيًا، حتى لا تبقى المسودة القديمة على الشاشة.",
        ],
        coverAlt: "رسم تجريدي لدوائر متداخلة على خلفية داكنة.",
      },
    },
  },
  {
    key: "accessible-faqs",
    cover: 1,
    date: "2026-08-13T09:00:00Z",
    versions: {
      en: {
        slug: "writing-accessible-faqs",
        title: "Writing FAQs that everyone can use",
        excerpt: "An accordion is a set of buttons and regions. Get the roles, the keyboard and the focus order right and it works for everyone.",
        author: INES.en,
        tags: ["design", "accessibility"],
        heading: "Buttons, regions and keys",
        paragraphs: [
          "Each question should be a real button inside a heading, wired to its answer with aria-expanded and aria-controls.",
          "Arrow keys, Home and End move between questions; Enter and Space toggle them. Closed answers stay in the page for search engines but are inert, so keyboards and screen readers skip them.",
          "Finally, respect reduced motion: no animation at all is better than a shorter one.",
        ],
        coverAlt: "A blue grid panel with a dark circle, drawn as an abstract illustration.",
      },
    },
  },
];

const IDS: Record<Locale, string> = { en: "", fr: "-fr", ar: "-ar" };
const COVER_REF = (n: number) => `cover-${n}`;

/** Post documents and the metadata linking each post's language versions. */
export function blogDocuments(covers: Record<string, { _type: "image"; asset: { _type: "reference"; _ref: string } }>): IdentifiedSanityDocumentStub[] {
  const docs: IdentifiedSanityDocumentStub[] = [];
  const metadata: IdentifiedSanityDocumentStub[] = [];

  for (const spec of specs) {
    const linked: Record<string, string> = {};
    for (const [locale, v] of Object.entries(spec.versions) as [Locale, Variant][]) {
      const id = `post-${spec.key}${IDS[locale]}`;
      linked[locale] = id;
      docs.push({
        _id: id,
        _type: "post",
        language: locale,
        title: v.title,
        slug: { _type: "slug", current: v.slug },
        excerpt: v.excerpt,
        author: v.author,
        publishedAt: spec.date,
        tags: v.tags,
        noindex: false,
        coverImage: { ...covers[COVER_REF(spec.cover)], alt: v.coverAlt },
        body: [
          block("h2", [v.heading]),
          block("normal", [v.paragraphs[0]]),
          block("normal", [v.paragraphs[1]]),
          block("normal", [v.paragraphs[2]]),
        ],
      });
    }
    metadata.push({
      _id: `translations-post-${spec.key}`,
      _type: "translation.metadata",
      schemaTypes: ["post"],
      translations: Object.entries(linked).map(([language, ref]) => ({
        _key: `tr-${language}`,
        _type: "internationalizedArrayReferenceValue",
        language,
        value: { _type: "reference", _ref: ref, _weak: true },
      })),
    });
  }
  return [...docs, ...metadata];
}
