import type { MDXComponents } from "mdx/types";
import { Check, NumericCheck, Order, Reveal, Sort } from "./lesson/Interactions";
import { VideoEmbed } from "./embeds/VideoEmbed";
import { GoDeeper, LinkCard } from "./embeds/LinkCard";
import { TokenizerExplorer } from "./widgets/TokenizerExplorer";
import { SamplingSimulator } from "./widgets/SamplingSimulator";
import { SplitAndThreshold } from "./widgets/SplitAndThreshold";
import { CostLatencyCalculator } from "./widgets/CostLatencyCalculator";
import { EmbeddingMap } from "./widgets/EmbeddingMap";
import { ChunkAndRetrieve } from "./widgets/ChunkAndRetrieve";
import { GradientDescentPlayground } from "./widgets/GradientDescentPlayground";
import { AttentionHeatmap } from "./widgets/AttentionHeatmap";
import { AgentLoopStepper } from "./widgets/AgentLoopStepper";
import { PromptInjectionDemo } from "./widgets/PromptInjectionDemo";
import { PythonPractice } from "./widgets/PythonPractice";
import { SqlPractice } from "./widgets/SqlPractice";
import { VectorExplorer } from "./widgets/VectorExplorer";
import { PipelineSimulator } from "./widgets/PipelineSimulator";
import { DocExtractionDemo } from "./widgets/DocExtractionDemo";
import { ABTestSimulator } from "./widgets/ABTestSimulator";

function Callout({ type = "note", children }: { type?: "note" | "warning" | "tip"; children: React.ReactNode }) {
  const styles = {
    note: { icon: "ℹ", cls: "border-accent/40 bg-accent/5" },
    tip: { icon: "💡", cls: "border-ok/40 bg-ok/5" },
    warning: { icon: "⚠", cls: "border-amber-500/40 bg-amber-500/10" },
  }[type];
  return (
    <div className={`rounded-xl border p-4 my-5 not-prose text-[15px] ${styles.cls}`}>
      <span aria-hidden className="mr-2">{styles.icon}</span>
      {children}
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  Check,
  Sort,
  Order,
  NumericCheck,
  Reveal,
  VideoEmbed,
  LinkCard,
  GoDeeper,
  Callout,
  TokenizerExplorer,
  SamplingSimulator,
  SplitAndThreshold,
  CostLatencyCalculator,
  EmbeddingMap,
  ChunkAndRetrieve,
  GradientDescentPlayground,
  AttentionHeatmap,
  AgentLoopStepper,
  PromptInjectionDemo,
  PythonPractice,
  SqlPractice,
  VectorExplorer,
  PipelineSimulator,
  DocExtractionDemo,
  ABTestSimulator,
};
