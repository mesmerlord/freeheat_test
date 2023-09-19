import Head from "next/head";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

const Seo = ({
  description,
  title,
  url,
  image,
  name,
}: {
  description?: string;
  title: string;
  url?: string;
  image?: string;
  name?: string;
}) => {
  const router = useRouter();

  const [locationUrl, siteName, siteDescription] = useMemo(() => {
    const locationUrl = url || `${router.pathname}`;
    const siteName = name ? `${name}` : "Musky Cars";
    const siteDescription =
      `${description}` || "Make your imagination come true";
    return [locationUrl, siteName, siteDescription];
  }, [router.pathname, name, description, url]);
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${siteDescription}`} />
        <meta property="og:description" content={`${siteDescription}`} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${title}`} />
        <meta property="og:site_name" content={`${siteName}`} />
        <meta property="og:image" content={`${image}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:label1" content="Est reading time" />
        <meta name="twitter:data1" content="10 minutes" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image:src" content={`${image}`} />
        <link rel="canonical" href={`${locationUrl}`} />
      </Head>
    </>
  );
};
Seo.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
  image: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default React.memo(Seo);
