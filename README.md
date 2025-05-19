# IOS Date Picker shadcn/ui

This project provides a customizable iOS-style date picker component built using [ShadCN UI](https://github.com/shadcn-ui). It aims to provide a modern, sleek, and easy-to-use date picker with the feel of iOS components.

## Showcase

[Live Preview](https://ios-date-picker-shadcn-ui.vercel.app/)

|            Mobile             |             Desktop             |
| :---------------------------: | :-----------------------------: |
| ![mobile](/public/mobile.png) | ![desktop](/public/desktop.png) |

## Features

- Fully customizable appearance and behavior
- iOS-like styling for smooth and native-like experience
- Built with [ShadCN UI](https://github.com/shadcn-ui) for consistent styling
- Localizable
- Conversion between Gregorian and Jalali dates
- Compatible with Form components
- Desktop and mobile responsive

## Dependencies

To get started, you need to install the necessary dependencies for your project.

```bash
npm install date-fns
```

## Code

```bash
"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { useCallback, useState } from "react";
import { useClickOutside } from "@mantine/hooks";
import { isObject } from "lodash";
import {
  format,
  getDate,
  getMonth,
  getYear,
  setDate,
  setMonth,
  getDaysInMonth,
} from "date-fns";
import { IosDatePickerItem } from "./ios-date-picker-item";

const ShowDate = "d MMMM yyyy";

type TIosDatePicker = {
  onChange?: (date: Date) => void;
  value?: Date;
  yearRange?: { start: number; end: number } | number;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
};

export function IosDatePicker(props: Readonly<TIosDatePicker>) {
  const {
    value,
    placeholder = "select a date",
    disabled,
    className,
    onChange,
    yearRange = 25,
  } = props;

  const [open, setOpen] = useState(false);
  const ref = useClickOutside(() => {
    onChange?.(dateVal);
    setOpen(false);
  });
  const today = new Date();
  const [daysInMonth, setDaysInMonth] = useState(31);
  const [dateVal, setDateVal] = useState(value ?? new Date());
  const [hasOpened, setHasOpened] = useState(false);
  const showValue = hasOpened ? dateVal : value;

  const handleDateChange = useCallback(
    (value: number) => {
      setDateVal((prev) => setDate(prev, value));
    },
    [setDate]
  );
  const handleMonthChange = useCallback(
    (value: number) => {
      setDateVal((prev) => {
        const baseDate = new Date(getYear(prev), value - 1, 1);
        const days = getDaysInMonth(baseDate);
        setDaysInMonth(days);
        const currentDate = getDate(prev);

        if (currentDate < days) {
          return setDate(baseDate, currentDate);
        } else {
          return setDate(baseDate, days);
        }
      });
    },
    [getYear, getDaysInMonth, getDate, setDate]
  );
  const handleYearChange = useCallback(
    (value: number) => {
      setDateVal((prev) => {
        const baseDate = new Date(value, getMonth(prev), 1);
        const days = getDaysInMonth(baseDate);
        setDaysInMonth(days);
        const currentDate = getDate(prev);

        if (currentDate < days) {
          return setDate(baseDate, currentDate);
        } else {
          return setDate(baseDate, days);
        }
      });
    },
    [getMonth, getDaysInMonth, getDate, setDate]
  );

  return (
    <Drawer
      dismissible={false}
      open={open}
      onOpenChange={() => {
        setHasOpened(true);
      }}
    >
      <DrawerTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          variant="outline"
          className={cn(
            "w-full items-center justify-start gap-2 text-left font-normal hover:disabled:bg-transparent",
            {
              "text-muted-foreground": !showValue,
            },
            className
          )}
          disabled={disabled}
        >
          <Calendar size={16} />
          {showValue ? format(showValue, ShowDate) : placeholder}
        </Button>
      </DrawerTrigger>
      <DrawerContent ref={ref}>
        <DrawerHeader>
          <DrawerTitle>Select a Date</DrawerTitle>
          <DrawerDescription>Drag over wheels to select.</DrawerDescription>
        </DrawerHeader>
        <section className="sm:mx-auto sm:w-[400px]">
          <section className="relative flex justify-around">
            <div className="absolute top-1/2 h-[65px] w-full -translate-y-1/2 rounded-md border border-border bg-sidebar" />

            <IosDatePickerItem
              value={getDate(dateVal)}
              length={daysInMonth}
              onChange={handleDateChange}
              width={100}
            />
            <IosDatePickerItem
              value={getMonth(dateVal) + 1}
              onChange={handleMonthChange}
              length={12}
              formatter={(value) => {
                const date = setMonth(dateVal, value - 1);
                return format(date, "MMMM");
              }}
              width={150}
            />
            <IosDatePickerItem
              value={getYear(dateVal)}
              onChange={handleYearChange}
              length={
                isObject(yearRange)
                  ? {
                      start: yearRange.start,
                      end: yearRange.end,
                    }
                  : {
                      start: getYear(today) - yearRange,
                      end: getYear(today),
                    }
              }
              width={100}
            />
          </section>
          <DrawerFooter>
            <DrawerClose>
              <Button
                onClick={() => {
                  onChange?.(dateVal);
                  setOpen(false);
                }}
                className="w-full"
              >
                Confirm
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </section>
      </DrawerContent>
    </Drawer>
  );
}

"use client";

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
```
