/**
 * Translated seed content, one document per language (the Option A model): each page's
 * versions are separate documents joined by a translation.metadata document, exactly what
 * @sanity/document-internationalization writes when an editor adds a translation.
 *
 * Slugs are localized. "about" is /en/about, /fr/a-propos and /ar/من-نحن. "pricing" exists
 * in English only, so /fr/pricing and /ar/pricing exercise the fallback.
 */
import type { IdentifiedSanityDocumentStub } from "@sanity/client";

import { block, link } from "./helpers.mts";

type Image = { _type: "image"; asset: { _type: "reference"; _ref: string } };
type Spans = (string | { text: string; marks: string[] })[];

type HomeCopy = {
  title: string;
  description: string;
  hero: { eyebrow: string; heading: string; emphasis: string; body: string; start: string; how: string; alt: string };
  how: {
    eyebrow: string;
    heading: string;
    lead: Spans;
    steps: string;
    s1: string;
    s2: string;
    s3: string;
    quote: string;
    try: Spans;
  };
  testimonials: { eyebrow: string; heading: string; items: { quote: string; name: string; role: string }[] };
  faq: { eyebrow: string; heading: string; items: { q: string; a: string }[] };
  cta: { heading: string; body: string; open: string; read: string };
};

const fr: HomeCopy = {
  title: "Previewly",
  description:
    "Les éditeurs écrivent dans le CMS et relisent leur brouillon dans le vrai design du site avant toute mise en ligne.",
  hero: {
    eyebrow: "Aperçu du contenu",
    heading: "Voyez la page avant le reste du monde.",
    emphasis: "avant",
    body: "Les éditeurs écrivent dans le CMS et relisent leur brouillon dans le vrai design du site, polices et images comprises, avant toute mise en ligne.",
    start: "Commencer un brouillon",
    how: "Comment fonctionnent les aperçus",
    alt: "Deux épreuves de page sur un bureau : la page d'accueil de Previewly annotée à l'encre rouge avec un tampon « Brouillon », et sa traduction arabe derrière.",
  },
  how: {
    eyebrow: "Comment ça marche",
    heading: "Un aperçu est une épreuve, pas une supposition.",
    lead: [
      "La plupart des aperçus de CMS affichent votre texte dans un formulaire grisâtre. Previewly l'affiche dans le site ",
      { text: "réel", marks: ["em"] },
      " : les mêmes composants, polices et recadrages d'image que verront vos lecteurs, avec le brouillon à la place du contenu publié.",
    ],
    steps: "Passer du brouillon à la publication prend trois étapes :",
    s1: "Rédigez et enregistrez vos modifications dans le Studio. Rien n'est encore public.",
    s2: "Ouvrez le lien d'aperçu. Il est signé : seules les personnes avec qui vous le partagez voient le brouillon.",
    s3: "Publiez. La page en ligne se met à jour en quelques secondes, sans redéploiement.",
    quote: "Si c'est bien dans l'aperçu, ce sera bien en production.",
    try: [
      "Envie d'essayer ? ",
      { text: "Ouvrez le Studio", marks: ["studioLink"] },
      " et modifiez cette page même.",
    ],
  },
  testimonials: {
    eyebrow: "Ce que disent les éditeurs",
    heading: "Les équipes ont cessé de publier juste pour relire leur travail.",
    items: [
      {
        quote:
          "Nous poussions en préproduction pour relire. Maintenant l'aperçu est la page, et la relecture prend quelques minutes.",
        name: "Mara Okafor",
        role: "Responsable du contenu, Tessellate",
      },
      {
        quote:
          "Les lancements en arabe et en français sont sortis le même matin que l'anglais, sans qu'on ouvre un seul ticket.",
        name: "Yusuf Haddad",
        role: "Responsable localisation, Norland",
      },
      {
        quote: "Nos designers font enfin confiance au CMS. Ce que voient les éditeurs est exactement ce qui sort.",
        name: "Ines Albrecht",
        role: "Directrice du design, Fieldnote",
      },
    ],
  },
  faq: {
    eyebrow: "Questions",
    heading: "Ce que demandent les éditeurs avant de changer.",
    items: [
      {
        q: "Qui peut ouvrir un lien d'aperçu ?",
        a: "Uniquement une personne disposant d'un lien signé et valide. Les visiteurs sans lien voient toujours la page publiée, à la même adresse.",
      },
      {
        q: "En combien de temps une modification publiée est-elle en ligne ?",
        a: "En quelques secondes. La publication déclenche un webhook qui actualise seulement les pages utilisant le contenu modifié.\n\nPas de redéploiement, pas de long cache à attendre.",
      },
      {
        q: "Que se passe-t-il si une traduction manque ?",
        a: "La page bascule sur la langue par défaut, avec un petit avis, au lieu de s'afficher vide : un site à moitié traduit ne paraît jamais cassé.",
      },
      {
        q: "L'aperçu utilise-t-il d'autres composants ?",
        a: "Non. Le brouillon et le contenu publié passent exactement par les mêmes composants, c'est tout l'intérêt.",
      },
    ],
  },
  cta: {
    heading: "Relisez votre prochaine page avant sa mise en ligne.",
    body: "Ouvrez le Studio, modifiez n'importe quoi sur cette page et prévisualisez-la dans le vrai design.",
    open: "Ouvrir le Studio",
    read: "Lire la FAQ",
  },
};

