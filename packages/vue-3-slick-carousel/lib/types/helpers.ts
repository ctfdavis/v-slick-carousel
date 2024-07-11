export type MarkRequired<T, K extends keyof T> = T & Pick<Required<T>, K>

export type MarkRequiredWithPartialBase<T, K extends keyof T> = MarkRequired<
  Partial<T>,
  K
>

export type MarkRequiredAndPartial<
  T,
  K extends keyof T,
  P extends keyof T
> = T & Pick<Required<T>, K> & Pick<Partial<T>, P>

export type MarkRequiredAndPartialKeysWithPartialBase<
  T,
  K extends keyof T,
  P extends keyof T
> = MarkRequiredAndPartial<Partial<T>, K, P>

// Caution: Does not work with indexable types
type RequiredKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? never : K
}[keyof T]
type OptionalKeys<T> = {
  [K in keyof T]-?: object extends Pick<T, K> ? K : never
}[keyof T]
export type Combine<T1, T2> = Required<
  Pick<T1, RequiredKeys<T1>> & Pick<T2, RequiredKeys<T2>>
> &
  Partial<Pick<T1, OptionalKeys<T1>> & Pick<T2, OptionalKeys<T2>>>
