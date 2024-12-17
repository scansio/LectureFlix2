/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterQuery, Model, PopulateOptions, ProjectionType, Query, QueryOptions, SortOrder } from 'mongoose'
import { NORMAL_RETURNED_RESULT_SET, RESULT_SET_MAX } from '../configs/constants'
import BaseController from '../controllers/base/BaseController'
import {
  decodeQuery,
  encodeQuery,
  escapeRegExp,
  getCurrentUrlWithoutQueryParams,
  getDayRegex,
  sumField,
} from '../common'
import { Schema } from 'mongoose'
import SharedConfig from '../libs/SharedConfig'
import IPaginating from '../types/IPaginating'
import IPaginatingMetadata from '../types/IPaginatingMetadata'

class PaginatingModel<T> {
  private model: Model<T>
  private schema: Schema<T>
  private query: Query<any, any>
  private controller: BaseController
  private parsedClientQuery: { [key: string]: any }
  private isPublic: boolean
  private countOnly: boolean
  private sumField: string

  constructor(clazz: Model<T>, controller: BaseController) {
    this.model = clazz
    this.schema = this.model.schema
    this.controller = controller
    this.isPublic = false
    this.countOnly = false
    this.sumField = ''
    const { q } = this.controller.req.query
    this.parsedClientQuery = !q ? {} : this.parsedQueryOptions(q as string)
    this.query = this.model.find()
  }

  count(): this
  count(filter: FilterQuery<T>): this
  count(filter?: unknown): any {
    if (filter) {
      this.query.count(filter)
    } else {
      this.query.count()
    }
    return this
  }

  countDocuments(): this
  countDocuments(filter: FilterQuery<T>, options?: QueryOptions<T> | undefined): this
  countDocuments(filter?: unknown, options?: unknown): any {
    if (filter) {
      this.query.countDocuments(filter, options as any)
    } else {
      this.query.countDocuments()
    }
    return this
  }

  populate(path: string | undefined): this
  populate(doc: any, options: string | PopulateOptions | PopulateOptions[]): Promise<any>
  populate(docs: any[], options: string | PopulateOptions | PopulateOptions[]): Promise<any[]>
  populate(docs: unknown | string, options?: unknown) {
    if (!docs) {
      return this
    }
    if (Array.isArray(docs)) {
      return this.model.populate(docs, options as any)
    } else if (docs && options) {
      return this.model.populate(docs, options as any)
    } else if (typeof docs === 'string') {
      this.query.populate(docs as string)
      return this
    }
  }

  find(): this
  find(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T> | null | undefined,
    options?: QueryOptions<T> | null | undefined,
  ): this
  find(filter?: unknown, projection?: unknown, options?: unknown): any {
    if (filter) {
      this.model.find(filter, projection as any, options as any)
    } else {
      this.model.find()
    }
    return this
  }

  sort(
    arg?: string | { [key: string]: SortOrder | { $meta: 'textScore' } } | [string, SortOrder][] | undefined | null,
  ): this {
    this.query.sort(arg)
    return this
  }

