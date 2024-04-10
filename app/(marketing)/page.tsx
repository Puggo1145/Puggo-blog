import Heading from "./_components/heading";
import Heroes from "./_components/heroes";
import Footer from "./_components/footer";

export default function Home() {
  return (
    <div className="w-full min-h-full flex flex-col">
      <div className="
        m-auto max-w-[1440px] w-full
        flex flex-col md:flex-row items-center gap-12
        md:justify-start flex-1 px-4 md:px-8
      ">
        <Heading />
        <Heroes />
      </div>
        <Footer />
    </div>
  );
}