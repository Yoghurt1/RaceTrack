import 'reflect-metadata'
import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios'
import { StatusCodes } from 'http-status-codes'
import { injectable } from 'inversify'
import { AnalyseRequest } from '../interfaces/api/analyseRequest'
import { StopAnalysisRequest } from '../interfaces/api/stopAnalysisRequest'

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

  public async analyseEvent(analyseRequest: AnalyseRequest): Promise<void> {
    return this.httpHandler<void>(() => this.axios.post('/analyse', analyseRequest))
  }

  public async stopAnalysisEvent(stopAnalysisRequest: StopAnalysisRequest): Promise<void> {
    return this.httpHandler<void>(() => this.axios.post('/stop-analysis', stopAnalysisRequest))
  }

  public async getRecentMessages(uuid: string): Promise<(string | number)[][]> {
    return this.httpHandler<(string | number)[][]>(() => this.axios.get(`/messages/${uuid}`))
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
