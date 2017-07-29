import { filter } from 'lodash';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

    transform(array: any[], query: string, propertyName: string): any {

        if (query && propertyName) {

            query = query.toLowerCase();

            return filter(array, (item) => {

                if (typeof item[propertyName] === 'string') {

                    return item[propertyName].toLowerCase().indexOf(query) > -1;
                }
                return false;
            });
        }
        return array;
    }
}