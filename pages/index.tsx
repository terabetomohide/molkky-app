import Head from "next/head";
import Header from "components/Header";
import Footer from "components/Footer";
import { useRouter } from "next/router";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const router = useRouter();

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
            <Link href={`/game/${uuidv4()}`}>
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
