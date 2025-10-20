"use client";
import * as React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useInView } from "@/hooks/useInView"

let emblaHookCache = null
let emblaHookPromise = null

function loadEmblaHook() {
  if (emblaHookCache) {
    return Promise.resolve(emblaHookCache)
  }

  if (!emblaHookPromise) {
    emblaHookPromise = import("embla-carousel-react").then((module) => {
      emblaHookCache = module.default
      return emblaHookCache
    })
  }

  return emblaHookPromise
}

const CarouselContext = React.createContext(null)

function useCarousel() {
  const context = React.useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

function createCarouselComponent(useEmblaCarousel) {
  return function CarouselWithEmbla({
    orientation = "horizontal",
    opts,
    setApi,
    plugins,
    className,
    children,
    observerRef,
    ...props
  }) {
    const [carouselRef, api] = useEmblaCarousel({
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    }, plugins)
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback((emblaApi) => {
      if (!emblaApi) return
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }, [])

    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    const handleKeyDown = React.useCallback((event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault()
        scrollPrev()
      } else if (event.key === "ArrowRight") {
        event.preventDefault()
        scrollNext()
      }
    }, [scrollPrev, scrollNext])

    React.useEffect(() => {
      if (!api || !setApi) return
      setApi(api)
    }, [api, setApi])

    React.useEffect(() => {
      if (!api) return
      onSelect(api)
      api.on("reInit", onSelect)
      api.on("select", onSelect)

      return () => {
        api.off("select", onSelect)
        api.off("reInit", onSelect)
      }
    }, [api, onSelect])

    return (
      <CarouselContext.Provider
        value={{
          carouselRef,
          api,
          opts,
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}>
        <div
          ref={observerRef}
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          role="region"
          aria-roledescription="carousel"
          data-slot="carousel"
          {...props}>
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  fallback,
  ...props
}) {
  const { ref, isInView } = useInView({ rootMargin: "0px 0px 160px 0px" })
  const [CarouselImpl, setCarouselImpl] = React.useState(() =>
    emblaHookCache ? createCarouselComponent(emblaHookCache) : null
  )

  React.useEffect(() => {
    if (CarouselImpl || !isInView) {
      return
    }

    let active = true

    loadEmblaHook().then((hook) => {
      if (!active) {
        return
      }

      setCarouselImpl(() => createCarouselComponent(hook))
    })

    return () => {
      active = false
    }
  }, [CarouselImpl, isInView])

  if (!CarouselImpl) {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-neutral-gray-200 bg-neutral-light/40 text-sm text-neutral-gray-500",
          className
        )}
        role="region"
        aria-roledescription="carousel"
        aria-live="polite"
        aria-busy="true"
        data-slot="carousel"
        {...props}>
        {typeof fallback === "function"
          ? fallback()
          : fallback ?? "Carousel wordt geladen…"}
      </div>
    )
  }

  return (
    <CarouselImpl
      orientation={orientation}
      opts={opts}
      setApi={setApi}
      plugins={plugins}
      className={className}
      observerRef={ref}
      {...props}>
      {children}
    </CarouselImpl>
  )
}

function CarouselContent({
  className,
  ...props
}) {
  const { carouselRef, orientation } = useCarousel()

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content">
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props} />
    </div>
  );
}

function CarouselItem({
  className,
  ...props
}) {
  const { orientation } = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props} />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  ...props
}) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn("absolute size-8 rounded-full", orientation === "horizontal"
        ? "top-1/2 -left-12 -translate-y-1/2"
        : "-top-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}>
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  ...props
}) {
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn("absolute size-8 rounded-full", orientation === "horizontal"
        ? "top-1/2 -right-12 -translate-y-1/2"
        : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90", className)}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}>
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
