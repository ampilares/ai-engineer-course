export const metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 prose-custom">
      <h1>Privacy</h1>
      <p>This course is free and collects the minimum needed to run it.</p>
      <h2>What we store</h2>
      <ul>
        <li><strong>Name and email</strong>, to sign you in (via one-time email links; no passwords) and to name you on your certificate.</li>
        <li><strong>Progress and exam scores</strong>, so the course works and your grade can be computed.</li>
        <li><strong>Capstone attestation</strong>: the project title, summary, and optional link you submit.</li>
      </ul>
      <h2>What we don&apos;t do</h2>
      <ul>
        <li>No ads, no trackers, no analytics cookies, no selling or sharing of data.</li>
        <li>Your email is never displayed publicly or sent to third parties.</li>
        <li>Embedded videos load only after you press play, so video platforms see nothing until you opt in.</li>
      </ul>
      <h2>Public listing is opt-in</h2>
      <p>
        Your name appears on the graduates page only if you enable it, and you can switch it off (or
        show/hide your exact score) at any time in your profile.
      </p>
      <h2>Deletion</h2>
      <p>
        Delete your account from your profile page at any time. This permanently removes your
        account, progress, scores, and any public listing.
      </p>
      <h2>Contact</h2>
      <p>Questions: amp@rethink-tech.com</p>
    </div>
  );
}