const ar: HomeCopy = {
  title: "Previewly",
  description: "يكتب المحررون في نظام إدارة المحتوى ويقرؤون مسودتهم بتصميم الموقع الحقيقي قبل النشر.",
  hero: {
    eyebrow: "معاينة المحتوى",
    heading: "شاهد الصفحة قبل أن يراها العالم.",
    emphasis: "قبل",
    body: "يكتب المحررون في نظام إدارة المحتوى ويقرؤون مسودتهم بتصميم الموقع الحقيقي، بخطوطه وصوره، قبل أن يُنشر أي شيء.",
    start: "ابدأ مسودة",
    how: "كيف تعمل المعاينة",
    alt: "نسختان مطبوعتان لصفحة على مكتب: الصفحة الرئيسية لـ Previewly عليها تصحيحات بالحبر الأحمر وختم «مسودة»، وترجمتها العربية خلفها.",
  },
  how: {
    eyebrow: "كيف تعمل",
    heading: "المعاينة نسخة تجريبية مطبوعة، لا تخمين.",
    lead: [
      "تعرض معظم أنظمة إدارة المحتوى كلماتك في نموذج رمادي. أما Previewly فتعرضها في الموقع ",
      { text: "الفعلي", marks: ["em"] },
      ": بالمكوّنات والخطوط وقصّات الصور نفسها التي سيراها قراؤك، مع استبدال المسودة بالمحتوى المنشور.",
    ],
    steps: "الانتقال من المسودة إلى النشر يتم في ثلاث خطوات:",
    s1: "اكتب تغييراتك واحفظها في الاستوديو. لا شيء منشور بعد.",
    s2: "افتح رابط المعاينة. الرابط موقَّع، فلا يرى المسودة إلا من تشاركه معهم.",
    s3: "انشر. تتحدّث الصفحة المباشرة خلال ثوانٍ دون إعادة نشر.",
    quote: "إذا بدت جيدة في المعاينة، فستبدو جيدة في الإنتاج.",
    try: ["هل أنت مستعد للتجربة؟ ", { text: "افتح الاستوديو", marks: ["studioLink"] }, " وعدّل هذه الصفحة نفسها."],
  },
  testimonials: {
    eyebrow: "من المحررين",
    heading: "توقّفت الفرق عن النشر لمجرد مراجعة عملها.",
    items: [
      {
        quote: "كنا ننشر على بيئة الاختبار لنراجع النص. الآن المعاينة هي الصفحة نفسها، وتستغرق المراجعة دقائق.",
        name: "مارة أوكافور",
        role: "رئيسة المحتوى، Tessellate",
      },
      {
        quote: "أُطلقت النسختان العربية والفرنسية في صباح اليوم نفسه مع الإنجليزية، ولم يضطر أحد إلى فتح تذكرة.",
        name: "يوسف حداد",
        role: "مسؤول التوطين، Norland",
      },
      {
        quote: "أخيرًا وثق المصممون بنظام إدارة المحتوى. ما يراه المحررون هو بالضبط ما يُنشر.",
        name: "إينيس ألبريشت",
        role: "مديرة التصميم، Fieldnote",
      },
    ],
  },
  faq: {
    eyebrow: "أسئلة",
    heading: "ما يسأله المحررون قبل أن ينتقلوا إلينا.",
    items: [
      {
        q: "من يستطيع فتح رابط المعاينة؟",
        a: "من يملك رابطًا موقَّعًا وصالحًا فقط. أما الزوار من دونه فيرون دائمًا الصفحة المنشورة، حتى على العنوان نفسه.",
      },
      {
        q: "ما سرعة ظهور التغيير بعد النشر؟",
        a: "خلال بضع ثوانٍ. يرسل النشر إشعارًا يحدّث الصفحات التي تستخدم المحتوى المتغيّر فقط.\n\nلا إعادة نشر ولا ذاكرة تخزين مؤقت طويلة تنتظر انتهاءها.",
      },
      {
        q: "ماذا يحدث إذا كانت الترجمة ناقصة؟",
        a: "تعود الصفحة إلى اللغة الافتراضية مع إشعار صغير بدلًا من أن تظهر فارغة، فلا يبدو الموقع المترجم جزئيًا معطوبًا أبدًا.",
      },
      {
        q: "هل تستخدم المعاينة مكوّنات مختلفة؟",
        a: "لا. يمر المحتوى المنشور والمسودة عبر المكوّنات نفسها تمامًا، وهذا هو الهدف كله.",
      },
    ],
  },
  cta: {
    heading: "راجع صفحتك التالية قبل أن تُنشر.",
    body: "افتح الاستوديو، وغيّر أي شيء في هذه الصفحة، وعاينه بالتصميم الحقيقي.",
    open: "افتح الاستوديو",
    read: "اقرأ الأسئلة الشائعة",
  },
};

