import {
  ENUM_HELPER_DATE_DIFF,
  ENUM_HELPER_DATE_FORMAT,
} from '@infras/helper/constants/helper.enum.constant'

export interface IHelperDateStartAndEnd {
  month?: number
  year?: number
}

export interface IHelperDateStartAndEndDate {
  startDate: Date
  endDate: Date
}

export interface IHelperDateExtractDate {
  date: Date
  day: string
  month: string
  year: string
}

export interface IHelperDateOptionsDiff {
  format?: ENUM_HELPER_DATE_DIFF
}

export interface IHelperDateOptionsCreate {
  startOfDay?: boolean
}

export interface IHelperDateOptionsFormat {
  format?: ENUM_HELPER_DATE_FORMAT | string
}

export interface IHelperDateOptionsForward {
  fromDate?: Date
}

export type IHelperDateOptionsBackward = IHelperDateOptionsForward

export interface IHelperDateOptionsRoundDown {
  hour: boolean
  minute: boolean
  second: boolean
}
