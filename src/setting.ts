export type TackleSettingType = {
  // 何本まで並列にアクセスすることを許可するか
  threshold: number;
  maxWorkerNum: number;
}

const defaultSetting: TackleSettingType = {
  threshold: 5,
  maxWorkerNum: 3
}

export const tackleSetting = (override?: TackleSettingType): TackleSettingType => {
  return Object.assign({}, defaultSetting, override) as TackleSettingType;
}
