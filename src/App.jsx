import { useMemo, useState } from "react";
import "./App.css";

// Jeśli masz logo jako plik, wrzuć je np. do: src/assets/logo.png
// i podmień ścieżkę poniżej:
const logoSrc = import.meta.env.BASE_URL + "logo.png"; // na razie placeholder (public/logo.png)

const LOGO_TEXT = "Angry Hedgehogs Academy";

// ---- DATA (edit this) ----
const MAPS = [
  {
    id: "train",
    name: "Train",
    categories: {
      smoke: [
        { title: "Smoke na brame i ivy", note: "Jumpthrow pomiędzy dolną linie pradową a tą linie na platformie dźwigu", url: "https://youtu.be/x4YNK951fS0" },
        { title: "Smoke na brame na A", note: "Wcelowujemy z odrapanego palika na czubek puszek i jumpthrow", url: "https://youtu.be/2ITr4dsfXlU" },
        { title: "Smoke odcinający bs A i Ske", note: "Wcelowujemy się tak aby znacznik -2 był na zaczepie od rynny i jumpthrow", url: "https://youtu.be/senPebjDI3w" },
        { title: "Smoke na Ske", note: "Wcelowujemy z odrapanego palika na przesteń pamiędzy 1 a 2 deseczke podtrzymująca daszek i jumpthrow", url: "https://youtu.be/w8g4YIqCXzA" },
        { title: "Smoke na Ske", note: "Z 1 palika wcelowujemy się w wystający dolny róg daszku i jumpthrow", url: "https://youtu.be/Q1OTjwlEOIE" },
        { title: "Smoke na Popdog", note: "Wcelowujemy na środek dolnej białej lini pomiędzy liniami prądowymi i jumpthrow", url: "https://youtu.be/UeTptmsdxqw" },
        { title: "Smoke na Ske na B", note: "Jumpthrow", url: "https://youtu.be/b4F7TiJgWhI" },
        { title: "Smoke na olejowy", note: "Rzucamy na kucaka z samego kąta", url: "https://youtu.be/rNy8xNCHnS0" },
        { title: "Smoke pomiędzy stoper pociągów", note: "Szukamy pierwszej połamanej deski od prawej, wcelowujemy w lewą górną krawędź lampu i rzut", url: "https://youtu.be/cr9V9MdpHVM" },
      ],
      molotov: [
        { title: "Molo na Ske na B", note: "Blokujemy się o belkę, wcelowujemy w prawą krawędź lampy, następnie nad nią na górną belkę i rzucamy w biegu", url: "https://youtu.be/I5RcYVckgmg" },
        { title: "Molo na catwalk B", note: "Musimy wcelować w element na którym wisi lampa za catwalkiem, rzucamy w biegu będąc jak najbliżej lewej ściany", url: "https://youtu.be/nZKteCEgW50" },
        { title: "Molo za site i do rogu A", note: "Rzucamy w biegu, nad żółtą linia trochę w lewo od rogu", url: "https://youtu.be/yABxynLIOiM" },
      ],
      flash: [
        { title: "Popflash na A", note: "Wcelowujemy w głowę chłopka na znaku, potem na skrzynkę - prawy górny rów i rzucamy Jumpthrow + W", url: "https://youtu.be/IxG_yP0PoAw" },
      ],
    },
  },
];

function toYouTubeEmbed(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host === "youtube.com" && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (host === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
  } catch {
    // ignore
  }
  return null;
}

function VideoItem({ video }) {
  const embed = toYouTubeEmbed(video.url);

  return (
    <article className="videoItem">
      <div className="videoMeta">
        <h4 className="videoTitle">{video.title}</h4>
        {video.note ? <p className="videoNote">{video.note}</p> : null}
        <a className="videoLink" href={video.url} target="_blank" rel="noreferrer">
          Otwórz na YouTube
        </a>
      </div>

      {embed ? (
        <div className="videoFrameWrap">
          <iframe
            src={embed}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
    </article>
  );
}

function CategorySection({ map, categoryKey, title }) {
  const items = map.categories?.[categoryKey] ?? [];

  return (
    <section className="categorySection" id={`${map.id}-${categoryKey}`}>
      <h3 className="categoryTitle">{title}</h3>

      {items.length === 0 ? (
        <div className="empty">Brak materiałów w tej sekcji.</div>
      ) : (
        <div className="videoList">
          {items.map((v, idx) => (
            <VideoItem key={`${map.id}-${categoryKey}-${idx}`} video={v} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [activeMapId, setActiveMapId] = useState(MAPS[0]?.id ?? null);
  const activeMap = useMemo(() => MAPS.find((m) => m.id === activeMapId) ?? MAPS[0], [activeMapId]);

  const categoryButtons = useMemo(() => {
    if (!activeMap) return [];
    return [
      { key: "smoke", label: `Smoke (${activeMap.categories.smoke.length})` },
      { key: "molotov", label: `Molotov (${activeMap.categories.molotov.length})` },
      { key: "flash", label: `Flash (${activeMap.categories.flash.length})` },
    ];
  }, [activeMap]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="page">
      <header className="headerCentered">
        <div className="logoBlock">
          {/* Logo (jeśli nie masz jeszcze pliku, usuń <img> i zostaw sam tekst) */}
          <img className="logoImg" src={logoSrc} alt={LOGO_TEXT} />
          <div className="logoText">{LOGO_TEXT}</div>
          <div className="subtitle">Akademia granatów CS2 • Lineupy per mapa</div>
        </div>

        <nav className="mapsNav" aria-label="Wybór mapy">
          {MAPS.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`mapBtn ${m.id === activeMapId ? "mapBtnActive" : ""}`}
              onClick={() => setActiveMapId(m.id)}
            >
              {m.name}
            </button>
          ))}
        </nav>

        {activeMap ? (
          <nav className="categoryNav" aria-label="Kategorie">
            {categoryButtons.map((c) => (
              <button
                key={c.key}
                type="button"
                className="catBtn"
                onClick={() => scrollTo(`${activeMap.id}-${c.key}`)}
              >
                {c.label}
              </button>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="contentCentered">
        {activeMap ? (
          <div className="mapContent">
            <h2 className="mapTitle">{activeMap.name}</h2>

            <CategorySection map={activeMap} categoryKey="smoke" title="Smoke" />
            <CategorySection map={activeMap} categoryKey="molotov" title="Molotov" />
            <CategorySection map={activeMap} categoryKey="flash" title="Flash" />
          </div>
        ) : (
          <div className="empty">Brak map.</div>
        )}
      </main>

      <footer className="footerCentered">
        © {new Date().getFullYear()} {LOGO_TEXT}
      </footer>
    </div>
  );
}
