import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 prose-custom">
      <h1>About this course</h1>
      <p>
        Practical AI Engineer is a free, interactive course that takes you from beginner to working
        AI engineer: Python and engineering foundations, machine learning, how LLMs actually work,
        building LLM applications, retrieval, agents, business automation, evaluation, security, and
        production operations.
      </p>
      <p>
        It follows a few stubborn principles: <strong>build before framework</strong>,{" "}
        <strong>evals before optimization</strong>, <strong>workflow before agent</strong>, and{" "}
        <strong>human authority for consequential actions</strong>. Every lesson teaches by making
        you <em>do</em> the thing: adjust the temperature, move the threshold, step the agent loop, because that is how the concepts stick.
      </p>
      <p>
        Each module ends in a graded exam; pass all eighteen, ship a capstone, and you join the{" "}
        <Link href="/graduates">graduates board</Link> with a verifiable certificate.
      </p>
      <p>
        The curriculum is open source, and lessons link out to the best free external material
        (3Blue1Brown, Karpathy, Hugging Face, and more) for going deeper: properly attributed and
        never copied.
      </p>
    </div>
  );
}
