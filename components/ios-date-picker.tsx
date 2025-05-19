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
