import _ from 'lodash-es';

const hasValue = (v: unknown) => (!_.isNil(v) && v !== '');

export const required = (msg = 'El valor es requerido') => (
  (v: unknown) => hasValue(v) || msg
);

export const number = (msg = 'El valor debe ser un número') => (
  (v: unknown) => !hasValue(v) || _.isNumber(v) || msg
);

export const integer = (msg = 'El valor debe ser un número entero') => (
  (v: unknown) => !hasValue(v) || _.isInteger(v) || msg
);

export const gt = (value: number, msg = 'El valor debe ser mayor a :value') => (
  (v: unknown) => !hasValue(v) || !_.isNumber(v) || v > value || msg.replace(/:value/g, value.toString())
);

export const gte = (value: number, msg = 'El valor debe ser mayor o igual a :value') => (
  (v: unknown) => !hasValue(v) || !_.isNumber(v) || v >= value || msg.replace(/:value/g, value.toString())
);

export const lt = (value: number, msg = 'El valor debe ser menor a :value') => (
  (v: unknown) => !hasValue(v) || !_.isNumber(v) || v < value || msg.replace(/:value/g, value.toString())
);

export const lte = (value: number, msg = 'El valor debe ser menor o igual a :value') => (
  (v: unknown) => !hasValue(v) || !_.isNumber(v) || v <= value || msg.replace(/:value/g, value.toString())
);
