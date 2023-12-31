/**
 * Generated by orval v6.17.0 🍺
 * Do not edit manually.
 * freeheat_test API
 * Documentation of API endpoints of freeheat_test
 * OpenAPI spec version: 1.0.0
 */
import {
  useMutation
} from '@tanstack/react-query'
import type {
  UseMutationOptions,
  MutationFunction
} from '@tanstack/react-query'
import type {
  AuthToken
} from '.././model'
import { axiosInstance } from '.././api/custom-instance';

// https://stackoverflow.com/questions/49579094/typescript-conditional-types-filter-out-readonly-properties-pick-only-requir/49579497#49579497
type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <
T,
>() => T extends Y ? 1 : 2
? A
: B;

type WritableKeys<T> = {
[P in keyof T]-?: IfEquals<
  { [Q in P]: T[P] },
  { -readonly [Q in P]: T[P] },
  P
>;
}[keyof T];

type UnionToIntersection<U> =
  (U extends any ? (k: U)=>void : never) extends ((k: infer I)=>void) ? I : never;
type DistributeReadOnlyOverUnions<T> = T extends any ? NonReadonly<T> : never;

type Writable<T> = Pick<T, WritableKeys<T>>;
type NonReadonly<T> = [T] extends [UnionToIntersection<T>] ? {
  [P in keyof Writable<T>]: T[P] extends object
    ? NonReadonly<NonNullable<T[P]>>
    : T[P];
} : DistributeReadOnlyOverUnions<T>;



// eslint-disable-next-line
  type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;

export const authTokenCreate = (
    authToken: NonReadonly<AuthToken>,
 options?: SecondParameter<typeof axiosInstance>,) => {const formUrlEncoded = new URLSearchParams();
formUrlEncoded.append('username', authToken.username)
formUrlEncoded.append('password', authToken.password)
formUrlEncoded.append('token', authToken.token)

      return axiosInstance<AuthToken>(
      {url: `/auth-token/`, method: 'post',
      headers: {'Content-Type': 'application/x-www-form-urlencoded', },
       data: formUrlEncoded
    },
      options);
    }
  


export const getAuthTokenCreateMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authTokenCreate>>, TError,{data: NonReadonly<AuthToken>}, TContext>, request?: SecondParameter<typeof axiosInstance>}
): UseMutationOptions<Awaited<ReturnType<typeof authTokenCreate>>, TError,{data: NonReadonly<AuthToken>}, TContext> => {
 const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authTokenCreate>>, {data: NonReadonly<AuthToken>}> = (props) => {
          const {data} = props ?? {};

          return  authTokenCreate(data,requestOptions)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type AuthTokenCreateMutationResult = NonNullable<Awaited<ReturnType<typeof authTokenCreate>>>
    export type AuthTokenCreateMutationBody = NonReadonly<AuthToken>
    export type AuthTokenCreateMutationError = unknown

    export const useAuthTokenCreate = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authTokenCreate>>, TError,{data: NonReadonly<AuthToken>}, TContext>, request?: SecondParameter<typeof axiosInstance>}
) => {
    
      const mutationOptions = getAuthTokenCreateMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    