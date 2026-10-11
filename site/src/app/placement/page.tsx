import { PlacementQuiz } from "@/components/placement/PlacementQuiz";

export const metadata = { title: "Where should I start?" };

export default function PlacementPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Where should you start?</h1>
      <p className="muted mb-8">
        Ten questions recommend where to begin reviewing. Nothing is recorded, and all modules remain accessible. This does not waive earlier practical evidence or completion requirements.
      </p>
      <PlacementQuiz />
    </div>
  );
}
