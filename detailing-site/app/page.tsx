export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative isolate overflow-hidden bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-600 ring-1 ring-inset ring-sky-200">
              Tailwind CSS Enabled
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
              Detailing Site Baseline
            </h1>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Kickstart your car detailing experience with Next.js 14, Tailwind CSS, and SEO-ready defaults.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <a
                href="#"
                className="rounded-md bg-sky-600 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                Explore Services
              </a>
              <a href="#" className="text-base font-semibold leading-6 text-slate-900">
                View Gallery <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
