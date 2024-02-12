# M1: Serialization / Deserialization
> Full name: `Yuanfeng Li`
> Email:  `yuanfeng_li@brown.edu`
> Username:  `yli586`

## Summary
> Summarize your implementation, including key challenges you encountered

My implementation comprises `2` software components, totaling `136` lines of code. Key challenges included:
> 1. How to retrieve all the native functions `globalThis` and avoiding the maximum call stack exceeded. I implemented a recursive function to retrieve as much functions as possible, and added a pre-defined set to avoid exceeding the limit.
> 2. How to implement serialization for the circular object.
> 3. I think function variable is relatively hard to understand. It takes me a long time to fully understand it and know its usage.

## Correctness & Performance Characterization
> Describe how you characterized the correctness and performance of your implementation

*Correcness*: I wrote `5` tests; these tests take `0.25` to execute. This includes objects with:
> 1. Build-in constructor.
> 2. Native func + Custom func.
> 3. RainbowObject + Circular.
> 4. Complex circular array.
> 5. Custom Date object.

*Performance*: Evaluating serialization and deserialization on objects of varying sizes using [high-resolution timers](https://nodejs.org/api/perf_hooks.html) results in the following table:

|               | Serialization | Deserialization |
| ------------- | ------------- | --------------- |
| 100 elems     | `7.62`      | `4.38`        |
| 1000 elems    | `44.88`      | `42.64`        |
| 10000 elems   | `413.01`      | `399.68`        |
| 100 funcs     | `3.34`      | `5.16`        |
| 1000 funcs    | `52.28`      | `44.24`        |
| 10000 funcs   | `455.89`      | `391.99`        |
| 1000 cyles    | `184.74`      | `195.39`        |
| native objects(1000)| `44.18`      | `50.77`        |

## Time to Complete
> Roughly, how many hours did this milestone take you to complete?

Hours: `<time>`

## Wild Guess
> This assignment made a few simplifying assumptions — for example, it does not attempt to support the entire language. How many lines of code do you think it would take to support other features? (If at all possible, try to justify your answer — even a rough justification about the order of magnitude and its correlation to missing features is enough.)

FLoC: `<guess a number>`

