export type VisualAsset = {
  src: string;
  alt: string;
  position?: string;
};

function normalize(key: string) {
  return key.trim().toLowerCase();
}

function asset(src: string, alt: string, position?: string): VisualAsset {
  return { src, alt, position };
}

const visualAssets: Record<string, VisualAsset> = {
  "cocoa ceremony suit": asset(
    "/images/ixquisite/cocoa-double-breasted-suit.webp",
    "Model in a cocoa double-breasted suit with a clean ceremony-ready stance.",
    "center 18%",
  ),
  suits: asset(
    "/images/ixquisite/midnight-commander-suit.webp",
    "Royal blue double-breasted tailoring presented as a sharp suiting hero.",
    "center 18%",
  ),
  shirts: asset(
    "/products/shirts/black-ceremony-shirt/black/main.webp",
    "Black Ceremony Shirt main view used as the shirts category spotlight.",
    "center 18%",
  ),
  trousers: asset(
    "/images/ixquisite/walnut-pleated-trouser.webp",
    "Full-length tailoring shot showing clean trouser lines and soft structure.",
    "center 18%",
  ),
  ties: asset(
    "/images/ixquisite/regent-silk-tie.webp",
    "Close crop of tie, lapel, and shirt textures in formalwear styling.",
    "center 18%",
  ),
  accessories: asset(
    "/images/ixquisite/heirloom-accessory-set.webp",
    "Black formalwear detail with accessory-led styling and refined finishes.",
    "center 18%",
  ),
  office: asset(
    "/images/ixquisite/midnight-commander-suit-styled.webp",
    "Structured blue tailoring suited to office dressing and daily authority.",
    "center 24%",
  ),
  executive: asset(
    "/images/ixquisite/midnight-commander-suit.webp",
    "Executive tailoring in a rich blue double-breasted silhouette.",
    "center 16%",
  ),
  "wedding guest": asset(
    "/images/ixquisite/cocoa-double-breasted-suit-styled.webp",
    "Cocoa tailoring styled for polished wedding guest dressing.",
    "center 24%",
  ),
  "groom's package": asset(
    "/images/ixquisite/cocoa-double-breasted-suit.webp",
    "Refined groom-ready tailoring in a cocoa double-breasted suit.",
    "center 18%",
  ),
  "your wedding look. perfectly handled.": asset(
    "/images/ixquisite/oxblood-dinner-jacket.webp",
    "Ceremony-first burgundy tailoring styled for a groom package hero.",
    "center 18%",
  ),
  "basic groom package": asset(
    "/images/ixquisite/midnight-commander-suit.webp",
    "Entry package styling anchored by sharp blue formal tailoring.",
    "center 18%",
  ),
  "standard groom package": asset(
    "/images/ixquisite/cocoa-double-breasted-suit.webp",
    "Standard groom package styling in warm cocoa tailoring.",
    "center 18%",
  ),
  "premium groom package": asset(
    "/images/ixquisite/oxblood-dinner-jacket.webp",
    "Premium groom package styling with a rich burgundy dinner jacket.",
    "center 18%",
  ),
  "wedding inquiry": asset(
    "/images/ixquisite/groomsmen-suit-group-alt.webp",
    "Coordinated ceremony tailoring for wedding inquiries and group support.",
    "center 24%",
  ),
  "dress your team": asset(
    "/images/ixquisite/groomsmen-suit-group.webp",
    "Coordinated groom and groomsmen tailoring in a ceremony lineup.",
    "center 24%",
  ),
  "black tie": asset(
    "/images/ixquisite/charcoal-windowpane-suit.webp",
    "Dark formal tailoring for black-tie and evening dressing.",
    "center 16%",
  ),
  "business travel": asset(
    "/images/ixquisite/cocoa-double-breasted-suit-styled.webp",
    "Full-length tailoring with enough structure for polished travel days.",
    "center 24%",
  ),
  "boardroom edit": asset(
    "/images/ixquisite/midnight-commander-suit-styled.webp",
    "Boardroom collection image anchored by precise blue tailoring.",
    "center 18%",
  ),
  "latest arrivals": asset(
    "/images/ixquisite/cocoa-double-breasted-suit-styled.webp",
    "New-arrivals tailoring shot with strong silhouette and clean framing.",
    "center 18%",
  ),
  "best sellers": asset(
    "/images/ixquisite/midnight-commander-suit.webp",
    "Best-selling tailoring presented through a strong blue suit portrait.",
    "center 18%",
  ),
  "executive essentials": asset(
    "/images/ixquisite/ivory-broadcloth-shirt-styled.webp",
    "Executive wardrobe essentials centered on crisp shirting and tailoring.",
    "center 18%",
  ),
  "signature neutrals": asset(
    "/images/ixquisite/cocoa-double-breasted-suit-detail.webp",
    "Warm neutral tailoring detail in cocoa and soft ceremony tones.",
    "center 18%",
  ),
  "midnight commander suit": asset(
    "/images/ixquisite/midnight-commander-suit.webp",
    "Royal blue double-breasted suit shown in a clean portrait crop.",
    "center 18%",
  ),
  "midnight commander suit::detail": asset(
    "/images/ixquisite/midnight-commander-suit-detail.webp",
    "Close tailoring detail from the midnight commander suit.",
    "center 18%",
  ),
  "midnight commander suit::styled": asset(
    "/images/ixquisite/midnight-commander-suit-styled.webp",
    "Styled blue tailoring shot for the midnight commander suit.",
    "center 18%",
  ),
  "charcoal windowpane suit": asset(
    "/images/ixquisite/charcoal-windowpane-suit.webp",
    "Dark ceremony tailoring used to represent the charcoal windowpane suit.",
    "center 18%",
  ),
  "cocoa double-breasted suit": asset(
    "/images/ixquisite/cocoa-double-breasted-suit.webp",
    "Cocoa double-breasted suit in a strong editorial portrait.",
    "center 18%",
  ),
  "cocoa double-breasted suit::detail": asset(
    "/images/ixquisite/cocoa-double-breasted-suit-detail.webp",
    "Close detail of the cocoa suit's lapel, tie, and shirt pairing.",
    "center 18%",
  ),
  "cocoa double-breasted suit::styled": asset(
    "/images/ixquisite/cocoa-double-breasted-suit-styled.webp",
    "Full-length styling of the cocoa double-breasted suit.",
    "center 18%",
  ),
  "ivory broadcloth shirt": asset(
    "/images/ixquisite/ivory-broadcloth-shirt.webp",
    "Ivory broadcloth shirt layered into a clean tailored look.",
    "center 18%",
  ),
  "ivory broadcloth shirt::detail": asset(
    "/images/ixquisite/ivory-broadcloth-shirt-detail.webp",
    "Detail crop of shirting and lapel textures for the ivory broadcloth shirt.",
    "center 18%",
  ),
  "ivory broadcloth shirt::styled": asset(
    "/images/ixquisite/ivory-broadcloth-shirt-styled.webp",
    "Styled ceremony look featuring the ivory broadcloth shirt.",
    "center 18%",
  ),
  "slate pinstripe shirt": asset(
    "/images/ixquisite/slate-pinstripe-shirt.webp",
    "Blue tailored styling used to represent the slate pinstripe shirt.",
    "center 18%",
  ),
  "slate pinstripe shirt::detail": asset(
    "/images/ixquisite/slate-pinstripe-shirt-detail.webp",
    "Pinstripe-inspired tailoring detail for the slate shirt product view.",
    "center 18%",
  ),
  "slate pinstripe shirt::styled": asset(
    "/images/ixquisite/slate-pinstripe-shirt-styled.webp",
    "Styled product image for the slate pinstripe shirt.",
    "center 18%",
  ),
  "tailored ink trouser": asset(
    "/images/ixquisite/tailored-ink-trouser.webp",
    "Dark formal tailoring used to represent the tailored ink trouser.",
    "center 18%",
  ),
  "tailored ink trouser::detail": asset(
    "/images/ixquisite/tailored-ink-trouser-detail.webp",
    "Trouser and jacket detail for the tailored ink trouser styling.",
    "center 18%",
  ),
  "tailored ink trouser::styled": asset(
    "/images/ixquisite/tailored-ink-trouser-styled.webp",
    "Full-length styling for the tailored ink trouser.",
    "center 18%",
  ),
  "walnut pleated trouser": asset(
    "/images/ixquisite/walnut-pleated-trouser.webp",
    "Warm-toned pleated trouser styling in a full-length tailored frame.",
    "center 18%",
  ),
  "walnut pleated trouser::detail": asset(
    "/images/ixquisite/walnut-pleated-trouser-detail.webp",
    "Close detail of warm tailoring textures for the walnut pleated trouser.",
    "center 18%",
  ),
  "walnut pleated trouser::styled": asset(
    "/images/ixquisite/walnut-pleated-trouser-styled.webp",
    "Styled warm tailoring image for the walnut pleated trouser.",
    "center 18%",
  ),
  "regent silk tie": asset(
    "/images/ixquisite/regent-silk-tie.webp",
    "Close crop highlighting the regent silk tie in a formal look.",
    "center 18%",
  ),
  "regent silk tie::detail": asset(
    "/images/ixquisite/regent-silk-tie-detail.webp",
    "Detailed tie and lapel texture for the regent silk tie.",
    "center 18%",
  ),
  "regent silk tie::styled": asset(
    "/images/ixquisite/regent-silk-tie-styled.webp",
    "Styled tailored composition used for the regent silk tie.",
    "center 18%",
  ),
  "midnight velvet smoking jacket": asset(
    "/images/ixquisite/midnight-velvet-smoking-jacket.webp",
    "Dark formalwear detail used to represent the midnight velvet smoking jacket.",
    "center 18%",
  ),
  "oxblood dinner jacket": asset(
    "/images/ixquisite/oxblood-dinner-jacket.webp",
    "Burgundy dinner jacket portrait with ceremony-ready polish.",
    "center 18%",
  ),
  "forest pinstripe double-breasted suit": asset(
    "/images/ixquisite/forest-pinstripe-double-breasted-suit.webp",
    "Forest double-breasted tailoring with a rich, modern formal silhouette.",
    "center 18%",
  ),
  "heirloom accessory set": asset(
    "/images/ixquisite/heirloom-accessory-set.webp",
    "Accessory-led black formalwear detail for the heirloom set.",
    "center 18%",
  ),
  "heirloom accessory set::detail": asset(
    "/images/ixquisite/heirloom-accessory-set-detail.webp",
    "Burgundy detail crop showing accessory textures and finishing points.",
    "center 18%",
  ),
  "heirloom accessory set::styled": asset(
    "/images/ixquisite/heirloom-accessory-set-styled.webp",
    "Styled black formalwear image for the heirloom accessory set.",
    "center 18%",
  ),
  "how to style a brown suit without losing formality": asset(
    "/images/ixquisite/cocoa-double-breasted-suit-styled.webp",
    "Editorial brown-suit styling image with a formal, balanced silhouette.",
    "center 18%",
  ),
  "shirt and tie combinations that always look expensive": asset(
    "/images/ixquisite/regent-silk-tie-detail.webp",
    "Editorial close-up of shirt, tie, and lapel textures.",
    "center 18%",
  ),
  "the professional wardrobe essentials worth buying first": asset(
    "/images/ixquisite/midnight-commander-suit-styled.webp",
    "Wardrobe-essentials editorial image anchored by clean blue tailoring.",
    "center 18%",
  ),
  "boardroom quiet luxury": asset(
    "/images/ixquisite/midnight-commander-suit-styled.webp",
    "Quiet luxury boardroom look built around strong blue tailoring.",
    "center 18%",
  ),
  "ceremony in cocoa": asset(
    "/images/ixquisite/cocoa-double-breasted-suit-styled.webp",
    "Ceremony-ready cocoa tailoring in a full-length editorial frame.",
    "center 18%",
  ),
  "travel day precision": asset(
    "/images/ixquisite/forest-pinstripe-double-breasted-suit.webp",
    "Travel-day tailoring with depth, structure, and a confident stance.",
    "center 18%",
  ),
  "private fittings made simple": asset(
    "/images/ixquisite/midnight-commander-suit-styled.webp",
    "Tailoring-led image for private fittings and guided wardrobe support.",
    "center 18%",
  ),
};

export function getVisualAsset(key: string) {
  return visualAssets[normalize(key)];
}