  where(obj: any): this
  where(path: string, val: any): this
  where(path: unknown, val?: unknown): any {
    if (!path) return
    if (path && val) {
      this.query.where(path as string, val)
    } else {
      this.model.where(path as any)
    }
    return this
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  $where(argument: string | Function) {
    this.query.$where(argument)
    return this
  }

  distinct(field: string, filter?: FilterQuery<T> | undefined) {
    this.query.distinct(field, filter)
    return this
  }

  estimatedDocumentCount(options?: QueryOptions<T> | undefined) {
    this.model.estimatedDocumentCount(options)
    return this
  }
  exists(filter: FilterQuery<T>) {
    this.model.exists(filter)
    return this
  }

  private parsedQueryOptions(): string
  private parsedQueryOptions(query: string): { [key: string]: any }
  private parsedQueryOptions(query: { [key: string]: any }): string
  private parsedQueryOptions(query?: { [key: string]: any } | string) {
    if (!query) {
      return this.parsedQueryOptions(this.parsedClientQuery)
    } else if (typeof query == 'string') {
      return decodeQuery(query)
    } else {
      return encodeQuery(query)
    }
  }

  public makePublic(yes: boolean) {
    this.isPublic = yes
    return this
  }

  public setCountOnly(yes: boolean) {
    this.countOnly = yes
    return this
  }

  public setSumField(field: string) {
    this.sumField = field
    return this
  }

  private async setClientQueryOptions() {
    const DBQuery = { ...this.parsedClientQuery }
    if (!this.isPublic) {
      if (DBQuery.uid) {
        await this.controller.ownerAndAdminAccess(DBQuery.uid)
      } else {
        await this.controller.adminAccess()
      }
    }
    for (const pathName in DBQuery) {
      const pathValue = DBQuery[pathName]
      if (pathValue instanceof Object && !Array.isArray(pathValue)) {
        if (pathName == '$sort') {
          this.query.sort(pathValue)
          delete DBQuery[pathName]
        } else if (pathName == '$in') {
          const $inKeys = Object.keys(pathValue)
          for (const $inKey of $inKeys) {
            this.query.find({ [$inKey]: { $in: pathValue[$inKey] } })
          }
          delete DBQuery[pathName]
        } else if (pathName == '$nin') {
          const $ninKeys = Object.keys(pathValue)
          for (const $ninKey of $ninKeys) {
            this.query.find({ [$ninKey]: { $nin: pathValue[$ninKey] } })
          }
          delete DBQuery[pathName]
        } else if (!(pathValue.$gt || pathValue.$gte || pathValue.$lt || pathValue.$lte)) {
          delete DBQuery[pathName]
        }
      } else if (pathName == 'createdAt' || pathName == 'updatedAt') {
        delete DBQuery[pathName]

        DBQuery[pathName + '.dateString'] = {
          $regex: new RegExp(pathValue === 'today' ? getDayRegex() : getDayRegex(pathValue)),
        }
      } else if (pathName === 'populate') {
        if (Array.isArray(pathValue)) {
          pathValue.forEach((path) => {
            if (typeof path == 'string') {
              this.query.populate(path)
            } else {
              const sortName = Object.keys(path.options.sort)[0]
              const sortOrder = Object.values(path.options.sort)[0]
              this.query.populate(path.path).sort({ [`${path.path}.${sortName}`]: sortOrder } as any)
            }
          })
        } else if (typeof pathValue === 'string') {
          this.query.populate(pathValue)
        }
        delete DBQuery[pathName]
      } else {
        if (typeof pathValue === 'string' && (!Number.parseInt(pathValue) || !Number.parseFloat(pathValue))) {
          /* if (pathValue.trim() == "") {
            delete DBQuery[pathName];
          } else { */
          if (this.schema.path(pathName).instance == 'String') {
            const or = pathValue.split('|')
            or.forEach((val) => {
              if (DBQuery.$or) {
                DBQuery.$or.push({
                  [pathName]: {
                    $regex: new RegExp(`.*${escapeRegExp(val)}.*`, 'gi'),
                  },
                })
              } else {
                DBQuery.$or = [
                  {
                    [pathName]: {
                      $regex: new RegExp(`.*${escapeRegExp(val)}.*`, 'gi'),
                    },
                  },
                ]
              }
            })
            delete DBQuery[pathName]
          }
          // }
        }
      }
    }
    if (DBQuery) {
      this.query.find(DBQuery)
    }
  }

  async exec(): Promise<IPaginating<T> | number> {
    await this.setClientQueryOptions()
    if (this.sumField) {
      const results = await this.query.clone().exec()
      const sum = sumField(results, this.sumField)
      return sum
    }
    const totalResults = await this.query.clone().count().exec()
    if (this.countOnly) {
      return totalResults
    }
    const { page, size } = this.controller.req.query

    const parsed_page = Number.parseInt(`${page}`)
    const parsed_size = Number.parseInt(`${size}`)

    let t_page: number = isNaN(parsed_page) || parsed_page < 1 ? 1 : parsed_page

    const t_size: number = isNaN(parsed_size)
      ? SharedConfig.get('NORMAL_RETURNED_RESULT_SET') || NORMAL_RETURNED_RESULT_SET
      : parsed_size > (SharedConfig.get('RESULT_SET_MAX') || RESULT_SET_MAX)
        ? SharedConfig.get('RESULT_SET_MAX') || RESULT_SET_MAX
        : parsed_size

    let totalPages = Math.ceil(totalResults / t_size)
    totalPages < 1 && (totalPages = 1)

    while (t_size * t_page - t_size > totalResults && t_page > 1) {
      --t_page
    }

    const offset: number = totalPages == 1 ? 0 : t_size * t_page - t_size

    const results: T[] = await this.query.skip(offset).limit(t_size).clone().exec()

    const metadata: IPaginatingMetadata = {
      totalPages,

      totalResults,
      resultCount: results.length,
      currentPage: t_page,
      size: t_size,
      nextUrl: `${getCurrentUrlWithoutQueryParams(
        this.controller.req,
      )}?q=${this.parsedQueryOptions()}&page=${t_page + 1}&size=${t_size}`,
      previousUrl: `${getCurrentUrlWithoutQueryParams(
        this.controller.req,
      )}?q=${this.parsedQueryOptions()}&page=${t_page - 1}&size=${t_size}`,
      hasNext: t_page + 1 <= totalPages,
      hasPrevious: t_page > 1,
      url: getCurrentUrlWithoutQueryParams(this.controller.req),
      query: this.parsedQueryOptions(),
      nextPage: t_page + 1,
      previousPage: t_page - 1,
    }

    const data: IPaginating<T> = {
      metadata,
      results,
    }
    return data
  }
}

export default PaginatingModel