function homeDocument(id: string, language: string, copy: HomeCopy, heroImage: Image) {
  return {
    _id: id,
    _type: "page",
    language,
    title: copy.title,
    slug: { _type: "slug", current: "home" },
    noindex: false,
    description: copy.description,
    blocks: [
      {
        _key: "hero-main",
        _type: "hero",
        eyebrow: copy.hero.eyebrow,
        heading: copy.hero.heading,
        emphasis: copy.hero.emphasis,
        body: copy.hero.body,
        actions: [link("primary", copy.hero.start, "/studio"), link("secondary", copy.hero.how, "#how-it-works")],
        image: { ...heroImage, alt: copy.hero.alt },
      },
      {
        _key: "how-it-works",
        _type: "richText",
        eyebrow: copy.how.eyebrow,
        anchor: "how-it-works",
        body: [
          block("h2", [copy.how.heading]),
          block("normal", copy.how.lead),
          block("normal", [copy.how.steps]),
          block("normal", [copy.how.s1], { listItem: "number" }),
          block("normal", [copy.how.s2], { listItem: "number" }),
          block("normal", [copy.how.s3], { listItem: "number" }),
          block("blockquote", [copy.how.quote]),
          block("normal", copy.how.try, { markDefs: [{ _key: "studioLink", _type: "link", href: "/studio" }] }),
        ],
      },
      {
        _key: "testimonials",
        _type: "testimonialGrid",
        eyebrow: copy.testimonials.eyebrow,
        heading: copy.testimonials.heading,
        testimonials: copy.testimonials.items.map((t, i) => ({
          _key: `t${i + 1}`,
          _type: "testimonial",
          quote: t.quote,
          name: t.name,
          role: t.role,
        })),
      },
      {
        _key: "faq",
        _type: "faq",
        eyebrow: copy.faq.eyebrow,
        heading: copy.faq.heading,
        anchor: "faq",
        items: copy.faq.items.map((item, i) => ({
          _key: `q${i + 1}`,
          _type: "faqItem",
          question: item.q,
          answer: item.a,
        })),
      },
      {
        _key: "cta-main",
        _type: "cta",
        heading: copy.cta.heading,
        body: copy.cta.body,
        actions: [link("primary", copy.cta.open, "/studio"), link("secondary", copy.cta.read, "#faq")],
      },
    ],
  };
}

type AboutCopy = {
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  p1: string;
  p2: string;
  ctaHeading: string;
  ctaLabel: string;
};

