import type {
  FaqItem,
  FloorPlanHotspot,
  MaterialSwatch,
  PackageTier,
  PortfolioProject,
  ServiceItem,
  TestimonialItem,
} from '../types/studio';

/**
 * CENTRALIZED REUSABLE CLIENT CONFIGURATION
 * ---------------------------------------------------------------------------
 * Update this single file to rebrand the website for any interior design client.
 * Set VITE_VERIFIED_CONTACT="true" and provide real contact environment variables
 * when deploying for a live studio.
 */

const viteEnv: Record<string, string | undefined> =
  typeof import.meta !== 'undefined' && (import.meta as { env?: Record<string, string | undefined> }).env
    ? ((import.meta as { env?: Record<string, string | undefined> }).env as Record<string, string | undefined>)
    : {};

const hasVerifiedContact = viteEnv.VITE_VERIFIED_CONTACT === 'true';

export const siteConfig = {
  business: {
    name: 'Aaranya Interiors',
    tagline: 'Complete Home Interiors, Modular Kitchens & Custom Furniture',
    shortDescriptor: 'Greater Noida · Noida Extension · Delhi NCR',
    logoText: 'Aaranya Interiors',
    isDemonstrationSite: viteEnv.VITE_IS_DEMO_SITE !== 'false',
    hasVerifiedContact,
    phoneDisplay: hasVerifiedContact ? viteEnv.VITE_STUDIO_PHONE || '' : '',
    phoneRaw: hasVerifiedContact ? viteEnv.VITE_STUDIO_PHONE_RAW || '' : '',
    whatsappNumber: viteEnv.VITE_WHATSAPP_NUMBER || '',
    email: hasVerifiedContact ? viteEnv.VITE_STUDIO_EMAIL || '' : '',
    serviceRegionNote: 'Serving Greater Noida, Noida Extension (Greater Noida West), Noida & Delhi NCR',
    appointmentHours: 'Consultations & Site Visits by Prior Request (Tue – Sun)',
    serviceAreas: [
      'Greater Noida (Jaypee Greens, Omega, Alpha, Pari Chowk)',
      'Noida Extension / Greater Noida West (Techzone IV, Sector 1, Sector 16B)',
      'Noida Expressway (Sector 150, Sector 128, Sector 93B, Sector 44)',
      'Delhi NCR & Gurugram',
    ],
    socialLinks: {
      instagram: viteEnv.VITE_SOCIAL_INSTAGRAM || '',
      pinterest: viteEnv.VITE_SOCIAL_PINTEREST || '',
      linkedin: viteEnv.VITE_SOCIAL_LINKEDIN || '',
    },
  },
  developer: {
    name: 'AI Business Growth Lab',
    demoBannerText: 'Demonstration Website | Designed & Developed by AI Business Growth Lab',
    website: 'https://ai-business-growth-lab.vercel.app/',
  },
  colors: {
    ivory: '#F8F5EF',
    ivoryBright: '#FCF9F3',
    charcoal: '#252824',
    charcoalDeep: '#101310',
    mutedGold: '#B69A68',
    goldDeep: '#725B2F',
    oliveGreen: '#626B55',
    warmBeige: '#D8C8B4',
  },
  packagesConfig: {
    showWarrantyBadge: false,
    showGuaranteedTimelineBadge: false,
    illustrativeDisclaimer:
      'All package prices shown below are illustrative starting ranges for demonstration purposes. Final pricing depends on carpet area, material choices, hardware, and site conditions.',
  },
  seo: {
    noindex: viteEnv.VITE_DEMO_NOINDEX !== 'false',
    defaultDemoMode: viteEnv.VITE_DEFAULT_DEMO_MODE !== 'false',
    defaultTitle: 'Aaranya Interiors — Complete Home Interiors & Modular Kitchens in Greater Noida & Delhi NCR',
    defaultDescription:
      'Demonstration interior design studio website for Complete Home Interiors, Modular Kitchens, and Custom Furniture across Greater Noida, Noida Extension, and Delhi NCR.',
    siteUrl: typeof window !== 'undefined' ? window.location.origin : 'https://aaranyainteriors.in',
  },
  images: {
    heroLiving: '/src/assets/images/hero_luxury_living_1795186015666.jpg',
    penthouseDining: '/src/assets/images/portfolio_penthouse_dining_1795186016033.jpg',
    masterSuite: '/src/assets/images/portfolio_master_suite_1795186015722.jpg',
    bespokeKitchen: '/src/assets/images/portfolio_bespoke_kitchen_1795186016187.jpg',
    materialMoodboard: '/src/assets/images/studio_material_moodboard_1795186015730.jpg',
    atelierStudio: '/src/assets/images/about_architect_atelier_1795186016216.jpg',
  },
  studioHighlights: [
    {
      title: 'Tailored Space Planning',
      label: '2D Layouts & 3D Views',
      context: 'Practical room layouts, Vastu-friendly planning, and photorealistic previews before work starts',
    },
    {
      title: 'Transparent BOQ Quotes',
      label: 'Itemized Cost Clarity',
      context: 'Clear room-by-room material specifications and stage-wise payment milestones',
    },
    {
      title: 'End-to-End Supervision',
      label: 'Design to Handover',
      context: 'Coordinated carpentry, false ceiling, lighting, painting, and final room styling',
    },
    {
      title: 'Curated Material Library',
      label: 'Stone, Wood & Linen',
      context: 'Moisture-resistant boards, natural stone finishes, warm veneers, and durable hardware',
    },
  ],
  services: [
    {
      id: 'complete-home-interiors',
      number: '01',
      title: 'Complete Home Interiors',
      subtitle: 'End-to-end design and execution for 2, 3 & 4 BHK homes',
      category: 'Complete Home Interiors',
      requirementKey: 'Complete Home Interiors',
      description:
        'Full-home planning covering living rooms, bedrooms, modular kitchen, wardrobes, false ceiling, lighting, and wall finishes—managed cohesively from concept to handover.',
      deliverables: [
        '2D floor plan layout & storage optimization',
        '3D design views with material & color selection',
        'False ceiling, lighting & electrical coordination',
        'Supervised site execution & regular progress updates',
      ],
      estimatedDuration: 'Indicative scope: Full Residence',
      illustrativeStarting: 'Illustrative from ₹3–6 lakh',
      image: '/src/assets/images/hero_luxury_living_1795186015666.jpg',
      imageAlt: 'Sample Complete Home Interiors living room concept with warm walnut wall paneling and linen sofa',
    },
    {
      id: 'modular-kitchen',
      number: '02',
      title: 'Modular Kitchen & Dining',
      subtitle: 'Ergonomic layouts, stone counters & smart storage',
      category: 'Modular Kitchen',
      requirementKey: 'Modular Kitchen',
      description:
        'L-shaped, U-shaped, parallel, and island modular kitchens designed for everyday Indian cooking—combining moisture-resistant cabinets, durable countertops, and tall pantry units.',
      deliverables: [
        'Ergonomic work-triangle & appliance planning',
        'Quartz, granite, or stone countertop selection',
        'Moisture-resistant cabinet carcass & soft-close hardware',
        'Tall pantry units, corner accessories & utility zoning',
      ],
      estimatedDuration: 'Indicative scope: Kitchen & Utility',
      illustrativeStarting: 'Customized Quote',
      image: '/src/assets/images/portfolio_bespoke_kitchen_1795186016187.jpg',
      imageAlt: 'Sample Modular Kitchen concept with stone island, oak cabinets, and concealed pantry',
    },
    {
      id: 'custom-furniture',
      number: '03',
      title: 'Custom Furniture & Wardrobes',
      subtitle: 'Floor-to-ceiling wardrobes, TV units & bespoke beds',
      category: 'Custom Furniture',
      requirementKey: 'Custom Furniture & Wardrobes',
      description:
        'Made-to-measure sliding or hinged wardrobes, walk-in closets, upholstered beds, study tables, and dining consoles crafted to fit your exact wall dimensions.',
      deliverables: [
        'Floor-to-ceiling wardrobe internal zoning',
        'Custom TV media walls & foyer storage consoles',
        'Upholstered headboards & bedside tables',
        'Laminate, acrylic, PU, or natural veneer finishes',
      ],
      estimatedDuration: 'Indicative scope: Storage & Furniture',
      illustrativeStarting: 'Customized Quote',
      image: '/src/assets/images/portfolio_master_suite_1795186015722.jpg',
      imageAlt: 'Sample Custom Furniture master bedroom with upholstered headboard and walnut paneling',
    },
    {
      id: 'living-room-makeover',
      number: '04',
      title: 'Living Room, Lighting & Styling',
      subtitle: 'Wall finishes, soft furnishings & cohesive decor',
      category: 'Room Makeover & Styling',
      requirementKey: 'Living & Dining Design',
      description:
        'Transform living and dining areas with curated furniture, warm architectural lighting, textured paint finishes, curtains, and natural material accents.',
      deliverables: [
        'Material & color moodboard curation',
        'Layered ambient, cove & pendant lighting plan',
        'Custom sofa, dining table, curtains & rug pairing',
        'Final room styling and decor placement',
      ],
      estimatedDuration: 'Indicative scope: Single or Multi-Room',
      illustrativeStarting: 'Customized Quote',
      image: '/src/assets/images/studio_material_moodboard_1795186015730.jpg',
      imageAlt: 'Sample interior finish palette showing travertine stone, walnut wood, brass, linen, and olive paint',
    },
  ] as ServiceItem[],
  portfolio: [
    {
      id: 'sample-travertine-living',
      title: 'Warm Walnut & Stone Living Room',
      location: 'Noida Extension',
      society: 'Sample 4 BHK Concept · Greater Noida West',
      category: 'Living & Dining',
      areaSqFt: 'Approx. 2,800 sq. ft. layout',
      projectTypeLabel: 'Sample Concept Project',
      budgetBand: '₹12–25 lakh',
      summary:
        'An illustrative living room concept pairing fluted timber paneling, limewash walls, and a honed travertine coffee table for calm family living.',
      materials: ['Travertine Finish', 'Walnut Veneer', 'Brushed Brass', 'Natural Linen'],
      designHighlight: 'Concealed storage wall integrated behind fluted timber panels.',
      image: '/src/assets/images/hero_luxury_living_1795186015666.jpg',
      imageAlt: 'Sample living room interior concept in warm ivory, walnut, and travertine tones',
      featured: true,
      isIllustrativeSample: true,
    },
    {
      id: 'sample-courtyard-dining',
      title: 'Marble & Oak Dining Space',
      location: 'Greater Noida',
      society: 'Sample Villa Concept · Greater Noida',
      category: 'Living & Dining',
      areaSqFt: 'Approx. 3,600 sq. ft. layout',
      projectTypeLabel: 'Sample Concept Project',
      budgetBand: '₹25 lakh+',
      summary:
        'An illustrative dining showcase anchored by a marble-top table, sculpted oak chairs, linear brass lighting, and sheer full-height drapes.',
      materials: ['Marble Countertop', 'Warm Oak Timber', 'Brushed Brass', 'Sheer Linen'],
      designHighlight: 'Bright open-plan flow connecting dining and balcony seating.',
      image: '/src/assets/images/portfolio_penthouse_dining_1795186016033.jpg',
      imageAlt: 'Sample luxury dining room with marble dining table, oak chairs, and linear chandelier',
      featured: true,
      isIllustrativeSample: true,
    },
    {
      id: 'sample-walnut-suite',
      title: 'Walnut & Olive Master Bedroom',
      location: 'Noida Expressway',
      society: 'Sample 3 BHK Concept · Sector 150 Corridor',
      category: 'Bedroom & Wardrobe',
      areaSqFt: 'Approx. 2,100 sq. ft. layout',
      projectTypeLabel: 'Sample Concept Project',
      budgetBand: '₹6–12 lakh',
      summary:
        'A calm master bedroom concept combining an upholstered bouclé headboard, vertical walnut wall paneling, and warm cove ceiling illumination.',
      materials: ['Walnut Paneling', 'Bouclé Fabric', 'Travertine Side Table', 'Olive Linen'],
      designHighlight: 'Soft indirect bedside lighting designed for restful evenings.',
      image: '/src/assets/images/portfolio_master_suite_1795186015722.jpg',
      imageAlt: 'Sample master bedroom interior with walnut wall paneling and warm cove lighting',
      isIllustrativeSample: true,
    },
    {
      id: 'sample-quartzite-kitchen',
      title: 'Island Modular Kitchen & Pantry',
      location: 'Noida Extension',
      society: 'Sample Kitchen Concept · Techzone IV',
      category: 'Modular Kitchen',
      areaSqFt: 'Approx. 1,950 sq. ft. layout',
      projectTypeLabel: 'Sample Concept Project',
      budgetBand: '₹6–12 lakh',
      summary:
        'A functional open modular kitchen featuring a stone waterfall island, matte charcoal tall units, warm oak drawers, and a concealed walk-in pantry.',
      materials: ['Quartzite Stone', 'Matte Charcoal Laminate', 'Oak Finish', 'Brass Hardware'],
      designHighlight: 'Hidden pantry doorway keeps daily dry groceries neatly tucked away.',
      image: '/src/assets/images/portfolio_bespoke_kitchen_1795186016187.jpg',
      imageAlt: 'Sample modular kitchen with quartzite waterfall island and oak cabinetry',
      isIllustrativeSample: true,
    },
    {
      id: 'sample-home-office',
      title: 'Daylit Study & Design Library',
      location: 'Delhi NCR',
      society: 'Sample Builder Floor Concept · Delhi NCR',
      category: 'Complete Home Interiors',
      areaSqFt: 'Approx. 3,000 sq. ft. layout',
      projectTypeLabel: 'Sample Concept Project',
      budgetBand: '₹12–25 lakh',
      summary:
        'A dedicated work-from-home study and consultation lounge featuring natural oak worktables, built-in bookshelves, and mineral wall textures.',
      materials: ['Natural Oak', 'Mineral Wall Paint', 'Brass Accents', 'Textured Rug'],
      designHighlight: 'Maximized natural daylight paired with clutter-free built-in shelving.',
      image: '/src/assets/images/about_architect_atelier_1795186016216.jpg',
      imageAlt: 'Sample home office and architectural study room with large window and oak worktable',
      isIllustrativeSample: true,
    },
    {
      id: 'sample-material-board',
      title: 'Natural Stone & Timber Finish Kit',
      location: 'Greater Noida West',
      society: 'Sample Material Palette · 3 BHK Home',
      category: 'Custom Furniture',
      areaSqFt: 'Approx. 1,750 sq. ft. layout',
      projectTypeLabel: 'Sample Concept Project',
      budgetBand: '₹3–6 lakh',
      summary:
        'An illustrative material coordination kit balancing light stone, warm timber tones, matte olive accents, and woven upholstery.',
      materials: ['Honed Travertine', 'Patinated Brass', 'Belgian Linen', 'Olive Mineral Tone'],
      designHighlight: 'Cohesive room-to-room palette suited for compact and spacious apartments.',
      image: '/src/assets/images/studio_material_moodboard_1795186015730.jpg',
      imageAlt: 'Sample interior finish board with travertine stone, walnut veneer, brass, and linen',
      isIllustrativeSample: true,
    },
  ] as PortfolioProject[],
  packages: [
    {
      id: 'individual-room',
      name: 'Individual Room Interiors',
      tagline: 'Modular kitchen, single bedroom, or living room makeover',
      idealFor: 'Homeowners upgrading a specific kitchen, wardrobe, or living space',
      illustrativePrice: 'Customized Quote',
      budgetBandValue: 'Individual Room Interiors: Customized Quote',
      estimatedTimelineNote: 'Timeline shared after site measurement',
      includes: [
        'Scope tailored to one or two selected rooms',
        '2D layout + 3D visual preview for the chosen zone',
        'Custom modular kitchen, wardrobe, or TV unit design',
        'Material & hardware guidance suited to your budget',
        'Itemized quote before fabrication starts',
      ],
    },
    {
      id: 'essential-home',
      name: 'Essential Home Interiors',
      tagline: 'Practical, clean modular interiors for 2 & 3 BHK apartments',
      idealFor: 'New apartment handovers seeking functional everyday comfort',
      illustrativePrice: '₹3–6 lakh (Illustrative)',
      budgetBandValue: 'Essential Home Interiors: ₹3–6 lakh',
      estimatedTimelineNote: 'Schedule confirmed after design sign-off',
      includes: [
        'Modular kitchen with durable laminate finish',
        'Essential bedrooms wardrobe storage',
        'Living room TV console & compact shoe unit',
        'Basic false ceiling & warm LED lighting in living zone',
        'Interior wall painting & standard hardware fittings',
      ],
    },
    {
      id: 'signature-home',
      name: 'Signature Home Interiors',
      tagline: 'Balanced warm minimalism with upgraded finishes & ceiling lighting',
      idealFor: '2 & 3 BHK family homes across Noida Extension & Greater Noida',
      illustrativePrice: '₹6–12 lakh (Illustrative)',
      budgetBandValue: 'Signature Home Interiors: ₹6–12 lakh',
      estimatedTimelineNote: 'Schedule confirmed after design sign-off',
      highlighted: true,
      includes: [
        'Full modular kitchen with quartz/granite counter & tall unit',
        'Floor-to-ceiling wardrobes across bedrooms',
        'Living & dining crockery/media cabinetry',
        'False ceiling with warm cove & accent lighting across rooms',
        '3D visualizations & dedicated supervision updates',
      ],
    },
    {
      id: 'premium-home',
      name: 'Premium Home Interiors',
      tagline: 'Veneer, fluted paneling, custom furniture & curated stone details',
      idealFor: 'Spacious 3 & 4 BHK apartments and builder floors',
      illustrativePrice: '₹12–25 lakh (Illustrative)',
      budgetBandValue: 'Premium Home Interiors: ₹12–25 lakh',
      estimatedTimelineNote: 'Schedule confirmed after site & BOQ freeze',
      includes: [
        'Everything in Signature Home Interiors, upgraded to PU & veneers',
        'Fluted timber wall paneling & bespoke upholstered headboards',
        'Custom study desk, vanity units & bar/breakfast counter',
        'Designer pendant luminaires & layered lighting plan',
        'Complete itemized BOQ & regular site progress reports',
      ],
    },
    {
      id: 'luxury-custom',
      name: 'Luxury Custom Interiors',
      tagline: 'Bespoke architectural millwork, natural stone & end-to-end styling',
      idealFor: 'Penthouses, independent villas & luxury residences across Delhi NCR',
      illustrativePrice: '₹25 lakh+ (Illustrative)',
      budgetBandValue: 'Luxury Custom Interiors: ₹25 lakh+',
      estimatedTimelineNote: 'Phased schedule aligned to custom stone & millwork',
      includes: [
        'Natural marble, honed travertine & quartzite surface detailing',
        'Custom solid wood furniture, walk-in closets & brass inlays',
        'Limewash/textured walls & acoustic living room treatments',
        'Smart lighting scene planning & automated drapery tracks',
        'Complete soft furnishings, art placement & move-in styling',
      ],
    },
  ] as PackageTier[],
  materialMoodboard: [
    {
      id: 'mat-travertine',
      name: 'Honed Travertine Stone',
      origin: 'Natural Quarry Stone',
      finish: 'Soft matte honed',
      application: 'Coffee tables, TV plinths, foyer accents',
      swatchHex: '#DFD6C5',
      grainNote: 'Subtle natural veining that softens bright rooms and pairs warmly with wood.',
    },
    {
      id: 'mat-walnut',
      name: 'Smoked Walnut Wood Veneer',
      origin: 'Natural Timber Finish',
      finish: 'Matte protective coat',
      application: 'Fluted wall panels, wardrobes, study desks',
      swatchHex: '#594230',
      grainNote: 'Rich warm brown tone that anchors living spaces and master bedrooms.',
    },
    {
      id: 'mat-brass',
      name: 'Brushed Brass Hardware',
      origin: 'Satin Metal Finish',
      finish: 'Soft brushed satin',
      application: 'Cabinet handles, inlay strips, pendant lights',
      swatchHex: '#B69A68',
      grainNote: 'Warm metallic accent without harsh mirror-chrome glare.',
    },
    {
      id: 'mat-olive',
      name: 'Olive Ash Mineral Paint',
      origin: 'Low-VOC Mineral Tone',
      finish: 'Chalky matte texture',
      application: 'Dining backdrops, bedroom accent walls',
      swatchHex: '#626B55',
      grainNote: 'Grounded botanical tone that shifts gently between daylight and evening lamps.',
    },
    {
      id: 'mat-linen',
      name: 'Woven Natural Linen',
      origin: 'Soft Textile Weave',
      finish: 'Breathable soft drape',
      application: 'Full-height curtains, upholstered headboards, sofas',
      swatchHex: '#D8C8B4',
      grainNote: 'Adds relaxed warmth against clean walls and stone flooring.',
    },
  ] as MaterialSwatch[],
  floorPlanHotspots: [
    {
      id: 'fp-living',
      xPercent: 28,
      yPercent: 46,
      zone: 'Zone 01 · Living Room',
      title: 'Fluted Timber Media Wall & Seating Layout',
      dimensions: 'Sample 22 ft × 14 ft',
      specification: 'Custom wall-mounted console with concealed wiring and generous walking clearance.',
      materialNote: 'Walnut Veneer + Travertine Finish',
    },
    {
      id: 'fp-dining',
      xPercent: 52,
      yPercent: 34,
      zone: 'Zone 02 · Dining Area',
      title: '6–8 Seater Dining & Crockery Niche',
      dimensions: 'Sample 14 ft × 12 ft',
      specification: 'Stone-top dining table positioned beneath a warm linear chandelier with adjacent storage.',
      materialNote: 'Natural Marble + Brushed Brass',
    },
    {
      id: 'fp-kitchen',
      xPercent: 76,
      yPercent: 28,
      zone: 'Zone 03 · Modular Kitchen',
      title: 'Island / Parallel Kitchen & Utility Pantry',
      dimensions: 'Sample 13 ft × 11 ft',
      specification: 'Moisture-resistant cabinet carcass, tall pantry storage, and durable stone countertop.',
      materialNote: 'Quartzite Counter + Matte Charcoal & Oak',
    },
    {
      id: 'fp-master',
      xPercent: 72,
      yPercent: 72,
      zone: 'Zone 04 · Master Bedroom',
      title: 'Upholstered Headboard & Full-Height Wardrobe',
      dimensions: 'Sample 16 ft × 13 ft',
      specification: 'Soft fabric headboard, bedside pendant lighting, and floor-to-ceiling loft wardrobes.',
      materialNote: 'Walnut Finish + Bouclé Upholstery',
    },
  ] as FloorPlanHotspot[],
  testimonials: [
    {
      id: 'test-1',
      clientName: 'Rohan & Meera K. [Sample Story]',
      residence: 'Illustrative 3 BHK Apartment · Noida Extension',
      projectType: 'Complete Home Interiors',
      challenge: 'Awkward structural column placement near the dining area in a bare apartment.',
      approach: 'Wrapped the column into a seamless crockery unit and warm timber paneling.',
      quote:
        'Illustrative testimonial demonstrating how Aaranya Interiors communicates layout planning, material clarity, and room-by-room execution.',
      isIllustrativeSample: true,
    },
    {
      id: 'test-2',
      clientName: 'Dr. Siddharth V. [Sample Story]',
      residence: 'Illustrative Villa Renovation · Greater Noida',
      projectType: 'Modular Kitchen & Living Makeover',
      challenge: 'Fragmented older kitchen layout with limited natural light and counter space.',
      approach: 'Opened the partition into an island kitchen with light stone counters and tall pantry units.',
      quote:
        'Sample client story showing how structural modifications and modular fabrication are coordinated under one studio workflow.',
      isIllustrativeSample: true,
    },
    {
      id: 'test-3',
      clientName: 'Ananya & Kabir M. [Sample Story]',
      residence: 'Illustrative 4 BHK Home · Noida Expressway',
      projectType: 'Remote / NRI Project Supervision',
      challenge: 'Coordinating interior selections and site milestones while living overseas.',
      approach: 'Weekly photo dossiers, video material approvals, and transparent stage-wise updates.',
      quote:
        'Illustrative case study demonstrating remote milestone coordination for outstation and NRI homeowners.',
      isIllustrativeSample: true,
    },
  ] as TestimonialItem[],
  faqs: [
    {
      id: 'faq-1',
      category: 'Pricing & Packages',
      question: 'How are interior design packages priced for 2 BHK, 3 BHK, or 4 BHK homes?',
      answer:
        'Our illustrative ranges start from Customized Quotes for individual rooms, ₹3–6 lakh for Essential Home Interiors, ₹6–12 lakh for Signature Home Interiors, ₹12–25 lakh for Premium Home Interiors, and ₹25 lakh+ for Luxury Custom Interiors. Exact pricing depends on carpet area, cabinet measurements, and material selections.',
    },
    {
      id: 'faq-2',
      category: 'Consultation & Process',
      question: 'Is the preferred consultation date I pick on the website immediately confirmed?',
      answer:
        'Your submitted date and time act as a consultation request so our team knows your availability. A designer reviews your property details and contacts you to confirm the exact studio, site, or video appointment slot.',
    },
    {
      id: 'faq-3',
      category: 'Design & Execution',
      question: 'Can I book just a Modular Kitchen or Custom Furniture without a full home renovation?',
      answer:
        'Yes. You can select Individual Room Interiors or specify Modular Kitchen / Custom Furniture & Wardrobes in our consultation form to receive a tailored quote for only the rooms you want designed.',
    },
    {
      id: 'faq-4',
      category: 'Site Visits & Locations',
      question: 'Which areas in Delhi NCR do you cover for consultations and site visits?',
      answer:
        'Our design teams serve Greater Noida, Noida Extension (Greater Noida West), Noida Expressway sectors, and broader Delhi NCR. Virtual design consultations are also available for outstation and NRI homeowners.',
    },
    {
      id: 'faq-5',
      category: 'Pricing & Packages',
      question: 'Do I receive a detailed quotation before work starts?',
      answer:
        'Yes. After understanding your floor plan and preferred materials, we prepare an itemized Bill of Quantities (BOQ) listing dimensions, core board grades, finishes, and hardware so there are no surprises.',
    },
  ] as FaqItem[],
  enquiryOptions: {
    propertyTypes: [
      '2 BHK Apartment',
      '3 BHK Apartment',
      '4 BHK / Penthouse',
      'Independent Villa / Kothi',
      'Builder Floor',
      'Office / Commercial Space',
    ],
    propertyStatuses: [
      'Ready to Move',
      'Under Construction (Possession Soon)',
      'Existing Home Renovation',
      'Bare Shell / New Handover',
    ],
    requirementsList: [
      'Complete Home Interiors',
      'Modular Kitchen',
      'Custom Furniture & Wardrobes',
      'Living & Dining Design',
      'Bedroom & Study Design',
      'False Ceiling & Lighting',
      'Painting & Wall Finishes',
    ],
    budgetBands: [
      'Individual Room Interiors: Customized Quote',
      'Essential Home Interiors: ₹3–6 lakh',
      'Signature Home Interiors: ₹6–12 lakh',
      'Premium Home Interiors: ₹12–25 lakh',
      'Luxury Custom Interiors: ₹25 lakh+',
    ],
    consultationSlots: [
      '10:30 AM – 12:00 PM',
      '12:30 PM – 02:00 PM',
      '03:30 PM – 05:00 PM',
      '05:30 PM – 07:00 PM',
    ],
    consultationModes: [
      'Studio Design Call / Video Meeting',
      'On-Site Property Visit Request',
      'In-Person Consultation (By Appointment)',
    ],
    queryCategories: [
      'Pricing & Packages',
      'Modular Kitchen & Wardrobes',
      'Design Timeline & Process',
      'Site Visit & Locations',
      'NRI / Remote Coordination',
      'Other',
    ],
  },
};

export function buildWhatsAppUrl(params: {
  service?: string;
  budget?: string;
  packageName?: string;
  leadId?: string;
  location?: string;
  customText?: string;
}): string {
  const number = siteConfig.business.whatsappNumber.replace(/\D/g, '');
  const parts = [`Hello ${siteConfig.business.name}, I would like to enquire about interior design.`];
  if (params.customText) {
    parts.splice(0, parts.length, params.customText);
  } else {
    if (params.leadId) parts.push(`Reference ID: ${params.leadId}`);
    if (params.packageName) parts.push(`Package: ${params.packageName}`);
    if (params.service) parts.push(`Requirement: ${params.service}`);
    if (params.budget) parts.push(`Illustrative Budget: ${params.budget}`);
    if (params.location) parts.push(`Location: ${params.location}`);
  }
  const encoded = encodeURIComponent(parts.join('\n'));
  return number ? `https://wa.me/${number}?text=${encoded}` : `https://wa.me/?text=${encoded}`;
}
