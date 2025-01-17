import { sanitize } from "isomorphic-dompurify";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BiLeftArrowAlt } from "react-icons/bi";
import { ButtonTop } from "../../src/components/ButtonTop";
import styles from "./posts.module.scss";

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updated: string;
  };
}

export default function Post({ data }: any) {
  const [pageYPosition, setPageYPosition] = useState(0);

  function getPageYAfterScroll() {
    setPageYPosition(window.scrollY);
  }

  
  useEffect(() => {
    window.addEventListener("scroll", getPageYAfterScroll);
  }, []);

  return (
    <>
      <Head>
        <title>{data.title?.rendered} | Apiki</title>
      </Head>

      <div className={styles.back}>
        <Link href="/posts">
          <a>
            <BiLeftArrowAlt size="2rem" />
          </a>
        </Link>
      </div>

      <main className={styles.container}>
        <article className={styles.post}>
          <img
            src={data.yoast_head_json.og_image?.map(
              (ulrImg: { url: any }) => ulrImg.url
            )}
            alt={data.title.rendered}
            key={data.id}
          />
          <h1>{data.title?.rendered}</h1>
          <time>
            {new Date(data.modified_gmt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </time>
          <p
            dangerouslySetInnerHTML={{
              __html: sanitize(data.content.rendered),
            }}
            className={styles.postContainer}
          ></p>
        </article>
      </main>
      {pageYPosition > 900 && <ButtonTop />}
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug;

  const [data] = await fetch(
    `https://blog.apiki.com/wp-json/wp/v2/posts?slug=${slug}`
  ).then((res) => res.json());

  return {
    props: {
      data,
    },
  };
};
