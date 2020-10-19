import { jStat } from 'jstat';

import {
  TDistributionParameters,
  TDistributionValidators,
  ProbabilityDistribution,
} from 'models/ProbabilityDistribution';

import { required, gt } from 'helpers/validation';

export interface IPoissonParameters extends TDistributionParameters {
  rate: number
}

export interface IPoissonValidators extends TDistributionValidators {
  rate: Array<(value: number) => true | string>
}

export const defaultParameters: IPoissonParameters = {
  rate: 1,
};

export const defaultValidators: IPoissonValidators = {
  rate: [required(), gt(0)],
};

export class PoissonDistribution extends ProbabilityDistribution {
  constructor(
    parameters: IPoissonParameters = defaultParameters,
    validators: IPoissonValidators = defaultValidators,
  ) {
    const generator = jStat.poisson(parameters.rate);
    super('poisson', parameters, validators, generator);
  }
}
