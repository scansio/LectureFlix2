"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
const common_1 = require("../../common");
const TimeSpan_1 = __importDefault(require("./TimeSpan"));
class TimeSpanSubscribe {
    singleCycle = 1;
    initialCurrentCycle = 0;
    timeSpanSubscription = {
        [TimeSpan_1.default.MINUTE]: [],
        [TimeSpan_1.default.HOUR]: [],
        [TimeSpan_1.default.DAY]: [],
        [TimeSpan_1.default.MONTH]: [],
        [TimeSpan_1.default.YEAR]: [],
    };
    addToMinuteJobs(job, span = this.singleCycle) {
        this.addJob({ job, span, type: TimeSpan_1.default.MINUTE });
    }
    addToHourlyJobs(job) {
        this.addJob({ job, span: this.singleCycle, type: TimeSpan_1.default.HOUR });
    }
    addToHourJobs(job, span) {
        this.addJob({ job, span, type: TimeSpan_1.default.HOUR });
    }
    addToDaysJobs(job, span) {
        this.addJob({ job, span, type: TimeSpan_1.default.DAY });
    }
    addToMonthJobs(job, span) {
        this.addJob({ job, span, type: TimeSpan_1.default.MONTH });
    }
    addToMonthlyJobs(job) {
        this.addJob({ job, span: this.singleCycle, type: TimeSpan_1.default.MONTH });
    }
    addToDailyJobs(job) {
        this.addJob({ job, span: this.singleCycle, type: TimeSpan_1.default.DAY });
    }
    addToYearJobs(job, span) {
        this.addJob({ job, span, type: TimeSpan_1.default.YEAR });
    }
    addToYearlyJobs(job) {
        this.addJob({ job, span: this.singleCycle, type: TimeSpan_1.default.YEAR });
    }
    addJob({ job, span = this.singleCycle, type = TimeSpan_1.default.MINUTE, }) {
        switch (type) {
            case TimeSpan_1.default.MINUTE:
            case TimeSpan_1.default.HOUR:
            case TimeSpan_1.default.DAY:
            case TimeSpan_1.default.MONTH:
            case TimeSpan_1.default.YEAR:
                this.timeSpanSubscription[type].push({
                    cycleAble: span > this.singleCycle,
                    cycle: span,
                    currentCycle: this.initialCurrentCycle,
                    job,
                });
                break;
            default:
                break;
        }
    }
    runDueJobs() {
        for (const timeSpan in this.timeSpanSubscription) {
            const timeSpanSubscribers = this.timeSpanSubscription[timeSpan];
            switch (parseInt(timeSpan)) {
                case TimeSpan_1.default.MINUTE:
                    for (const subscriber of timeSpanSubscribers) {
                        this.setSubscriberCycleOrRun(subscriber);
                    }
                    break;
                case TimeSpan_1.default.HOUR:
                    const hourly = (0, common_1.isCurrentMinuteStartOfHour)();
                    if (hourly) {
                        for (const subscriber of timeSpanSubscribers) {
                            this.setSubscriberCycleOrRun(subscriber);
                        }
                    }
                    break;
                case TimeSpan_1.default.DAY:
                    const daily = (0, common_1.isCurrentHourWithinStartOfTheDay)();
                    if (daily) {
                        for (const subscriber of timeSpanSubscribers) {
                            this.setSubscriberCycleOrRun(subscriber);
                        }
                    }
                    break;
                case TimeSpan_1.default.MONTH:
                    const monthly = (0, common_1.didMonthStartedToday)();
                    if (monthly) {
                        for (const subscriber of timeSpanSubscribers) {
                            this.setSubscriberCycleOrRun(subscriber);
                        }
                    }
                    break;
                case TimeSpan_1.default.YEAR:
                    const yearly = (0, common_1.isTodayFirstDayOfTheYear)();
                    if (yearly) {
                        for (const subscriber of timeSpanSubscribers) {
                            this.setSubscriberCycleOrRun(subscriber);
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
    setSubscriberCycleOrRun(subscriber) {
        if (subscriber.cycleAble) {
            if (subscriber.cycle - 1 == subscriber.currentCycle) {
                subscriber.currentCycle = 0;
            }
            else {
                subscriber.currentCycle++;
                return; //Prevents job execution until cycle completion
            }
        }
        const job = new subscriber.job();
        job.run();
    }
}
exports.default = TimeSpanSubscribe;
