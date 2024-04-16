import Image from "next/image";

const Hero: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="
          relative size-[300px]
          md:size-[300px]
        ">
          <Image src="/documents.png" fill alt="Documents" className="object-contain dark:hidden" />
          <Image src="/documents-dark.png" fill alt="Documents" className="object-contain hidden dark:block" />
        </div>
        <div className="relative size-[300px] hidden lg:block">
          <Image src="/reading.png" fill className="object-contain dark:hidden" alt="Reading" />
          <Image src="/reading-dark.png" fill className="object-contain hidden dark:block" alt="Reading" />
        </div>
      </div>
    </div>
  );
};

export default Hero;