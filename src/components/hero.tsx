import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeroProps {
  heading?: string;
  subheading?: string;
  description?: string;
  image?: {
    src: string;
    alt: string;
  };
  buttons?: {
    primary?: {
      text: string;
      url: string;
    };
    secondary?: {
      text: string;
      url: string;
    };
  };
}

const Hero = ({
  heading = "Finura",
  subheading = " Personal Finance Visualizer",
  description = "Welcome to Finura — your personal finance companion that brings peace, purpose, and power to your money habits.",
  buttons = {
    primary: {
      text: "Get Started",
      url: "/dashboard/add",
    }
  },
}: HeroProps) => {
  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4 flex flex-col items-center gap-10 lg:flex-row lg:justify-center">
        <div className="flex flex-col gap-7 lg:w-2/3 text-center lg:text-left">
          <h2 className="text-5xl font-semibold text-foreground md:text-5xl lg:text-8xl">
            <span>{heading}</span>
            <span className="text-muted-foreground">{subheading}</span>
          </h2>
          <p className="text-base text-muted-foreground md:text-lg lg:text-xl">
            {description}
          </p>
          <div className="flex flex-wrap items-start gap-5 lg:gap-7 justify-center lg:justify-start">
            <Button asChild>
              <a href={buttons.primary?.url}>
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="size-4" />
                </div>
                <span className="pr-6 pl-4 text-sm whitespace-nowrap lg:pr-8 lg:pl-6 lg:text-base">
                  {buttons.primary?.text}
                </span>
              </a>
            </Button>
            <Button asChild variant="link" className="underline">
              <a href={buttons.secondary?.url}>{buttons.secondary?.text}</a>
            </Button>
          </div>
        </div>
        <div className="relative z-10 flex justify-center lg:justify-end lg:w-1/3">
          <div className="absolute top-2.5 left-1/2! h-[92%]! w-[69%]! -translate-x-[52%] overflow-hidden rounded-[35px]">
          </div>
          <Image
            className="relative z-10"
            src="/mockup-left.png"
            width={450}
            height={889}
            alt="iphone"
          />
        </div>
      </div>
    </section>
  );
};

export { Hero };