const about: Record<"en" | "fr" | "ar", AboutCopy> = {
  en: {
    slug: "about",
    title: "About",
    description: "Why Previewly exists, and how this site is built.",
    eyebrow: "About",
    heading: "A small tool for one specific worry.",
    p1: "Publishing is stressful when you cannot see the result. Previewly lets editors read the finished page, in the real design, before anyone else can.",
    p2: "This site is built the way we recommend: content in Sanity, one document per language, and the same components rendering every locale.",
    ctaHeading: "See it for yourself.",
    ctaLabel: "Back to the homepage",
  },
  fr: {
    slug: "a-propos",
    title: "À propos",
    description: "Pourquoi Previewly existe, et comment ce site est construit.",
    eyebrow: "À propos",
    heading: "Un petit outil pour une inquiétude bien précise.",
    p1: "Publier est stressant quand on ne voit pas le résultat. Previewly permet aux éditeurs de lire la page terminée, dans le vrai design, avant tout le monde.",
    p2: "Ce site est construit comme nous le recommandons : le contenu dans Sanity, un document par langue, et les mêmes composants pour chaque langue.",
    ctaHeading: "Voyez-le par vous-même.",
    ctaLabel: "Retour à l'accueil",
  },
  ar: {
    slug: "من-نحن",
    title: "من نحن",
    description: "لماذا وُجد Previewly، وكيف بُني هذا الموقع.",
    eyebrow: "من نحن",
    heading: "أداة صغيرة لقلق محدد.",
    p1: "النشر مقلق حين لا ترى النتيجة. يتيح Previewly للمحررين قراءة الصفحة النهائية بالتصميم الحقيقي قبل أن يراها أي شخص آخر.",
    p2: "بُني هذا الموقع بالطريقة التي نوصي بها: المحتوى في Sanity، ومستند لكل لغة، والمكوّنات نفسها تعرض كل اللغات.",
    ctaHeading: "جرّب بنفسك.",
    ctaLabel: "العودة إلى الصفحة الرئيسية",
  },
};

function aboutDocument(id: string, language: "en" | "fr" | "ar") {
  const c = about[language];
  return {
    _id: id,
    _type: "page",
    language,
    title: c.title,
    slug: { _type: "slug", current: c.slug },
    noindex: false,
    description: c.description,
    blocks: [
      {
        _key: "about-body",
        _type: "richText",
        eyebrow: c.eyebrow,
        body: [block("h2", [c.heading]), block("normal", [c.p1]), block("normal", [c.p2])],
      },
      {
        _key: "about-cta",
        _type: "cta",
        heading: c.ctaHeading,
        actions: [link("home", c.ctaLabel, "/")],
      },
    ],
  };
}

/** An English-only page: the other languages fall back to it, with a notice. */
const pricing = {
  _id: "page-pricing",
  _type: "page",
  language: "en",
  title: "Pricing",
  slug: { _type: "slug", current: "pricing" },
  noindex: false,
  description: "What Previewly costs: nothing, while you prove it out.",
  blocks: [
    {
      _key: "pricing-body",
      _type: "richText",
      eyebrow: "Pricing",
      body: [
        block("h2", ["Free while you prove it out."]),
        block("normal", [
          "The Studio, live preview and publish webhooks all run on Sanity's Free plan, so trying Previewly costs nothing.",
        ]),
        block("normal", ["Add translations whenever you are ready: each language is its own document."]),
      ],
    },
  ],
};

function metadata(id: string, versions: Record<string, string>) {
  return {
    _id: id,
    _type: "translation.metadata",
    schemaTypes: ["page"],
    translations: Object.entries(versions).map(([language, ref]) => ({
      _key: `tr-${language}`,
      _type: "internationalizedArrayReferenceValue",
      language,
      value: { _type: "reference", _ref: ref, _weak: true },
    })),
  };
}

/** Pages first, then the metadata that links them (a reference target must exist). */
export function translationDocuments(heroImage: Image): IdentifiedSanityDocumentStub[] {
  return [
    homeDocument("page-home-fr", "fr", fr, heroImage),
    homeDocument("page-home-ar", "ar", ar, heroImage),
    aboutDocument("page-about", "en"),
    aboutDocument("page-about-fr", "fr"),
    aboutDocument("page-about-ar", "ar"),
    pricing,
    metadata("translations-home", { en: "page-home", fr: "page-home-fr", ar: "page-home-ar" }),
    metadata("translations-about", { en: "page-about", fr: "page-about-fr", ar: "page-about-ar" }),
  ];
}
