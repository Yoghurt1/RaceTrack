import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { injectable } from 'inversify'

export interface ApiConfig {
  baseUrl: string
}

@injectable()
export class ApiClient {
  private axios: AxiosInstance

  public constructor(config: ApiConfig) {
    const requestConfig: AxiosRequestConfig = {
      baseURL: config.baseUrl
    }

    this.axios = axios.create(requestConfig)
  }

  public async route(): Promise<any> {
    return this.httpHandler<any>(() => this.axios.get('/route'))
  }

  private async httpHandler<T>(request: () => AxiosPromise<T>): Promise<T> {
    let data: T

    try {
      const response: AxiosResponse<T> = await request()
      data = response?.data
    } catch (err: any) {
      return this.handleError(err)
    }

    return data
  }

  private handleError(err: any) {
    err.status = err.response ? err.response.status : StatusCodes.INTERNAL_SERVER_ERROR
    return Promise.reject(err)
  }
}
