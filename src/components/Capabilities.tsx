const CAPABILITIES = [
  { title: "Software & APIs", detail: "Python, C#, Java, C++, TypeScript, SQL · React, Next.js, TanStack · FastAPI, Node.js, Express, REST APIs, WebSockets" },
  { title: "Data & cloud", detail: "PostgreSQL, Supabase, SQLite, Firebase/Firestore · Docker, Docker Compose, GitHub Actions, CI/CD, Vercel, AWS S3/EC2, Linux" },
  { title: "Hardware & robotics", detail: "KiCad schematics, PCB layout, Gerber exports · Arduino, ESP32/ESP32-C3, BLE, Wi-Fi, MQTT · Mission control, A* planning, watchdogs" },
  { title: "Design, mobile & edge AI", detail: "Autodesk Fusion, STEP, FEA · TensorFlow.js, MobileNet, Web-LLM, ONNX · React Native/Expo, Health Connect, Android, Capacitor" },
  { title: "Machine learning & NLP", detail: "scikit-learn, XGBoost, LightGBM, NumPy, Pandas · spaCy, NetworkX · Groq/Gemini integration, speech recognition, Web Audio" },
  { title: "Bioinformatics & laboratory", detail: "SRA Toolkit, FastQC, MultiQC, BWA, SAMtools, GATK, SnpEff/SnpSift · OECD QSAR Toolbox · Microscopy, Gram staining, aseptic technique · Reproducible analysis" },
];

export default function Capabilities() {
  return (
    <section aria-labelledby="capabilities-title" className="relative mx-auto max-w-[90rem] px-6 py-16 lg:px-16 lg:py-24">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-cyan-200/15 pb-6">
        <div>
          <p className="mb-3 font-mono text-xs tracking-[0.2em] text-cyan-200/75 uppercase">Tools I build with</p>
          <h2 id="capabilities-title" className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">Across the stack</h2>
        </div>
        <a href="https://www.resume.adilsukumar.xyz" className="rounded-full border border-white/20 px-5 py-3 text-sm text-cyan-200 transition-colors hover:border-cyan-200 focus-visible:outline-2 focus-visible:outline-cyan-200">Explore my resumes ↗</a>
      </div>
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
        {CAPABILITIES.map((item) => (
          <div key={item.title} className="border-l border-cyan-200/25 pl-5">
            <h3 className="mb-3 text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-sm leading-7 text-slate-300">{item.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
