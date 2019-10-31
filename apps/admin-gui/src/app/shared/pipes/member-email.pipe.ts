import { Pipe, PipeTransform } from '@angular/core';
import {parseEmail} from '../utils';

@Pipe({
  name: 'memberEmail'
})
export class MemberEmailPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return parseEmail(value);
  }

}
