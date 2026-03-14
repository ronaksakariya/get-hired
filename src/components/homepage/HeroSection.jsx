import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { companies } from "@/data/const";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const HeroSection = () => {
  return (
    <div>
      <section className="flex items-center justify-center px-4 sm:px-6 pt-16 sm:pt-12 pb-8 sm:pb-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="flex flex-col items-center justify-center gradient-title font-extrabold text-4xl sm:text-6xl lg:text-8xl text-white tracking-tighter py-4">
            Find Your Dream Job
            <span className="flex items-center gap-2 sm:gap-6">
              and get
              <img
                src="/logo.png"
                className="h-14 sm:h-24 lg:h-32"
                alt="Hirrd Logo"
              />
            </span>
          </h1>

          <p className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Explore thousands of job listings or find the perfect candidate
          </p>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/jobs">
              <Button
                size="lg"
                className="w-52 sm:w-auto px-6 py-8 text-base sm:text-lg font-semibold cursor-pointer bg-blue-600"
              >
                Find Jobs
              </Button>
            </Link>
            <Link to="/post-job">
              <Button
                size="lg"
                className="w-52 sm:w-auto px-6 py-8 text-base sm:text-lg font-semibold  text-white cursor-pointer bg-red-700"
              >
                Post a job
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden pb-10 sm:pb-16 pt-10 sm:pt-20">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: false,
              stopOnMouseEnter: false,
            }),
          ]}
          className="w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          }}
        >
          <CarouselContent className="flex items-center">
            {[...companies, ...companies].map((company, index) => (
              <CarouselItem
                key={index}
                className="basis-auto pl-12 sm:pl-16 md:pl-20"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-8 sm:h-10 md:h-12 w-auto object-contain opacity-70 hover:opacity-100 transition-all duration-300"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </div>
  );
};

export default HeroSection;
