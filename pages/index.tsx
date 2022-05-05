import Head from "next/head";
import Header from "components/Header";
import Footer from "components/Footer";
import Link from "next/link";
import { token } from "utils/token";
import { t } from "utils/text";
import { resetData } from "utils/storage";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>{t["appName"]}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header title={t["molkky"]} />
        <h3>{t["scoreApp"]}</h3>
        <ul>
          <li>
            <Link href={`/game/${token()}`}>
              <a>{t["addNewGame"]}</a>
            </Link>
          </li>
          <li>
            <Link href={"/games"}>
              <a>{t["pastGames"]}</a>
            </Link>
          </li>
        </ul>
        <button
          onClick={() => {
            if (window.confirm(t["removeAllIfConfirm"])) {
              resetData();
            }
          }}
        >
          {t["removeData"]}
        </button>
      </main>
      <Footer />
    </div>
  );
}
