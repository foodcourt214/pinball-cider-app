// All case studies ported from foodcourtcreative.com.
// To use real imagery, drop files into src/assets/work/<slug>/ named
// cover.jpg (grid + hero) — they are picked up automatically. Until then,
// each study renders an art-directed placeholder in its brand colors.

const caseStudies = [
  {
    slug: 'bakerly',
    client: 'Bakerly',
    title: 'Launching the PB&J Crêpe',
    tagline: 'A full-funnel, cross-channel campaign for the most American French snack ever made.',
    categories: ['Campaigns', 'Social & Content', 'AI'],
    services: ['Campaign Development', 'Video Production', 'AI Production', 'TikTok Ads', 'UGC'],
    colors: { from: '#7C2D5B', to: '#C4452E', accent: '#F5C04E' },
    mark: 'B',
    emoji: '🥜',
    featured: true,
    summary:
      'Bakerly came to us to launch their first-ever PB&J crêpe. We developed a go-to-market ad campaign that leaned into the product’s French-American cultural fusion while staying true to Bakerly’s promise of non-GMO ingredients and no artificial additives.',
    sections: [
      {
        heading: 'A stylized world, built with AI',
        body: 'The creative — developed and produced entirely by Food Court Creative — told different stories around the origin of the PB&J crêpe, filmed in a highly stylized world created with the help of AI.',
      },
      {
        heading: 'Full-funnel, cross-channel',
        body: 'The campaign covered everything from :30 commercials to TikTok ads to authentic UGC. Content creators captured on-the-go moments with Bakerly PB&J crêpes, giving the launch a native feel on every channel.',
      },
      {
        heading: 'The result',
        body: 'Bakerly’s first-ever cross-channel campaign became their most successful crêpe launch to date.',
      },
    ],
  },
  {
    slug: 'van-holtens-pringles',
    client: "Van Holten's + Pringles",
    title: 'A Pickle-Packed Cultural Moment',
    tagline: 'Launching the Sour Cream & Onion pickle collab the internet didn’t know it needed.',
    categories: ['Campaigns', 'Social & Content', 'AI'],
    services: ['Product Launch Campaign', 'Social Campaign', 'Content Production'],
    colors: { from: '#2E6B34', to: '#B5341F', accent: '#F5D547' },
    mark: 'VP',
    emoji: '🥒',
    featured: true,
    summary:
      'When Van Holten’s teamed up with Pringles for a limited-time Sour Cream & Onion pickle, we made the launch feel less like a flavor announcement and more like a cultural moment.',
    sections: [
      {
        heading: 'Snackable, surreal creative',
        body: 'Pickles disappeared under stacks of Pringles, emerged from cans, and morphed before your eyes. The teaser-driven rollout sparked excitement across both brands’ channels, hinting at a crunchy, pickle-packed surprise to come.',
      },
      {
        heading: 'The result',
        body: 'The campaign put Van Holten’s at the center of the internet’s pickle obsession, riding one of Pringles’ top-selling flavors into a genuinely viral limited-time release.',
      },
    ],
  },
  {
    slug: 'sidework',
    client: 'Sidework',
    title: 'A Brand for the Future of Hospitality',
    tagline: 'From automated drink dispenser to technology ecosystem.',
    categories: ['Branding', 'Strategy', 'Web & Ecomm'],
    services: ['Brand Strategy', 'Brand Identity', 'Website Design', 'Marketplace'],
    colors: { from: '#0E5E63', to: '#E2634B', accent: '#F3EBDD' },
    mark: 'S',
    emoji: '🍹',
    featured: true,
    summary:
      'We helped Sidework uncover their vision and mission — to become the technology ecosystem for ambitious hospitality companies while amplifying the human workforce — and created a brand around their flagship automated drink dispenser that can grow with them.',
    sections: [
      {
        heading: 'Fresh, modern, approachable',
        body: 'The identity pairs lifestyle photography, clean serif typography and a vibrant color palette with a library of modular cocktail shapes inspired by the logo — a system built to evolve alongside a growing list of products, from hardware to software to an entire marketplace.',
      },
      {
        heading: 'A website that works two jobs',
        body: 'The site serves a dual purpose: an online marketing destination for the brand, and a marketplace where customers order new ingredients for their automated dispensers.',
      },
    ],
  },
  {
    slug: 'modernalchemy',
    client: 'ModernAlchemy',
    title: 'A Complete Brand Transformation',
    tagline: 'From label design to marketing, inspired by the alchemic process itself.',
    categories: ['Branding', 'Packaging', 'Web & Ecomm', 'AI'],
    services: ['Brand Refresh', 'Label Design', 'Shopify Design', 'AI Asset Library', 'Photography'],
    colors: { from: '#232145', to: '#5B3A8C', accent: '#D9A441' },
    mark: 'MA',
    emoji: '⚗️',
    featured: true,
    summary:
      'ModernAlchemy needed a complete refresh, from label design to marketing. Using AI, we created a library of assets inspired by the alchemic process of making spagyrics — the ancient craft behind their tinctures.',
    sections: [
      {
        heading: 'Making the unfamiliar irresistible',
        body: 'Most consumers have never heard of spagyric tinctures. We built their Shopify site to introduce the benefits of the products and the alchemy that goes into the process, step by step.',
      },
      {
        heading: 'Aspirational by design',
        body: 'Throughout the user journey, photography showcases the products in aspirational settings, inspiring a range of use-case scenarios and elevating the entire experience.',
      },
    ],
  },
  {
    slug: 'true-essence',
    client: 'True Essence Foods',
    title: 'Science You Can Taste',
    tagline: 'A trusted, science-rooted brand built to win national partners.',
    categories: ['Branding', 'Strategy', 'Packaging', 'Web & Ecomm'],
    services: ['Brand Strategy', 'Brand Identity', 'Voice & Tone', 'Website Design', 'Packaging Platform', 'Social Media'],
    colors: { from: '#3E6B4F', to: '#8CB63C', accent: '#F4EFE4' },
    mark: 'TE',
    emoji: '✨',
    featured: false,
    summary:
      'True Essence’s flavor technology needed a brand to match. We helped them build a trusted, science-rooted identity designed to inspire national brands to partner with them.',
    sections: [
      {
        heading: 'The full brand toolkit',
        body: 'Brand strategy, brand identity, voice & tone, website design and social media — a complete system that presents breakthrough food science with clarity and confidence.',
      },
      {
        heading: 'Packaging that opens doors',
        body: 'We created a packaging design platform flexible enough to accommodate a whole range of products, so True Essence could send branded samples of foods created with their technology to potential partners.',
      },
    ],
  },
  {
    slug: 'city-fish',
    client: 'City Fish',
    title: 'A Century-Old Legacy, Made Fresh',
    tagline: 'Digital strategy for Pike Place’s iconic seafood stall.',
    categories: ['Strategy', 'Social & Content'],
    services: ['Digital Strategy', 'Paid Social', 'Email Marketing', 'Website Refresh'],
    colors: { from: '#173A5E', to: '#2E7FB8', accent: '#EDF4F9' },
    mark: 'CF',
    emoji: '🐟',
    featured: true,
    summary:
      'City Fish has been selling seafood for over a hundred years. We crafted a digital strategy that honors that legacy while appealing to today’s customers — including the ones who can’t make it to the market stall.',
    sections: [
      {
        heading: 'Fresh fish, fresh channels',
        body: 'The challenge: capture the brand’s differentiators and present truly fresh seafood to customers who can’t see it in person. We answered with a cross-channel paid social strategy built on engaging seafood content with a distinctive brand voice.',
      },
      {
        heading: 'Inbox to doorstep',
        body: 'Updated email sequencing and weekly newsletters — plus a website refresh — turned a century of walk-up trust into repeatable online business.',
      },
    ],
  },
  {
    slug: 'good-culture-milk',
    client: 'Good Culture',
    title: 'Probiotic Milk Hits the Big Screen',
    tagline: 'CTV commercials and a social launch for the cottage cheese disruptor’s next act.',
    categories: ['Campaigns', 'Social & Content'],
    services: ['CTV Commercials', 'Social Campaign', 'Video Production'],
    colors: { from: '#27548F', to: '#7FA8D9', accent: '#FDF8EE' },
    mark: 'GC',
    emoji: '🥛',
    featured: true,
    summary:
      'For the launch of Good Culture’s Probiotic Milk, we created CTV commercials plus a social campaign — partnering with World Famous on production.',
    sections: [
      {
        heading: 'Stylized to a T',
        body: 'The video campaign features overly stylized, art-directed scenes showcasing use cases perfectly aligned with the Good Culture brand.',
      },
      {
        heading: 'Six seconds, one reason to believe',
        body: 'A series of :06 spots each focused on a single reason-to-believe, making every impression count across CTV and social.',
      },
    ],
  },
  {
    slug: 'tofurky-nextgendeli',
    client: 'Tofurky',
    title: 'Next Gen Deli Gets Its Bite Back',
    tagline: 'Packaging and a launch campaign that sit confidently next to “real” meat.',
    categories: ['Packaging', 'Campaigns'],
    services: ['Packaging Design', 'Launch Campaign', 'Digital Ads', 'Print'],
    colors: { from: '#8E2F23', to: '#D07B2A', accent: '#F8EBD9' },
    mark: 'T',
    emoji: '🥪',
    featured: false,
    summary:
      'We repositioned Tofurky’s Next Gen Deli slices to sit confidently alongside “real” meat — leaning hard into flavor, meatiness and appetite appeal.',
    sections: [
      {
        heading: 'Craveable packaging',
        body: 'The refreshed packaging spotlights craveable, over-the-top sandwiches — no apologies, no compromise, just appetite appeal.',
      },
      {
        heading: 'Flipping the meat tropes',
        body: 'The launch campaign flipped classic meat tropes on their head with bold product shots and playful lifestyle moments. To drive velocity, digital ads ran on shopper marketing sites that carried the product, alongside print in publications the flexitarian audience actually reads.',
      },
    ],
  },
  {
    slug: 'rawr',
    client: 'RAWR',
    title: 'Larger-Than-Life Felines, Real Results',
    tagline: 'Generative AI ads and a Shopify rebuild for a cat wellness brand.',
    categories: ['AI', 'Web & Ecomm', 'Social & Content'],
    services: ['Generative AI Ads', 'Paid Media', 'Shopify Design', 'Brand Storytelling'],
    colors: { from: '#C2337A', to: '#E8742C', accent: '#FCEFDF' },
    mark: 'R',
    emoji: '🐱',
    featured: false,
    summary:
      'With RAWR’s sales coming primarily through retail, we set out to build their direct-to-consumer channel — starting with ads no cat person could scroll past.',
    sections: [
      {
        heading: 'Memes with a media plan',
        body: 'Using generative AI, we created paid ads featuring larger-than-life felines, imaginative cat memes and 5-star testimonials to drive traffic to RAWR’s Shopify site.',
      },
      {
        heading: 'A storefront worth landing on',
        body: 'The newly designed Shopify website combines strategic brand storytelling with a seamless user experience and rich, colorful brand photography.',
      },
    ],
  },
  {
    slug: 'mycosci',
    client: 'MycoSci',
    title: 'Functional Mushrooms, Trusted Science',
    tagline: 'A brand system and Shopify 2.0 build for innovative mushroom supplements.',
    categories: ['Branding', 'Web & Ecomm'],
    services: ['Brand System', 'Shopify 2.0 Development', 'Paid Ads', 'Illustration'],
    colors: { from: '#4A3B2A', to: '#7D8B4E', accent: '#F2ECDF' },
    mark: 'M',
    emoji: '🍄',
    featured: false,
    summary:
      'MycoSci needed to feel trusted and sophisticated for a B2B audience while inspiring consumers to live their best life with functional mushroom supplements.',
    sections: [
      {
        heading: 'Rooted in nature',
        body: 'The brand system uses an earthy palette inspired by nature, textured mushroom illustrations, macro photography of fungi and aspirational lifestyle imagery.',
      },
      {
        heading: 'Built on Shopify 2.0',
        body: 'We designed and developed the site on Shopify’s 2.0 platform to market the brand online, tell customer stories and leverage the latest e-commerce capabilities.',
      },
      {
        heading: 'Ads that educate',
        body: 'Paid ads combine lifestyle photography with product benefit callouts, quizzes educate consumers on the benefits of functional mushrooms, and 5-star review creative validates the products.',
      },
    ],
  },
  {
    slug: 'goodwell-co',
    client: 'Goodwell Co.',
    title: 'Better Smiles, Better Planet',
    tagline: 'Brand, packaging and ecommerce for sustainable oral care — crowdfunded to life.',
    categories: ['Branding', 'Packaging', 'Web & Ecomm'],
    services: ['Brand Development', 'Packaging', 'Content Production', 'Shopify Ecommerce', 'Crowdfunding'],
    colors: { from: '#1F5C50', to: '#63B8A0', accent: '#F4F1E8' },
    mark: 'G',
    emoji: '🪥',
    featured: false,
    summary:
      'We helped crowd-fund Goodwell Co. by building a brand that empowers people to protect the planet while improving their smiles.',
    sections: [
      {
        heading: 'The whole package',
        body: 'Brand development, packaging, content production and Shopify ecommerce — everything a challenger oral care brand needs to go from campaign page to customers’ bathroom counters.',
      },
    ],
  },
  {
    slug: 'deschutes-social',
    client: 'Deschutes Brewery',
    title: 'Beer Pairings You Didn’t See Coming',
    tagline: 'Social content and fan love for one of craft beer’s most iconic breweries.',
    categories: ['Social & Content'],
    services: ['Social Strategy', 'Content Production', 'Influencer Marketing'],
    colors: { from: '#1E3B2C', to: '#C97B2E', accent: '#F5EEDF' },
    mark: 'D',
    emoji: '🍺',
    featured: false,
    summary:
      'For Deschutes, we created content celebrating unexpected lifestyle beer-pairing moments — and gave fans reasons to join in.',
    sections: [
      {
        heading: '#BeerMeritBadge',
        body: 'Fans earned embroidered merit badges through a hashtag campaign that rewarded the everyday adventures that go best with a Deschutes in hand.',
      },
      {
        heading: '#ChaseTheHaze',
        body: 'For the winter launch of Fresh Haze IPA, social influencers got a holiday surprise: festive sweaters with a personal greeting, asking them to share matching sweater pictures with the hashtag.',
      },
    ],
  },
  {
    slug: 'outshine',
    client: 'Outshine',
    title: 'Fruit-Forward, Feel-Good Content',
    tagline: 'Visually stunning content for the health-conscious snacker.',
    categories: ['Social & Content'],
    services: ['Content Production', 'Social Campaign', 'Art Direction'],
    colors: { from: '#D9541E', to: '#E89B3C', accent: '#FDF3E3' },
    mark: 'O',
    emoji: '🍊',
    featured: false,
    summary:
      'We created a range of visually stunning, fruit-forward content that appeals to health-conscious consumers while promoting Outshine’s full portfolio.',
    sections: [
      {
        heading: 'Aspirational daily moments',
        body: 'The campaign showed a diverse range of audience personas enjoying aspirational daily moments with Outshine fruit bars — bright, fresh and unmistakably feel-good.',
      },
    ],
  },
  {
    slug: 'wineo',
    client: 'WineO',
    title: 'Drenched in 90s Nostalgia',
    tagline: 'One shoot day. One irreverent campaign. All the throwback energy.',
    categories: ['Campaigns', 'Social & Content'],
    services: ['Campaign Creative', 'Photo Production', 'Paid Social'],
    colors: { from: '#5B2A86', to: '#2FA7A0', accent: '#F6E14B' },
    mark: 'W',
    emoji: '🍷',
    featured: false,
    summary:
      'For WineO, we used a single-day shoot to capture a full campaign’s worth of imagery, then launched across social and digital with irreverent creative drenched in 90s nostalgia.',
    sections: [
      {
        heading: 'Maximum vibe, minimum budget',
        body: 'Smart production planning turned one shoot day into a complete cross-platform campaign — proof that big-agency polish doesn’t require a big-agency invoice.',
      },
    ],
  },
]

export const categories = [
  'All',
  'Branding',
  'Packaging',
  'Campaigns',
  'Social & Content',
  'Web & Ecomm',
  'Strategy',
  'AI',
]

export function getCaseStudy(slug) {
  return caseStudies.find((cs) => cs.slug === slug)
}

export default caseStudies
