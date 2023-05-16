export function setdefault(d: any, k: any, v: any): any {
    if (!(k in d))
        d[k] = v;
    return d[k];
}

export function keys<T extends {}>(o: T): Array<keyof T> {
    return <Array<keyof T>>Object.keys(o);
}
