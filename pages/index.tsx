import Head from "next/head";
import Header from "components/Header";
import Footer from "components/Footer";
import Link from "next/link";
import { token } from "utils/token";

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Header title="Welcome to my app!" />
        <ul>
          <li>
            <Link href={`/game/${token()}`}>
              <a>new game</a>
            </Link>
          </li>
          <li>
            <Link href={"/games"}>
              <a>past games</a>
            </Link>
          </li>
        </ul>
      </main>
      <Footer />
    </div>
  );
}
