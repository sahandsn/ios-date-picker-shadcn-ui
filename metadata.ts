import { Metadata } from "next";
import { OpenGraph } from "next/dist/lib/metadata/types/opengraph-types";
import { Twitter } from "next/dist/lib/metadata/types/twitter-types";
import { AppleWebApp } from "next/dist/lib/metadata/types/extra-types";

const TITLE = "IOS Date Picker shadcn/ui";

const openGraph = ({
  description,
  title,
  url,
}: {
  title: string;
  description: string;
  url: string;
}): OpenGraph => {
  return {
    type: "website",
    url: new URL(url, process.env.NEXT_PUBLIC_URL).href,
    title,
    description,
    siteName: TITLE,
  };
};

const twitter = ({
  description,
  title,
}: {
  title: string;
  description: string;
}): Twitter => {
  return {
    card: "summary",
    title,
    description,
  };
};

const appleWebApp = ({ title }: { title: string }): AppleWebApp => {
  return {
    capable: true,
    statusBarStyle: "default",
    title: title,
  };
};

export default function linkPreviewMetadata({
  keywords,
  description,
  title,
  url,
}: {
  title: string;
  description: string;
  keywords: string;
  url: string;
}): Metadata {
  return {
    openGraph: openGraph({ description, title, url }),
    twitter: twitter({ description, title }),
    appleWebApp: appleWebApp({ title }),
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL ?? ""),
    applicationName: TITLE,
    title: TITLE,
    description,
    keywords,
    alternates: {
      canonical: new URL(url, process.env.NEXT_PUBLIC_URL),
      languages: {
        en: new URL(`/en${url}`, process.env.NEXT_PUBLIC_URL),
      },
    },
  };
}
