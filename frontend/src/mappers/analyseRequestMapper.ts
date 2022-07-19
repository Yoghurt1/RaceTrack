import { injectable } from 'inversify'
import { AnalyseRequest } from '../interfaces/api/analyseRequest'
import { StopAnalysisRequest } from '../interfaces/api/stopAnalysisRequest'
import { ServiceManifest } from '../interfaces/serviceManifest'

@injectable()
export class AnalyseRequestMapper {
  public mapToAnalyseRequest(manifest: ServiceManifest): AnalyseRequest {
    return {
      uuid: manifest.uuid,
      query: manifest.serviceClass
    }
  }

  public mapToStopAnalysisRequest(manifest: ServiceManifest): StopAnalysisRequest {
    return {
      uuid: manifest.uuid
    }
  }
}
