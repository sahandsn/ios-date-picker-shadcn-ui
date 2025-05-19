import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDebouncedCallback } from "@mantine/hooks";
import { isObject } from "lodash";

export const IosDatePickerItem = memo(function ({
  value,
  length,
  onChange,
  formatter,
  width,
}: Readonly<{
  value: number;
  length: number | { start: number; end: number };
  onChange: (value: number) => void;
  formatter?: (value: number) => string;
  width: number;
}>) {
  const [api, setApi] = useState<CarouselApi>();
  const containerRef = useRef<HTMLDivElement>(null);
  const handleOnChange = useDebouncedCallback(onChange, 150);

  const data = useMemo(
    () =>
      Array.from({
        length: isObject(length) ? length.end - length.start + 1 : length,
      }).map((_, index) =>
        isObject(length) ? index + length.start : index + 1
      ),
    [length]
  );

  const setSlideStyles = useCallback((emblaApi: CarouselApi, index: number) => {
    if (!emblaApi || !containerRef.current) return;
    const node = emblaApi.slideNodes()[index];
    const slidesInView = emblaApi.slidesInView();

    const isIndexActive =
      slidesInView.length === 2 && slidesInView.includes(0)
        ? slidesInView.at(0) === index
        : slidesInView.at(1) === index;

    if (isIndexActive) {
      node.style.transform = "scale(1.5)";
      node.style.fontWeight = "600";
      node.style.opacity = "1";
    } else {
      node.style.transform = "scale(0.75)";
      node.style.fontWeight = "400";
      node.style.opacity = "0.7";
    }
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    const snapTo = () => {
      const index = api.selectedScrollSnap();
      api.scrollTo(index);
      return index;
    };

    const onSelect = () => {
      const index = snapTo();
      const newValue = isObject(length) ? index + length.start : index + 1;
      handleOnChange(newValue);
    };

    const onSettle = () => {
      snapTo();
    };

    const snapToValue = () => {
      const index = data.findIndex((item) => item === value);
      api.scrollTo(index);
    };

    const onScroll = () => {
      api.slideNodes().forEach((_, index) => {
        setSlideStyles(api, index);
      });
    };

    api.on("init", snapToValue);
    api.on("reInit", snapToValue);
    api.on("scroll", onScroll);
    api.on("select", onSelect);
    api.on("settle", onSettle);

    return () => {
      api.off("init", snapToValue);
      api.off("reInit", snapToValue);
      api.off("scroll", onScroll);
      api.off("select", onSelect);
      api.off("settle", onSettle);
    };
  }, [api, handleOnChange, length, data, value, setSlideStyles]);

  return (
    <Carousel
      ref={containerRef}
      opts={{
        align: "center",
        dragFree: true,
        containScroll: false,
        watchSlides: true,
      }}
      orientation="vertical"
      setApi={setApi}
      data-vaul-no-drag
    >
      <CarouselContent
        className="mx-auto -mt-1 h-[200px] w-fit"
        style={{ width }}
      >
        {data.map((val) => (
          <CarouselItem
            key={val}
            className={cn(
              "flex h-fit w-full basis-1/3 items-center justify-center p-1",
              "transition duration-150"
            )}
          >
            {formatter?.(val) ?? val}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
});
IosDatePickerItem.displayName = "IosDatePickerItem";
