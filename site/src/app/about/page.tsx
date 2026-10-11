import Link from "next/link";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 prose-custom">
      <h1>About this course</h1>
      <p>
        Practical AI Engineering and Business Automation is a 16-week course for engineers and
        business owners. Learn to choose useful tasks, verify outputs, build reviewed workflows,
        evaluate agents, and hand over a working system.
      </p>
      <p>
        The October 2026 edition contains 48 lessons with worked examples, a shared fictional
        business case, and separate engineering and owner exercises. Engineers should plan 8-10
        hours per week; owners 5-7. Preparation is available for learners who need it.
      </p>
      <p>
        Dedicated weeks cover OpenClaw, Hermes Agent, and Cursor&apos;s Grok Bot. Compare the same
        task across platforms, inspect access and memory, and test how to stop and recover work.
        Official sources and their research limits are listed in the{" "}
        <Link href="/resources">resources</Link>.
      </p>
      <p>
        Each module has an open-book knowledge exam. Passing all sixteen and submitting a capstone
        self-attestation can earn a site completion certificate. The practical portfolio, platform
        comparison, capstone, and handover rubric requires a separate reviewer; it is not
        automatically graded by this site.
      </p>
      <p>
        Course materials are free. External accounts, model usage, and hosting may cost money.
        Offline exercises support learning without API credentials, and authentic recorded
        demonstrations can support learners without access to every platform.
      </p>
    </div>
  );
}
