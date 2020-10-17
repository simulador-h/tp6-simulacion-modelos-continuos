import _ from 'lodash-es';

import { es } from 'helpers/locale';

// @todo extend common probability distributions
export class ProbabilityDistribution {
  public readonly type: string;
  public parameters: Record<string, number>;
  public readonly validators: Record<string, Array<(value: number) => true | string>>;

  constructor(
    type: string,
    parameters: Record<string, number> = {},
    validators: Record<string, Array<(value: number) => true | string>> = {},
  ) {
    this.type = type;
    this.parameters = _.cloneDeep(parameters);
    this.validators = validators;
  }

  getReadableParameters(locale = es): string {
    const stringParameters = _.map(
      this.parameters,
      (value, parameter) => `${locale[parameter] ?? parameter} = ${Number(value.toFixed(3))}`,
    );

    return stringParameters.join('  ~  ');
  }

  clone() {
    return new ProbabilityDistribution(this.type, this.parameters, this.validators);
  }
}
