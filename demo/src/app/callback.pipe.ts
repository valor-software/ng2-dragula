import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'callbackparams',
    pure: false
})
export class CallbackparamsPipe implements PipeTransform {
    public transform(items: any[], callback: (item: any, params: any) => boolean, params: any): any {
        if (!items || !callback) {
            return items;
        }
        const _params = params || {};
        return items.filter((item: any) => callback(item, _params));
    }
}
