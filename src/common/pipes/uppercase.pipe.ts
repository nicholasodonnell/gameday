import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class UppercasePipe implements PipeTransform {
  transform(value: unknown): string | unknown {
    if (typeof value === 'string') {
      return value.toUpperCase()
    }

    return value
  }
}
