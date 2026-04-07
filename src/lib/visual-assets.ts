export type VisualAsset = {
  src: string;
  alt: string;
  position?: string;
};

function normalize(key: string) {
  return key.trim().toLowerCase();
}

const visualAssets: Record<string, VisualAsset> = {
  "cocoa ceremony suit": {
    src: "/images/ixquisite/cocoa-outdoor-brown-suit.jpg",
    alt: "Model in a cocoa brown double-breasted suit outdoors.",
    position: "center 18%",
  },
  "suits": {
    src: "/images/ixquisite/hero-teal-double-breasted.jpg",
    alt: "Close portrait of a sharply tailored double-breasted suit.",
    position: "center 14%",
  },
  "shirts": {
    src: "/images/ixquisite/ivory-navy-look.jpg",
    alt: "Tailored formal look with crisp shirting and sharp layering.",
    position: "center 14%",
  },
  "trousers": {
    src: "/images/ixquisite/taupe-double-breasted-look.jpg",
    alt: "Tailored menswear look showing refined trouser lines.",
    position: "center 18%",
  },
  "ties": {
    src: "/images/ixquisite/cocoa-suit-close.jpg",
    alt: "Close studio crop of a brown tailored suit with matching tie.",
    position: "center 22%",
  },
  "accessories": {
    src: "/images/ixquisite/black-ceremony-suit.jpg",
    alt: "Formal black suit styled with lapel chain and accessories.",
    position: "center 18%",
  },
  "office": {
    src: "/images/ixquisite/navy-pinstripe-jacket.jpg",
    alt: "Pinstripe double-breasted jacket styled for office dressing.",
    position: "center 18%",
  },
  "executive": {
    src: "/images/ixquisite/hero-teal-double-breasted.jpg",
    alt: "Confident executive tailoring in a dark double-breasted suit.",
    position: "center 14%",
  },
  "wedding guest": {
    src: "/images/ixquisite/cocoa-outdoor-brown-suit.jpg",
    alt: "Brown ceremony suit styled for a wedding guest look.",
    position: "center 20%",
  },
  "groom's package": {
    src: "/images/ixquisite/cocoa-outdoor-brown-suit.jpg",
    alt: "Premium groom styling in a brown ceremony suit.",
    position: "center 18%",
  },
  "your wedding look. perfectly handled.": {
    src: "/images/ixquisite/cocoa-outdoor-brown-suit.jpg",
    alt: "Premium groom styling in a cocoa ceremony suit.",
    position: "center 18%",
  },
  "basic groom package": {
    src: "/images/ixquisite/navy-pinstripe-jacket.jpg",
    alt: "Dark formal suit styling for a basic groom package.",
    position: "center 16%",
  },
  "standard groom package": {
    src: "/images/ixquisite/cocoa-outdoor-brown-suit.jpg",
    alt: "Refined brown ceremony suit for the standard groom package.",
    position: "center 18%",
  },
  "premium groom package": {
    src: "/images/ixquisite/black-ceremony-suit.jpg",
    alt: "Premium black formalwear styling with ceremonial accessories.",
    position: "center 18%",
  },
  "wedding inquiry": {
    src: "/images/ixquisite/white-dinner-jacket.jpg",
    alt: "Formal white dinner jacket for premium wedding inquiry support.",
    position: "center 18%",
  },
  "dress your team": {
    src: "/images/ixquisite/hero-teal-double-breasted.jpg",
    alt: "Coordinated formalwear visual for groomsmen support.",
    position: "center 14%",
  },
  "black tie": {
    src: "/images/ixquisite/white-dinner-jacket.jpg",
    alt: "White dinner jacket styled for formal evening wear.",
    position: "center 18%",
  },
  "business travel": {
    src: "/images/ixquisite/taupe-double-breasted-look.jpg",
    alt: "Neutral tailored look suitable for polished travel dressing.",
    position: "center 18%",
  },
  "boardroom edit": {
    src: "/images/ixquisite/hero-teal-double-breasted.jpg",
    alt: "Editorial tailoring image for the boardroom collection.",
    position: "center 14%",
  },
  "latest arrivals": {
    src: "/images/ixquisite/brand-landscape.jpg",
    alt: "Ixquisite Menswear brand image for latest arrivals.",
    position: "center center",
  },
  "best sellers": {
    src: "/images/ixquisite/hero-teal-double-breasted.jpg",
    alt: "Ixquisite Menswear tailoring image for best sellers.",
    position: "center 14%",
  },
  "executive essentials": {
    src: "/images/ixquisite/ivory-navy-look.jpg",
    alt: "Polished suiting and shirting for executive essentials.",
    position: "center 18%",
  },
  "signature neutrals": {
    src: "/images/ixquisite/cocoa-suit-close.jpg",
    alt: "Warm neutral tailoring in cocoa tones.",
    position: "center 18%",
  },
  "midnight commander suit": {
    src: "/images/ixquisite/navy-pinstripe-jacket.jpg",
    alt: "Dark tailored suit with sharp lapels in a showroom setting.",
    position: "center 20%",
  },
  "midnight commander suit::detail": {
    src: "/images/ixquisite/hero-teal-double-breasted.jpg",
    alt: "Close tailoring detail on a dark double-breasted suit.",
    position: "center 12%",
  },
  "midnight commander suit::styled": {
    src: "/images/ixquisite/brand-landscape.jpg",
    alt: "Ixquisite Menswear branded tailoring backdrop.",
    position: "center center",
  },
  "charcoal windowpane suit": {
    src: "/images/ixquisite/charcoal-windowpane-suit-v1.png",
    alt: "Charcoal windowpane double-breasted suit in a premium retail setting.",
    position: "center 18%",
  },
  "cocoa double-breasted suit": {
    src: "/images/ixquisite/cocoa-outdoor-brown-suit.jpg",
    alt: "Brown double-breasted suit styled outdoors.",
    position: "center 18%",
  },
  "cocoa double-breasted suit::detail": {
    src: "/images/ixquisite/cocoa-suit-close.jpg",
    alt: "Studio close-up of a cocoa brown double-breasted suit.",
    position: "center 18%",
  },
  "cocoa double-breasted suit::styled": {
    src: "/images/ixquisite/cocoa-suit-mannequin.jpg",
    alt: "Brown double-breasted suit displayed on a mannequin.",
    position: "center 16%",
  },
  "ivory broadcloth shirt": {
    src: "/images/ixquisite/ivory-navy-look.jpg",
    alt: "Ivory shirt layered beneath a polished tailored look.",
    position: "center 18%",
  },
  "ivory broadcloth shirt::detail": {
    src: "/images/ixquisite/white-dinner-jacket.jpg",
    alt: "Crisp white shirting styled under formal tailoring.",
    position: "center 16%",
  },
  "ivory broadcloth shirt::styled": {
    src: "/images/ixquisite/white-three-piece.jpg",
    alt: "Ivory three-piece tailoring with crisp formal shirt styling.",
    position: "center 16%",
  },
  "slate pinstripe shirt": {
    src: "/images/ixquisite/ivory-navy-look.jpg",
    alt: "Structured formal look with subtle stripe influence.",
    position: "center 16%",
  },
  "slate pinstripe shirt::detail": {
    src: "/images/ixquisite/navy-pinstripe-jacket.jpg",
    alt: "Pinstripe tailoring detail in a showroom environment.",
    position: "center 18%",
  },
  "slate pinstripe shirt::styled": {
    src: "/images/ixquisite/brand-landscape.jpg",
    alt: "Ixquisite branded backdrop with tailored textures.",
    position: "center center",
  },
  "tailored ink trouser": {
    src: "/images/ixquisite/black-ceremony-suit.jpg",
    alt: "Black tailored suit look showing clean trouser lines.",
    position: "center 18%",
  },
  "tailored ink trouser::detail": {
    src: "/images/ixquisite/hero-teal-double-breasted.jpg",
    alt: "Close tailored detail from a dark formal look.",
    position: "center 18%",
  },
  "tailored ink trouser::styled": {
    src: "/images/ixquisite/ivory-navy-look.jpg",
    alt: "Navy trouser styling paired with a light jacket.",
    position: "center 18%",
  },
  "walnut pleated trouser": {
    src: "/images/ixquisite/taupe-double-breasted-look.jpg",
    alt: "Warm-toned tailored look with refined pleated trouser styling.",
    position: "center 18%",
  },
  "walnut pleated trouser::detail": {
    src: "/images/ixquisite/cocoa-suit-close.jpg",
    alt: "Warm brown tailoring close-up with soft tonal depth.",
    position: "center 22%",
  },
  "walnut pleated trouser::styled": {
    src: "/images/ixquisite/cocoa-suit-mannequin.jpg",
    alt: "Warm brown tailoring presented in a studio mannequin shot.",
    position: "center 18%",
  },
  "regent silk tie": {
    src: "/images/ixquisite/hero-teal-double-breasted.jpg",
    alt: "Silk tie detail styled with a formal double-breasted suit.",
    position: "center 10%",
  },
  "regent silk tie::detail": {
    src: "/images/ixquisite/cocoa-suit-close.jpg",
    alt: "Close-up of a tie and lapel pairing in brown tailoring.",
    position: "center 16%",
  },
  "regent silk tie::styled": {
    src: "/images/ixquisite/brand-landscape.jpg",
    alt: "Branded tailored composition with tie and lapel textures.",
    position: "center center",
  },
  "midnight velvet smoking jacket": {
    src: "/images/ixquisite/midnight-velvet-smoking-jacket-v1.png",
    alt: "Midnight velvet smoking jacket in an upscale interior setting.",
    position: "center 18%",
  },
  "oxblood dinner jacket": {
    src: "/images/ixquisite/oxblood-dinner-jacket-v1.png",
    alt: "Oxblood dinner jacket styled for luxury eveningwear.",
    position: "center 18%",
  },
  "forest pinstripe double-breasted suit": {
    src: "/images/ixquisite/forest-pinstripe-double-breasted-suit-v1.png",
    alt: "Forest green pinstripe double-breasted suit in a tailored showroom.",
    position: "center 18%",
  },
  "heirloom accessory set": {
    src: "/images/ixquisite/black-ceremony-suit.jpg",
    alt: "Formal accessories styled on a black ceremony look.",
    position: "center 18%",
  },
  "heirloom accessory set::detail": {
    src: "/images/ixquisite/cocoa-outdoor-brown-suit.jpg",
    alt: "Accessories and finishing details on a brown formal suit.",
    position: "center 22%",
  },
  "heirloom accessory set::styled": {
    src: "/images/ixquisite/white-dinner-jacket.jpg",
    alt: "Accessory-friendly white dinner jacket formal styling.",
    position: "center 18%",
  },
  "how to style a brown suit without losing formality": {
    src: "/images/ixquisite/cocoa-outdoor-brown-suit.jpg",
    alt: "Brown suit styling image for editorial guidance.",
    position: "center 18%",
  },
  "shirt and tie combinations that always look expensive": {
    src: "/images/ixquisite/cocoa-suit-close.jpg",
    alt: "Tailored shirt and tie pairing in a studio portrait crop.",
    position: "center 18%",
  },
  "the professional wardrobe essentials worth buying first": {
    src: "/images/ixquisite/brand-landscape.jpg",
    alt: "Ixquisite branded tailoring image for wardrobe essentials editorial.",
    position: "center center",
  },
  "boardroom quiet luxury": {
    src: "/images/ixquisite/hero-teal-double-breasted.jpg",
    alt: "Quiet luxury boardroom look in a dark double-breasted suit.",
    position: "center 14%",
  },
  "ceremony in cocoa": {
    src: "/images/ixquisite/cocoa-outdoor-brown-suit.jpg",
    alt: "Ceremony-ready cocoa tailoring outdoors.",
    position: "center 18%",
  },
  "travel day precision": {
    src: "/images/ixquisite/taupe-double-breasted-look.jpg",
    alt: "Neutral precision tailoring suited to travel-day dressing.",
    position: "center 18%",
  },
  "private fittings made simple": {
    src: "/images/ixquisite/brand-landscape.jpg",
    alt: "Ixquisite Menswear brand artwork over a tailored suit backdrop.",
    position: "center center",
  },
};

export function getVisualAsset(key: string) {
  return visualAssets[normalize(key)];
}
