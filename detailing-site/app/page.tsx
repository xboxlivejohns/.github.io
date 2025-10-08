export default function Home() {
  return (
    <main className="min-h-screen bg-paper">
      <section className="section-pad relative isolate overflow-hidden bg-paper">
        <div className="container-narrow">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand ring-1 ring-inset ring-brand/20">
              Tailwind CSS Enabled
            </span>
            <h1 className="mt-6 font-bold">
              Detailing Site Baseline
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted">
              Kickstart your car detailing experience with Next.js 14, Tailwind CSS, and SEO-ready defaults.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-brand px-5 py-3 text-base font-semibold text-paper shadow-sm transition hover:bg-brand/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                Explore Services
              </a>
              <a href="#" className="text-base font-semibold leading-6 text-brand">
                View Gallery <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
