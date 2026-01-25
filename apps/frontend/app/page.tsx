import { Hero } from "@/components/home/Hero";
import { Categories } from "@/components/home/Categories";
import { Trending } from "@/components/home/Trending";
import { ComparePreview } from "@/components/home/ComparePreview";
import { StackPreview } from "@/components/home/StackPreview";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Trending />
      <ComparePreview />
      <StackPreview />
    </>
  );
}
