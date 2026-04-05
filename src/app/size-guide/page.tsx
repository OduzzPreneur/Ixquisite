import { PolicyPage } from "@/components/page-templates";

export default function SizeGuidePage() {
  return (
    <PolicyPage
      eyebrow="Size guide"
      title="Sizing confidence needs its own destination."
      copy="The size guide supports suits, shirts, trousers, and accessories with clear measurement prompts and fit language."
      items={[
        { title: "Suit sizing", copy: "Chest-focused suit sizing with notes on structured shoulders, waist shape, and trouser pairing." },
        { title: "Shirt sizing", copy: "Collar and sleeve references with slim and regular fit explanations." },
        { title: "Trouser sizing", copy: "Waist, seat, and taper notes that help customers interpret the silhouette before buying." },
        { title: "How to measure", copy: "Simple measurement guidance backed by support if a client wants help before ordering." },
      ]}
    />
  );
}
