import { Schema } from 'mongoose'
import IDate, { DateSchema } from '../../types/IDate'
import ITimestamp from '../../types/ITimestamp'
import { ACTIVE } from '../../configs/constants'

const TimestampsPlugin = <T extends ITimestamp, M>(scm: Schema<T, M>): Schema<T, M> => {
  scm.path('status', {
    type: Number,
    default: ACTIVE,
  })

  scm.path('createdAt', {
    type: DateSchema,
    default: () => new Date(),
    set: (d: Date | IDate) => {
      if (d instanceof Date)
        return {
          timeString: d.toLocaleTimeString(),
          dateString: d.toLocaleDateString(),
          time: d.getTime(),
          date: d,
        }
      else if (typeof d === 'string') {
        const _d = new Date(d)
        return {
          timeString: _d.toLocaleTimeString(),
          dateString: _d.toLocaleDateString(),
          time: _d.getTime(),
          date: _d,
        }
      } else {
        return d
      }
    },
  })

  scm.path('updatedAt', {
    type: DateSchema,
    set: (d: Date | IDate) => {
      if (d instanceof Date)
        return {
          timeString: d.toLocaleTimeString(),
          dateString: d.toLocaleDateString(),
          time: d.getTime(),
          date: d,
        }
      else if (typeof d === 'string') {
        const _d = new Date(d)
        return {
          timeString: _d.toLocaleTimeString(),
          dateString: _d.toLocaleDateString(),
          time: _d.getTime(),
          date: _d,
        }
      } else {
        return d
      }
    },
  })

  scm.pre<T>(['findOneAndUpdate', 'update'], function (next) {
    const d = new Date()
    this.set({
      updatedAt: {
        timeString: d.toLocaleTimeString(),
        dateString: d.toLocaleDateString(),
        time: d.getTime(),
        date: d,
      },
    })
    next()
  })

  return scm
}

export default TimestampsPlugin