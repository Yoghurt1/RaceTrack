import { injectable } from 'inversify'
import { ColSpec } from '../interfaces/colSpec'

@injectable()
export class ColSpecMapper {
  public mapToColSpec(colSpec: string[][]): ColSpec[] {
    return colSpec.map((column) => {
      const colSpec: ColSpec = {
        name: column[0],
        dtype: column[1]
      }

      if (column.length === 3) {
        colSpec.description = column[2]
      }

      return colSpec
    })
  }
}
