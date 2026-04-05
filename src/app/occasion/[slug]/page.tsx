import { notFound } from "next/navigation";
import { ListingPage } from "@/components/page-templates";
import { getOccasion, getOccasions, getProductsByOccasion } from "@/lib/catalog";

export async function generateStaticParams() {
  const occasions = await getOccasions();
  return occasions.map((occasion) => ({ slug: occasion.slug }));
}

export default async function OccasionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const occasion = await getOccasion(slug);

  if (!occasion) {
    notFound();
  }

  return (
    <ListingPage
      eyebrow="Occasion"
      title={occasion.title}
      copy={occasion.description}
      tone={occasion.tone}
      visualTitle={occasion.title}
      visualKicker="Occasion-led shop"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Occasions", href: "/occasions" }, { label: occasion.title }]}
      products={await getProductsByOccasion(slug)}
    />
  );
}
